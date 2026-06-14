import { ObjectId, WithId, Document } from "mongodb";
import { getDb } from "./db";
import { DEFAULT_QUANTITY, RETREATS, STAYS } from "./data";
import { Category, Room } from "./types";

const COLL = "rooms";

function serialize(doc: WithId<Document>): Room {
  const { _id, ...rest } = doc;
  return { _id: _id.toString(), ...(rest as Omit<Room, "_id">) };
}

/** Insert the seed offerings the first time the collection is empty. */
export async function seedRooms(): Promise<void> {
  const db = await getDb();
  const coll = db.collection(COLL);
  if ((await coll.countDocuments()) > 0) return;

  const stayDocs = STAYS.map((s, i) => ({
    slug: s.id,
    name: s.name,
    category: "stay" as Category,
    price: s.price,
    tags: s.tags,
    blurb: s.blurb,
    images: [s.image],
    quantity: DEFAULT_QUANTITY[s.id] ?? 4,
    available: DEFAULT_QUANTITY[s.id] ?? 4,
    active: true,
    order: i,
  }));
  const retreatDocs = RETREATS.map((r, i) => ({
    slug: r.id,
    name: r.name,
    category: "retreat" as Category,
    price: r.price,
    nights: r.nights,
    tags: r.tags,
    blurb: r.blurb,
    images: [r.image],
    quantity: DEFAULT_QUANTITY[r.id] ?? 10,
    available: DEFAULT_QUANTITY[r.id] ?? 10,
    active: true,
    order: STAYS.length + i,
  }));

  await coll.insertMany([...stayDocs, ...retreatDocs]);
}

export async function listRooms(): Promise<Room[]> {
  await seedRooms();
  const db = await getDb();
  const docs = await db
    .collection(COLL)
    .find()
    .sort({ order: 1, _id: 1 })
    .toArray();
  return docs.map(serialize);
}

function slugify(s: string): string {
  return (
    s
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") || "room"
  );
}

export async function createRoom(data: Partial<Room>): Promise<Room> {
  const db = await getDb();
  const quantity = Number(data.quantity) || 1;
  const doc = {
    slug: data.slug || `${slugify(data.name || "room")}-${Math.random().toString(36).slice(2, 6)}`,
    name: data.name || "New Room",
    category: (data.category as Category) || "stay",
    price: Number(data.price) || 0,
    ...(data.nights != null ? { nights: Number(data.nights) } : {}),
    tags: data.tags || [],
    blurb: data.blurb || "",
    images: data.images || [],
    quantity,
    available: data.available != null ? Number(data.available) : quantity,
    active: data.active !== false,
    order: 999,
  };
  const res = await db.collection(COLL).insertOne(doc);
  return serialize({ _id: res.insertedId, ...doc });
}

const EDITABLE: (keyof Room)[] = [
  "name",
  "category",
  "price",
  "nights",
  "tags",
  "blurb",
  "quantity",
  "available",
  "active",
  "images",
  "slug",
  "order",
];
const NUMERIC: (keyof Room)[] = ["price", "quantity", "available", "nights", "order"];

export async function updateRoom(id: string, patch: Partial<Room>): Promise<Room | null> {
  const db = await getDb();
  const set: Record<string, unknown> = {};
  for (const key of EDITABLE) {
    if (key in patch) {
      const value = patch[key];
      set[key] = NUMERIC.includes(key) && value != null ? Number(value) : value;
    }
  }
  const _id = new ObjectId(id);
  await db.collection(COLL).updateOne({ _id }, { $set: set });
  const doc = await db.collection(COLL).findOne({ _id });
  return doc ? serialize(doc) : null;
}

export async function deleteRoom(id: string): Promise<void> {
  const db = await getDb();
  await db.collection(COLL).deleteOne({ _id: new ObjectId(id) });
}

export async function addRoomImage(id: string, image: string): Promise<Room | null> {
  const db = await getDb();
  const _id = new ObjectId(id);
  await db
    .collection<{ images: string[] }>(COLL)
    .updateOne({ _id }, { $addToSet: { images: image } });
  const doc = await db.collection(COLL).findOne({ _id });
  return doc ? serialize(doc) : null;
}

export async function removeRoomImage(id: string, image: string): Promise<Room | null> {
  const db = await getDb();
  const _id = new ObjectId(id);
  await db
    .collection<{ images: string[] }>(COLL)
    .updateOne({ _id }, { $pull: { images: image } });
  const doc = await db.collection(COLL).findOne({ _id });
  return doc ? serialize(doc) : null;
}

/** Best-effort availability adjustment, clamped at 0, keyed by slug. */
export async function adjustAvailabilityBySlug(slug: string, delta: number): Promise<void> {
  if (!slug) return;
  const db = await getDb();
  const room = await db.collection(COLL).findOne({ slug });
  if (!room) return;
  const next = Math.max(0, (Number(room.available) || 0) + delta);
  await db.collection(COLL).updateOne({ slug }, { $set: { available: next } });
}
