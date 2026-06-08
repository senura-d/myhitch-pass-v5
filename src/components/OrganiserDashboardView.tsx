"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutGrid, PlusCircle, CalendarDays, Banknote, Settings,
  LogOut, Menu, X, BarChart3, Ticket, TrendingUp, CalendarCheck,
  ArrowRight, MoreVertical, Pencil, Trash2, Eye, Upload,
  Check, ChevronDown, Plus, Minus, ArrowLeft, AlertCircle,
  Download, Search, Bell, User, Sparkles, ShieldCheck,
} from "lucide-react";

// ── Mock data ─────────────────────────────────────────────────────────────────

interface OrgEvent {
  id: number;
  name: string;
  date: string;
  venue: string;
  status: "Active" | "Draft" | "Ended";
  sold: number;
  capacity: number;
  revenue: number;
}

const INITIAL_EVENTS: OrgEvent[] = [
  { id: 1, name: "Summer Music Festival", date: "Aug 15, 2026", venue: "Federation Square, Melbourne", status: "Active", sold: 342, capacity: 500, revenue: 17100 },
  { id: 2, name: "Tech Startup Meetup", date: "Jul 20, 2026", venue: "Stone & Chalk, Sydney", status: "Active", sold: 89, capacity: 200, revenue: 4450 },
  { id: 3, name: "Art Exhibition Night", date: "Jun 28, 2026", venue: "NGV International", status: "Draft", sold: 0, capacity: 150, revenue: 0 },
  { id: 4, name: "Community Fundraiser", date: "Apr 10, 2026", venue: "Riverside Park, Brisbane", status: "Ended", sold: 275, capacity: 300, revenue: 6875 },
];

const MOCK_PAYOUTS = [
  { id: "PO-4821", date: "May 15, 2026", event: "Community Fundraiser", amount: 6875, status: "Paid" },
  { id: "PO-4733", date: "May 22, 2026", event: "Tech Startup Meetup (partial)", amount: 2240, status: "Paid" },
  { id: "PO-5012", date: "Jun 1, 2026", event: "Tech Startup Meetup", amount: 2210, status: "Pending" },
];

interface TicketTier {
  id: string;
  name: string;
  price: string;
  quantity: string;
}

// ── Shared helpers ────────────────────────────────────────────────────────────

function fmt(n: number) {
  return "$" + n.toLocaleString("en-AU");
}

function StatusBadge({ status }: { status: OrgEvent["status"] }) {
  const styles: Record<string, { bg: string; text: string; border: string; dot: string }> = {
    Active: { bg: "bg-emerald-50/70", text: "text-emerald-700", border: "border-emerald-200/60", dot: "bg-emerald-500" },
    Draft: { bg: "bg-amber-50/70", text: "text-amber-700", border: "border-amber-200/60", dot: "bg-amber-500" },
    Ended: { bg: "bg-slate-100/80", text: "text-slate-600", border: "border-slate-200/60", dot: "bg-slate-400" },
  };
  const activeStyle = styles[status] || styles.Active;
  return (
    <span className={`inline-flex items-center gap-1.5 text-[9px] font-black px-2.5 py-1 rounded-full border uppercase tracking-widest ${activeStyle.bg} ${activeStyle.text} ${activeStyle.border}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${activeStyle.dot} ${status === "Active" ? "animate-pulse" : ""}`} />
      {status}
    </span>
  );
}

function PayoutBadge({ status }: { status: string }) {
  return (
    <span className={`inline-flex items-center text-[10px] font-extrabold px-2.5 py-1 rounded-full border uppercase tracking-wider ${
      status === "Paid" ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-sky-50 text-brand-blue border-brand-blue/20"
    }`}>
      {status}
    </span>
  );
}

function FieldInput({
  label, type = "text", value, onChange, placeholder, required,
}: {
  label: string; type?: string; value: string; onChange: (v: string) => void;
  placeholder?: string; required?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[11px] font-extrabold text-slate-600 uppercase tracking-wider">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/10 outline-none text-sm font-medium text-dark-text bg-white transition-all placeholder:text-slate-400"
      />
    </div>
  );
}

