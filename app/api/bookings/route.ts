import { NextResponse } from "next/server";
import { createBooking, listBookings } from "@/lib/bookings";
import { adjustAvailabilityBySlug } from "@/lib/rooms";

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
    const booking = await createBooking(body);
    // best-effort: decrement availability for the booked offering
    if (booking.roomSlug) {
      await adjustAvailabilityBySlug(booking.roomSlug, -1).catch(() => {});
    }
    return NextResponse.json(booking);
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
