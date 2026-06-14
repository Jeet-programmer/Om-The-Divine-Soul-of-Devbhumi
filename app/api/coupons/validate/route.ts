import { NextResponse } from "next/server";
import { validateCoupon } from "@/lib/coupons";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Public — guests apply a coupon during booking.
export async function POST(req: Request) {
  try {
    const { code, amount } = await req.json();
    const result = await validateCoupon(code, Number(amount) || 0);
    return NextResponse.json(result);
  } catch (e) {
    return NextResponse.json({ valid: false, message: (e as Error).message, discount: 0 }, { status: 500 });
  }
}
