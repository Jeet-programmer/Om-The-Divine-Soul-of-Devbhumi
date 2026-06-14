import { NextResponse } from "next/server";
import { createBooking, listBookings } from "@/lib/bookings";
import { adjustAvailabilityBySlug } from "@/lib/rooms";
import { verifySignature } from "@/lib/razorpay";
import { PaymentStatus, PaymentType } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    return NextResponse.json(await listBookings());
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // payment: verify the Razorpay signature before recording the booking
    let paymentStatus: PaymentStatus = "unpaid";
    let paymentType: PaymentType | undefined;
    let amountPaid = 0;
    let razorpayOrderId: string | undefined;
    let razorpayPaymentId: string | undefined;

    const pay = body.payment;
    if (pay && pay.paymentId) {
      if (!verifySignature(pay.orderId, pay.paymentId, pay.signature)) {
        return NextResponse.json({ error: "Payment verification failed" }, { status: 400 });
      }
      paymentType = pay.type === "partial" ? "partial" : "full";
      paymentStatus = paymentType === "full" ? "paid" : "partial";
      amountPaid = Number(pay.amountPaid) || 0;
      razorpayOrderId = pay.orderId;
      razorpayPaymentId = pay.paymentId;
    }

    const booking = await createBooking({
      ...body,
      paymentStatus,
      paymentType,
      amountPaid,
      razorpayOrderId,
      razorpayPaymentId,
    });

    // best-effort: decrement availability — rooms for stays, seats(guests) for retreats
    if (booking.roomSlug) {
      const units =
        booking.category === "stay" ? booking.rooms || 1 : booking.guests || 1;
      await adjustAvailabilityBySlug(booking.roomSlug, -units).catch(() => {});
    }
    return NextResponse.json(booking);
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
