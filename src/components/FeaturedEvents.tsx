"use client";

import { MapPin, Calendar, Clock, ArrowRight, Sparkles } from "lucide-react";
import { Event } from "../types";
import { HeroHighlight, Highlight } from "@/components/ui/hero-highlight";

interface FeaturedEventsProps {
  events: Event[];
  onSelectEvent: (eventId: string) => void;
  onQuickBook: (eventId: string) => void;
  setView: (view: string) => void;
}

const CATEGORY_STYLES: Record<string, { badge: string; glow: string; spine: string }> = {
  festivals:  { badge: "bg-amber-500 border-amber-400",   glow: "shadow-amber-500/20",  spine: "from-amber-400 to-orange-500" },
  concerts:   { badge: "bg-purple-500 border-purple-400", glow: "shadow-purple-500/20", spine: "from-purple-400 to-pink-500" },
  sports:     { badge: "bg-emerald-500 border-emerald-400", glow: "shadow-emerald-500/20", spine: "from-emerald-400 to-teal-500" },
  theatre:    { badge: "bg-rose-500 border-rose-400",     glow: "shadow-rose-500/20",   spine: "from-rose-400 to-pink-500" },
  comedy:     { badge: "bg-yellow-500 border-yellow-400", glow: "shadow-yellow-500/20", spine: "from-yellow-400 to-amber-500" },
};

function getCategoryStyle(category: string) {
  return CATEGORY_STYLES[category.toLowerCase()] ?? {
    badge: "bg-slate-500 border-slate-400",
    glow: "shadow-slate-500/20",
    spine: "from-brand-blue to-sky-400",
  };
}

// Deterministic pseudo-barcode widths from event id
function barcodeWidths(seed: string) {
  const pattern = [3,1,2,1,3,2,1,2,1,3,1,1,2,1,2,3,1,2,1,1,3,2,1,3,1,2,1,1,2,3];
  return seed.split("").reduce((acc, ch, i) => {
    acc[i % 30] = ((acc[i % 30] || 1) + ch.charCodeAt(0)) % 4 + 1;
    return acc;
  }, [...pattern]);
}

