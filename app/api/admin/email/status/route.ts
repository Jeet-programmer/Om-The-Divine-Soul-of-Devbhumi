import { NextResponse } from "next/server";
import { isAuthedRequest } from "@/lib/auth";
import { getEmailConfig } from "@/lib/settings";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  if (!isAuthedRequest(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const config = await getEmailConfig();
    return NextResponse.json({ connected: !!config, email: config?.email || null });
  } catch (e) {
    return NextResponse.json({ connected: false, error: (e as Error).message });
  }
}
