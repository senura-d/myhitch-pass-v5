"use client";

import React, { useState, useEffect } from "react";
import { Search, MapPin, Sparkles, Filter, ShieldCheck, Ticket } from "lucide-react";
import { EventCategory } from "../types";

interface HeroProps {
  onSearch: (query: string, category: string, location: string) => void;
  setView: (view: string) => void;
}

// Visual, premium unsplash backdrops matching Headout's world-class experience vibe
const BACKGROUND_IMAGES = [
  "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1600&q=80", // High-impact live neon concert
  "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1600&q=80", // Massive cultural crowd festival
  "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1600&q=80", // Stellar stage performance lights
  "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=1600&q=80", // Cozy amphitheater live music
  "https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=1600&q=80"  // Stunning visual laser lights show
];

export default function Hero({ onSearch, setView }: HeroProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [prevImageIndex, setPrevImageIndex] = useState<number | null>(null);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");

  // Preload all images on mount so transitions never stutter
  useEffect(() => {
    BACKGROUND_IMAGES.forEach((url) => {
      const img = new Image();
      img.src = url;
    });
  }, []);

  // Crossfade interval: save outgoing index, advance current, clear outgoing after animation
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => {
        setPrevImageIndex(prev);
        const next = (prev + 1) % BACKGROUND_IMAGES.length;
        return next;
      });
    }, 11000);
    return () => clearInterval(timer);
  }, []);

  // Clear the previous image slot after its fade-out animation completes (700ms)
  useEffect(() => {
    if (prevImageIndex === null) return;
    const t = setTimeout(() => setPrevImageIndex(null), 11000);
    return () => clearTimeout(t);
  }, [prevImageIndex]);

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
    <div id="hero-section" className="relative min-h-[500px] sm:min-h-[560px] md:min-h-[620px] lg:min-h-[660px] flex items-center justify-center text-white overflow-hidden py-14 sm:py-20 border-b border-border-gray select-none">
      
      {/* 1. LOOPING IMMERSIVE BACKGROUND GALLERY — TWO-LAYER SMOOTH CROSSFADE */}
      <div className="absolute inset-0 bg-neutral-900 z-0">

        {/* Bottom layer: outgoing image (already fading out via heroImageAnim) */}
        {prevImageIndex !== null && (
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url('${BACKGROUND_IMAGES[prevImageIndex]}')`,
              opacity: 0,
            }}
          />
        )}

        {/* Top layer: fade-in + slow zoom + fade-out, all in one animation */}
        <div
          key={currentImageIndex}
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('${BACKGROUND_IMAGES[currentImageIndex]}')`,
            animation: "heroImageAnim 11000ms ease-in-out forwards",
            willChange: "opacity, transform",
          }}
        />

        {/* Gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-900/60 to-neutral-900/40 z-10" />

        {/* Subtle dot texture */}
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1.2px,transparent_1.2px)] [background-size:20px_20px] opacity-60 z-10" />
      </div>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 sm:space-y-8 z-20 animate-fade">
        
        {/* 2. PREMIUM MINI SPARK BADGE */}
        <div id="hero-badge" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-white text-xs font-semibold backdrop-blur-md">
          <Sparkles className="h-3.5 w-3.5 text-brand-blue animate-pulse " />
          <span className="uppercase tracking-wider text-[9px] font-bold">Real tickets • No hidden fees</span>
        </div>

        {/* 3. HEADOUT-STYLE GRAND HEADLINE */}
        <div className="space-y-4">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-white leading-[1.05]">
            The World's Best <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-brand-blue to-sky-300 bg-clip-text text-transparent">Experiences</span> <br className="sm:hidden" />
            Curated Just For You
          </h1>
          <p className="text-xs sm:text-sm text-neutral-300 max-w-xl mx-auto font-medium leading-relaxed">
            Instantly discover and book verified tickets to concerts, premier music festivals, live theater shows, matches, and local tours. Instant digital barcodes delivered.
          </p>
        </div>

        {/* 4. HIGHLY PROMINENT SEARCH BAR */}
        <div id="search-container" className="max-w-4xl mx-auto pt-2">
          <form
            onSubmit={handleSubmit}
            className="bg-white/95 border border-white/20 p-2 rounded-[24px] sm:rounded-full shadow-2xl backdrop-blur-md flex flex-col sm:flex-row gap-2 sm:items-center text-dark-text"
          >
            {/* Input 1: Search query */}
            <div className="flex-1 flex items-center gap-3 px-4 py-2 border-b border-border-gray sm:border-b-0 sm:border-r">
              <Search className="h-5 w-5 text-brand-blue shrink-0" />
              <input
                id="search-input-query"
                type="text"
                placeholder="Search events, artists, or cities"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-transparent text-dark-text text-xs focus:outline-none placeholder-neutral-450 font-semibold"
              />
            </div>

            {/* Input 2: Categories dropdown filter */}
            <div className="flex-1 flex items-center gap-2 px-4 py-2 border-b border-border-gray sm:border-b-0 sm:border-r">
              <Filter className="h-5 w-5 text-brand-blue shrink-0" />
              <select
                id="search-select-category"
                title="Event Category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-transparent text-dark-text text-xs focus:outline-none focus:ring-0 placeholder-neutral-500 font-bold cursor-pointer"
              >
                <option value="" className="text-dark-text">All event types</option>
                {Object.values(EventCategory).map((cat) => (
                  <option key={cat} value={cat} className="text-dark-text">
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Input 3: Location search */}
            <div className="flex-1 flex items-center gap-2 px-4 py-2">
              <MapPin className="h-5 w-5 text-brand-blue shrink-0" />
              <input
                id="search-input-location"
                type="text"
                placeholder="Your city"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-transparent text-dark-text text-xs focus:outline-none placeholder-neutral-450 font-semibold"
              />
            </div>

            {/* CTA action trigger */}
            <button
              id="search-btn-submit"
              type="submit"
              className="bg-brand-blue hover:bg-brand-blue-hover text-white font-black uppercase text-xs tracking-wider px-8 py-3.5 rounded-xl sm:rounded-full min-w-[130px] transition-all transform active:scale-97 shadow-lg shadow-brand-blue/20 cursor-pointer"
            >
              Search
            </button>
          </form>
        </div>

        {/* 5. STRONGER VISUAL PROMOTIONS AND ACTION LAYOUTS */}
        <div id="hero-cta-buttons" className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            id="hero-cta-explore-tickets"
            onClick={() => setView("events")}
            className="bg-brand-blue hover:bg-brand-blue-hover text-white font-black uppercase text-xs tracking-wider px-7 py-3 rounded-full shadow-lg shadow-brand-blue/20 cursor-pointer transition-transform duration-200 hover:-translate-y-0.5 active:scale-98"
          >
            Find events near me
          </button>
          
          <button
            id="hero-cta-routing-sell"
            onClick={() => setView("organiser-sop")}
            className="bg-white/10 hover:bg-white/20 border border-white/25 text-white font-extrabold text-xs px-6 py-3 rounded-full cursor-pointer transition-transform duration-200 hover:-translate-y-0.5 backdrop-blur-sm"
          >
            Start selling tickets
          </button>
        </div>

        {/* 6. TRUST HIGHLIGHTS */}
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

        {/* Categories Shortcut Quick Chips */}
        <div id="quick-categories" className="flex flex-wrap items-center justify-center gap-2 pt-4">
          <span className="text-xs font-bold text-neutral-300 uppercase tracking-widest mr-1">Quick links:</span>
          {Object.values(EventCategory).map((cat) => (
            <button
              key={cat}
              id={`chip-${cat.toLowerCase().replace(/\s&/g, "").replace(/\s/g, "-")}`}
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
