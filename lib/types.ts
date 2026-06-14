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
  /** shown on the public site when true */
  active: boolean;
  order?: number;
}

export type BookingStatus = "pending" | "confirmed" | "cancelled";

export interface Booking {
  _id: string;
  ref: string;
  category: Category;
  roomSlug: string;
  roomName: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  nights: number;
  total: number;
  name: string;
  email: string;
  phone: string;
  notes?: string;
  status: BookingStatus;
  createdAt: string;
}
