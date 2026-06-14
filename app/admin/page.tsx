"use client";

import { CSSProperties, useEffect, useMemo, useRef, useState } from "react";
import { Booking, BookingStatus, Room } from "@/lib/types";
import { formatINR } from "@/lib/data";

/* ----------------------------- shared styles ----------------------------- */
const C = {
  bg: "#fbf5ea",
  panel: "#ffffff",
  ink: "#2c1b12",
  muted: "#9a8470",
  soft: "#6b5340",
  line: "rgba(44,27,18,0.12)",
  accent: "#d9772b",
  accentDark: "#c0651f",
  terra: "#8e3b1e",
  gold: "#b5862b",
};

const label: CSSProperties = {
  fontFamily: "var(--font-mukta), sans-serif",
  fontSize: 11,
  letterSpacing: ".1em",
  textTransform: "uppercase",
  color: C.muted,
  fontWeight: 700,
  display: "block",
  marginBottom: 6,
};
const input: CSSProperties = {
  width: "100%",
  border: `1.5px solid ${C.line}`,
  background: "#fff",
  borderRadius: 9,
  padding: "9px 11px",
  fontSize: 14,
  color: C.ink,
};
const btn: CSSProperties = {
  cursor: "pointer",
  border: "none",
  borderRadius: 9,
  padding: "9px 16px",
  fontSize: 13.5,
  fontWeight: 600,
  fontFamily: "var(--font-mukta), sans-serif",
};
const btnAccent: CSSProperties = { ...btn, background: C.accent, color: "#fff" };
const btnGhost: CSSProperties = {
  ...btn,
  background: "transparent",
  border: `1.5px solid ${C.line}`,
  color: C.soft,
};

/* ============================== ROOT PAGE ============================== */
export default function AdminPage() {
  const [tab, setTab] = useState<"rooms" | "bookings">("rooms");
  const [rooms, setRooms] = useState<Room[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadAll() {
    setLoading(true);
    setError("");
    try {
      const [r, b] = await Promise.all([
        fetch("/api/rooms").then((x) => x.json()),
        fetch("/api/bookings").then((x) => x.json()),
      ]);
      if (r.error) throw new Error(r.error);
      if (b.error) throw new Error(b.error);
      setRooms(r);
      setBookings(b);
    } catch (e) {
      setError((e as Error).message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAll();
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: C.bg,
        color: C.ink,
        fontFamily: "var(--font-mukta), sans-serif",
      }}
    >
      {/* top bar */}
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 10,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
          padding: "16px 28px",
          background: "rgba(251,245,234,0.9)",
          backdropFilter: "blur(12px)",
          borderBottom: `1px solid ${C.line}`,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/assets/logo/logo.png"
            alt=""
            width={40}
            height={40}
            style={{ objectFit: "contain" }}
            onError={(e) => ((e.currentTarget as HTMLImageElement).style.display = "none")}
          />
          <div style={{ lineHeight: 1.1 }}>
            <div style={{ fontFamily: "var(--font-cormorant), serif", fontSize: 22, fontWeight: 700 }}>
              OM Admin
            </div>
            <div style={{ fontSize: 10.5, letterSpacing: ".18em", textTransform: "uppercase", color: C.muted, fontWeight: 600 }}>
              OM The Divine Soul of Devbhumi
            </div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <button onClick={loadAll} style={btnGhost}>
            ↻ Refresh
          </button>
          <a href="/" style={{ ...btnGhost, textDecoration: "none", display: "inline-block" }}>
            View site →
          </a>
          <button
            onClick={async () => {
              await fetch("/api/admin/logout", { method: "POST" });
              window.location.href = "/admin/login";
            }}
            style={{ ...btnGhost, color: C.terra, borderColor: "rgba(142,59,30,0.35)" }}
          >
            Log out
          </button>
        </div>
      </header>

      {/* tabs */}
      <div style={{ display: "flex", gap: 8, padding: "22px 28px 0", maxWidth: 1200, margin: "0 auto", width: "100%" }}>
        {(["rooms", "bookings"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              ...btn,
              background: tab === t ? C.ink : "transparent",
              color: tab === t ? "#fbf0dc" : C.soft,
              border: tab === t ? "none" : `1.5px solid ${C.line}`,
              textTransform: "capitalize",
              padding: "10px 20px",
            }}
          >
            {t === "rooms" ? `Rooms & Retreats (${rooms.length})` : `Bookings (${bookings.length})`}
          </button>
        ))}
      </div>

      <main style={{ maxWidth: 1200, margin: "0 auto", padding: "24px 28px 80px" }}>
        {loading && <p style={{ color: C.muted }}>Loading…</p>}
        {error && (
          <p style={{ color: C.terra, fontWeight: 600 }}>
            {error} — is the database reachable? Check DB_URL in <code>.env</code>.
          </p>
        )}
        {!loading && !error && tab === "rooms" && (
          <RoomsTab rooms={rooms} setRooms={setRooms} />
        )}
        {!loading && !error && tab === "bookings" && (
          <BookingsTab bookings={bookings} setBookings={setBookings} />
        )}
      </main>
    </div>
  );
}

