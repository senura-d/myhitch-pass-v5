"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import {
  ArrowRight,
  Zap,
  BarChart3,
  Building2,
  Tag,
  QrCode,
  Users,
  Download,
  Check,
  ChevronDown,
  HelpCircle,
  Sparkles,
  UserPlus,
  CalendarDays,
  Share2,
  Banknote,
  Percent,
  ShieldCheck,
} from "lucide-react";
import ForOrganisers from "@/src/components/ForOrganisers";
import { useAppContext } from "@/app/providers";

// ── Animation variants ────────────────────────────────────────────────────────

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};

// ── Reusable sub-components ───────────────────────────────────────────────────

export function StepCard({
  number,
  icon,
  title,
  description,
}: {
  number: number;
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="group flex flex-col items-center text-center">
      <div className="relative mb-5">
        <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-brand-blue to-sky-400 text-white flex items-center justify-center shadow-lg shadow-brand-blue/25 transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl group-hover:shadow-brand-blue/35">
          {icon}
        </div>
        <div className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-dark-text text-white text-[11px] font-black flex items-center justify-center ring-2 ring-white">
          {number}
        </div>
      </div>
      <h3 className="text-sm font-bold text-slate-900 mb-2 font-sans">{title}</h3>
      <p className="text-xs text-slate-500 leading-relaxed font-medium max-w-[190px]">
        {description}
      </p>
    </div>
  );
}

export function FeatureCard({
  icon,
  title,
  description,
  colorClass,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  colorClass: string;
}) {
  return (
    <div className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 p-6 flex flex-col gap-4">
      <div
        className={`h-11 w-11 rounded-xl ${colorClass} flex items-center justify-center transition-transform duration-300 group-hover:scale-110 flex-shrink-0`}
      >
        {icon}
      </div>
      <div>
        <h3 className="text-sm font-bold text-slate-900 mb-1.5 font-sans">{title}</h3>
        <p className="text-xs text-slate-500 leading-relaxed font-medium">{description}</p>
      </div>
    </div>
  );
}

export function EventTypeChip({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <div className="group flex items-center gap-2.5 bg-white border border-slate-200 rounded-2xl px-5 py-3.5 hover:border-brand-blue/40 hover:bg-sky-50/60 transition-all duration-200 shadow-sm hover:shadow-md cursor-default">
      <span className="text-brand-blue flex-shrink-0">{icon}</span>
      <span className="text-sm font-bold text-slate-700 group-hover:text-brand-blue transition-colors duration-200 font-sans whitespace-nowrap">
        {label}
      </span>
    </div>
  );
}

