"use client";

import React, { useState, useEffect } from "react";
import {
  X, Sparkles, CreditCard, ShieldCheck, Mail, User, ArrowRight,
  Loader2, CheckCircle2, Ticket, Crown, Star, ShoppingCart, Zap,
  MapPin, Calendar, Plus, Minus, Trash2, Receipt,
} from "lucide-react";
import { Event } from "../types";

interface SelectedTicket {
  uid: string;
  tierId: string;
  name: string;
  subtitle: string;
  price: number;
}

export interface OrderItem {
  name: string;
  quantity: number;
  unitPrice: number;
}

interface CheckoutModalProps {
  event: Event;
  qty: number;
  seatType: string;
  onClose: () => void;
  onCompleteBooking: (
    eventId: string, eventTitle: string, eventDate: string, eventTime: string,
    eventLocation: string, eventImage: string, qty: number, seatType: string,
    price: number, attendeeName: string, attendeeEmail: string,
    items?: OrderItem[]
  ) => void;
  onSaveDraftBooking?: (
    eventId: string, eventTitle: string, eventDate: string, eventTime: string,
    eventLocation: string, eventImage: string, qty: number, seatType: string,
    price: number, attendeeName: string, attendeeEmail: string
  ) => void;
  onAddToCart?: (
    eventId: string, eventTitle: string, eventDate: string, eventTime: string,
    eventLocation: string, eventImage: string, seatType: string, qty: number, unitPrice: number
  ) => void;
  initialAttendeeName?: string;
  initialAttendeeEmail?: string;
}

const TIERS = [
  {
    id: "General Admission",
    name: "General Admission",
    subtitle: "Standard Entry",
    description: "Standard admission access to all general zones and stands.",
    priceAdd: 0,
    icon: Ticket,
    badge: "POPULAR",
    badgeStyle: "bg-brand-blue/15 text-brand-blue border-brand-blue/25",
    iconBg: "bg-brand-blue/10 text-brand-blue",
    addBtnStyle: "bg-brand-blue/10 hover:bg-brand-blue text-brand-blue hover:text-white border-brand-blue/30",
    accentColor: "text-brand-blue",
  },
  {
    id: "VIP Backstage Pass",
    name: "VIP Backstage Pass",
    subtitle: "VIP Access",
    description: "Front-row access, express entry lane, and exclusive artist meetup.",
    priceAdd: 55,
    icon: Crown,
    badge: "VIP",
    badgeStyle: "bg-purple-100 text-purple-700 border-purple-200",
    iconBg: "bg-purple-100 text-purple-600",
    addBtnStyle: "bg-purple-50 hover:bg-purple-600 text-purple-700 hover:text-white border-purple-200",
    accentColor: "text-purple-700",
  },
  {
    id: "Premium Reserved Balcony",
    name: "Premium Reserved",
    subtitle: "Balcony View",
    description: "Elevated cushioned seats with unobstructed views over the stage.",
    priceAdd: 25,
    icon: Star,
    badge: "BEST VIEW",
    badgeStyle: "bg-sky-100 text-sky-700 border-sky-200",
    iconBg: "bg-sky-100 text-sky-600",
    addBtnStyle: "bg-sky-50 hover:bg-sky-600 text-sky-700 hover:text-white border-sky-200",
    accentColor: "text-sky-700",
  },
];

