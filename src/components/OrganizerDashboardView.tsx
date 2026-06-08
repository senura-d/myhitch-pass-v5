"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import OrganiserPlanSelectView from "./OrganiserPlanSelectView";
import { Event, EventCategory } from "../types";
import {
  LayoutDashboard, PlusCircle, CalendarDays, Wallet, Settings, LogOut,
  Ticket, TrendingUp, Calendar, Pencil, Eye, Trash2, Plus, ArrowLeft,
  Upload, Sparkles, X, ChevronDown, Users, Search, Filter,
  CheckCircle2, Clock, DollarSign, AlertCircle, Loader2,
  Shield, CreditCard, MapPin, Mail, Phone, Globe,
  Building2, ChevronRight, Zap, Star, Menu, Bell, Maximize2,
  Activity, RefreshCw, HelpCircle, Check,
} from "lucide-react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import API from "../lib/api";

/* ─── Types ─── */
interface OrganizerStats {
  totalEvents: number;
  activeEvents: number;
  totalTicketsSold: number;
  totalRevenue: number;
  recentEvents: { id: string; title: string; status: string; date: string; soldTickets: number; totalTickets: number }[];
}

interface OrganizerDashboardViewProps {
  activeEvents: Event[];
  onAddEvent: (ev: Event) => void;
  userProfile: { name: string; email: string };
  selectedPlan?: string;
  stats?: OrganizerStats | null;
}

type NavTab = "dashboard" | "create" | "events" | "attendees" | "payouts" | "settings";

interface Tier    { id: string; name: string; price: string; capacity: string }
interface Attendee { id: string; name: string; email: string; event: string; tier: string; date: string; checkedIn: boolean }
interface Txn     { id: string; event: string; amount: number; fee: number; net: number; date: string; status: "paid" | "pending" | "processing" }

/* ─── Constants ─── */
const BRAND = "#00aeef";
const SIDEBAR_BG = "#0d1b2a";

const STATUS: Record<string, { bg: string; text: string; dot: string; border: string }> = {
  Active:     { bg: "bg-emerald-50",  text: "text-emerald-700", dot: "bg-emerald-500", border: "border-emerald-200" },
  Draft:      { bg: "bg-amber-50",    text: "text-amber-700",   dot: "bg-amber-400",   border: "border-amber-200"   },
  Ended:      { bg: "bg-slate-100",   text: "text-slate-500",   dot: "bg-slate-400",   border: "border-slate-200"   },
  "Sold Out": { bg: "bg-rose-50",     text: "text-rose-600",    dot: "bg-rose-400",    border: "border-rose-200"    },
};

function evStatus(ev: Event & { status?: string }) {
  if (ev.status) return ev.status;
  if (ev.soldTickets >= ev.totalTickets) return "Sold Out";
  return "Active";
}

const PLAN_LABELS: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  starter: { label: "Starter", color: "bg-slate-100 text-slate-600",   icon: <Zap className="h-3 w-3" />     },
  growth:  { label: "Growth",  color: "bg-[#00aeef]/10 text-[#00aeef]", icon: <Sparkles className="h-3 w-3" /> },
  pro:     { label: "Pro",     color: "bg-slate-900 text-white",        icon: <Star className="h-3 w-3" />    },
};


const BAR_DATA = [
  { label: "Jan", val: 38 },
  { label: "Feb", val: 22 },
  { label: "Mar", val: 55 },
  { label: "Apr", val: 40 },
  { label: "May", val: 72 },
  { label: "Jun", val: 88 },
];

const PLAN_KEY = "myhitch_organiser_plan";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? "");

/* ── Stripe payment form (rendered inside Elements) ─────────────────────── */
function PaymentForm({ onSuccess, onCancel }: { onSuccess: (id: string) => void; onCancel: () => void }) {
  const stripe   = useStripe();
  const elements = useElements();
  const [paying, setPaying] = useState(false);
  const [err,    setErr]    = useState("");

  const handlePay = async () => {
    if (!stripe || !elements) return;
    setPaying(true); setErr("");
    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: window.location.href },
      redirect: "if_required",
    });
    if (error) { setErr(error.message ?? "Payment failed."); setPaying(false); return; }
    if (paymentIntent?.status === "succeeded") { onSuccess(paymentIntent.id); }
    else { setErr("Payment was not completed. Please try again."); setPaying(false); }
  };

  return (
    <div className="space-y-4">
      <PaymentElement />
      {err && (
        <div className="flex items-start gap-2 text-xs text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2.5">
          <AlertCircle className="h-3.5 w-3.5 shrink-0 mt-0.5" />{err}
        </div>
      )}
      <div className="flex gap-3 pt-1">
        <button type="button" onClick={onCancel}
          className="flex-1 border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-sm py-2.5 rounded-xl transition-colors">
          Cancel
        </button>
        <button type="button" onClick={handlePay} disabled={paying || !stripe}
          className="flex-1 flex items-center justify-center gap-2 text-white font-bold text-sm py-2.5 rounded-xl shadow-md disabled:opacity-50 transition-all"
          style={{ background: "linear-gradient(135deg, #00aeef, #0077b6)" }}>
          {paying ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          {paying ? "Processing…" : "Pay A$150"}
        </button>
      </div>
    </div>
  );
}

