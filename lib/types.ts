export type Category = "stay" | "retreat";

export interface Room {
  _id: string;
  slug: string;
  name: string;
  category: Category;
  price: number;
  /** retreats only — fixed length in nights */
  nights?: number;
  tags: string[];
  blurb: string;
  /** public paths (e.g. /assets/stays/glass.jpg) or absolute URLs */
  images: string[];
  /** total physical units / retreat seats */
  quantity: number;
  /** units currently available to book */
  available: number;
  /** guests one unit/room sleeps (drives how many rooms a party needs) */
  capacity: number;
  /** whether an extra bed can be added to this room type */
  extraBedAllowed: boolean;
  /** price per extra bed, per night */
  extraBedPrice: number;
  /** shown on the public site when true */
  active: boolean;
  order?: number;
}

export type BookingStatus = "pending" | "confirmed" | "cancelled";
export type PaymentStatus = "unpaid" | "partial" | "paid";
export type PaymentType = "full" | "partial";

export type CouponType = "percent" | "fixed";

export interface Coupon {
  _id: string;
  code: string;
  type: CouponType;
  /** percent (0-100) or fixed ₹ amount */
  value: number;
  active: boolean;
  /** minimum order total required to apply (0 = none) */
  minAmount: number;
  /** cap on discount for percent coupons (0 = no cap) */
  maxDiscount: number;
  /** total redemptions allowed (0 = unlimited) */
  usageLimit: number;
  usedCount: number;
  /** ISO date; empty = never expires */
  expiresAt?: string;
  createdAt: string;
}

export interface Booking {
  _id: string;
  ref: string;
  category: Category;
  roomSlug: string;
  roomName: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  /** rooms reserved (stays); 0 for retreats */
  rooms: number;
  extraBeds: number;
  extraBedPrice: number;
  nights: number;
  total: number;
  name: string;
  email: string;
  phone: string;
  notes?: string;
  couponCode?: string;
  discount: number;
  status: BookingStatus;
  /** payment */
  paymentStatus: PaymentStatus;
  paymentType?: PaymentType;
  amountPaid: number;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  createdAt: string;
}
