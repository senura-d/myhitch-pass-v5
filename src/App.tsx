import { useState, useMemo, useEffect, lazy, Suspense } from "react";
import API from "./lib/api";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import PopularCategories from "./components/PopularCategories";
import FeaturedEvents from "./components/FeaturedEvents";
import Benefits from "./components/Benefits";
import HowItWorks from "./components/HowItWorks";
import Footer from "./components/Footer";
import EventListingView from "./components/EventListingView";
import EventDetailView from "./components/EventDetailView";
import MyTicketsView from "./components/MyTicketsView";
import CheckoutModal from "./components/CheckoutModal";
import LoginView from "./components/LoginView";
import ProfileView from "./components/ProfileView";
import BroadwayTicketsView from "./components/BroadwayTicketsView";
import UpcomingEventsView from "./components/UpcomingEventsView";
import OrganiserSOPView from "./components/OrganiserSOPView";
import PrivacyCharterView from "./components/PrivacyCharterView";
import TicketingPolicyView from "./components/TicketingPolicyView";
import HelpDeskView from "./components/HelpDeskView";
import AboutUsView from "./components/AboutUsView";
import PricingView from "./components/PricingView";
import ServicersView from "./components/ServicersView";
import ContactUsView from "./components/ContactUsView";

// Code-split the heavy organiser dashboard (~2k lines) — only loads when opened
const OrganizerDashboardView = lazy(() => import("./components/OrganizerDashboardView"));

import { initialEvents } from "./data/mockData";
import { Event, Ticket, TicketStatus, EventCategory, CartItem } from "./types";
import { Building2, Sparkles, Navigation, ArrowRight, Loader2, ShieldCheck, Heart, Ticket as TicketIcon } from "lucide-react";
import { LoaderTicketIcon } from "./components/CustomIcons";

