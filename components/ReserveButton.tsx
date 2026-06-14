"use client";

import { CSSProperties } from "react";
import { Category } from "@/lib/types";
import { useBooking } from "./BookingProvider";

export default function ReserveButton({
  slug,
  category,
  available,
  active,
  label = "Reserve this stay",
  style,
}: {
  slug: string;
  category: Category;
  available: number;
  active: boolean;
  label?: string;
  style?: CSSProperties;
}) {
  const { openStayWith, openRetreatWith } = useBooking();
  const disabled = available <= 0 || !active;

  const open = () => {
    if (disabled) return;
    if (category === "retreat") openRetreatWith(slug);
    else openStayWith(slug);
  };

  const text = !active ? "Currently unavailable" : available <= 0 ? "Fully booked" : label;

  return (
    <button
      onClick={open}
      disabled={disabled}
      className={disabled ? undefined : "btn btn-accent"}
      style={{
        border: "none",
        cursor: disabled ? "not-allowed" : "pointer",
        background: disabled ? "rgba(217,119,43,0.4)" : "#d9772b",
        color: "#fff",
        fontSize: 16,
        fontWeight: 600,
        letterSpacing: ".3px",
        padding: "15px 32px",
        borderRadius: 999,
        boxShadow: disabled ? "none" : "0 8px 22px rgba(217,119,43,0.3)",
        ...style,
      }}
    >
      {text}
    </button>
  );
}
