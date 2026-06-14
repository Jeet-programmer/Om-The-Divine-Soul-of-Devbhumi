import { NextResponse } from "next/server";
import { createOrder, razorpayConfigured, RZP_KEY_ID } from "@/lib/razorpay";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Public — guests create a payment order before checkout.
export async function POST(req: Request) {
  try {
    if (!razorpayConfigured()) {
      return NextResponse.json(
        { error: "Online payments are not configured. Please contact us to book." },
        { status: 503 }
      );
    }
    const { amount } = await req.json(); // amount in rupees
    const paise = Math.round(Number(amount) * 100);
    if (!paise || paise < 100) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }
    const order = await createOrder(paise, `om-${Date.now()}`);
    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: RZP_KEY_ID,
    });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
