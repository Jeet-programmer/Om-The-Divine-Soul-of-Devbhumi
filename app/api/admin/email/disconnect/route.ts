import { NextResponse } from "next/server";
import { isAuthedRequest } from "@/lib/auth";
import { clearEmailConfig } from "@/lib/settings";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  if (!isAuthedRequest(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await clearEmailConfig();
  return NextResponse.json({ ok: true });
}
