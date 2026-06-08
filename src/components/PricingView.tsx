"use client";

import { useState } from "react";
import { Check, Info, Calculator, CreditCard, AlertCircle } from "lucide-react";

interface PricingViewProps {
  setView: (view: string) => void;
}

export default function PricingView({ setView }: PricingViewProps) {
  const [ticketPrice, setTicketPrice] = useState<string>("50");
  const [ticketQuantity, setTicketQuantity] = useState<string>("100");
  const [selectedPackage, setSelectedPackage] = useState<"unlimited" | "flex" | "custom">("flex");

  const calcPrice = parseFloat(ticketPrice) || 0;
  const calcQty = parseInt(ticketQuantity) || 0;

  const flexFee = 0.5;
  const unlimitedUpfront = 150;

  const flexBuyerTotal = calcPrice + flexFee;
  const flexOrganiserRevenue = calcPrice * calcQty;

  const unlimitedBuyerTotal = calcPrice;
  const unlimitedOrganiserRevenue = calcPrice * calcQty - unlimitedUpfront;

  const displayBuyerTotal = selectedPackage === "flex" ? flexBuyerTotal : unlimitedBuyerTotal;
  const displayOrgRevenue = selectedPackage === "flex" ? flexOrganiserRevenue : unlimitedOrganiserRevenue;
  const displayPlatformCost = selectedPackage === "flex" ? flexFee * calcQty : unlimitedUpfront;

  return (
    <div className="bg-soft-bg min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-16">

        {/* Header Block */}
        <section className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-blue/10 border border-brand-blue/20 text-brand-blue text-[10px] font-bold uppercase tracking-widest">
            <CreditCard className="h-3.5 w-3.5" />
            <span>Pricing & Packages</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-none font-sans text-neutral-900">
            Simple Pricing to <span className="text-brand-blue">Run Your Event</span>
          </h1>
          <p className="text-sm md:text-base text-neutral-500 font-semibold leading-relaxed">
            Choose how you want to pay — a flat fee upfront or a small per-ticket charge. No hidden fees, no subscriptions.
          </p>
        </section>

        {/* MYHitchPass Packages */}
        <section className="space-y-6 text-left">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Unlimited Card */}
            <div className="bg-white border border-border-gray rounded-3xl p-8 flex flex-col justify-between shadow-xs relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-blue/5 rounded-full blur-2xl pointer-events-none" />
              <div className="space-y-5 relative z-10">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-brand-blue/10 text-brand-blue text-[9px] font-black uppercase tracking-widest mb-3">
                    Fixed Fee Per Event
                  </div>
                  <h3 className="text-lg font-black text-neutral-900 font-sans">MYHitchPass Unlimited</h3>
                  <p className="text-[11px] text-neutral-500 font-semibold mt-1">Ideal for large ticket volumes</p>
                </div>

                <div className="py-3 border-y border-neutral-100">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black tracking-tight text-neutral-900">A$150</span>
                    <span className="text-xs text-neutral-400 font-bold uppercase">/ event</span>
                  </div>
                  <p className="text-[10px] text-neutral-400 font-semibold mt-1">One-time fee when creating the event.</p>
                </div>

                <ul className="space-y-3">
                  {[
                    "Unlimited tickets (no per-ticket platform fee)",
                    "QR check-in + automation included",
                    "Sales dashboard (WooCommerce order tracking)",
                    "Optional marketing support (as offered)",
                  ].map((feat, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-xs text-neutral-650 font-semibold">
                      <Check className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>

                <p className="text-[10px] text-neutral-400 font-semibold italic leading-relaxed pt-1">
                  Unlimited is best when you expect higher ticket volume and want predictable platform cost per event.
                </p>
              </div>

              <button
                onClick={() => setView("organiser-sop")}
                className="w-full mt-7 bg-brand-blue hover:bg-brand-blue-hover text-white font-extrabold text-xs py-3.5 rounded-xl transition-all cursor-pointer shadow-md shadow-brand-blue/20"
              >
                Get Unlimited
              </button>
            </div>

            {/* Flex Card */}
            <div className="bg-white border border-border-gray rounded-3xl p-8 flex flex-col justify-between shadow-xs relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
              <div className="space-y-5 relative z-10">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 text-[9px] font-black uppercase tracking-widest mb-3">
                    No Upfront Fee
                  </div>
                  <h3 className="text-lg font-black text-neutral-900 font-sans">MYHitchPass Flex</h3>
                  <p className="text-[11px] text-neutral-500 font-semibold mt-1">Pay as you go</p>
                </div>

                <div className="py-3 border-y border-neutral-100">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black tracking-tight text-neutral-900">A$0.50</span>
                    <span className="text-xs text-neutral-400 font-bold uppercase">/ ticket</span>
                  </div>
                  <p className="text-[10px] text-neutral-400 font-semibold mt-1">Added to buyer-facing ticket price automatically.</p>
                </div>

                <ul className="space-y-3">
                  {[
                    "No upfront platform fee",
                    "Buyer sees full price (ticket + A$0.50)",
                    "Ideal for smaller events (lower initial commitment)",
                    "Same automation & QR tools included",
                  ].map((feat, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-xs text-neutral-650 font-semibold">
                      <Check className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>

                <p className="text-[10px] text-neutral-400 font-semibold italic leading-relaxed pt-1">
                  Flex is best when you want to avoid upfront fees and prefer a simple per-ticket platform cost.
                </p>
              </div>

              <button
                onClick={() => setView("organiser-sop")}
                className="w-full mt-7 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-extrabold text-xs py-3.5 rounded-xl transition-all cursor-pointer"
              >
                Get Flex
              </button>
            </div>

            {/* Custom Card */}
            <div className="bg-white border border-border-gray rounded-3xl p-8 flex flex-col justify-between shadow-xs relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-2xl pointer-events-none" />
              <div className="space-y-5 relative z-10">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-600 text-[9px] font-black uppercase tracking-widest mb-3">
                    Enterprise Solutions
                  </div>
                  <h3 className="text-lg font-black text-neutral-900 font-sans">MYHitchPass Custom</h3>
                  <p className="text-[11px] text-neutral-500 font-semibold mt-1">For massive scale & unique needs</p>
                </div>

                <div className="py-3 border-y border-neutral-100">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black tracking-tight text-neutral-900">Custom</span>
                  </div>
                  <p className="text-[10px] text-neutral-400 font-semibold mt-1">Tailored pricing based on volume.</p>
                </div>

                <ul className="space-y-3">
                  {[
                    "Custom ticketing volume",
                    "Dedicated account manager",
                    "Custom features & API integrations",
                    "Priority 24/7 support",
                  ].map((feat, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-xs text-neutral-650 font-semibold">
                      <Check className="h-4 w-4 text-purple-500 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>

                <p className="text-[10px] text-neutral-400 font-semibold italic leading-relaxed pt-1">
                  Custom is best for large organizations, festivals, and venues needing bespoke solutions.
                </p>
              </div>

              <button
                onClick={() => setView("organiser-sop")}
                className="w-full mt-7 bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs py-3.5 rounded-xl transition-all cursor-pointer shadow-md shadow-purple-600/20"
              >
                Contact Sales
              </button>
            </div>
          </div>
        </section>

        {/* Calculator */}
        <section className="max-w-3xl mx-auto items-start text-left">

          {/* Income Calculator */}
          <div className="bg-white border border-border-gray rounded-3xl p-8 shadow-xs space-y-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-light-tint rounded-xl flex items-center justify-center text-brand-blue">
                <Calculator className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-neutral-900">Your Income Estimator</h3>
                <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">Compare Unlimited vs Flex earnings</p>
              </div>
            </div>

            {/* Package selector */}
            <div className="space-y-2">
              <label className="block text-[10px] font-bold text-neutral-450 uppercase tracking-wider">Select Package</label>
              <div className="grid grid-cols-3 gap-2">
                {(["unlimited", "flex", "custom"] as const).map((p) => (
                  <button
                    key={p}
                    onClick={() => setSelectedPackage(p)}
                    className={`py-2 px-3 text-xs font-bold rounded-xl border text-center transition-all cursor-pointer capitalize ${
                      selectedPackage === p
                        ? p === "custom" ? "bg-purple-600 border-purple-600 text-white font-extrabold" : "bg-brand-blue border-brand-blue text-white font-extrabold"
                        : "bg-neutral-50 border-neutral-200 text-neutral-600 hover:bg-neutral-100"
                    }`}
                  >
                    {p === "unlimited" ? "Unlimited" : p === "custom" ? "Custom" : "Flex"}
                  </button>
                ))}
              </div>
            </div>

            {selectedPackage === "custom" ? (
              <div className="py-4 space-y-5">
                <div className="text-center space-y-2 mb-4">
                  <div className="inline-flex h-12 w-12 bg-purple-100 rounded-full items-center justify-center text-purple-600 mb-1">
                    <Calculator className="h-6 w-6" />
                  </div>
                  <h4 className="text-sm font-extrabold text-neutral-900">Custom Enterprise Plan</h4>
                  <p className="text-xs text-neutral-500 font-semibold max-w-[280px] mx-auto">
                    Tell us about your event scale and unique requirements, and our team will build a tailored package for you.
                  </p>
                </div>
                
                <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); alert('Thanks for your interest! We will contact you soon.'); }}>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5 text-left">
                      <label className="block text-[10px] font-bold text-neutral-600 uppercase tracking-wider">Your Name</label>
                      <input 
                        type="text" 
                        placeholder="Jane Doe" 
                        className="w-full bg-neutral-50 border border-border-gray rounded-xl py-2.5 px-3.5 text-xs font-semibold focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                      />
                    </div>
                    <div className="space-y-1.5 text-left">
                      <label className="block text-[10px] font-bold text-neutral-600 uppercase tracking-wider">Email Address</label>
                      <input 
                        type="email" 
                        placeholder="jane@company.com" 
                        className="w-full bg-neutral-50 border border-border-gray rounded-xl py-2.5 px-3.5 text-xs font-semibold focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-1.5 text-left">
                    <label className="block text-[10px] font-bold text-neutral-600 uppercase tracking-wider">Event Details & Requirements</label>
                    <textarea 
                      placeholder="Tell us about your expected ticket volume, special integrations, or specific needs..." 
                      rows={3}
                      className="w-full bg-neutral-50 border border-border-gray rounded-xl py-2.5 px-3.5 text-xs font-semibold focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all resize-none"
                    ></textarea>
                  </div>
                  
                  <button 
                    type="submit" 
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs py-3.5 rounded-xl transition-all cursor-pointer shadow-md shadow-purple-600/20 mt-2"
                  >
                    Contact Us for More Details
                  </button>
                </form>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-neutral-600 mb-1.5">Ticket Price (A$)</label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-3 text-xs text-neutral-400 font-black">$</span>
                      <input
                        type="number"
                        min="0"
                        placeholder="50"
                        value={ticketPrice}
                        onChange={(e) => setTicketPrice(e.target.value)}
                        className="w-full bg-neutral-50 border border-border-gray rounded-xl py-2.5 pl-7 pr-3 text-xs font-bold focus:outline-none focus:border-brand-blue focus:bg-white"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-neutral-600 mb-1.5">Tickets to Sell</label>
                    <input
                      type="number"
                      min="1"
                      placeholder="100"
                      value={ticketQuantity}
                      onChange={(e) => setTicketQuantity(e.target.value)}
                      className="w-full bg-neutral-50 border border-border-gray rounded-xl py-2.5 px-3.5 text-xs font-bold focus:outline-none focus:border-brand-blue focus:bg-white"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-neutral-100 space-y-3.5">
                  <div className="flex items-center justify-between text-xs text-neutral-600 font-semibold">
                    <span>Buyer pays per ticket</span>
                    <span className="font-extrabold text-neutral-900">A${displayBuyerTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-neutral-600 font-semibold">
                    <span>Total platform cost</span>
                    <span className="font-extrabold text-neutral-800">-A${displayPlatformCost.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-neutral-800 font-extrabold border-t border-neutral-100 pt-3">
                    <span className="text-neutral-900">Your Total Revenue</span>
                    <span className="text-emerald-600 text-lg">A${displayOrgRevenue >= 0 ? displayOrgRevenue.toLocaleString() : 0}.00</span>
                  </div>
                </div>

                <div className="bg-neutral-50 rounded-2xl p-4 flex items-start gap-3 border border-neutral-150">
                  <Info className="h-4.5 w-4.5 text-brand-blue shrink-0 mt-0.5" />
                  <p className="text-[11px] text-neutral-500 font-semibold leading-relaxed">
                    With Flex, the A$0.50 fee is added to the buyer's ticket price. With Unlimited, you pay A$150 upfront and sell unlimited tickets with no per-ticket platform charge.
                  </p>
                </div>
              </>
            )}
          </div>

        </section>

        {/* Buyer info & settlements - Separate Section */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch text-left">
          <div className="bg-white border border-border-gray rounded-3xl p-8 shadow-xs space-y-4">
            <h3 className="text-base font-extrabold text-neutral-900 font-sans tracking-wide">For Ticket Buyers</h3>
            <p className="text-xs text-neutral-550 leading-relaxed font-semibold">
              We believe in ticketing transparency. Buyers will always see the exact total price before paying. There are no surprise fees at the end.
            </p>
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3">
                <span className="h-2 w-2 rounded-full bg-brand-blue shrink-0" />
                <span className="text-xs text-neutral-600 font-semibold">No surprise credit card fees on checkouts</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="h-2 w-2 rounded-full bg-brand-blue shrink-0" />
                <span className="text-xs text-neutral-600 font-semibold">Tickets delivered instantly to their phone via email</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="h-2 w-2 rounded-full bg-brand-blue shrink-0" />
                <span className="text-xs text-neutral-600 font-semibold">100% money-back guarantee if the event is cancelled</span>
              </div>
            </div>
          </div>

          <div className="bg-indigo-950 text-white rounded-3xl p-8 shadow-xs relative overflow-hidden flex flex-col justify-center">
            <div className="absolute top-0 right-0 w-24 h-24 bg-brand-blue/20 rounded-full blur-2xl pointer-events-none" />
            <div className="space-y-4 relative z-10">
              <div className="flex items-center gap-2 text-brand-blue">
                <AlertCircle className="h-5 w-5" />
                <span className="text-xs font-black uppercase tracking-wider font-sans">Payment Processing</span>
              </div>
              <h4 className="text-base font-extrabold">Instant Bank Settlements</h4>
              <p className="text-xs text-neutral-400 font-semibold leading-relaxed">
                Payouts are handled securely via Stripe. When your event ends, Stripe processes the funds and credits your nominated Australian bank account within 2 to 5 business days automatically.
              </p>
              <div>
                <button
                  onClick={() => setView("organiser-sop")}
                  className="bg-brand-blue hover:bg-brand-blue-hover text-white font-extrabold text-xs px-5 py-2.5 rounded-xl transition-all cursor-pointer inline-block"
                >
                  Onboarding SOP
                </button>
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