export default function FeaturedEvents({
  events,
  onSelectEvent,
  onQuickBook,
  setView,
}: FeaturedEventsProps) {
  const featured = events.filter((e) => e.featured);

  return (
    <HeroHighlight
      containerClassName="w-full py-16 border-b border-border-gray bg-white"
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full"
    >
      <div className="w-full text-left">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-light-tint text-[10px] font-bold uppercase rounded-full text-brand-blue tracking-wider mb-3 border border-brand-blue/15 shadow-sm">
              <Sparkles className="h-3 w-3 text-brand-blue animate-pulse" />
              <span>Trending Highlights</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-dark-text tracking-tight">
              Featured <Highlight className="text-dark-text font-black">Experiences</Highlight>
            </h2>
            <p className="mt-1.5 text-neutral-500 max-w-xl text-xs sm:text-sm font-semibold leading-relaxed">
              Explore premium live events, concerts, and tournaments with direct booking options, official entry passes, and instant checkout.
            </p>
          </div>

          <button
            id="featured-btn-view-all"
            onClick={() => setView("events")}
            className="mt-4 md:mt-0 flex items-center gap-2 text-brand-blue hover:text-brand-blue-hover font-bold text-sm transition-colors cursor-pointer group"
          >
            <span>Browse all live events</span>
            <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Ticket Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {featured.map((event) => {
            const bookingPercentage = Math.round((event.soldTickets / event.totalTickets) * 100);
            const isFull = bookingPercentage >= 100;
            const cat = getCategoryStyle(event.category);
            const bars = barcodeWidths(event.id);

            return (
              <div
                key={event.id}
                id={`featured-card-${event.id}`}
                className={`group relative flex flex-col bg-white rounded-3xl border border-slate-200 hover:border-brand-blue/40 shadow-lg hover:shadow-2xl ${cat.glow} transition-all duration-300 hover:-translate-y-2`}
              >
                {/* ── Colored top spine stripe ── */}
                <div className={`absolute top-0 left-6 right-6 h-[3px] rounded-b-full bg-gradient-to-r ${cat.spine} z-10`} />

                {/* ── Event Image ── */}
                <div className="relative h-[200px] overflow-hidden rounded-t-3xl">
                  <img
                    src={event.image}
                    alt={event.title}
                    referrerPolicy="no-referrer"
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  {/* dark gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />

                  {/* Category badge */}
                  <span className={`absolute top-4 left-4 inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase text-white border shadow-md ${cat.badge}`}>
                    {event.category}
                  </span>

                  {/* Price stamp */}
                  <div className="absolute bottom-4 right-4 flex items-baseline gap-0.5 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-xl shadow-xl border border-white/60">
                    <span className="text-brand-blue font-black text-sm">${event.price}</span>
                    <span className="text-[9px] font-bold text-neutral-400">/pass</span>
                  </div>
                </div>

                {/* ── Ticket Tear Line ── */}
                <div className="mx-5 border-t-2 border-dashed border-slate-200" />

                {/* ── Ticket Body ── */}
                <div className="px-5 pt-4 pb-5 flex-1 flex flex-col">

                  {/* Date / Time */}
                  <div className="flex items-center gap-1.5 text-[11px] text-neutral-500 font-bold mb-2.5">
                    <Calendar className="h-3.5 w-3.5 text-brand-blue shrink-0" />
                    <span>{event.date}</span>
                    <span className="text-neutral-300 font-extrabold">•</span>
                    <Clock className="h-3.5 w-3.5 text-brand-blue shrink-0" />
                    <span className="truncate">{event.time}</span>
                  </div>

                  {/* Title */}
                  <h3 className="text-base font-black text-dark-text group-hover:text-brand-blue transition-colors mb-1 line-clamp-1 leading-snug">
                    {event.title}
                  </h3>

                  {/* Location */}
                  <div className="flex items-center gap-1 text-xs text-neutral-500 font-semibold mb-3 line-clamp-1">
                    <MapPin className="h-3.5 w-3.5 text-brand-blue shrink-0" />
                    <span>{event.location}, {event.city}</span>
                  </div>

                  {/* Booking progress */}
                  <div className="mb-3">
                    <div className="flex items-center justify-between text-[11px] text-neutral-500 font-bold mb-1.5">
                      <span className="flex items-center gap-1">
                        <span className={`h-2 w-2 rounded-full ${isFull ? "bg-red-500" : bookingPercentage > 85 ? "bg-amber-500 animate-pulse" : "bg-emerald-500"}`} />
                        {isFull ? "Sold Out" : `${bookingPercentage}% Booked`}
                      </span>
                      <span className="font-semibold text-neutral-400">
                        {event.soldTickets.toLocaleString()} / {event.totalTickets.toLocaleString()}
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${isFull ? "bg-red-500" : bookingPercentage > 85 ? "bg-gradient-to-r from-amber-500 to-rose-500" : "bg-gradient-to-r from-brand-blue to-sky-400"}`}
                        style={{ width: `${Math.min(bookingPercentage, 100)}%` }}
                      />
                    </div>
                  </div>

                  {/* ── Barcode decoration ── */}
                  <div className="flex items-end gap-px mb-4 opacity-[0.15] select-none" aria-hidden>
                    {bars.map((w, i) => (
                      <div
                        key={i}
                        className="bg-neutral-900 rounded-[1px]"
                        style={{
                          width: `${w}px`,
                          height: `${16 + (i % 5) * 4}px`,
                        }}
                      />
                    ))}
                  </div>

                  {/* CTA Buttons */}
                  <div className="mt-auto flex gap-3">
                    <button
                      id={`featured-details-btn-${event.id}`}
                      onClick={() => onSelectEvent(event.id)}
                      className="flex-1 border border-slate-200 hover:border-brand-blue/40 hover:bg-sky-50/50 text-neutral-700 hover:text-brand-blue font-bold text-xs py-2.5 rounded-full transition-all duration-200 cursor-pointer"
                    >
                      View Details
                    </button>
                    <button
                      id={`featured-book-btn-${event.id}`}
                      disabled={isFull}
                      onClick={() => onQuickBook(event.id)}
                      className={`flex-1 font-black uppercase tracking-wider text-[10px] py-2.5 rounded-full transition-all duration-200 flex items-center justify-center gap-1 ${
                        isFull
                          ? "bg-neutral-100 text-neutral-400 cursor-not-allowed"
                          : "bg-gradient-to-r from-brand-blue to-sky-400 hover:from-sky-400 hover:to-brand-blue text-white shadow-md shadow-brand-blue/20 cursor-pointer active:scale-[0.98]"
                      }`}
                    >
                      Book Direct
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </HeroHighlight>
  );
}
