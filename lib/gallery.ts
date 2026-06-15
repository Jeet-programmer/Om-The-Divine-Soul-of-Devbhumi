import { ObjectId, WithId, Document } from "mongodb";
import { getDb } from "./db";
import { GALLERY_SEED } from "./data";
import { GalleryImage } from "./types";

const COLL = "gallery";

function serialize(doc: WithId<Document>): GalleryImage {
  const { _id, ...rest } = doc;
  return { _id: _id.toString(), ...(rest as Omit<GalleryImage, "_id">) };
}

/** Insert the seed photos the first time the collection is empty. */
export async function seedGallery(): Promise<void> {
  const db = await getDb();
  const coll = db.collection(COLL);

  // Self-heal: collapse any duplicate `src` entries left behind by an earlier
  // seeding race (concurrent requests each inserting the seed), keeping the
  // oldest copy. Then enforce uniqueness so it can't happen again.
  const existing = await coll.find().sort({ order: 1, _id: 1 }).toArray();
  const seen = new Set<string>();
  const dupIds: ObjectId[] = [];
  for (const d of existing) {
    if (seen.has(d.src)) dupIds.push(d._id as ObjectId);
    else seen.add(d.src);
  }
  if (dupIds.length) await coll.deleteMany({ _id: { $in: dupIds } });
  await coll.createIndex({ src: 1 }, { unique: true });

  if (existing.length > 0) return;

  const now = new Date().toISOString();
  try {
    await coll.insertMany(
      GALLERY_SEED.map((src, i) => ({ src, caption: "", order: i, createdAt: now })),
      { ordered: false }
    );
  } catch {
    // A concurrent seed already inserted these — the unique index turns the
    // duplicate inserts into ignorable duplicate-key errors.
  }
}

export async function listGallery(): Promise<GalleryImage[]> {
  await seedGallery();
  const db = await getDb();
  const docs = await db
    .collection(COLL)
    .find()
    .sort({ order: 1, _id: 1 })
    .toArray();
  return docs.map(serialize);
}

export async function addGalleryImage(src: string, caption = ""): Promise<GalleryImage> {
  const db = await getDb();
  const coll = db.collection(COLL);
  const clean = src.trim();

  // already in the gallery → return the existing entry instead of duplicating
  const existing = await coll.findOne({ src: clean });
  if (existing) return serialize(existing);

  // append to the end
  const last = await coll.find().sort({ order: -1 }).limit(1).toArray();
  const order = last.length ? (Number(last[0].order) || 0) + 1 : 0;
  const doc = { src: clean, caption, order, createdAt: new Date().toISOString() };
  const res = await coll.insertOne(doc);
  return serialize({ _id: res.insertedId, ...doc });
}

export async function removeGalleryImage(id: string): Promise<void> {
  const db = await getDb();
  await db.collection(COLL).deleteOne({ _id: new ObjectId(id) });
}

/** Static fallback (DB unreachable) so the public gallery still renders. */
export function fallbackGallery(): GalleryImage[] {
  return GALLERY_SEED.map((src, i) => ({
    _id: `seed-${i}`,
    src,
    caption: "",
    order: i,
    createdAt: "",
  }));
}
