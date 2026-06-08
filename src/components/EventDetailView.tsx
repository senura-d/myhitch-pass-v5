"use client";

import { useState } from "react";
import { ArrowLeft, MapPin, Calendar, Clock, ShieldAlert, Award, ChevronRight, HelpCircle, Share2, Sparkles, Heart, ShoppingCart, Check, Zap, Users, Tag, Crown, Star, Ticket, Plus } from "lucide-react";
import { Event } from "../types";

interface EventDetailViewProps {
  event: Event;
  onBack: () => void;
  onBookTickets: (eventId: string, qty: number, seatType: string, ticketTypeId?: string) => void;
  onAddToCart: (eventId: string, qty: number, seatType: string, unitPrice: number, ticketTypeId?: string) => void;
  savedEventIds: string[];
  onToggleSave: (eventId: string) => void;
}

export default function EventDetailView({
  event,
  onBack,
  onBookTickets,
  onAddToCart,
  savedEventIds,
  onToggleSave,
}: EventDetailViewProps) {
  const ticketTypes = event.ticketTypes && event.ticketTypes.length > 0 ? event.ticketTypes : null;

  // Per-ticket-type quantity map  { [ticketTypeId]: qty }
  const [qtyMap, setQtyMap] = useState<Record<string, number>>({});
  const [showFaq, setShowFaq] = useState<number | null>(null);

  const isSaved = savedEventIds.includes(event.id);
  const bookingRatio = Math.round((event.soldTickets / event.totalTickets) * 100);
  const showAlertUrgency = bookingRatio > 80;

  const changeQty = (id: string, delta: number) =>
    setQtyMap(prev => {
      const next = Math.max(0, Math.min(10, (prev[id] ?? 0) + delta));
      const updated = { ...prev, [id]: next };
      if (next === 0) delete updated[id];
      return updated;
    });

  // Derive selection summary
  const selectionRows = ticketTypes
    ? ticketTypes.filter(tt => (qtyMap[tt.id] ?? 0) > 0).map(tt => ({
        tt, qty: qtyMap[tt.id],
      }))
    : [];
  const totalTickets = selectionRows.reduce((s, r) => s + r.qty, 0);
  const totalPrice   = selectionRows.reduce((s, r) => s + r.qty * Number(r.tt.price_aud), 0);

  // For fallback (no ticket types) — single general admission
  const [generalQty, setGeneralQty] = useState(1);
  const generalTotal = event.price * generalQty;

  const handleCheckoutSubmit = () => {
    if (ticketTypes) {
      selectionRows.forEach(r =>
        onBookTickets(event.id, r.qty, r.tt.name, r.tt.id)
      );
    } else {
      onBookTickets(event.id, generalQty, "General Admission");
    }
  };

  const handleAddToCart = () => {
    if (ticketTypes) {
      selectionRows.forEach(r =>
        onAddToCart(event.id, r.qty, r.tt.name, Number(r.tt.price_aud), r.tt.id)
      );
    } else {
      onAddToCart(event.id, generalQty, "General Admission", event.price);
    }
  };

  const toggleFaq = (idx: number) => {
    setShowFaq(showFaq === idx ? null : idx);
  };

  const localFaqs = [
    { q: "How do I access my e-ticket after purchase?", a: "Your pass is delivered straight to your secure digital account here on MYHitch Pass immediately after payment. Just navigate to 'My Tickets' in the navigation bar to scan your entry QR code at the gates. No physical download or email search required." },
    { q: "Can I transfer my ticket to a friend?", a: "Yes! Simply load the ticket detail page in your dashboard, click 'Transfer', and type your friend's e-mail address. We will automatically generate a secure new token and deliver it directly to their email address." },
    { q: "What is the organizer's refund policy?", a: "Refunds are generally permitted up to 48 hours before the start of the event. To check eligibility, click the cancellation request link inside your 'My Tickets' pass panel." }
  ];

  return (
    <div id="detail-view-container" className="bg-soft-bg min-h-screen text-dark-text pb-16">
      
      {/* Event Details Header image banner */}
      <div className="relative h-80 sm:h-[420px] w-full overflow-hidden">
        <img
          src={event.image}
          alt={event.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover select-none"
        />
        {/* Clean travel-style shade overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-dark-text/80 via-dark-text/30 to-transparent" />
        
        {/* Floating action header on top of image */}
        <div className="absolute top-6 inset-x-0">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
            <button
              id="detail-back-btn"
              onClick={onBack}
              className="flex items-center gap-2 bg-white hover:bg-neutral-50 text-dark-text border border-border-gray px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-md"
            >
              <ArrowLeft className="h-4 w-4 text-brand-blue" />
              <span>Back</span>
            </button>
            <div className="flex items-center gap-2">
              <button
                id="detail-save-btn"
                onClick={() => onToggleSave(event.id)}
                className="p-2.5 bg-white hover:bg-neutral-50 text-neutral-600 border border-border-gray rounded-full transition-all cursor-pointer shadow-md group"
                title={isSaved ? "Remove from Favorites" : "Add to Saved Experiences"}
              >
                <Heart className={`h-4 w-4 transition-all ${isSaved ? "text-red-500 fill-red-500 animate-pulse scale-110" : "text-brand-blue group-hover:text-red-500"}`} />
              </button>
              <button
                id="detail-share-btn"
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  alert("Event portal link copied to clipboard!");
                }}
                className="p-2.5 bg-white hover:bg-neutral-50 text-neutral-600 border border-border-gray rounded-full transition-all cursor-pointer shadow-md"
              >
                <Share2 className="h-4 w-4 text-brand-blue" />
              </button>
            </div>
          </div>
        </div>

        {/* Title details aligned to bottom of banner */}
        <div className="absolute bottom-6 inset-x-0 text-left">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-black bg-white/95 text-brand-blue border border-border-gray mb-3 uppercase tracking-wider text-[10px] shadow-sm">
              {event.category}
            </span>
            <h1 id="detail-event-title" className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-tight max-w-4xl">
              {event.title}
            </h1>
          </div>
        </div>
      </div>

      {/* Main Grid Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-12">
          
          {/* Left Side: Rich Details, description, highlights, FAQs */}
          <div className="lg:col-span-2 space-y-8 text-left">
            
            {/* Quick specifications shelf */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 bg-white rounded-[32px] border border-border-gray shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-light-tint rounded-2xl border border-brand-blue/15">
                  <Calendar className="h-5 w-5 text-brand-blue" />
                </div>
                <div>
                  <div className="text-[10px] text-neutral-400 uppercase font-black tracking-wider">Date & Time</div>
                  <div className="text-sm font-black text-dark-text">{event.date}</div>
                  <div className="text-xs text-neutral-500 font-bold leading-none">{event.time}</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-light-tint rounded-2xl border border-brand-blue/15">
                  <MapPin className="h-5 w-5 text-brand-blue" />
                </div>
                <div>
                  <div className="text-[10px] text-neutral-400 uppercase font-black tracking-wider">Venue Location</div>
                  <div className="text-sm font-black text-dark-text">{event.location}</div>
                  <div className="text-xs text-neutral-500 font-bold leading-none">{event.city}</div>
                </div>
              </div>
            </div>

            {/* Event Description */}
            <div className="space-y-3 bg-white p-6 rounded-[32px] border border-border-gray shadow-sm">
              <h2 className="text-lg font-black text-dark-text tracking-tight border-b border-border-gray pb-2">
                About the Experience
              </h2>
              <p className="text-neutral-500 text-xs sm:text-sm leading-relaxed whitespace-pre-line font-bold">
                {event.description}
              </p>
            </div>

            {/* Highlights bullet grid */}
            <div className="space-y-3.5">
              <h2 className="text-lg font-black text-dark-text tracking-tight border-b border-border-gray pb-2 flex items-center gap-2">
                <Sparkles className="h-4.5 w-4.5 text-brand-blue" />
                <span>Experience Highlights</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {event.highlights.map((highlight, idx) => (
                  <div key={idx} className="flex gap-2.5 items-start p-4 bg-white border border-border-gray rounded-[32px] shadow-sm">
                    <Award className="h-5 w-5 text-brand-blue mt-0.5 flex-shrink-0" />
                    <span className="text-xs text-neutral-600 font-semibold leading-relaxed">{highlight}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Organizer Card Profile (Trust Building) */}
            <div className="p-6 bg-white border border-border-gray rounded-[32px] flex flex-col sm:flex-row gap-5 items-center shadow-sm">
              <img
                src={event.organizerAvatar}
                alt={event.organizerName}
                referrerPolicy="no-referrer"
                className="w-14 h-14 rounded-full border border-border-gray object-cover flex-shrink-0"
              />
              <div className="text-center sm:text-left flex-1 space-y-1">
                <div className="text-[10px] text-brand-blue font-black uppercase tracking-wider">Presenter / Event Host</div>
                <h3 className="text-base font-extrabold text-dark-text leading-none">{event.organizerName}</h3>
                <p className="text-neutral-500 text-xs font-semibold leading-relaxed">
                  A verified premier host of top creative gatherings, concert seasons, and athletic clashes. Fully integrated with automated admissions on MYHitch Pass.
                </p>
              </div>
              <button
                onClick={() => alert(`Following ${event.organizerName}! You will receive alerts for their upcoming event drops.`)}
                className="bg-light-tint hover:bg-brand-blue/10 text-brand-blue font-bold uppercase tracking-wider text-xs px-5 py-2.5 rounded-full border border-brand-blue/20 transition-all cursor-pointer shadow-sm"
              >
                Follow Host
              </button>
            </div>

            {/* FAQs Accordion */}
            <div className="space-y-4">
              <h2 className="text-lg font-black text-dark-text tracking-tight border-b border-border-gray pb-2 flex items-center gap-2">
                <HelpCircle className="h-4.5 w-4.5 text-brand-blue" />
                <span>Frequently Asked Questions</span>
              </h2>
              <div className="space-y-2.5">
                {localFaqs.map((faq, idx) => (
                  <div key={idx} className="bg-white border border-border-gray rounded-[32px] overflow-hidden text-xs shadow-sm">
                    <button
                      id={`faq-btn-${idx}`}
                      onClick={() => toggleFaq(idx)}
                      className="w-full text-left px-5 py-4 font-bold text-dark-text hover:text-brand-blue flex items-center justify-between transition-colors cursor-pointer"
                    >
                      <span>{faq.q}</span>
                      <ChevronRight className={`h-4 w-4 text-neutral-450 transform transition-transform duration-300 ${showFaq === idx ? "rotate-90 text-brand-blue" : ""}`} />
                    </button>
                    {showFaq === idx && (
                      <div className="px-5 pb-5 pt-2 text-neutral-500 leading-relaxed border-t border-border-gray animate-fade bg-soft-bg font-semibold">
                        {faq.a}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Side: Sticky Checkout Pricing panel */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-border-gray rounded-[28px] p-5 h-fit lg:sticky lg:top-24 shadow-md space-y-3">

              {/* Urgency banner */}
              {showAlertUrgency && (
                <div className="flex gap-2 items-start bg-red-50 border border-red-100 text-red-700 rounded-2xl p-3 text-[11px] leading-relaxed font-semibold">
                  <ShieldAlert className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
                  <span>Tickets are <span className="font-extrabold underline">{bookingRatio}% booked</span> — secure yours now!</span>
                </div>
              )}

              {/* Ticket type cards — each has its own inline qty control */}
              {ticketTypes ? ticketTypes.map((tt, idx) => {
                const qty     = qtyMap[tt.id] ?? 0;
                const soldOut = tt.available === 0;
                const isVIP   = /vip|backstage/i.test(tt.name);
                const isPremium = /premium|reserved|balcony|view/i.test(tt.name);
                const isFirst = idx === 0;

                // Badge logic
                const badge = soldOut
                  ? { label: "SOLD OUT", cls: "bg-red-50 text-red-400 border-red-100" }
                  : isVIP
                  ? { label: "VIP",      cls: "bg-purple-50 text-purple-500 border-purple-100" }
                  : isPremium
                  ? { label: "BEST VIEW", cls: "bg-sky-50 text-brand-blue border-brand-blue/20" }
                  : isFirst
                  ? { label: "POPULAR",  cls: "bg-sky-50 text-brand-blue border-brand-blue/20" }
                  : null;

                // Icon
                const iconBg  = isVIP ? "bg-purple-100" : "bg-sky-100";
                const iconClr = isVIP ? "text-purple-500" : "text-brand-blue";
                const IconEl  = isVIP ? Crown : isPremium ? Star : Ticket;

                // Price color
                const priceClr = isVIP ? "text-purple-500" : "text-brand-blue";

                return (
                  <div key={tt.id}
                    className={`rounded-2xl border transition-all ${soldOut ? "opacity-50" : ""} ${qty > 0 ? "border-brand-blue/40 bg-light-tint/40" : "border-border-gray bg-white"}`}>
                    <div className="flex items-start gap-3 p-3.5">
                      {/* Icon */}
                      <div className={`h-10 w-10 rounded-xl ${iconBg} ${iconClr} flex items-center justify-center shrink-0 mt-0.5`}>
                        <IconEl className="h-5 w-5" />
                      </div>

                      {/* Name + badge + description */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
                          <span className="text-sm font-black text-dark-text leading-tight">{tt.name}</span>
                          {badge && (
                            <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${badge.cls}`}>
                              {badge.label}
                            </span>
                          )}
                        </div>
                        {tt.description && (
                          <p className="text-[11px] text-neutral-400 font-medium leading-snug line-clamp-2">{tt.description}</p>
                        )}
                        {!soldOut && tt.available != null && tt.available <= 20 && (
                          <p className="text-[10px] text-red-400 font-bold mt-0.5">Only {tt.available} left!</p>
                        )}
                      </div>

                      {/* Price + qty control (stacked right) */}
                      <div className="flex flex-col items-end gap-2 shrink-0 ml-1">
                        <span className={`text-lg font-black leading-none ${priceClr}`}>
                          ${Number(tt.price_aud).toFixed(0)}
                        </span>
                        {!soldOut && (
                          qty > 0 ? (
                            <div className="flex items-center gap-1.5">
                              <button onClick={() => changeQty(tt.id, -1)}
                                className="h-7 w-7 rounded-full border border-brand-blue/30 text-brand-blue bg-white hover:bg-light-tint flex items-center justify-center font-bold text-sm transition-all cursor-pointer">
                                −
                              </button>
                              <span className="w-5 text-center text-sm font-black text-dark-text">{qty}</span>
                              <button onClick={() => changeQty(tt.id, 1)}
                                className="h-7 w-7 rounded-full border border-brand-blue/30 text-brand-blue bg-white hover:bg-light-tint flex items-center justify-center font-bold text-sm transition-all cursor-pointer">
                                +
                              </button>
                            </div>
                          ) : (
                            <button onClick={() => changeQty(tt.id, 1)}
                              className="h-7 w-7 rounded-full border border-brand-blue/30 text-brand-blue bg-white hover:bg-light-tint flex items-center justify-center transition-all cursor-pointer">
                              <Plus className="h-3.5 w-3.5" />
                            </button>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                );
              }) : (
                /* No ticket types — single general admission */
                <div className="rounded-2xl border border-brand-blue/40 bg-light-tint/40">
                  <div className="flex items-start gap-3 p-3.5">
                    <div className="h-10 w-10 rounded-xl bg-sky-100 text-brand-blue flex items-center justify-center shrink-0">
                      <Ticket className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className="text-sm font-black text-dark-text">General Admission</span>
                        <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border bg-sky-50 text-brand-blue border-brand-blue/20">STANDARD</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <span className="text-lg font-black text-brand-blue leading-none">${event.price.toFixed(0)}</span>
                      <div className="flex items-center gap-1.5">
                        <button onClick={() => setGeneralQty(q => Math.max(1, q - 1))}
                          className="h-7 w-7 rounded-full border border-brand-blue/30 text-brand-blue bg-white hover:bg-light-tint flex items-center justify-center font-bold text-sm cursor-pointer">−</button>
                        <span className="w-5 text-center text-sm font-black text-dark-text">{generalQty}</span>
                        <button onClick={() => setGeneralQty(q => Math.min(10, q + 1))}
                          className="h-7 w-7 rounded-full border border-brand-blue/30 text-brand-blue bg-white hover:bg-light-tint flex items-center justify-center font-bold text-sm cursor-pointer">+</button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ── YOUR SELECTION table ─────────────────────────────────── */}
              {(selectionRows.length > 0 || !ticketTypes) && (
                <div className="rounded-2xl border border-border-gray overflow-hidden">
                  {/* Header */}
                  <div className="flex items-center justify-between px-4 py-2.5 bg-soft-bg border-b border-border-gray">
                    <div className="flex items-center gap-2 text-[11px] font-black text-neutral-500 uppercase tracking-wider">
                      <Tag className="h-3.5 w-3.5 text-brand-blue" />
                      Your Selection
                    </div>
                    <span className="text-[10px] font-black bg-brand-blue text-white px-2.5 py-0.5 rounded-full">
                      {ticketTypes ? totalTickets : generalQty} ticket{(ticketTypes ? totalTickets : generalQty) !== 1 ? "s" : ""}
                    </span>
                  </div>

                  {/* Rows */}
                  <div className="divide-y divide-border-gray">
                    {ticketTypes ? selectionRows.map((r, i) => {
                      const isVIP2    = /vip|backstage/i.test(r.tt.name);
                      const isPremium2 = /premium|reserved|balcony|view/i.test(r.tt.name);
                      const IconEl2   = isVIP2 ? Crown : isPremium2 ? Star : Ticket;
                      const iconClr2  = isVIP2 ? "text-purple-400" : "text-brand-blue";
                      const iconBg2   = isVIP2 ? "bg-purple-50" : "bg-sky-50";
                      const priceClr2 = isVIP2 ? "text-purple-500" : "text-brand-blue";
                      return (
                        <div key={r.tt.id} className="flex items-center gap-3 px-4 py-3">
                          <span className="text-[10px] font-black text-neutral-300 w-4 shrink-0">
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          <div className={`h-7 w-7 rounded-lg ${iconBg2} ${iconClr2} flex items-center justify-center shrink-0`}>
                            <IconEl2 className="h-3.5 w-3.5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-black text-dark-text truncate">{r.tt.name}</p>
                            {r.tt.description && <p className="text-[10px] text-neutral-400 font-medium truncate">{r.tt.description}</p>}
                          </div>
                          <div className="text-right shrink-0">
                            <p className={`text-sm font-black ${priceClr2}`}>${(Number(r.tt.price_aud) * r.qty).toFixed(0)}</p>
                            <p className="text-[10px] text-neutral-400 font-medium">{r.qty}× ${Number(r.tt.price_aud).toFixed(0)}</p>
                          </div>
                        </div>
                      );
                    }) : (
                      <div className="flex items-center gap-3 px-4 py-3">
                        <span className="text-[10px] font-black text-neutral-300 w-4 shrink-0">01</span>
                        <div className="h-7 w-7 rounded-lg bg-sky-50 text-brand-blue flex items-center justify-center shrink-0">
                          <Ticket className="h-3.5 w-3.5" />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs font-black text-dark-text">General Admission</p>
                          <p className="text-[10px] text-neutral-400 font-medium">Standard Entry</p>
                        </div>
                        <p className="text-sm font-black text-brand-blue">${event.price.toFixed(0)}</p>
                      </div>
                    )}
                  </div>

                  {/* Total row */}
                  <div className="flex items-center justify-between px-4 py-3 bg-soft-bg border-t border-border-gray">
                    <span className="text-[10px] font-black text-neutral-400 uppercase tracking-wider">Total</span>
                    <span id="detail-total-display" className="text-xl font-black text-brand-blue">
                      ${ticketTypes ? totalPrice.toFixed(2) : generalTotal.toFixed(2)}
                    </span>
                  </div>
                </div>
              )}

              {/* CTA buttons */}
              <button
                id="detail-btn-quick-checkout"
                onClick={handleCheckoutSubmit}
                disabled={ticketTypes ? totalTickets === 0 : false}
                className="w-full text-white font-black uppercase tracking-wider text-xs py-4 rounded-full flex items-center justify-center gap-2 shadow-lg cursor-pointer transition-all active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ background: "linear-gradient(135deg, #00aeef, #0077b6)", boxShadow: "0 6px 20px rgba(0,174,239,0.3)" }}
              >
                <Zap className="h-4 w-4" />
                Quick Checkout
              </button>

              <button
                id="detail-btn-add-to-cart"
                onClick={handleAddToCart}
                disabled={ticketTypes ? totalTickets === 0 : false}
                className="w-full bg-white border-2 border-brand-blue text-brand-blue font-black uppercase tracking-wider text-xs py-3.5 rounded-full flex items-center justify-center gap-2 cursor-pointer hover:bg-light-tint transition-all active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ShoppingCart className="h-4 w-4" />
                Add to Cart
              </button>

              <p className="text-center text-[10px] text-neutral-400 font-semibold">
                E-pass tickets issued instantly to your wallet.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
