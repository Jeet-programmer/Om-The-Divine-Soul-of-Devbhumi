import { NextResponse } from "next/server";
import { getBookingById } from "@/lib/bookings";
import { getEmailConfig } from "@/lib/settings";
import { sendBookingConfirmation } from "@/lib/email";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Admin-only (enforced by middleware on /api/bookings/*).
export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const booking = await getBookingById(id);
    if (!booking) return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    if (!booking.email) {
      return NextResponse.json({ error: "This booking has no email address." }, { status: 400 });
    }
    const config = await getEmailConfig();
    if (!config) {
      return NextResponse.json(
        { error: "No Google account connected. Connect one in the Email tab first." },
        { status: 400 }
      );
    }
    await sendBookingConfirmation(booking, new URL(req.url).origin);
    return NextResponse.json({ ok: true, sentTo: booking.email });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
