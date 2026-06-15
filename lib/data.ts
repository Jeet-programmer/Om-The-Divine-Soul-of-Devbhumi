import type { Room } from "./types";

export type { Category } from "./types";

export interface Stay {
  id: string;
  name: string;
  price: number;
  /** Path under /public — falls back to a labeled placeholder if missing */
  image: string;
  /** Placeholder label shown when the image is absent */
  ph: string;
  tags: string[];
  blurb: string;
}

export interface Retreat {
  id: string;
  name: string;
  /** flat package rate per night (party-size tier, not per person) */
  price: number;
  image: string;
  ph: string;
  tags: string[];
  blurb: string;
}

export const STAYS: Stay[] = [
  {
    id: "glass",
    name: "Glass-View Cottage",
    price: 6500,
    image: "/assets/stays/glass.jpg",
    ph: "[ glass-view cottage interior ]",
    tags: ["Sleeps 2", "Mountain-facing", "Private deck"],
    blurb:
      "Glass-walled cottage that opens to the full sweep of the snow peaks. Wake to alpenglow on Panch Kedar.",
  },
  {
    id: "heritage",
    name: "Heritage Room",
    price: 4200,
    image: "/assets/stays/heritage.jpg",
    ph: "[ heritage room ]",
    tags: ["Sleeps 2", "Garhwali decor", "Garden side"],
    blurb:
      "A warm room dressed in traditional Devbhumi craft — handwoven textiles, carved wood and quiet comfort.",
  },
  {
    id: "panchkedar",
    name: "Panchkedar Suite",
    price: 9800,
    image: "/assets/stays/panchkedar.jpg",
    ph: "[ panchkedar suite ]",
    tags: ["Sleeps 3", "Nilkantha view", "Sit-out lounge"],
    blurb:
      "Our finest suite with full-length views of Nilkantha and a private sit-out for sunrise meditation.",
  },
];

/**
 * Retreat & wellness packages. Each is a flat nightly rate for a party-size
 * tier (not per person) and includes luxury cottage accommodation with all
 * modern facilities, 3 Satvik meals daily with fruit and milk, the open
 * mountain-view yoga & meditation space and yoga hall, chanting sound support,
 * and a free sky-watching observatory session.
 */
export const RETREATS: Retreat[] = [
  {
    id: "individual",
    name: "Individual Retreat Package",
    price: 5000,
    image: "/assets/stays/glass.jpg",
    ph: "[ individual luxury cottage ]",
    tags: ["For 2 persons", "Per night", "Luxury cottage", "Chanting support"],
    blurb:
      "A luxury cottage with all modern facilities for two. Three Satvik meals daily with fresh fruit and milk, the open mountain-view yoga & meditation space and yoga hall, and chanting sound support. Free sky-watching observatory session included.",
  },
  {
    id: "family",
    name: "Family Retreat Package",
    price: 8000,
    image: "/assets/stays/panchkedar.jpg",
    ph: "[ family cottage retreat ]",
    tags: ["3 adults + 1 child", "Per night", "Family cottage"],
    blurb:
      "The same luxury cottage experience sized for a family of three plus one child — three Satvik meals with fruit and milk, mountain-view yoga & meditation, the yoga hall and chanting support. Free sky-watching observatory session included.",
  },
  {
    id: "group-small",
    name: "Group Package · 5–7 Persons",
    price: 10000,
    image: "/assets/stays/heritage.jpg",
    ph: "[ small group retreat ]",
    tags: ["5–7 persons", "Per night", "Group stay"],
    blurb:
      "A retreat package for a small group of five to seven. Comfortable accommodation, three Satvik meals daily with fruit and milk, yoga & meditation in the open mountain-view space and hall, and chanting support. Free sky-watching observatory session included.",
  },
  {
    id: "group-medium",
    name: "Group Package · 8–10 Persons",
    price: 15000,
    image: "/assets/gallery/cottage.jpg",
    ph: "[ medium group retreat ]",
    tags: ["8–10 persons", "Per night", "Group stay"],
    blurb:
      "A retreat package for a group of eight to ten, with all facilities — accommodation, three Satvik meals with fruit and milk, open mountain-view yoga & meditation, the yoga hall and chanting support. Free sky-watching observatory session included.",
  },
  {
    id: "group-large",
    name: "Group Package · 11–14 Persons",
    price: 20000,
    image: "/assets/gallery/amenities.jpg",
    ph: "[ large group retreat ]",
    tags: ["11–14 persons", "Per night", "Group stay"],
    blurb:
      "A retreat package for a larger group of eleven to fourteen — full accommodation, three Satvik meals daily with fruit and milk, yoga & meditation space and hall, and chanting support. Free sky-watching observatory session included.",
  },
  {
    id: "wellness-camp",
    name: "Complete Yoga & Wellness Retreat Camp",
    price: 25000,
    image: "/assets/stays/dawn.jpg",
    ph: "[ yoga & wellness camp ]",
    tags: ["15–20 persons", "Per night", "All accessories", "Creative support"],
    blurb:
      "Our complete yoga and wellness retreat camp for fifteen to twenty, with all accessories and creative support. Accommodation, three Satvik meals with fruit and milk, open mountain-view yoga & meditation, the yoga hall and chanting support — and a free sky-watching observatory session for all.",
  },
];

