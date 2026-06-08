"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle } from "lucide-react";
import { HeroHighlight, Highlight } from "@/components/ui/hero-highlight";

interface FAQItem {
  question: string;
  answer: string;
}

const FAQ_ITEMS: FAQItem[] = [
  {
    question: "How much does it cost to list an event?",
    answer:
      "It is completely free to create an account, list your event, and set up ticket types. There are no setup fees or subscription costs. We only charge a small processing fee per ticket, which is typically paid by the ticket buyer at checkout.",
  },
  {
    question: "How and when do I get paid?",
    answer:
      "Your ticket sales revenue is processed automatically and deposited directly into your bank account. Payouts are made on a rolling basis, arriving in your bank within 2–3 business days after each ticket sale. No long waiting periods or lock-ups.",
  },
  {
    question: "Do I need a registered company to list events?",
    answer:
      "Not at all! MYHitch Pass is built for everyone. Whether you are an independent host running a one-off workshop, a local club coordinator, an artist, or a commercial promoter, you can easily sign up and start selling tickets immediately.",
  },
  {
    question: "How do I check in attendees at the venue?",
    answer:
      "You can manage entry easily on the day of the event using your organiser dashboard. It includes a built-in mobile scanner that lets you scan ticket QR codes in real-time from any smartphone or tablet. No special hardware required.",
  },
  {
    question: "Can I create different ticket tiers and discount codes?",
    answer:
      "Yes! Your dashboard allows you to create multiple ticket types (such as VIP, Early Bird, and General Admission), configure maximum capacity limits for each tier, and generate custom percentage or fixed-amount discount codes.",
  },
];

export default function OrganiserFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <HeroHighlight
      containerClassName="w-full py-20 sm:py-24 bg-soft-bg border-b border-slate-100"
      className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-center"
    >
      {/* Section Header */}
      <div className="mb-16">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-brand-blue/10 px-4 py-1.5 text-sm font-semibold text-brand-blue">
          <HelpCircle className="h-4 w-4" />
          Support & FAQ
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-dark-text tracking-tight mb-3 font-sans">
          Frequently asked <Highlight className="text-dark-text font-extrabold">questions</Highlight>
        </h2>
        <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-medium max-w-2xl mx-auto font-sans">
          Find answers to common questions about setting up your events and selling tickets on MYHitch Pass.
        </p>
      </div>

      {/* FAQ Accordion List */}
      <div className="space-y-4 text-left">
        {FAQ_ITEMS.map((item, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={index}
              className="border border-slate-200/80 rounded-2xl overflow-hidden transition-all duration-300 bg-white"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex items-center justify-between p-6 text-left font-sans focus:outline-none group cursor-pointer"
              >
                <span className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-brand-blue transition-colors duration-200 pr-4">
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
                      <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-medium pt-4 font-sans">
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
    </HeroHighlight>
  );
}
