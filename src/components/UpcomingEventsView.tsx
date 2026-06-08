"use client";

import { useState, useMemo } from "react";
import { Search, MapPin, Calendar as CalendarIcon, Ticket as TicketIcon, SlidersHorizontal, Sparkles, Filter, ChevronRight, Check } from "lucide-react";
import { Event, EventCategory } from "../types";

interface UpcomingEventsViewProps {
  events: Event[];
  onSelectEvent: (eventId: string) => void;
  onQuickBook: (eventId: string) => void;
}

export default function UpcomingEventsView({
  events,
  onSelectEvent,
  onQuickBook,
}: UpcomingEventsViewProps) {
  // Filters state
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedCity, setSelectedCity] = useState<string>("All");
  const [onlyFeatured, setOnlyFeatured] = useState<boolean>(false);

  // Dynamic lists for filters
  const citiesList = useMemo(() => {
    const list = new Set<string>();
    events.forEach(e => {
      if (e.city) list.add(e.city);
    });
    return ["All", ...Array.from(list)];
  }, [events]);

  // Categories list
  const categoriesList = ["All", ...Object.values(EventCategory)];

  // Logically filter and sort upcoming events (sorted by date so they are chronological)
  const filteredEvents = useMemo(() => {
    let result = [...events];

    // Filter by search query
    if (searchTerm.trim() !== "") {
      const q = searchTerm.toLowerCase();
      result = result.filter(e => 
        e.title.toLowerCase().includes(q) || 
        e.description.toLowerCase().includes(q) || 
        e.location.toLowerCase().includes(q) ||
        e.city.toLowerCase().includes(q)
      );
    }

    // Filter by Category
    if (selectedCategory !== "All") {
      result = result.filter(e => e.category === selectedCategory);
    }

    // Filter by City
    if (selectedCity !== "All") {
      result = result.filter(e => e.city === selectedCity);
    }

    // Filter by Featured Badge
    if (onlyFeatured) {
      result = result.filter(e => e.featured);
    }

    // Secondary sorting: place Featured ones or chronological order
    // Since some dates are "July 12, 2026", we can parse or keep chronological
    return result;
  }, [events, searchTerm, selectedCategory, selectedCity, onlyFeatured]);

  // Helper to extract a day and month from typical date formats
  const formatDateBadge = (dateStr: string) => {
    // e.g. "July 12, 2026" or "June 4, 2026"
    const parts = dateStr.split(" ");
    const month = parts[0] ? parts[0].substring(0, 3).toUpperCase() : "JUN";
    const day = parts[1] ? parts[1].replace(",", "") : "04";
    return { month, day };
  };

  return (
    <div id="upcoming-events-root" className="bg-neutral-50 min-h-screen py-10 px-4 sm:px-6 lg:px-8 select-none">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Step 1: Premium Display Header */}
        <div id="upcoming-master-header" className="relative bg-white border border-neutral-200/80 rounded-3xl p-6 sm:p-10 shadow-sm overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="absolute top-0 right-0 w-80 h-80 bg-brand-blue/5 rounded-full blur-[100px] pointer-events-none" />
          
          <div className="space-y-3 z-10 max-w-xl text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-blue/5 border border-brand-blue/10 text-brand-blue text-[10px] font-black uppercase tracking-widest">
              <Sparkles className="h-3 w-3 animate-pulse" />
              <span>Chronological Lineup</span>
            </div>
            <h1 className="text-3xl sm:text-4.5xl font-black text-neutral-900 tracking-tight leading-none font-sans">
              Upcoming <span className="text-brand-blue">Passes</span>
            </h1>
            <p className="text-xs sm:text-sm text-neutral-550 font-semibold leading-relaxed">
              Explore your passport to curated international series, live stadium tours, local theatre performances, and verified electronic music scenes. Guaranteed door entry.
            </p>
          </div>

          <div className="flex items-center gap-5 z-10 font-sans border-t sm:border-t-0 pt-4 sm:pt-0 border-neutral-100">
            <div className="text-left">
              <span className="text-[10px] text-neutral-450 font-black uppercase tracking-wider block">Live Registries</span>
              <span className="text-3xl font-black text-neutral-900 block mt-0.5">{events.length}</span>
            </div>
            <div className="h-10 w-[1px] bg-neutral-200" />
            <div className="text-left">
              <span className="text-[10px] text-neutral-450 font-black uppercase tracking-wider block">Featured Tier</span>
              <span className="text-3xl font-black text-brand-blue block mt-0.5">{events.filter(e => e.featured).length}</span>
            </div>
          </div>
        </div>

        {/* Step 2: Adaptive Search & Filter Controls */}
        <div id="upcoming-filter-controls" className="bg-white border border-neutral-200/90 rounded-2xl p-4 shadow-sm space-y-4 font-sans select-none z-35 relative">
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
            
            {/* Search Input */}
            <div className="md:col-span-5 relative flex items-center bg-neutral-50 border border-neutral-200 focus-within:border-brand-blue/40 rounded-xl px-4 py-2.5 transition-colors">
              <Search className="h-4 w-4 text-neutral-400 mr-2 flex-shrink-0" />
              <input
                id="upcoming-search-input"
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search upcoming names, cities, artists, or landmarks..."
                className="w-full text-xs font-bold text-neutral-800 bg-transparent placeholder-neutral-450 focus:outline-none"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="p-1 rounded-full hover:bg-neutral-200 text-neutral-400 ml-1"
                >
                  <span className="text-xs">×</span>
                </button>
              )}
            </div>

            {/* City Selection Dropdown list */}
            <div className="md:col-span-3 flex items-center bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2">
              <MapPin className="h-4 w-4 text-brand-blue mr-2 flex-shrink-0" />
              <div className="w-full text-left">
                <span className="text-[8px] text-neutral-400 font-extrabold uppercase tracking-wider block leading-none">City Bounds</span>
                <select
                  id="upcoming-city-select"
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  title="City Bounds"
                  aria-label="City Bounds"
                  className="w-full bg-transparent text-xs font-extrabold text-neutral-800 focus:outline-none cursor-pointer mt-0.5"
                >
                  {citiesList.map(city => (
                    <option key={city} value={city}>{city === "All" ? "All Locations" : city}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Filter by Category list tabs */}
            <div className="md:col-span-4 flex items-center gap-2">
              <button
                id="toggle-featured-filter"
                onClick={() => setOnlyFeatured(!onlyFeatured)}
                className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-xs font-extrabold uppercase tracking-wide border cursor-pointer transition-all ${
                  onlyFeatured
                    ? "bg-brand-blue/5 border-brand-blue text-brand-blue"
                    : "bg-neutral-50 border-neutral-200 hover:bg-neutral-100 text-neutral-600"
                }`}
              >
                <Sparkles className="h-4 w-4 text-brand-blue" />
                <span>Featured Passes Only</span>
              </button>
            </div>

          </div>

          {/* Quick Categories Bar selection */}
          <div className="border-t border-neutral-100 pt-3 flex flex-wrap items-center gap-1.5 justify-start">
            <span className="text-[10px] text-neutral-450 font-black uppercase tracking-wider mr-2">Quick Category:</span>
            {categoriesList.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider cursor-pointer border transition-all ${
                  selectedCategory === cat
                    ? "bg-dark-text border-dark-text text-white font-extrabold"
                    : "border-neutral-200/70 hover:border-neutral-300 text-neutral-600 bg-[#fbfbfb]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

        </div>

        {/* Step 3: Immersive Grid Layout of Upcoming Event Cards */}
        <div id="upcoming-cards-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.length === 0 ? (
            <div className="col-span-full bg-white border border-neutral-200 rounded-[32px] py-20 px-4 text-center space-y-4">
              <div className="inline-flex h-16 w-16 bg-neutral-100 rounded-3xl items-center justify-center text-neutral-450">
                <Filter className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-black text-neutral-900 font-sans">No matching upcoming lineups found</h3>
              <p className="text-xs text-neutral-500 font-medium max-w-sm mx-auto leading-relaxed">
                We couldn't locate any matching credentials. Try removing the featured filter or resetting search terms.
              </p>
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("All");
                  setSelectedCity("All");
                  setOnlyFeatured(false);
                }}
                className="bg-brand-blue hover:bg-brand-blue-hover text-white text-xs font-bold px-6 py-3 rounded-full shadow-sm cursor-pointer"
              >
                Restore Full Lineup
              </button>
            </div>
          ) : (
            filteredEvents.map((event) => {
              const { month, day } = formatDateBadge(event.date);
              const percentBooked = Math.round((event.soldTickets / event.totalTickets) * 100);
              const placesLeft = event.totalTickets - event.soldTickets;

              return (
                <div
                  key={event.id}
                  className="bg-white border border-neutral-200/90 rounded-[30px] overflow-hidden flex flex-col justify-between hover:shadow-lg hover:border-brand-blue/15 transition-all duration-300 group shadow-sm text-left relative"
                >
                  
                  {/* Visual card header */}
                  <div className="relative h-56 w-full bg-neutral-100 overflow-hidden">
                    <img
                      src={event.image}
                      alt={event.title}
                      referrerPolicy="no-referrer"
                      loading="lazy"
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                    
                    {/* Absolute floaters */}
                    <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md border border-neutral-100 rounded-2xl p-2 px-3 text-center shadow-md flex flex-col items-center justify-center min-w-[50px]">
                      <span className="text-[9px] text-brand-blue font-black tracking-widest">{month}</span>
                      <span className="text-2xl font-black text-dark-text leading-none mt-0.5">{day}</span>
                    </div>

                    {event.featured && (
                      <div className="absolute top-4 right-4 bg-brand-blue text-white font-extrabold text-[9px] uppercase px-3 py-1.5 rounded-full tracking-widest flex items-center gap-1.5 shadow-md">
                        <Sparkles className="h-3.5 w-3.5 text-white animate-pulse" />
                        <span>Premium Pass</span>
                      </div>
                    )}

                    <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between z-10 text-white font-bold text-xs uppercase tracking-wider">
                      <span className="bg-neutral-900/40 backdrop-blur-[2px] px-2.5 py-1 rounded-full border border-white/10 text-[9px]">
                        {event.category}
                      </span>
                      <span className="text-white drop-shadow-[0_1px_4px_rgba(0,0,0,0.6)]">
                        {event.city}
                      </span>
                    </div>
                  </div>

                  {/* Body textual block */}
                  <div className="p-5 flex-grow flex flex-col justify-between space-y-6">
                    <div className="space-y-2.5">
                      <h4 
                        onClick={() => onSelectEvent(event.id)}
                        className="text-lg font-black text-neutral-900 font-sans tracking-tight leading-tight hover:text-brand-blue transition-colors cursor-pointer"
                      >
                        {event.title}
                      </h4>
                      <p className="text-xs text-neutral-500 font-semibold leading-relaxed line-clamp-2">
                        {event.description}
                      </p>
                    </div>

                    {/* Elite Highlights row */}
                    {event.highlights && event.highlights.length > 0 && (
                      <div className="bg-neutral-50 border border-neutral-100 rounded-2xl p-3 space-y-1.5">
                        <span className="text-[8px] font-black uppercase text-neutral-450 tracking-wider block">Exclusive Perks Included:</span>
                        <div className="space-y-1">
                          {event.highlights.slice(0, 2).map((h, i) => (
                            <div key={i} className="flex items-center gap-1.5 text-[10px] font-bold text-neutral-600">
                              <Check className="h-3.5 w-3.5 text-emerald-500 flex-shrink-0" />
                              <span className="truncate">{h}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Ticket Availability Progress Bar */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-[10px] font-bold text-neutral-450 uppercase tracking-wide">
                        <span>Admission Matrix</span>
                        {placesLeft <= 15 ? (
                          <span className="text-red-500 font-extrabold animate-pulse">Only {placesLeft} passes left!</span>
                        ) : (
                          <span>{percentBooked}% Allocation filled</span>
                        )}
                      </div>
                      <div className="h-1.5 w-full bg-neutral-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-300 ${
                            placesLeft <= 15 ? "bg-gradient-to-r from-red-500 to-orange-400" : "bg-gradient-to-r from-brand-blue to-indigo-500"
                          }`}
                          style={{ width: `${percentBooked}%` }}
                        />
                      </div>
                    </div>

                  </div>

                  {/* Pricing and actions button row */}
                  <div className="p-5 pt-0 border-t border-neutral-100 flex items-center justify-between mt-auto">
                    <div>
                      <span className="text-[9px] text-neutral-400 font-bold uppercase tracking-widest block leading-none">Starting from</span>
                      <span className="text-xl font-black text-neutral-900 block mt-1">${event.price}</span>
                    </div>

                    <button
                      onClick={() => onQuickBook(event.id)}
                      className="bg-brand-blue hover:bg-brand-blue-hover text-white font-extrabold text-xs uppercase tracking-wider py-2.5 px-4 rounded-xl shadow-md cursor-pointer transition-transform transform active:scale-97 flex items-center gap-1.5"
                    >
                      <TicketIcon className="h-3.5 w-3.5" />
                      <span>Instant Booking</span>
                    </button>
                  </div>

                </div>
              );
            })
          )}
        </div>

      </div>
    </div>
  );
}
