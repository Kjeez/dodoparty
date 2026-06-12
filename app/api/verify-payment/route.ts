import { NextResponse } from "next/server";
import DodoPayments from "dodopayments";
import { supabaseAdmin } from "@/lib/supabase-admin";

const client = new DodoPayments({
  bearerToken: process.env.DODO_API_KEY,
  environment: "test_mode",
});

export async function POST(req: Request) {
  try {
    const { orderId, paymentId } = await req.json();

    if (!orderId || !paymentId) {
      return NextResponse.json(
        { error: "Missing orderId or paymentId" },
        { status: 400 }
      );
    }

    // 1. Check current order status in our DB
    const { data: order, error: orderError } = await supabaseAdmin
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .single();

    if (orderError || !order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // If already paid, just return the order
    if (order.status === "paid") {
      return NextResponse.json({ order, verified: true });
    }

    // 2. Check payment status directly with Dodo Payments API
    let paymentStatus: string;
    try {
      const payment = await client.payments.retrieve(paymentId);
      paymentStatus = (payment as unknown as Record<string, string>).status || "";
      console.log(`Dodo payment status for ${paymentId}:`, paymentStatus);
    } catch (err) {
      console.error("Error fetching payment from Dodo:", err);
      return NextResponse.json(
        { order, verified: false, error: "Could not verify with payment provider" },
        { status: 200 }
      );
    }

    // 3. Map Dodo status to our status
    let newStatus: string | null = null;
    if (paymentStatus === "succeeded" || paymentStatus === "completed") {
      newStatus = "paid";
    } else if (paymentStatus === "failed") {
      newStatus = "failed";
    } else if (paymentStatus === "cancelled" || paymentStatus === "refunded") {
      newStatus = "cancelled";
    }

    // 4. Update order if status changed
    if (newStatus && newStatus !== order.status) {
      const { data: updatedOrder, error: updateError } = await supabaseAdmin
        .from("orders")
        .update({
          status: newStatus,
          dodo_payment_id: paymentId,
          webhook_received_at: new Date().toISOString(),
        })
        .eq("id", orderId)
        .select()
        .single();

      if (updateError) {
        console.error("Error updating order:", updateError);
        return NextResponse.json(
          { order, verified: false, error: "Failed to update order" },
          { status: 500 }
        );
      }

      return NextResponse.json({ order: updatedOrder, verified: true });
    }

    return NextResponse.json({ order, verified: false, paymentStatus });
  } catch (error) {
    console.error("Verify payment error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
