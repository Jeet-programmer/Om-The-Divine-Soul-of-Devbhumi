"use client";

import { CSSProperties, useState } from "react";

const input: CSSProperties = {
  width: "100%",
  border: "1.5px solid rgba(44,27,18,0.16)",
  background: "#fff",
  borderRadius: 11,
  padding: "13px 14px",
  fontSize: 15,
  color: "#2c1b12",
};
const label: CSSProperties = {
  fontFamily: "var(--font-mukta), sans-serif",
  fontSize: 12,
  letterSpacing: ".1em",
  textTransform: "uppercase",
  color: "#9a8470",
  fontWeight: 600,
  display: "block",
  marginBottom: 7,
};

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Login failed");
      }
      const from = new URLSearchParams(window.location.search).get("from");
      window.location.href = from && from.startsWith("/admin") ? from : "/admin";
    } catch (err) {
      setError((err as Error).message);
      setBusy(false);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        background:
          "radial-gradient(70% 50% at 50% 12%,rgba(248,206,128,0.35) 0%,rgba(229,138,56,0) 60%),#fbf5ea",
        fontFamily: "var(--font-mukta), sans-serif",
      }}
    >
      <form
        onSubmit={submit}
        style={{
          width: "100%",
          maxWidth: 400,
          background: "#fff",
          borderRadius: 20,
          border: "1px solid rgba(44,27,18,0.08)",
          boxShadow: "0 24px 60px rgba(44,27,18,0.14)",
          padding: "38px 34px",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 26 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/assets/logo/logo.png"
            alt=""
            width={64}
            height={64}
            style={{ objectFit: "contain", margin: "0 auto 12px", display: "block" }}
            onError={(e) => ((e.currentTarget as HTMLImageElement).style.display = "none")}
          />
          <h1
            style={{
              fontFamily: "var(--font-cormorant), serif",
              fontSize: 28,
              fontWeight: 700,
              color: "#2c1b12",
            }}
          >
            Admin Sign In
          </h1>
          <p style={{ fontSize: 13.5, color: "#9a8470", marginTop: 4 }}>
            OM The Divine Soul of Devbhumi
          </p>
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={label}>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@email.com"
            autoComplete="username"
            style={input}
            required
          />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={label}>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            autoComplete="current-password"
            style={input}
            required
          />
        </div>

        {error && (
          <p style={{ color: "#b5531f", fontSize: 13.5, fontWeight: 500, marginBottom: 14 }}>
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={busy}
          style={{
            width: "100%",
            border: "none",
            cursor: busy ? "wait" : "pointer",
            background: "#d9772b",
            color: "#fff",
            fontSize: 15,
            fontWeight: 600,
            padding: "14px",
            borderRadius: 999,
            boxShadow: "0 6px 18px rgba(217,119,43,0.3)",
            opacity: busy ? 0.75 : 1,
          }}
        >
          {busy ? "Signing in…" : "Sign In"}
        </button>

        <a
          href="/"
          style={{
            display: "block",
            textAlign: "center",
            marginTop: 18,
            fontSize: 13,
            color: "#9a8470",
            textDecoration: "none",
          }}
        >
          ← Back to site
        </a>
      </form>
    </div>
  );
}
