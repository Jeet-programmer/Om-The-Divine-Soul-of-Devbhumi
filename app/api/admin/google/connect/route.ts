import { NextResponse } from "next/server";
import crypto from "crypto";
import { isAuthedRequest } from "@/lib/auth";
import { buildAuthUrl, googleConfigured } from "@/lib/google";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  if (!isAuthedRequest(req)) {
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }
  if (!googleConfigured()) {
    return NextResponse.redirect(new URL("/admin?email=notconfigured", req.url));
  }
  const origin = new URL(req.url).origin;
  const state = crypto.randomBytes(16).toString("hex");
  const res = NextResponse.redirect(buildAuthUrl(origin, state));
  res.cookies.set("om_oauth_state", state, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 600,
  });
  return res;
}
