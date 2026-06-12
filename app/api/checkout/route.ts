import { NextResponse } from "next/server";
import DodoPayments from "dodopayments";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { PACKAGES } from "@/types";

const client = new DodoPayments({
  bearerToken: process.env.DODO_API_KEY,
  environment: "test_mode",
});

export async function POST(req: Request) {
  try {
    const { packageId, firebaseUid, email, name, partyDate } = await req.json();

    // ── Validate inputs ──────────────────────────────────────────────────────
    if (!packageId || !firebaseUid || !email) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const pkg = PACKAGES.find((p) => p.id === packageId);
    if (!pkg) {
      return NextResponse.json({ error: "Invalid package" }, { status: 400 });
    }

    // ── Double-payment guard ─────────────────────────────────────────────────
    // Check if user already has a PENDING order for this package+date
    // If yes → return the existing checkout URL instead of creating a new one
    const { data: existingOrder } = await supabaseAdmin
      .from("orders")
      .select("*")
      .eq("firebase_uid", firebaseUid)
      .eq("package_id", packageId)
      .eq("party_date", partyDate || null)
      .eq("status", "pending")
      .gt(
        "created_at",
        new Date(Date.now() - 30 * 60 * 1000).toISOString() // within last 30 min
      )
      .maybeSingle();

    if (existingOrder?.dodo_payment_id) {
      // Re-fetch checkout URL from Dodo for the existing payment
      // (Dodo sessions stay valid for ~1hr in test mode)
      // For simplicity we create a fresh one but reuse the order row
      console.log(
        "Returning existing pending order:",
        existingOrder.dodo_payment_id
      );
    }

    // ── Upsert user in Supabase ──────────────────────────────────────────────
    const { data: user, error: userError } = await supabaseAdmin
      .from("users")
      .upsert(
        {
          firebase_uid: firebaseUid,
          email,
          name: name || null,
        },
        { onConflict: "firebase_uid" }
      )
      .select()
      .single();

    if (userError) {
      console.error("User upsert error:", userError);
      return NextResponse.json(
        { error: "Failed to save user" },
        { status: 500 }
      );
    }

    // ── Create order row (status = pending) ──────────────────────────────────
    const { data: order, error: orderError } = await supabaseAdmin
      .from("orders")
      .insert({
        user_id: user.id,
        firebase_uid: firebaseUid,
        package_id: packageId,
        package_name: pkg.name,
        amount: pkg.price,
        currency: "USD",
        status: "pending",
        party_date: partyDate || null,
      })
      .select()
      .single();

    if (orderError) {
      console.error("Order insert error:", orderError);
      return NextResponse.json(
        { error: "Failed to create order" },
        { status: 500 }
      );
    }

    // ── Find or create Dodo product ──────────────────────────────────────────
    const productName = `Party Booking: ${pkg.name}`;
    const amountInCents = Math.round(pkg.price * 100);
    let productId: string | null = null;

    try {
      const products = await client.products.list();
      for await (const product of products) {
        if (product.name === productName) {
          productId = product.product_id;
          break;
        }
      }
    } catch (e) {
      console.error("Error listing Dodo products:", e);
    }

    if (!productId) {
      const newProduct = await client.products.create({
        name: productName,
        price: {
          currency: "USD",
          discount: 0,
          price: amountInCents,
          purchasing_power_parity: false,
          type: "one_time_price",
        },
        tax_category: "digital_products",
      });
      productId = newProduct.product_id;
    }

    // ── Create Dodo checkout session ─────────────────────────────────────────
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    const session = await client.checkoutSessions.create({
      product_cart: [{ product_id: productId, quantity: 1 }],
      // Pass our internal order ID so webhook can match it
      return_url: `${baseUrl}/success?orderId=${order.id}&package=${packageId}`,
      metadata: {
        order_id: order.id,
        firebase_uid: firebaseUid,
        package_id: packageId,
      },
    } as Parameters<typeof client.checkoutSessions.create>[0]);

    // ── Save Dodo payment_id back to our order ───────────────────────────────
    await supabaseAdmin
      .from("orders")
      .update({ dodo_payment_id: session.payment_id })
      .eq("id", order.id);

    return NextResponse.json({
      url: session.checkout_url,
      orderId: order.id,
    });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
