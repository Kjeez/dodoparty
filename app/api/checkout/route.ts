import { NextResponse } from "next/server";
import DodoPayments from "dodopayments";

const client = new DodoPayments({
  bearerToken: process.env.DODO_API_KEY,
  environment: "test_mode",
});

export async function POST(req: Request) {
  try {
    const { packageId, price, name } = await req.json();

    if (!packageId || !price || !name) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const amountInCents = Math.round(price * 100);
    const productName = `Party Booking: ${name}`;

    // Try to find the existing product
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
      console.error("Error listing products:", e);
    }

    // Create product if it doesn't exist
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

    const session = await client.checkoutSessions.create({
      product_cart: [
        {
          product_id: productId,
          quantity: 1,
        },
      ],
      return_url: `http://localhost:3000/success?package=${packageId}`,
    });

    return NextResponse.json({ url: session.checkout_url });
  } catch (error) {
    console.error("Dodo Payments Error:", error);
    return NextResponse.json(
      { error: "Failed to create payment session" },
      { status: 500 }
    );
  }
}
