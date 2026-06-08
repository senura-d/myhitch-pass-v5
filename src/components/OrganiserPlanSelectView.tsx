"use client";

import React, { useState } from "react";
import { Check, Zap, Rocket, Star, ArrowRight } from "lucide-react";

interface Plan {
  id: string;
  name: string;
  badge?: string;
  price: string;
  period: string;
  description: string;
  color: "neutral" | "brand" | "dark";
  features: string[];
  cta: string;
}

const PLANS: Plan[] = [
  {
    id: "starter",
    name: "Starter",
    price: "Free",
    period: "forever",
    description: "Perfect for individuals hosting small community events.",
    color: "neutral",
    features: [
      "Up to 3 events per month",
      "Basic ticketing & checkout",
      "Standard analytics",
      "Email support",
      "MYHitch branded pages",
    ],
    cta: "Get Started Free",
  },
  {
    id: "growth",
    name: "Growth",
    badge: "MOST POPULAR",
    price: "$29",
    period: "/month",
    description: "For growing organisers scaling their events and revenue.",
    color: "brand",
    features: [
      "Unlimited events",
      "Custom ticket types & tiers",
      "Promo codes & discounts",
      "Attendee check-in app",
      "Priority email & chat support",
      "Advanced analytics dashboard",
    ],
    cta: "Start 14-Day Free Trial",
  },
  {
    id: "pro",
    name: "Pro",
    price: "$79",
    period: "/month",
    description: "For professional event organisations with high volume.",
    color: "dark",
    features: [
      "Everything in Growth",
      "Same-day payouts",
      "White-label event pages",
      "Dedicated account manager",
      "Custom API integrations",
      "Advanced fraud protection",
    ],
    cta: "Contact Sales",
  },
];

const PLAN_ICONS = {
  starter: <Zap className="h-5 w-5" />,
  growth:  <Rocket className="h-5 w-5" />,
  pro:     <Star className="h-5 w-5" />,
};

interface Props {
  onPlanSelected: (planId: string) => void;
}

