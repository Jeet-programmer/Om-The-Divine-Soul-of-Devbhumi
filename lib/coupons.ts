import { ObjectId, WithId, Document } from "mongodb";
import { getDb } from "./db";
import { Coupon, CouponType } from "./types";

const COLL = "coupons";

function serialize(doc: WithId<Document>): Coupon {
  const { _id, ...rest } = doc;
  return { _id: _id.toString(), ...(rest as Omit<Coupon, "_id">) };
}

/** Discount in ₹ for a given order amount, clamped to the amount. */
export function discountFor(
  coupon: Pick<Coupon, "type" | "value" | "maxDiscount">,
  amount: number
): number {
  let d =
    coupon.type === "percent"
      ? Math.round((amount * coupon.value) / 100)
      : coupon.value;
  if (coupon.type === "percent" && coupon.maxDiscount > 0) {
    d = Math.min(d, coupon.maxDiscount);
  }
  return Math.max(0, Math.min(d, amount));
}

export async function listCoupons(): Promise<Coupon[]> {
  const db = await getDb();
  const docs = await db.collection(COLL).find().sort({ createdAt: -1 }).toArray();
  return docs.map(serialize);
}

export async function createCoupon(data: Partial<Coupon>): Promise<Coupon> {
  const db = await getDb();
  const doc = {
    code: (data.code || "").trim().toUpperCase() || "CODE" + Math.random().toString(36).slice(2, 6).toUpperCase(),
    type: (data.type as CouponType) || "percent",
    value: Number(data.value) || 0,
    active: data.active !== false,
    minAmount: Number(data.minAmount) || 0,
    maxDiscount: Number(data.maxDiscount) || 0,
    usageLimit: Number(data.usageLimit) || 0,
    usedCount: 0,
    expiresAt: data.expiresAt || "",
    createdAt: new Date().toISOString(),
  };
  const res = await db.collection(COLL).insertOne(doc);
  return serialize({ _id: res.insertedId, ...doc });
}

const EDITABLE: (keyof Coupon)[] = [
  "code",
  "type",
  "value",
  "active",
  "minAmount",
  "maxDiscount",
  "usageLimit",
  "expiresAt",
];
const NUMERIC: (keyof Coupon)[] = ["value", "minAmount", "maxDiscount", "usageLimit"];

export async function updateCoupon(id: string, patch: Partial<Coupon>): Promise<Coupon | null> {
  const db = await getDb();
  const set: Record<string, unknown> = {};
  for (const key of EDITABLE) {
    if (key in patch) {
      let v: unknown = patch[key];
      if (NUMERIC.includes(key)) v = Number(v);
      if (key === "code" && typeof v === "string") v = v.trim().toUpperCase();
      set[key] = v;
    }
  }
  const _id = new ObjectId(id);
  await db.collection(COLL).updateOne({ _id }, { $set: set });
  const doc = await db.collection(COLL).findOne({ _id });
  return doc ? serialize(doc) : null;
}

export async function deleteCoupon(id: string): Promise<void> {
  const db = await getDb();
  await db.collection(COLL).deleteOne({ _id: new ObjectId(id) });
}

export interface CouponValidation {
  valid: boolean;
  message: string;
  discount: number;
  code?: string;
  type?: CouponType;
  value?: number;
  maxDiscount?: number;
  minAmount?: number;
}

export async function validateCoupon(
  rawCode: string,
  amount: number
): Promise<CouponValidation> {
  const code = (rawCode || "").trim().toUpperCase();
  if (!code) return { valid: false, message: "Enter a coupon code.", discount: 0 };
  const db = await getDb();
  const doc = await db.collection(COLL).findOne({ code });
  if (!doc) return { valid: false, message: "That code isn’t valid.", discount: 0 };
  const coupon = serialize(doc);

  if (!coupon.active) return { valid: false, message: "This coupon is no longer active.", discount: 0 };
  if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
    return { valid: false, message: "This coupon has expired.", discount: 0 };
  }
  if (coupon.usageLimit > 0 && coupon.usedCount >= coupon.usageLimit) {
    return { valid: false, message: "This coupon has been fully redeemed.", discount: 0 };
  }
  if (coupon.minAmount > 0 && amount < coupon.minAmount) {
    return {
      valid: false,
      message: `Minimum order of ₹${coupon.minAmount.toLocaleString("en-IN")} required.`,
      discount: 0,
    };
  }
  const discount = discountFor(coupon, amount);
  if (discount <= 0) return { valid: false, message: "This coupon gives no discount here.", discount: 0 };
  return {
    valid: true,
    message:
      coupon.type === "percent"
        ? `${coupon.value}% off applied`
        : `₹${coupon.value.toLocaleString("en-IN")} off applied`,
    discount,
    code: coupon.code,
    type: coupon.type,
    value: coupon.value,
    maxDiscount: coupon.maxDiscount,
    minAmount: coupon.minAmount,
  };
}

export async function incrementCouponUsage(rawCode: string): Promise<void> {
  const code = (rawCode || "").trim().toUpperCase();
  if (!code) return;
  const db = await getDb();
  await db.collection(COLL).updateOne({ code }, { $inc: { usedCount: 1 } });
}