/* ============================== ROOMS TAB ============================== */
function RoomsTab({
  rooms,
  setRooms,
}: {
  rooms: Room[];
  setRooms: React.Dispatch<React.SetStateAction<Room[]>>;
}) {
  const [creating, setCreating] = useState(false);

  async function addRoom(category: "stay" | "retreat") {
    setCreating(true);
    try {
      const res = await fetch("/api/rooms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: category === "stay" ? "New Room" : "New Retreat",
          category,
          price: 0,
          quantity: 1,
          available: 1,
          tags: [],
          blurb: "",
          images: [],
          active: false,
          ...(category === "retreat" ? { nights: 3 } : {}),
        }),
      });
      const room = await res.json();
      if (room.error) throw new Error(room.error);
      setRooms((rs) => [...rs, room]);
    } catch (e) {
      alert((e as Error).message);
    } finally {
      setCreating(false);
    }
  }

  return (
    <div>
      <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
        <button disabled={creating} onClick={() => addRoom("stay")} style={btnAccent}>
          + Add stay
        </button>
        <button disabled={creating} onClick={() => addRoom("retreat")} style={{ ...btnAccent, background: C.terra }}>
          + Add retreat
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(360px,1fr))", gap: 20 }}>
        {rooms.map((room) => (
          <RoomCard
            key={room._id}
            room={room}
            onSaved={(updated) => setRooms((rs) => rs.map((r) => (r._id === updated._id ? updated : r)))}
            onDeleted={(id) => setRooms((rs) => rs.filter((r) => r._id !== id))}
          />
        ))}
      </div>
    </div>
  );
}

