"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import {
  Search,
  MapPin,
  Sparkles,
  Filter,
  ShieldCheck,
  Ticket,
} from "lucide-react";
import { EventCategory } from "../types";

/* Three.js canvas — loaded client-side only to avoid SSR issues */
const HeroWaveBackground = dynamic(
  () => import("./HeroWaveBackground"),
  { ssr: false }
);

interface HeroProps {
  onSearch: (query: string, category: string, location: string) => void;
  setView: (view: string) => void;
}

export default function Hero({ onSearch, setView }: HeroProps) {
  const [query,    setQuery]    = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query, category, location);
    setView("events");
  };

  const setCategoryAndSearch = (cat: string) => {
    setCategory(cat);
    onSearch(query, cat, location);
    setView("events");
  };

  return (
    <div
      id="hero-section"
      className="relative min-h-[500px] sm:min-h-[560px] md:min-h-[620px] lg:min-h-[680px] flex items-center justify-center text-white overflow-hidden py-14 sm:py-20 border-b border-border-gray select-none"
      style={{ background: "#050D1C" }}
    >
      {/* ── 1. 3-D WAVE CANVAS BACKGROUND ─────────────────────────────── */}
      <HeroWaveBackground />

      {/* ── 2. RADIAL GLOW — centres the brand-blue bloom ──────────────── */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 70%, rgba(0,174,239,0.13) 0%, transparent 70%)",
        }}
      />

      {/* ── 3. BOTTOM GRADIENT — grounds the hero ──────────────────────── */}
      <div
        className="absolute inset-0 z-[2] pointer-events-none"
        style={{
          background:
            "linear-gradient(to top, #050D1C 0%, rgba(5,13,28,0.55) 40%, transparent 100%)",
        }}
      />

      {/* ── 4. DOT-GRID TEXTURE ─────────────────────────────────────────── */}
      <div
        className="absolute inset-0 z-[2] pointer-events-none opacity-30"
        style={{
          backgroundImage:
            "radial-gradient(#ffffff14 1px, transparent 1px)",
          backgroundSize: "22px 22px",
        }}
      />

      {/* ── 5. HERO CONTENT (fades out on scroll via GSAP) ──────────────── */}
      <div
        id="hero-overlay-content"
        className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 sm:space-y-8"
      >
        {/* Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 border border-white/15 text-white text-xs font-semibold backdrop-blur-md">
          <Sparkles className="h-3.5 w-3.5 text-brand-blue animate-pulse" />
          <span className="uppercase tracking-wider text-[9px] font-bold">
            Real tickets • No hidden fees
          </span>
        </div>

        {/* Headline */}
        <div className="space-y-4">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-white leading-[1.05]">
            The World&apos;s Best{" "}
            <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-brand-blue to-sky-300 bg-clip-text text-transparent">
              Experiences
            </span>{" "}
            <br className="sm:hidden" />
            Curated Just For You
          </h1>
          <p className="text-xs sm:text-sm text-neutral-300 max-w-xl mx-auto font-medium leading-relaxed">
            Instantly discover and book verified tickets to concerts, premier
            music festivals, live theater shows, matches, and local tours.
            Instant digital barcodes delivered.
          </p>
        </div>

        {/* Search bar */}
        <div className="max-w-4xl mx-auto pt-2">
          <form
            onSubmit={handleSubmit}
            className="bg-white/95 border border-white/20 p-2 rounded-[24px] sm:rounded-full shadow-2xl backdrop-blur-md flex flex-col sm:flex-row gap-2 sm:items-center text-dark-text"
          >
            <div className="flex-1 flex items-center gap-3 px-4 py-2 border-b border-border-gray sm:border-b-0 sm:border-r">
              <Search className="h-5 w-5 text-brand-blue shrink-0" />
              <input
                type="text"
                placeholder="Search events, artists, or cities"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-transparent text-dark-text text-xs focus:outline-none placeholder-neutral-450 font-semibold"
              />
            </div>

            <div className="flex-1 flex items-center gap-2 px-4 py-2 border-b border-border-gray sm:border-b-0 sm:border-r">
              <Filter className="h-5 w-5 text-brand-blue shrink-0" />
              <select
                title="Event Category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-transparent text-dark-text text-xs focus:outline-none focus:ring-0 font-bold cursor-pointer"
              >
                <option value="">All event types</option>
                {Object.values(EventCategory).map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex-1 flex items-center gap-2 px-4 py-2">
              <MapPin className="h-5 w-5 text-brand-blue shrink-0" />
              <input
                type="text"
                placeholder="Your city"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-transparent text-dark-text text-xs focus:outline-none placeholder-neutral-450 font-semibold"
              />
            </div>

            <button
              type="submit"
              className="bg-brand-blue hover:bg-brand-blue-hover text-white font-black uppercase text-xs tracking-wider px-8 py-3.5 rounded-xl sm:rounded-full min-w-[130px] transition-all active:scale-97 shadow-lg shadow-brand-blue/30 cursor-pointer"
            >
              Search
            </button>
          </form>
        </div>

        {/* CTA buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={() => setView("events")}
            className="bg-brand-blue hover:bg-brand-blue-hover text-white font-black uppercase text-xs tracking-wider px-7 py-3 rounded-full shadow-lg shadow-brand-blue/25 cursor-pointer transition-transform duration-200 hover:-translate-y-0.5 active:scale-98"
          >
            Find events near me
          </button>
          <button
            onClick={() => setView("organiser-sop")}
            className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-extrabold text-xs px-6 py-3 rounded-full cursor-pointer transition-transform duration-200 hover:-translate-y-0.5 backdrop-blur-sm"
          >
            Start selling tickets
          </button>
        </div>

        {/* Trust highlights */}
        <div className="flex justify-center items-center gap-6 text-[10px] sm:text-xs text-neutral-300 font-semibold pt-1">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            <span>Always real tickets</span>
          </div>
          <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
          <div className="flex items-center gap-1.5">
            <Ticket className="h-4 w-4 text-brand-blue" />
            <span>On your phone in 30 seconds</span>
          </div>
        </div>

        {/* Category quick chips */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
          <span className="text-xs font-bold text-neutral-300 uppercase tracking-widest mr-1">
            Quick links:
          </span>
          {Object.values(EventCategory).map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryAndSearch(cat)}
              className="px-4 py-1.5 rounded-full text-xs font-bold bg-white/10 hover:bg-white text-white hover:text-dark-text border border-white/10 hover:border-white transition-all cursor-pointer backdrop-blur-sm"
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