export default function OrganiserPlanSelectView({ onPlanSelected }: Props) {
  const [selected, setSelected] = useState<string>("growth");

  const handleContinue = () => {
    onPlanSelected(selected);
  };

  return (
    <div className="min-h-screen bg-[#F0F2F5] font-sans flex flex-col">

      {/* Top bar */}
      <header className="bg-white border-b border-neutral-200 px-8 py-3 flex items-center gap-4">
        <img src="/logo.png" alt="MYHitch PASS" className="h-9 w-auto object-contain" />
        <span className="text-[9px] font-bold uppercase text-neutral-400 tracking-widest border-l border-neutral-200 pl-4">
          Organiser Portal
        </span>
      </header>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-16">

        {/* Heading */}
        <div className="text-center mb-12 max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-[#e6f8ff] text-[#00aeef] text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-5 border border-[#00aeef]/20">
            <Rocket className="h-3.5 w-3.5" />
            Choose Your Plan
          </div>
          <h1 className="text-4xl font-black text-neutral-900 tracking-tight leading-tight mb-4">
            The right plan for<br />your events business
          </h1>
          <p className="text-base text-neutral-500 font-medium">
            Start free, upgrade as you grow. No credit card required for free tier.
            <br />All paid plans include a <span className="text-[#00aeef] font-bold">14-day free trial</span>.
          </p>
        </div>

        {/* Plan Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
          {PLANS.map(plan => {
            const isSelected = selected === plan.id;
            const isBrand    = plan.color === "brand";
            const isDark     = plan.color === "dark";

            return (
              <button
                key={plan.id}
                onClick={() => setSelected(plan.id)}
                className={`relative text-left rounded-2xl p-7 border-2 transition-all duration-200 cursor-pointer focus:outline-none ${
                  isSelected
                    ? isBrand
                      ? "border-[#00aeef] bg-white shadow-xl shadow-[#00aeef]/10 scale-[1.02]"
                      : isDark
                        ? "border-neutral-900 bg-neutral-900 shadow-xl scale-[1.02]"
                        : "border-neutral-400 bg-white shadow-xl scale-[1.02]"
                    : "border-neutral-200 bg-white hover:border-neutral-300 hover:shadow-md"
                }`}
              >
                {/* Popular badge */}
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#00aeef] text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
                    {plan.badge}
                  </div>
                )}

                {/* Plan icon + name */}
                <div className="flex items-center gap-3 mb-4">
                  <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${
                    isBrand ? "bg-[#00aeef] text-white"
                    : isDark ? (isSelected ? "bg-white/10 text-white" : "bg-neutral-100 text-neutral-700")
                    : "bg-neutral-100 text-neutral-600"
                  }`}>
                    {PLAN_ICONS[plan.id as keyof typeof PLAN_ICONS]}
                  </div>
                  <div>
                    <p className={`text-lg font-black leading-none ${isDark && isSelected ? "text-white" : "text-neutral-900"}`}>
                      {plan.name}
                    </p>
                    {isSelected && (
                      <span className="text-[10px] font-bold text-[#00aeef] uppercase tracking-wider">Selected</span>
                    )}
                  </div>
                </div>

                {/* Price */}
                <div className="flex items-end gap-1 mb-2">
                  <span className={`text-4xl font-black leading-none ${isDark && isSelected ? "text-white" : "text-neutral-900"}`}>
                    {plan.price}
                  </span>
                  <span className={`text-sm font-medium mb-1 ${isDark && isSelected ? "text-neutral-400" : "text-neutral-400"}`}>
                    {plan.period}
                  </span>
                </div>

                <p className={`text-sm font-medium mb-5 leading-relaxed ${isDark && isSelected ? "text-neutral-400" : "text-neutral-500"}`}>
                  {plan.description}
                </p>

                {/* Features */}
                <ul className="space-y-2.5 mb-6">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-start gap-2.5 text-sm">
                      <div className={`h-4 w-4 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                        isBrand ? "bg-[#00aeef]/10 text-[#00aeef]"
                        : isDark && isSelected ? "bg-white/10 text-white"
                        : "bg-emerald-50 text-emerald-600"
                      }`}>
                        <Check className="h-2.5 w-2.5" />
                      </div>
                      <span className={isDark && isSelected ? "text-neutral-300" : "text-neutral-600"}>{f}</span>
                    </li>
                  ))}
                </ul>

                {/* Select indicator */}
                <div className={`w-full py-2.5 rounded-xl text-sm font-bold text-center border transition-colors ${
                  isSelected
                    ? isBrand
                      ? "bg-[#00aeef] text-white border-[#00aeef]"
                      : isDark
                        ? "bg-white text-neutral-900 border-white"
                        : "bg-neutral-900 text-white border-neutral-900"
                    : "bg-transparent text-neutral-500 border-neutral-200"
                }`}>
                  {isSelected ? "✓ Selected" : plan.cta}
                </div>
              </button>
            );
          })}
        </div>

        {/* Continue CTA */}
        <div className="mt-10 flex flex-col items-center gap-4">
          <button
            onClick={handleContinue}
            className="flex items-center gap-2 bg-[#00aeef] hover:bg-[#0096cf] text-white font-bold text-base px-10 py-4 rounded-full shadow-lg shadow-[#00aeef]/20 transition-all hover:scale-105 active:scale-95"
          >
            Continue to Dashboard
            <ArrowRight className="h-5 w-5" />
          </button>
          <p className="text-xs text-neutral-400 font-medium">
            You can upgrade or change your plan at any time from Account Settings.
          </p>
        </div>

        {/* Feature comparison teaser */}
        <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl w-full">
          {[
            { icon: "🔒", label: "Secure Payments",    sub: "256-bit SSL encryption" },
            { icon: "⚡", label: "Instant Payouts",    sub: "Direct to your bank" },
            { icon: "📱", label: "Mobile Check-in",    sub: "iOS & Android apps" },
            { icon: "🎯", label: "No Hidden Fees",     sub: "Transparent pricing" },
          ].map(f => (
            <div key={f.label} className="bg-white rounded-xl p-4 text-center border border-neutral-100 shadow-sm">
              <p className="text-2xl mb-1">{f.icon}</p>
              <p className="text-xs font-black text-neutral-700">{f.label}</p>
              <p className="text-[10px] text-neutral-400 font-medium mt-0.5">{f.sub}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
