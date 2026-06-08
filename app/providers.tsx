"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";
import { useRouter, usePathname } from "next/navigation";
import Navbar from "@/src/components/Navbar";
import Footer from "@/src/components/Footer";
import CheckoutModal from "@/src/components/CheckoutModal";
import API_BASE from "@/src/lib/api";
import { type Event, type Ticket, type CartItem, TicketStatus } from "@/src/types";
import {
  Sparkles,
  Heart,
  Ticket as TicketIcon,
} from "lucide-react";

// ─── cart helpers ────────────────────────────────────────────────────────────
const CART_EXPIRY_MS = 7 * 24 * 60 * 60 * 1000; // 7 days
const GUEST_CART_KEY = "myhitch_cart_guest";

function userCartKey(email: string) {
  return `myhitch_cart_${email}`;
}

function loadStoredCart(key: string): import("@/src/types").CartItem[] {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    const items: import("@/src/types").CartItem[] = JSON.parse(raw);
    const now = Date.now();
    return items.filter(i => !i.addedAt || now - i.addedAt < CART_EXPIRY_MS);
  } catch { return []; }
}

function mergeCartItems(
  base: import("@/src/types").CartItem[],
  incoming: import("@/src/types").CartItem[]
): import("@/src/types").CartItem[] {
  const merged = [...base];
  for (const gi of incoming) {
    const idx = merged.findIndex(i => i.eventId === gi.eventId && i.seatType === gi.seatType);
    if (idx >= 0) {
      merged[idx] = { ...merged[idx], quantity: Math.min(10, merged[idx].quantity + gi.quantity) };
    } else {
      merged.push(gi);
    }
  }
  return merged;
}

// ─── view → path mapping ────────────────────────────────────────────────────
const VIEW_PATH_MAP: Record<string, string> = {
  home: "/",
  events: "/events",
  upcoming: "/upcoming",
  "broadway-tickets": "/broadway-tickets",
  "my-tickets": "/my-tickets",
  organizer: "/organiser/dashboard",
  "organiser-sop": "/organiser-sop",
  profile: "/profile",
  login: "/login",
  privacy: "/privacy",
  "ticketing-policy": "/ticketing-policy",
  "help-desk": "/help-desk",
  about: "/about",
  pricing: "/pricing",
  servicers: "/servicers",
  contact: "/contact",
  cart: "/cart",
};

// ─── default seed tickets ───────────────────────────────────────────────────

// ─── context type ────────────────────────────────────────────────────────────
export interface AppContextValue {
  events: Event[];
  tickets: Ticket[];
  eventsLoading: boolean;
  ticketsLoading: boolean;
  isLoggedIn: boolean;
  userProfile: { name: string; email: string; avatar?: string };
  savedEventIds: string[];
  bookingEvent: Event | null;
  bookingQty: number;
  bookingSeatType: string;
  bookingAttendeeName: string;
  bookingAttendeeEmail: string;
  cartItems: CartItem[];
  postLoginRedirect: string | null;
  addToCart: (eventId: string, qty: number, seatType: string, unitPrice: number, ticketTypeId?: string) => void;
  removeFromCart: (cartItemId: string) => void;
  updateCartItemQty: (cartItemId: string, qty: number) => void;
  clearCart: () => void;
  checkoutCartItem: (cartItemId: string) => void;
  setView: (view: string, eventId?: string) => void;
  handleSelectEvent: (eventId: string) => void;
  handleSearchDispatch: (query: string, cat: string, loc: string) => void;
  handleLoginSuccess: (name: string, email: string) => void;
  handleLogout: () => void;
  handleToggleSaveEvent: (eventId: string) => void;
  triggerToast: (message: string, type?: "success" | "info") => void;
  triggerQuickCheckout: (eventId: string) => void;
  triggerDetailCheckout: (
    eventId: string,
    qty: number,
    seatType: string
  ) => void;
  handleCompleteBooking: (
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
    attendeeEmail: string,
    items?: { name: string; quantity: number; unitPrice: number }[]
  ) => void;
  handleSaveDraftBooking: (
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
  ) => void;
  handleCancelTicket: (ticketId: string) => void;
  handleTransferTicket: (ticketId: string, email: string) => void;
  handleAddEvent: (event: Event) => void;
  resumeDraftBooking: (draft: Ticket) => void;
  requireLoginThen: (destination: string) => void;
  setUserProfile: (profile: { name: string; email: string; avatar?: string }) => void;
  setPostLoginRedirect: (redirect: string | null) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppContext must be used inside AppProviders");
  return ctx;
}