export default function App() {
  // Automated First Land Premium Loading simulation
  const [isSiteLoading, setIsSiteLoading] = useState<boolean>(true);
  const [loadPercentage, setLoadPercentage] = useState<number>(0);
  const [loadingStatusText, setLoadingStatusText] = useState<string>("Initializing secure gateway...");
  const [logoError, setLogoError] = useState<boolean>(false);

  useEffect(() => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 12) + 8;
      if (progress >= 100) {
        progress = 100;
        setLoadPercentage(100);
        setLoadingStatusText("Ready! Discovering experiences...");
        clearInterval(interval);
        const timeout = setTimeout(() => {
          setIsSiteLoading(false);
        }, 400);
        return () => clearTimeout(timeout);
      } else {
        setLoadPercentage(progress);
        if (progress < 30) {
          setLoadingStatusText("Fetching premium concert series...");
        } else if (progress < 60) {
          setLoadingStatusText("Verifying exclusive ticket pools...");
        } else if (progress < 85) {
          setLoadingStatusText("Activating contactless barcoded entry keys...");
        } else {
          setLoadingStatusText("Securing checkout gateway...");
        }
      }
    }, 120);

    return () => clearInterval(interval);
  }, []);

  // Navigation & View controllers
  const [currentView, setCurrentView] = useState<string>("home");
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [postLoginRedirect, setPostLoginRedirect] = useState<string | null>(null);

  // Directory Catalog State with persistence hydration
  const [events, setEvents] = useState<Event[]>(() => {
    const saved = localStorage.getItem("myhitch_events");
    return saved ? JSON.parse(saved) : initialEvents;
  });

  // Search parameters dispatched to listing view
  const [searchQuery, setSearchQuery] = useState("");
  const [searchCategory, setSearchCategory] = useState("");
  const [searchLocation, setSearchLocation] = useState("");

  // Global user attendee credentials & profile states with persistent hydration
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    const saved = localStorage.getItem("myhitch_isLoggedIn");
    return saved ? saved === "true" : true; // Pre-logged in to give a seamless out-of-the-box preview
  });
  
  const [savedEventIds, setSavedEventIds] = useState<string[]>(() => {
    const saved = localStorage.getItem("myhitch_savedEventIds");
    return saved ? JSON.parse(saved) : ["evt-001", "evt-003"];
  });
  
  const [userProfile, setUserProfile] = useState(() => {
    const saved = localStorage.getItem("myhitch_userProfile");
    return saved ? JSON.parse(saved) : {
      name: "Sarah Jenkins",
      email: "sarahj@example.com",
    };
  });

  // Global Toast and Feedback notifier state
  const [activeToast, setActiveToast] = useState<{ message: string; type: "success" | "info" } | null>(null);

  const triggerToast = (message: string, type: "success" | "info" = "success") => {
    setActiveToast({ message, type });
  };

  // Guard: organizer dashboard requires login. If logged out, send to SOP page.
  useEffect(() => {
    if (currentView === "organizer" && !isLoggedIn) {
      setPostLoginRedirect("organizer");
      setCurrentView("organiser-sop");
    }
  }, [currentView, isLoggedIn]);

  useEffect(() => {
    if (activeToast) {
      const timer = setTimeout(() => {
        setActiveToast(null);
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [activeToast]);

  const handleLoginSuccess = (name: string, email: string) => {
    setUserProfile({ name, email });
    setIsLoggedIn(true);
    if (postLoginRedirect) {
      setCurrentView(postLoginRedirect);
      setPostLoginRedirect(null);
    } else {
      setCurrentView("home");
    }
  };

  const requireLoginThen = (destination: string) => {
    if (isLoggedIn) {
      setView(destination);
    } else {
      setPostLoginRedirect(destination);
      setView("login");
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserProfile({ name: "Sarah Jenkins", email: "sarahj@example.com" });
    setCurrentView("login");
  };

  const handleToggleSaveEvent = (eventId: string) => {
    const ev = events.find((e) => e.id === eventId);
    const eventTitle = ev ? ev.title : "Event";
    
    setSavedEventIds((prev) => {
      const isSaved = prev.includes(eventId);
      if (isSaved) {
        triggerToast(`Removed "${eventTitle}" from favorites`, "info");
        return prev.filter((id) => id !== eventId);
      } else {
        triggerToast(`Saved "${eventTitle}" to favorites!`, "success");
        return [...prev, eventId];
      }
    });
  };

  // Tickets — start empty; populated from API once user has a valid token
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [ticketsLoading, setTicketsLoading] = useState(false);


  const fetchTicketsFromAPI = async () => {
    const token = localStorage.getItem("myhitch_token");
    if (!token) return;
    setTicketsLoading(true);
    try {
      const res = await fetch(`${API}/tickets`, {
        headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
      });
      if (!res.ok) return;
      const json = await res.json();
      const apiTickets: Ticket[] = (json.data ?? []).map((t: Ticket) => ({
        ...t,
        status: t.status as TicketStatus,
      }));
      setTickets(apiTickets);
    } catch {
      // keep whatever is already in state
    } finally {
      setTicketsLoading(false);
    }
  };

  // Fetch on login / on mount if already logged in
  useEffect(() => {
    if (isLoggedIn) fetchTicketsFromAPI();
    else setTickets([]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn]);

  // Local database sync synchronization hooks
  useEffect(() => {
    localStorage.setItem("myhitch_events", JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem("myhitch_isLoggedIn", String(isLoggedIn));
  }, [isLoggedIn]);

  useEffect(() => {
    localStorage.setItem("myhitch_savedEventIds", JSON.stringify(savedEventIds));
  }, [savedEventIds]);

  useEffect(() => {
    localStorage.setItem("myhitch_userProfile", JSON.stringify(userProfile));
  }, [userProfile]);


  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem("myhitch_cart");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("myhitch_cart", JSON.stringify(cartItems));
  }, [cartItems]);

  const handleAddToCart = (
    eventId: string, eventTitle: string, eventDate: string, eventTime: string,
    eventLocation: string, eventImage: string, seatType: string, quantity: number, unitPrice: number
  ) => {
    const item: CartItem = {
      id: `CART-${Date.now()}`,
      eventId, eventTitle, eventDate, eventTime, eventLocation, eventImage,
      seatType, quantity, unitPrice,
    };
    setCartItems((prev) => [...prev, item]);
    triggerToast(`"${eventTitle}" added to cart!`, "success");
  };

  const handleSaveDraftBooking = (
    eventId: string,
    eventTitle: string,
    eventDate: string,
    eventTime: string,
    eventLocation: string,
    eventImage: string,
    qty: number,
    seatType: string,
    price: number,
    attendeeName: string,
    attendeeEmail: string
  ) => {
    const draftTicket: Ticket = {
      id: `DRAFT-PASS-${Math.floor(Math.random() * 9000 + 1000)}`,
      eventId,
      eventTitle,
      eventDate,
      eventTime,
      eventLocation,
      eventImage,
      qrCodeValue: "",
      status: TicketStatus.DRAFT,
      attendeeName,
      attendeeEmail,
      purchaseDate: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      seatType,
      price,
      quantity: qty,
    };

    setTickets((prev) => [draftTicket, ...prev]);
    triggerToast(`"${eventTitle}" saved to Drafts!`, "success");
    setCurrentView("my-tickets");
  };

  const resumeDraftBooking = (draft: Ticket) => {
    // 1. Remove from tickets list so user completes the flow
    setTickets((prev) => prev.filter((t) => t.id !== draft.id));
    
    // 2. Open Checkout Form
    const ev = events.find((e) => e.id === draft.eventId) || events[0];
    setBookingEvent(ev);
    setBookingQty(draft.quantity);
    setBookingSeatType(draft.seatType);
    setBookingAttendeeName(draft.attendeeName);
    setBookingAttendeeEmail(draft.attendeeEmail);
  };

  // Launch Checkout form states
  const [bookingEvent, setBookingEvent] = useState<Event | null>(null);
  const [bookingQty, setBookingQty] = useState(1);
  const [bookingSeatType, setBookingSeatType] = useState("General Admission");
  const [bookingAttendeeName, setBookingAttendeeName] = useState("");
  const [bookingAttendeeEmail, setBookingAttendeeEmail] = useState("");

  // Dynamic router logic
  const setView = (view: string, eventId?: string) => {
    let targetView = view;
    if (view === "organizer" && !isLoggedIn) {
      setPostLoginRedirect("organizer");
      targetView = "organiser-sop";
    }

    setCurrentView(targetView);
    if (eventId) {
      setSelectedEventId(eventId);
    }
    // Scroll smoothly to top on route change
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  const handleSelectEvent = (eventId: string) => {
    setSelectedEventId(eventId);
    setCurrentView("detail");
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  const handleSearchDispatch = (query: string, cat: string, loc: string) => {
    setSearchQuery(query);
    setSearchCategory(cat);
    setSearchLocation(loc);
  };

  const selectedEvent = useMemo(() => {
    return events.find((e) => e.id === selectedEventId) || events[0];
  }, [events, selectedEventId]);

  // Hook Bookings workflow
  const triggerQuickCheckout = (eventId: string) => {
    const ev = events.find((e) => e.id === eventId);
    if (ev) {
      setBookingEvent(ev);
      setBookingQty(1);
      setBookingSeatType("General Admission");
      setBookingAttendeeName(isLoggedIn ? userProfile.name : "");
      setBookingAttendeeEmail(isLoggedIn ? userProfile.email : "");
    }
  };

  const triggerDetailCheckout = (eventId: string, qty: number, seatType: string) => {
    const ev = events.find((e) => e.id === eventId);
    if (ev) {
      setBookingEvent(ev);
      setBookingQty(qty);
      setBookingSeatType(seatType);
      setBookingAttendeeName(isLoggedIn ? userProfile.name : "");
      setBookingAttendeeEmail(isLoggedIn ? userProfile.email : "");
    }
  };

  const handleCompleteBooking = (
    eventId: string,
    eventTitle: string,
    eventDate: string,
    eventTime: string,
    eventLocation: string,
    eventImage: string,
    qty: number,
    seatType: string,
    totalCharge: number,
    attendeeName: string,
    attendeeEmail: string
  ) => {
    // 1. Inject ticket into the activeTickets array representatively
    const newTicket: Ticket = {
      id: `HITCH-PASS-${Math.floor(Math.random() * 9000 + 1000)}`,
      eventId,
      eventTitle,
      eventDate,
      eventTime,
      eventLocation,
      eventImage,
      qrCodeValue: `SECURE-TKN-${Math.floor(Math.random() * 900000 + 100000)}`,
      status: TicketStatus.UPCOMING,
      attendeeName,
      attendeeEmail,
      purchaseDate: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      seatType,
      price: totalCharge,
      quantity: qty,
    };

    setTickets((prev) => [newTicket, ...prev]);

    // 2. Increment sold tickets inside the target event to keep sales levels synchronized!
    setEvents((prevEvents) =>
      prevEvents.map((ev) => {
        if (ev.id === eventId) {
          return {
            ...ev,
            soldTickets: Math.min(ev.soldTickets + qty, ev.totalTickets),
          };
        }
        return ev;
      })
    );

    // 3. Refresh real tickets from API in the background
    fetchTicketsFromAPI();

    // Switch view automatically to highlight the new pass!
    setCurrentView("my-tickets");
  };

  const handleCancelTicket = async (ticketId: string) => {
    // Optimistic removal from UI
    const targetTicket = tickets.find((t) => t.id === ticketId);
    setTickets((prev) => prev.filter((t) => t.id !== ticketId));
    if (targetTicket) {
      setEvents((prevEvents) =>
        prevEvents.map((ev) =>
          ev.id === targetTicket.eventId
            ? { ...ev, soldTickets: Math.max(ev.soldTickets - targetTicket.quantity, 0) }
            : ev
        )
      );
    }

    // Persist cancellation to API
    const token = localStorage.getItem("myhitch_token");
    if (token) {
      try {
        await fetch(`${API}/tickets/${ticketId}/cancel`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
        });
      } catch { /* ignore — UI already updated */ }
    }
  };

  const handleTransferTicket = (ticketId: string, email: string) => {
    // Keep local representation by re-assigning beneficiary email
    setTickets((prev) =>
      prev.map((t) => {
        if (t.id === ticketId) {
          return {
            ...t,
            attendeeEmail: email,
            attendeeName: email.split("@")[0],
          };
        }
        return t;
      })
    );
  };

  const handleAddEvent = (newEvent: Event) => {
    setEvents((prev) => [newEvent, ...prev]);
  };

  if (isSiteLoading) {
    return (
      <div className="fixed inset-0 z-9999 bg-[#f5f8fc] flex flex-col items-center justify-center text-dark-text px-4 select-none overflow-hidden">
        {/* Soft atmospheric radial gradient glows in the background to set an elegant welcome mood */}
        <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-linear-to-tr from-brand-blue/10 to-indigo-500/5 rounded-full blur-[120px] animate-pulse duration-8000" />
        
        {/* Animated grid lines pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000003_1px,transparent_1px),linear-gradient(to_bottom,#00000003_1px,transparent_1px)] bg-size-[40px_40px] mask-[radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />

        {/* Storytelling & Welcomer visual box */}
        <div className="relative text-center max-w-md w-full space-y-10 z-10 transition-all duration-700">
          
          {/* Welcome brand badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-blue/5 border border-brand-blue/10 text-brand-blue text-[10px] font-bold uppercase tracking-widest shadow-sm backdrop-blur-md animate-bounce duration-3000">
            <Sparkles className="h-3.5 w-3.5 text-brand-blue animate-pulse" />
            <span>Premium Experience Pass</span>
          </div>

          {/* Master welcoming header */}
          <div className="space-y-4 animate-fade">
            <h1 className="text-4xl md:text-5xl font-black tracking-tight uppercase leading-none font-sans text-neutral-900 flex flex-col items-center justify-center gap-3">
              <span>Welcome To</span>
              {!logoError ? (
                <img
                  src="/logo.png"
                  alt="MYHitchPass Logo"
                  className="h-16 md:h-20 w-auto object-contain"
                  onError={() => setLogoError(true)}
                />
              ) : (
                <span className="text-brand-blue bg-clip-text">MYHitch<span className="text-neutral-900">Pass</span></span>
              )}
            </h1>
            <p className="text-[11px] text-neutral-550 font-bold max-w-sm mx-auto leading-relaxed">
              Curating live concerts, premier international music festivals, elite sports matches, and world-class local tours.
            </p>
          </div>

          {/* Immersive pulsing ticket orb representing gateway validation */}
          <div className="flex justify-center items-center py-2">
            <div className="relative group">
              {/* Outer double glowing rings */}
              <div className="absolute -inset-4 rounded-full bg-linear-to-r from-brand-blue to-purple-600 opacity-10 blur-xl group-hover:opacity-20 transition-opacity duration-1000 animate-pulse" />
              <div className="absolute -inset-1 rounded-full bg-linear-to-r from-brand-blue to-purple-400 opacity-20 animate-spin duration-15000" />
              
              <div className="relative h-20 w-20 rounded-full bg-white border border-brand-blue/10 flex items-center justify-center shadow-md">
                <LoaderTicketIcon className="h-10 w-10 text-brand-blue" />
              </div>
            </div>
          </div>

          {/* Progress controller */}
          <div className="space-y-4 max-w-sm mx-auto">
            <div className="relative h-1.5 w-full bg-neutral-200/60 rounded-full overflow-hidden border border-neutral-300/20">
              <div 
                className="absolute top-0 left-0 h-full bg-linear-to-r from-brand-blue via-cyan-400 to-indigo-500 rounded-full transition-all duration-150 ease-out shadow-[0_0_10px_rgba(0,174,239,0.3)]"
                ref={el => { if (el) el.style.width = `${loadPercentage}%`; }}
              />
            </div>
            
            {/* Live progress indicators */}
            <div className="flex items-center justify-between text-neutral-500 text-[11px] font-bold px-1 select-none">
              <div className="flex items-center gap-2">
                <Loader2 className="h-3.5 w-3.5 text-brand-blue animate-spin" />
                <span className="text-neutral-650 font-bold block truncate max-w-[220px]">{loadingStatusText}</span>
              </div>
              <span className="text-brand-blue font-black tabular-nums">{loadPercentage}%</span>
            </div>
          </div>

          {/* High-status credibility markers */}
          <div className="pt-6 border-t border-neutral-200/60 flex items-center justify-center gap-5 text-[9px] text-neutral-400 font-bold uppercase tracking-widest">
            <div className="flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
              <span className="text-neutral-500">100% Guaranteed Door Access</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-neutral-300" />
            <span className="text-neutral-500">Instant Digital Vouchers</span>
          </div>
          
        </div>
      </div>
    );
  }

  return (
    <div className="bg-soft-bg min-h-screen text-dark-text selection:bg-brand-blue/20 selection:text-brand-blue-hover">
      {currentView !== "login" && (
        <Navbar
          currentView={currentView}
          setView={setView}
          ticketCount={tickets.length}
          cartCount={cartItems.length}
          userProfile={userProfile}
          isLoggedIn={isLoggedIn}
          onLogout={handleLogout}
        />
      )}
      <main>
        
        {/* HOMEPAGE VIEW SCREEN */}
        {currentView === "home" && (
          <div className="animate-fade">
            <Hero onSearch={handleSearchDispatch} setView={setView} />
            <PopularCategories onSelectCategory={(cat) => handleSearchDispatch("", cat, "")} />
            <FeaturedEvents
              events={events}
              onSelectEvent={handleSelectEvent}
              onQuickBook={triggerQuickCheckout}
              setView={setView}
            />
            <Benefits />
            <HowItWorks />

            {/* HIGH FIDELITY CALL-TO-ACTION SECTION FOR CREATORS */}
            <section
              id="creator-promote-banner"
              className="relative overflow-hidden min-h-[480px] py-32 text-white flex items-center"
            >
              {/* Background image — Ken Burns zoom on all sizes. */}
              <div
                className="absolute inset-0 bg-cover bg-center bg-scroll md:bg-fixed animate-ken-burns"
                style={{ backgroundImage: "url('/images/cta-bg.png')" }}
                aria-hidden="true"
              />

              {/* Dark gradient overlay */}
              <div
                className="absolute inset-0 bg-gradient-to-br from-slate-900/80 via-blue-900/70 to-slate-900/85"
                aria-hidden="true"
              />

              {/* Foreground content */}
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
        )}

        {/* REGULAR DIRECTORY EXPLORER PAGE */}
        {currentView === "events" && (
          <div className="animate-fade">
            <EventListingView
              events={events}
              initialCategory={searchCategory}
              initialQuery={searchQuery}
              initialLocation={searchLocation}
              onSelectEvent={handleSelectEvent}
              onQuickBook={triggerQuickCheckout}
            />
          </div>
        )}

        {/* UPCOMING EVENTS VIEW SCREEN */}
        {currentView === "upcoming" && (
          <div className="animate-fade">
            <UpcomingEventsView
              events={events}
              onSelectEvent={handleSelectEvent}
              onQuickBook={triggerQuickCheckout}
            />
          </div>
        )}

        {/* BROADWAY TICKETS SCHEDULER VIEW */}
        {currentView === "broadway-tickets" && (
          <div className="animate-fade">
            <BroadwayTicketsView
              events={events}
              onBookTickets={triggerDetailCheckout}
              setView={setView}
            />
          </div>
        )}

        {/* SPECIAL EVENT DETAILS VIEW */}
        {currentView === "detail" && selectedEvent && (
          <div className="animate-fade">
            <EventDetailView
              event={selectedEvent}
              onBack={() => setView("events")}
              onBookTickets={triggerDetailCheckout}
              onAddToCart={() => {}}
              savedEventIds={savedEventIds}
              onToggleSave={handleToggleSaveEvent}
            />
          </div>
        )}

        {/* COMPREHENSIVE REGISTRY DASHBOARD - ATTENDEE BIOMETRIC TICKETS */}
        {currentView === "my-tickets" && (
          <div className="animate-fade">
            <MyTicketsView
              tickets={tickets}
              loading={ticketsLoading}
              onCancelTicket={handleCancelTicket}
              onTransferTicket={handleTransferTicket}
              onResumeDraftCheckout={resumeDraftBooking}
              onRefresh={fetchTicketsFromAPI}
            />
          </div>
        )}

        {/* PRODUCER PORTAL CONSOLE */}
        {currentView === "organizer" && isLoggedIn && (
          <div className="animate-fade">
            <Suspense
              fallback={
                <div className="min-h-[60vh] flex items-center justify-center">
                  <div className="flex items-center gap-3 text-neutral-500">
                    <Loader2 className="h-5 w-5 animate-spin text-brand-blue" />
                    <span className="text-sm font-bold">Loading organiser dashboard…</span>
                  </div>
                </div>
              }
            >
              <OrganizerDashboardView
                activeEvents={events}
                onAddEvent={handleAddEvent}
                userProfile={userProfile}
              />
            </Suspense>
          </div>
        )}

        {/* ORGANISER SOP / ONBOARDING GUIDE */}
        {currentView === "organiser-sop" && (
          <div className="min-h-[70vh] animate-fade bg-soft-bg" />
        )}

        {/* PRIVACY CHARTER */}
        {currentView === "privacy" && <PrivacyCharterView setView={setView} />}

        {/* TICKETING POLICY */}
        {currentView === "ticketing-policy" && <TicketingPolicyView setView={setView} />}

        {/* HELP DESK */}
        {currentView === "help-desk" && <HelpDeskView setView={setView} />}

        {/* ABOUT US */}
        {currentView === "about" && (
          <div className="animate-fade">
            <AboutUsView setView={setView} />
          </div>
        )}

        {/* PRICING */}
        {currentView === "pricing" && (
          <div className="animate-fade">
            <PricingView setView={setView} />
          </div>
        )}

        {/* SERVICERS */}
        {currentView === "servicers" && (
          <div className="animate-fade">
            <ServicersView setView={setView} />
          </div>
        )}

        {/* CONTACT US */}
        {currentView === "contact" && (
          <div className="animate-fade">
            <ContactUsView setView={setView} />
          </div>
        )}

        {/* LOGIN GATEWAY VIEWER */}
        {currentView === "login" && (
          <div className="animate-fade">
            <LoginView
              onLoginSuccess={handleLoginSuccess}
              onBackToHome={() => setView("home")}
            />
          </div>
        )}

        {/* SECURE WALLET PASSHOLDER PROFILE VIEW */}
        {currentView === "profile" && (
          <div className="animate-fade">
            <ProfileView
              userProfile={userProfile}
              tickets={tickets}
              savedEventIds={savedEventIds}
              events={events}
              onUpdateProfile={(name, email) => setUserProfile({ name, email })}
              onToggleSave={handleToggleSaveEvent}
              onLogout={handleLogout}
              onSelectEvent={handleSelectEvent}
              setView={setView}
              currentAvatar={(userProfile as { avatar?: string }).avatar ?? ""}
              onSaveAvatar={(url: string) => setUserProfile((p: typeof userProfile) => ({ ...p, avatar: url }))}
              onUploadAvatar={async () => ({ success: false, error: "Not supported" })}
              onChangePassword={async () => ({ success: false, error: "Not supported" })}
            />
          </div>
        )}

      </main>

      {/* Shared Footer block */}
      {currentView !== "login" && <Footer setView={setView} />}

      {/* ACTIVE REGISTERING CHECKOUT DRAWERS DIALOGS */}
      {bookingEvent && (
        <CheckoutModal
          event={bookingEvent}
          qty={bookingQty}
          seatType={bookingSeatType}
          initialAttendeeName={bookingAttendeeName}
          initialAttendeeEmail={bookingAttendeeEmail}
          onClose={() => {
            setBookingEvent(null);
            setBookingAttendeeName("");
            setBookingAttendeeEmail("");
          }}
          onCompleteBooking={handleCompleteBooking}
          onSaveDraftBooking={handleSaveDraftBooking}
          onAddToCart={handleAddToCart}
        />
      )}

      {/* GLOBAL TOAST NOTIFICATION BLOCK */}
      {activeToast && (
        <div 
          id="global-toast-notification" 
          className="fixed bottom-6 right-6 z-200 flex items-center gap-3 bg-neutral-900 border border-neutral-800 text-white rounded-2xl px-5 py-4 shadow-xl shadow-black/45 animate-fade select-none max-w-sm"
        >
          <div className="shrink-0">
            {activeToast.type === "success" ? (
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                <Sparkles className="h-4 w-4" />
              </span>
            ) : (
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-rose-500/20 text-rose-400">
                <Heart className="h-4 w-4 text-rose-500 fill-rose-500 animate-pulse" />
              </span>
            )}
          </div>
          <div className="text-left font-sans">
            <p className="text-xs font-bold text-neutral-200">{activeToast.message}</p>
          </div>
          <button 
            onClick={() => setActiveToast(null)} 
            className="ml-2 text-neutral-400 hover:text-white text-xs font-bold cursor-pointer h-5 w-5 rounded-full flex items-center justify-center bg-neutral-800 hover:bg-neutral-700 transition-colors"
          >
            ×
          </button>
        </div>
      )}

    </div>
  );
}
