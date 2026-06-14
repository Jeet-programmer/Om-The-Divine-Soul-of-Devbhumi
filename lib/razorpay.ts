import crypto from "crypto";

// keys come from .env — keep the secret server-side only
export const RZP_KEY_ID =
  process.env.Live_API_Key || process.env.RAZORPAY_KEY_ID || "";
const RZP_KEY_SECRET =
  process.env.Live_Key_Secret || process.env.RAZORPAY_KEY_SECRET || "";

export function razorpayConfigured(): boolean {
  return Boolean(RZP_KEY_ID && RZP_KEY_SECRET);
}

interface RazorpayOrder {
  id: string;
  amount: number;
  currency: string;
}

/** Create a Razorpay order (amount in paise) via the REST API. */
export async function createOrder(
  amountPaise: number,
  receipt: string
): Promise<RazorpayOrder> {
  const auth = Buffer.from(`${RZP_KEY_ID}:${RZP_KEY_SECRET}`).toString("base64");
  const res = await fetch("https://api.razorpay.com/v1/orders", {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      amount: amountPaise,
      currency: "INR",
      receipt,
      payment_capture: 1,
    }),
  });
  if (!res.ok) {
    throw new Error(`Razorpay order failed: ${await res.text()}`);
  }
  return res.json();
}

/** Verify the checkout signature: HMAC_SHA256(order_id|payment_id, secret). */
export function verifySignature(
  orderId: string,
  paymentId: string,
  signature: string
): boolean {
  if (!orderId || !paymentId || !signature) return false;
  const expected = crypto
    .createHmac("sha256", RZP_KEY_SECRET)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");
  const a = Buffer.from(expected);
  const b = Buffer.from(signature);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}