function PackagePaymentModal({ clientSecret, onSuccess, onClose }: {
  clientSecret: string; onSuccess: (id: string) => void; onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-7 pt-6 pb-4 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-sky-100 flex items-center justify-center text-sky-500">
              <Zap className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900">Complete Package Payment</h2>
              <p className="text-xs text-slate-400 font-medium">One-time fee to publish your event</p>
            </div>
          </div>
          <button onClick={onClose} className="h-8 w-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable body — two columns on large screens */}
        <div className="flex flex-col md:flex-row flex-1 min-h-0 overflow-hidden">

          {/* Left — order summary */}
          <div className="md:w-64 shrink-0 bg-slate-50 border-b md:border-b-0 md:border-r border-slate-100 p-6 space-y-5 overflow-y-auto">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Order Summary</p>
              <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-lg bg-sky-100 flex items-center justify-center text-sky-500 shrink-0">
                    <Zap className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-black text-slate-900">Unlimited Package</p>
                    <p className="text-[11px] text-slate-400 font-medium">Per event, one-time fee</p>
                  </div>
                </div>
                <div className="border-t border-slate-100 pt-3 space-y-1.5">
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>Package fee</span><span className="font-semibold">A$150.00</span>
                  </div>
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>GST (incl.)</span><span className="font-semibold">A$13.64</span>
                  </div>
                  <div className="flex justify-between text-sm font-black text-slate-900 pt-1 border-t border-slate-100">
                    <span>Total</span><span>A$150.00</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">What you get</p>
              {[
                "Unlimited ticket sales for this event",
                "No per-ticket platform fee",
                "Priority listing & featured badge eligible",
                "Advanced analytics & attendee exports",
                "Dedicated organiser support",
              ].map(f => (
                <div key={f} className="flex items-start gap-2 text-xs text-slate-600">
                  <Check className="h-3.5 w-3.5 text-emerald-500 mt-0.5 shrink-0" />
                  <span>{f}</span>
                </div>
              ))}
            </div>

            <div className="rounded-xl p-3 bg-white border border-slate-200 flex items-start gap-2">
              <Shield className="h-4 w-4 text-sky-500 shrink-0 mt-0.5" />
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Payments are secured and processed by <span className="font-bold text-slate-700">Stripe</span>. MYHitch never stores your card details.
              </p>
            </div>
          </div>

          {/* Right — Stripe form */}
          <div className="flex-1 p-6 overflow-y-auto">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Payment Details</p>
            <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: "stripe", variables: { borderRadius: "10px", colorPrimary: "#00aeef" } } }}>
              <PaymentForm onSuccess={onSuccess} onCancel={onClose} />
            </Elements>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OrganizerDashboardView({
  activeEvents, onAddEvent, userProfile, stats,
}: OrganizerDashboardViewProps) {

  const [tab, setTab] = useState<NavTab>("dashboard");
  const [plan, setPlan]             = useState<string | null>(null);
  const [showPlanSelect, setShowPlanSelect] = useState(false);

  useEffect(() => {
    const saved = typeof window !== "undefined" ? localStorage.getItem(PLAN_KEY) : null;
    setPlan(saved);
  }, []);

  const goToCreate = () => {
    if (!plan) { setShowPlanSelect(true); return; }
    setTab("create");
  };
  const handlePlanChosen = (planId: string) => {
    localStorage.setItem(PLAN_KEY, planId);
    setPlan(planId);
    setShowPlanSelect(false);
    setTab("create");
  };

  const [events, setEvents] = useState<Event[]>(activeEvents);

  const [attendees, setAttendees]       = useState<Attendee[]>([]);
  const [attendeesLoading, setAttendeesLoading] = useState(false);

  const [payouts, setPayouts] = useState<{
    available: number; pending: number; processing: number; total: number;
    transactions: Txn[];
  }>({ available: 0, pending: 0, processing: 0, total: 0, transactions: [] });
  const [payoutsLoading, setPayoutsLoading] = useState(false);

  const [publishLoading,  setPublishLoading]  = useState(false);
  const [publishError,    setPublishError]    = useState("");
  const [publishSuccess,  setPublishSuccess]  = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [pendingClientSecret, setPendingClientSecret] = useState("");
  const [pendingAsDraft, setPendingAsDraft]   = useState(false);
  const [bannerUploading, setBannerUploading] = useState(false);
  const [bannerError,     setBannerError]     = useState("");
  const [attSearch, setAttSearch] = useState("");
  const [attFilter, setAttFilter] = useState("All");
  const [evSearch, setEvSearch]   = useState("");
  const [evStatusFilter, setEvStatusFilter] = useState("All");

  const [cTitle, setCTitle] = useState("");
  const [cDesc,  setCDesc]  = useState("");
  const [cDate,  setCDate]  = useState("");
  const [cTime,  setCTime]  = useState("");
  const [cVenue, setCVenue] = useState("");
  const [cCat,   setCCat]   = useState<EventCategory | "">("");
  const [cBanner, setCBanner] = useState<string | null>(null);
  const [cTiers,     setCTiers]     = useState<Tier[]>([{ id: "t1", name: "", price: "", capacity: "" }]);
  const [cEndDate,   setCEndDate]   = useState("");
  const [cEndTime,   setCEndTime]   = useState("");
  const [cCity,      setCCity]      = useState("");
  const [cHighlights, setCHighlights] = useState<{ id: string; text: string }[]>([{ id: "h1", text: "" }]);
  const [cFaqs,      setCFaqs]      = useState<{ id: string; q: string; a: string }[]>([{ id: "f1", q: "", a: "" }]);
  const [cEventPackage, setCEventPackage] = useState<"unlimited" | "flex" | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const [sName,  setSName]  = useState(userProfile.name);
  const [sEmail, setSEmail] = useState(userProfile.email);
  const [sBio,   setSBio]   = useState("We create unforgettable event experiences across Australia.");
  const [sPhone, setSPhone] = useState("+61 400 000 000");
  const [sWeb,   setSWeb]   = useState("myhitch.com.au");
  const [notifSales, setNotifSales] = useState(true);
  const [notifNew,   setNotifNew]   = useState(true);
  const [notifPay,   setNotifPay]   = useState(false);

  const derivedStats = useMemo(() => ({
    total:    events.length,
    upcoming: events.filter(e => evStatus(e as any) !== "Ended").length,
    sold:     events.reduce((a, e) => a + e.soldTickets, 0),
    revenue:  events.reduce((a, e) => a + e.soldTickets * e.price, 0),
  }), [events]);

  const cs = {
    total:    stats?.totalEvents      ?? derivedStats.total,
    upcoming: stats?.activeEvents     ?? derivedStats.upcoming,
    sold:     stats?.totalTicketsSold ?? derivedStats.sold,
    revenue:  stats?.totalRevenue     ?? derivedStats.revenue,
  };

  const filteredEvents = useMemo(() => events.filter(e =>
    (evSearch === "" || e.title.toLowerCase().includes(evSearch.toLowerCase())) &&
    (evStatusFilter === "All" || evStatus(e as any) === evStatusFilter)
  ), [events, evSearch, evStatusFilter]);

  const filteredAtt = useMemo(() => attendees.filter(a =>
    (attFilter === "All" || a.event === attFilter) &&
    (attSearch === "" || a.name.toLowerCase().includes(attSearch.toLowerCase()) || a.email.toLowerCase().includes(attSearch.toLowerCase()))
  ), [attendees, attSearch, attFilter]);

  const firstName = userProfile.name.split(" ")[0];
  const initials  = userProfile.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
  const planInfo  = PLAN_LABELS[plan ?? "growth"] ?? PLAN_LABELS.growth;
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 18) return "Good afternoon";
    return "Good evening";
  })();

  const PAGE_LABELS: Record<NavTab, string> = {
    dashboard: "Dashboard", create: "Create Event", events: "My Events",
    attendees: "Attendees", payouts: "Payouts", settings: "Settings",
  };

  // ── Fetch attendees when tab opens ──────────────────────────────────────────
  useEffect(() => {
    if (tab !== "attendees") return;
    const token = localStorage.getItem("organiser_token") || localStorage.getItem("myhitch_token");
    if (!token) return;
    setAttendeesLoading(true);
    fetch(`${API}/organizer/attendees`, {
      headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
    })
      .then(r => r.json())
      .then(j => { if (j.data) setAttendees(j.data); })
      .catch(() => {})
      .finally(() => setAttendeesLoading(false));
  }, [tab]);

  // ── Fetch payouts when tab opens ─────────────────────────────────────────────
  useEffect(() => {
    if (tab !== "payouts") return;
    const token = localStorage.getItem("organiser_token") || localStorage.getItem("myhitch_token");
    if (!token) return;
    setPayoutsLoading(true);
    fetch(`${API}/organizer/payouts`, {
      headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
    })
      .then(r => r.json())
      .then(j => { if (j.data) setPayouts(j.data); })
      .catch(() => {})
      .finally(() => setPayoutsLoading(false));
  }, [tab]);

  const resetCreate = () => {
    setCTitle(""); setCDesc(""); setCDate(""); setCTime(""); setCVenue(""); setCCat("");
    setCBanner(null); setCTiers([{ id: "t1", name: "", price: "", capacity: "" }]);
    setCEndDate(""); setCEndTime(""); setCCity("");
    setCHighlights([{ id: "h1", text: "" }]);
    setCFaqs([{ id: "f1", q: "", a: "" }]);
    setCEventPackage(null);
    setPublishError(""); setPublishSuccess(false); setBannerError("");
  };

  // ── Submit event to API (called after payment or directly for draft/flex) ───
  const submitEventToAPI = async (asDraft: boolean, paymentIntentId: string | null) => {
    const token = localStorage.getItem("organiser_token") || localStorage.getItem("myhitch_token");
    if (!token) { setPublishError("Not authenticated."); return; }

    const catMap: Record<string, string> = {
      "Concerts": "concerts", "Festivals": "festivals", "Sports": "sports",
      "Theatre & Arts": "theatre", "Community & Tech": "community",
    };
    const startDt = cDate ? `${cDate}T${cTime || "00:00"}:00` : null;
    const endDt   = cEndDate ? `${cEndDate}T${cEndTime || "00:00"}:00` : null;

    const payload = {
      title:             cTitle,
      description:       cDesc || null,
      location:          cVenue,
      city:              cCity || null,
      category:          catMap[cCat] ?? "concerts",
      start_datetime:    startDt,
      end_datetime:      endDt ?? undefined,
      time:              cTime || null,
      cover_image:       cBanner || null,
      status:            asDraft ? "draft" : "published",
      highlights:        cHighlights.map(h => h.text).filter(Boolean),
      faqs:              cFaqs.filter(f => f.q.trim()).map(f => ({ q: f.q, a: f.a })),
      package_type:      cEventPackage ?? "flex",
      payment_intent_id: paymentIntentId ?? undefined,
      ticket_types:      cTiers.filter(t => t.name.trim()).map(t => ({
        name:           t.name,
        price_aud:      Number(t.price) || 0,
        quantity_total: Number(t.capacity) || 1,
      })),
    };

    const res  = await fetch(`${API}/organizer/events`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    const json = await res.json();

    if (!res.ok) throw new Error(json.message ?? "Failed to create event.");

    const newEv = json.data as Event;
    onAddEvent(newEv);
    setEvents(p => [newEv, ...p]);
    setPublishSuccess(true);
    setTimeout(() => { setPublishSuccess(false); resetCreate(); setTab("events"); }, 2000);
  };

  // ── Main publish handler ─────────────────────────────────────────────────────
  const handlePublish = async (asDraft: boolean) => {
    if (!cTitle.trim() || publishLoading) return;
    setPublishError(""); setPublishLoading(true);

    try {
      // Unlimited + publish → need payment first
      if (cEventPackage === "unlimited" && !asDraft) {
        const token = localStorage.getItem("organiser_token") || localStorage.getItem("myhitch_token");
        const res   = await fetch(`${API}/organizer/package/create-intent`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
        });
        const json = await res.json();
        if (!res.ok) { setPublishError(json.message ?? "Failed to initiate payment."); return; }
        setPendingClientSecret(json.client_secret);
        setPendingAsDraft(false);
        setShowPaymentModal(true);
        return; // wait for modal to confirm
      }
      await submitEventToAPI(asDraft, null);
    } catch (e: unknown) {
      setPublishError(e instanceof Error ? e.message : "Network error. Please try again.");
    } finally {
      setPublishLoading(false);
    }
  };

  // ── Called by PaymentModal on success ────────────────────────────────────────
  const handlePaymentSuccess = async (intentId: string) => {
    setShowPaymentModal(false);
    setPublishLoading(true);
    try {
      await submitEventToAPI(pendingAsDraft, intentId);
    } catch (e: unknown) {
      setPublishError(e instanceof Error ? e.message : "Event creation failed after payment.");
    } finally {
      setPublishLoading(false);
    }
  };

  // ── Banner validation + upload ───────────────────────────────────────────────
  const handleBannerFile = async (file: File) => {
    setBannerError("");
    if (!["image/jpeg", "image/jpg", "image/png"].includes(file.type)) {
      setBannerError("Only PNG or JPG images are accepted."); return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setBannerError("Image must be smaller than 5 MB."); return;
    }
    const dims = await new Promise<{ w: number; h: number }>(resolve => {
      const img = new window.Image();
      img.onload  = () => resolve({ w: img.naturalWidth, h: img.naturalHeight });
      img.onerror = () => resolve({ w: 0, h: 0 });
      img.src = URL.createObjectURL(file);
    });
    if (dims.w < 800 || dims.h < 400) {
      setBannerError(`Minimum 800×400 px required. Your image is ${dims.w}×${dims.h} px.`); return;
    }
    setBannerUploading(true);
    try {
      const token = localStorage.getItem("organiser_token") || localStorage.getItem("myhitch_token");
      const form  = new FormData(); form.append("banner", file);
      const res   = await fetch(`${API}/organizer/events/upload-banner`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
        body: form,
      });
      const json = await res.json();
      if (!res.ok) { setBannerError(json.message ?? "Upload failed."); return; }
      setCBanner(json.url);
    } catch { setBannerError("Upload failed. Please try again."); }
    finally    { setBannerUploading(false); }
  };

  const toggleCheckIn = async (id: string) => {
    const token = localStorage.getItem("organiser_token") || localStorage.getItem("myhitch_token");
    try {
      const res  = await fetch(`${API}/organizer/attendees/${id}/checkin`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
      });
      const json = await res.json();
      if (res.ok) setAttendees(p => p.map(a => a.id === id ? { ...a, checkedIn: json.data.checkedIn } : a));
    } catch {}
  };

  const deleteEvent = async (id: string) => {
    if (!confirm("Remove this event?")) return;
    const token = localStorage.getItem("organiser_token") || localStorage.getItem("myhitch_token");
    try {
      await fetch(`${API}/organizer/events/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
      });
      setEvents(p => p.filter(e => e.id !== id));
    } catch {}
  };

  const NAV: { id: NavTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: "dashboard",  label: "Overview Dashboard", icon: <LayoutDashboard className="h-4 w-4" /> },
    { id: "create",     label: "Create Event",        icon: <PlusCircle className="h-4 w-4" />,      badge: "NEW" },
    { id: "events",     label: "My Events",           icon: <CalendarDays className="h-4 w-4" />     },
    { id: "attendees",  label: "Attendees",           icon: <Users className="h-4 w-4" />            },
    { id: "payouts",    label: "Payouts",             icon: <Wallet className="h-4 w-4" />           },
    { id: "settings",   label: "Account Settings",    icon: <Settings className="h-4 w-4" />         },
  ];

  if (showPlanSelect) return <OrganiserPlanSelectView onPlanSelected={handlePlanChosen} />;

  return (
    <div className="flex flex-col min-h-screen font-sans bg-[#f0f4f8]">

      {/* ══ TOP NAV ══ */}
      <header className="h-[60px] shrink-0 flex items-center gap-4 px-5 z-30 sticky top-0 shadow-lg"
        style={{ background: `linear-gradient(90deg, ${SIDEBAR_BG} 0%, #0f2744 100%)` }}>
        {/* Logo */}
        <div className="shrink-0 bg-white/10 rounded-xl px-3 py-1.5 flex items-center backdrop-blur-sm border border-white/10">
          <img src="/logo.png" alt="MYHitch PASS" className="h-6 w-auto object-contain brightness-0 invert" onError={e => { (e.currentTarget as HTMLImageElement).style.display="none"; }} />
          <span className="text-white font-black text-sm ml-2 tracking-tight">MYHitch</span>
        </div>
        {/* Hamburger */}
        <button onClick={() => setSidebarOpen(o => !o)}
          className="h-8 w-8 rounded-lg border border-white/15 flex items-center justify-center text-white/70 hover:bg-white/10 transition-colors shrink-0">
          <Menu className="h-4 w-4" />
        </button>
        {/* Search */}
        <div className="flex-1 flex justify-center px-4">
          <div className="flex items-center gap-2 bg-white/8 border border-white/12 rounded-full px-4 py-2 w-full max-w-sm focus-within:bg-white/12 transition-colors">
            <Search className="h-3.5 w-3.5 text-white/40 shrink-0" />
            <input type="text" placeholder="Search events, attendees…" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              className="bg-transparent text-sm text-white placeholder-white/30 focus:outline-none w-full" />
          </div>
        </div>
        {/* Right */}
        <div className="flex items-center gap-2 shrink-0">
          <button className="h-8 w-8 rounded-lg flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-colors">
            <Maximize2 className="h-4 w-4" />
          </button>
          <button className="relative h-8 w-8 rounded-lg flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-colors">
            <Bell className="h-4 w-4" />
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500 border border-[#0f2744]" />
          </button>
          <div className="h-px w-px mx-1 bg-white/20" />
          <div className="flex items-center gap-2.5 cursor-pointer group">
            <div className="h-8 w-8 rounded-full text-white text-xs font-black flex items-center justify-center shadow-lg" style={{ background: `linear-gradient(135deg, ${BRAND}, #0077b6)` }}>
              {initials}
            </div>
            <div className="leading-none">
              <p className="text-xs font-bold text-white">{userProfile.name}</p>
              <p className="text-[10px] text-white/40 font-medium">Organiser</p>
            </div>
            <ChevronDown className="h-3.5 w-3.5 text-white/30" />
          </div>
        </div>
      </header>

      {/* ══ BODY ══ */}
      <div className="flex flex-1 min-h-0">

        {/* ═ SIDEBAR ═ */}
        <aside className={`${sidebarOpen ? "w-[235px]" : "w-0 overflow-hidden"} shrink-0 flex flex-col transition-all duration-300 sticky top-[60px] h-[calc(100vh-60px)] overflow-y-auto`}
          style={{ background: `linear-gradient(180deg, ${SIDEBAR_BG} 0%, #0a1628 100%)` }}>

          {/* Plan badge */}
          <div className="px-4 pt-5 pb-3">
            <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest"
              style={{ background: "rgba(0,174,239,0.1)", border: "1px solid rgba(0,174,239,0.2)", color: BRAND }}>
              {planInfo.icon}
              {planInfo.label} Plan
              <span className="ml-auto text-[8px] bg-[#00aeef]/20 px-1.5 py-0.5 rounded-full">Active</span>
            </div>
          </div>

          {/* Nav */}
          <div className="px-3 pb-3 flex-1">
            <p className="text-[9px] font-black uppercase tracking-[0.15em] text-white/25 px-3 mb-2">Main</p>
            <nav className="flex flex-col gap-0.5">
              {NAV.map(item => {
                const active = tab === item.id;
                return (
                  <button key={item.id}
                    onClick={() => item.id === "create" ? goToCreate() : setTab(item.id)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all text-left w-full group relative ${
                      active ? "text-white shadow-lg" : "text-white/45 hover:text-white/80 hover:bg-white/5"
                    }`}
                    style={active ? { background: `linear-gradient(90deg, rgba(0,174,239,0.2), rgba(0,174,239,0.08))`, borderLeft: `2px solid ${BRAND}` } : {}}>
                    <span className={`transition-colors ${active ? "text-[#00aeef]" : "text-white/30 group-hover:text-white/50"}`}>{item.icon}</span>
                    <span className="flex-1 whitespace-nowrap text-[13px]">{item.label}</span>
                    {item.badge && (
                      <span className="text-[8px] font-black uppercase px-1.5 py-0.5 rounded-md" style={{ background: `${BRAND}25`, color: BRAND }}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Logout */}
          <div className="px-4 py-4 border-t border-white/8">
            <button className="flex items-center gap-2.5 text-xs text-white/30 hover:text-red-400 font-semibold transition-colors w-full px-2 py-2 rounded-xl hover:bg-red-500/5">
              <LogOut className="h-4 w-4" />
              <span>Log Out</span>
            </button>
          </div>
        </aside>

        {/* ═ MAIN ═ */}
        <main className="flex-1 min-w-0 overflow-y-auto">

          {/* Breadcrumb sub-header */}
          <div className="bg-white border-b border-slate-100 px-7 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-slate-400 font-semibold">
              <span className="text-slate-500">MYHitch</span>
              <ChevronRight className="h-3 w-3" />
              <span style={{ color: BRAND }}>{PAGE_LABELS[tab]}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Activity className="h-3.5 w-3.5 text-emerald-500" />
              <span className="text-emerald-600 font-semibold">Live</span>
              <span>·</span>
              <span>All systems operational</span>
            </div>
          </div>

          {/* ─── DASHBOARD ─── */}
          {tab === "dashboard" && (
            <div className="p-7 space-y-6">

              {/* Greeting row */}
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-[22px] font-black text-slate-900 flex items-center gap-2">
                    {greeting}, {firstName} 👋
                  </h1>
                  <p className="text-sm text-slate-400 font-medium mt-0.5">Here's what's happening with your events today.</p>
                </div>
                <div className="flex items-center gap-3">
                  <button className="flex items-center gap-2 text-slate-500 text-xs font-semibold bg-white border border-slate-200 px-4 py-2 rounded-full shadow-sm hover:bg-slate-50 transition-colors">
                    <RefreshCw className="h-3.5 w-3.5" /> Refresh
                  </button>
                  <button onClick={goToCreate}
                    className="flex items-center gap-2 text-white text-sm font-bold px-5 py-2.5 rounded-full shadow-lg hover:opacity-90 transition-all"
                    style={{ background: `linear-gradient(135deg, ${BRAND}, #0077b6)`, boxShadow: `0 4px 14px rgba(0,174,239,0.35)` }}>
                    <Plus className="h-4 w-4" /> Create Event
                  </button>
                </div>
              </div>

              {/* Stat cards */}
              <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
                {[
                  { label: "Total Events",   val: cs.total,                      sub: `${cs.upcoming} upcoming`,    icon: <Calendar className="h-5 w-5" />,      iconBg: "bg-sky-50",     iconColor: "text-sky-500",    border: "border-sky-100"   },
                  { label: "Tickets Sold",   val: cs.sold.toLocaleString(),       sub: "across all events",          icon: <Ticket className="h-5 w-5" />,        iconBg: "bg-violet-50",  iconColor: "text-violet-500", border: "border-violet-100"},
                  { label: "Avg. Ticket",    val: cs.sold > 0 ? `$${Math.round(cs.revenue / cs.sold)}` : "$0", sub: "average ticket value", icon: <DollarSign className="h-5 w-5" />, iconBg: "bg-rose-50", iconColor: "text-rose-500", border: "border-rose-100" },
                  { label: "Upcoming Events",val: cs.upcoming,                    sub: "events scheduled",           icon: <CalendarDays className="h-5 w-5" />,  iconBg: "bg-emerald-50", iconColor: "text-emerald-500",border: "border-emerald-100"},
                ].map(c => (
                  <div key={c.label} className={`bg-white rounded-2xl p-5 shadow-sm border ${c.border} flex items-center gap-4 hover:shadow-md transition-shadow`}>
                    <div className={`h-12 w-12 rounded-xl ${c.iconBg} ${c.iconColor} flex items-center justify-center shrink-0`}>{c.icon}</div>
                    <div>
                      <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">{c.label}</p>
                      <p className="text-2xl font-black text-slate-900 leading-none mt-0.5">{c.val}</p>
                      <p className="text-[11px] text-slate-400 font-medium mt-0.5">{c.sub}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Chart + Top Events */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                {/* Bar chart */}
                <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                  <div className="flex items-center justify-between mb-5">
                    <div>
                      <h3 className="text-sm font-black text-slate-900">Revenue Report</h3>
                      <p className="text-xs text-slate-400 font-medium mt-0.5">Monthly ticket revenue</p>
                    </div>
                    <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-full px-3 py-1.5 text-xs font-semibold text-slate-500 cursor-pointer">
                      <Calendar className="h-3 w-3" /> Last 6 Months
                      <ChevronDown className="h-3 w-3" />
                    </div>
                  </div>
                  {/* Bar chart */}
                  <div className="h-44 flex items-end gap-3 px-2">
                    {BAR_DATA.map((d, i) => {
                      const maxVal = Math.max(...BAR_DATA.map(x => x.val));
                      const pct = (d.val / maxVal) * 100;
                      const isLast = i === BAR_DATA.length - 1;
                      return (
                        <div key={d.label} className="flex-1 flex flex-col items-center gap-1.5">
                          <span className="text-[10px] font-bold text-slate-400">${Math.round(d.val * cs.revenue / 100 / 100)}</span>
                          <div className="w-full rounded-t-lg relative overflow-hidden" style={{ height: `${Math.max(pct, 8)}%`, background: isLast ? `linear-gradient(180deg, ${BRAND}, #0077b6)` : "linear-gradient(180deg, #bfdbfe, #93c5fd)", boxShadow: isLast ? `0 4px 12px rgba(0,174,239,0.3)` : "none" }}>
                            {isLast && <div className="absolute inset-0 bg-white/10" />}
                          </div>
                          <span className="text-[10px] text-slate-400 font-semibold">{d.label}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Top events + quick actions */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-black text-slate-900">Top Events</h3>
                    <button onClick={() => setTab("events")} className="text-xs font-bold text-[#00aeef] hover:underline">See all</button>
                  </div>
                  <div className="space-y-3">
                    {events.slice(0, 4).map(ev => {
                      const rev = ev.soldTickets * ev.price;
                      return (
                        <div key={ev.id} className="flex items-center gap-3">
                          <img src={ev.image} alt={ev.title} className="h-9 w-9 rounded-lg object-cover flex-shrink-0" />
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-bold text-slate-800 truncate">{ev.title}</p>
                            <p className="text-[10px] text-slate-400">{ev.soldTickets} tickets</p>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="text-xs font-black text-slate-900">A${rev.toLocaleString()}</p>
                            <p className="text-[10px] text-slate-400">{events.indexOf(ev) === 0 ? "Top earner" : `${ev.soldTickets} sold`}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="pt-3 border-t border-slate-50 space-y-1.5">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Quick Actions</p>
                    {[
                      { label: "Create New Event",  icon: <PlusCircle className="h-3.5 w-3.5" />, action: goToCreate },
                      { label: "Check Attendees",   icon: <Users className="h-3.5 w-3.5" />,     action: () => setTab("attendees") },
                      { label: "View Payouts",      icon: <DollarSign className="h-3.5 w-3.5" />, action: () => setTab("payouts") },
                    ].map(a => (
                      <button key={a.label} onClick={a.action}
                        className="w-full flex items-center gap-2.5 text-xs font-semibold text-slate-600 hover:text-[#00aeef] bg-slate-50 hover:bg-sky-50 px-3 py-2 rounded-xl transition-colors text-left">
                        <span style={{ color: BRAND }}>{a.icon}</span>{a.label}
                        <ChevronRight className="h-3 w-3 ml-auto text-slate-300" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Recent events table */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-50">
                  <div>
                    <h2 className="text-sm font-black text-slate-900">My Events</h2>
                    <p className="text-xs text-slate-400 font-medium mt-0.5">Recent events overview</p>
                  </div>
                  <button onClick={goToCreate} className="flex items-center gap-1.5 text-white text-xs font-bold px-4 py-2 rounded-full shadow-sm"
                    style={{ background: `linear-gradient(135deg, ${BRAND}, #0077b6)` }}>
                    <Plus className="h-3.5 w-3.5" /> New Event
                  </button>
                </div>
                <EventsTable events={events.slice(0, 4)} onDelete={deleteEvent} brandColor={BRAND} onEdit={() => setTab("events")} />
              </div>
            </div>
          )}

          {/* ─── CREATE EVENT ─── */}
          {tab === "create" && (
            <div className="p-7 space-y-6">
              <div>
                <button onClick={() => { resetCreate(); setTab("dashboard"); }}
                  className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-[#00aeef] font-semibold transition-colors mb-4">
                  <ArrowLeft className="h-4 w-4" /> Back to Dashboard
                </button>
                <h1 className="text-2xl font-black text-slate-900">
                  {cEventPackage ? "Create New Event" : "Choose Your Event Package"}
                </h1>
                <p className="text-sm text-slate-400 font-medium mt-1">
                  {cEventPackage
                    ? "Fill in all the event details below and publish when ready."
                    : "Select a pricing package for this event before continuing."}
                </p>
              </div>

              {/* ── STEP 1: Package Selection ── */}
              {!cEventPackage && (
                <div className="max-w-2xl space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Unlimited */}
                    <button type="button" onClick={() => setCEventPackage("unlimited")}
                      className="bg-white border-2 border-slate-100 hover:border-[#00aeef] rounded-2xl p-6 text-left transition-all group shadow-sm hover:shadow-md active:scale-[0.98]">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="h-10 w-10 rounded-xl bg-sky-50 flex items-center justify-center text-sky-500 group-hover:bg-sky-100 transition-colors">
                          <Zap className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-[9px] font-black uppercase tracking-widest text-[#00aeef]">Fixed Fee Per Event</p>
                          <h3 className="text-sm font-black text-slate-900 leading-tight">MYHitchPass Unlimited</h3>
                        </div>
                      </div>
                      <div className="mb-4 pb-4 border-b border-slate-50">
                        <span className="text-2xl font-black text-slate-900">A$150</span>
                        <span className="text-xs text-slate-400 font-bold ml-1">/ event</span>
                        <p className="text-[10px] text-slate-400 font-medium mt-0.5">One-time fee charged when publishing.</p>
                      </div>
                      <ul className="space-y-2">
                        {["Unlimited tickets — no per-ticket fee", "QR check-in & automation included", "Best for large ticket volumes"].map((f, i) => (
                          <li key={i} className="flex items-start gap-2 text-xs text-slate-600 font-medium">
                            <Check className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />{f}
                          </li>
                        ))}
                      </ul>
                      <div className="mt-5 w-full py-2.5 rounded-xl text-xs font-black text-white text-center"
                        style={{ background: `linear-gradient(135deg, #00aeef, #0077b6)` }}>
                        Select Unlimited →
                      </div>
                    </button>

                    {/* Flex */}
                    <button type="button" onClick={() => setCEventPackage("flex")}
                      className="bg-white border-2 border-slate-100 hover:border-emerald-400 rounded-2xl p-6 text-left transition-all group shadow-sm hover:shadow-md active:scale-[0.98]">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="h-10 w-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-500 group-hover:bg-emerald-100 transition-colors">
                          <Ticket className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-[9px] font-black uppercase tracking-widest text-emerald-600">No Upfront Fee</p>
                          <h3 className="text-sm font-black text-slate-900 leading-tight">MYHitchPass Flex</h3>
                        </div>
                      </div>
                      <div className="mb-4 pb-4 border-b border-slate-50">
                        <span className="text-2xl font-black text-slate-900">A$0.50</span>
                        <span className="text-xs text-slate-400 font-bold ml-1">/ ticket sold</span>
                        <p className="text-[10px] text-slate-400 font-medium mt-0.5">Added to the buyer-facing ticket price.</p>
                      </div>
                      <ul className="space-y-2">
                        {["No upfront platform fee", "Pay only as you sell tickets", "Best for smaller events"].map((f, i) => (
                          <li key={i} className="flex items-start gap-2 text-xs text-slate-600 font-medium">
                            <Check className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />{f}
                          </li>
                        ))}
                      </ul>
                      <div className="mt-5 w-full py-2.5 rounded-xl text-xs font-black text-emerald-700 bg-emerald-50 border border-emerald-200 text-center group-hover:bg-emerald-100 transition-colors">
                        Select Flex →
                      </div>
                    </button>
                  </div>
                  <p className="text-xs text-slate-400 font-medium text-center">
                    Not sure which to pick?{" "}
                    <a href="/pricing" target="_blank" rel="noopener" className="font-bold hover:underline" style={{ color: BRAND }}>
                      View full pricing details →
                    </a>
                  </p>
                </div>
              )}

              {/* ── STEP 2: Full Event Form ── */}
              {cEventPackage && (
                <div className="flex gap-6 items-start">
                  <div className="flex-1 min-w-0 space-y-5">

                    {/* Package badge */}
                    <div className={`flex items-center gap-2 w-fit text-xs font-bold px-3 py-2 rounded-xl border ${
                      cEventPackage === "unlimited" ? "bg-sky-50 border-sky-100 text-sky-700" : "bg-emerald-50 border-emerald-100 text-emerald-700"
                    }`}>
                      {cEventPackage === "unlimited" ? <Zap className="h-3.5 w-3.5" /> : <Ticket className="h-3.5 w-3.5" />}
                      Package: {cEventPackage === "unlimited" ? "Unlimited — A$150 flat" : "Flex — A$0.50 / ticket"}
                      <button type="button" onClick={() => setCEventPackage(null)}
                        className="ml-1 opacity-60 hover:opacity-100 transition-opacity">
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    {/* Event Details */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-5">
                      <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                        <CalendarDays className="h-4 w-4 text-[#00aeef]" /> Event Details
                      </h2>
                      <Field label="Event Name" required>
                        <input type="text" placeholder="e.g. Summer Music Festival 2026" value={cTitle} onChange={e => setCTitle(e.target.value)}
                          className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-[#00aeef]/20 focus:border-[#00aeef] transition-all" />
                      </Field>
                      <Field label="Description" required>
                        <textarea rows={4} placeholder="Describe your event…" value={cDesc} onChange={e => setCDesc(e.target.value)}
                          className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-[#00aeef]/20 focus:border-[#00aeef] transition-all resize-none" />
                      </Field>
                      <div className="grid grid-cols-2 gap-4">
                        <Field label="Start Date" required>
                          <input type="date" value={cDate} onChange={e => setCDate(e.target.value)}
                            className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#00aeef]/20 focus:border-[#00aeef] transition-all" />
                        </Field>
                        <Field label="Start Time" required>
                          <input type="time" value={cTime} onChange={e => setCTime(e.target.value)}
                            className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#00aeef]/20 focus:border-[#00aeef] transition-all" />
                        </Field>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <Field label="End Date">
                          <input type="date" value={cEndDate} onChange={e => setCEndDate(e.target.value)}
                            className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#00aeef]/20 focus:border-[#00aeef] transition-all" />
                        </Field>
                        <Field label="End Time">
                          <input type="time" value={cEndTime} onChange={e => setCEndTime(e.target.value)}
                            className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#00aeef]/20 focus:border-[#00aeef] transition-all" />
                        </Field>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <Field label="Venue / Location" required>
                          <div className="relative">
                            <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
                            <input type="text" placeholder="e.g. Federation Square" value={cVenue} onChange={e => setCVenue(e.target.value)}
                              className="w-full border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-800 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-[#00aeef]/20 focus:border-[#00aeef] transition-all" />
                          </div>
                        </Field>
                        <Field label="City" required>
                          <input type="text" placeholder="e.g. Melbourne" value={cCity} onChange={e => setCCity(e.target.value)}
                            className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-[#00aeef]/20 focus:border-[#00aeef] transition-all" />
                        </Field>
                      </div>
                      <Field label="Category" required>
                        <div className="relative">
                          <select value={cCat} onChange={e => setCCat(e.target.value as EventCategory)}
                            className="w-full appearance-none border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-[#00aeef]/20 focus:border-[#00aeef] transition-all cursor-pointer pr-10">
                            <option value="">Select category…</option>
                            {Object.values(EventCategory).map(c => <option key={c} value={c}>{c}</option>)}
                          </select>
                          <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                        </div>
                      </Field>
                    </div>

                    {/* Experience Highlights */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                            <Sparkles className="h-4 w-4 text-[#00aeef]" /> Experience Highlights
                          </h2>
                          <p className="text-xs text-slate-400 font-medium mt-0.5">Short bullet points shown on the event page.</p>
                        </div>
                        <button type="button"
                          onClick={() => setCHighlights(p => [...p, { id: `h${Date.now()}`, text: "" }])}
                          className="flex items-center gap-1.5 text-sm font-bold transition-colors shrink-0" style={{ color: BRAND }}>
                          <Plus className="h-4 w-4" /> Add
                        </button>
                      </div>
                      <div className="space-y-3">
                        {cHighlights.map((h, i) => (
                          <div key={h.id} className="flex items-center gap-3">
                            <div className="h-2 w-2 rounded-full shrink-0" style={{ background: BRAND }} />
                            <input
                              placeholder={["3 stages", "International headliners", "Food & drink village", "VIP experience"][i % 4]}
                              value={h.text}
                              onChange={e => setCHighlights(p => p.map(x => x.id === h.id ? { ...x, text: e.target.value } : x))}
                              className="flex-1 border border-slate-200 rounded-xl px-3 py-2.5 text-sm placeholder-slate-300 focus:outline-none focus:border-[#00aeef] focus:ring-2 focus:ring-[#00aeef]/15 transition-all" />
                            <button type="button"
                              onClick={() => cHighlights.length > 1 && setCHighlights(p => p.filter(x => x.id !== h.id))}
                              disabled={cHighlights.length === 1}
                              className="text-slate-300 hover:text-red-400 disabled:opacity-30 transition-colors shrink-0">
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Ticket Types */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-4">
                      <div className="flex items-center justify-between">
                        <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                          <Ticket className="h-4 w-4 text-[#00aeef]" /> Ticket Types
                        </h2>
                        <button type="button"
                          onClick={() => setCTiers(p => [...p, { id: `t${Date.now()}`, name: "", price: "", capacity: "" }])}
                          className="flex items-center gap-1.5 text-sm font-bold transition-colors" style={{ color: BRAND }}>
                          <Plus className="h-4 w-4" /> Add Type
                        </button>
                      </div>
                      <div className="grid grid-cols-12 gap-3 text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">
                        <span className="col-span-5">Type Name</span>
                        <span className="col-span-3">Price (A$)</span>
                        <span className="col-span-3">Capacity</span>
                        <span className="col-span-1" />
                      </div>
                      {cTiers.map((t, i) => (
                        <div key={t.id} className="grid grid-cols-12 gap-3 items-center">
                          <input placeholder={i === 0 ? "General Admission" : "e.g. VIP"} value={t.name}
                            onChange={e => setCTiers(p => p.map(x => x.id === t.id ? { ...x, name: e.target.value } : x))}
                            className="col-span-5 border border-slate-200 rounded-xl px-3 py-2.5 text-sm placeholder-slate-300 focus:outline-none focus:border-[#00aeef] focus:ring-2 focus:ring-[#00aeef]/15 transition-all" />
                          <input type="number" min="0" placeholder="0.00" value={t.price}
                            onChange={e => setCTiers(p => p.map(x => x.id === t.id ? { ...x, price: e.target.value } : x))}
                            className="col-span-3 border border-slate-200 rounded-xl px-3 py-2.5 text-sm placeholder-slate-300 focus:outline-none focus:border-[#00aeef] transition-all" />
                          <input type="number" min="1" placeholder="100" value={t.capacity}
                            onChange={e => setCTiers(p => p.map(x => x.id === t.id ? { ...x, capacity: e.target.value } : x))}
                            className="col-span-3 border border-slate-200 rounded-xl px-3 py-2.5 text-sm placeholder-slate-300 focus:outline-none focus:border-[#00aeef] transition-all" />
                          <button type="button"
                            onClick={() => cTiers.length > 1 && setCTiers(p => p.filter(x => x.id !== t.id))}
                            disabled={cTiers.length === 1}
                            className="col-span-1 flex justify-center text-slate-300 hover:text-red-400 disabled:opacity-30 transition-colors">
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* FAQ */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                            <HelpCircle className="h-4 w-4 text-[#00aeef]" /> Frequently Asked Questions
                          </h2>
                          <p className="text-xs text-slate-400 font-medium mt-0.5">Shown on your event page to help attendees.</p>
                        </div>
                        <button type="button"
                          onClick={() => setCFaqs(p => [...p, { id: `f${Date.now()}`, q: "", a: "" }])}
                          className="flex items-center gap-1.5 text-sm font-bold transition-colors shrink-0" style={{ color: BRAND }}>
                          <Plus className="h-4 w-4" /> Add FAQ
                        </button>
                      </div>
                      <div className="space-y-4">
                        {cFaqs.map((f, i) => (
                          <div key={f.id} className="border border-slate-100 rounded-xl p-4 space-y-3 bg-slate-50/50">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">FAQ {i + 1}</span>
                              <button type="button"
                                onClick={() => cFaqs.length > 1 && setCFaqs(p => p.filter(x => x.id !== f.id))}
                                disabled={cFaqs.length === 1}
                                className="text-slate-300 hover:text-red-400 disabled:opacity-30 transition-colors">
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                            <input
                              placeholder="Question (e.g. How do I access my e-ticket after purchase?)"
                              value={f.q}
                              onChange={e => setCFaqs(p => p.map(x => x.id === f.id ? { ...x, q: e.target.value } : x))}
                              className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm placeholder-slate-300 focus:outline-none focus:border-[#00aeef] focus:ring-2 focus:ring-[#00aeef]/15 bg-white transition-all" />
                            <textarea rows={2}
                              placeholder="Answer…"
                              value={f.a}
                              onChange={e => setCFaqs(p => p.map(x => x.id === f.id ? { ...x, a: e.target.value } : x))}
                              className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm placeholder-slate-300 focus:outline-none focus:border-[#00aeef] focus:ring-2 focus:ring-[#00aeef]/15 bg-white transition-all resize-none" />
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>

                  {/* Right sidebar */}
                  <div className="w-72 shrink-0 space-y-5">
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 space-y-3">
                      <h2 className="text-base font-black text-slate-900">Banner Image</h2>
                      <div onClick={() => fileRef.current?.click()}
                        className="relative border-2 border-dashed border-slate-200 rounded-xl overflow-hidden cursor-pointer hover:border-[#00aeef] transition-colors group min-h-[150px]">
                        {cBanner ? (
                          <>
                            <img src={cBanner} alt="preview" className="w-full h-36 object-cover" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <p className="text-white text-xs font-bold">Click to change</p>
                            </div>
                          </>
                        ) : (
                          <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
                            <div className="h-10 w-10 rounded-xl border border-slate-200 flex items-center justify-center mb-3 group-hover:border-[#00aeef] transition-colors">
                              <Upload className="h-5 w-5 text-slate-400 group-hover:text-[#00aeef] transition-colors" />
                            </div>
                            <p className="text-sm font-semibold text-slate-700">Click to upload</p>
                            <p className="text-xs text-slate-400 mt-1">PNG, JPG up to 5 MB</p>
                          </div>
                        )}
                      </div>
                      <input ref={fileRef} type="file" accept="image/png,image/jpeg" className="hidden"
                        onChange={e => { const f = e.target.files?.[0]; if (f) handleBannerFile(f); e.target.value = ""; }} />
                      {bannerUploading && <p className="text-xs text-sky-500 font-medium mt-1 flex items-center gap-1"><Loader2 className="h-3 w-3 animate-spin" /> Uploading…</p>}
                      {bannerError && <p className="text-xs text-red-500 font-medium mt-1 flex items-center gap-1"><AlertCircle className="h-3 w-3" /> {bannerError}</p>}
                    </div>
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 space-y-3">
                      <h2 className="text-base font-black text-slate-900">Publish</h2>
                      {publishError && (
                        <div className="flex items-start gap-2 bg-red-50 border border-red-100 rounded-xl p-3">
                          <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
                          <p className="text-xs text-red-600 font-medium">{publishError}</p>
                        </div>
                      )}
                      {publishSuccess && (
                        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-100 rounded-xl p-3">
                          <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                          <p className="text-xs text-emerald-600 font-medium">Event created successfully!</p>
                        </div>
                      )}
                      <button type="button" onClick={() => handlePublish(false)}
                        disabled={!cTitle.trim() || publishLoading || bannerUploading}
                        className="w-full flex items-center justify-center gap-2 text-white font-bold text-sm py-3 rounded-xl transition-all shadow-md disabled:opacity-40 disabled:cursor-not-allowed"
                        style={{ background: `linear-gradient(135deg, ${BRAND}, #0077b6)` }}>
                        {publishLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                        {publishLoading ? "Publishing…" : "Publish Event"}
                      </button>
                      <button type="button" onClick={() => handlePublish(true)}
                        disabled={!cTitle.trim() || publishLoading || bannerUploading}
                        className="w-full border border-slate-200 hover:bg-slate-50 disabled:opacity-40 text-slate-700 font-bold text-sm py-3 rounded-xl transition-colors">
                        Save as Draft
                      </button>
                      <p className="text-xs text-slate-400 text-center leading-relaxed">
                        {cEventPackage === "unlimited" ? "Unlimited events require A$150 upfront. Payment collected via Stripe." : "Published events are immediately visible to the public."}
                      </p>
                    </div>
                    <div className={`rounded-2xl p-4 border ${cEventPackage === "unlimited" ? "bg-sky-50 border-sky-100" : "bg-emerald-50 border-emerald-100"}`}>
                      <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${cEventPackage === "unlimited" ? "text-sky-600" : "text-emerald-600"}`}>
                        Selected Package
                      </p>
                      <p className="text-sm font-black text-slate-800">
                        {cEventPackage === "unlimited" ? "MYHitchPass Unlimited" : "MYHitchPass Flex"}
                      </p>
                      <p className="text-xs text-slate-500 font-medium mt-0.5">
                        {cEventPackage === "unlimited" ? "A$150 flat fee billed on publish" : "A$0.50 per ticket sold, no upfront cost"}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ─── MY EVENTS ─── */}
          {tab === "events" && (
            <div className="p-7 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-black text-slate-900">My Events</h1>
                  <p className="text-sm text-slate-400 font-medium mt-1">Manage and track all your events in one place.</p>
                </div>
                <button onClick={goToCreate} className="flex items-center gap-2 text-white font-bold text-sm px-5 py-2.5 rounded-full shadow-lg"
                  style={{ background: `linear-gradient(135deg, ${BRAND}, #0077b6)`, boxShadow: `0 4px 14px rgba(0,174,239,0.3)` }}>
                  <Plus className="h-4 w-4" /> Create Event
                </button>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-4 py-2.5 shadow-sm">
                  <Search className="h-4 w-4 text-slate-400 shrink-0" />
                  <input placeholder="Search events…" value={evSearch} onChange={e => setEvSearch(e.target.value)}
                    className="flex-1 text-sm text-slate-700 placeholder-slate-300 focus:outline-none bg-transparent" />
                </div>
                <div className="relative">
                  <select value={evStatusFilter} onChange={e => setEvStatusFilter(e.target.value)}
                    className="appearance-none bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 pr-9 shadow-sm focus:outline-none cursor-pointer">
                    <option>All</option><option>Active</option><option>Draft</option><option>Ended</option><option>Sold Out</option>
                  </select>
                  <Filter className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                </div>
              </div>
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <EventsTable events={filteredEvents} onDelete={deleteEvent} brandColor={BRAND} onEdit={() => {}} />
              </div>
            </div>
          )}

          {/* ─── ATTENDEES ─── */}
          {tab === "attendees" && (
            <div className="p-7 space-y-6">
              <div>
                <h1 className="text-2xl font-black text-slate-900">Attendees</h1>
                <p className="text-sm text-slate-400 font-medium mt-1">Manage check-ins and view all ticket holders.</p>
              </div>
              <div className="grid grid-cols-3 gap-5">
                {[
                  { label: "Total Registered", val: attendees.length,                           icon: <Users className="h-5 w-5" />,        bg: "bg-sky-50",     color: "text-sky-500",     border: "border-sky-100"    },
                  { label: "Checked In",        val: attendees.filter(a => a.checkedIn).length, icon: <CheckCircle2 className="h-5 w-5" />, bg: "bg-emerald-50", color: "text-emerald-500", border: "border-emerald-100"},
                  { label: "Awaiting Entry",    val: attendees.filter(a => !a.checkedIn).length,icon: <Clock className="h-5 w-5" />,        bg: "bg-amber-50",   color: "text-amber-500",   border: "border-amber-100"  },
                ].map(c => (
                  <div key={c.label} className={`bg-white rounded-2xl p-5 shadow-sm border ${c.border} flex items-center gap-4`}>
                    <div className={`h-12 w-12 rounded-xl ${c.bg} ${c.color} flex items-center justify-center shrink-0`}>{c.icon}</div>
                    <div>
                      <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">{c.label}</p>
                      <p className="text-2xl font-black text-slate-900 leading-none mt-0.5">{c.val}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-4 py-2.5 shadow-sm">
                  <Search className="h-4 w-4 text-slate-400 shrink-0" />
                  <input placeholder="Search by name or email…" value={attSearch} onChange={e => setAttSearch(e.target.value)}
                    className="flex-1 text-sm placeholder-slate-300 focus:outline-none bg-transparent" />
                </div>
                <div className="relative">
                  <select value={attFilter} onChange={e => setAttFilter(e.target.value)}
                    className="appearance-none bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 pr-9 shadow-sm focus:outline-none cursor-pointer">
                    <option>All</option>
                    {[...new Set(attendees.map(a => a.event))].map(ev => <option key={ev}>{ev}</option>)}
                  </select>
                  <Filter className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                </div>
              </div>
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-100">
                        {["Ticket ID", "Name", "Event", "Ticket Type", "Purchase Date", "Status", "Action"].map(h => (
                          <th key={h} className="text-left text-[10px] font-black uppercase tracking-widest text-slate-400 px-5 py-3">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {attendeesLoading
                        ? <tr><td colSpan={7} className="py-12 text-center text-slate-400">Loading attendees…</td></tr>
                        : filteredAtt.length === 0
                        ? <tr><td colSpan={7} className="py-12 text-center text-slate-400">No attendees found.</td></tr>
                        : filteredAtt.map(a => (
                          <tr key={a.id} className="hover:bg-slate-50/60 transition-colors">
                            <td className="px-5 py-3.5 font-mono text-xs font-bold text-[#00aeef]">{a.id}</td>
                            <td className="px-5 py-3.5">
                              <div className="flex items-center gap-2.5">
                                <div className="h-8 w-8 rounded-full flex items-center justify-center text-white text-xs font-black shrink-0" style={{ background: `linear-gradient(135deg, ${BRAND}, #0077b6)` }}>
                                  {a.name.split(" ").map(n => n[0]).join("").slice(0,2)}
                                </div>
                                <div>
                                  <p className="font-semibold text-slate-900 text-sm">{a.name}</p>
                                  <p className="text-xs text-slate-400">{a.email}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-5 py-3.5 text-slate-600 max-w-[160px] truncate" title={a.event}>{a.event}</td>
                            <td className="px-5 py-3.5 text-slate-500">{a.tier}</td>
                            <td className="px-5 py-3.5 text-slate-400 text-xs">{a.date}</td>
                            <td className="px-5 py-3.5">
                              <span className={`inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full ${a.checkedIn ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : "bg-amber-50 text-amber-700 border border-amber-100"}`}>
                                <span className={`h-1.5 w-1.5 rounded-full ${a.checkedIn ? "bg-emerald-500" : "bg-amber-400"}`} />
                                {a.checkedIn ? "Checked In" : "Pending"}
                              </span>
                            </td>
                            <td className="px-5 py-3.5">
                              <button onClick={() => toggleCheckIn(a.id)}
                                className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition-colors ${a.checkedIn ? "border-slate-200 text-slate-600 hover:bg-slate-50" : "text-white border-transparent"}`}
                                style={!a.checkedIn ? { background: `linear-gradient(135deg, ${BRAND}, #0077b6)` } : {}}>
                                {a.checkedIn ? "Undo" : "Check In"}
                              </button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ─── PAYOUTS ─── */}
          {tab === "payouts" && (
            <div className="p-7 space-y-6">
              <div>
                <h1 className="text-2xl font-black text-slate-900">Payouts</h1>
                <p className="text-sm text-slate-400 font-medium mt-1">Track your earnings and manage bank account details.</p>
              </div>
              <div className="grid grid-cols-3 gap-5">
                {[
                  { label: "Available Balance", val: `$${payouts.available.toLocaleString()}`,  sub: "Ready to withdraw",     icon: <DollarSign className="h-6 w-6" />, bg: "bg-emerald-50", color: "text-emerald-500", border: "border-emerald-200", accent: true  },
                  { label: "Pending",           val: `$${payouts.pending.toLocaleString()}`,    sub: "Processing (2–3 days)", icon: <Clock className="h-6 w-6" />,       bg: "bg-amber-50",   color: "text-amber-500",   border: "border-amber-200",   accent: false },
                  { label: "Total Earned",      val: `$${payouts.total.toLocaleString()}`,      sub: "All time gross revenue",icon: <TrendingUp className="h-6 w-6" />,  bg: "bg-sky-50",     color: "text-sky-500",     border: "border-sky-200",     accent: false },
                ].map(c => (
                  <div key={c.label} className={`bg-white rounded-2xl p-6 shadow-sm border ${c.border} relative overflow-hidden`}>
                    {c.accent && <div className="absolute top-0 left-0 right-0 h-1 bg-emerald-500 rounded-t-2xl" />}
                    <div className={`h-12 w-12 rounded-xl ${c.bg} ${c.color} flex items-center justify-center mb-4`}>{c.icon}</div>
                    <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">{c.label}</p>
                    <p className="text-3xl font-black text-slate-900 mt-1">{c.val}</p>
                    <p className="text-xs text-slate-400 font-medium mt-1">{c.sub}</p>
                    {c.accent && (
                      <button className="mt-4 w-full text-white text-xs font-bold py-2.5 rounded-xl shadow-md"
                        style={{ background: `linear-gradient(135deg, ${BRAND}, #0077b6)` }}>
                        Withdraw Funds
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                  <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                    <h2 className="text-sm font-black text-slate-900">Transaction History</h2>
                    <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Payments Ledger</span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-100">
                          {["ID", "Event", "Gross", "Fee (2.5%)", "Net", "Date", "Status"].map(h => (
                            <th key={h} className="text-left text-[10px] font-black uppercase tracking-widest text-slate-400 px-4 py-3">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {payoutsLoading && (
                          <tr><td colSpan={7} className="px-4 py-8 text-center text-sm text-slate-400">Loading transactions…</td></tr>
                        )}
                        {!payoutsLoading && payouts.transactions.length === 0 && (
                          <tr><td colSpan={7} className="px-4 py-8 text-center text-sm text-slate-400">No transactions yet.</td></tr>
                        )}
                        {payouts.transactions.map(t => (
                          <tr key={t.id} className="hover:bg-slate-50/60 transition-colors">
                            <td className="px-4 py-3 font-mono text-xs font-bold text-slate-400">{t.id}</td>
                            <td className="px-4 py-3 font-semibold text-slate-800 max-w-[140px] truncate" title={t.event}>{t.event}</td>
                            <td className="px-4 py-3 font-semibold">${t.amount.toLocaleString()}</td>
                            <td className="px-4 py-3 text-red-400 font-medium">-${t.fee}</td>
                            <td className="px-4 py-3 font-bold text-emerald-600">${t.net.toLocaleString()}</td>
                            <td className="px-4 py-3 text-slate-400 text-xs">{t.date}</td>
                            <td className="px-4 py-3">
                              <span className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-full border ${
                                t.status === "paid" ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                                : t.status === "pending" ? "bg-amber-50 text-amber-700 border-amber-100"
                                : "bg-sky-50 text-sky-700 border-sky-100"
                              }`}>{t.status}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 space-y-4">
                    <div className="flex items-center justify-between">
                      <h2 className="text-sm font-black text-slate-900">Bank Account</h2>
                      <button className="text-xs font-bold hover:underline" style={{ color: BRAND }}>Edit</button>
                    </div>
                    <div className="flex items-center gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                      <div className="h-10 w-10 rounded-xl bg-slate-200 flex items-center justify-center">
                        <CreditCard className="h-5 w-5 text-slate-500" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">ANZ Business Banking</p>
                        <p className="text-xs text-slate-400 font-mono">•••• •••• 4482</p>
                      </div>
                    </div>
                    <div className="space-y-2 text-xs font-semibold">
                      {[
                        { label: "Account Name",    val: userProfile.name       },
                        { label: "BSB",             val: "012-004"              },
                        { label: "Payout Schedule", val: "Weekly (every Mon)"   },
                      ].map(r => (
                        <div key={r.label} className="flex justify-between py-1.5 border-b border-slate-50">
                          <span className="text-slate-400">{r.label}</span>
                          <span className="text-slate-700">{r.val}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="rounded-2xl p-4" style={{ background: "linear-gradient(135deg, rgba(0,174,239,0.08), rgba(0,119,182,0.05))", border: "1px solid rgba(0,174,239,0.15)" }}>
                    <p className="text-xs font-bold flex items-center gap-1.5 mb-1" style={{ color: BRAND }}>
                      <Shield className="h-3.5 w-3.5" /> Secure Payouts
                    </p>
                    <p className="text-xs text-slate-600 font-medium leading-relaxed">
                      All payouts processed via encrypted bank-grade escrow. Funds arrive within 1–3 business days.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ─── SETTINGS ─── */}
          {tab === "settings" && (
            <div className="p-7 space-y-6">
              <div>
                <h1 className="text-2xl font-black text-slate-900">Account Settings</h1>
                <p className="text-sm text-slate-400 font-medium mt-1">Manage your profile, organisation, and preferences.</p>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-5">
                  <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-5">
                    <h2 className="text-base font-black text-slate-900">Profile Information</h2>
                    <div className="flex items-center gap-4">
                      <div className="h-16 w-16 rounded-2xl text-white text-xl font-black flex items-center justify-center shrink-0 shadow-lg"
                        style={{ background: `linear-gradient(135deg, ${BRAND}, #0077b6)` }}>
                        {initials}
                      </div>
                      <div>
                        <button className="text-sm font-bold border border-slate-200 px-4 py-2 rounded-xl hover:bg-slate-50 transition-colors text-slate-700">Change Photo</button>
                        <p className="text-xs text-slate-400 mt-1.5">PNG or JPG, max 2MB</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <Field label="Full Name">
                        <input value={sName} onChange={e => setSName(e.target.value)}
                          className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:border-[#00aeef] focus:ring-2 focus:ring-[#00aeef]/15 transition-all" />
                      </Field>
                      <Field label="Email Address">
                        <div className="relative">
                          <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
                          <input value={sEmail} onChange={e => setSEmail(e.target.value)}
                            className="w-full border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-800 focus:outline-none focus:border-[#00aeef] transition-all" />
                        </div>
                      </Field>
                      <Field label="Phone Number">
                        <div className="relative">
                          <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
                          <input value={sPhone} onChange={e => setSPhone(e.target.value)}
                            className="w-full border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-800 focus:outline-none focus:border-[#00aeef] transition-all" />
                        </div>
                      </Field>
                      <Field label="Website">
                        <div className="relative">
                          <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
                          <input value={sWeb} onChange={e => setSWeb(e.target.value)}
                            className="w-full border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-800 focus:outline-none focus:border-[#00aeef] transition-all" />
                        </div>
                      </Field>
                    </div>
                    <Field label="About / Bio">
                      <textarea rows={3} value={sBio} onChange={e => setSBio(e.target.value)}
                        className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:border-[#00aeef] transition-all resize-none" />
                    </Field>
                    <div className="flex justify-end">
                      <button className="text-white font-bold text-sm px-6 py-2.5 rounded-xl shadow-md"
                        style={{ background: `linear-gradient(135deg, ${BRAND}, #0077b6)` }}>Save Changes</button>
                    </div>
                  </div>
                  <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-4">
                    <h2 className="text-base font-black text-slate-900">Notification Preferences</h2>
                    {[
                      { label: "New ticket sales",  sub: "Get notified when a ticket is purchased",   val: notifSales, set: setNotifSales },
                      { label: "New registrations", sub: "Alert when a new attendee registers",        val: notifNew,   set: setNotifNew   },
                      { label: "Payout processed",  sub: "Confirmation when payouts are sent",         val: notifPay,   set: setNotifPay   },
                    ].map(n => (
                      <div key={n.label} className="flex items-center justify-between py-3 border-b border-slate-50 last:border-0">
                        <div>
                          <p className="text-sm font-semibold text-slate-800">{n.label}</p>
                          <p className="text-xs text-slate-400 font-medium mt-0.5">{n.sub}</p>
                        </div>
                        <button onClick={() => n.set(!n.val)}
                          className={`relative h-6 w-11 rounded-full transition-colors focus:outline-none`}
                          style={{ backgroundColor: n.val ? BRAND : "#e2e8f0" }}>
                          <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${n.val ? "translate-x-[22px]" : "left-0.5"}`} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="space-y-5">
                  <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 space-y-4">
                    <h2 className="text-sm font-black text-slate-900">Organisation</h2>
                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                      <div className="h-10 w-10 rounded-xl flex items-center justify-center text-white text-sm font-black"
                        style={{ background: `linear-gradient(135deg, ${BRAND}, #0077b6)` }}>
                        <Building2 className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">My Organisation</p>
                        <p className="text-xs text-slate-400">ABN 12 345 678 901</p>
                      </div>
                    </div>
                    <Field label="Organisation Name">
                      <input defaultValue="My Events Co." className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-[#00aeef] transition-all" />
                    </Field>
                  </div>
                  <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 space-y-3">
                    <h2 className="text-sm font-black text-slate-900">Current Plan</h2>
                    <div className="flex items-center justify-between p-3 rounded-xl" style={{ background: `rgba(0,174,239,0.06)`, border: `1px solid rgba(0,174,239,0.15)` }}>
                      <div className="flex items-center gap-2">
                        {planInfo.icon}
                        <span className="text-sm font-black" style={{ color: BRAND }}>{planInfo.label}</span>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-full">Active</span>
                    </div>
                    <button className="w-full text-sm font-bold py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors text-slate-700">Upgrade Plan</button>
                  </div>
                  <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 space-y-3">
                    <h2 className="text-sm font-black text-slate-900">Security</h2>
                    {["Change Password", "Two-Factor Auth"].map(label => (
                      <button key={label} className="w-full text-sm font-semibold py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors text-slate-700 flex items-center justify-between px-4">
                        {label} <ChevronRight className="h-4 w-4 text-slate-300" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* ─── Stripe payment modal (Unlimited package fee) ─── */}
      {showPaymentModal && pendingClientSecret && (
        <PackagePaymentModal
          clientSecret={pendingClientSecret}
          onSuccess={handlePaymentSuccess}
          onClose={() => { setShowPaymentModal(false); setPublishLoading(false); }}
        />
      )}
    </div>
  );
}

/* ─── Sub-components ─── */

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-2">
        {label}{required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}

function EventsTable({ events, onDelete, brandColor, onEdit }: {
  events: Event[]; onDelete: (id: string) => void; brandColor: string; onEdit: (ev: Event) => void;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-100">
            {["Event Name", "Date", "Venue", "Status", "Sold / Cap", "Revenue", "Actions"].map(h => (
              <th key={h} className="text-left text-[10px] font-black uppercase tracking-widest text-slate-400 px-5 py-3">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {events.length === 0 ? (
            <tr><td colSpan={7} className="py-14 text-center text-slate-400 font-medium">No events found.</td></tr>
          ) : events.map(ev => {
            const st  = evStatus(ev as any);
            const sc  = STATUS[st] ?? STATUS["Ended"];
            const pct = ev.totalTickets > 0 ? Math.min(100, Math.round((ev.soldTickets / ev.totalTickets) * 100)) : 0;
            return (
              <tr key={ev.id} className="hover:bg-slate-50/60 transition-colors group">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <img src={ev.image} alt={ev.title} className="h-9 w-9 rounded-lg object-cover flex-shrink-0" />
                    <span className="font-semibold text-slate-900 max-w-[160px] truncate" title={ev.title}>{ev.title}</span>
                  </div>
                </td>
                <td className="px-5 py-4 text-slate-500 whitespace-nowrap text-xs">{ev.date}</td>
                <td className="px-5 py-4 text-slate-500 max-w-[140px] truncate text-xs" title={ev.location}>{ev.location}</td>
                <td className="px-5 py-4">
                  <span className={`inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full border ${sc.bg} ${sc.text} ${sc.border}`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${sc.dot}`} />{st}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2 min-w-[120px]">
                    <span className="text-xs font-bold whitespace-nowrap">
                      <span className="text-slate-900">{ev.soldTickets}</span>
                      <span className="text-slate-400">/{ev.totalTickets}</span>
                    </span>
                    <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: brandColor }} />
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4 font-bold text-slate-800">${(ev.soldTickets * ev.price).toLocaleString()}</td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button title="Edit" onClick={() => onEdit(ev)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-sky-600 transition-colors"><Pencil className="h-3.5 w-3.5" /></button>
                    <button title="View" className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-sky-600 transition-colors"><Eye className="h-3.5 w-3.5" /></button>
                    <button title="Delete" onClick={() => onDelete(ev.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors"><Trash2 className="h-3.5 w-3.5" /></button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
