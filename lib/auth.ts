/**
 * Admin authentication — credentials and the opaque session token.
 *
 * IMPORTANT: only import this from server code (middleware + route handlers).
 * Never import it into a client component, or the password would ship to the
 * browser. The login form posts the email/password to /api/admin/login, which
 * validates here on the server and sets an httpOnly cookie holding ADMIN_TOKEN
 * (not the password).
 */
export const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "omdivinesoul@gmail.com";
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "Tarabaam";

export const ADMIN_COOKIE = "om_admin_session";
/** Opaque value stored in the cookie when authenticated. */
export const ADMIN_TOKEN =
  process.env.ADMIN_SESSION_SECRET || "om-divine-soul-7f3a9c1e8b4d2a6f-admin";

/** True if the request carries a valid admin session cookie. */
export function isAuthedRequest(req: Request): boolean {
  const cookie = req.headers.get("cookie") || "";
  const m = cookie.match(new RegExp(`${ADMIN_COOKIE}=([^;]+)`));
  return m?.[1] === ADMIN_TOKEN;
}

export function validateAdmin(email: unknown, password: unknown): boolean {
  return (
    typeof email === "string" &&
    typeof password === "string" &&
    email.trim().toLowerCase() === ADMIN_EMAIL.toLowerCase() &&
    password === ADMIN_PASSWORD
  );
}
