"use client";

import { RealTicketsIcon, BuyFastIcon, AllTicketsIcon, HostEventIcon, HonestPricesIcon, BankConnectIcon } from "./CustomIcons";

interface BenefitCard {
  icon: React.ComponentType<{ className?: string }>;
  stat: string;
  statLabel: string;
  title: string;
  description: string;
  hero?: boolean;
  bullets?: string[];
}

const benefitCards: BenefitCard[] = [
  {
    icon: RealTicketsIcon,
    stat: "100%",
    statLabel: "verified, no fakes",
    title: "Real tickets, every time",
    description: "Every ticket is checked by us. No fakes, no duplicates, no scams — just walk in.",
    hero: true,
    bullets: ["No fakes", "No duplicates", "No scams"],
  },
  {
    icon: BuyFastIcon,
    stat: "~45s",
    statLabel: "average checkout",
    title: "Buy in under a minute",
    description: "Pick your event, pay, and your ticket lands on your phone. No long forms, no fuss.",
  },
  {
    icon: AllTicketsIcon,
    stat: "1",
    statLabel: "account, every device",
    title: "All your tickets in one place",
    description: "Your tickets are saved in your account. Open them on any phone or computer when you need them.",
  },
  {
    icon: HostEventIcon,
    stat: "Free",
    statLabel: "to list your event",
    title: "Anyone can host an event",
    description: "No big company needed. Just name your event, set a price, and start selling tickets today.",
  },
  {
    icon: HonestPricesIcon,
    stat: "$0",
    statLabel: "hidden fees",
    title: "Honest prices",
    description: "The price you see is the price you pay. No surprise charges added at the end.",
  },
  {
    icon: BankConnectIcon,
    stat: "2–3 days",
    statLabel: "to your account",
    title: "Get paid into your bank",
    description: "When people buy your tickets, the money goes straight to your bank account in a few days.",
  },
];

function HeroCard({ card }: { card: BenefitCard }) {
  const Icon = card.icon;
  return (
    <div className="relative overflow-hidden rounded-2xl p-6 bg-gradient-to-br from-blue-600 to-blue-500 flex flex-col justify-between shadow-lg shadow-blue-600/20 min-h-[220px]">
      {/* Watermark */}
      <div className="absolute bottom-2 right-2 pointer-events-none select-none" aria-hidden="true">
        <Icon className="h-28 w-28 text-white opacity-[0.08]" />
      </div>

      <div>
        {/* Icon badge */}
        <div className="h-11 w-11 rounded-2xl bg-white/20 flex items-center justify-center mb-4">
          <Icon className="h-6 w-6 text-white" />
        </div>

        {/* Stat */}
        <div className="mb-3">
          <p className="text-4xl font-extrabold text-white leading-none tracking-tight">{card.stat}</p>
          <p className="text-xs text-blue-100 font-semibold mt-1">{card.statLabel}</p>
        </div>

        <h3 className="text-sm font-extrabold text-white mb-2">{card.title}</h3>
        <p className="text-blue-100 text-xs sm:text-sm leading-relaxed font-semibold">{card.description}</p>
      </div>

      {/* Checkmark bullets */}
      {card.bullets && (
        <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-5 relative z-10">
          {card.bullets.map((b) => (
            <span key={b} className="flex items-center gap-1 text-xs text-white font-bold">
              <span className="text-blue-200 font-black">✓</span> {b}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function LightCard({ card }: { card: BenefitCard }) {
  const Icon = card.icon;
  return (
    <div className="group relative overflow-hidden rounded-2xl p-6 bg-white border border-gray-100 shadow-sm hover:-translate-y-1 hover:shadow-lg transition-all duration-200 flex flex-col min-h-[220px]">
      {/* Top accent bar on hover */}
      <div className="absolute inset-x-0 top-0 h-0.5 rounded-t-2xl bg-gradient-to-r from-blue-600 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />

      {/* Watermark */}
      <div className="absolute bottom-2 right-2 pointer-events-none select-none" aria-hidden="true">
        <Icon className="h-24 w-24 text-blue-900 opacity-[0.04]" />
      </div>

      {/* Icon badge */}
      <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-500 flex items-center justify-center mb-4 shadow-sm flex-shrink-0">
        <Icon className="h-5 w-5 text-white" />
      </div>

      {/* Stat */}
      <div className="mb-3">
        <p className="text-4xl font-extrabold text-brand-blue leading-none tracking-tight">{card.stat}</p>
        <p className="text-xs text-neutral-400 font-semibold mt-1">{card.statLabel}</p>
      </div>

      <h3 className="text-sm font-extrabold text-dark-text mb-2 tracking-tight relative z-10">{card.title}</h3>
      <p className="text-neutral-500 text-xs sm:text-sm leading-relaxed font-semibold relative z-10">{card.description}</p>
    </div>
  );
}

export default function Benefits() {
  return (
    <div
      id="benefits-section"
      className="bg-gradient-to-b from-white to-blue-50/40 py-16 px-4 sm:px-6 lg:px-8 border-b border-border-gray"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-black text-dark-text tracking-tight sm:text-4xl">
            Why people choose MYHitch Pass
          </h2>
          <p className="mt-3 text-neutral-500 max-w-xl mx-auto text-xs sm:text-sm font-semibold leading-relaxed">
            Simple to use, safe to pay, and built for anyone — whether you're going to events or hosting your own.
          </p>
        </div>

        {/* Clean 3×2 grid — no orphan */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {benefitCards.map((card, i) =>
            card.hero ? (
              <HeroCard key={i} card={card} />
            ) : (
              <LightCard key={i} card={card} />
            )
          )}
        </div>
      </div>
    </div>
  );
}
