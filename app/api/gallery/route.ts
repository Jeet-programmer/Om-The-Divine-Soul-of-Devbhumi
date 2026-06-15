import { NextResponse } from "next/server";
import { addGalleryImage, listGallery } from "@/lib/gallery";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    return NextResponse.json(await listGallery());
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const src = (body?.src || "").trim();
    if (!src) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }
    return NextResponse.json(await addGalleryImage(src, (body?.caption || "").trim()));
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
