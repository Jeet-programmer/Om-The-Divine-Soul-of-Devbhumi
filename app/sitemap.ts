import type { MetadataRoute } from "next";
import { listRooms } from "@/lib/rooms";
import { fallbackRooms } from "@/lib/data";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let rooms;
  try {
    rooms = await listRooms();
  } catch {
    rooms = fallbackRooms();
  }
  return [
    { url: SITE_URL, changeFrequency: "weekly", priority: 1 },
    ...rooms
      .filter((r) => r.active)
      .map((r) => ({ url: `${SITE_URL}/rooms/${r.slug}`, changeFrequency: "weekly" as const, priority: 0.8 })),
  ];
}
