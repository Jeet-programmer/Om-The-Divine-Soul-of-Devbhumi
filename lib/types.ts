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
  status: BookingStatus;
  createdAt: string;
}
