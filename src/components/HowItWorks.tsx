"use client";

import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { FindEventIcon, PaySafelyIcon, ShowPhoneIcon, SignUpIcon, AddEventIcon, GetPaidIcon } from "./CustomIcons";

interface Step {
  num: string;
  Icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}

const attendeeSteps: Step[] = [
  {
    num: "01",
    Icon: FindEventIcon,
    title: "Find an event",
    description: "Search by event type, artist, or your city. Pick one you like.",
  },
  {
    num: "02",
    Icon: PaySafelyIcon,
    title: "Pay safely",
    description: "Choose your ticket, enter your details, and pay. Takes about a minute.",
  },
  {
    num: "03",
    Icon: ShowPhoneIcon,
    title: "Show your phone at the door",
    description: "Your ticket is saved in your account. Open it on your phone and walk in.",
  },
];

const organizerSteps: Step[] = [
  {
    num: "01",
    Icon: SignUpIcon,
    title: "Sign up — it's free",
    description: "Tell us your name, email, and address. We'll send you a login by email in a few minutes.",
  },
  {
    num: "02",
    Icon: AddEventIcon,
    title: "Add your event",
    description: "Set a name, date, place, and ticket price. Publish it and it goes live straight away.",
  },
  {
    num: "03",
    Icon: GetPaidIcon,
    title: "Get paid into your bank",
    description: "Money from ticket sales lands in your bank a few days after the event. Simple.",
  },
];

export default function HowItWorks() {
  const [activeTab, setActiveTab] = useState<"attendee" | "organizer">("attendee");
  const currentSteps = activeTab === "attendee" ? attendeeSteps : organizerSteps;

  return (
    <div id="how-it-works-section" className="bg-white py-16 px-4 sm:px-6 lg:px-8 border-b border-border-gray">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-12">
          <h2 className="text-3xl font-black text-dark-text tracking-tight sm:text-4xl">
            How it works — in 3 steps
          </h2>
          <p className="mt-3 text-neutral-500 max-w-sm text-xs sm:text-sm font-semibold leading-relaxed">
            Choose the side you want to see — buying tickets, or selling them.
          </p>

          {/* Tab toggle — kept exactly as-is */}
          <div className="mt-8 inline-flex p-1.5 rounded-full bg-soft-bg border border-border-gray">
            <button
              id="how-tab-attendee"
              onClick={() => setActiveTab("attendee")}
              className={`px-6 py-2 rounded-full text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === "attendee"
                  ? "bg-brand-blue text-white shadow-md shadow-brand-blue/15"
                  : "text-neutral-500 hover:text-dark-text"
              }`}
            >
              I want tickets
            </button>
            <button
              id="how-tab-organizer"
              onClick={() => setActiveTab("organizer")}
              className={`px-6 py-2 rounded-full text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === "organizer"
                  ? "bg-brand-blue text-white shadow-md shadow-brand-blue/15"
                  : "text-neutral-500 hover:text-dark-text"
              }`}
            >
              I want to sell tickets
            </button>
          </div>
        </div>

        {/* Steps grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Dashed connector line — desktop only, sits at icon center (~48px from card top) */}
          <div
            className="hidden md:block absolute pointer-events-none z-0"
            style={{ top: "48px", left: "16.5%", right: "16.5%", borderTop: "2px dashed #bfdbfe" }}
          />

          {/* Arrow at gap between step 1 and 2 */}
          <div className="hidden md:flex absolute z-10 h-6 w-6 rounded-full bg-blue-50 border-2 border-blue-200 items-center justify-center pointer-events-none"
            style={{ top: "36px", left: "calc(33.33% - 12px)" }}>
            <ChevronRight className="h-3.5 w-3.5 text-blue-500" />
          </div>

          {/* Arrow at gap between step 2 and 3 */}
          <div className="hidden md:flex absolute z-10 h-6 w-6 rounded-full bg-blue-50 border-2 border-blue-200 items-center justify-center pointer-events-none"
            style={{ top: "36px", left: "calc(66.67% - 12px)" }}>
            <ChevronRight className="h-3.5 w-3.5 text-blue-500" />
          </div>

          {currentSteps.map((step, idx) => {
            const { Icon } = step;
            return (
              <div
                key={`${activeTab}-${idx}`}
                className="relative p-6 bg-soft-bg border border-border-gray rounded-[32px] flex flex-col items-center text-center group hover:-translate-y-1 hover:shadow-lg transition-all duration-200 shadow-sm"
              >
                {/* Progress dot on step 1 */}
                {idx === 0 && (
                  <div className="absolute top-4 left-4 h-2.5 w-2.5 rounded-full bg-brand-blue shadow-sm shadow-brand-blue/50" />
                )}

                {/* Step number — gradient blue */}
                <div className="absolute top-4 right-5 leading-none" aria-hidden="true">
                  <span className="text-5xl font-black font-mono bg-gradient-to-br from-blue-400 to-blue-600 bg-clip-text text-transparent">
                    {step.num}
                  </span>
                </div>

                {/* Icon badge — solid blue gradient */}
                <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-500 flex items-center justify-center mb-5 shadow-md shadow-blue-600/25 flex-shrink-0 relative z-10">
                  <Icon className="h-5 w-5 text-white" />
                </div>

                <h3 className="text-sm font-extrabold text-dark-text mb-2 leading-tight">{step.title}</h3>
                <p className="text-neutral-500 text-xs sm:text-sm leading-relaxed max-w-xs font-semibold">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
