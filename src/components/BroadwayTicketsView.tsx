"use client";

import { useState, useMemo } from "react";
import { Search, Ticket as TicketIcon, DollarSign, Calendar as CalendarIcon, SlidersHorizontal, ArrowRight, Check, X, ShieldCheck, HelpCircle, Eye } from "lucide-react";
import { Event } from "../types";

interface BroadwayTicketsViewProps {
  events: Event[];
  onBookTickets: (eventId: string, qty: number, seatType: string) => void;
  setView: (view: string, eventId?: string) => void;
}

export default function BroadwayTicketsView({
  events,
  onBookTickets,
  setView,
}: BroadwayTicketsViewProps) {
  // Filters State
  const [searchQuery, setSearchQuery] = useState("");
  const [ticketQty, setTicketQty] = useState(2);
  const [selectedPriceTier, setSelectedPriceTier] = useState("Any Price");
  const [selectedDateFilter, setSelectedDateFilter] = useState("All Dates");

  // Filter Dropdown Open State
  const [showQtyModal, setShowQtyModal] = useState(false);
  const [showPriceModal, setShowPriceModal] = useState(false);
  const [showDateModal, setShowDateModal] = useState(false);

  // Calendar dates range subtitle helper
  const dateSubtitleText = useMemo(() => {
    if (selectedDateFilter === "All Dates") {
      return "Mon, May 25, 2026 - Sun, August 30, 2026";
    }
    if (selectedDateFilter === "June") {
      return "Mon, June 01, 2026 - Tue, June 30, 2026";
    }
    if (selectedDateFilter === "July") {
      return "Wed, July 01, 2026 - Fri, July 31, 2026";
    }
    return "Sat, August 01, 2026 - Mon, August 31, 2026";
  }, [selectedDateFilter]);

  // Pricing helper
  const getEventPriceLimits = (basePrice: number) => {
    return {
      min: basePrice,
      max: Math.round(basePrice * 4.2),
    };
  };

  // Filter events logically
  const filteredEvents = useMemo(() => {
    return events.filter((e) => {
      // 1. Search text filter
      const matchesSearch = e.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            e.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            e.location.toLowerCase().includes(searchQuery.toLowerCase());
      
      // 2. Price filter
      let matchesPrice = true;
      if (selectedPriceTier === "Under $50") {
        matchesPrice = e.price < 50;
      } else if (selectedPriceTier === "$50 - $100") {
        matchesPrice = e.price >= 50 && e.price <= 100;
      } else if (selectedPriceTier === "$100+") {
        matchesPrice = e.price > 100;
      }

      // 3. Date Month filter mock
      let matchesDate = true;
      if (selectedDateFilter === "June") {
        matchesDate = e.date.includes("June");
      } else if (selectedDateFilter === "July") {
        matchesDate = e.date.includes("July");
      } else if (selectedDateFilter === "August") {
        matchesDate = e.date.includes("August");
      }

      return matchesSearch && matchesPrice && matchesDate;
    });
  }, [events, searchQuery, selectedPriceTier, selectedDateFilter]);

  // Generate showtime helper schedules for a given event date string
  // For Broadway look, we want rows of 3 consecutive weekdays with time slots
  const getEventScheduleDays = (eventDate: string, eventTime: string) => {
    // Basic extraction
    const dateParts = eventDate.split(" "); // e.g. ["July", "12,", "2026"]
    const month = dateParts[0] || "July";
    const dayNumeric = parseInt(dateParts[1]?.replace(",", "") || "12");
    const year = dateParts[2] || "2026";

    // Format a generic time
    let mainTime = "7:00pm";
    if (eventTime.toLowerCase().includes("pm")) {
      const parsedPmMatch = eventTime.match(/(\d+:\d+\s*PM)/i);
      if (parsedPmMatch) {
        mainTime = parsedPmMatch[1].toLowerCase().replace(/\s+/g, "");
      } else if (eventTime.toLowerCase().includes("10:30")) {
        mainTime = "8:00pm";
      } else {
        mainTime = "7:00pm";
      }
    } else {
      mainTime = "2:00pm";
    }

    const dayOffsets = [-1, 0, 1];
    const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    
    // Create mock days based around the parsed target day
    return dayOffsets.map((offset) => {
      const currentDayNum = dayNumeric + offset;
      const dummyDate = new Date(`${month} ${currentDayNum}, ${year}`);
      const weekdayStr = weekdays[dummyDate.getDay() || 0];

      // If offset is -1, let's say "No scheduled performances" to match Harry Potter screen
      const hasShow = offset >= 0;

      return {
        dayLabel: weekdayStr,
        dateLabel: `${month.substring(0, 3)} ${currentDayNum}`,
        hasShow,
        showtimes: offset === 0 ? [mainTime] : ["1:00pm", "7:00pm"],
      };
    });
  };

  return (
    <div className="bg-neutral-50 min-h-screen py-10 px-4 sm:px-6 lg:px-8 select-none">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Step 1: Headout/Broadway Title Module */}
        <div id="broadway-title-module" className="text-left border-b border-neutral-200 pb-5">
          <h1 className="text-3xl sm:text-4.5xl font-black text-dark-text tracking-tight font-sans">
            Broadway Tickets
          </h1>
          <p className="text-sm font-semibold text-neutral-500 mt-1 tabular-nums">
            {dateSubtitleText}
          </p>
        </div>

        {/* Step 2: Immersive Filter grid aligning to Broadway screenshot */}
        <div id="broadway-filters-bar" className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-[#f8fafc] p-2.5 rounded-2xl border border-neutral-200/90 shadow-sm z-30 relative select-none">
          
          {/* Filter 1: All Shows input */}
          <div className="relative flex items-center bg-white border border-neutral-200 hover:border-brand-blue/35 rounded-xl px-4 py-3 shadow-inner transition-colors">
            <Search className="h-4.5 w-4.5 text-neutral-400 mr-2.5 shrink-0" />
            <input
              id="broadway-search-shows"
              type="text"
              placeholder="All Shows / Experiences"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs font-semibold text-dark-text bg-transparent placeholder-neutral-400 focus:outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                title="Clear search query"
                aria-label="Clear search query"
                className="p-1 rounded-full hover:bg-neutral-100 text-neutral-400 hover:text-neutral-600 transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>

          {/* Filter 2: Ticket Quantity Selection */}
          <div className="relative">
            <button
              id="broadway-filter-qty"
              onClick={() => {
                setShowQtyModal(!showQtyModal);
                setShowPriceModal(false);
                setShowDateModal(false);
              }}
              className="w-full flex items-center justify-between bg-white border border-neutral-200 hover:border-brand-blue/35 rounded-xl px-4 py-3 text-left transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <TicketIcon className="h-4.5 w-4.5 text-brand-blue" />
                <span className="text-xs font-bold text-dark-text">
                  {ticketQty} Tickets
                </span>
              </div>
              <SlidersHorizontal className="h-3.5 w-3.5 text-neutral-450" />
            </button>

            {showQtyModal && (
              <div className="absolute left-0 right-0 mt-2 bg-white border border-neutral-200 p-3 rounded-2xl shadow-xl z-50 animate-fade">
                <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-2 px-1">
                  How many tickets?
                </div>
                <div className="grid grid-cols-4 gap-1.5">
                  {[1, 2, 3, 4, 6, 8].map((num) => (
                    <button
                      key={num}
                      onClick={() => {
                        setTicketQty(num);
                        setShowQtyModal(false);
                      }}
                      className={`py-2 rounded-lg text-xs font-bold transition-all cursor-pointer border ${
                        ticketQty === num
                          ? "bg-brand-blue border-brand-blue text-white"
                          : "border-neutral-200 hover:bg-neutral-50 text-neutral-650"
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Filter 3: Any Price selection */}
          <div className="relative">
            <button
              id="broadway-filter-price"
              onClick={() => {
                setShowPriceModal(!showPriceModal);
                setShowQtyModal(false);
                setShowDateModal(false);
              }}
              className="w-full flex items-center justify-between bg-white border border-neutral-200 hover:border-brand-blue/35 rounded-xl px-4 py-3 text-left transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <DollarSign className="h-4.5 w-4.5 text-brand-blue" />
                <span className="text-xs font-bold text-dark-text">
                  {selectedPriceTier}
                </span>
              </div>
              <SlidersHorizontal className="h-3.5 w-3.5 text-neutral-450" />
            </button>

            {showPriceModal && (
              <div className="absolute left-0 right-0 mt-2 bg-white border border-neutral-200 p-2.5 rounded-2xl shadow-xl z-50 animate-fade space-y-1">
                {["Any Price", "Under $50", "$50 - $100", "$100+"].map((tier) => (
                  <button
                    key={tier}
                    onClick={() => {
                      setSelectedPriceTier(tier);
                      setShowPriceModal(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg text-xs font-bold font-sans flex items-center justify-between hover:bg-neutral-50 text-neutral-700 cursor-pointer"
                  >
                    <span>{tier}</span>
                    {selectedPriceTier === tier && <Check className="h-4 w-4 text-brand-blue" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Filter 4: Month Range Selection */}
          <div className="relative">
            <button
              id="broadway-filter-dates"
              onClick={() => {
                setShowDateModal(!showDateModal);
                setShowQtyModal(false);
                setShowPriceModal(false);
              }}
              className="w-full flex items-center justify-between bg-white border border-neutral-200 hover:border-brand-blue/35 rounded-xl px-4 py-3 text-left transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <CalendarIcon className="h-4.5 w-4.5 text-brand-blue" />
                <span className="text-xs font-bold text-dark-text">
                  {selectedDateFilter}
                </span>
              </div>
              <CalendarIcon className="h-3.5 w-3.5 text-neutral-450" />
            </button>

            {showDateModal && (
              <div className="absolute left-0 right-0 mt-2 bg-white border border-neutral-200 p-2.5 rounded-2xl shadow-xl z-50 animate-fade space-y-1">
                {["All Dates", "June", "July", "August"].map((opt) => (
                  <button
                    key={opt}
                    onClick={() => {
                      setSelectedDateFilter(opt);
                      setShowDateModal(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg text-xs font-bold flex items-center justify-between hover:bg-neutral-50 text-neutral-700 cursor-pointer"
                  >
                    <span>{opt} in 2026</span>
                    {selectedDateFilter === opt && <Check className="h-4 w-4 text-brand-blue" />}
                  </button>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Step 3: Broadway styled card list */}
        <div id="broadway-tickets-card-container" className="space-y-6">
          {filteredEvents.length === 0 ? (
            <div className="bg-white border border-neutral-200 rounded-[32px] py-16 px-6 text-center space-y-4 shadow-sm">
              <div className="inline-flex h-14 w-14 bg-neutral-100 items-center justify-center rounded-2xl text-neutral-400">
                <Search className="h-7 w-7" />
              </div>
              <h3 className="text-lg font-black text-dark-text font-sans">No scheduled performances met your constraints</h3>
              <p className="text-xs text-neutral-550 max-w-sm mx-auto font-medium leading-relaxed">
                Try writing another keyword in "All Shows", selecting a different calendar date range, or removing the pricing tier filter.
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setTicketQty(2);
                  setSelectedPriceTier("Any Price");
                  setSelectedDateFilter("All Dates");
                }}
                className="mt-2 bg-brand-blue hover:bg-brand-blue-hover text-white text-xs font-bold px-6 py-2.5 rounded-full cursor-pointer shadow-sm"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            filteredEvents.map((event) => {
              const bounds = getEventPriceLimits(event.price);
              const schedule = getEventScheduleDays(event.date, event.time);

              return (
                <div
                  key={event.id}
                  id={`broadway-show-card-${event.id}`}
                  className="bg-white border border-neutral-200/90 hover:border-brand-blue/20 rounded-3xl shadow-sm hover:shadow-md transition-all duration-300 grid grid-cols-1 md:grid-cols-12 overflow-hidden"
                >
                  
                  {/* Left poster column */}
                  <div className="md:col-span-2 relative h-48 md:h-full min-h-[160px] bg-neutral-200">
                    <img
                      src={event.image}
                      alt={event.title}
                      referrerPolicy="no-referrer"
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute top-2 left-2 bg-neutral-900/80 backdrop-blur-sm text-white font-bold text-[9px] uppercase px-2.5 py-1 rounded-full border border-white/10">
                      {event.category}
                    </div>
                  </div>

                  {/* Right broadway schedule layout column */}
                  <div className="md:col-span-10 p-5 sm:p-6 lg:p-7 flex flex-col justify-between space-y-6">
                    
                    {/* Header info */}
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 border-b border-neutral-100 pb-4">
                      <div>
                        <h2 className="text-xl sm:text-2xl font-black text-dark-text tracking-tight font-sans">
                          {event.title} <span className="text-neutral-450 font-normal">Tickets</span>
                        </h2>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-neutral-400 font-bold uppercase tracking-wide">
                            {event.location} • {event.city}
                          </span>
                        </div>
                      </div>

                      <div className="text-left sm:text-right shrink-0">
                        <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest block leading-none">
                          Inlet Tier Scale
                        </span>
                        <span className="text-sm font-black text-brand-blue mt-1 block font-sans">
                          from ${bounds.min}.00 - ${bounds.max}.00
                        </span>
                      </div>
                    </div>

                    {/* Schedule Slots (Aligning 100% with Harry Potter model) */}
                    <div className="space-y-3.5">
                      {schedule.map((slot, index) => (
                        <div 
                          key={index}
                          className="grid grid-cols-1 sm:grid-cols-12 text-left items-center border-b border-dashed border-neutral-100 last:border-0 pb-3 last:pb-0"
                        >
                          {/* Day column */}
                          <div className="sm:col-span-3 flex items-center sm:items-start gap-2 text-xs text-neutral-450 font-bold select-none py-1">
                            <span className="uppercase text-neutral-800 font-extrabold w-8 text-left">{slot.dayLabel}</span>
                            <span className="text-[11px] bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded-full font-bold uppercase">
                              {slot.dateLabel}
                            </span>
                          </div>

                          {/* Hours slots buttons column */}
                          <div className="sm:col-span-9 pt-1.5 sm:pt-0">
                            {!slot.hasShow ? (
                              <span className="text-[11px] font-bold text-neutral-450 uppercase tracking-wide italic block py-2 select-none">
                                No scheduled performances.
                              </span>
                            ) : (
                              <div className="flex flex-wrap items-center gap-2">
                                {slot.showtimes.map((timeText) => (
                                  <button
                                    key={timeText}
                                    onClick={() => setView("detail", event.id)}
                                    className="bg-brand-blue hover:bg-brand-blue-hover text-white text-xs font-black uppercase tracking-wider px-5 py-2.5 rounded-xl shadow-md shadow-brand-blue/15 cursor-pointer transform active:scale-97 transition-all leading-none border border-transparent block"
                                  >
                                    {timeText}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Footer View Calendar clicker anchor */}
                    <div className="pt-2 flex items-center justify-between border-t border-neutral-100 text-[10px] uppercase font-bold tracking-widest text-neutral-450">
                      <button
                        onClick={() => alert(`Showing digital ticket allocation matrix with ${ticketQty} passes reserved at doors!`)}
                        className="hover:text-dark-text transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        <ShieldCheck className="h-4 w-4 text-emerald-500" />
                        <span>Instant Contactless Guarantee</span>
                      </button>

                      <button
                        onClick={() => alert(`Interactive calendar showing regular ${event.title} bookings. All entries fully refundable up to 24 hours.`)}
                        className="text-brand-blue hover:underline flex items-center gap-1 text-[11px] font-black cursor-pointer uppercase"
                      >
                        <span>View Calendar</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    </div>

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
