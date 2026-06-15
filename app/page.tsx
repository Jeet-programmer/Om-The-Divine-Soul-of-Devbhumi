import BookingProvider from "@/components/BookingProvider";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import { About, Sanctuary, Experiences, Stays, Packages, Venue, Gallery, Footer } from "@/components/Sections";
import { listRooms } from "@/lib/rooms";
import { listGallery, fallbackGallery } from "@/lib/gallery";
import { fallbackRooms } from "@/lib/data";
import type { Room, GalleryImage } from "@/lib/types";

// rooms come from MongoDB at request time
export const dynamic = "force-dynamic";

export default async function Home() {
  let rooms: Room[];
  try {
    rooms = await listRooms();
  } catch {
    // DB unreachable — render the site from the static seed so it never breaks
    rooms = fallbackRooms();
  }

  let gallery: GalleryImage[];
  try {
    gallery = await listGallery();
  } catch {
    gallery = fallbackGallery();
  }

  return (
    <BookingProvider rooms={rooms}>
      <div style={{ overflowX: "hidden" }}>
        <Header />
        <Hero />
        <About />
        <Stays />
        <Sanctuary />
        <Experiences />
        <Packages />
        <Venue />
        <Gallery images={gallery.map((g) => g.src)} />
        <Footer />
      </div>
    </BookingProvider>
  );
}
