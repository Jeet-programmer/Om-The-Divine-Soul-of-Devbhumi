"use client";

import { CSSProperties, useRef, useState } from "react";
import { useBooking } from "./BookingProvider";

const todayStr = () => new Date().toISOString().slice(0, 10);

const fieldLabel: CSSProperties = {
  fontFamily: "var(--font-mukta), sans-serif",
  fontSize: 12.5,
  letterSpacing: ".16em",
  textTransform: "uppercase",
  color: "#9a8470",
  fontWeight: 700,
};

/** A tappable date field that always shows readable text and opens the native
 *  date picker on tap (fixes invisible empty date inputs on mobile). */
function DateField({
  label,
  value,
  min,
  onChange,
}: {
  label: string;
  value: string;
  min: string;
  onChange: (v: string) => void;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const openPicker = () => {
    const el = ref.current as (HTMLInputElement & { showPicker?: () => void }) | null;
    if (!el) return;
    try {
      el.showPicker?.();
    } catch {
      el.focus();
    }
  };
  const display = value
    ? new Date(value + "T00:00:00").toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "Select date";

  return (
    <div
      className="hs-field"
      onClick={openPicker}
      style={{ position: "relative", flex: 1, minWidth: 0, textAlign: "left", padding: "10px 14px", cursor: "pointer" }}
    >
      <span style={fieldLabel}>{label}</span>
      <div
        style={{
          marginTop: 5,
          fontSize: 18,
          fontWeight: 600,
          color: value ? "#2c1b12" : "#a8957f",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {display}
      </div>
      <input
        ref={ref}
        type="date"
        value={value}
        min={min}
        onChange={(e) => onChange(e.target.value)}
        onClick={openPicker}
        aria-label={label}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          opacity: 0,
          border: "none",
          padding: 0,
          margin: 0,
          cursor: "pointer",
        }}
      />
    </div>
  );
}

export default function Hero() {
  const { openSearch } = useBooking();
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [adults, setAdults] = useState(2);

  const onSearch = () => openSearch({ checkIn, checkOut, guests: adults });

  return (
    <section
      id="top"
      style={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        overflow: "hidden",
        padding: "110px 7vw 60px",
        background:
          "radial-gradient(85% 55% at 50% 80%,rgba(248,206,128,0.95) 0%,rgba(229,138,56,0.6) 32%,rgba(181,83,31,0) 62%),linear-gradient(180deg,#5e9fd4 0%,#84b6df 16%,#b2cfe2 32%,#e2d9c0 46%,#f4c77e 58%,#e08a38 72%,#8e3b1e 88%,#3a1a12 100%)",
      }}
    >
      {/* Hero photo (/public/assets/hero/hero.jpg). If absent it hides itself and
          the sacred sunrise gradient on the <section> shows through instead. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/assets/hero/hero.jpg"
        alt="Snow-capped Panch Kedar peaks above the sanctuary"
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).style.display = "none";
        }}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          pointerEvents: "none",
        }}
      />
      {/* Sunrise-tinted scrim over the photo — keeps the warm palette and makes
          the white headline legible; darkens toward the silhouette at the base. */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background:
            "radial-gradient(80% 50% at 50% 82%,rgba(248,206,128,0.55) 0%,rgba(229,138,56,0.32) 34%,rgba(181,83,31,0) 64%)," +
            "linear-gradient(180deg,rgba(94,159,212,0.34) 0%,rgba(178,207,226,0.12) 30%,rgba(244,199,126,0.20) 52%,rgba(224,138,56,0.42) 72%,rgba(58,26,18,0.82) 100%)",
        }}
      />

      {/* floating Om */}
      <div
        className="hero-om"
        style={{
          position: "absolute",
          top: "14vh",
          left: "50%",
          transform: "translateX(-50%)",
          fontFamily: "var(--font-mukta), sans-serif",
          fontSize: 300,
          color: "rgba(255,240,210,0.07)",
          lineHeight: 1,
          animation: "omfloatx 9s ease-in-out infinite",
          pointerEvents: "none",
          userSelect: "none",
        }}
      >
        ॐ
      </div>

      <div style={{ position: "relative", zIndex: 2, padding: "0 7vw", maxWidth: 1000 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            justifyContent: "center",
            marginBottom: 26,
          }}
        >
          <span
            style={{
              height: 1,
              width: 48,
              background: "linear-gradient(90deg,transparent,rgba(255,238,205,0.8))",
            }}
          />
          <span
            style={{
              fontFamily: "var(--font-mukta), sans-serif",
              letterSpacing: ".34em",
              textTransform: "uppercase",
              fontSize: 12.5,
              color: "#fcebc4",
              fontWeight: 600,
            }}
          >
            Where Spirituality Meets the Himalayas
          </span>
          <span
            style={{
              height: 1,
              width: 48,
              background: "linear-gradient(90deg,rgba(255,238,205,0.8),transparent)",
            }}
          />
        </div>

        <h1
          style={{
            fontWeight: 600,
            color: "#fff9ee",
            fontSize: "clamp(44px,7vw,92px)",
            lineHeight: 1.04,
            letterSpacing: "-0.5px",
            textShadow: "0 4px 30px rgba(40,16,8,0.4)",
          }}
        >
          The Ultimate Destination
          <br />
          Towards Divinity
        </h1>

        <p
          style={{
            margin: "38px auto 0",
            maxWidth: 600,
            color: "rgba(255,247,235,0.92)",
            fontSize: 19,
            lineHeight: 1.65,
            fontWeight: 300,
          }}
        >
          A spiritual eco-sanctuary cradled in Devbhumi, with a front-row seat to the snow-capped
          Panch Kedar and the sacred peak of Nilkantha.
        </p>

        {/* ---------- Search widget (dates + adults + search) ---------- */}
        <div
          className="hero-search"
          style={{
            margin: "36px auto 0",
            maxWidth: 720,
            display: "flex",
            alignItems: "stretch",
            gap: 6,
            background: "rgba(255,249,238,0.95)",
            backdropFilter: "blur(8px)",
            borderRadius: 18,
            padding: 8,
            boxShadow: "0 18px 44px rgba(40,16,8,0.32)",
            border: "1px solid rgba(255,255,255,0.5)",
          }}
        >
          <DateField label="Check-in" value={checkIn} min={todayStr()} onChange={setCheckIn} />

          <span className="hs-divider" style={{ width: 1, background: "rgba(44,27,18,0.12)", alignSelf: "center", height: 36 }} />

          <DateField
            label="Check-out"
            value={checkOut}
            min={checkIn || todayStr()}
            onChange={setCheckOut}
          />

          <span className="hs-divider" style={{ width: 1, background: "rgba(44,27,18,0.12)", alignSelf: "center", height: 36 }} />

          <div
            className="hs-field"
            style={{ flex: "0 0 auto", textAlign: "left", padding: "10px 14px", minWidth: 130 }}
          >
            <span style={fieldLabel}>Adults</span>
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 3 }}>
              <button
                type="button"
                onClick={() => setAdults((a) => Math.max(1, a - 1))}
                className="qty-btn"
                aria-label="Fewer adults"
                style={miniQty}
              >
                −
              </button>
              <span style={{ fontSize: 19, fontWeight: 700, color: "#2c1b12", minWidth: 18, textAlign: "center" }}>
                {adults}
              </span>
              <button
                type="button"
                onClick={() => setAdults((a) => Math.min(12, a + 1))}
                className="qty-btn"
                aria-label="More adults"
                style={miniQty}
              >
                +
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={onSearch}
            className="btn btn-accent"
            style={{
              flex: "0 0 auto",
              cursor: "pointer",
              fontSize: 18,
              fontWeight: 700,
              letterSpacing: ".3px",
              padding: "0 34px",
              borderRadius: 13,
              display: "flex",
              alignItems: "center",
              gap: 10,
              boxShadow: "0 6px 18px rgba(217,119,43,0.32)",
            }}
          >
            <span style={{ fontSize: 26, lineHeight: 1 }}>⌕</span>
            Search
          </button>
        </div>

        {/* ---------- CTAs ---------- */}
        <div
          style={{
            display: "flex",
            gap: 16,
            justifyContent: "center",
            marginTop: 28,
            flexWrap: "wrap",
          }}
        >
          <a
            href="#experiences"
            className="btn-ghost btn-ghost-light"
            style={{
              textDecoration: "none",
              color: "#fff9ee",
              fontSize: 16,
              fontWeight: 600,
              letterSpacing: ".3px",
              padding: "16px 34px",
              borderRadius: 999,
              border: "1.5px solid rgba(255,249,238,0.55)",
            }}
          >
            Explore Experiences
          </a>
        </div>

        <p
          style={{
            marginTop: 36,
            fontFamily: "var(--font-mukta), sans-serif",
            letterSpacing: ".26em",
            textTransform: "uppercase",
            fontSize: 11.5,
            color: "rgba(255,243,222,0.78)",
            fontWeight: 500,
          }}
        >
          Dewar · Guptakashi · Rudraprayag · Uttarakhand
        </p>
      </div>
    </section>
  );
}

const miniQty: CSSProperties = {
  width: 32,
  height: 32,
  borderRadius: "50%",
  border: "1.5px solid rgba(44,27,18,0.2)",
  background: "#fff",
  cursor: "pointer",
  fontSize: 19,
  color: "#2c1b12",
  lineHeight: 1,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};
