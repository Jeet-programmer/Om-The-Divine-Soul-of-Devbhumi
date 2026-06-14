import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { isAuthedRequest } from "@/lib/auth";
import { exchangeCode, getUserEmail } from "@/lib/google";
import { saveEmailConfig } from "@/lib/settings";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const back = (req: Request, status: string) =>
  NextResponse.redirect(new URL(`/admin?email=${status}`, req.url));

export async function GET(req: Request) {
  if (!isAuthedRequest(req)) {
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");

  const jar = await cookies();
  const savedState = jar.get("om_oauth_state")?.value;
  if (!code || !state || state !== savedState) {
    return back(req, "error");
  }

  try {
    const tokens = await exchangeCode(code, url.origin);
    if (!tokens.access_token) return back(req, "error");
    if (!tokens.refresh_token) {
      // Google only returns a refresh token on first consent — force re-consent
      return back(req, "norefresh");
    }
    const emailAddr = await getUserEmail(tokens.access_token);
    await saveEmailConfig(emailAddr, tokens.refresh_token);
    const res = back(req, "connected");
    res.cookies.set("om_oauth_state", "", { path: "/", maxAge: 0 });
    return res;
  } catch {
    return back(req, "error");
  }
}
