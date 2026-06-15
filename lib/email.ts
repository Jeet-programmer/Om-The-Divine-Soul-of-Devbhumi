import { Booking } from "./types";
import { formatINR } from "./data";
import { getEmailConfig } from "./settings";
import { accessTokenFromRefresh } from "./google";

const FROM_NAME = "OM The Divine Soul of Devbhumi";

/** Low-level Gmail send via the REST API (no extra deps). */
async function sendGmail(
  accessToken: string,
  from: string,
  to: string,
  subject: string,
  html: string
): Promise<void> {
  const bodyB64 = Buffer.from(html, "utf8").toString("base64");
  const mime =
    `From: ${FROM_NAME} <${from}>\r\n` +
    `To: ${to}\r\n` +
    `Subject: ${subject}\r\n` +
    `MIME-Version: 1.0\r\n` +
    `Content-Type: text/html; charset=UTF-8\r\n` +
    `Content-Transfer-Encoding: base64\r\n\r\n` +
    bodyB64;
  const raw = Buffer.from(mime, "utf8").toString("base64url");

  const res = await fetch(
    "https://gmail.googleapis.com/gmail/v1/users/me/messages/send",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ raw }),
    }
  );
  if (!res.ok) {
    const text = await res.text();
    let friendly = `Gmail send failed: ${text}`;
    try {
      const err = JSON.parse(text).error;
      const detail = (err?.details || []).find(
        (d: { metadata?: { activationUrl?: string } }) => d?.metadata?.activationUrl
      );
      if (err?.errors?.[0]?.reason === "accessNotConfigured" || err?.status === "PERMISSION_DENIED") {
        const url =
          detail?.metadata?.activationUrl ||
          "https://console.cloud.google.com/apis/library/gmail.googleapis.com";
        friendly = `The Gmail API isn't enabled for your Google Cloud project yet. Enable it here, wait ~2 minutes, then retry: ${url}`;
      } else if (err?.message) {
        friendly = err.message;
      }
    } catch {
      /* keep raw text */
    }
    throw new Error(friendly);
  }
}

const COLORS = {
  bg: "#fbf5ea",
  ink: "#2c1b12",
  soft: "#6b5340",
  accent: "#d9772b",
  accentDark: "#c0651f",
  gold: "#c0922f",
  dark: "#2c1b12",
  cream: "#fbf0dc",
};

function row(labelTxt: string, value: string): string {
  return `<tr>
    <td style="padding:7px 0;color:${COLORS.soft};font-size:14px">${labelTxt}</td>
    <td style="padding:7px 0;color:${COLORS.ink};font-size:14px;text-align:right;font-weight:600">${value}</td>
  </tr>`;
}

function resolveBaseUrl(baseUrl?: string): string {
  return (baseUrl || process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || "").replace(/\/$/, "");
}

