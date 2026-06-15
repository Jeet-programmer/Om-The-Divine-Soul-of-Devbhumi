"use client";

import { useBooking } from "./BookingProvider";
import Logo from "./Logo";

const navItems = [
  { href: "/#about", label: "About" },
  { href: "/#sanctuary", label: "Sanctuary" },
  { href: "/#experiences", label: "Experiences" },
  { href: "/#stays", label: "Stays" },
  { href: "/#packages", label: "Packages" },
  { href: "/#venue", label: "Venue" },
  { href: "/#gallery", label: "Gallery" },
  { href: "/#contact", label: "Contact" },
];

export default function Header() {
  const { openStay } = useBooking();

  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 90,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "16px 7vw",
        background: "rgba(251,245,234,0.82)",
        backdropFilter: "blur(14px)",
        borderBottom: "1px solid rgba(44,27,18,0.08)",
      }}
    >
      <a
        href="/"
        style={{ display: "flex", alignItems: "center", gap: 13, textDecoration: "none" }}
      >
        <Logo size={48} />
        <span
          style={{
            fontFamily: "var(--font-cormorant), serif",
            fontSize: 21,
            fontWeight: 700,
            color: "#2c1b12",
            letterSpacing: ".02em",
            lineHeight: 1.12,
            maxWidth: 240,
          }}
        >
          OM The Divine Soul of Devbhumi
        </span>
      </a>

      <nav className="nav-links" style={{ display: "flex", alignItems: "center", gap: 34 }}>
        {navItems.map((n) => (
          <a
            key={n.href}
            href={n.href}
            style={{
              textDecoration: "none",
              color: "#4a3422",
              fontSize: 15,
              fontWeight: 500,
              letterSpacing: ".2px",
            }}
          >
            {n.label}
          </a>
        ))}
        <button
          onClick={openStay}
          className="btn btn-accent"
          style={{
            cursor: "pointer",
            fontSize: 14,
            fontWeight: 600,
            letterSpacing: ".3px",
            padding: "11px 22px",
            borderRadius: 999,
            whiteSpace: "nowrap",
            boxShadow: "0 4px 14px rgba(217,119,43,0.32)",
          }}
        >
          Book Your Stay
        </button>
      </nav>

      {/* mobile CTA (nav links hidden on small screens) */}
      <button
        onClick={openStay}
        className="btn btn-accent nav-mobile-cta"
        style={{
          display: "none",
          cursor: "pointer",
          fontSize: 14,
          fontWeight: 600,
          padding: "11px 22px",
          borderRadius: 999,
          whiteSpace: "nowrap",
          boxShadow: "0 4px 14px rgba(217,119,43,0.32)",
        }}
      >
        Book
      </button>
    </header>
  );
}
