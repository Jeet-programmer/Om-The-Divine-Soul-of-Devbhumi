import BookingProvider from "@/components/BookingProvider";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import { About, Sanctuary, Experiences, Stays, Packages, Venue, Gallery, Footer } from "@/components/Sections";
import { listRooms } from "@/lib/rooms";
import { listGallery, fallbackGallery } from "@/lib/gallery";
import { fallbackRooms } from "@/lib/data";
import type { Room, GalleryImage } from "@/lib/types";
import { SITE_URL } from "@/lib/site";

const hotelJsonLd = {
  "@context": "https://schema.org",
  "@type": "Hotel",
  name: "OM The Divine Soul of Devbhumi",
  alternateName: ["Om Divine Soul", "OM Divine Soul of Devbhumi"],
  description:
    "Spiritual eco-sanctuary and accommodation near Kedarnath in Guptkashi, Uttarakhand, with glass-view cottages, yoga and meditation retreats.",
  url: SITE_URL,
  image: `${SITE_URL}/assets/hero/hero.jpg`,
  email: "Omdivinesoul@gmail.com",
  telephone: "+91-9756615582",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Vill. Dewar, P.O. Guptakashi",
    addressLocality: "Guptkashi",
    addressRegion: "Uttarakhand",
    postalCode: "246439",
    addressCountry: "IN",
  },
  containedInPlace: { "@type": "Place", name: "Rudraprayag, Uttarakhand" },
};

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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(hotelJsonLd) }}
      />
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