function FieldSelect({
  label, value, onChange, options, required,
}: {
  label: string; value: string; onChange: (v: string) => void;
  options: string[]; required?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[11px] font-extrabold text-slate-600 uppercase tracking-wider">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full pl-4 pr-10 py-3 rounded-xl border border-slate-200 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/10 outline-none text-sm font-medium text-dark-text bg-white transition-all appearance-none cursor-pointer"
        >
          <option value="">Select…</option>
          {options.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
        <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
      </div>
    </div>
  );
}

// ── Stat card ─────────────────────────────────────────────────────────────────

function StatCard({ icon, label, value, sub, color }: {
  icon: React.ReactNode; label: string; value: string;
  sub?: string; color: string;
}) {
  const glowStyles: Record<string, string> = {
    "bg-brand-blue": "shadow-brand-blue/15 hover:border-brand-blue/30 hover:shadow-brand-blue/10",
    "bg-sky-500": "shadow-sky-500/15 hover:border-sky-500/30 hover:shadow-sky-500/10",
    "bg-emerald-500": "shadow-emerald-500/15 hover:border-emerald-500/30 hover:shadow-emerald-500/10",
    "bg-violet-500": "shadow-violet-500/15 hover:border-violet-500/30 hover:shadow-violet-500/10",
  };
  const glowClass = glowStyles[color] || "";

  return (
    <div className={`bg-white rounded-2xl border border-slate-200/60 shadow-xs p-6 flex items-start gap-4 hover:shadow-lg hover:-translate-y-0.5 hover:border-brand-blue/15 transition-all duration-300 ${glowClass}`}>
      <div className={`h-12 w-12 rounded-2xl ${color} flex items-center justify-center flex-shrink-0 shadow-md ${color === "bg-brand-blue" ? "shadow-brand-blue/20" : ""}`}>
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">{label}</p>
        <p className="text-2xl font-black text-dark-text font-mono tracking-tight">{value}</p>
        {sub && <p className="text-xs text-slate-400 font-semibold mt-1">{sub}</p>}
      </div>
    </div>
  );
}

// ── Overview section ──────────────────────────────────────────────────────────

function OverviewSection({
  events, organiserName, onCreateEvent, onEditEvent, onDeleteEvent,
}: {
  events: OrgEvent[];
  organiserName: string;
  onCreateEvent: () => void;
  onEditEvent: (id: number) => void;
  onDeleteEvent: (id: number) => void;
}) {
  const [menuOpen, setMenuOpen] = useState<number | null>(null);
  const totalRevenue = events.reduce((s, e) => s + e.revenue, 0);
  const ticketsSold = events.reduce((s, e) => s + e.sold, 0);
  const upcoming = events.filter((e) => e.status !== "Ended").length;

  return (
    <div className="p-6 sm:p-8 space-y-8">
      {/* Welcome banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-brand-blue to-indigo-950 rounded-2xl p-6 sm:p-8 text-white shadow-xl shadow-brand-blue/5">
        {/* Modern blur blobs */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-tr from-brand-blue/30 to-purple-500/20 rounded-full blur-3xl opacity-40 pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-60 h-60 bg-gradient-to-tr from-cyan-400/20 to-blue-500/10 rounded-full blur-3xl opacity-30 pointer-events-none" />
        
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: "radial-gradient(circle at 70% 50%, white 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }} />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 border border-white/10 text-[9px] font-black uppercase tracking-widest text-brand-blue mb-3">
              <Sparkles className="h-3 w-3 animate-pulse" />
              <span>Organizer Console</span>
            </span>
            <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest mb-1.5">
              Welcome back
            </p>
            <h2 className="text-xl sm:text-2xl font-extrabold font-sans tracking-tight">
              {organiserName}! You're ready to sell tickets. 🎉
            </h2>
            <p className="text-xs sm:text-sm text-white/70 font-medium mt-1.5">
              Manage your events, track sales, and get paid below.
            </p>
          </div>
          <button
            onClick={onCreateEvent}
            className="flex items-center gap-2 bg-brand-blue hover:bg-brand-blue-hover text-white border border-brand-blue-hover font-extrabold text-xs px-6 py-3.5 rounded-xl shadow-lg shadow-brand-blue/20 hover:shadow-brand-blue/30 transition-all hover:scale-[1.03] active:scale-[0.98] cursor-pointer flex-shrink-0"
          >
            <PlusCircle className="h-4 w-4" />
            Create New Event
          </button>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={<CalendarDays className="h-6 w-6 text-white" />} label="Total Events"
          value={String(events.length)} sub={`${upcoming} upcoming`} color="bg-brand-blue" />
        <StatCard icon={<Ticket className="h-6 w-6 text-white" />} label="Tickets Sold"
          value={ticketsSold.toLocaleString()} sub="across all events" color="bg-sky-500" />
        <StatCard icon={<TrendingUp className="h-6 w-6 text-white" />} label="Total Revenue"
          value={fmt(totalRevenue)} sub="gross ticket sales" color="bg-emerald-500" />
        <StatCard icon={<CalendarCheck className="h-6 w-6 text-white" />} label="Upcoming"
          value={String(upcoming)} sub="events scheduled" color="bg-violet-500" />
      </div>

      {/* Events table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h3 className="text-base font-extrabold text-dark-text font-sans">My Events</h3>
          <button onClick={onCreateEvent}
            className="flex items-center gap-1.5 bg-brand-blue hover:bg-brand-blue-hover text-white font-extrabold text-xs px-4 py-2 rounded-xl shadow-sm shadow-brand-blue/20 transition-all cursor-pointer">
            <Plus className="h-3.5 w-3.5" /> New Event
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/60">
                {["Event Name", "Date", "Venue", "Status", "Sold / Cap", "Revenue", "Actions"].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-[10px] font-extrabold text-slate-400 uppercase tracking-widest whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {events.map((ev) => (
                <tr key={ev.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-5 py-4">
                    <span className="text-sm font-bold text-dark-text">{ev.name}</span>
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap">
                    <span className="text-xs font-semibold text-slate-500">{ev.date}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-xs font-medium text-slate-500 max-w-[140px] block truncate">{ev.venue}</span>
                  </td>
                  <td className="px-5 py-4"><StatusBadge status={ev.status} /></td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2.5">
                      <span className="text-xs font-black text-dark-text tracking-tight">{ev.sold} <span className="text-slate-400 font-normal">/ {ev.capacity}</span></span>
                      <div className="w-16 h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200/10">
                        <div
                          className="h-full bg-gradient-to-r from-brand-blue to-sky-400 rounded-full transition-all duration-500"
                          style={{ width: `${Math.min((ev.sold / ev.capacity) * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap">
                    <span className="text-xs font-bold text-dark-text">{fmt(ev.revenue)}</span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="relative flex items-center gap-1">
                      <button onClick={() => onEditEvent(ev.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-brand-blue hover:bg-sky-50 transition-colors cursor-pointer"
                        title="Edit">
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                        title="View">
                        <Eye className="h-3.5 w-3.5" />
                      </button>
                      <button onClick={() => onDeleteEvent(ev.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                        title="Delete">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {events.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center">
                    <CalendarDays className="h-10 w-10 text-slate-200 mx-auto mb-3" />
                    <p className="text-sm font-bold text-slate-400">No events yet</p>
                    <button onClick={onCreateEvent}
                      className="mt-3 text-xs font-bold text-brand-blue hover:underline cursor-pointer">
                      Create your first event →
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ── Create Event section ──────────────────────────────────────────────────────

function CreateEventSection({
  onBack, onPublish,
}: {
  onBack: () => void;
  onPublish: (asDraft: boolean) => void;
}) {
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [venue, setVenue] = useState("");
  const [category, setCategory] = useState("");
  const [tiers, setTiers] = useState<TicketTier[]>([
    { id: "1", name: "General Admission", price: "", quantity: "" },
  ]);

  const addTier = () => setTiers((t) => [...t, { id: Date.now().toString(), name: "", price: "", quantity: "" }]);
  const removeTier = (id: string) => setTiers((t) => t.filter((x) => x.id !== id));
  const updateTier = (id: string, field: keyof TicketTier, value: string) =>
    setTiers((t) => t.map((x) => x.id === id ? { ...x, [field]: value } : x));

  const CATEGORIES = ["Concert", "Sports", "Festival", "Theatre", "Community Event", "Workshop", "Other"];

  return (
    <div className="p-6 sm:p-8">
      <div className="flex items-center gap-4 mb-7">
        <button onClick={onBack}
          className="flex items-center gap-1.5 text-sm font-bold text-slate-500 hover:text-brand-blue transition-colors cursor-pointer">
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
        <div>
          <h2 className="text-xl font-extrabold text-dark-text font-sans">Create New Event</h2>
          <p className="text-xs text-slate-500 font-medium">Fill in the details below and publish when ready.</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left: main form */}
        <div className="lg:col-span-2 space-y-6">

          {/* Basic info */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h3 className="text-sm font-extrabold text-dark-text mb-5 pb-3 border-b border-slate-100">
              Event Details
            </h3>
            <div className="space-y-5">
              <FieldInput label="Event Name" value={name} onChange={setName}
                placeholder="e.g. Summer Music Festival 2026" required />
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-extrabold text-slate-600 uppercase tracking-wider">
                  Description<span className="text-red-500 ml-0.5">*</span>
                </label>
                <textarea
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  placeholder="Describe your event — what's it about, who should come, what to expect…"
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/10 outline-none text-sm font-medium text-dark-text bg-white transition-all placeholder:text-slate-400 resize-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FieldInput label="Date" type="date" value={date} onChange={setDate} required />
                <FieldInput label="Time" type="time" value={time} onChange={setTime} required />
              </div>
              <FieldInput label="Venue / Location" value={venue} onChange={setVenue}
                placeholder="e.g. Federation Square, Melbourne" required />
              <FieldSelect label="Category" value={category} onChange={setCategory}
                options={CATEGORIES} required />
            </div>
          </div>

          {/* Ticket tiers */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-5 pb-3 border-b border-slate-100">
              <h3 className="text-sm font-extrabold text-dark-text">Ticket Types</h3>
              <button onClick={addTier}
                className="flex items-center gap-1.5 text-xs font-extrabold text-brand-blue hover:text-brand-blue-hover transition-colors cursor-pointer bg-brand-blue/10 hover:bg-brand-blue/15 px-3 py-1.5 rounded-lg">
                <Plus className="h-3.5 w-3.5" /> Add Type
              </button>
            </div>
            <div className="space-y-4">
              {tiers.map((tier, i) => (
                <div key={tier.id} className="flex gap-3 items-end">
                  <div className="flex-1">
                    <FieldInput label={i === 0 ? "Name" : ""} value={tier.name}
                      onChange={(v) => updateTier(tier.id, "name", v)}
                      placeholder="e.g. General Admission" />
                  </div>
                  <div className="w-28">
                    <FieldInput label={i === 0 ? "Price (AUD)" : ""} type="number" value={tier.price}
                      onChange={(v) => updateTier(tier.id, "price", v)} placeholder="0.00" />
                  </div>
                  <div className="w-24">
                    <FieldInput label={i === 0 ? "Qty" : ""} type="number" value={tier.quantity}
                      onChange={(v) => updateTier(tier.id, "quantity", v)} placeholder="100" />
                  </div>
                  {tiers.length > 1 && (
                    <button onClick={() => removeTier(tier.id)}
                      className="mb-0.5 p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer flex-shrink-0">
                      <Minus className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
            <p className="text-xs text-slate-400 font-medium mt-4">
              Set price to 0 for free tickets. You can add multiple tiers (VIP, Early Bird, etc.)
            </p>
          </div>
        </div>

        {/* Right: banner + publish */}
        <div className="space-y-6">
          {/* Banner upload */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h3 className="text-sm font-extrabold text-dark-text mb-4 pb-3 border-b border-slate-100">
              Banner Image
            </h3>
            <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center hover:border-brand-blue/40 hover:bg-sky-50/30 transition-all cursor-pointer group">
              <div className="h-12 w-12 rounded-2xl bg-slate-100 group-hover:bg-brand-blue/10 flex items-center justify-center mx-auto mb-3 transition-colors">
                <Upload className="h-6 w-6 text-slate-400 group-hover:text-brand-blue transition-colors" />
              </div>
              <p className="text-sm font-bold text-slate-600 group-hover:text-brand-blue transition-colors mb-1">
                Click to upload
              </p>
              <p className="text-xs text-slate-400 font-medium">PNG, JPG up to 5 MB · 1600×900 recommended</p>
            </div>
          </div>

          {/* Publish card */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-3">
            <h3 className="text-sm font-extrabold text-dark-text pb-3 border-b border-slate-100">Publish</h3>
            <button
              onClick={() => onPublish(false)}
              className="w-full bg-brand-blue hover:bg-brand-blue-hover text-white font-extrabold text-sm py-3.5 rounded-xl shadow-lg shadow-brand-blue/25 flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer"
            >
              <Sparkles className="h-4 w-4" /> Publish Event
            </button>
            <button
              onClick={() => onPublish(true)}
              className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-sm py-3 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer"
            >
              Save as Draft
            </button>
            <p className="text-xs text-slate-400 font-medium text-center">
              Published events are immediately visible to the public.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Payouts section ───────────────────────────────────────────────────────────

function PayoutsSection() {
  return (
    <div className="p-6 sm:p-8 space-y-6">
      <div>
        <h2 className="text-xl font-extrabold text-dark-text font-sans">Payouts</h2>
        <p className="text-sm text-slate-500 font-medium mt-1">Your payout history from ticket sales.</p>
      </div>

      {/* Summary strip */}
      <div className="bg-gradient-to-r from-brand-blue via-sky-500 to-cyan-400 rounded-2xl p-6 text-white grid grid-cols-3 gap-6">
        {[
          { label: "Total Paid Out", value: "$8,450" },
          { label: "Pending", value: "$2,210" },
          { label: "Next Payout", value: "Jun 5, 2026" },
        ].map((s) => (
          <div key={s.label} className="text-center">
            <p className="text-xs text-white/70 font-bold uppercase tracking-wider mb-1">{s.label}</p>
            <p className="text-xl font-black font-mono">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Payout table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-extrabold text-dark-text">Payout History</h3>
          <button className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-brand-blue transition-colors cursor-pointer">
            <Download className="h-3.5 w-3.5" /> Export CSV
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/60">
                {["Payout ID", "Date", "Event", "Amount", "Status"].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-[10px] font-extrabold text-slate-400 uppercase tracking-widest whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {MOCK_PAYOUTS.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-5 py-4 text-xs font-mono font-bold text-slate-500">{p.id}</td>
                  <td className="px-5 py-4 text-xs font-medium text-slate-500">{p.date}</td>
                  <td className="px-5 py-4 text-sm font-medium text-dark-text">{p.event}</td>
                  <td className="px-5 py-4 text-sm font-bold text-dark-text">{fmt(p.amount)}</td>
                  <td className="px-5 py-4"><PayoutBadge status={p.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-sky-50 border border-brand-blue/15 rounded-2xl p-5 flex items-start gap-3">
        <ShieldCheck className="h-5 w-5 text-brand-blue mt-0.5 flex-shrink-0" />
        <p className="text-xs text-slate-600 font-medium leading-relaxed">
          Payouts are processed automatically after each sale and deposited to your connected Stripe bank account within <strong>2–3 business days</strong>. Contact support if you have a payout query.
        </p>
      </div>
    </div>
  );
}

// ── Settings section ──────────────────────────────────────────────────────────

function SettingsSection({ name }: { name: string }) {
  const [displayName, setDisplayName] = useState(name);
  const [email, setEmail] = useState("jane@sunsetevents.com.au");
  const [phone, setPhone] = useState("+61 412 345 678");
  const [org, setOrg] = useState("Sunset Events Co.");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="p-6 sm:p-8 space-y-6">
      <div>
        <h2 className="text-xl font-extrabold text-dark-text font-sans">Account Settings</h2>
        <p className="text-sm text-slate-500 font-medium mt-1">Manage your organiser profile and preferences.</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
        <h3 className="text-sm font-extrabold text-dark-text pb-3 border-b border-slate-100">Profile Information</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <FieldInput label="Display Name" value={displayName} onChange={setDisplayName} required />
          <FieldInput label="Email Address" type="email" value={email} onChange={setEmail} required />
          <FieldInput label="Phone Number" type="tel" value={phone} onChange={setPhone} />
          <FieldInput label="Organisation / Business Name" value={org} onChange={setOrg} />
        </div>
        <button onClick={handleSave}
          className={`flex items-center gap-2 ${saved ? "bg-emerald-500" : "bg-brand-blue hover:bg-brand-blue-hover"} text-white font-extrabold text-sm px-6 py-3 rounded-xl shadow-md transition-all active:scale-[0.98] cursor-pointer`}>
          {saved ? <><Check className="h-4 w-4" /> Saved!</> : <>Save Changes</>}
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h3 className="text-sm font-extrabold text-dark-text pb-3 border-b border-slate-100 mb-5">Payment Account</h3>
        <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
          <div className="h-10 w-10 rounded-xl bg-[#635BFF]/10 flex items-center justify-center">
            <span className="text-[#635BFF] font-black text-lg">S</span>
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-dark-text">Stripe Connected</p>
            <p className="text-xs text-slate-500 font-medium">acct_1Qa8···Xf9k — Sunset Events Co.</p>
          </div>
          <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-600 text-[10px] font-extrabold px-2.5 py-1 rounded-full border border-emerald-100 uppercase tracking-wider">
            <Check className="h-3 w-3" /> Active
          </span>
        </div>
      </div>
    </div>
  );
}

// ── My Events section (standalone view) ──────────────────────────────────────

function MyEventsSection({
  events, onCreateEvent, onEditEvent, onDeleteEvent,
}: {
  events: OrgEvent[];
  onCreateEvent: () => void;
  onEditEvent: (id: number) => void;
  onDeleteEvent: (id: number) => void;
}) {
  return (
    <div className="p-6 sm:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-dark-text font-sans">My Events</h2>
          <p className="text-sm text-slate-500 font-medium mt-1">{events.length} events total</p>
        </div>
        <button onClick={onCreateEvent}
          className="flex items-center gap-2 bg-brand-blue hover:bg-brand-blue-hover text-white font-extrabold text-sm px-5 py-2.5 rounded-xl shadow-md shadow-brand-blue/20 transition-all cursor-pointer active:scale-[0.98]">
          <PlusCircle className="h-4 w-4" /> New Event
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/60">
                {["Event Name", "Date", "Venue", "Status", "Sold / Cap", "Revenue", "Actions"].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-[10px] font-extrabold text-slate-400 uppercase tracking-widest whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {events.map((ev) => (
                <tr key={ev.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-5 py-4 text-sm font-bold text-dark-text">{ev.name}</td>
                  <td className="px-5 py-4 text-xs font-medium text-slate-500 whitespace-nowrap">{ev.date}</td>
                  <td className="px-5 py-4 text-xs font-medium text-slate-500 max-w-[140px] truncate">{ev.venue}</td>
                  <td className="px-5 py-4"><StatusBadge status={ev.status} /></td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2.5">
                      <span className="text-xs font-black text-dark-text tracking-tight">{ev.sold} <span className="text-slate-400 font-normal">/ {ev.capacity}</span></span>
                      <div className="w-16 h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200/10">
                        <div className="h-full bg-gradient-to-r from-brand-blue to-sky-400 rounded-full transition-all duration-500"
                          style={{ width: `${Math.min((ev.sold / ev.capacity) * 100, 100)}%` }} />
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-xs font-bold text-dark-text whitespace-nowrap">{fmt(ev.revenue)}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1">
                      <button onClick={() => onEditEvent(ev.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-brand-blue hover:bg-sky-50 transition-colors cursor-pointer" title="Edit">
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer" title="View">
                        <Eye className="h-3.5 w-3.5" />
                      </button>
                      <button onClick={() => onDeleteEvent(ev.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer" title="Delete">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ── Sidebar ───────────────────────────────────────────────────────────────────

type Section = "overview" | "create" | "events" | "payouts" | "settings";

const NAV_ITEMS: { id: Section; label: string; icon: React.ReactNode }[] = [
  { id: "overview", label: "Dashboard", icon: <LayoutGrid className="h-4.5 w-4.5" /> },
  { id: "create", label: "Create Event", icon: <PlusCircle className="h-4.5 w-4.5" /> },
  { id: "events", label: "My Events", icon: <CalendarDays className="h-4.5 w-4.5" /> },
  { id: "payouts", label: "Payouts", icon: <Banknote className="h-4.5 w-4.5" /> },
  { id: "settings", label: "Account Settings", icon: <Settings className="h-4.5 w-4.5" /> },
];

function Sidebar({
  active, onChange, organiserName, onLogout,
}: {
  active: Section;
  onChange: (s: Section) => void;
  organiserName: string;
  onLogout: () => void;
}) {
  return (
    <aside className="w-64 bg-white border-r border-slate-100 flex flex-col flex-shrink-0 sticky top-0 h-screen overflow-y-auto">
      {/* Accent stripe */}
      <div className="h-[3px] w-full bg-gradient-to-r from-[#00AEEF] via-purple-400 to-pink-400 flex-shrink-0" />

      {/* Logo */}
      <div className="px-5 py-4 border-b border-slate-100 flex-shrink-0">
        <Link href="/" className="flex items-center gap-2 group">
          <img src="/logo.png" alt="MYHitch Pass" className="h-8 w-auto object-contain"
            onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }} />
        </Link>
        <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mt-0.5 ml-0.5">
          Organiser Portal
        </p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV_ITEMS.map((item) => {
          const isActive = active === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onChange(item.id)}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-200 cursor-pointer group ${
                isActive
                  ? "bg-gradient-to-r from-brand-blue to-sky-500 text-white shadow-lg shadow-brand-blue/20 hover:scale-[1.02]"
                  : "text-slate-500 hover:bg-slate-50 hover:text-dark-text hover:translate-x-0.5"
              }`}
            >
              <span className={`transition-transform duration-200 group-hover:scale-110 ${isActive ? "text-white" : "text-slate-400 group-hover:text-brand-blue"}`}>
                {item.icon}
              </span>
              {item.label}
              {item.id === "create" && (
                <span className={`ml-auto text-[9px] font-extrabold px-1.5 py-0.5 rounded-full uppercase tracking-wider ${isActive ? "bg-white/20 text-white" : "bg-brand-blue/10 text-brand-blue"}`}>
                  {isActive ? "New" : "New"}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* User profile + logout */}
      <div className="border-t border-slate-100 px-3 py-4 space-y-2 flex-shrink-0">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-brand-blue to-purple-400 flex items-center justify-center flex-shrink-0">
            <User className="h-4 w-4 text-white" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-extrabold text-dark-text truncate">{organiserName}</p>
            <p className="text-[10px] text-slate-400 font-medium truncate">Organiser</p>
          </div>
        </div>
        <button onClick={onLogout}
          className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-bold text-slate-500 hover:bg-red-50 hover:text-red-600 transition-all cursor-pointer">
          <LogOut className="h-4 w-4" /> Logout
        </button>
      </div>
    </aside>
  );
}

// ── Mobile top bar ────────────────────────────────────────────────────────────

function MobileTopBar({
  active, onMenuOpen,
}: {
  active: Section;
  onMenuOpen: () => void;
}) {
  const label = NAV_ITEMS.find((n) => n.id === active)?.label ?? "Dashboard";
  return (
    <div className="lg:hidden bg-white border-b border-slate-100 shadow-sm flex-shrink-0">
      <div className="h-[3px] w-full bg-gradient-to-r from-[#00AEEF] via-purple-400 to-pink-400" />
      <div className="flex items-center justify-between px-4 h-14">
        <Link href="/" className="flex items-center gap-2">
          <img src="/logo.png" alt="MYHitch Pass" className="h-7 w-auto object-contain" />
        </Link>
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-slate-500">{label}</span>
          <button onClick={onMenuOpen}
            className="p-2 rounded-xl text-slate-500 hover:text-dark-text hover:bg-slate-100 cursor-pointer transition-colors">
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────

export default function OrganiserDashboardView() {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState<Section>("overview");
  const [events, setEvents] = useState<OrgEvent[]>(INITIAL_EVENTS);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const organiserName = "Jane Smith";

  const deleteEvent = (id: number) => setEvents((prev) => prev.filter((e) => e.id !== id));
  const handlePublish = (asDraft: boolean) => {
    const newEvent: OrgEvent = {
      id: Date.now(),
      name: "New Event",
      date: "TBA",
      venue: "TBA",
      status: asDraft ? "Draft" : "Active",
      sold: 0, capacity: 100, revenue: 0,
    };
    setEvents((prev) => [newEvent, ...prev]);
    setActiveSection("events");
  };

  return (
    <div className="flex h-screen overflow-hidden bg-soft-bg">
      {/* Desktop sidebar */}
      <div className="hidden lg:flex">
        <Sidebar
          active={activeSection}
          onChange={setActiveSection}
          organiserName={organiserName}
          onLogout={() => router.push("/")}
        />
      </div>

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {mobileSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-neutral-900/60 z-40 lg:hidden"
              onClick={() => setMobileSidebarOpen(false)}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.25 }}
              className="fixed inset-y-0 left-0 z-50 w-64 lg:hidden"
            >
              <Sidebar
                active={activeSection}
                onChange={(s) => { setActiveSection(s); setMobileSidebarOpen(false); }}
                organiserName={organiserName}
                onLogout={() => router.push("/")}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <MobileTopBar active={activeSection} onMenuOpen={() => setMobileSidebarOpen(true)} />

        <main className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {activeSection === "overview" && (
                <OverviewSection
                  events={events}
                  organiserName={organiserName}
                  onCreateEvent={() => setActiveSection("create")}
                  onEditEvent={() => setActiveSection("create")}
                  onDeleteEvent={deleteEvent}
                />
              )}
              {activeSection === "create" && (
                <CreateEventSection
                  onBack={() => setActiveSection("overview")}
                  onPublish={handlePublish}
                />
              )}
              {activeSection === "events" && (
                <MyEventsSection
                  events={events}
                  onCreateEvent={() => setActiveSection("create")}
                  onEditEvent={() => setActiveSection("create")}
                  onDeleteEvent={deleteEvent}
                />
              )}
              {activeSection === "payouts" && <PayoutsSection />}
              {activeSection === "settings" && <SettingsSection name={organiserName} />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