export function renderBookingEmail(b: Booking, baseUrl?: string): string {
  const base = resolveBaseUrl(baseUrl);
  const balance = Math.max(0, (b.total || 0) - (b.amountPaid || 0));
  const paidLabel =
    b.paymentStatus === "paid"
      ? "Paid in full"
      : b.paymentStatus === "partial"
      ? "50% advance paid"
      : "Payment pending";

  // Logo from the live site when we know the base URL; an ॐ badge otherwise.
  const logoBlock = base
    ? `<img src="${base}/assets/logo/logo.png" width="72" height="72" alt="OM" style="display:block;margin:0 auto;width:72px;height:72px;object-fit:contain;border-radius:50%;background:#fff9ee;padding:6px" />`
    : `<div style="width:72px;height:72px;margin:0 auto;border-radius:50%;background:radial-gradient(circle at 50% 35%,#fbe9c2,#f2d89b);border:2px solid #c0922f;line-height:72px;text-align:center;font-size:36px;color:#9a3318">&#2384;</div>`;

  const detailRows = [
    row("Booking reference", b.ref),
    row("Stay", b.roomName || "—"),
    b.mealPlan ? row("Meal plan", b.mealPlan) : "",
    b.checkIn ? row("Dates", `${b.checkIn}${b.checkOut ? " → " + b.checkOut : ""}`) : "",
    row("Guests", String(b.guests)),
    b.rooms ? row("Rooms", String(b.rooms)) : "",
    b.extraBeds ? row("Extra beds", String(b.extraBeds)) : "",
    b.nights ? row("Nights", String(b.nights)) : "",
    b.couponCode ? row("Coupon", `${b.couponCode} (−${formatINR(b.discount || 0)})`) : "",
  ]
    .filter(Boolean)
    .join("");

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:${COLORS.bg};font-family:Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${COLORS.bg};padding:28px 0">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:18px;overflow:hidden;box-shadow:0 10px 30px rgba(44,27,18,0.1)">

        <!-- header -->
        <tr><td style="background:linear-gradient(135deg,#e08a38,#8e3b1e);padding:32px 32px 30px;text-align:center">
          ${logoBlock}
          <div style="margin-top:14px;font-family:Georgia,serif;font-size:22px;font-weight:700;color:#fff9ee;letter-spacing:.5px">OM The Divine Soul of Devbhumi</div>
          <div style="margin-top:4px;font-size:11px;letter-spacing:.22em;text-transform:uppercase;color:rgba(255,249,238,0.85)">The Ultimate Destination Towards Divinity</div>
        </td></tr>

        <!-- intro -->
        <tr><td style="padding:32px 32px 8px">
          <h1 style="margin:0;font-family:Georgia,serif;font-size:26px;color:${COLORS.ink};font-weight:700">Your journey is reserved</h1>
          <p style="margin:12px 0 0;font-size:15px;line-height:1.65;color:${COLORS.soft}">
            Namaste ${b.name || "guest"}, thank you for booking with us. Here are your reservation details — we look forward to welcoming you to Devbhumi.
          </p>
        </td></tr>

        <!-- reference card -->
        <tr><td style="padding:20px 32px 4px">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${COLORS.bg};border:1px solid rgba(192,146,47,0.3);border-radius:14px">
            <tr><td style="padding:20px 22px">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${detailRows}</table>
            </td></tr>
          </table>
        </td></tr>

        <!-- payment -->
        <tr><td style="padding:14px 32px 4px">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:1px dashed rgba(44,27,18,0.18)">
            <tr><td style="padding-top:14px">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                ${row("Total", formatINR(b.total || 0))}
                ${row(paidLabel, formatINR(b.amountPaid || 0))}
                ${balance > 0 ? row("Balance due at property", formatINR(balance)) : ""}
              </table>
            </td></tr>
          </table>
        </td></tr>

        <!-- footer -->
        <tr><td style="padding:26px 32px 34px">
          <p style="margin:0;font-size:13.5px;line-height:1.7;color:${COLORS.soft}">
            Questions? Reply to this email, call <a href="tel:+919756615582" style="color:${COLORS.accentDark};text-decoration:none">+91 97566 15582</a>,
            or write to <a href="mailto:Omdivinesoul@gmail.com" style="color:${COLORS.accentDark};text-decoration:none">Omdivinesoul@gmail.com</a>.
          </p>
          <p style="margin:16px 0 0;font-size:12px;color:#9a8470">
            Vill. Dewar, P.O. Guptakashi, Dist. Rudraprayag, Uttarakhand — 246439
          </p>
        </td></tr>

      </table>
      <div style="max-width:560px;margin:16px auto 0;text-align:center;font-size:11px;color:#9a8470">
        &copy; 2026 OM The Divine Soul of Devbhumi Pvt. Ltd. · Spiritual Eco-Tourism, Devbhumi
      </div>
    </td></tr>
  </table>
</body>
</html>`;
}

/** Send the confirmation email for a booking. Returns false (silently) if no
 *  Google account is connected, so booking creation never fails on email. */
export async function sendBookingConfirmation(b: Booking, baseUrl?: string): Promise<boolean> {
  if (!b.email) return false;
  const config = await getEmailConfig();
  if (!config) return false;
  const accessToken = await accessTokenFromRefresh(config.refreshToken);
  const subject = `Your reservation is confirmed - OM (${b.ref})`;
  await sendGmail(accessToken, config.email, b.email, subject, renderBookingEmail(b, baseUrl));
  return true;
}

/** A sample email for the admin "send test" button. */
export async function sendTestEmail(to: string, baseUrl?: string): Promise<void> {
  const config = await getEmailConfig();
  if (!config) throw new Error("No Google account connected.");
  const accessToken = await accessTokenFromRefresh(config.refreshToken);
  const sample: Booking = {
    _id: "test",
    ref: "OM-TEST1",
    category: "stay",
    roomSlug: "glass",
    roomName: "Glass-View Cottage",
    checkIn: "2026-07-01",
    checkOut: "2026-07-03",
    guests: 2,
    rooms: 1,
    extraBeds: 0,
    extraBedPrice: 0,
    nights: 2,
    discount: 0,
    total: 13000,
    name: "Test Guest",
    email: to,
    phone: "",
    status: "pending",
    paymentStatus: "paid",
    paymentType: "full",
    amountPaid: 13000,
    createdAt: new Date().toISOString(),
  };
  await sendGmail(
    accessToken,
    config.email,
    to,
    "Test email - OM The Divine Soul of Devbhumi",
    renderBookingEmail(sample, baseUrl)
  );
}
