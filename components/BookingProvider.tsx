"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  CSSProperties,
} from "react";
import { formatINR } from "@/lib/data";
import { Category, Room } from "@/lib/types";
import Logo from "./Logo";

interface Prefill {
  checkIn?: string;
  checkOut?: string;
  guests?: number;
}

interface BookingContextValue {
  /** active stays, from the database */
  stays: Room[];
  /** active retreats, from the database */
  retreats: Room[];
  openStay: () => void;
  openRetreat: () => void;
  /** Pre-select a specific stay/retreat by slug and jump in */
  openStayWith: (slug: string) => void;
  openRetreatWith: (slug: string) => void;
  /** From the hero search widget — prefill dates/guests, skip to selection */
  openSearch: (prefill: Prefill) => void;
}

const BookingContext = createContext<BookingContextValue | null>(null);

export function useBooking(): BookingContextValue {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error("useBooking must be used within <BookingProvider>");
  return ctx;
}

const todayStr = () => new Date().toISOString().slice(0, 10);

interface Errors {
  name?: string;
  email?: string;
  phone?: string;
}
interface ConfSnapshot {
  name: string;
  email: string;
  item: string;
  total: number;
  dates: string;
}

export default function BookingProvider({
  children,
  rooms,
}: {
  children: React.ReactNode;
  rooms: Room[];
}) {
  const stays = useMemo(
    () => rooms.filter((r) => r.category === "stay" && r.active),
    [rooms]
  );
  const retreats = useMemo(
    () => rooms.filter((r) => r.category === "retreat" && r.active),
    [rooms]
  );

  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [category, setCategory] = useState<Category>("stay");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(2);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [step1Error, setStep1Error] = useState("");
  const [step2Error, setStep2Error] = useState("");
  const [bookingRef, setBookingRef] = useState("");
  const [confSnapshot, setConfSnapshot] = useState<ConfSnapshot | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [roomCount, setRoomCount] = useState(1);
  const [extraBeds, setExtraBeds] = useState(0);

  const isStay = category === "stay";
  const isRetreat = category === "retreat";

  // lock body scroll while modal is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const resetState = useCallback((cat: Category, prefill?: Prefill, id?: string) => {
    setStep(1);
    setCategory(cat);
    setSelectedId(id ?? null);
    setCheckIn(prefill?.checkIn ?? "");
    setCheckOut(prefill?.checkOut ?? "");
    setGuests(prefill?.guests ?? 2);
    setRoomCount(1);
    setExtraBeds(0);
    setErrors({});
    setStep1Error("");
    setStep2Error("");
    setConfSnapshot(null);
  }, []);

  const openStay = useCallback(() => {
    resetState("stay");
    setOpen(true);
  }, [resetState]);

  const openRetreat = useCallback(() => {
    resetState("retreat");
    setOpen(true);
  }, [resetState]);

  const openStayWith = useCallback(
    (id: string) => {
      resetState("stay", undefined, id);
      setOpen(true);
    },
    [resetState]
  );

  const openRetreatWith = useCallback(
    (id: string) => {
      resetState("retreat", undefined, id);
      setOpen(true);
    },
    [resetState]
  );

  const openSearch = useCallback(
    (prefill: Prefill) => {
      resetState("stay", prefill);
      // if both dates are present and valid, jump straight to selection
      const valid =
        prefill.checkIn &&
        prefill.checkOut &&
        new Date(prefill.checkOut) > new Date(prefill.checkIn);
      setStep(valid ? 2 : 1);
      setOpen(true);
    },
    [resetState]
  );

  const close = useCallback(() => setOpen(false), []);

  const fullReset = useCallback(() => {
    resetState("stay");
    setName("");
    setEmail("");
    setPhone("");
    setNotes("");
    setBookingRef("");
  }, [resetState]);

  // ----- derived -----
  const list = isRetreat ? retreats : stays;
  const selected = list.find((x) => x.slug === selectedId) || null;

  const nights = useMemo(() => {
    if (isRetreat) return selected?.nights ?? 0;
    if (checkIn && checkOut) {
      const d = (new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86400000;
      return d > 0 ? Math.round(d) : 0;
    }
    return 0;
  }, [isRetreat, selected, checkIn, checkOut]);

  // suggested rooms for a party (= ceil(guests / capacity)); the user can adjust
  const suggestedRooms = useMemo(() => {
    if (isRetreat || !selected) return 0;
    const cap = Math.max(1, selected.capacity || 1);
    return Math.max(1, Math.ceil(guests / cap));
  }, [isRetreat, selected, guests]);

  // when the chosen stay or party size changes, reset rooms to the suggestion
  // (clamped to availability) and clear extra beds — the user adjusts from there
  useEffect(() => {
    if (isRetreat || !selected) return;
    const cap = Math.max(1, selected.available);
    setRoomCount(Math.min(Math.max(1, suggestedRooms), cap));
    setExtraBeds(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRetreat, selectedId, suggestedRooms]);

  const maxRooms = selected ? Math.max(1, selected.available) : 1;
  // one extra bed per room max, only when the room type allows it
  const maxExtraBeds = selected?.extraBedAllowed && !isRetreat ? roomCount : 0;
  const effectiveExtraBeds = Math.min(extraBeds, maxExtraBeds);
  // each extra bed lifts occupancy by 1
  const occupancy = isRetreat
    ? guests
    : roomCount * (selected?.capacity || 1) + effectiveExtraBeds;

  const incRooms = () => setRoomCount((r) => Math.min(maxRooms, r + 1));
  const decRooms = () =>
    setRoomCount((r) => {
      const n = Math.max(1, r - 1);
      // keep extra beds within one-per-room
      setExtraBeds((b) => Math.min(b, selected?.extraBedAllowed ? n : 0));
      return n;
    });
  const incBed = () => setExtraBeds((b) => Math.min(maxExtraBeds, b + 1));
  const decBed = () => setExtraBeds((b) => Math.max(0, b - 1));

  const total = useMemo(() => {
    if (!selected) return 0;
    if (isRetreat) return selected.price * guests;
    const n = nights || 1;
    const bedPrice = selected.extraBedAllowed ? selected.extraBedPrice : 0;
    return selected.price * roomCount * n + effectiveExtraBeds * bedPrice * n;
  }, [selected, isRetreat, guests, nights, roomCount, effectiveExtraBeds]);

  const datesLabel = useMemo(() => {
    const opt: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" };
    if (isRetreat) {
      if (!checkIn) return "Dates flexible";
      const start = new Date(checkIn);
      const r = selected;
      const end = r?.nights
        ? new Date(start.getTime() + r.nights * 86400000)
        : null;
      return (
        start.toLocaleDateString("en-IN", opt) +
        (end ? " – " + end.toLocaleDateString("en-IN", opt) : "")
      );
    }
    if (checkIn && checkOut) {
      return (
        new Date(checkIn).toLocaleDateString("en-IN", opt) +
        " – " +
        new Date(checkOut).toLocaleDateString("en-IN", opt)
      );
    }
    return "Select dates";
  }, [isRetreat, checkIn, checkOut, selected]);

  // ----- step actions -----
  const next = () => {
    if (step === 1) {
      if (isStay) {
        if (!checkIn || !checkOut)
          return setStep1Error("Please choose your check-in and check-out dates.");
        if (nights <= 0) return setStep1Error("Check-out must be after check-in.");
      } else {
        if (!checkIn) return setStep1Error("Please choose your preferred start date.");
      }
      setStep1Error("");
      setStep(2);
      return;
    }
    if (step === 2) {
      if (!selectedId) return setStep2Error("Please select an option to continue.");
      if (selected && isRetreat && selected.available < guests) {
        return setStep2Error(
          `Only ${selected.available} seats remain on this retreat for your party of ${guests}.`
        );
      }
      setStep2Error("");
      setStep(3);
    }
  };

  const back = () => setStep((s) => Math.max(1, s - 1));

  const confirm = async () => {
    const e: Errors = {};
    if (!name.trim()) e.name = "Please enter your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
      e.email = "Enter a valid email address.";
    if (!/^\d{10}$/.test(phone.replace(/\D/g, "")))
      e.phone = "Enter a valid 10-digit phone number.";
    if (Object.keys(e).length) return setErrors(e);
    if (isStay && occupancy < guests) {
      return setSubmitError(
        `This selection sleeps ${occupancy}, but you have ${guests} guests. Add a room or an extra bed.`
      );
    }
    setErrors({});
    setSubmitError("");
    setSubmitting(true);

    const ref = "OM-" + Math.random().toString(36).slice(2, 7).toUpperCase();
    // for retreats the checkout is derived from the fixed length
    const computedCheckOut =
      isRetreat && checkIn && selected?.nights
        ? new Date(new Date(checkIn).getTime() + selected.nights * 86400000)
            .toISOString()
            .slice(0, 10)
        : checkOut;

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ref,
          category,
          roomSlug: selected?.slug || "",
          roomName: selected?.name || "",
          checkIn,
          checkOut: computedCheckOut,
          guests,
          rooms: isRetreat ? 0 : roomCount,
          extraBeds: effectiveExtraBeds,
          extraBedPrice: selected?.extraBedAllowed ? selected.extraBedPrice : 0,
          nights,
          total,
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          notes: notes.trim(),
        }),
      });
      if (!res.ok) throw new Error("save failed");
      const saved = await res.json();
      setBookingRef(saved.ref || ref);
      setConfSnapshot({
        name,
        email,
        item: selected ? selected.name : "",
        total,
        dates: datesLabel,
      });
      setStep(4);
    } catch {
      setSubmitError(
        "We couldn't save your reservation just now. Please try again, or call us to confirm."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const ctxValue = useMemo<BookingContextValue>(
    () => ({ stays, retreats, openStay, openRetreat, openStayWith, openRetreatWith, openSearch }),
    [stays, retreats, openStay, openRetreat, openStayWith, openRetreatWith, openSearch]
  );

  return (
    <BookingContext.Provider value={ctxValue}>
      {children}
      {open && (
        <BookingModal
          step={step}
          category={category}
          isStay={isStay}
          isRetreat={isRetreat}
          selectedId={selectedId}
          setSelectedId={(id) => {
            setSelectedId(id);
            setStep2Error("");
          }}
          checkIn={checkIn}
          checkOut={checkOut}
          guests={guests}
          name={name}
          email={email}
          phone={phone}
          notes={notes}
          errors={errors}
          step1Error={step1Error}
          step2Error={step2Error}
          bookingRef={bookingRef}
          confSnapshot={confSnapshot}
          selected={selected}
          offerings={isRetreat ? retreats : stays}
          nights={nights}
          total={total}
          rooms={roomCount}
          maxRooms={maxRooms}
          occupancy={occupancy}
          extraBeds={effectiveExtraBeds}
          maxExtraBeds={maxExtraBeds}
          datesLabel={datesLabel}
          submitting={submitting}
          submitError={submitError}
          onClose={close}
          onReset={fullReset}
          onNext={next}
          onBack={back}
          onConfirm={confirm}
          setStayCat={() => {
            setCategory("stay");
            setSelectedId(null);
            setStep1Error("");
          }}
          setRetreatCat={() => {
            setCategory("retreat");
            setSelectedId(null);
            setStep1Error("");
          }}
          setCheckIn={(v) => {
            setCheckIn(v);
            setStep1Error("");
          }}
          setCheckOut={(v) => {
            setCheckOut(v);
            setStep1Error("");
          }}
          incGuests={() => setGuests((g) => Math.min(12, g + 1))}
          decGuests={() => setGuests((g) => Math.max(1, g - 1))}
          incRooms={incRooms}
          decRooms={decRooms}
          incBed={incBed}
          decBed={decBed}
          setName={setName}
          setEmail={setEmail}
          setPhone={setPhone}
          setNotes={setNotes}
        />
      )}
    </BookingContext.Provider>
  );
}

/* ============================ MODAL ============================ */

const uppercaseLabel: CSSProperties = {
  fontFamily: "var(--font-mukta), sans-serif",
  fontSize: 12,
  letterSpacing: ".1em",
  textTransform: "uppercase",
  color: "#9a8470",
  fontWeight: 600,
};

const inputBase: CSSProperties = {
  border: "1.5px solid rgba(44,27,18,0.16)",
  background: "#fff",
  borderRadius: 11,
  padding: "13px 14px",
  fontSize: 15,
  color: "#2c1b12",
  width: "100%",
};
const inputErr: CSSProperties = { ...inputBase, border: "1.5px solid #c9572e" };

interface ModalProps {
  step: number;
  category: Category;
  isStay: boolean;
  isRetreat: boolean;
  selectedId: string | null;
  setSelectedId: (id: string) => void;
  checkIn: string;
  checkOut: string;
  guests: number;
  name: string;
  email: string;
  phone: string;
  notes: string;
  errors: Errors;
  step1Error: string;
  step2Error: string;
  bookingRef: string;
  confSnapshot: ConfSnapshot | null;
  selected: Room | null;
  offerings: Room[];
  nights: number;
  total: number;
  rooms: number;
  maxRooms: number;
  occupancy: number;
  extraBeds: number;
  maxExtraBeds: number;
  datesLabel: string;
  submitting: boolean;
  submitError: string;
  onClose: () => void;
  onReset: () => void;
  onNext: () => void;
  onBack: () => void;
  onConfirm: () => void;
  setStayCat: () => void;
  setRetreatCat: () => void;
  setCheckIn: (v: string) => void;
  setCheckOut: (v: string) => void;
  incGuests: () => void;
  decGuests: () => void;
  incRooms: () => void;
  decRooms: () => void;
  incBed: () => void;
  decBed: () => void;
  setName: (v: string) => void;
  setEmail: (v: string) => void;
  setPhone: (v: string) => void;
  setNotes: (v: string) => void;
}

function BookingModal(p: ModalProps) {
  const steps = [
    { n: 1, label: "Dates & Guests", sub: "When & how many" },
    { n: 2, label: "Your Selection", sub: "Stay or retreat" },
    { n: 3, label: "Your Details", sub: "Contact info" },
    { n: 4, label: "Confirmation", sub: "All set" },
  ];

  const offerings = p.offerings;

  const tabBase: CSSProperties = {
    flex: 1,
    cursor: "pointer",
    borderRadius: 11,
    padding: 14,
    fontFamily: "var(--font-mukta), sans-serif",
    fontSize: 14.5,
    fontWeight: 600,
    transition: "all .15s",
  };
  const tabActive: CSSProperties = {
    ...tabBase,
    background: "#2c1b12",
    color: "#fbf0dc",
    border: "1.5px solid #2c1b12",
  };
  const tabInactive: CSSProperties = {
    ...tabBase,
    background: "#fff",
    color: "#6b5340",
    border: "1.5px solid rgba(44,27,18,0.16)",
  };

  const cs = p.confSnapshot;

  return (
    <div
      onClick={p.onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 200,
        background: "rgba(20,11,6,0.62)",
        backdropFilter: "blur(6px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        animation: "fadeUp .2s ease",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="booking-shell"
        style={{
          width: "100%",
          maxWidth: 940,
          maxHeight: "90vh",
          overflow: "hidden",
          background: "#fbf5ea",
          borderRadius: 22,
          boxShadow: "0 40px 90px rgba(0,0,0,0.4)",
          display: "grid",
          gridTemplateColumns: "280px 1fr",
        }}
      >
        {/* rail */}
        <div
          className="booking-rail"
          style={{
            background: "#2c1b12",
            padding: "34px 30px",
            maxHeight: "90vh",
            minHeight: 0,
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 11, marginBottom: 38 }}>
            <Logo size={40} />
            <span
              style={{
                fontFamily: "var(--font-cormorant), serif",
                fontSize: 19,
                fontWeight: 700,
                color: "#fbf0dc",
              }}
            >
              Reserve Your Journey
            </span>
          </div>
          {steps.map((s) => {
            const done = p.step > s.n;
            const active = p.step === s.n;
            return (
              <div
                key={s.n}
                style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 24 }}
              >
                <span
                  style={{
                    flexShrink: 0,
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "var(--font-mukta), sans-serif",
                    fontSize: 14,
                    fontWeight: 600,
                    ...(active
                      ? { background: "#d9772b", color: "#fff" }
                      : done
                      ? { background: "rgba(217,169,62,0.25)", color: "#e2c77f" }
                      : {
                          background: "transparent",
                          color: "rgba(251,240,220,0.4)",
                          border: "1.5px solid rgba(251,240,220,0.2)",
                        }),
                  }}
                >
                  {done ? "✓" : s.n}
                </span>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <span
                    style={{
                      fontFamily: "var(--font-cormorant), serif",
                      fontSize: 16,
                      fontWeight: 600,
                      whiteSpace: "nowrap",
                      color: active || done ? "#fbf0dc" : "rgba(251,240,220,0.5)",
                    }}
                  >
                    {s.label}
                  </span>
                  <span
                    style={{
                      fontFamily: "var(--font-mukta), sans-serif",
                      fontSize: 11,
                      color: "rgba(251,240,220,0.4)",
                    }}
                  >
                    {s.sub}
                  </span>
                </div>
              </div>
            );
          })}
          <div
            style={{
              marginTop: "auto",
              fontFamily: "var(--font-cormorant), serif",
              fontStyle: "italic",
              fontSize: 16,
              color: "rgba(217,169,62,0.8)",
              lineHeight: 1.4,
            }}
          >
            &ldquo;An antidote to the hectic pace of modern life.&rdquo;
          </div>
        </div>

        {/* content */}
        <div
          style={{
            position: "relative",
            padding: "34px 38px",
            maxHeight: "90vh",
            minHeight: 0,
            overflowY: "auto",
            WebkitOverflowScrolling: "touch",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <button
            onClick={p.onClose}
            aria-label="Close"
            className="close-btn"
            style={{
              position: "absolute",
              top: 20,
              right: 24,
              border: "none",
              background: "transparent",
              cursor: "pointer",
              fontSize: 26,
              color: "#9a8470",
              lineHeight: 1,
              zIndex: 2,
            }}
          >
            ×
          </button>

          {/* STEP 1 */}
          {p.step === 1 && (
            <div>
              <h3 style={{ fontSize: 30, fontWeight: 600, color: "#2c1b12" }}>
                When would you like to arrive?
              </h3>
              <p style={{ marginTop: 6, fontSize: 14.5, color: "#9a8470" }}>
                Choose what you&rsquo;re booking, your dates and your party size.
              </p>

              <div style={{ display: "flex", gap: 12, marginTop: 26 }}>
                <button onClick={p.setStayCat} style={p.isStay ? tabActive : tabInactive}>
                  Glass-View Stay
                </button>
                <button onClick={p.setRetreatCat} style={p.isRetreat ? tabActive : tabInactive}>
                  Yoga &amp; Meditation
                </button>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 16,
                  marginTop: 24,
                }}
              >
                <label style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                  <span style={uppercaseLabel}>{p.isRetreat ? "Preferred start" : "Check-in"}</span>
                  <input
                    type="date"
                    value={p.checkIn}
                    min={todayStr()}
                    onChange={(e) => p.setCheckIn(e.target.value)}
                    style={inputBase}
                  />
                </label>
                {p.isStay ? (
                  <label style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                    <span style={uppercaseLabel}>Check-out</span>
                    <input
                      type="date"
                      value={p.checkOut}
                      min={p.checkIn || todayStr()}
                      onChange={(e) => p.setCheckOut(e.target.value)}
                      style={inputBase}
                    />
                  </label>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                    <span style={uppercaseLabel}>Duration</span>
                    <div
                      style={{
                        border: "1.5px solid rgba(44,27,18,0.12)",
                        background: "#f4e7d2",
                        borderRadius: 11,
                        padding: "13px 14px",
                        fontSize: 14.5,
                        color: "#6b5340",
                      }}
                    >
                      Set by the retreat you choose
                    </div>
                  </div>
                )}
              </div>

              <div style={{ marginTop: 24 }}>
                <span style={uppercaseLabel}>Guests</span>
                <div style={{ display: "flex", alignItems: "center", gap: 18, marginTop: 9 }}>
                  <button onClick={p.decGuests} className="qty-btn" style={qtyBtnStyle} aria-label="Fewer guests">
                    −
                  </button>
                  <span
                    style={{
                      fontFamily: "var(--font-cormorant), serif",
                      fontSize: 30,
                      fontWeight: 600,
                      color: "#2c1b12",
                      minWidth: 34,
                      textAlign: "center",
                    }}
                  >
                    {p.guests}
                  </span>
                  <button onClick={p.incGuests} className="qty-btn" style={qtyBtnStyle} aria-label="More guests">
                    +
                  </button>
                </div>
              </div>

              {p.step1Error && (
                <p style={{ marginTop: 18, color: "#b5531f", fontSize: 14, fontWeight: 500 }}>
                  {p.step1Error}
                </p>
              )}

              <div style={{ marginTop: 34, display: "flex", justifyContent: "flex-end" }}>
                <button onClick={p.onNext} className="btn btn-accent" style={primaryBtn}>
                  Continue
                </button>
              </div>
            </div>
          )}

          {/* STEP 2 */}
          {p.step === 2 && (
            <div>
              <h3 style={{ fontSize: 30, fontWeight: 600, color: "#2c1b12" }}>
                {p.isRetreat ? "Choose your retreat" : "Choose your stay"}
              </h3>
              <p style={{ marginTop: 6, fontSize: 14.5, color: "#9a8470" }}>
                Select the one that calls to you.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 24 }}>
                {offerings.map((o) => {
                  const sel = o.slug === p.selectedId;
                  const soldOut = o.available <= 0;
                  return (
                    <div
                      key={o.slug}
                      onClick={() => !soldOut && p.setSelectedId(o.slug)}
                      style={{
                        cursor: soldOut ? "not-allowed" : "pointer",
                        opacity: soldOut ? 0.55 : 1,
                        borderRadius: 14,
                        padding: "20px 22px",
                        background: sel ? "#fbeeda" : "#fff",
                        border: "2px solid " + (sel ? "#d9772b" : "rgba(44,27,18,0.1)"),
                        boxShadow: sel
                          ? "0 8px 22px rgba(217,119,43,0.18)"
                          : "0 4px 12px rgba(44,27,18,0.04)",
                        transition: "all .15s",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          gap: 16,
                        }}
                      >
                        <div>
                          <h4 style={{ fontSize: 21, fontWeight: 600, color: "#2c1b12" }}>{o.name}</h4>
                          <p
                            style={{
                              marginTop: 5,
                              fontSize: 13.5,
                              lineHeight: 1.55,
                              color: "#6b5340",
                              maxWidth: 440,
                            }}
                          >
                            {o.blurb}
                          </p>
                          <div style={{ display: "flex", gap: 7, flexWrap: "wrap", marginTop: 11 }}>
                            {o.tags.map((t) => (
                              <span
                                key={t}
                                style={{
                                  fontFamily: "var(--font-mukta), sans-serif",
                                  fontSize: 11,
                                  color: "#9a6b2e",
                                  background: "rgba(217,169,62,0.16)",
                                  padding: "4px 10px",
                                  borderRadius: 999,
                                  fontWeight: 500,
                                }}
                              >
                                {t}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div style={{ textAlign: "right", whiteSpace: "nowrap" }}>
                          <div
                            style={{
                              fontFamily: "var(--font-cormorant), serif",
                              fontSize: 24,
                              fontWeight: 700,
                              color: "#c0651f",
                            }}
                          >
                            {formatINR(o.price)}
                          </div>
                          <div
                            style={{
                              fontFamily: "var(--font-mukta), sans-serif",
                              fontSize: 11.5,
                              color: "#9a8470",
                            }}
                          >
                            {p.isRetreat ? "per person" : "per night"}
                          </div>
                          <div
                            style={{
                              marginTop: 6,
                              fontFamily: "var(--font-mukta), sans-serif",
                              fontSize: 11,
                              fontWeight: 600,
                              color: soldOut ? "#b5531f" : "#5f8a3f",
                            }}
                          >
                            {soldOut
                              ? "Fully booked"
                              : `${o.available} ${p.isRetreat ? "seats" : "left"}`}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              {p.step2Error && (
                <p style={{ marginTop: 16, color: "#b5531f", fontSize: 14, fontWeight: 500 }}>
                  {p.step2Error}
                </p>
              )}
              <div style={{ marginTop: 30, display: "flex", justifyContent: "space-between" }}>
                <button onClick={p.onBack} style={secondaryBtn}>
                  Back
                </button>
                <button onClick={p.onNext} className="btn btn-accent" style={primaryBtn}>
                  Continue
                </button>
              </div>
            </div>
          )}

          {/* STEP 3 */}
          {p.step === 3 && (
            <div>
              <h3 style={{ fontSize: 30, fontWeight: 600, color: "#2c1b12" }}>Your details</h3>
              <p style={{ marginTop: 6, fontSize: 14.5, color: "#9a8470" }}>
                We&rsquo;ll confirm your reservation over email.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 24 }}>
                <label style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                  <span style={uppercaseLabel}>Full name</span>
                  <input
                    value={p.name}
                    onChange={(e) => p.setName(e.target.value)}
                    placeholder="e.g. Ananya Sharma"
                    style={p.errors.name ? inputErr : inputBase}
                  />
                  {p.errors.name && (
                    <span style={{ color: "#b5531f", fontSize: 12.5 }}>{p.errors.name}</span>
                  )}
                </label>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  <label style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                    <span style={uppercaseLabel}>Email</span>
                    <input
                      value={p.email}
                      onChange={(e) => p.setEmail(e.target.value)}
                      placeholder="you@email.com"
                      style={p.errors.email ? inputErr : inputBase}
                    />
                    {p.errors.email && (
                      <span style={{ color: "#b5531f", fontSize: 12.5 }}>{p.errors.email}</span>
                    )}
                  </label>
                  <label style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                    <span style={uppercaseLabel}>Phone</span>
                    <input
                      value={p.phone}
                      onChange={(e) => p.setPhone(e.target.value)}
                      placeholder="10-digit mobile"
                      style={p.errors.phone ? inputErr : inputBase}
                    />
                    {p.errors.phone && (
                      <span style={{ color: "#b5531f", fontSize: 12.5 }}>{p.errors.phone}</span>
                    )}
                  </label>
                </div>
                <label style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                  <span style={uppercaseLabel}>
                    Special requests{" "}
                    <span style={{ textTransform: "none", letterSpacing: 0, color: "#c0ae97" }}>
                      (optional)
                    </span>
                  </span>
                  <textarea
                    value={p.notes}
                    onChange={(e) => p.setNotes(e.target.value)}
                    rows={3}
                    placeholder="Dietary needs, pickup from Guptakashi, accessibility..."
                    style={{ ...inputBase, resize: "vertical" }}
                  />
                </label>
              </div>

              {/* rooms + extra beds (editable) */}
              {p.isStay && p.selected && (
                <div
                  style={{
                    marginTop: 24,
                    background: "#fff",
                    borderRadius: 14,
                    padding: "18px 20px",
                    border: "1px solid rgba(192,146,47,0.3)",
                  }}
                >
                  {/* rooms row */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: "#2c1b12" }}>Rooms</div>
                      <div style={{ fontSize: 12.5, color: "#9a8470" }}>
                        {p.selected.name} · sleeps {p.selected.capacity} each
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                      <button onClick={p.decRooms} className="qty-btn" style={smallQtyBtn} aria-label="Fewer rooms">
                        −
                      </button>
                      <span style={stepperValue}>{p.rooms}</span>
                      <button
                        onClick={p.incRooms}
                        disabled={p.rooms >= p.maxRooms}
                        className="qty-btn"
                        style={{ ...smallQtyBtn, opacity: p.rooms >= p.maxRooms ? 0.4 : 1 }}
                        aria-label="More rooms"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* extra beds row */}
                  {p.selected.extraBedAllowed ? (
                    <div
                      style={{
                        marginTop: 14,
                        paddingTop: 14,
                        borderTop: "1px dashed rgba(44,27,18,0.14)",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: 12,
                      }}
                    >
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 600, color: "#2c1b12" }}>Extra beds</div>
                        <div style={{ fontSize: 12.5, color: "#9a8470" }}>
                          +{formatINR(p.selected.extraBedPrice)} / night · adds 1 guest each
                        </div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                        <button onClick={p.decBed} className="qty-btn" style={smallQtyBtn} aria-label="Fewer beds">
                          −
                        </button>
                        <span style={stepperValue}>{p.extraBeds}</span>
                        <button
                          onClick={p.incBed}
                          disabled={p.extraBeds >= p.maxExtraBeds}
                          className="qty-btn"
                          style={{ ...smallQtyBtn, opacity: p.extraBeds >= p.maxExtraBeds ? 0.4 : 1 }}
                          aria-label="More beds"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div style={{ marginTop: 10, fontSize: 12.5, color: "#9a8470", fontStyle: "italic" }}>
                      Extra beds aren&rsquo;t available for this room type.
                    </div>
                  )}

                  {/* occupancy readout */}
                  <div
                    style={{
                      marginTop: 14,
                      paddingTop: 12,
                      borderTop: "1px dashed rgba(44,27,18,0.14)",
                      fontSize: 13,
                      fontWeight: 600,
                      color: p.occupancy < p.guests ? "#b5531f" : "#5f8a3f",
                    }}
                  >
                    {p.occupancy < p.guests
                      ? `Sleeps ${p.occupancy} — ${p.guests - p.occupancy} more guest${
                          p.guests - p.occupancy > 1 ? "s" : ""
                        } than beds. Add a room or extra bed.`
                      : `Comfortably sleeps ${p.occupancy} for your ${p.guests} guest${
                          p.guests > 1 ? "s" : ""
                        }.`}
                  </div>
                </div>
              )}

              <div
                style={{
                  marginTop: 24,
                  background: "#f4e7d2",
                  borderRadius: 14,
                  padding: "20px 22px",
                  border: "1px solid rgba(192,146,47,0.25)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: 14,
                    color: "#6b5340",
                    marginBottom: 8,
                  }}
                >
                  <span>{p.selected ? p.selected.name : "—"}</span>
                  <span>{p.datesLabel}</span>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: 14,
                    color: "#6b5340",
                    marginBottom: 8,
                  }}
                >
                  <span>
                    {p.guests + (p.guests > 1 ? " guests" : " guest")}
                    {!p.isRetreat && p.rooms
                      ? ` · ${p.rooms} room${p.rooms > 1 ? "s" : ""}`
                      : ""}
                    {" · "}
                    {p.isRetreat
                      ? p.selected?.nights
                        ? p.selected.nights + " nights"
                        : ""
                      : p.nights
                      ? p.nights + (p.nights > 1 ? " nights" : " night")
                      : "—"}
                  </span>
                  <span>
                    {p.selected
                      ? formatINR(p.selected.price) + (p.isRetreat ? " / person" : " / room / night")
                      : ""}
                  </span>
                </div>
                {p.extraBeds > 0 && p.selected && (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: 14,
                      color: "#6b5340",
                      marginBottom: 8,
                    }}
                  >
                    <span>
                      Extra bed × {p.extraBeds}
                    </span>
                    <span>+{formatINR(p.selected.extraBedPrice)} / night</span>
                  </div>
                )}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "baseline",
                    marginTop: 12,
                    paddingTop: 12,
                    borderTop: "1px dashed rgba(44,27,18,0.18)",
                  }}
                >
                  <span style={{ fontFamily: "var(--font-mukta), sans-serif", fontWeight: 600, color: "#2c1b12" }}>
                    Estimated total
                  </span>
                  <span
                    style={{
                      fontFamily: "var(--font-cormorant), serif",
                      fontSize: 26,
                      fontWeight: 700,
                      color: "#c0651f",
                    }}
                  >
                    {formatINR(p.total)}
                  </span>
                </div>
              </div>

              {p.submitError && (
                <p style={{ marginTop: 16, color: "#b5531f", fontSize: 14, fontWeight: 500 }}>
                  {p.submitError}
                </p>
              )}

              <div style={{ marginTop: 28, display: "flex", justifyContent: "space-between" }}>
                <button onClick={p.onBack} disabled={p.submitting} style={secondaryBtn}>
                  Back
                </button>
                <button
                  onClick={p.onConfirm}
                  disabled={p.submitting}
                  style={{
                    ...primaryBtn,
                    background: "#8e3b1e",
                    boxShadow: "0 6px 18px rgba(142,59,30,0.3)",
                    opacity: p.submitting ? 0.7 : 1,
                    cursor: p.submitting ? "wait" : "pointer",
                  }}
                >
                  {p.submitting ? "Reserving…" : "Confirm Reservation"}
                </button>
              </div>
            </div>
          )}

          {/* STEP 4 */}
          {p.step === 4 && (
            <div
              style={{
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                flex: 1,
                padding: "20px 0",
              }}
            >
              <div style={{ animation: "omfloat 5s ease-in-out infinite" }}>
                <Logo size={88} />
              </div>
              <h3 style={{ fontSize: 34, fontWeight: 600, color: "#2c1b12", marginTop: 24 }}>
                Your journey is reserved
              </h3>
              <p
                style={{
                  marginTop: 10,
                  fontSize: 15.5,
                  color: "#6b5340",
                  maxWidth: 430,
                  lineHeight: 1.6,
                }}
              >
                Thank you, {cs?.name}. A confirmation is on its way to{" "}
                <strong style={{ color: "#2c1b12" }}>{cs?.email}</strong>. We look forward to
                welcoming you to Devbhumi.
              </p>
              <div
                style={{
                  marginTop: 26,
                  background: "#fff",
                  border: "1px solid rgba(192,146,47,0.3)",
                  borderRadius: 14,
                  padding: "22px 30px",
                  minWidth: 320,
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-mukta), sans-serif",
                    fontSize: 11.5,
                    letterSpacing: ".2em",
                    textTransform: "uppercase",
                    color: "#9a8470",
                    fontWeight: 600,
                  }}
                >
                  Booking reference
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-cormorant), serif",
                    fontSize: 30,
                    fontWeight: 700,
                    color: "#c0651f",
                    letterSpacing: 1,
                    marginTop: 4,
                  }}
                >
                  {p.bookingRef}
                </div>
                <div
                  style={{
                    marginTop: 14,
                    paddingTop: 14,
                    borderTop: "1px dashed rgba(44,27,18,0.16)",
                    fontSize: 14,
                    color: "#6b5340",
                  }}
                >
                  {cs?.item}
                  <br />
                  {cs?.dates} · {formatINR(cs?.total ?? 0)}
                </div>
              </div>
              <div style={{ display: "flex", gap: 14, marginTop: 30 }}>
                <button onClick={p.onReset} style={secondaryBtn}>
                  Book Another
                </button>
                <button onClick={p.onClose} className="btn btn-accent" style={{ ...primaryBtn, padding: "13px 30px" }}>
                  Done
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const qtyBtnStyle: CSSProperties = {
  width: 42,
  height: 42,
  borderRadius: "50%",
  border: "1.5px solid rgba(44,27,18,0.18)",
  background: "#fff",
  cursor: "pointer",
  fontSize: 20,
  color: "#2c1b12",
  lineHeight: 1,
};

const smallQtyBtn: CSSProperties = {
  width: 34,
  height: 34,
  borderRadius: "50%",
  border: "1.5px solid rgba(44,27,18,0.18)",
  background: "#fff",
  cursor: "pointer",
  fontSize: 18,
  color: "#2c1b12",
  lineHeight: 1,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const stepperValue: CSSProperties = {
  fontFamily: "var(--font-cormorant), serif",
  fontSize: 22,
  fontWeight: 600,
  color: "#2c1b12",
  minWidth: 22,
  textAlign: "center",
};

const primaryBtn: CSSProperties = {
  border: "none",
  cursor: "pointer",
  background: "#d9772b",
  color: "#fff",
  fontSize: 15,
  fontWeight: 600,
  padding: "14px 34px",
  borderRadius: 999,
  boxShadow: "0 6px 18px rgba(217,119,43,0.3)",
};

const secondaryBtn: CSSProperties = {
  border: "1.5px solid rgba(44,27,18,0.2)",
  background: "transparent",
  cursor: "pointer",
  color: "#4a3422",
  fontSize: 15,
  fontWeight: 600,
  padding: "14px 28px",
  borderRadius: 999,
};