export function FaqAccordion({
  items,
}: {
  items: { question: string; answer: string }[];
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (i: number) => setOpenIndex(openIndex === i ? null : i);

  return (
    <div className="space-y-3">
      {items.map((item, i) => {
        const isOpen = openIndex === i;
        return (
          <div
            key={i}
            className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden"
          >
            <button
              onClick={() => toggle(i)}
              className="w-full flex items-center justify-between px-6 py-5 text-left group cursor-pointer focus:outline-none"
            >
              <span className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-brand-blue transition-colors duration-200 pr-4">
                {item.question}
              </span>
              <motion.div
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
                className="flex-shrink-0 text-slate-400 group-hover:text-brand-blue transition-colors duration-200"
              >
                <ChevronDown className="h-5 w-5" />
              </motion.div>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                >
                  <div className="px-6 pb-6 pt-0 border-t border-slate-100">
                    <p className="text-sm text-slate-600 leading-relaxed font-medium pt-4">
                      {item.answer}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}

// ── CountUp (reuses StatsStrip pattern) ──────────────────────────────────────

function formatStat(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1000) return (n / 1000).toFixed(n % 1000 === 0 ? 0 : 1) + "k";
  return n.toString();
}

function CountUp({
  target,
  start,
  duration = 1500,
}: {
  target: number;
  start: boolean;
  duration?: number;
}) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number | null = null;
    const step = (ts: number) => {
      if (startTime === null) startTime = ts;
      const progress = Math.min((ts - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [start, target, duration]);
  return <>{formatStat(count)}</>;
}

// ── Page data ─────────────────────────────────────────────────────────────────

const ORGANISER_STATS = [
  { value: 1100, prefix: "", suffix: "+", label: "Organisers" },
  { value: 4200, prefix: "", suffix: "+", label: "Events listed" },
  { value: 2100000, prefix: "$", suffix: "", label: "Paid out" },
  { value: 38, prefix: "", suffix: "", label: "Cities" },
];

const HOW_IT_WORKS = [
  {
    icon: <UserPlus className="h-7 w-7" />,
    title: "Create your account",
    description: "Sign up free in under two minutes — no credit card needed.",
  },
  {
    icon: <CalendarDays className="h-7 w-7" />,
    title: "Set up your event & tickets",
    description: "Add event details, set ticket types, prices, and capacity.",
  },
  {
    icon: <Share2 className="h-7 w-7" />,
    title: "Share and sell",
    description: "Share your unique event link and attendees buy directly.",
  },
  {
    icon: <Banknote className="h-7 w-7" />,
    title: "Get paid to your bank",
    description: "Revenue lands in your account within 2–3 business days.",
  },
];

const FEATURES = [
  {
    icon: <Zap className="h-5 w-5 text-white" />,
    title: "Create events in minutes",
    description: "Go live the same day — no lengthy approvals or waiting periods.",
    colorClass: "bg-brand-blue",
  },
  {
    icon: <Tag className="h-5 w-5 text-white" />,
    title: "Multiple ticket types & pricing",
    description: "Set up GA, VIP, Early Bird tiers with individual capacities.",
    colorClass: "bg-sky-500",
  },
  {
    icon: <Percent className="h-5 w-5 text-white" />,
    title: "Promo & discount codes",
    description: "Create custom percentage or fixed-amount codes to drive sales.",
    colorClass: "bg-indigo-500",
  },
  {
    icon: <QrCode className="h-5 w-5 text-white" />,
    title: "QR ticket scanning at the door",
    description: "Scan tickets from any smartphone — no special hardware needed.",
    colorClass: "bg-emerald-500",
  },
  {
    icon: <BarChart3 className="h-5 w-5 text-white" />,
    title: "Real-time sales & check-in",
    description: "Watch ticket sales and door check-ins update live from your dashboard.",
    colorClass: "bg-violet-500",
  },
  {
    icon: <Download className="h-5 w-5 text-white" />,
    title: "Attendee list export",
    description: "Export a full attendee CSV at any time for records or entry management.",
    colorClass: "bg-amber-500",
  },
];

const ORGANISER_CATEGORIES = [
  {
    label: "Community fundraisers",
    tagline: "Raise funds & build community",
    image: "https://images.unsplash.com/photo-1491438590914-bc09fcaaf77a?auto=format&fit=crop&w=600&q=80",
  },
  {
    label: "Cultural nights",
    tagline: "Celebrate heritage & tradition",
    image: "https://images.unsplash.com/photo-1504609813442-a8924e83f76e?auto=format&fit=crop&w=600&q=80",
  },
  {
    label: "Concerts",
    tagline: "Live music nights",
    image: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&w=600&q=80",
  },
  {
    label: "Workshops",
    tagline: "Learn & grow together",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=600&q=80",
  },
  {
    label: "Festivals",
    tagline: "Outdoor parties & celebrations",
    image: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&w=600&q=80",
  },
  {
    label: "Sports",
    tagline: "Games, matches & tournaments",
    image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=600&q=80",
  },
];

const FAQ_ITEMS = [
  {
    question: "What does it cost?",
    answer:
      "It's completely free to list your event. We only earn when you sell a paid ticket — a small per-ticket service fee added at checkout and paid by the buyer. No monthly subscription, no setup cost, no lock-in.",
  },
  {
    question: "When and how do I get paid?",
    answer:
      "Ticket revenue is deposited directly into your nominated bank account on a rolling basis. Payouts typically arrive within 2–3 business days after each sale. You can track every payout from your organiser dashboard.",
  },
  {
    question: "Do I need a registered business?",
    answer:
      "Not at all. MYHitch Pass is open to individuals and organisations of every size — from a solo host running a one-off workshop to a commercial promoter managing multiple shows. If you can sell tickets, you can list here.",
  },
  {
    question: "What about refunds and cancellations?",
    answer:
      "You set your own refund policy when creating your event. If you need to cancel an event entirely, our support team will help process refunds to all affected attendees. We handle the admin so you don't have to.",
  },
  {
    question: "Is there a contract or monthly fee?",
    answer:
      "None. No contract, no subscription, no monthly fee. Your account stays active and free even if you don't list any events for months. We only earn when you do.",
  },
  {
    question: "How is GST/tax handled?",
    answer:
      "MYHitch Pass provides a transaction record for every sale. Your GST and tax obligations depend on your individual circumstances and event type. We recommend speaking with your accountant for advice specific to your situation — our platform does not remit GST on your behalf.",
  },
];

// ── Main view ─────────────────────────────────────────────────────────────────

export default function BecomeOrganiserView() {
  const { setView } = useAppContext();
  const statsRef = useRef<HTMLDivElement>(null);
  const [statsStarted, setStatsStarted] = useState(false);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    const el = statsRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStatsStarted(true);
          obs.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div className="animate-fade">
      {/* ── 1. HERO ──────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden min-h-[620px] py-24 lg:py-32 flex items-center text-white">
        {/* Background image — Ken Burns on desktop, scroll-safe on mobile */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-scroll md:bg-fixed animate-ken-burns"
          style={{ backgroundImage: "url('/images/cta-bg.png')" }}
          aria-hidden="true"
        />
        {/* Dark gradient overlay — left heavier so text stays legible, right lighter for mockup */}
        <div
          className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/75 to-slate-900/55"
          aria-hidden="true"
        />
        {/* Bottom fade into the trust strip */}
        <div
          className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-blue-600/30 to-transparent pointer-events-none"
          aria-hidden="true"
        />

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

            {/* Left: copy */}
            <motion.div
              variants={stagger}
              initial="hidden"
              animate="visible"
              className="flex flex-col"
            >
              <motion.div variants={fadeUp} className="mb-5">
                <span className="inline-flex items-center gap-2 bg-white/15 border border-white/20 text-white text-xs font-bold px-4 py-2 rounded-full backdrop-blur-sm">
                  <Sparkles className="h-3.5 w-3.5" />
                  For Event Organisers
                </span>
              </motion.div>

              <motion.h1
                variants={fadeUp}
                className="text-4xl sm:text-5xl lg:text-[52px] font-black tracking-tight text-white leading-[1.1] mb-5 font-sans"
              >
                Sell tickets to your event{" "}
                <span className="text-brand-blue">in minutes.</span>
              </motion.h1>

              <motion.p
                variants={fadeUp}
                className="text-base sm:text-lg text-white/80 leading-relaxed mb-8 max-w-lg font-medium"
              >
                List for free, share your event, and get paid straight to your bank.
                Built for organisers of any size.
              </motion.p>

              <motion.div variants={fadeUp} className="flex flex-wrap gap-3 mb-8">
                <Link
                  href="/organiser/signup"
                  className="bg-brand-blue hover:bg-brand-blue-hover text-white font-extrabold text-sm px-8 py-3.5 rounded-xl shadow-lg shadow-brand-blue/40 flex items-center gap-2 transition-all active:scale-[0.98]"
                >
                  Start selling
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <button
                  onClick={() => setView("pricing")}
                  className="bg-white/10 hover:bg-white/20 border border-white/25 text-white font-extrabold text-sm px-6 py-3.5 rounded-xl backdrop-blur-sm transition-all active:scale-[0.98] cursor-pointer"
                >
                  See pricing
                </button>
              </motion.div>

              <motion.div variants={fadeUp} className="flex items-center gap-6 flex-wrap">
                {["Free to list", "Get paid in 2–3 days"].map((point) => (
                  <span
                    key={point}
                    className="flex items-center gap-1.5 text-xs font-bold text-white/70"
                  >
                    <Check className="h-3.5 w-3.5 text-emerald-400 flex-shrink-0" />
                    {point}
                  </span>
                ))}
              </motion.div>
            </motion.div>

            {/* Right: dashboard mockup */}
            <motion.div
              initial={{ opacity: 0, x: 32 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.25, ease: "easeOut" }}
              className="relative hidden lg:block"
            >
              <div className="relative rounded-2xl overflow-hidden border border-white/20 shadow-2xl shadow-black/40 ring-1 ring-white/10 backdrop-blur-sm">
                {!imgError ? (
                  <img
                    src="/images/dashboard-preview.png"
                    alt="Organiser dashboard preview"
                    className="w-full h-auto object-cover"
                    onError={() => setImgError(true)}
                  />
                ) : (
                  <div className="bg-white/10 backdrop-blur-md aspect-[4/3] flex flex-col items-center justify-center gap-4 border border-white/10">
                    <div className="h-16 w-16 rounded-2xl bg-white/10 flex items-center justify-center">
                      <BarChart3 className="h-8 w-8 text-white/40" />
                    </div>
                    <p className="text-xs text-white/50 font-medium tracking-wide uppercase">
                      Dashboard preview
                    </p>
                    <p className="text-[11px] text-white/30 font-medium">
                      Replace with /images/dashboard-preview.png
                    </p>
                  </div>
                )}
              </div>

              {/* Floating badges */}
              <div className="absolute -bottom-4 -left-6 bg-white border border-slate-100 rounded-2xl px-4 py-3 shadow-xl flex items-center gap-2.5 z-10">
                <div className="h-8 w-8 rounded-xl bg-emerald-50 flex items-center justify-center">
                  <Check className="h-4 w-4 text-emerald-500" />
                </div>
                <div>
                  <p className="text-xs font-black text-dark-text">Free to list</p>
                  <p className="text-[10px] text-slate-400 font-medium">No upfront cost</p>
                </div>
              </div>

              <div className="absolute -top-4 -right-4 bg-white border border-slate-100 rounded-2xl px-4 py-3 shadow-xl flex items-center gap-2.5 z-10">
                <div className="h-8 w-8 rounded-xl bg-brand-blue/10 flex items-center justify-center">
                  <ShieldCheck className="h-4 w-4 text-brand-blue" />
                </div>
                <div>
                  <p className="text-xs font-black text-dark-text">Secure payouts</p>
                  <p className="text-[10px] text-slate-400 font-medium">2–3 business days</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── 2. TRUST STRIP ───────────────────────────────────────────────────── */}
      <div
        ref={statsRef}
        className="bg-gradient-to-r from-blue-600 via-sky-500 to-cyan-400 py-12 px-4 sm:px-6 lg:px-8 shadow-[0_4px_24px_0_rgba(2,132,199,0.35)]"
      >
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-white text-center">
          {ORGANISER_STATS.map((s) => (
            <div key={s.label} className="flex flex-col items-center gap-1.5">
              <span className="text-4xl sm:text-5xl font-black font-mono tabular-nums">
                {s.prefix}
                <CountUp target={s.value} start={statsStarted} />
                {s.suffix}
              </span>
              <span className="text-xs font-bold text-white/70 uppercase tracking-widest">
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── 3. HOW IT WORKS ──────────────────────────────────────────────────── */}
      <section className="bg-soft-bg py-20 sm:py-24 border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="text-center mb-14"
          >
            <motion.div
              variants={fadeUp}
              className="mb-3 inline-flex items-center gap-2 rounded-full bg-brand-blue/10 px-4 py-1.5 text-sm font-semibold text-brand-blue"
            >
              <Zap className="h-4 w-4" />
              Simple process
            </motion.div>
            <motion.h2
              variants={fadeUp}
              className="text-3xl sm:text-4xl font-extrabold text-dark-text tracking-tight mb-3 font-sans"
            >
              How it works
            </motion.h2>
            <motion.p
              variants={fadeUp}
              className="text-base text-slate-600 max-w-md mx-auto font-medium"
            >
              From account creation to first sale in four straightforward steps.
            </motion.p>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 md:gap-4 relative"
          >
            {/* Connector line — desktop only */}
            <div className="hidden md:block absolute top-8 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-brand-blue/20 via-sky-400/30 to-brand-blue/20 z-0" />

            {HOW_IT_WORKS.map((step, i) => (
              <motion.div key={i} variants={fadeUp} className="relative z-10">
                <StepCard
                  number={i + 1}
                  icon={step.icon}
                  title={step.title}
                  description={step.description}
                />
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-12 text-center"
          >
            <Link
              href="/organiser/signup"
              className="inline-flex items-center gap-2 bg-brand-blue hover:bg-brand-blue-hover text-white font-extrabold text-sm px-8 py-3.5 rounded-xl shadow-lg shadow-brand-blue/30 transition-all active:scale-[0.98]"
            >
              Get started now
              <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── 4. BUILT FOR ORGANISERS ──────────────────────────────────────────── */}
      <ForOrganisers />

      {/* ── 5. FEATURES SHOWCASE ─────────────────────────────────────────────── */}
      <section className="bg-soft-bg py-20 sm:py-24 border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="text-center mb-14"
          >
            <motion.div
              variants={fadeUp}
              className="mb-3 inline-flex items-center gap-2 rounded-full bg-brand-blue/10 px-4 py-1.5 text-sm font-semibold text-brand-blue"
            >
              <BarChart3 className="h-4 w-4" />
              Platform features
            </motion.div>
            <motion.h2
              variants={fadeUp}
              className="text-3xl sm:text-4xl font-extrabold text-dark-text tracking-tight mb-3 font-sans"
            >
              Everything you need to run events
            </motion.h2>
            <motion.p
              variants={fadeUp}
              className="text-base text-slate-600 max-w-xl mx-auto font-medium"
            >
              Powerful tools that stay simple — no bloat, no learning curve.
            </motion.p>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {FEATURES.map((card, i) => (
              <motion.div key={i} variants={fadeUp}>
                <FeatureCard
                  icon={card.icon}
                  title={card.title}
                  description={card.description}
                  colorClass={card.colorClass}
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── 6. WHO IT'S FOR ──────────────────────────────────────────────────── */}
      <section className="bg-white py-20 sm:py-24 border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            className="text-center mb-10"
          >
            <motion.div
              variants={fadeUp}
              className="mb-3 inline-flex items-center gap-2 rounded-full bg-brand-blue/10 px-4 py-1.5 text-sm font-semibold text-brand-blue"
            >
              <Users className="h-4 w-4" />
              Organisers of all types
            </motion.div>
            <motion.h2
              variants={fadeUp}
              className="text-3xl sm:text-4xl font-extrabold text-dark-text tracking-tight mb-3 font-sans"
            >
              Built for every kind of event
            </motion.h2>
            <motion.p
              variants={fadeUp}
              className="text-base text-slate-600 max-w-xl mx-auto font-medium"
            >
              Whether you're hosting a community fundraiser or a sold-out concert,
              MYHitch Pass scales with you.
            </motion.p>
          </motion.div>

          {/* Image cards — same pattern as PopularCategories */}
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            className="grid grid-cols-2 sm:grid-cols-3 gap-4"
          >
            {ORGANISER_CATEGORIES.map((cat, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                className="group relative h-48 rounded-[24px] overflow-hidden border border-border-gray hover:border-brand-blue/30 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <img
                  src={cat.image}
                  alt={cat.label}
                  referrerPolicy="no-referrer"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-4 flex flex-col justify-end text-white z-10">
                  <span className="text-[10px] sm:text-xs font-bold text-neutral-200/90 tracking-wide mb-0.5 leading-none">
                    {cat.tagline}
                  </span>
                  <h3 className="text-sm sm:text-base font-black tracking-tight leading-tight uppercase flex items-center justify-between">
                    <span>{cat.label}</span>
                    <ArrowRight className="h-4 w-4 -translate-x-1 group-hover:translate-x-0.5 opacity-0 group-hover:opacity-100 transition-all duration-300 text-brand-blue" />
                  </h3>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── 7. PRICING SUMMARY ───────────────────────────────────────────────── */}
      <section className="bg-soft-bg py-20 sm:py-24 border-b border-slate-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-3xl border border-gray-100 shadow-sm p-10 sm:p-14 text-center relative overflow-hidden"
          >
            {/* Decorative accent blob */}
            <div className="absolute -top-16 -right-16 h-52 w-52 rounded-full bg-gradient-to-br from-brand-blue/5 to-sky-300/5 blur-2xl pointer-events-none" />

            <div className="mb-5 inline-flex items-center gap-2 bg-emerald-50 text-emerald-600 text-xs font-bold px-4 py-2 rounded-full border border-emerald-100">
              <ShieldCheck className="h-3.5 w-3.5" />
              Transparent pricing
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-dark-text tracking-tight mb-4 font-sans">
              Free to list. We only earn when you sell.
            </h2>

            <p className="text-base text-slate-600 leading-relaxed max-w-xl mx-auto mb-8 font-medium">
              A small per-ticket service fee is added at checkout — paid by your attendees,
              not you. No monthly cost, no lock-in, no surprises.
            </p>

            <div className="flex flex-wrap justify-center gap-x-6 gap-y-3 mb-10">
              {["No setup fee", "No monthly subscription", "No long-term contract"].map(
                (point) => (
                  <div
                    key={point}
                    className="flex items-center gap-1.5 text-sm font-semibold text-slate-600"
                  >
                    <Check className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                    {point}
                  </div>
                )
              )}
            </div>

            <button
              onClick={() => setView("pricing")}
              className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-blue hover:text-brand-blue-hover transition-colors underline underline-offset-4 cursor-pointer"
            >
              Full pricing details
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* ── 8. FAQ ───────────────────────────────────────────────────────────── */}
      <section className="bg-white py-20 sm:py-24 border-b border-slate-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="text-center mb-12"
          >
            <motion.div
              variants={fadeUp}
              className="mb-3 inline-flex items-center gap-2 rounded-full bg-brand-blue/10 px-4 py-1.5 text-sm font-semibold text-brand-blue"
            >
              <HelpCircle className="h-4 w-4" />
              Organiser FAQ
            </motion.div>
            <motion.h2
              variants={fadeUp}
              className="text-3xl sm:text-4xl font-extrabold text-dark-text tracking-tight mb-3 font-sans"
            >
              Common questions
            </motion.h2>
            <motion.p
              variants={fadeUp}
              className="text-base text-slate-600 max-w-xl mx-auto font-medium"
            >
              Everything you need to know before you list your first event.
            </motion.p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.5 }}
          >
            <FaqAccordion items={FAQ_ITEMS} />
          </motion.div>
        </div>
      </section>

      {/* ── 9. FINAL CTA ─────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden min-h-[420px] py-28 text-white flex items-center">
        {/* Background — Ken Burns + parallax (same pattern as home CTA) */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-scroll md:bg-fixed animate-ken-burns"
          style={{ backgroundImage: "url('/images/cta-bg.png')" }}
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 bg-gradient-to-br from-slate-900/85 via-blue-900/75 to-slate-900/90"
          aria-hidden="true"
        />

        <div className="relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.4 }}
          >
            <motion.div
              variants={fadeUp}
              className="h-14 w-14 bg-white/10 border border-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6 backdrop-blur-sm"
            >
              <Building2 className="h-7 w-7" />
            </motion.div>

            <motion.h2
              variants={fadeUp}
              className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4 font-sans"
            >
              Ready to start? Create your first event today.
            </motion.h2>

            <motion.p
              variants={fadeUp}
              className="text-base text-white/75 max-w-lg mx-auto mb-8 leading-relaxed font-medium"
            >
              It takes less than five minutes to go live. Free to list — no commitment required.
            </motion.p>

            <motion.div variants={fadeUp}>
              <Link
                href="/organiser/signup"
                className="inline-flex items-center gap-2 bg-brand-blue hover:bg-brand-blue-hover text-white font-extrabold text-sm px-10 py-4 rounded-xl shadow-lg shadow-brand-blue/30 transition-all active:scale-[0.98]"
              >
                Start selling
                <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
