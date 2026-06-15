import { ObjectId, WithId, Document } from "mongodb";
import { getDb } from "./db";
import { Booking, BookingStatus } from "./types";

const COLL = "bookings";

function serialize(doc: WithId<Document>): Booking {
  const { _id, ...rest } = doc;
  return { _id: _id.toString(), ...(rest as Omit<Booking, "_id">) };
}

export async function listBookings(): Promise<Booking[]> {
  const db = await getDb();
  const docs = await db.collection(COLL).find().sort({ createdAt: -1 }).toArray();
  return docs.map(serialize);
}

export async function getBookingById(id: string): Promise<Booking | null> {
  const db = await getDb();
  const doc = await db.collection(COLL).findOne({ _id: new ObjectId(id) });
  return doc ? serialize(doc) : null;
}

export async function createBooking(data: Partial<Booking>): Promise<Booking> {
  const db = await getDb();
  const doc = {
    ref: data.ref || "OM-" + Math.random().toString(36).slice(2, 7).toUpperCase(),
    category: data.category || "stay",
    roomSlug: data.roomSlug || "",
    roomName: data.roomName || "",
    checkIn: data.checkIn || "",
    checkOut: data.checkOut || "",
    guests: Number(data.guests) || 1,
    rooms: Number(data.rooms) || 0,
    extraBeds: Number(data.extraBeds) || 0,
    extraBedPrice: Number(data.extraBedPrice) || 0,
    nights: Number(data.nights) || 0,
    total: Number(data.total) || 0,
    name: data.name || "",
    email: data.email || "",
    phone: data.phone || "",
    notes: data.notes || "",
    ...(data.mealPlan ? { mealPlan: data.mealPlan } : {}),
    ...(data.couponCode ? { couponCode: data.couponCode } : {}),
    discount: Number(data.discount) || 0,
    status: "pending" as BookingStatus,
    paymentStatus: data.paymentStatus || "unpaid",
    ...(data.paymentType ? { paymentType: data.paymentType } : {}),
    amountPaid: Number(data.amountPaid) || 0,
    ...(data.razorpayOrderId ? { razorpayOrderId: data.razorpayOrderId } : {}),
    ...(data.razorpayPaymentId ? { razorpayPaymentId: data.razorpayPaymentId } : {}),
    createdAt: new Date().toISOString(),
  };
  const res = await db.collection(COLL).insertOne(doc);
  return serialize({ _id: res.insertedId, ...doc });
}

export async function updateBookingStatus(
  id: string,
  status: BookingStatus
): Promise<Booking | null> {
  const db = await getDb();
  const _id = new ObjectId(id);
  await db.collection(COLL).updateOne({ _id }, { $set: { status } });
  const doc = await db.collection(COLL).findOne({ _id });
  return doc ? serialize(doc) : null;
}

export async function deleteBooking(id: string): Promise<void> {
  const db = await getDb();
  await db.collection(COLL).deleteOne({ _id: new ObjectId(id) });
}
