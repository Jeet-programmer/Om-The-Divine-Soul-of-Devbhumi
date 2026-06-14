"use client";

import { CSSProperties, useRef } from "react";
import Link from "next/link";
import { formatINR } from "@/lib/data";
import { useBooking } from "./BookingProvider";
import SmartImage from "./SmartImage";
import Logo from "./Logo";

const eyebrowWrap: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 12,
  marginBottom: 20,
};
const eyebrowText: CSSProperties = {
  fontFamily: "var(--font-mukta), sans-serif",
  letterSpacing: ".3em",
  textTransform: "uppercase",
  fontSize: 12,
  color: "#b5862b",
  fontWeight: 600,
};
const eyebrowLine: CSSProperties = { height: 1, width: 42, background: "#c0922f" };

/* ============================ ABOUT ============================ */
export function About() {
  const pillars = [
    {
      icon: "ॐ",
      iconBg: "#fbebcf",
      iconColor: "#9a3318",
      title: "Spiritual & Vedic Heritage",
      body:
        "Premium accommodation tailored for the sacred Char Dham pilgrimage, with a dedicated centre for Yoga and ancient Sanatan wisdom.",
    },
    {
      icon: "🌿",
      iconBg: "#e7eeda",
      iconColor: "",
      title: "Sustainable Livelihoods",
      body:
        "A processing unit that turns rare Himalayan botanical resources into sustainable livelihood opportunities for local residents.",
    },
    {
      icon: "🌹",
      iconBg: "#fbebcf",
      iconColor: "",
      title: "Nature & Culture",
      body:
        "A garden of Himalayan flora, a curated library, and an open-air exhibition showcasing traditional Garhwali rural life.",
    },
    {
      icon: "📚",
      iconBg: "#e7eeda",
      iconColor: "",
      title: "Research & Exploration",
      body:
        "A unique geographical and historical position, with dedicated infrastructure to support visiting scholars and explorers.",
    },
  ];

  return (
    <section id="about" style={{ padding: "120px 7vw", background: "#fbf5ea" }}>
      <div style={{ maxWidth: 1180, margin: "0 auto" }}>
        <div
          className="grid-2"
          style={{
            display: "grid",
            gridTemplateColumns: "1.05fr 1fr",
            gap: 64,
            alignItems: "center",
          }}
        >
          <div>
            <div style={eyebrowWrap}>
              <span style={eyebrowLine} />
              <span style={eyebrowText}>Our Story</span>
            </div>
            <h2
              style={{
                fontWeight: 600,
                fontSize: "clamp(34px,4vw,52px)",
                lineHeight: 1.1,
                color: "#2c1b12",
                letterSpacing: "-0.4px",
              }}
            >
              Where Indian spirituality meets sustainable eco-tourism
            </h2>
            <p style={{ marginTop: 24, fontSize: 17, lineHeight: 1.78, color: "#5c4636" }}>
              Born from a vision to connect the global community with the spiritual heritage of
              Devbhumi, OM — The Divine Soul of Devbhumi is a landmark eco-tourism project that
              beautifully unites the hearts of West Bengal and Uttarakhand. It is a sanctuary of
              peace — an antidote to the hectic pace of modern life.
            </p>
            <p
              style={{
                marginTop: 18,
                fontFamily: "var(--font-cormorant), serif",
                fontStyle: "italic",
                fontSize: 22,
                color: "#8e3b1e",
                lineHeight: 1.4,
              }}
            >
              &ldquo;An offering of stillness, in the lap of the gods.&rdquo;
            </p>
          </div>
          <div style={{ position: "relative" }}>
            <SmartImage
              src="/assets/gallery/about.jpg"
              alt="The property at golden hour"
              placeholder="[ property at golden hour ]"
              labelAlign="center"
              style={{
                width: "100%",
                aspectRatio: "4 / 5",
                borderRadius: 18,
                overflow: "hidden",
                border: "1px solid rgba(44,27,18,0.1)",
                boxShadow: "0 20px 50px rgba(44,27,18,0.12)",
              }}
            />
            <div
              style={{
                position: "absolute",
                bottom: -26,
                left: -26,
                background: "#fff",
                borderRadius: 14,
                padding: "20px 24px",
                boxShadow: "0 14px 36px rgba(44,27,18,0.14)",
                border: "1px solid rgba(192,146,47,0.25)",
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-cormorant), serif",
                  fontSize: 34,
                  fontWeight: 700,
                  color: "#d9772b",
                  lineHeight: 1,
                }}
              >
                2700m
              </div>
              <div
                style={{
                  fontFamily: "var(--font-mukta), sans-serif",
                  fontSize: 12,
                  letterSpacing: ".12em",
                  textTransform: "uppercase",
                  color: "#9a8470",
                  fontWeight: 600,
                  marginTop: 2,
                }}
              >
                Himalayan altitude
              </div>
            </div>
          </div>
        </div>

        <div style={{ marginTop: 96 }}>
          <h3
            style={{
              fontSize: 28,
              fontWeight: 600,
              color: "#2c1b12",
              textAlign: "center",
              marginBottom: 8,
            }}
          >
            Core Pillars of the Project
          </h3>
          <p style={{ textAlign: "center", color: "#9a8470", fontSize: 15, marginBottom: 48 }}>
            Four foundations rooted in heritage, nature and community
          </p>
          <div
            className="grid-4"
            style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 22 }}
          >
            {pillars.map((p) => (
              <div
                key={p.title}
                className="hov-lift"
                style={{
                  background: "#fff",
                  borderRadius: 16,
                  padding: "30px 26px",
                  border: "1px solid rgba(44,27,18,0.07)",
                  boxShadow: "0 8px 24px rgba(44,27,18,0.05)",
                }}
              >
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 12,
                    background: p.iconBg,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "var(--font-mukta), sans-serif",
                    fontSize: 24,
                    color: p.iconColor || undefined,
                    marginBottom: 18,
                  }}
                >
                  {p.icon}
                </div>
                <h4 style={{ fontSize: 21, fontWeight: 600, color: "#2c1b12" }}>{p.title}</h4>
                <p style={{ marginTop: 10, fontSize: 14.5, lineHeight: 1.65, color: "#6b5340" }}>
                  {p.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================ SANCTUARY ============================ */
export function Sanctuary() {
  return (
    <section id="sanctuary" style={{ padding: "120px 7vw", background: "#f4e7d2" }}>
      <div style={{ maxWidth: 1180, margin: "0 auto" }}>
        <div style={{ textAlign: "center", maxWidth: 680, margin: "0 auto 60px" }}>
          <div style={{ ...eyebrowWrap, justifyContent: "center" }}>
            <span style={eyebrowLine} />
            <span style={eyebrowText}>Our Sanctuary Amidst the Peaks</span>
            <span style={eyebrowLine} />
          </div>
          <h2
            style={{
              fontWeight: 600,
              fontSize: "clamp(32px,4vw,50px)",
              lineHeight: 1.12,
              color: "#2c1b12",
              letterSpacing: "-0.4px",
            }}
          >
            A front-row seat to the grandeur of the gods
          </h2>
          <p style={{ marginTop: 20, fontSize: 17, lineHeight: 1.75, color: "#5c4636" }}>
            Set against the breathtaking backdrop of the snow-capped Panch Kedar and the region&rsquo;s
            most iconic summits, we offer a rare blend of rugged Himalayan beauty and refined
            comfort.
          </p>
        </div>

        <div
          className="sanct-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3,1fr)",
            gridAutoRows: "1fr",
            gap: 22,
          }}
        >
          <div
            style={{
              gridColumn: "span 2",
              background: "#fff",
              borderRadius: 18,
              overflow: "hidden",
              border: "1px solid rgba(44,27,18,0.07)",
              boxShadow: "0 10px 30px rgba(44,27,18,0.06)",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <SmartImage
              src="/assets/gallery/cottage.jpg"
              alt="Glass-view cottage exterior"
              placeholder="[ glass-view cottage exterior ]"
              labelAlign="start"
              style={{ height: 220 }}
            />
            <div style={{ padding: "26px 28px" }}>
              <h4 style={{ fontSize: 24, fontWeight: 600, color: "#2c1b12" }}>Glass-View Cottages</h4>
              <p style={{ marginTop: 8, fontSize: 15, lineHeight: 1.65, color: "#6b5340" }}>
                Wake to the majesty of the mountains. Our cozy, glass-walled cottages let you stay
                wrapped in comfort while the peaks fill every window.
              </p>
            </div>
          </div>

          {[
            {
              icon: "🍲",
              img: "/assets/gallery/satvik.jpg",
              title: "Satvik Dining",
              body:
                "Fresh, healthy, strictly Satvik food — prepared to nourish both the body and the mind.",
            },
            {
              icon: "🏔",
              img: "/assets/gallery/amenities.jpg",
              title: "Modern Amenities, Ancient Roots",
              body:
                "Contemporary comfort woven seamlessly into the timeless heritage of Devbhumi.",
            },
            {
              icon: "🏺",
              img: "/assets/gallery/heritage.jpg",
              title: "Stay with Heritage",
              body:
                "The entire property is designed with traditional Garhwali craft, so you live inside the heritage of Devbhumi.",
            },
          ].map((c) => (
            <div
              key={c.title}
              style={{
                background: "#fff",
                borderRadius: 18,
                overflow: "hidden",
                border: "1px solid rgba(44,27,18,0.07)",
                boxShadow: "0 10px 30px rgba(44,27,18,0.06)",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <SmartImage
                src={c.img}
                alt={c.title}
                placeholder={`[ ${c.title} ]`}
                labelAlign="start"
                style={{ height: 168 }}
              />
              <div style={{ padding: 26 }}>
                <div style={{ fontSize: 28, marginBottom: 10 }}>{c.icon}</div>
                <h4 style={{ fontSize: 22, fontWeight: 600, color: "#2c1b12" }}>{c.title}</h4>
                <p style={{ marginTop: 8, fontSize: 14.5, lineHeight: 1.65, color: "#6b5340" }}>
                  {c.body}
                </p>
              </div>
            </div>
          ))}

          <div
            style={{
              gridColumn: "span 2",
              position: "relative",
              borderRadius: 18,
              overflow: "hidden",
              minHeight: 200,
              boxShadow: "0 10px 30px rgba(142,59,30,0.22)",
              display: "flex",
              alignItems: "center",
            }}
          >
            <SmartImage
              src="/assets/gallery/garden.jpg"
              alt="Natural Himalayan garden"
              placeholder="[ Himalayan garden ]"
              labelAlign="start"
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(120deg,rgba(142,59,30,0.92),rgba(181,83,31,0.62))",
              }}
            />
            <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 24, padding: "30px 32px" }}>
              <div style={{ fontSize: 38 }}>🌸</div>
              <div>
                <h4 style={{ fontSize: 24, fontWeight: 600, color: "#fff6e8" }}>
                  Natural Himalayan Garden
                </h4>
                <p style={{ marginTop: 6, fontSize: 15, lineHeight: 1.6, color: "rgba(255,246,232,0.92)" }}>
                  Rare Himalayan flowers, orchids and birds create a living attraction right outside
                  your door.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================ EXPERIENCES ============================ */
export function Experiences() {
  const { openRetreat } = useBooking();
  const rows = [
    {
      n: "01",
      title: "Yoga & Meditation Retreat",
      body:
        "The divine nature and tranquility of the property make it renowned for daily yoga and meditation practice.",
      cta: true,
    },
    {
      n: "02",
      title: "Spiritual Tourism",
      body:
        "We organize guided spiritual tours to help guests explore the mythological Devbhumi and the sacred Char Dham.",
      cta: false,
    },
    {
      n: "03",
      title: "Nature Tourism",
      body:
        "A heaven for nature lovers — we offer special packages to explore the Himalayan wilderness around us.",
      cta: false,
    },
    {
      n: "04",
      title: "Educational Tour",
      body:
        "A renowned property for organizing educational excursions, field study and immersive learning trips.",
      cta: false,
    },
  ];

  return (
    <section id="experiences" style={{ padding: "120px 7vw", background: "#fbf5ea" }}>
      <div style={{ maxWidth: 1180, margin: "0 auto" }}>
        <div style={{ textAlign: "center", maxWidth: 660, margin: "0 auto 56px" }}>
          <div style={{ ...eyebrowWrap, justifyContent: "center" }}>
            <span style={eyebrowLine} />
            <span style={eyebrowText}>Tourism Round the Year</span>
            <span style={eyebrowLine} />
          </div>
          <h2
            style={{
              fontWeight: 600,
              fontSize: "clamp(32px,4vw,50px)",
              lineHeight: 1.12,
              color: "#2c1b12",
              letterSpacing: "-0.4px",
            }}
          >
            Four ways to journey inward
          </h2>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {rows.map((r) => (
            <div
              key={r.n}
              className="exp-row hov-row"
              style={{
                display: "grid",
                gridTemplateColumns: "64px 1fr 220px",
                gap: 30,
                alignItems: "center",
                background: "#fff",
                borderRadius: 16,
                padding: "28px 34px",
                border: "1px solid rgba(44,27,18,0.07)",
                boxShadow: "0 8px 22px rgba(44,27,18,0.05)",
              }}
            >
              <div
                className="exp-num"
                style={{
                  fontFamily: "var(--font-cormorant), serif",
                  fontSize: 46,
                  fontWeight: 600,
                  color: "#e2c77f",
                  lineHeight: 1,
                }}
              >
                {r.n}
              </div>
              <div>
                <h4 style={{ fontSize: 25, fontWeight: 600, color: "#2c1b12" }}>{r.title}</h4>
                <p style={{ marginTop: 6, fontSize: 15, lineHeight: 1.6, color: "#6b5340" }}>{r.body}</p>
              </div>
              {r.cta ? (
                <button
                  onClick={openRetreat}
                  className="exp-cta btn-outline-accent"
                  style={{
                    justifySelf: "end",
                    fontSize: 14,
                    fontWeight: 600,
                    padding: "11px 22px",
                    borderRadius: 999,
                  }}
                >
                  Reserve a Retreat
                </button>
              ) : (
                <span
                  className="exp-cta"
                  style={{
                    justifySelf: "end",
                    fontFamily: "var(--font-mukta), sans-serif",
                    fontSize: 13,
                    color: "#9a8470",
                    fontWeight: 500,
                  }}
                >
                  Curated on request
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================ STAYS ============================ */
export function Stays() {
  const { stays, openStayWith } = useBooking();
  const trackRef = useRef<HTMLDivElement>(null);
  const scrollBy = (dir: number) =>
    trackRef.current?.scrollBy({ left: dir * 364, behavior: "smooth" });

  return (
    <section id="stays" style={{ padding: "120px 7vw", background: "#2c1b12" }}>
      <div style={{ maxWidth: 1180, margin: "0 auto" }}>
        <div style={{ textAlign: "center", maxWidth: 660, margin: "0 auto 56px" }}>
          <div style={{ ...eyebrowWrap, justifyContent: "center" }}>
            <span style={eyebrowLine} />
            <span style={{ ...eyebrowText, color: "#d9a93e" }}>Where You Rest</span>
            <span style={eyebrowLine} />
          </div>
          <h2
            style={{
              fontWeight: 600,
              fontSize: "clamp(32px,4vw,50px)",
              lineHeight: 1.12,
              color: "#fbf0dc",
              letterSpacing: "-0.4px",
            }}
          >
            Glass-View cottages &amp; heritage rooms
          </h2>
          <p style={{ marginTop: 18, fontSize: 16, lineHeight: 1.7, color: "rgba(251,240,220,0.7)" }}>
            Each stay opens to panoramic views of Panchkedar and Nilkantha. Rates include Satvik
            breakfast.
          </p>
        </div>

        <div style={{ position: "relative" }}>
          {/* prev / next */}
          <button
            aria-label="Previous"
            onClick={() => scrollBy(-1)}
            className="carousel-btn"
            style={{ ...carouselBtnStyle, left: -8 }}
          >
            ‹
          </button>
          <button
            aria-label="Next"
            onClick={() => scrollBy(1)}
            className="carousel-btn"
            style={{ ...carouselBtnStyle, right: -8 }}
          >
            ›
          </button>

          <div
            ref={trackRef}
            className="hcarousel"
            style={{
              display: "flex",
              gap: 24,
              justifyContent: "safe center",
              overflowX: "auto",
              scrollSnapType: "x mandatory",
              paddingBottom: 6,
            }}
          >
            {stays.map((room) => {
              const soldOut = room.available <= 0;
              return (
              <div
                key={room.slug}
                className="hov-lift-5"
                style={{
                  flex: "0 0 340px",
                  maxWidth: "85vw",
                  scrollSnapAlign: "start",
                  background: "#3a2418",
                  borderRadius: 18,
                  overflow: "hidden",
                  border: "1px solid rgba(217,169,62,0.18)",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
              <Link href={`/rooms/${room.slug}`} style={{ position: "relative", display: "block", lineHeight: 0 }}>
                <SmartImage
                  src={room.images[0] || ""}
                  alt={room.name}
                  placeholder={`[ ${room.name} ]`}
                  labelAlign="start"
                  style={{ height: 200, width: "100%" }}
                  placeholderStyle={{
                    background:
                      "repeating-linear-gradient(45deg,#4a3322,#4a3322 11px,#3f2b1c 11px,#3f2b1c 22px)",
                  }}
                  placeholderLabelStyle={{
                    color: "#c9b48e",
                    background: "rgba(28,14,8,0.7)",
                  }}
                />
                {room.images.length > 1 && (
                  <span
                    style={{
                      position: "absolute",
                      bottom: 12,
                      left: 12,
                      fontFamily: "var(--font-mukta), sans-serif",
                      fontSize: 11,
                      fontWeight: 600,
                      padding: "4px 10px",
                      borderRadius: 999,
                      color: "#fff",
                      background: "rgba(28,14,8,0.7)",
                      backdropFilter: "blur(4px)",
                    }}
                  >
                    📷 {room.images.length}
                  </span>
                )}
                <span
                  style={{
                    position: "absolute",
                    top: 12,
                    right: 12,
                    fontFamily: "var(--font-mukta), sans-serif",
                    fontSize: 11,
                    fontWeight: 600,
                    letterSpacing: ".04em",
                    padding: "5px 11px",
                    borderRadius: 999,
                    color: "#fff",
                    background: soldOut ? "rgba(142,59,30,0.92)" : "rgba(44,27,18,0.78)",
                    backdropFilter: "blur(4px)",
                  }}
                >
                  {soldOut ? "Fully booked" : `${room.available} available`}
                </span>
              </Link>
              <div style={{ padding: "26px 26px 28px", display: "flex", flexDirection: "column", flex: 1 }}>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 14 }}>
                  {room.tags.map((t) => (
                    <span
                      key={t}
                      style={{
                        fontFamily: "var(--font-mukta), sans-serif",
                        fontSize: 11,
                        letterSpacing: ".06em",
                        color: "#e2c77f",
                        background: "rgba(217,169,62,0.12)",
                        padding: "5px 11px",
                        borderRadius: 999,
                        fontWeight: 500,
                      }}
                    >
                      {t}
                    </span>
                  ))}
                </div>
                <Link
                  href={`/rooms/${room.slug}`}
                  style={{ textDecoration: "none" }}
                >
                  <h4 style={{ fontSize: 25, fontWeight: 600, color: "#fbf0dc" }}>{room.name}</h4>
                </Link>
                <p
                  style={{
                    marginTop: 8,
                    fontSize: 14.5,
                    lineHeight: 1.62,
                    color: "rgba(251,240,220,0.66)",
                    flex: 1,
                  }}
                >
                  {room.blurb}
                </p>
                <Link
                  href={`/rooms/${room.slug}`}
                  style={{
                    marginTop: 12,
                    fontFamily: "var(--font-mukta), sans-serif",
                    fontSize: 13.5,
                    fontWeight: 600,
                    color: "#e2c77f",
                    textDecoration: "none",
                  }}
                >
                  View details &amp; gallery →
                </Link>
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-end",
                    justifyContent: "space-between",
                    marginTop: 22,
                    paddingTop: 20,
                    borderTop: "1px solid rgba(217,169,62,0.16)",
                  }}
                >
                  <div>
                    <span
                      style={{
                        fontFamily: "var(--font-cormorant), serif",
                        fontSize: 30,
                        fontWeight: 700,
                        color: "#fbf0dc",
                      }}
                    >
                      {formatINR(room.price)}
                    </span>
                    <span
                      style={{
                        fontFamily: "var(--font-mukta), sans-serif",
                        fontSize: 13,
                        color: "rgba(251,240,220,0.55)",
                      }}
                    >
                      {" "}
                      / night
                    </span>
                  </div>
                  <button
                    onClick={() => !soldOut && openStayWith(room.slug)}
                    disabled={soldOut}
                    className={soldOut ? undefined : "btn-reserve"}
                    style={{
                      border: "none",
                      cursor: soldOut ? "not-allowed" : "pointer",
                      color: "#fff",
                      background: soldOut ? "rgba(217,119,43,0.4)" : undefined,
                      fontSize: 13.5,
                      fontWeight: 600,
                      padding: "10px 20px",
                      borderRadius: 999,
                    }}
                  >
                    {soldOut ? "Sold out" : "Reserve"}
                  </button>
                </div>
              </div>
            </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

const carouselBtnStyle: CSSProperties = {
  position: "absolute",
  top: "42%",
  transform: "translateY(-50%)",
  zIndex: 3,
  width: 44,
  height: 44,
  borderRadius: "50%",
  border: "none",
  background: "rgba(217,119,43,0.85)",
  color: "#fff",
  fontSize: 26,
  lineHeight: 1,
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  boxShadow: "0 6px 18px rgba(0,0,0,0.3)",
};

/* ============================ VENUE ============================ */
export function Venue() {
  const points = [
    {
      strong: "The Space.",
      rest: " A spacious, beautifully decorated 60′×40′ multifunctional venue.",
    },
    {
      strong: "Perfect for.",
      rest: " Weddings, family celebrations, corporate meetings, yoga retreats and educational seminars.",
    },
    {
      strong: "Amenities.",
      rest: " Seamless electricity, water, clean washrooms and customizable catering on demand.",
    },
  ];
  return (
    <section id="venue" style={{ padding: "120px 7vw", background: "#fbf5ea" }}>
      <div
        className="grid-2"
        style={{
          maxWidth: 1180,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 60,
          alignItems: "center",
        }}
      >
        <div style={{ position: "relative" }}>
          <SmartImage
            src="/assets/venue/venue.jpg"
            alt="Vashishtha Bhawan venue"
            placeholder="[ Vashishtha Bhawan venue ]"
            labelAlign="start"
            style={{
              width: "100%",
              aspectRatio: "5 / 4",
              borderRadius: 18,
              overflow: "hidden",
              border: "1px solid rgba(44,27,18,0.1)",
              boxShadow: "0 18px 44px rgba(44,27,18,0.12)",
            }}
          />
        </div>
        <div>
          <div style={eyebrowWrap}>
            <span style={eyebrowLine} />
            <span style={eyebrowText}>Organize an Event</span>
          </div>
          <h2
            style={{
              fontWeight: 600,
              fontSize: "clamp(30px,3.5vw,46px)",
              lineHeight: 1.12,
              color: "#2c1b12",
              letterSpacing: "-0.4px",
            }}
          >
            Vashishtha Bhawan
          </h2>
          <p style={{ marginTop: 18, fontSize: 16.5, lineHeight: 1.72, color: "#5c4636" }}>
            Nestled amidst the Himalayas, Vashishtha Bhawan blends natural wonder with modern
            comfort — offering panoramic, full-length views of Panchkedar, Nilkantha and the
            surrounding sacred peaks.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 26 }}>
            {points.map((pt) => (
              <div key={pt.strong} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                <span style={{ color: "#d9772b", fontSize: 18, lineHeight: 1.4 }}>✦</span>
                <p style={{ fontSize: 15, lineHeight: 1.55, color: "#4a3422" }}>
                  <strong style={{ color: "#2c1b12" }}>{pt.strong}</strong>
                  {pt.rest}
                </p>
              </div>
            ))}
          </div>
          <a
            href="#contact"
            className="btn-dark"
            style={{
              display: "inline-block",
              marginTop: 30,
              textDecoration: "none",
              fontSize: 15,
              fontWeight: 600,
              padding: "14px 30px",
              borderRadius: 999,
            }}
          >
            Enquire to Host
          </a>
        </div>
      </div>
    </section>
  );
}

/* ============================ FOOTER ============================ */
export function Footer() {
  const { openStay } = useBooking();
  return (
    <section id="contact" style={{ background: "#1c0e08", padding: "96px 7vw 48px" }}>
      <div style={{ maxWidth: 1180, margin: "0 auto" }}>
        <div
          className="footer-grid"
          style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr 1fr", gap: 48 }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 13, marginBottom: 20 }}>
              <Logo size={48} />
              <span
                style={{
                  fontFamily: "var(--font-cormorant), serif",
                  fontSize: 20,
                  fontWeight: 700,
                  color: "#fbf0dc",
                  lineHeight: 1.15,
                  letterSpacing: ".02em",
                  maxWidth: 230,
                }}
              >
                OM The Divine Soul of Devbhumi
              </span>
            </div>
            <p
              style={{
                fontFamily: "var(--font-cormorant), serif",
                fontStyle: "italic",
                fontSize: 20,
                color: "#d9a93e",
                lineHeight: 1.4,
              }}
            >
              The Ultimate Destination Towards Divinity
            </p>
            <p
              style={{
                marginTop: 18,
                fontSize: 13,
                color: "rgba(251,240,220,0.5)",
                fontFamily: "var(--font-mukta), sans-serif",
              }}
            >
              CIN: U55209WB2020PTC236728
            </p>
          </div>

          <div>
            <h5 style={footerHeading}>Working Office</h5>
            <p style={footerText}>
              Vill. Dewar, P.O. Guptakashi
              <br />
              Dist. Rudraprayag
              <br />
              Uttarakhand — 246439
            </p>
            <h5 style={{ ...footerHeading, margin: "24px 0 16px" }}>Head Office</h5>
            <p style={footerText}>
              Debi Nibas, Bamunpara Kalibari, Memari
              <br />
              Dist. Purba Bardhaman
              <br />
              West Bengal — 713146
            </p>
          </div>

          <div>
            <h5 style={footerHeading}>Reach Us</h5>
            <a
              href="mailto:Omdivinesoul@gmail.com"
              className="link-soft"
              style={{ ...footerLink, marginBottom: 14 }}
            >
              Omdivinesoul@gmail.com
            </a>
            <a href="tel:+919756615582" className="link-soft" style={footerLink}>
              +91 97566 15582
            </a>
            <a href="tel:+918006020945" className="link-soft" style={footerLink}>
              +91 80060 20945
            </a>
            <a href="tel:+919732130019" className="link-soft" style={{ ...footerLink, marginBottom: 0 }}>
              +91 97321 30019
            </a>
            <button
              onClick={openStay}
              className="btn-reserve"
              style={{
                marginTop: 26,
                border: "none",
                cursor: "pointer",
                color: "#fff",
                fontSize: 14,
                fontWeight: 600,
                padding: "13px 26px",
                borderRadius: 999,
                boxShadow: "0 6px 18px rgba(217,119,43,0.3)",
              }}
            >
              Book Your Stay
            </button>
          </div>
        </div>

        <div
          style={{
            marginTop: 56,
            paddingTop: 24,
            borderTop: "1px solid rgba(217,169,62,0.16)",
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <span style={{ fontSize: 12.5, color: "rgba(251,240,220,0.45)" }}>
            © 2026 OM — The Divine Soul of Devbhumi Pvt. Ltd.
          </span>
          <span style={{ fontSize: 12.5, color: "rgba(251,240,220,0.45)" }}>
            Spiritual Eco-Tourism · Devbhumi, Uttarakhand
          </span>
        </div>
      </div>
    </section>
  );
}

const footerHeading: CSSProperties = {
  fontFamily: "var(--font-mukta), sans-serif",
  fontSize: 12,
  letterSpacing: ".2em",
  textTransform: "uppercase",
  color: "#d9a93e",
  fontWeight: 600,
  marginBottom: 16,
};
const footerText: CSSProperties = {
  fontSize: 14.5,
  lineHeight: 1.7,
  color: "rgba(251,240,220,0.78)",
};
const footerLink: CSSProperties = {
  display: "block",
  fontSize: 14.5,
  color: "rgba(251,240,220,0.78)",
  textDecoration: "none",
  marginBottom: 6,
};