/**
 * Every property photo currently sitting in /public/assets — used to seed the
 * gallery collection the first time, and as a graceful fallback if the DB is
 * unreachable. Paths with spaces are URL-encoded so they load directly as an
 * <img> src. (Branding/logo and design-reference folders are intentionally
 * excluded.)
 */
export const GALLERY_SEED: string[] = [
  "/assets/hero/hero.jpg",
  "/assets/gallery/about.jpg",
  "/assets/gallery/cottage.jpg",
  "/assets/gallery/garden.jpg",
  "/assets/gallery/heritage.jpg",
  "/assets/gallery/amenities.jpg",
  "/assets/gallery/satvik.jpg",
  "/assets/gallery/361633390.jpg",
  "/assets/gallery/475759876.jpg",
  "/assets/gallery/475759911.jpg",
  "/assets/gallery/475759914.jpg",
  "/assets/gallery/475759914%20(1).jpg",
  "/assets/gallery/672314761.jpg",
  "/assets/gallery/672315910.jpg",
  "/assets/gallery/859538672.jpg",
  "/assets/gallery/859539110.jpg",
  "/assets/gallery/6c258e8193978533815ae6de34110910.jpg",
  "/assets/gallery/7d0c9f3ef3beb4a14d749ccb6586a095.jpg",
  "/assets/gallery/images.jpeg",
  "/assets/gallery/images%20(1).jpeg",
  "/assets/stays/glass.jpg",
  "/assets/stays/heritage.jpg",
  "/assets/stays/panchkedar.jpg",
  "/assets/stays/dawn.jpg",
  "/assets/stays/sanatan.jpg",
  "/assets/stays/361633410.jpg",
  "/assets/stays/467640664.jpg",
  "/assets/stays/672313444.jpg",
  "/assets/stays/672321415.jpg",
  "/assets/stays/672321415%20(1).jpg",
  "/assets/venue/venue.jpg",
];

export const formatINR = (n: number): string =>
  "₹" + Number(n).toLocaleString("en-IN");

/** The price to show for a room: lowest meal-plan price ("from …") if it has
 *  plans, otherwise its base price. */
export function displayRate(room: Room): { price: number; from: boolean } {
  const plans = room.mealPlans || [];
  if (plans.length > 0) {
    return { price: Math.min(...plans.map((p) => p.price)), from: true };
  }
  return { price: room.price, from: false };
}

/** Default stock per offering when first seeding the database */
export const DEFAULT_QUANTITY: Record<string, number> = {
  glass: 5,
  heritage: 8,
  panchkedar: 3,
  individual: 6,
  family: 4,
  "group-small": 3,
  "group-medium": 2,
  "group-large": 2,
  "wellness-camp": 1,
};

/** Guests one room sleeps (stays) / max party for a package (retreats) */
export const DEFAULT_CAPACITY: Record<string, number> = {
  glass: 2,
  heritage: 2,
  panchkedar: 3,
  individual: 2,
  family: 4,
  "group-small": 7,
  "group-medium": 10,
  "group-large": 14,
  "wellness-camp": 20,
};

/** Extra-bed config per offering */
export const DEFAULT_EXTRA_BED: Record<string, { allowed: boolean; price: number }> = {
  glass: { allowed: true, price: 1200 },
  heritage: { allowed: true, price: 1000 },
  panchkedar: { allowed: true, price: 1500 },
  individual: { allowed: false, price: 0 },
  family: { allowed: false, price: 0 },
  "group-small": { allowed: false, price: 0 },
  "group-medium": { allowed: false, price: 0 },
  "group-large": { allowed: false, price: 0 },
  "wellness-camp": { allowed: false, price: 0 },
};

/**
 * Room[] derived from the static seed data — used as a graceful fallback so the
 * public site still renders if the database is unreachable.
 */
export function fallbackRooms(): Room[] {
  const stayRooms: Room[] = STAYS.map((s, i) => ({
    _id: s.id,
    slug: s.id,
    name: s.name,
    category: "stay",
    price: s.price,
    tags: s.tags,
    blurb: s.blurb,
    images: [s.image],
    quantity: DEFAULT_QUANTITY[s.id] ?? 4,
    available: DEFAULT_QUANTITY[s.id] ?? 4,
    capacity: DEFAULT_CAPACITY[s.id] ?? 2,
    extraBedAllowed: DEFAULT_EXTRA_BED[s.id]?.allowed ?? false,
    extraBedPrice: DEFAULT_EXTRA_BED[s.id]?.price ?? 0,
    mealPlans: [],
    active: true,
    order: i,
  }));
  const retreatRooms: Room[] = RETREATS.map((r, i) => ({
    _id: r.id,
    slug: r.id,
    name: r.name,
    category: "retreat",
    price: r.price,
    tags: r.tags,
    blurb: r.blurb,
    images: [r.image],
    quantity: DEFAULT_QUANTITY[r.id] ?? 10,
    available: DEFAULT_QUANTITY[r.id] ?? 10,
    capacity: DEFAULT_CAPACITY[r.id] ?? 1,
    extraBedAllowed: DEFAULT_EXTRA_BED[r.id]?.allowed ?? false,
    extraBedPrice: DEFAULT_EXTRA_BED[r.id]?.price ?? 0,
    mealPlans: [],
    active: true,
    order: STAYS.length + i,
  }));
  return [...stayRooms, ...retreatRooms];
}
