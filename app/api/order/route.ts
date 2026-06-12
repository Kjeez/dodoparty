import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const orderId = searchParams.get("orderId");
  const firebaseUid = searchParams.get("firebaseUid");

  // Fetch single order by ID
  if (orderId) {
    const { data, error } = await supabaseAdmin
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .single();

    if (error) {
      console.error("Error fetching order:", error);
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ order: data });
  }

  // Fetch all orders for a user
  if (firebaseUid) {
    const { data, error } = await supabaseAdmin
      .from("orders")
      .select("*")
      .eq("firebase_uid", firebaseUid)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching orders:", error);
      return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
    }

    return NextResponse.json({ orders: data });
  }

  return NextResponse.json({ error: "Missing orderId or firebaseUid" }, { status: 400 });
}
