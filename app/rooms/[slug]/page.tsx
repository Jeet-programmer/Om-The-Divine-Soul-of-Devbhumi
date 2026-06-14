import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import BookingProvider from "@/components/BookingProvider";
import Header from "@/components/Header";
import { Footer } from "@/components/Sections";
import RoomGallery from "@/components/RoomGallery";
import ReserveButton from "@/components/ReserveButton";
import SmartImage from "@/components/SmartImage";
import { getRoomBySlug, listRooms } from "@/lib/rooms";
import { formatINR } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  try {
    const room = await getRoomBySlug(slug);
    if (room) {
      return {
        title: `${room.name} — OM The Divine Soul of Devbhumi`,
        description: room.blurb,
      };
    }
  } catch {
    /* fall through */
  }
  return { title: "Stay — OM The Divine Soul of Devbhumi" };
}

export default async function RoomPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let room, allRooms;
  try {
    [room, allRooms] = await Promise.all([getRoomBySlug(slug), listRooms()]);
  } catch {
    notFound();
  }
  if (!room) notFound();

  const isRetreat = room.category === "retreat";
  const others = allRooms!.filter((r) => r.slug !== room.slug && r.active);

  return (
    <BookingProvider rooms={allRooms!}>
      <div style={{ overflowX: "hidden" }}>
        <Header />

        <main style={{ padding: "120px 7vw 90px", background: "#fbf5ea", minHeight: "100vh" }}>
          <div style={{ maxWidth: 1180, margin: "0 auto" }}>
            <Link
              href="/#stays"
              style={{
                display: "inline-block",
                marginBottom: 26,
                fontFamily: "var(--font-mukta), sans-serif",
                fontSize: 14,
                fontWeight: 600,
                color: "#9a6b2e",
                textDecoration: "none",
              }}
            >
              ← All stays
            </Link>

            <div
              className="grid-2"
              style={{
                display: "grid",
                gridTemplateColumns: "1.45fr 1fr",
                gap: 48,
                alignItems: "start",
              }}
            >
              {/* gallery */}
              <RoomGallery images={room.images} name={room.name} />

              {/* info */}
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                  <span style={{ height: 1, width: 36, background: "#c0922f" }} />
                  <span
                    style={{
                      fontFamily: "var(--font-mukta), sans-serif",
                      fontSize: 12,
                      letterSpacing: ".26em",
                      textTransform: "uppercase",
                      color: "#b5862b",
                      fontWeight: 600,
                    }}
                  >
                    {isRetreat ? "Yoga & Meditation Retreat" : "Where You Rest"}
                  </span>
                </div>

                <h1
                  style={{
                    fontFamily: "var(--font-cormorant), serif",
                    fontWeight: 600,
                    fontSize: "clamp(32px,4vw,48px)",
                    lineHeight: 1.1,
                    color: "#2c1b12",
                    letterSpacing: "-0.4px",
                  }}
                >
                  {room.name}
                </h1>

                <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginTop: 14 }}>
                  <span
                    style={{
                      fontFamily: "var(--font-cormorant), serif",
                      fontSize: 38,
                      fontWeight: 700,
                      color: "#c0651f",
                    }}
                  >
                    {formatINR(room.price)}
                  </span>
                  <span style={{ fontSize: 15, color: "#9a8470" }}>
                    {isRetreat ? "per person" : "per night"}
                  </span>
                </div>

                <div
                  style={{
                    marginTop: 14,
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    fontFamily: "var(--font-mukta), sans-serif",
                    fontSize: 13,
                    fontWeight: 600,
                    color: room.available > 0 ? "#5f8a3f" : "#b5531f",
                  }}
                >
                  <span
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: room.available > 0 ? "#5f8a3f" : "#b5531f",
                    }}
                  />
                  {room.available > 0
                    ? `${room.available} ${isRetreat ? "seats available" : "available"}`
                    : "Fully booked"}
                  {isRetreat && room.nights ? ` · ${room.nights} nights` : ""}
                </div>

                {room.tags.length > 0 && (
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 20 }}>
                    {room.tags.map((t) => (
                      <span
                        key={t}
                        style={{
                          fontFamily: "var(--font-mukta), sans-serif",
                          fontSize: 12.5,
                          color: "#9a6b2e",
                          background: "rgba(217,169,62,0.16)",
                          padding: "6px 13px",
                          borderRadius: 999,
                          fontWeight: 500,
                        }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                )}

                <p style={{ marginTop: 22, fontSize: 16.5, lineHeight: 1.75, color: "#5c4636" }}>
                  {room.blurb}
                </p>

                <div style={{ marginTop: 30 }}>
                  <ReserveButton
                    slug={room.slug}
                    category={room.category}
                    available={room.available}
                    active={room.active}
                    label={isRetreat ? "Reserve this retreat" : "Reserve this stay"}
                  />
                </div>

                <p style={{ marginTop: 18, fontSize: 13.5, color: "#9a8470", lineHeight: 1.6 }}>
                  Rates include Satvik breakfast. Questions? Call{" "}
                  <a href="tel:+919756615582" style={{ color: "#9a6b2e" }}>
                    +91 97566 15582
                  </a>{" "}
                  or write to{" "}
                  <a href="mailto:Omdivinesoul@gmail.com" style={{ color: "#9a6b2e" }}>
                    Omdivinesoul@gmail.com
                  </a>
                  .
                </p>
              </div>
            </div>

            {/* more rooms */}
            {others.length > 0 && (
              <div style={{ marginTop: 90 }}>
                <h2
                  style={{
                    fontFamily: "var(--font-cormorant), serif",
                    fontSize: 28,
                    fontWeight: 600,
                    color: "#2c1b12",
                    marginBottom: 26,
                  }}
                >
                  More places to stay
                </h2>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: 20 }}>
                  {others.map((r) => (
                    <Link
                      key={r.slug}
                      href={`/rooms/${r.slug}`}
                      className="hov-lift"
                      style={{
                        textDecoration: "none",
                        background: "#fff",
                        borderRadius: 16,
                        overflow: "hidden",
                        border: "1px solid rgba(44,27,18,0.07)",
                        boxShadow: "0 8px 24px rgba(44,27,18,0.05)",
                        display: "block",
                      }}
                    >
                      <SmartImage
                        src={r.images[0] || ""}
                        alt={r.name}
                        placeholder={`[ ${r.name} ]`}
                        labelAlign="start"
                        style={{ width: "100%", height: 150 }}
                      />
                      <div style={{ padding: "16px 18px" }}>
                        <h4 style={{ fontFamily: "var(--font-cormorant), serif", fontSize: 19, fontWeight: 600, color: "#2c1b12" }}>
                          {r.name}
                        </h4>
                        <div style={{ marginTop: 4, fontSize: 14, color: "#c0651f", fontWeight: 600 }}>
                          {formatINR(r.price)}{" "}
                          <span style={{ color: "#9a8470", fontWeight: 400, fontSize: 12.5 }}>
                            / {r.category === "retreat" ? "person" : "night"}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </main>

        <Footer />
      </div>
    </BookingProvider>
  );
}
