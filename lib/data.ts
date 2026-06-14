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
  price: number;
  nights: number;
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

export const RETREATS: Retreat[] = [
  {
    id: "dawn",
    name: "Dawn Yoga & Meditation Retreat",
    price: 18500,
    nights: 3,
    image: "/assets/stays/dawn.jpg",
    ph: "[ dawn yoga retreat ]",
    tags: ["3 nights", "Daily asana & pranayama", "Satvik full-board"],
    blurb:
      "Three days of sunrise yoga, guided meditation and Satvik nourishment in the lap of the Himalayas.",
  },
  {
    id: "sanatan",
    name: "7-Day Sanatan Wellness Immersion",
    price: 42000,
    nights: 7,
    image: "/assets/stays/sanatan.jpg",
    ph: "[ sanatan immersion ]",
    tags: ["7 nights", "Vedic philosophy", "Sound & breathwork"],
    blurb:
      "A weeklong immersion into yoga, ancient Sanatan wisdom, sound healing and deep rest.",
  },
];

export const formatINR = (n: number): string =>
  "₹" + Number(n).toLocaleString("en-IN");

/** Default stock per offering when first seeding the database */
export const DEFAULT_QUANTITY: Record<string, number> = {
  glass: 5,
  heritage: 8,
  panchkedar: 3,
  dawn: 12,
  sanatan: 8,
};

/** Guests one room sleeps */
export const DEFAULT_CAPACITY: Record<string, number> = {
  glass: 2,
  heritage: 2,
  panchkedar: 3,
  dawn: 1,
  sanatan: 1,
};

/** Extra-bed config per offering */
export const DEFAULT_EXTRA_BED: Record<string, { allowed: boolean; price: number }> = {
  glass: { allowed: true, price: 1200 },
  heritage: { allowed: true, price: 1000 },
  panchkedar: { allowed: true, price: 1500 },
  dawn: { allowed: false, price: 0 },
  sanatan: { allowed: false, price: 0 },
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
    active: true,
    order: i,
  }));
  const retreatRooms: Room[] = RETREATS.map((r, i) => ({
    _id: r.id,
    slug: r.id,
    name: r.name,
    category: "retreat",
    price: r.price,
    nights: r.nights,
    tags: r.tags,
    blurb: r.blurb,
    images: [r.image],
    quantity: DEFAULT_QUANTITY[r.id] ?? 10,
    available: DEFAULT_QUANTITY[r.id] ?? 10,
    capacity: DEFAULT_CAPACITY[r.id] ?? 1,
    extraBedAllowed: DEFAULT_EXTRA_BED[r.id]?.allowed ?? false,
    extraBedPrice: DEFAULT_EXTRA_BED[r.id]?.price ?? 0,
    active: true,
    order: STAYS.length + i,
  }));
  return [...stayRooms, ...retreatRooms];
}