function RoomCard({
  room,
  onSaved,
  onDeleted,
}: {
  room: Room;
  onSaved: (r: Room) => void;
  onDeleted: (id: string) => void;
}) {
  const [draft, setDraft] = useState({
    name: room.name,
    category: room.category,
    price: String(room.price),
    nights: room.nights != null ? String(room.nights) : "",
    quantity: String(room.quantity),
    available: String(room.available),
    capacity: String(room.capacity ?? 2),
    extraBedAllowed: room.extraBedAllowed ?? false,
    extraBedPrice: String(room.extraBedPrice ?? 0),
    active: room.active,
    tags: room.tags.join(", "),
    blurb: room.blurb,
  });
  const [images, setImages] = useState<string[]>(room.images);
  const [saving, setSaving] = useState(false);
  const [savedTick, setSavedTick] = useState(false);
  const [imgUrl, setImgUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const set = (k: keyof typeof draft, v: string | boolean) =>
    setDraft((d) => ({ ...d, [k]: v }));

  async function save() {
    setSaving(true);
    try {
      const res = await fetch(`/api/rooms/${room._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: draft.name,
          category: draft.category,
          price: Number(draft.price) || 0,
          nights: draft.category === "retreat" ? Number(draft.nights) || 0 : undefined,
          quantity: Number(draft.quantity) || 0,
          available: Number(draft.available) || 0,
          capacity: Number(draft.capacity) || 1,
          extraBedAllowed: draft.extraBedAllowed,
          extraBedPrice: draft.extraBedAllowed ? Number(draft.extraBedPrice) || 0 : 0,
          active: draft.active,
          tags: draft.tags.split(",").map((t) => t.trim()).filter(Boolean),
          blurb: draft.blurb,
        }),
      });
      const updated = await res.json();
      if (updated.error) throw new Error(updated.error);
      onSaved(updated);
      setSavedTick(true);
      setTimeout(() => setSavedTick(false), 1600);
    } catch (e) {
      alert((e as Error).message);
    } finally {
      setSaving(false);
    }
  }

  async function remove() {
    if (!confirm(`Delete "${room.name}"? This cannot be undone.`)) return;
    const res = await fetch(`/api/rooms/${room._id}`, { method: "DELETE" });
    const out = await res.json();
    if (out.error) return alert(out.error);
    onDeleted(room._id);
  }

  async function attachImage(path: string) {
    const res = await fetch(`/api/rooms/${room._id}/images`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ image: path }),
    });
    const updated = await res.json();
    if (updated.error) return alert(updated.error);
    setImages(updated.images);
    onSaved(updated);
  }

  async function onFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setUploading(true);
    try {
      let latest: Room | undefined;
      for (const file of files) {
        const fd = new FormData();
        fd.append("file", file);
        const up = await fetch("/api/upload", { method: "POST", body: fd }).then((x) => x.json());
        if (up.error) throw new Error(up.error);
        const res = await fetch(`/api/rooms/${room._id}/images`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image: up.path }),
        });
        latest = await res.json();
        if ((latest as unknown as { error?: string }).error) {
          throw new Error((latest as unknown as { error: string }).error);
        }
        setImages(latest!.images);
      }
      if (latest) onSaved(latest);
    } catch (err) {
      alert((err as Error).message);
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  async function removeImage(path: string) {
    const res = await fetch(`/api/rooms/${room._id}/images?image=${encodeURIComponent(path)}`, {
      method: "DELETE",
    });
    const updated = await res.json();
    if (updated.error) return alert(updated.error);
    setImages(updated.images);
    onSaved(updated);
  }

  return (
    <div
      style={{
        background: C.panel,
        borderRadius: 16,
        border: `1px solid ${C.line}`,
        boxShadow: "0 6px 20px rgba(44,27,18,0.05)",
        padding: 20,
        display: "flex",
        flexDirection: "column",
        gap: 14,
        opacity: draft.active ? 1 : 0.82,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
        <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span
            style={{
              fontSize: 10.5,
              letterSpacing: ".12em",
              textTransform: "uppercase",
              fontWeight: 700,
              color: draft.category === "retreat" ? C.terra : C.gold,
            }}
          >
            {draft.category}
          </span>
          <a
            href={`/rooms/${room.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ fontSize: 12, color: C.muted, textDecoration: "none", fontWeight: 600 }}
          >
            ↗ View page
          </a>
        </span>
        <label style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 13, color: C.soft, cursor: "pointer" }}>
          <input type="checkbox" checked={draft.active} onChange={(e) => set("active", e.target.checked)} />
          Live on site
        </label>
      </div>

      {/* images */}
      <div>
        <span style={label}>Images</span>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {images.map((src) => (
            <div key={src} style={{ position: "relative" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt=""
                width={72}
                height={56}
                style={{ width: 72, height: 56, objectFit: "cover", borderRadius: 7, border: `1px solid ${C.line}` }}
                onError={(e) => ((e.currentTarget as HTMLImageElement).style.opacity = "0.25")}
              />
              <button
                onClick={() => removeImage(src)}
                title="Remove image"
                style={{
                  position: "absolute",
                  top: -7,
                  right: -7,
                  width: 20,
                  height: 20,
                  borderRadius: "50%",
                  border: "none",
                  background: C.terra,
                  color: "#fff",
                  cursor: "pointer",
                  fontSize: 13,
                  lineHeight: 1,
                }}
              >
                ×
              </button>
            </div>
          ))}
          {images.length === 0 && (
            <span style={{ fontSize: 12.5, color: C.muted }}>No images yet</span>
          )}
        </div>

        <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            multiple
            onChange={onFiles}
            style={{ display: "none" }}
          />
          <button onClick={() => fileRef.current?.click()} disabled={uploading} style={btnGhost}>
            {uploading ? "Uploading…" : "⬆ Upload image(s)"}
          </button>
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
          <input
            value={imgUrl}
            onChange={(e) => setImgUrl(e.target.value)}
            placeholder="…or paste an image URL / path"
            style={{ ...input, fontSize: 13 }}
          />
          <button
            onClick={() => {
              if (imgUrl.trim()) {
                attachImage(imgUrl.trim());
                setImgUrl("");
              }
            }}
            style={btnGhost}
          >
            Add
          </button>
        </div>
      </div>

      {/* fields */}
      <div>
        <span style={label}>Name</span>
        <input value={draft.name} onChange={(e) => set("name", e.target.value)} style={input} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div>
          <span style={label}>Category</span>
          <select
            value={draft.category}
            onChange={(e) => set("category", e.target.value as "stay" | "retreat")}
            style={input}
          >
            <option value="stay">stay</option>
            <option value="retreat">retreat</option>
          </select>
        </div>
        <div>
          <span style={label}>Price (₹ {draft.category === "retreat" ? "/ person" : "/ night"})</span>
          <input type="number" value={draft.price} onChange={(e) => set("price", e.target.value)} style={input} />
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: draft.category === "retreat" ? "1fr 1fr 1fr" : "1fr 1fr", gap: 12 }}>
        {draft.category === "retreat" && (
          <div>
            <span style={label}>Nights</span>
            <input type="number" value={draft.nights} onChange={(e) => set("nights", e.target.value)} style={input} />
          </div>
        )}
        <div>
          <span style={label}>Total units</span>
          <input type="number" value={draft.quantity} onChange={(e) => set("quantity", e.target.value)} style={input} />
        </div>
        <div>
          <span style={label}>Available</span>
          <input type="number" value={draft.available} onChange={(e) => set("available", e.target.value)} style={input} />
        </div>
      </div>

      {draft.category === "stay" && (
        <div style={{ background: "#faf3e6", border: `1px solid ${C.line}`, borderRadius: 11, padding: 14 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <span style={label}>Sleeps (guests / room)</span>
              <input type="number" min={1} value={draft.capacity} onChange={(e) => set("capacity", e.target.value)} style={input} />
            </div>
            <div style={{ display: "flex", alignItems: "flex-end" }}>
              <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: C.soft, cursor: "pointer", paddingBottom: 9 }}>
                <input
                  type="checkbox"
                  checked={draft.extraBedAllowed}
                  onChange={(e) => set("extraBedAllowed", e.target.checked)}
                />
                Allow extra bed
              </label>
            </div>
          </div>
          {draft.extraBedAllowed && (
            <div style={{ marginTop: 12 }}>
              <span style={label}>Extra bed price (₹ / night each)</span>
              <input type="number" value={draft.extraBedPrice} onChange={(e) => set("extraBedPrice", e.target.value)} style={input} />
            </div>
          )}
          <p style={{ margin: "8px 2px 0", fontSize: 11.5, color: C.muted }}>
            Bookings auto-calculate rooms = ⌈guests ÷ sleeps⌉. Extra beds are offered only when allowed.
          </p>
        </div>
      )}

      <div>
        <span style={label}>Tags (comma separated)</span>
        <input value={draft.tags} onChange={(e) => set("tags", e.target.value)} style={input} />
      </div>

      <div>
        <span style={label}>Description</span>
        <textarea
          value={draft.blurb}
          onChange={(e) => set("blurb", e.target.value)}
          rows={3}
          style={{ ...input, resize: "vertical" }}
        />
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 4 }}>
        <button onClick={remove} style={{ ...btnGhost, color: C.terra, borderColor: "rgba(142,59,30,0.4)" }}>
          Delete
        </button>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          {savedTick && <span style={{ color: "#5f8a3f", fontSize: 13, fontWeight: 600 }}>Saved ✓</span>}
          <button onClick={save} disabled={saving} style={btnAccent}>
            {saving ? "Saving…" : "Save changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ============================== BOOKINGS TAB ============================== */
const STATUS_COLORS: Record<BookingStatus, string> = {
  pending: "#b5862b",
  confirmed: "#5f8a3f",
  cancelled: "#8e3b1e",
};

function BookingsTab({
  bookings,
  setBookings,
}: {
  bookings: Booking[];
  setBookings: React.Dispatch<React.SetStateAction<Booking[]>>;
}) {
  const stats = useMemo(() => {
    const total = bookings.length;
    const pending = bookings.filter((b) => b.status === "pending").length;
    const confirmed = bookings.filter((b) => b.status === "confirmed").length;
    const revenue = bookings
      .filter((b) => b.status !== "cancelled")
      .reduce((sum, b) => sum + (b.total || 0), 0);
    return { total, pending, confirmed, revenue };
  }, [bookings]);

  async function setStatus(id: string, status: BookingStatus) {
    const res = await fetch(`/api/bookings/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    const updated = await res.json();
    if (updated.error) return alert(updated.error);
    setBookings((bs) => bs.map((b) => (b._id === id ? updated : b)));
  }

  async function remove(id: string) {
    if (!confirm("Delete this booking?")) return;
    const res = await fetch(`/api/bookings/${id}`, { method: "DELETE" });
    const out = await res.json();
    if (out.error) return alert(out.error);
    setBookings((bs) => bs.filter((b) => b._id !== id));
  }

  const cell: CSSProperties = { padding: "12px 14px", fontSize: 13.5, color: C.soft, verticalAlign: "top" };
  const th: CSSProperties = {
    padding: "10px 14px",
    fontSize: 10.5,
    letterSpacing: ".1em",
    textTransform: "uppercase",
    color: C.muted,
    fontWeight: 700,
    textAlign: "left",
    borderBottom: `1px solid ${C.line}`,
    whiteSpace: "nowrap",
  };

  return (
    <div>
      {/* stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 14, marginBottom: 24 }}>
        {[
          { k: "Total bookings", v: String(stats.total) },
          { k: "Pending", v: String(stats.pending) },
          { k: "Confirmed", v: String(stats.confirmed) },
          { k: "Revenue (excl. cancelled)", v: formatINR(stats.revenue) },
        ].map((s) => (
          <div key={s.k} style={{ background: C.panel, border: `1px solid ${C.line}`, borderRadius: 14, padding: "18px 20px" }}>
            <div style={{ fontFamily: "var(--font-cormorant), serif", fontSize: 30, fontWeight: 700, color: C.accentDark }}>
              {s.v}
            </div>
            <div style={{ fontSize: 11, letterSpacing: ".1em", textTransform: "uppercase", color: C.muted, fontWeight: 600, marginTop: 2 }}>
              {s.k}
            </div>
          </div>
        ))}
      </div>

      {bookings.length === 0 ? (
        <p style={{ color: C.muted }}>No bookings yet. They&rsquo;ll appear here as guests reserve through the site.</p>
      ) : (
        <div style={{ background: C.panel, border: `1px solid ${C.line}`, borderRadius: 14, overflow: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 900 }}>
            <thead>
              <tr>
                <th style={th}>Ref</th>
                <th style={th}>Guest</th>
                <th style={th}>Offering</th>
                <th style={th}>Dates</th>
                <th style={th}>Party</th>
                <th style={th}>Total</th>
                <th style={th}>Status</th>
                <th style={th}>Booked</th>
                <th style={th}></th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b._id} style={{ borderBottom: `1px solid ${C.line}` }}>
                  <td style={{ ...cell, fontFamily: "var(--font-cormorant), serif", fontWeight: 700, color: C.accentDark }}>
                    {b.ref}
                  </td>
                  <td style={cell}>
                    <div style={{ fontWeight: 600, color: C.ink }}>{b.name}</div>
                    <div>{b.email}</div>
                    <div>{b.phone}</div>
                    {b.notes && <div style={{ marginTop: 4, fontStyle: "italic", color: C.muted }}>“{b.notes}”</div>}
                  </td>
                  <td style={cell}>
                    <div style={{ color: C.ink }}>{b.roomName || "—"}</div>
                    <div style={{ fontSize: 11.5, color: C.muted, textTransform: "capitalize" }}>{b.category}</div>
                  </td>
                  <td style={cell}>
                    {b.checkIn || "—"}
                    {b.checkOut ? ` → ${b.checkOut}` : ""}
                    {b.nights ? <div style={{ fontSize: 11.5, color: C.muted }}>{b.nights} night(s)</div> : null}
                  </td>
                  <td style={cell}>
                    <div>{b.guests} guest{b.guests > 1 ? "s" : ""}</div>
                    {b.rooms ? (
                      <div style={{ fontSize: 11.5, color: C.muted }}>
                        {b.rooms} room{b.rooms > 1 ? "s" : ""}
                      </div>
                    ) : null}
                    {b.extraBeds ? (
                      <div style={{ fontSize: 11.5, color: C.muted }}>
                        +{b.extraBeds} extra bed{b.extraBeds > 1 ? "s" : ""}
                      </div>
                    ) : null}
                  </td>
                  <td style={{ ...cell, color: C.ink }}>
                    <div style={{ fontWeight: 600 }}>{formatINR(b.total)}</div>
                    {(() => {
                      const ps = b.paymentStatus || "unpaid";
                      const color = ps === "paid" ? "#5f8a3f" : ps === "partial" ? "#b5862b" : "#b5531f";
                      const labelText =
                        ps === "paid"
                          ? "Paid in full"
                          : ps === "partial"
                          ? `50% paid · ${formatINR(b.amountPaid || 0)}`
                          : "Unpaid";
                      return (
                        <div style={{ fontSize: 11.5, fontWeight: 600, color, marginTop: 2 }}>
                          {labelText}
                          {ps === "partial" && (
                            <div style={{ color: C.muted, fontWeight: 400 }}>
                              Bal {formatINR((b.total || 0) - (b.amountPaid || 0))}
                            </div>
                          )}
                        </div>
                      );
                    })()}
                  </td>
                  <td style={cell}>
                    <select
                      value={b.status}
                      onChange={(e) => setStatus(b._id, e.target.value as BookingStatus)}
                      style={{
                        ...input,
                        width: "auto",
                        padding: "6px 9px",
                        fontWeight: 600,
                        color: STATUS_COLORS[b.status],
                        borderColor: STATUS_COLORS[b.status],
                      }}
                    >
                      <option value="pending">pending</option>
                      <option value="confirmed">confirmed</option>
                      <option value="cancelled">cancelled</option>
                    </select>
                  </td>
                  <td style={{ ...cell, whiteSpace: "nowrap" }}>
                    {b.createdAt ? new Date(b.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" }) : "—"}
                  </td>
                  <td style={cell}>
                    <button onClick={() => remove(b._id)} title="Delete" style={{ ...btnGhost, padding: "6px 10px", color: C.terra }}>
                      ×
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
