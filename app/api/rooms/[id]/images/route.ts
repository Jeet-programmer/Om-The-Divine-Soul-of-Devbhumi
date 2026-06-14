import { NextResponse } from "next/server";
import { addRoomImage, removeRoomImage } from "@/lib/rooms";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { image } = await req.json();
    if (!image) return NextResponse.json({ error: "image is required" }, { status: 400 });
    const room = await addRoomImage(id, image);
    if (!room) return NextResponse.json({ error: "Room not found" }, { status: 404 });
    return NextResponse.json(room);
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const image = new URL(req.url).searchParams.get("image");
    if (!image) return NextResponse.json({ error: "image query param required" }, { status: 400 });
    const room = await removeRoomImage(id, image);
    if (!room) return NextResponse.json({ error: "Room not found" }, { status: 404 });
    return NextResponse.json(room);
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