export default function CheckoutModal({
  event,
  seatType: initialSeatType,
  initialAttendeeName = "",
  initialAttendeeEmail = "",
  onClose,
  onCompleteBooking,
  onSaveDraftBooking,
  onAddToCart,
}: CheckoutModalProps) {
  const [step, setStep] = useState<"select" | "info" | "payment" | "processing" | "success">("select");

  // Multi-ticket selection list — each item is one ticket of a chosen tier
  const [selectedTickets, setSelectedTickets] = useState<SelectedTicket[]>(() => {
    const tier = TIERS.find((t) => t.id === initialSeatType) || TIERS[0];
    return [{
      uid: `${Date.now()}-0`,
      tierId: tier.id,
      name: tier.name,
      subtitle: tier.subtitle,
      price: event.price + tier.priceAdd,
    }];
  });

  const [fullName, setFullName] = useState(initialAttendeeName);
  const [emailAddress, setEmailAddress] = useState(initialAttendeeEmail);
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [cardValidationError, setCardValidationError] = useState("");
  const [checkoutLogs, setCheckoutLogs] = useState<string[]>([]);
  const [addedToCart, setAddedToCart] = useState(false);

  const totalAmount = selectedTickets.reduce((sum, t) => sum + t.price, 0);
  const totalQty = selectedTickets.length;

  // Summarise seat types for the booking record
  const seatTypeSummary = (() => {
    const counts: Record<string, number> = {};
    selectedTickets.forEach((t) => { counts[t.tierId] = (counts[t.tierId] || 0) + 1; });
    const parts = Object.entries(counts).map(([id, n]) => {
      const tier = TIERS.find((t) => t.id === id);
      const short = tier?.subtitle || id;
      return n > 1 ? `${n}× ${short}` : short;
    });
    return parts.join(", ");
  })();

  const addTicket = (tier: typeof TIERS[0]) => {
    setSelectedTickets((prev) => [
      ...prev,
      { uid: `${Date.now()}-${Math.random()}`, tierId: tier.id, name: tier.name, subtitle: tier.subtitle, price: event.price + tier.priceAdd },
    ]);
  };

  const removeTicket = (uid: string) => {
    setSelectedTickets((prev) => prev.filter((t) => t.uid !== uid));
  };

  const tierCount = (tierId: string) => selectedTickets.filter((t) => t.tierId === tierId).length;

  useEffect(() => {
    if (step === "processing") {
      setCheckoutLogs([]);
      const logs = [
        "🌐 [INIT] Contacting Stripe.js API v3 endpoints...",
        "🔒 [PCI-SECURE] Performing secure TLS 1.3 cryptographic handshake...",
        "🔑 [TOKEN] Stripe key authorized. Customer vault profile generated...",
        "💳 [ENCRYPT] Secure payload created. Generating digital card signature: tok_1AhF28eJ...",
        "⚡ [WEBHOOK] Processing fast-admissions settlement callback...",
        "✅ [SUCCESS] Captured funds securely from bank. Building e-pass codes...",
      ];
      logs.forEach((log, i) => setTimeout(() => setCheckoutLogs((p) => [...p, log]), i * 400));
      const t = setTimeout(() => setStep("success"), 2800);
      return () => clearTimeout(t);
    }
  }, [step]);

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCardValidationError("");
    const val = e.target.value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const match = val.match(/\d{4,16}/g)?.[0] || "";
    const parts: string[] = [];
    for (let i = 0; i < match.length; i += 4) parts.push(match.substring(i, i + 4));
    setCardNumber(parts.length > 0 ? parts.join(" ") : val);
  };

  const handleCardExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCardValidationError("");
    const val = e.target.value.replace(/\D/g, "");
    setCardExpiry(val.length >= 2 ? val.substring(0, 2) + "/" + val.substring(2, 4) : val);
  };

  const handleCardCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCardValidationError("");
    setCardCvv(e.target.value.replace(/\D/g, ""));
  };

  const handleInfoSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!fullName.trim() || !emailAddress.trim()) return;
    if (!emailAddress.includes("@") || !emailAddress.includes(".")) {
      alert("Please enter a valid e-mail for ticket receipts.");
      return;
    }
    setStep("payment");
  };

  const handlePaymentSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (cardNumber.replace(/\s/g, "").length < 16) { setCardValidationError("Card Number must contain exactly 16 digits."); return; }
    if (cardExpiry.length < 5) { setCardValidationError("Please include a valid CC Expiry (MM/YY)."); return; }
    if (cardCvv.length < 3) { setCardValidationError("Please input a standard 3-digit CVV code."); return; }
    setStep("processing");
  };

  const handleFinish = () => {
    // Group selectedTickets by tier to build items for DB order creation
    const itemsMap: Record<string, { quantity: number; unitPrice: number }> = {};
    selectedTickets.forEach((t) => {
      if (!itemsMap[t.tierId]) itemsMap[t.tierId] = { quantity: 0, unitPrice: t.price };
      itemsMap[t.tierId].quantity += 1;
    });
    const items: OrderItem[] = Object.entries(itemsMap).map(([name, v]) => ({
      name,
      quantity: v.quantity,
      unitPrice: v.unitPrice,
    }));

    onCompleteBooking(
      event.id, event.title, event.date, event.time, event.location, event.image,
      totalQty, seatTypeSummary, totalAmount, fullName, emailAddress, items
    );
    onClose();
  };

  const handleAddToCart = () => {
    onAddToCart?.(
      event.id, event.title, event.date, event.time, event.location, event.image,
      seatTypeSummary, totalQty, totalAmount / totalQty
    );
    setAddedToCart(true);
    setTimeout(() => onClose(), 900);
  };

  return (
    <div
      id="checkout-modal-overlay"
      className="fixed inset-0 z-100 flex items-start sm:items-center justify-center p-4 bg-[#0F172A]/65 backdrop-blur-md overflow-y-auto"
    >
      <div
        id="checkout-modal-content"
        className="relative w-full max-w-lg bg-white border border-border-gray rounded-[28px] overflow-hidden shadow-2xl text-dark-text animate-fade flex flex-col max-h-[92vh] my-8 sm:my-0"
      >

        {/* ══════════════════════════════════════════════════════════════════
            STEP: SELECT TICKETS
        ══════════════════════════════════════════════════════════════════ */}
        {step === "select" && (
          <>
            {/* Event hero */}
            <div className="relative h-36 overflow-hidden shrink-0">
              <img src={event.image} alt={event.title} className="absolute inset-0 w-full h-full object-cover scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-[#0F172A]/55 to-transparent" />
              <button
                id="checkout-close-btn"
                onClick={onClose}
                className="absolute top-3 right-3 h-8 w-8 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white flex items-center justify-center hover:bg-white/25 transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
              <div className="absolute bottom-4 left-4 right-12">
                <div className="flex items-center gap-1.5 mb-1">
                  <Sparkles className="h-3 w-3 text-brand-blue animate-pulse" />
                  <span className="text-[9px] font-extrabold uppercase tracking-widest text-brand-blue">Instant Booking</span>
                </div>
                <h2 className="text-sm font-black text-white leading-tight line-clamp-2">{event.title}</h2>
                <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                  <span className="flex items-center gap-1 text-[10px] text-white/70 font-semibold">
                    <Calendar className="h-3 w-3" />{event.date}
                  </span>
                  <span className="flex items-center gap-1 text-[10px] text-white/70 font-semibold">
                    <MapPin className="h-3 w-3" />{event.location}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">

              {/* ── TIER PICKER ─────────────────────────────────────── */}
              <div className="p-5 pb-3">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Available Ticket Types</span>
                  <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider">tap + to add</span>
                </div>

                <div className="space-y-2.5">
                  {TIERS.map((tier) => {
                    const Icon = tier.icon;
                    const price = event.price + tier.priceAdd;
                    const count = tierCount(tier.id);
                    return (
                      <div
                        key={tier.id}
                        className="bg-soft-bg border border-border-gray rounded-2xl p-3.5 flex items-center gap-3"
                      >
                        <div className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 ${tier.iconBg}`}>
                          <Icon className="h-4 w-4" />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 mb-0.5 flex-wrap">
                            <span className="text-xs font-extrabold text-dark-text leading-none">{tier.name}</span>
                            <span className={`text-[8px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-full border ${tier.badgeStyle}`}>
                              {tier.badge}
                            </span>
                          </div>
                          <p className="text-[10px] text-neutral-500 font-medium leading-snug">{tier.description}</p>
                        </div>

                        <div className="flex flex-col items-end gap-1.5 shrink-0">
                          <span className={`text-sm font-black ${tier.accentColor}`}>${price}</span>
                          <div className="flex items-center gap-1">
                            {count > 0 && (
                              <button
                                type="button"
                                onClick={() => {
                                  const last = [...selectedTickets].reverse().find((t) => t.tierId === tier.id);
                                  if (last) removeTicket(last.uid);
                                }}
                                className="h-6 w-6 rounded-full bg-red-50 border border-red-200 text-red-500 flex items-center justify-center hover:bg-red-100 transition-colors cursor-pointer active:scale-90"
                                title="Remove one"
                              >
                                <Minus className="h-3 w-3" />
                              </button>
                            )}
                            {count > 0 && (
                              <span className="w-5 text-center text-[11px] font-black text-dark-text">{count}</span>
                            )}
                            <button
                              type="button"
                              id={`tier-add-${tier.id.replace(/\s/g, "-").toLowerCase()}`}
                              onClick={() => addTicket(tier)}
                              className={`h-7 w-7 rounded-full border flex items-center justify-center transition-all cursor-pointer active:scale-90 ${tier.addBtnStyle}`}
                              title={`Add ${tier.name}`}
                            >
                              <Plus className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* ── SELECTED TICKETS LIST ────────────────────────────── */}
              {selectedTickets.length > 0 && (
                <div className="px-5 pb-3">
                  <div className="border border-border-gray rounded-2xl overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-2.5 bg-soft-bg border-b border-border-gray">
                      <div className="flex items-center gap-1.5">
                        <Receipt className="h-3.5 w-3.5 text-brand-blue" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-neutral-500">
                          Your Selection
                        </span>
                      </div>
                      <span className="text-[10px] font-black text-brand-blue bg-brand-blue/10 px-2 py-0.5 rounded-full">
                        {selectedTickets.length} ticket{selectedTickets.length !== 1 ? "s" : ""}
                      </span>
                    </div>

                    <div className="divide-y divide-border-gray max-h-44 overflow-y-auto">
                      {selectedTickets.map((ticket, idx) => {
                        const tier = TIERS.find((t) => t.id === ticket.tierId);
                        const Icon = tier?.icon || Ticket;
                        return (
                          <div key={ticket.uid} className="flex items-center gap-3 px-4 py-2.5 bg-white hover:bg-soft-bg/60 transition-colors group">
                            <span className="text-[10px] font-black text-neutral-300 w-4 shrink-0">
                              {String(idx + 1).padStart(2, "0")}
                            </span>
                            <div className={`h-6 w-6 rounded-lg flex items-center justify-center shrink-0 ${tier?.iconBg || "bg-neutral-100 text-neutral-400"}`}>
                              <Icon className="h-3 w-3" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <span className="text-xs font-bold text-dark-text block truncate">{ticket.name}</span>
                              <span className="text-[9px] text-neutral-400 font-semibold">{ticket.subtitle}</span>
                            </div>
                            <span className={`text-xs font-black shrink-0 ${tier?.accentColor || "text-dark-text"}`}>
                              ${ticket.price}
                            </span>
                            <button
                              type="button"
                              onClick={() => removeTicket(ticket.uid)}
                              className="h-6 w-6 rounded-full flex items-center justify-center text-neutral-300 hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer opacity-0 group-hover:opacity-100 shrink-0"
                              title="Remove ticket"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* ── TOTAL + ACTIONS ──────────────────────────────────── */}
              <div className="px-5 pb-5 pt-2 space-y-3">
                {selectedTickets.length === 0 ? (
                  <div className="border-2 border-dashed border-border-gray rounded-2xl py-6 text-center">
                    <Ticket className="h-6 w-6 text-neutral-300 mx-auto mb-2" />
                    <p className="text-xs font-bold text-neutral-400">No tickets selected yet</p>
                    <p className="text-[10px] text-neutral-300 font-medium mt-0.5">Tap + above to add tickets</p>
                  </div>
                ) : (
                  <>
                    <div className="flex items-end justify-between px-1">
                      <div>
                        <span className="text-[9px] font-black uppercase tracking-widest text-neutral-400 block">Total</span>
                        <span className="text-2xl font-black text-dark-text">${totalAmount}</span>
                        <span className="text-[10px] text-neutral-400 ml-1.5 font-semibold">{totalQty} ticket{totalQty !== 1 ? "s" : ""}</span>
                      </div>
                      <div className="text-right text-[10px] text-neutral-400 font-semibold leading-snug">
                        <span className="block">{seatTypeSummary}</span>
                        <span className="text-emerald-600 font-bold">✓ Free cancellation</span>
                      </div>
                    </div>

                    <div className="flex gap-2.5">
                      <button
                        id="checkout-add-to-cart"
                        type="button"
                        onClick={handleAddToCart}
                        disabled={addedToCart || !onAddToCart}
                        className={`flex-1 flex items-center justify-center gap-1.5 text-xs font-black uppercase tracking-wider py-3.5 rounded-2xl border-2 transition-all cursor-pointer active:scale-97 ${
                          addedToCart
                            ? "bg-emerald-50 border-emerald-300 text-emerald-700"
                            : "bg-white border-border-gray text-dark-text hover:border-brand-blue/50 hover:text-brand-blue"
                        } ${!onAddToCart ? "opacity-40 pointer-events-none" : ""}`}
                      >
                        {addedToCart ? <><CheckCircle2 className="h-4 w-4" /><span>Added!</span></> : <><ShoppingCart className="h-4 w-4" /><span>Add to Cart</span></>}
                      </button>

                      <button
                        id="checkout-book-now"
                        type="button"
                        onClick={() => setStep("info")}
                        className="flex-[1.6] bg-brand-blue hover:bg-brand-blue-hover text-white text-xs font-black uppercase tracking-wider py-3.5 rounded-2xl flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-brand-blue/20 transition-all active:scale-97"
                      >
                        <Zap className="h-4 w-4" />
                        <span>Purchase Now</span>
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>

                    <p className="text-center text-[9px] text-neutral-400 font-semibold">
                      <ShieldCheck className="inline h-3 w-3 mr-0.5 text-emerald-500" />
                      Secured by Stripe · PCI DSS compliant
                    </p>
                  </>
                )}
              </div>
            </div>
          </>
        )}

        {/* ══════════════════════════════════════════════════════════════════
            STEP: INFO
        ══════════════════════════════════════════════════════════════════ */}
        {step === "info" && (
          <>
            <div className="flex items-center justify-between p-5 border-b border-border-gray shrink-0">
              <div>
                <span className="text-[9px] text-brand-blue font-extrabold uppercase tracking-widest flex items-center gap-1 animate-pulse">
                  <Sparkles className="h-3 w-3" /> Secure checkout
                </span>
                <h2 className="text-lg font-black text-dark-text mt-0.5">Your details</h2>
              </div>
              <button onClick={onClose} className="p-2 text-neutral-400 hover:text-dark-text hover:bg-neutral-50 rounded-full transition-colors cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5">
              {/* Order summary */}
              <div className="bg-soft-bg border border-border-gray rounded-2xl overflow-hidden mb-5">
                <div className="flex items-center justify-between px-4 py-2.5 border-b border-border-gray">
                  <div className="flex items-center gap-1.5">
                    <Receipt className="h-3.5 w-3.5 text-brand-blue" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Order Summary</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setStep("select")}
                    className="text-[9px] text-brand-blue font-black hover:underline cursor-pointer uppercase tracking-wider"
                  >
                    Edit →
                  </button>
                </div>
                <div className="divide-y divide-border-gray max-h-32 overflow-y-auto">
                  {selectedTickets.map((ticket, idx) => {
                    const tier = TIERS.find((t) => t.id === ticket.tierId);
                    const Icon = tier?.icon || Ticket;
                    return (
                      <div key={ticket.uid} className="flex items-center gap-2.5 px-4 py-2 bg-white">
                        <span className="text-[10px] font-black text-neutral-300 w-4 shrink-0">{String(idx + 1).padStart(2, "0")}</span>
                        <div className={`h-5 w-5 rounded-md flex items-center justify-center shrink-0 ${tier?.iconBg || "bg-neutral-100 text-neutral-400"}`}>
                          <Icon className="h-2.5 w-2.5" />
                        </div>
                        <span className="flex-1 text-xs font-semibold text-dark-text truncate">{ticket.name}</span>
                        <span className={`text-xs font-black shrink-0 ${tier?.accentColor || "text-dark-text"}`}>${ticket.price}</span>
                      </div>
                    );
                  })}
                </div>
                <div className="flex justify-between items-center px-4 py-2.5 bg-soft-bg border-t border-border-gray">
                  <span className="text-[10px] font-black text-neutral-400 uppercase tracking-wider">Total</span>
                  <span className="text-base font-black text-brand-blue">${totalAmount}</span>
                </div>
              </div>

              <form onSubmit={handleInfoSubmit} className="space-y-4">
                <div className="flex items-center justify-between text-xs font-bold pb-1">
                  <span className="text-brand-blue font-extrabold">Step 1 of 2: Your details</span>
                  <span className="text-neutral-400">Step 2: Payment</span>
                </div>

                <div>
                  <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                    <User className="h-3.5 w-3.5 text-brand-blue" /> Your name
                  </label>
                  <input
                    id="checkout-input-name"
                    required type="text" placeholder="Your full name"
                    value={fullName} onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-soft-bg border border-border-gray hover:border-brand-blue/30 focus:border-brand-blue rounded-full px-5 py-3 text-xs text-dark-text focus:outline-none font-semibold shadow-sm"
                  />
                  <p className="text-[10px] text-neutral-400 mt-1.5 px-2 font-semibold">Must match the name on your ID at the door.</p>
                </div>

                <div>
                  <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                    <Mail className="h-3.5 w-3.5 text-brand-blue" /> Email — ticket sent here
                  </label>
                  <input
                    id="checkout-input-email"
                    required type="email" placeholder="you@example.com"
                    value={emailAddress} onChange={(e) => setEmailAddress(e.target.value)}
                    className="w-full bg-soft-bg border border-border-gray hover:border-brand-blue/30 focus:border-brand-blue rounded-full px-5 py-3 text-xs text-dark-text focus:outline-none font-semibold shadow-sm"
                  />
                </div>

                <div className="pt-4 border-t border-border-gray flex gap-2.5">
                  <button
                    id="checkout-save-draft"
                    type="button"
                    onClick={() => {
                      if (!fullName.trim() || !emailAddress.trim()) { alert("Please enter your name and email before saving a draft."); return; }
                      if (!emailAddress.includes("@") || !emailAddress.includes(".")) { alert("Please enter a valid e-mail."); return; }
                      onSaveDraftBooking?.(
                        event.id, event.title, event.date, event.time, event.location, event.image,
                        totalQty, seatTypeSummary, totalAmount, fullName, emailAddress
                      );
                      onClose();
                    }}
                    className="flex-1 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-xs font-black uppercase tracking-wider py-3 rounded-full transition-all cursor-pointer"
                  >
                    Save Draft
                  </button>
                  <button
                    id="checkout-submit-info"
                    type="submit"
                    className="flex-[1.6] bg-brand-blue hover:bg-brand-blue-hover text-white text-xs font-black uppercase tracking-wider py-3 rounded-full flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-brand-blue/15 active:scale-98"
                  >
                    <span>Continue</span><ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </form>
            </div>
          </>
        )}

        {/* ══════════════════════════════════════════════════════════════════
            STEP: PAYMENT
        ══════════════════════════════════════════════════════════════════ */}
        {step === "payment" && (
          <>
            <div className="flex items-center justify-between p-5 border-b border-border-gray shrink-0">
              <div>
                <span className="text-[9px] text-brand-blue font-extrabold uppercase tracking-widest flex items-center gap-1 animate-pulse">
                  <ShieldCheck className="h-3 w-3" /> Secure payment
                </span>
                <h2 className="text-lg font-black text-dark-text mt-0.5">Payment details</h2>
              </div>
              <button onClick={onClose} className="p-2 text-neutral-400 hover:text-dark-text hover:bg-neutral-50 rounded-full transition-colors cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5">
              <form onSubmit={handlePaymentSubmit} className="space-y-4">
                <div className="bg-light-tint border border-brand-blue/15 rounded-2xl p-4 flex items-center justify-between">
                  <div>
                    <span className="text-[9px] uppercase font-bold text-brand-blue tracking-wider">Total to pay</span>
                    <p className="text-2xl font-black text-dark-text">${totalAmount}</p>
                    <span className="text-[10px] text-neutral-400 font-semibold">{totalQty} ticket{totalQty !== 1 ? "s" : ""}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] uppercase font-bold text-neutral-400 tracking-wider">For</span>
                    <p className="text-xs font-bold text-neutral-600 truncate max-w-[140px]">{fullName}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs font-bold pb-1">
                  <span className="text-neutral-400">Step 1: Your details</span>
                  <span className="text-brand-blue font-extrabold">Step 2 of 2: Payment</span>
                </div>

                {cardValidationError && (
                  <div id="card-validation-alert" className="p-3 bg-red-50 border border-red-100 text-red-800 rounded-xl text-xs font-semibold animate-fade">
                    {cardValidationError}
                  </div>
                )}

                <div className="space-y-3.5">
                  <div>
                    <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                      <CreditCard className="h-3.5 w-3.5 text-brand-blue" /> Card number
                    </label>
                    <input
                      id="checkout-input-card" required type="text" maxLength={19}
                      placeholder="4242 4242 4242 4242" value={cardNumber} onChange={handleCardNumberChange}
                      className="w-full bg-soft-bg border border-border-gray focus:border-brand-blue rounded-full px-5 py-2.5 text-xs text-dark-text focus:outline-none font-semibold shadow-sm"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1.5">Expires</label>
                      <input
                        id="checkout-input-expiry" required type="text" maxLength={5}
                        placeholder="MM/YY" value={cardExpiry} onChange={handleCardExpiryChange}
                        className="w-full bg-soft-bg border border-border-gray focus:border-brand-blue rounded-full px-5 py-2.5 text-xs text-dark-text focus:outline-none text-center font-semibold shadow-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1.5">CVV</label>
                      <input
                        id="checkout-input-cvv" required type="text" maxLength={3}
                        placeholder="•••" value={cardCvv} onChange={handleCardCvvChange}
                        className="w-full bg-soft-bg border border-border-gray focus:border-brand-blue rounded-full px-5 py-2.5 text-xs text-dark-text focus:outline-none text-center font-semibold shadow-sm"
                      />
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-start gap-2.5">
                  <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <p className="text-[10px] text-emerald-800 leading-relaxed font-semibold">
                    Secured by Stripe — trusted by Apple and Amazon. We never store your card details.
                  </p>
                </div>

                <div className="pt-4 border-t border-border-gray flex gap-3">
                  <button
                    id="checkout-back-to-info" type="button" onClick={() => setStep("info")}
                    className="flex-1 bg-white border border-border-gray hover:bg-neutral-50 text-neutral-500 text-xs font-bold uppercase tracking-wider py-3 rounded-full cursor-pointer transition-colors"
                  >
                    Go back
                  </button>
                  <button
                    id="checkout-submit-payment" type="submit"
                    className="flex-[1.6] bg-brand-blue hover:bg-brand-blue-hover text-white text-xs font-black uppercase tracking-wider py-3 rounded-full flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-brand-blue/15"
                  >
                    <ShieldCheck className="h-4 w-4" /><span>Pay ${totalAmount}</span>
                  </button>
                </div>
              </form>
            </div>
          </>
        )}

        {/* ══════════════════════════════════════════════════════════════════
            STEP: PROCESSING
        ══════════════════════════════════════════════════════════════════ */}
        {step === "processing" && (
          <div id="checkout-processing-animation" className="p-10 flex flex-col items-stretch justify-center text-center space-y-4">
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-10 w-10 text-brand-blue animate-spin" />
              <h3 className="text-base font-black text-dark-text">Processing your payment</h3>
            </div>
            <div className="bg-neutral-900 rounded-2xl p-4 text-left font-mono text-[9px] text-[#22C55E] space-y-1 max-h-36 overflow-y-auto leading-relaxed border border-neutral-800">
              {checkoutLogs.map((log, i) => <p key={i} className="animate-fade">{log}</p>)}
            </div>
            <p className="text-neutral-400 text-[10px] mx-auto leading-relaxed font-semibold">
              Finalising your tickets and sending them to your email…
            </p>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════════
            STEP: SUCCESS
        ══════════════════════════════════════════════════════════════════ */}
        {step === "success" && (
          <div id="checkout-success-view" className="p-8 flex flex-col items-center justify-center text-center space-y-5 animate-fade">
            <div className="h-16 w-16 rounded-full bg-emerald-50 border-2 border-emerald-100 flex items-center justify-center">
              <CheckCircle2 className="h-9 w-9 text-emerald-500" />
            </div>

            <div className="space-y-1.5">
              <span className="text-[10px] text-emerald-600 font-extrabold uppercase tracking-widest block">Payment successful</span>
              <h3 className="text-xl font-black text-dark-text">You're going!</h3>
              <p className="text-neutral-500 text-xs max-w-sm mx-auto leading-relaxed font-semibold">
                Nice one <span className="font-bold text-dark-text">{fullName}</span> — your {totalQty} ticket{totalQty !== 1 ? "s" : ""} for{" "}
                <span className="font-bold text-dark-text">{event.title}</span> are ready. Show your phone at the door.
              </p>
            </div>

            <div className="w-full bg-soft-bg border border-border-gray rounded-[24px] overflow-hidden text-xs font-semibold">
              <div className="divide-y divide-border-gray max-h-40 overflow-y-auto">
                {selectedTickets.map((ticket, idx) => {
                  const tier = TIERS.find((t) => t.id === ticket.tierId);
                  const Icon = tier?.icon || Ticket;
                  return (
                    <div key={ticket.uid} className="flex items-center gap-2.5 px-4 py-2.5">
                      <span className="text-[10px] font-black text-neutral-300 w-5 shrink-0">{String(idx + 1).padStart(2, "0")}</span>
                      <div className={`h-6 w-6 rounded-lg flex items-center justify-center shrink-0 ${tier?.iconBg || "bg-neutral-100 text-neutral-400"}`}>
                        <Icon className="h-3 w-3" />
                      </div>
                      <span className="flex-1 text-left text-dark-text truncate">{ticket.name}</span>
                      <span className={`font-black ${tier?.accentColor || "text-dark-text"}`}>${ticket.price}</span>
                    </div>
                  );
                })}
              </div>
              <div className="flex justify-between items-center px-4 py-3 bg-soft-bg border-t border-border-gray font-black">
                <div>
                  <span className="text-neutral-400 font-semibold text-[10px] block uppercase tracking-wider">Booking ref</span>
                  <span className="font-mono text-[11px] text-neutral-600">HITCH-#{Math.floor(Math.random() * 900000 + 100000)}</span>
                </div>
                <div className="text-right">
                  <span className="text-neutral-400 font-semibold text-[10px] block uppercase tracking-wider">Total paid</span>
                  <span className="text-brand-blue text-base">${totalAmount}</span>
                </div>
              </div>
            </div>

            <div className="w-full flex flex-col sm:flex-row gap-2.5">
              <button
                id="checkout-success-close-btn" onClick={onClose}
                className="flex-1 bg-white border border-border-gray hover:bg-neutral-50 text-neutral-500 font-bold uppercase text-xs tracking-wider py-3.5 rounded-full cursor-pointer"
              >
                Browse Events
              </button>
              <button
                id="checkout-success-go-tickets" onClick={handleFinish}
                className="flex-[1.4] bg-brand-blue hover:bg-brand-blue-hover text-white font-black uppercase text-xs tracking-wider py-3.5 rounded-full shadow-md shadow-brand-blue/15 cursor-pointer"
              >
                View My Tickets
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
