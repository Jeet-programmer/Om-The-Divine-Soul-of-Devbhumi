"use client";

import { useState } from "react";

/**
 * The OM emblem. Renders /assets/logo/logo.png; if it's missing it falls back
 * to the gold ॐ badge from the original design so the header never breaks.
 */
export default function Logo({ size = 46 }: { size?: number }) {
  const [failed, setFailed] = useState(false);

  if (!failed) {
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img
        src="/assets/logo/logo.png"
        alt="OM — The Divine Soul of Devbhumi"
        width={size}
        height={size}
        onError={() => setFailed(true)}
        style={{
          width: size,
          height: size,
          objectFit: "contain",
          display: "block",
          flexShrink: 0,
        }}
      />
    );
  }

  return (
    <span
      style={{
        width: size,
        height: size,
        flexShrink: 0,
        borderRadius: "50%",
        border: "2px solid #c0922f",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "radial-gradient(circle at 50% 35%,#fbe9c2,#f2d89b)",
      }}
    >
      <span
        style={{
          fontFamily: "var(--font-mukta), sans-serif",
          fontSize: size * 0.52,
          color: "#9a3318",
          lineHeight: 1,
          marginTop: -2,
        }}
      >
        ॐ
      </span>
    </span>
  );
}
