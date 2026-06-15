import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE, ADMIN_TOKEN } from "@/lib/auth";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const authed = req.cookies.get(ADMIN_COOKIE)?.value === ADMIN_TOKEN;

  // ---- Admin UI ----
  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    if (pathname === "/admin/login") {
      // already signed in → skip the login page
      return authed ? NextResponse.redirect(new URL("/admin", req.url)) : NextResponse.next();
    }
    if (!authed) {
      const url = new URL("/admin/login", req.url);
      url.searchParams.set("from", pathname);
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  // ---- Admin APIs ----
  // Guests must be able to do these without logging in.
  const publicPost =
    (pathname === "/api/bookings" && req.method === "POST") ||
    (pathname === "/api/coupons/validate" && req.method === "POST") ||
    (pathname === "/api/gallery" && req.method === "GET");
  if (publicPost) {
    return NextResponse.next();
  }
  // Everything else under these prefixes is admin-only.
  if (
    pathname.startsWith("/api/rooms") ||
    pathname.startsWith("/api/bookings") ||
    pathname.startsWith("/api/coupons") ||
    pathname.startsWith("/api/gallery") ||
    pathname === "/api/upload"
  ) {
    if (!authed) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin",
    "/admin/:path*",
    "/api/rooms/:path*",
    "/api/bookings/:path*",
    "/api/coupons/:path*",
    "/api/gallery/:path*",
    "/api/upload",
  ],
};
