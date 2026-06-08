"use client";

import { Sparkles, ArrowRight } from "lucide-react";
import { EventCategory } from "../types";
import { HeroHighlight, Highlight } from "@/components/ui/hero-highlight";

interface PopularCategoriesProps {
  onSelectCategory: (category: string) => void;
}

const CATEGORY_CARDS = [
  {
    name: EventCategory.CONCERTS,
    slug: "concerts",
    tagline: "Live music nights",
    image: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&w=600&q=80",
    color: "from-purple-600/80 to-pink-600/80"
  },
  {
    name: EventCategory.FESTIVALS,
    slug: "festivals",
    tagline: "Outdoor parties & food",
    image: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&w=600&q=80",
    color: "from-amber-500/80 to-rose-500/80"
  },
  {
    name: EventCategory.SPORTS,
    slug: "sports",
    tagline: "Games & matches",
    image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=600&q=80",
    color: "from-blue-600/80 to-teal-500/80"
  },
  {
    name: EventCategory.THEATRE,
    slug: "theater",
    tagline: "Shows & plays",
    image: "https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?auto=format&fit=crop&w=600&q=80",
    color: "from-rose-600/80 to-orange-500/80"
  },
  {
    name: EventCategory.COMMUNITY,
    slug: "tech-talks",
    tagline: "Meetups & workshops",
    image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=600&q=80",
    color: "from-cyan-600/80 to-indigo-650/80"
  }
];

export default function PopularCategories({ onSelectCategory }: PopularCategoriesProps) {
  return (
    <HeroHighlight
      containerClassName="w-full py-14 border-b border-border-gray bg-soft-bg"
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full"
    >
      <div className="w-full">
        
        {/* Section Title */}
        <div className="flex items-center justify-between mb-8 text-left">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-light-tint text-[10px] font-bold uppercase rounded-full text-brand-blue tracking-wider mb-2 border border-brand-blue/10">
              <Sparkles className="h-3 w-3 text-brand-blue animate-pulse" />
              <span>What's on</span>
            </div>
            <h2 className="text-2xl sm:text-3.5xl font-black text-dark-text tracking-tight leading-tight">
              Pick a type of <Highlight className="text-dark-text font-black">event</Highlight>
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 mt-1 font-semibold">
              Tap any card to see what's happening near you.
            </p>
          </div>
        </div>

        {/* Categories Horizontal / Grid View */}
        <div id="quick-categories" className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {CATEGORY_CARDS.map((card) => (
            <button
              key={card.name}
              id={`popular-cat-card-${card.slug}`}
              onClick={() => onSelectCategory(card.name)}
              className="group relative h-48 rounded-[24px] overflow-hidden border border-border-gray hover:border-brand-blue/30 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg text-left cursor-pointer"
            >
              {/* Background cover image */}
              <img
                src={card.image}
                alt={card.name}
                referrerPolicy="no-referrer"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {/* Visual overlay gradient */}
              <div className={`absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent transition-opacity`} />

              {/* Text content absolute positioned */}
              <div className="absolute inset-x-0 bottom-0 p-4.5 flex flex-col justify-end text-white z-10">
                <span className="text-[10px] sm:text-xs font-bold text-neutral-200/90 tracking-wide mb-0.5 leading-none">
                  {card.tagline}
                </span>
                <h3 className="text-sm sm:text-base font-black tracking-tight leading-tight uppercase flex items-center justify-between">
                  <span>{card.name}</span>
                  <ArrowRight className="h-4 w-4 transform -translate-x-1 group-hover:translate-x-0.5 opacity-0 group-hover:opacity-100 transition-all duration-300 text-brand-blue" />
                </h3>
              </div>
            </button>
          ))}
        </div>

      </div>
    </HeroHighlight>
  );
}
