"use client";

import { CSSProperties, useEffect, useState } from "react";
import SmartImage from "./SmartImage";

export default function RoomGallery({
  images,
  name,
}: {
  images: string[];
  name: string;
}) {
  const imgs = images && images.length ? images : [""];
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  const clampedActive = Math.min(active, imgs.length - 1);

  const go = (dir: number) =>
    setActive((i) => (i + dir + imgs.length) % imgs.length);

  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(false);
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lightbox, imgs.length]);

  return (
    <div>
      {/* main image */}
      <div
        onClick={() => imgs[clampedActive] && setLightbox(true)}
        style={{
          position: "relative",
          borderRadius: 18,
          overflow: "hidden",
          cursor: imgs[clampedActive] ? "zoom-in" : "default",
          boxShadow: "0 18px 44px rgba(44,27,18,0.14)",
          border: "1px solid rgba(44,27,18,0.08)",
        }}
      >
        <SmartImage
          src={imgs[clampedActive]}
          alt={`${name} — photo ${clampedActive + 1}`}
          placeholder={`[ ${name} ]`}
          labelAlign="center"
          style={{ width: "100%", aspectRatio: "16 / 10" }}
        />
        {imgs.length > 1 && (
          <span
            style={{
              position: "absolute",
              bottom: 12,
              right: 14,
              fontFamily: "var(--font-mukta), sans-serif",
              fontSize: 12,
              fontWeight: 600,
              color: "#fff",
              background: "rgba(28,14,8,0.6)",
              backdropFilter: "blur(4px)",
              padding: "5px 11px",
              borderRadius: 999,
            }}
          >
            {clampedActive + 1} / {imgs.length}
          </span>
        )}
      </div>

      {/* thumbnails */}
      {imgs.length > 1 && (
        <div style={{ display: "flex", gap: 10, marginTop: 12, flexWrap: "wrap" }}>
          {imgs.map((src, i) => (
            <button
              key={src + i}
              onClick={() => setActive(i)}
              aria-label={`View photo ${i + 1}`}
              style={{
                padding: 0,
                border: i === clampedActive ? "2px solid #d9772b" : "2px solid transparent",
                borderRadius: 11,
                overflow: "hidden",
                cursor: "pointer",
                background: "none",
                lineHeight: 0,
                boxShadow: "0 4px 12px rgba(44,27,18,0.08)",
              }}
            >
              <SmartImage
                src={src}
                alt={`${name} thumbnail ${i + 1}`}
                placeholder="[ … ]"
                labelAlign="center"
                style={{ width: 92, height: 64 }}
              />
            </button>
          ))}
        </div>
      )}

      {/* lightbox */}
      {lightbox && (
        <div
          onClick={() => setLightbox(false)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 300,
            background: "rgba(16,9,5,0.92)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 24,
            animation: "fadeUp .2s ease",
          }}
        >
          <button
            onClick={() => setLightbox(false)}
            aria-label="Close"
            style={{ ...lbBtn, top: 20, right: 24, position: "fixed" }}
          >
            ×
          </button>
          {imgs.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  go(-1);
                }}
                aria-label="Previous"
                style={{ ...lbBtn, left: 20 }}
              >
                ‹
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  go(1);
                }}
                aria-label="Next"
                style={{ ...lbBtn, right: 20 }}
              >
                ›
              </button>
            </>
          )}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imgs[clampedActive]}
            alt={`${name} — photo ${clampedActive + 1}`}
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: "92vw",
              maxHeight: "88vh",
              objectFit: "contain",
              borderRadius: 10,
              boxShadow: "0 30px 80px rgba(0,0,0,0.6)",
            }}
          />
        </div>
      )}
    </div>
  );
}

const lbBtn: CSSProperties = {
  position: "fixed",
  top: "50%",
  transform: "translateY(-50%)",
  zIndex: 310,
  width: 48,
  height: 48,
  borderRadius: "50%",
  border: "none",
  background: "rgba(255,255,255,0.14)",
  color: "#fff",
  fontSize: 30,
  lineHeight: 1,
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};