// ─── provider ────────────────────────────────────────────────────────────────
export function AppProviders({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();


  // ── State ─────────────────────────────────────────────────────────────────
  const [events, setEvents]               = useState<Event[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const cached = sessionStorage.getItem("myhitch_events_cache");
      return cached ? JSON.parse(cached) : [];
    } catch { return []; }
  });
  const [eventsLoading, setEventsLoading] = useState<boolean>(() => {
    if (typeof window === "undefined") return true;
    return !sessionStorage.getItem("myhitch_events_cache");
  });

  const [tickets, setTickets]               = useState<Ticket[]>([]);
  const [ticketsLoading, setTicketsLoading] = useState(false);

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    try {
      return !!localStorage.getItem("myhitch_token");
    } catch {
      return false;
    }
  });

  const [savedEventIds, setSavedEventIds] = useState<string[]>(() => {
    if (typeof window === "undefined") return ["evt-001", "evt-003"];
    try {
      const saved = localStorage.getItem("myhitch_savedEventIds");
      return saved ? JSON.parse(saved) : ["evt-001", "evt-003"];
    } catch {
      return ["evt-001", "evt-003"];
    }
  });

  const [userProfile, setUserProfile] = useState<{
    name: string;
    email: string;
    avatar?: string;
  }>(() => {
    if (typeof window === "undefined") return { name: "", email: "" };
    try {
      const saved = localStorage.getItem("myhitch_userProfile");
      if (saved) return JSON.parse(saved);
      const apiUser = localStorage.getItem("myhitch_user");
      if (apiUser) {
        const u = JSON.parse(apiUser);
        return { name: u.name ?? "", email: u.email ?? "", avatar: u.avatar_url ?? "" };
      }
      return { name: "", email: "" };
    } catch {
      return { name: "", email: "" };
    }
  });

  const [postLoginRedirect, setPostLoginRedirect] = useState<string | null>(
    null
  );
  const [activeToast, setActiveToast] = useState<{
    message: string;
    type: "success" | "info";
  } | null>(null);

  // Booking modal state
  const [bookingEvent, setBookingEvent] = useState<Event | null>(null);
  const [bookingQty, setBookingQty] = useState(1);
  const [bookingSeatType, setBookingSeatType] = useState("General Admission");
  const [bookingAttendeeName, setBookingAttendeeName] = useState("");
  const [bookingAttendeeEmail, setBookingAttendeeEmail] = useState("");

  // Cart state — initialised from localStorage; accessible to guests too
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      if (localStorage.getItem("myhitch_token")) {
        const u = JSON.parse(localStorage.getItem("myhitch_user") ?? "{}");
        if (u.email) return loadStoredCart(userCartKey(u.email));
      }
      return loadStoredCart(GUEST_CART_KEY);
    } catch { return []; }
  });
  const [pendingCartCheckoutId, setPendingCartCheckoutId] = useState<string | null>(null);

  // ── Fetch events — serve cache instantly, refresh in background ──────────
  useEffect(() => {
    setEventsLoading(true);
    fetch(`${API_BASE}/events`)
      .then(r => r.json())
      .then(json => {
        if (json.data) {
          setEvents(json.data);
          try { sessionStorage.setItem("myhitch_events_cache", JSON.stringify(json.data)); } catch {}
        }
      })
      .catch(() => {})
      .finally(() => setEventsLoading(false));
  }, []);

  // ── Fetch fresh user profile from API when logged in ─────────────────────
  useEffect(() => {
    if (!isLoggedIn) return;
    const token = localStorage.getItem("myhitch_token");
    if (!token) return;
    fetch(`${API_BASE}/auth/me`, {
      headers: { "Authorization": `Bearer ${token}`, "Accept": "application/json" },
    })
      .then(r => r.json())
      .then(json => {
        if (json.id) {
          const profile = { name: json.name ?? "", email: json.email ?? "", avatar: json.avatar_url ?? "" };
          setUserProfile(profile);
          try {
            localStorage.setItem("myhitch_user", JSON.stringify(json));
            localStorage.setItem("myhitch_userProfile", JSON.stringify(profile));
          } catch {}
        }
      })
      .catch(() => {});
  }, [isLoggedIn]);

  // ── Fetch tickets from API when logged in ─────────────────────────────────
  useEffect(() => {
    if (!isLoggedIn) { setTickets([]); return; }
    const token = localStorage.getItem("myhitch_token");
    if (!token) return;
    setTicketsLoading(true);
    fetch(`${API_BASE}/tickets`, {
      headers: { "Authorization": `Bearer ${token}`, "Accept": "application/json" },
    })
      .then(r => r.json())
      .then(json => { if (json.data) setTickets(json.data); })
      .catch(() => {})
      .finally(() => setTicketsLoading(false));
  }, [isLoggedIn]);

  // ── Persistence sync ───────────────────────────────────────────────────────
  useEffect(() => {
    localStorage.setItem("myhitch_isLoggedIn", String(isLoggedIn));
  }, [isLoggedIn]);
  useEffect(() => {
    localStorage.setItem(
      "myhitch_savedEventIds",
      JSON.stringify(savedEventIds)
    );
  }, [savedEventIds]);
  useEffect(() => {
    localStorage.setItem("myhitch_userProfile", JSON.stringify(userProfile));
  }, [userProfile]);
  // Switch cart when login state changes; merge any pending guest items on login
  useEffect(() => {
    if (isLoggedIn && userProfile.email) {
      const email = userProfile.email;
      const guestItems = loadStoredCart(GUEST_CART_KEY);
      if (guestItems.length > 0) {
        const merged = mergeCartItems(loadStoredCart(userCartKey(email)), guestItems);
        try { localStorage.removeItem(GUEST_CART_KEY); } catch {}
        setCartItems(merged);
      } else {
        setCartItems(loadStoredCart(userCartKey(email)));
      }
    } else if (!isLoggedIn) {
      setCartItems(loadStoredCart(GUEST_CART_KEY));
    }
  }, [isLoggedIn, userProfile.email]);

  // Persist cart (works for both guests and logged-in users)
  useEffect(() => {
    const key = isLoggedIn && userProfile.email
      ? userCartKey(userProfile.email)
      : GUEST_CART_KEY;
    try { localStorage.setItem(key, JSON.stringify(cartItems)); } catch {}
  }, [cartItems, isLoggedIn, userProfile.email]);

  // Toast auto-dismiss
  useEffect(() => {
    if (activeToast) {
      const timer = setTimeout(() => setActiveToast(null), 3500);
      return () => clearTimeout(timer);
    }
  }, [activeToast]);

  const triggerToast = useCallback(
    (message: string, type: "success" | "info" = "success") => {
      setActiveToast({ message, type });
    },
    []
  );

  // ── Navigation ─────────────────────────────────────────────────────────────
  const setView = useCallback(
    (view: string, eventId?: string) => {
      if (view === "organizer" && !isLoggedIn) {
        setPostLoginRedirect("organizer");
        router.push("/organiser-sop");
        return;
      }
      if (view === "detail" && eventId) {
        router.push("/events/" + eventId);
        window.scrollTo({ top: 0, behavior: "instant" });
        return;
      }
      const path = VIEW_PATH_MAP[view] ?? "/" + view;
      router.push(path);
      window.scrollTo({ top: 0, behavior: "instant" });
    },
    [router, isLoggedIn]
  );

  const handleSelectEvent = useCallback(
    (eventId: string) => {
      router.push("/events/" + eventId);
      window.scrollTo({ top: 0, behavior: "instant" });
    },
    [router]
  );

  const handleSearchDispatch = useCallback(
    (query: string, cat: string, loc: string) => {
      const params = new URLSearchParams();
      if (query) params.set("q", query);
      if (cat) params.set("cat", cat);
      if (loc) params.set("loc", loc);
      const search = params.toString();
      router.push("/events" + (search ? "?" + search : ""));
      window.scrollTo({ top: 0, behavior: "instant" });
    },
    [router]
  );

  const requireLoginThen = useCallback(
    (destination: string) => {
      if (isLoggedIn) {
        const path = VIEW_PATH_MAP[destination] ?? "/" + destination;
        router.push(path);
      } else {
        setPostLoginRedirect(destination);
        router.push("/login");
      }
    },
    [isLoggedIn, router]
  );

  const handleLoginSuccess = useCallback(
    (name: string, email: string) => {
      setUserProfile({ name, email });
      setIsLoggedIn(true);
      if (postLoginRedirect) {
        const path = VIEW_PATH_MAP[postLoginRedirect] ?? "/" + postLoginRedirect;
        router.push(path);
        setPostLoginRedirect(null);
      } else {
        router.push("/");
      }
    },
    [postLoginRedirect, router]
  );

  const handleLogout = useCallback(() => {
    const token = localStorage.getItem("myhitch_token");
    if (token) {
      fetch(`${API_BASE}/auth/logout`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}`, "Accept": "application/json" },
      }).catch(() => {});
    }
    localStorage.removeItem("myhitch_token");
    localStorage.removeItem("myhitch_user");
    localStorage.removeItem("myhitch_userProfile");
    localStorage.removeItem("myhitch_user_role");
    localStorage.removeItem("organiser_token");
    setIsLoggedIn(false);
    setUserProfile({ name: "", email: "" });
    setCartItems([]);
    router.push("/login");
  }, [router]);

  const handleToggleSaveEvent = useCallback(
    (eventId: string) => {
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
    },
    [events, triggerToast]
  );

  const triggerQuickCheckout = useCallback(
    (eventId: string) => {
      const ev = events.find((e) => e.id === eventId);
      if (ev) {
        setBookingEvent(ev);
        setBookingQty(1);
        setBookingSeatType("General Admission");
        setBookingAttendeeName(isLoggedIn ? userProfile.name : "");
        setBookingAttendeeEmail(isLoggedIn ? userProfile.email : "");
      }
    },
    [events, isLoggedIn, userProfile]
  );

  const triggerDetailCheckout = useCallback(
    (eventId: string, qty: number, seatType: string) => {
      const ev = events.find((e) => e.id === eventId);
      if (ev) {
        setBookingEvent(ev);
        setBookingQty(qty);
        setBookingSeatType(seatType);
        setBookingAttendeeName(isLoggedIn ? userProfile.name : "");
        setBookingAttendeeEmail(isLoggedIn ? userProfile.email : "");
      }
    },
    [events, isLoggedIn, userProfile]
  );

  const handleCompleteBooking = useCallback(
    (
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
      attendeeEmail: string,
      items?: { name: string; quantity: number; unitPrice: number; ticketTypeId?: string }[]
    ) => {
      const tempId = `HITCH-PASS-${Math.floor(Math.random() * 9000 + 1000)}`;
      const newTicket: Ticket = {
        id: tempId,
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
        purchaseDate: new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        seatType,
        price: totalCharge,
        quantity: qty,
      };
      setTickets((prev) => [newTicket, ...prev]);
      setEvents((prevEvents) =>
        prevEvents.map((ev) =>
          ev.id === eventId
            ? { ...ev, soldTickets: Math.min(ev.soldTickets + qty, ev.totalTickets) }
            : ev
        )
      );
      setPendingCartCheckoutId((pendingId) => {
        if (pendingId) {
          setCartItems((prev) => prev.filter((c) => c.id !== pendingId));
        }
        return null;
      });

      // Persist order and tickets to DB when user is authenticated
      const token = localStorage.getItem("myhitch_token");
      if (token && items && items.length > 0) {
        fetch(`${API_BASE}/orders`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            event_id: eventId,
            items: items.map((i) => ({
              ticket_type_id: i.ticketTypeId ?? undefined,
              name:           i.name,
              quantity:       i.quantity,
              unit_price:     i.unitPrice,
            })),
          }),
        })
          .then((r) => r.json())
          .then((json) => {
            if (json.tickets && Array.isArray(json.tickets)) {
              // Replace the optimistic local ticket with real DB tickets
              setTickets((prev) => [
                ...json.tickets,
                ...prev.filter((t) => t.id !== tempId),
              ]);
            }
          })
          .catch(() => {});
      }

      router.push("/my-tickets");
    },
    [router]
  );

  const handleSaveDraftBooking = useCallback(
    (
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
        purchaseDate: new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        seatType,
        price,
        quantity: qty,
      };
      setTickets((prev) => [draftTicket, ...prev]);
      triggerToast(`"${eventTitle}" saved to Drafts!`, "success");
      router.push("/my-tickets");
    },
    [router, triggerToast]
  );

  const handleCancelTicket = useCallback(
    (ticketId: string) => {
      // Call the real API when authenticated
      const token = localStorage.getItem("myhitch_token");
      if (token) {
        fetch(`${API_BASE}/tickets/${ticketId}/cancel`, {
          method: "POST",
          headers: { "Authorization": `Bearer ${token}`, "Accept": "application/json" },
        }).catch(() => {});
      }
      // Optimistically remove from local state
      const targetTicket = tickets.find((t) => t.id === ticketId);
      if (targetTicket) {
        setEvents((prevEvents) =>
          prevEvents.map((ev) =>
            ev.id === targetTicket.eventId
              ? { ...ev, soldTickets: Math.max(ev.soldTickets - targetTicket.quantity, 0) }
              : ev
          )
        );
        setTickets((prev) => prev.filter((t) => t.id !== ticketId));
      }
    },
    [tickets]
  );

  const handleTransferTicket = useCallback(
    (ticketId: string, email: string) => {
      setTickets((prev) =>
        prev.map((t) =>
          t.id === ticketId
            ? { ...t, attendeeEmail: email, attendeeName: email.split("@")[0] }
            : t
        )
      );
    },
    []
  );

  const handleAddEvent = useCallback((newEvent: Event) => {
    setEvents((prev) => [newEvent, ...prev]);
  }, []);

  const resumeDraftBooking = useCallback(
    (draft: Ticket) => {
      setTickets((prev) => prev.filter((t) => t.id !== draft.id));
      const ev = events.find((e) => e.id === draft.eventId) ?? events[0];
      setBookingEvent(ev);
      setBookingQty(draft.quantity);
      setBookingSeatType(draft.seatType);
      setBookingAttendeeName(draft.attendeeName);
      setBookingAttendeeEmail(draft.attendeeEmail);
    },
    [events]
  );

  // ── Cart ───────────────────────────────────────────────────────────────────
  const addToCart = useCallback(
    (eventId: string, qty: number, seatType: string, unitPrice: number, ticketTypeId?: string) => {
      const ev = events.find((e) => e.id === eventId);
      if (!ev) return;
      setCartItems((prev) => {
        const existing = prev.find(
          (item) => item.eventId === eventId && item.seatType === seatType
        );
        if (existing) {
          triggerToast(`Updated quantity for "${ev.title}"`, "success");
          return prev.map((item) =>
            item.id === existing.id
              ? { ...item, quantity: Math.min(10, item.quantity + qty) }
              : item
          );
        }
        triggerToast(`"${ev.title}" added to cart!`, "success");
        return [
          ...prev,
          {
            id: `CART-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
            eventId,
            eventTitle: ev.title,
            eventDate: ev.date,
            eventTime: ev.time,
            eventLocation: ev.location,
            eventImage: ev.image,
            seatType,
            ticketTypeId,
            quantity: qty,
            unitPrice,
            addedAt: Date.now(),
          },
        ];
      });
    },
    [events, triggerToast]
  );

  const removeFromCart = useCallback((cartItemId: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== cartItemId));
  }, []);

  const updateCartItemQty = useCallback((cartItemId: string, qty: number) => {
    if (qty < 1) return;
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === cartItemId ? { ...item, quantity: Math.min(10, qty) } : item
      )
    );
  }, []);

  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  const checkoutCartItem = useCallback(
    (cartItemId: string) => {
      const item = cartItems.find((c) => c.id === cartItemId);
      if (!item) return;
      const params = new URLSearchParams({ qty: String(item.quantity) });
      if (item.ticketTypeId) params.set("ticketTypeId", item.ticketTypeId);
      router.push(`/checkout/${item.eventId}?${params.toString()}`);
    },
    [cartItems, router]
  );

  // currentView derived from pathname (for Navbar active-state highlighting)
  const currentView = useMemo(() => {
    if (pathname === "/") return "home";
    return pathname.slice(1).split("/")[0] || "home";
  }, [pathname]);

  const contextValue: AppContextValue = {
    events,
    tickets,
    eventsLoading,
    ticketsLoading,
    cartItems,
    isLoggedIn,
    userProfile,
    savedEventIds,
    bookingEvent,
    bookingQty,
    bookingSeatType,
    bookingAttendeeName,
    bookingAttendeeEmail,
    postLoginRedirect,
    addToCart,
    removeFromCart,
    updateCartItemQty,
    clearCart,
    checkoutCartItem,
    setView,
    handleSelectEvent,
    handleSearchDispatch,
    handleLoginSuccess,
    handleLogout,
    handleToggleSaveEvent,
    triggerToast,
    triggerQuickCheckout,
    triggerDetailCheckout,
    handleCompleteBooking,
    handleSaveDraftBooking,
    handleCancelTicket,
    handleTransferTicket,
    handleAddEvent,
    resumeDraftBooking,
    requireLoginThen,
    setUserProfile,
    setPostLoginRedirect,
  };

  // ── Main shell ─────────────────────────────────────────────────────────────
  // Organiser-private routes (/organiser/signup, /organiser/dashboard, …) manage
  // their own navigation, so we suppress the global Navbar and Footer there.
  const isNoHeaderFooter = pathname.startsWith("/organiser/") || pathname === "/login";

  return (
    <AppContext.Provider value={contextValue}>
      <div className="bg-soft-bg min-h-screen text-dark-text selection:bg-brand-blue/20 selection:text-brand-blue-hover">
        {!isNoHeaderFooter && (
          <Navbar
            currentView={currentView}
            setView={setView}
            cartCount={cartItems.length}
            ticketCount={0}
            userProfile={userProfile}
            isLoggedIn={isLoggedIn}
            onLogout={handleLogout}
          />
        )}

        <main>{children}</main>

        {!isNoHeaderFooter && <Footer setView={setView} />}

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
              setPendingCartCheckoutId(null);
            }}
            onCompleteBooking={handleCompleteBooking}
            onSaveDraftBooking={handleSaveDraftBooking}
          />
        )}

        {activeToast && (
          <div
            id="global-toast-notification"
            className="fixed bottom-6 right-6 z-[200] flex items-center gap-3 bg-neutral-900 border border-neutral-800 text-white rounded-2xl px-5 py-4 shadow-xl shadow-black/45 animate-fade select-none max-w-sm"
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
              <p className="text-xs font-bold text-neutral-200">
                {activeToast.message}
              </p>
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
    </AppContext.Provider>
  );
}
