import { NextResponse } from "next/server";
import { Webhook } from "standardwebhooks";
import { supabaseAdmin } from "@/lib/supabase-admin";

// Dodo sends webhooks signed with this secret
// Get it from: Dodo Dashboard → Developer → Webhooks → your endpoint secret
const webhookSecret = process.env.DODO_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  // ── 1. Read raw body (needed for signature verification) ──────────────────
  const rawBody = await req.text();
  const headers = Object.fromEntries(req.headers.entries());

  // ── 2. Verify webhook signature ───────────────────────────────────────────
  let payload: Record<string, unknown>;
  try {
    const wh = new Webhook(webhookSecret);
    payload = wh.verify(rawBody, headers) as Record<string, unknown>;
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    // Log failed attempt
    await supabaseAdmin.from("webhook_logs").insert({
      event_type: "SIGNATURE_FAILED",
      payload: { raw: rawBody.slice(0, 500) },
      processed: false,
      error: String(err),
    });
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const eventType = payload.type as string;
  const data = payload.data as Record<string, unknown>;

  // ── 3. Log webhook ────────────────────────────────────────────────────────
  const paymentId =
    (data?.payment_id as string) ||
    (data?.id as string) ||
    null;

  await supabaseAdmin.from("webhook_logs").insert({
    event_type: eventType,
    dodo_payment_id: paymentId,
    payload: payload as Record<string, unknown>,
    processed: false,
  });

  // ── 4. Handle event types ─────────────────────────────────────────────────
  try {
    switch (eventType) {
      // Payment completed successfully
      case "payment.succeeded":
      case "payment.completed": {
        if (!paymentId) break;

        const { error } = await supabaseAdmin
          .from("orders")
          .update({
            status: "paid",
            webhook_received_at: new Date().toISOString(),
          })
          .eq("dodo_payment_id", paymentId)
          .eq("status", "pending"); // Only update if still pending (idempotency)

        if (error) throw error;

        // Mark log as processed
        await supabaseAdmin
          .from("webhook_logs")
          .update({ processed: true })
          .eq("dodo_payment_id", paymentId)
          .eq("event_type", eventType);

        console.log(`✅ Payment succeeded: ${paymentId}`);
        break;
      }

      // Payment failed
      case "payment.failed": {
        if (!paymentId) break;

        const { error } = await supabaseAdmin
          .from("orders")
          .update({
            status: "failed",
            webhook_received_at: new Date().toISOString(),
          })
          .eq("dodo_payment_id", paymentId)
          .eq("status", "pending");

        if (error) throw error;

        await supabaseAdmin
          .from("webhook_logs")
          .update({ processed: true })
          .eq("dodo_payment_id", paymentId)
          .eq("event_type", eventType);

        console.log(`❌ Payment failed: ${paymentId}`);
        break;
      }

      // Payment cancelled / refunded
      case "payment.cancelled":
      case "refund.succeeded": {
        if (!paymentId) break;

        await supabaseAdmin
          .from("orders")
          .update({
            status: "cancelled",
            webhook_received_at: new Date().toISOString(),
          })
          .eq("dodo_payment_id", paymentId);

        await supabaseAdmin
          .from("webhook_logs")
          .update({ processed: true })
          .eq("dodo_payment_id", paymentId)
          .eq("event_type", eventType);

        console.log(`🔄 Payment cancelled/refunded: ${paymentId}`);
        break;
      }

      default:
        console.log(`Unhandled webhook event: ${eventType}`);
    }
  } catch (err) {
    console.error("Webhook processing error:", err);
    await supabaseAdmin
      .from("webhook_logs")
      .update({ error: String(err) })
      .eq("dodo_payment_id", paymentId)
      .eq("event_type", eventType);

    // Return 500 so Dodo retries the webhook
    return NextResponse.json(
      { error: "Processing failed" },
      { status: 500 }
    );
  }

  // Return 200 to acknowledge receipt
  return NextResponse.json({ received: true });
}
