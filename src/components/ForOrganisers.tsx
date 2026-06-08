"use client";

import React from "react";
import { motion, Variants } from "framer-motion";
import { Zap, Clock, BarChart3, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { HeroHighlight, Highlight } from "@/components/ui/hero-highlight";

interface BenefitCard {
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface ForOrganisersProps {
  heading?: string;
  subtitle?: string;
  benefits?: BenefitCard[];
  className?: string;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

export default function ForOrganisers({
  heading = "Built for organisers",
  subtitle = "Everything you need to create, manage, and grow your events with confidence.",
  benefits = [
    {
      icon: <Zap className="h-6 w-6" />,
      title: "List in minutes",
      description:
        "Create your event, set a price, and go live the same day. No approvals, no waiting.",
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: "Get paid fast",
      description:
        "Money from ticket sales lands in your bank within 2–3 days. No lock-ups.",
    },
    {
      icon: <BarChart3 className="h-6 w-6" />,
      title: "Manage everything in one place",
      description:
        "Track sales, scan tickets at the door, and see who's coming — all from your dashboard.",
    },
  ],
  className = "",
}: ForOrganisersProps) {
  const cardColors = [
    {
      bg: "bg-brand-blue",
      hoverBg: "group-hover:bg-brand-blue-hover",
      gradient: "from-brand-blue/10 via-brand-blue/5 to-transparent",
    },
    {
      bg: "bg-sky-500",
      hoverBg: "group-hover:bg-sky-600",
      gradient: "from-sky-500/10 via-sky-500/5 to-transparent",
    },
    {
      bg: "bg-indigo-500",
      hoverBg: "group-hover:bg-indigo-600",
      gradient: "from-indigo-500/10 via-indigo-500/5 to-transparent",
    },
  ];

  return (
    <HeroHighlight
      containerClassName={`w-full py-20 md:py-24 border-y border-slate-100/80 bg-white ${className}`}
      className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8"
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="flex flex-col items-center text-center w-full"
      >
        <motion.div
          variants={itemVariants}
          className="mb-3 inline-flex items-center gap-2 rounded-full bg-brand-blue/10 px-4 py-1.5 text-sm font-semibold text-brand-blue"
        >
          <Sparkles className="h-4 w-4" />
          For Event Organisers
        </motion.div>

        <motion.h2
          variants={itemVariants}
          className="mb-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl md:text-5xl font-sans"
        >
          {heading === "Built for organisers" ? (
            <>
              Built for <Highlight className="text-slate-900 font-extrabold">organisers</Highlight>
            </>
          ) : (
            heading
          )}
        </motion.h2>
        <motion.p
          variants={itemVariants}
          className="mb-12 max-w-2xl text-base text-slate-600 sm:text-lg font-medium"
        >
          {subtitle}
        </motion.p>

        <div className="grid w-full grid-cols-1 gap-8 md:grid-cols-3">
          {benefits.map((benefit, index) => {
            const colors = cardColors[index % cardColors.length];
            return (
              <motion.div key={index} variants={itemVariants} className="h-full">
                <Card className="group relative h-full overflow-hidden rounded-2xl border border-slate-200/60 bg-white p-8 shadow-sm transition-all duration-500 hover:-translate-y-2 hover:border-slate-300/80 hover:shadow-xl text-left">
                  {/* Gradient overlay */}
                  <div
                    className={`absolute inset-0 -z-10 bg-gradient-to-br ${colors.gradient} opacity-0 transition-opacity duration-500 group-hover:opacity-100`}
                  />

                  {/* Animated icon container */}
                  <motion.div
                    className={`mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl ${colors.bg} text-white shadow-lg transition-all duration-500 ${colors.hoverBg} group-hover:scale-110 group-hover:shadow-xl`}
                    whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                    transition={{ duration: 0.5 }}
                  >
                    {benefit.icon}
                  </motion.div>

                  {/* Number badge */}
                  <div className="absolute right-6 top-6 flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-400 transition-colors group-hover:bg-slate-200 group-hover:text-slate-600">
                    {index + 1}
                  </div>

                  <h3 className="mb-3 text-lg font-bold text-slate-900 transition-colors sm:text-xl group-hover:text-slate-950 font-sans">
                    {benefit.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-slate-600 sm:text-base font-medium">
                    {benefit.description}
                  </p>

                  {/* Decorative corner accent */}
                  <div className="absolute -bottom-8 -right-8 h-16 w-16 rounded-full bg-slate-100 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                </Card>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </HeroHighlight>
  );
}
