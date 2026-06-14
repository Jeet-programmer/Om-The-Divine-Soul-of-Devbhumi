"use client";

import { CSSProperties, useState } from "react";

interface SmartImageProps {
  src: string;
  alt: string;
  /** Text shown inside the placeholder tile when the image is missing */
  placeholder: string;
  className?: string;
  style?: CSSProperties;
  /** Override the placeholder tile background (e.g. dark variant) */
  placeholderStyle?: CSSProperties;
  placeholderLabelStyle?: CSSProperties;
  /** position of the label inside the tile */
  labelAlign?: "center" | "start";
}

/**
 * Renders a real <img>; if the file is missing (user hasn't dropped it in
 * /public/assets yet) it falls back to the elegant labeled placeholder tile
 * used throughout the design — so the site never looks broken.
 */
export default function SmartImage({
  src,
  alt,
  placeholder,
  className,
  style,
  placeholderStyle,
  placeholderLabelStyle,
  labelAlign = "center",
}: SmartImageProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        className={className}
        style={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: labelAlign === "center" ? "center" : "flex-start",
          background:
            "repeating-linear-gradient(45deg,#eadfc9,#eadfc9 11px,#e4d7bd 11px,#e4d7bd 22px)",
          ...style,
          ...placeholderStyle,
        }}
      >
        <span
          style={{
            fontFamily: "monospace",
            fontSize: 12,
            letterSpacing: ".1em",
            color: "#8b7656",
            background: "rgba(251,245,234,0.85)",
            padding: "7px 12px",
            borderRadius: 6,
            margin: labelAlign === "center" ? "0 0 18px" : 14,
            ...placeholderLabelStyle,
          }}
        >
          {placeholder}
        </span>
      </div>
    );
  }

  // eslint-disable-next-line @next/next/no-img-element
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      style={{ objectFit: "cover", ...style }}
      onError={() => setFailed(true)}
    />
  );
}
