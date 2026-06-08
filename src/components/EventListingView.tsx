"use client";

import { useState, useMemo } from "react";
import { Search, MapPin, Calendar, Clock, SlidersHorizontal, ArrowUpDown, RefreshCw } from "lucide-react";
import { Event, EventCategory } from "../types";

interface EventListingViewProps {
  events: Event[];
  initialCategory: string;
  initialQuery: string;
  initialLocation: string;
  onSelectEvent: (eventId: string) => void;
  onQuickBook: (eventId: string) => void;
}

export default function EventListingView({
  events,
  initialCategory,
  initialQuery,
  initialLocation,
  onSelectEvent,
  onQuickBook,
}: EventListingViewProps) {
  // Filters State
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedCity, setSelectedCity] = useState(initialLocation);
  const [maxPrice, setMaxPrice] = useState<number>(150);
  const [sortBy, setSortBy] = useState<"date" | "price-asc" | "price-desc">("date");
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Extract unique cities
  const cities = useMemo(() => {
    const list = events.map((e) => e.city);
    return Array.from(new Set(list));
  }, [events]);

  // Filter logic
  const filteredEvents = useMemo(() => {
    let result = [...events];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.description.toLowerCase().includes(q) ||
          e.location.toLowerCase().includes(q)
      );
    }

    if (selectedCategory) {
      result = result.filter((e) => e.category === selectedCategory);
    }

    if (selectedCity) {
      result = result.filter((e) => e.city.toLowerCase() === selectedCity.toLowerCase());
    }

    result = result.filter((e) => e.price <= maxPrice);

    // Sorting
    if (sortBy === "date") {
      result.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    } else if (sortBy === "price-asc") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-desc") {
      result.sort((a, b) => b.price - a.price);
    }

    return result;
  }, [events, searchQuery, selectedCategory, selectedCity, maxPrice, sortBy]);

  const handleReset = () => {
    setSearchQuery("");
    setSelectedCategory("");
    setSelectedCity("");
    setMaxPrice(150);
    setSortBy("date");
  };

  return (
    <div id="listing-view-container" className="bg-soft-bg min-h-screen py-10 text-dark-text">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title & Introduction */}
        <div className="mb-10 text-left">
          <h1 className="text-3xl font-black text-[#0F172A] tracking-tight sm:text-4xl">
            Browse All Live Events
          </h1>
          <p className="mt-1.5 text-neutral-500 max-w-xl text-xs sm:text-sm font-semibold leading-relaxed">
            Discover independent festivals, athletic tournaments, intimate live music, and technology summits. Instant barcode tickets with no physical delay.
          </p>
        </div>

        {/* Filters and List layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Desktop Filters Pane (Left side, sticky) */}
          <div className="hidden lg:block lg:col-span-1 bg-white border border-border-gray p-6 rounded-[32px] h-fit sticky top-24 shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-border-gray mb-6">
              <span className="font-extrabold text-[11px] tracking-wider text-dark-text uppercase flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4 text-brand-blue" />
                <span>Filters</span>
              </span>
              <button
                id="listing-desktop-reset-btn"
                onClick={handleReset}
                className="text-xs text-brand-blue hover:text-brand-blue-hover font-bold uppercase tracking-wider flex items-center gap-1 transition-colors cursor-pointer"
              >
                <RefreshCw className="h-3 w-3" />
                <span>Reset</span>
              </button>
            </div>

            {/* Keyword search filter */}
            <div className="mb-5">
              <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">Search Events</label>
              <div className="relative">
                <input
                  id="filter-search-input"
                  type="text"
                  placeholder="Type event name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-soft-bg border border-border-gray hover:border-brand-blue/20 focus:border-brand-blue rounded-xl px-4 py-2.5 text-sm focus:outline-none pl-9 font-semibold text-dark-text"
                />
                <Search className="absolute left-3 top-3.5 h-4 w-4 text-neutral-400" />
              </div>
            </div>

            {/* Category selection */}
            <div className="mb-5">
              <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">Category</label>
              <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                <button
                  onClick={() => setSelectedCategory("")}
                  className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-bold flex items-center justify-between transition-colors cursor-pointer ${
                    !selectedCategory ? "bg-light-tint text-brand-blue border border-brand-blue/15" : "text-neutral-500 hover:text-dark-text border border-transparent"
                  }`}
                >
                  <span>All Categories</span>
                </button>
                {Object.values(EventCategory).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-bold flex items-center justify-between transition-colors cursor-pointer ${
                      selectedCategory === cat ? "bg-light-tint text-brand-blue border border-brand-blue/15" : "text-neutral-500 hover:text-dark-text border border-transparent"
                    }`}
                  >
                    <span>{cat}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* City Selection */}
            <div className="mb-5">
              <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">City</label>
              <select
                id="filter-city-select"
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                title="Select City"
                aria-label="Select City"
                className="w-full bg-soft-bg border border-border-gray rounded-xl px-3 py-2.5 text-xs text-dark-text focus:outline-none focus:border-brand-blue font-bold cursor-pointer"
              >
                <option value="">Any Location</option>
                {cities.map((city) => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>

            {/* Price slider */}
            <div className="mb-5">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider">Maximum Price</label>
                <span className="text-xs font-bold text-brand-blue">${maxPrice}</span>
              </div>
              <input
                id="filter-price-slider"
                type="range"
                min="30"
                max="150"
                step="5"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                title="Maximum Price"
                placeholder="Maximum Price"
                className="w-full h-1 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-brand-blue"
              />
              <div className="flex items-center justify-between text-[11px] text-neutral-400 mt-1 font-bold">
                <span>$30</span>
                <span>$150</span>
              </div>
            </div>

            {/* Sorting */}
            <div>
              <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                <ArrowUpDown className="h-3.5 w-3.5 text-brand-blue" />
                <span>Sort By</span>
              </label>
              <select
                id="filter-sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                title="Sort By"
                aria-label="Sort By"
                className="w-full bg-soft-bg border border-border-gray rounded-xl px-3 py-2.5 text-xs text-dark-text focus:outline-none focus:border-brand-blue font-bold cursor-pointer"
              >
                <option value="date">Soonest Date</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Right Area: Event Card layout grid */}
          <div className="lg:col-span-3">
            
            {/* Search metadata and mobile toggle bar */}
            <div className="flex items-center justify-between pb-4 border-b border-border-gray mb-6 gap-4">
              <p className="text-xs text-neutral-500 font-bold">
                Showing <span className="font-extrabold text-brand-blue text-sm">{filteredEvents.length}</span> experience{filteredEvents.length !== 1 && "s"} available
              </p>

              {/* Mobile filter toggle */}
              <button
                id="listing-mobile-filter-toggle"
                onClick={() => setShowMobileFilters(!showMobileFilters)}
                className="lg:hidden flex items-center gap-2 bg-white border border-border-gray text-neutral-600 font-bold text-xs px-4 py-2.5 rounded-xl hover:bg-neutral-50 transition-colors shadow-sm cursor-pointer"
              >
                <SlidersHorizontal className="h-3.5 w-3.5 text-brand-blue" />
                <span>Filters / Sort</span>
              </button>
            </div>

            {/* Mobile Expanded Filters Panel */}
            {showMobileFilters && (
              <div id="mobile-filters-panel" className="lg:hidden bg-white border border-border-gray p-5 rounded-2xl mb-6 space-y-4 shadow-sm">
                <div className="flex items-center justify-between pb-2 border-b border-border-gray mb-2">
                  <span className="font-bold text-xs uppercase text-brand-blue tracking-wider">Mobile Filters</span>
                  <button
                    id="listing-mobile-reset-btn"
                    onClick={handleReset}
                    className="text-[11px] text-neutral-400 hover:text-brand-blue flex items-center gap-1 font-extrabold cursor-pointer"
                  >
                    Reset All
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Search inputs */}
                  <div>
                    <label className="block text-[11px] font-extrabold text-neutral-500 uppercase tracking-wider mb-1.5">Search Keywords</label>
                    <input
                      id="mobile-filter-search-input"
                      type="text"
                      placeholder="Show or team..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-soft-bg border border-border-gray rounded-xl px-3 py-2 text-xs focus:outline-none text-dark-text font-semibold"
                    />
                  </div>

                  {/* Category options */}
                  <div>
                    <label className="block text-[11px] font-extrabold text-neutral-500 uppercase tracking-wider mb-1.5 font-mono">Category</label>
                    <select
                      id="mobile-filter-category-select"
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      title="Category"
                      aria-label="Category"
                      className="w-full bg-soft-bg border border-border-gray rounded-xl px-2.5 py-2 text-xs text-dark-text focus:outline-none font-bold cursor-pointer"
                    >
                      <option value="">All Categories</option>
                      {Object.values(EventCategory).map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  {/* City selector */}
                  <div>
                    <label className="block text-[11px] font-extrabold text-neutral-500 uppercase tracking-wider mb-1.5">City</label>
                    <select
                      id="mobile-filter-city-select"
                      value={selectedCity}
                      onChange={(e) => setSelectedCity(e.target.value)}
                      title="City"
                      aria-label="City"
                      className="w-full bg-soft-bg border border-border-gray rounded-xl px-2.5 py-2 text-xs text-dark-text focus:outline-none font-bold"
                    >
                      <option value="">Any Location</option>
                      {cities.map((ct) => (
                        <option key={ct} value={ct}>{ct}</option>
                      ))}
                    </select>
                  </div>

                  {/* Sort options */}
                  <div>
                    <label className="block text-[11px] font-extrabold text-neutral-500 uppercase tracking-wider mb-1.5">Arrange By</label>
                    <select
                      id="mobile-filter-sort-select"
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                      title="Arrange By"
                      aria-label="Arrange By"
                      className="w-full bg-soft-bg border border-border-gray rounded-xl px-2.5 py-2 text-xs text-dark-text focus:outline-none font-bold"
                    >
                      <option value="date">Soonest Date</option>
                      <option value="price-asc">Price: Low to High</option>
                      <option value="price-desc">Price: High to Low</option>
                    </select>
                  </div>

                  {/* Price sliders */}
                  <div className="sm:col-span-2">
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-[11px] font-extrabold text-neutral-500 uppercase tracking-wider">Max price limit</label>
                      <span className="text-xs font-bold text-brand-blue">${maxPrice}</span>
                    </div>
                    <input
                      id="mobile-filter-price-slider"
                      type="range"
                      min="30"
                      max="150"
                      step="5"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(Number(e.target.value))}
                      title="Max price limit"
                      placeholder="Max price limit"
                      className="w-full h-1 bg-neutral-200 rounded-lg appearance-none accent-brand-blue cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Events rendering grid */}
            {filteredEvents.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 animate-fade">
                {filteredEvents.map((event) => {
                  const percent = Math.round((event.soldTickets / event.totalTickets) * 100);
                  const soldOut = percent >= 100;

                  return (
                    <div
                      key={event.id}
                      id={`event-card-${event.id}`}
                      className="bg-white border border-border-gray rounded-[32px] overflow-hidden flex flex-col hover:border-brand-blue/35 transition-all duration-300 hover:shadow-xl hover:shadow-brand-blue/5 group"
                    >
                      {/* Event Banner */}
                      <div className="relative h-44 overflow-hidden">
                        <img
                          src={event.image}
                          alt={event.title}
                          referrerPolicy="no-referrer"
                          loading="lazy"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                        <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-[10px] font-black uppercase bg-white/95 text-brand-blue border border-border-gray backdrop-blur-md shadow-sm">
                          {event.category}
                        </span>
                        <div className="absolute bottom-3 right-3 bg-white/95 text-[10px] font-bold text-neutral-500 border border-border-gray px-2.5 py-1.5 rounded-full backdrop-blur-md flex items-center gap-1 shadow-sm">
                          Pricing from <span className="text-sm font-black text-brand-blue">${event.price}</span>
                        </div>
                      </div>

                      {/* Summary contents */}
                      <div className="p-5.5 flex-1 flex flex-col">
                        <div className="flex items-center gap-1.5 text-[11px] text-neutral-450 font-bold mb-2.5">
                          <Calendar className="h-3.5 w-3.5 text-brand-blue flex-shrink-0" />
                          <span>{event.date}</span>
                          <span className="text-neutral-300 font-extrabold">•</span>
                          <Clock className="h-3.5 w-3.5 text-brand-blue flex-shrink-0" />
                          <span className="truncate">{event.time}</span>
                        </div>

                        <h3 className="font-extrabold text-[#0F172A] text-base group-hover:text-brand-blue transition-colors mb-1.5 leading-tight line-clamp-1">
                          {event.title}
                        </h3>

                        <div className="flex items-start gap-1 pb-4 text-xs text-neutral-450 line-clamp-1 border-b border-border-gray mb-4">
                          <MapPin className="h-3.5 w-3.5 text-brand-blue mt-0.5 flex-shrink-0" />
                          <span className="font-semibold">{event.location}, {event.city}</span>
                        </div>

                        {/* Interactive footer actions */}
                        <div className="mt-auto flex gap-3 pt-2">
                          <button
                            id={`details-btn-${event.id}`}
                            onClick={() => onSelectEvent(event.id)}
                            className="flex-1 border border-border-gray hover:bg-neutral-50 text-neutral-600 font-bold text-xs py-3 rounded-full transition-all cursor-pointer"
                          >
                            Details
                          </button>
                          <button
                            id={`book-btn-${event.id}`}
                            disabled={soldOut}
                            onClick={() => onQuickBook(event.id)}
                            className={`flex-1 font-black uppercase text-[10px] py-3 rounded-full transition-all flex items-center justify-center gap-1 ${
                              soldOut
                                ? "bg-neutral-200 text-neutral-400 cursor-not-allowed"
                                : "bg-brand-blue hover:bg-brand-blue-hover text-white shadow-md shadow-brand-blue/15 cursor-pointer active:scale-98"
                            }`}
                          >
                            Passes
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* Dry Reset Empty Screen */
              <div id="no-events-found" className="flex flex-col items-center justify-center p-12 bg-white border border-border-gray rounded-[32px] text-center shadow-sm animate-fade">
                <div className="mb-4 text-brand-blue">
                  <SlidersHorizontal className="h-10 w-10 mx-auto opacity-70 mb-2 animate-bounce" />
                </div>
                <h3 className="text-lg font-black text-dark-text mb-1">No Matching Experiences</h3>
                <p className="text-neutral-400 text-xs max-w-sm mx-auto mb-6 leading-relaxed font-semibold">
                  We couldn&apos;t identify any event matching your selected criteria. Try raising the price threshold or clearing active category capsules.
                </p>
                <button
                  id="empty-reset-btn"
                  onClick={handleReset}
                  className="bg-brand-blue hover:bg-brand-blue-hover text-white font-black text-xs px-8 py-3.5 rounded-full shadow-md shadow-brand-blue/15 cursor-pointer"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
