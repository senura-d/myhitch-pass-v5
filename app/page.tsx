"use client";

import { Building2, ArrowRight } from "lucide-react";
import Hero from "@/src/components/Hero";
import PopularCategories from "@/src/components/PopularCategories";
import FeaturedEvents from "@/src/components/FeaturedEvents";
import StatsStrip from "@/src/components/StatsStrip";
import OrganiserFAQ from "@/src/components/OrganiserFAQ";
import { useAppContext } from "@/app/providers";

function EventCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm">
      <div className="h-48 bg-slate-200 animate-pulse" />
      <div className="p-4 space-y-3">
        <div className="h-5 bg-slate-200 rounded animate-pulse w-3/4" />
        <div className="h-4 bg-slate-100 rounded animate-pulse w-1/2" />
        <div className="h-4 bg-slate-100 rounded animate-pulse w-2/3" />
      </div>
    </div>
  );
}

export default function HomePage() {
  const {
    events,
    eventsLoading,
    handleSelectEvent,
    triggerQuickCheckout,
    setView,
    handleSearchDispatch,
  } = useAppContext();

  return (
    <div className="animate-fade">
      <Hero onSearch={handleSearchDispatch} setView={setView} />
      <PopularCategories
        onSelectCategory={(cat) => handleSearchDispatch("", cat, "")}
      />
      {eventsLoading && events.length === 0 ? (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="h-7 w-40 bg-slate-200 rounded-xl animate-pulse mb-6" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => <EventCardSkeleton key={i} />)}
          </div>
        </section>
      ) : (
        <FeaturedEvents
          events={events}
          onSelectEvent={handleSelectEvent}
          onQuickBook={triggerQuickCheckout}
          setView={setView}
        />
      )}
      <StatsStrip />
      <OrganiserFAQ />

{/* CTA for event creators — parallax image banner */}
      <section
        id="creator-promote-banner"
        className="relative overflow-hidden min-h-[480px] py-32 text-white flex items-center"
      >
        {/* Background image — Ken Burns zoom on all sizes.
            bg-scroll on mobile (iOS Safari bg-fixed is broken),
            bg-fixed on md+ for true parallax. */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-scroll md:bg-fixed animate-ken-burns"
          style={{ backgroundImage: "url('/images/cta-bg.png')" }}
          aria-hidden="true"
        />

        {/* Dark gradient overlay — ensures text legibility over any image */}
        <div
          className="absolute inset-0 bg-gradient-to-br from-slate-900/80 via-blue-900/70 to-slate-900/85"
          aria-hidden="true"
        />

        {/* Foreground content — z-10 so it sits above both layers and NEVER animates */}
        <div className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
          <div className="h-12 w-12 bg-white/10 border border-white/20 text-white rounded-2xl flex items-center justify-center mb-6 backdrop-blur-sm">
            <Building2 className="h-6 w-6" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-4">
            Got an event idea? Start earning today.
          </h2>
          <p className="text-sm text-white/70 max-w-xl mb-8 leading-relaxed">
            Anyone can sell tickets on MYHitch Pass. No big company needed.
            Sign up free, add your event, and get paid straight to your bank.
          </p>
          <button
            id="home-cta-become-organizer"
            onClick={() => setView("organiser-sop")}
            className="bg-brand-blue hover:bg-brand-blue-hover text-white font-extrabold text-xs px-8 py-3.5 rounded-xl shadow-lg shadow-brand-blue/30 flex items-center gap-1.5 transition-all active:scale-[0.98] cursor-pointer"
          >
            <span>Show me how</span>
            <ArrowRight className="h-4.5 w-4.5" />
          </button>
        </div>
      </section>
    </div>
  );
}
