"use client";

import { useState, useEffect, useRef } from "react";
import { Search, Mail, Check, Globe, Video, Headphones, Zap, Clock, Globe2, ChevronRight, Cpu, Settings, Wrench, ArrowRight } from "lucide-react";

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

const ORGANISER_STATS = [
  { value: 1100, prefix: "", suffix: "+", label: "Organisers" },
  { value: 4200, prefix: "", suffix: "+", label: "Events listed" },
  { value: 2100000, prefix: "$", suffix: "", label: "Paid out" },
  { value: 38, prefix: "", suffix: "", label: "Cities" },
];

interface ServicersViewProps {
  setView: (view: string) => void;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function ServicersView({ setView }: ServicersViewProps) {
  const statsRef = useRef<HTMLDivElement>(null);
  const [statsStarted, setStatsStarted] = useState(false);

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
    <div className="relative bg-soft-bg min-h-screen pb-10">
      {/* Background dot pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1.5px,transparent_1.5px)] [background-size:24px_24px] opacity-80 pointer-events-none" />
      
      <div className="relative">
        {/* ── DIGITAL SERVICES HERO (FULL WIDTH) ── */}
        <section className="relative min-h-[520px] md:min-h-[580px] flex items-center justify-center overflow-hidden text-white w-full">
          {/* Background image with slow ken-burns zoom */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1600&q=80')`,
              animation: "heroImageAnim 14000ms ease-in-out infinite alternate",
              willChange: "opacity, transform",
            }}
          />
          {/* Layered dark overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-900/70 to-neutral-800/50" />
          {/* Blue tint accent */}
          <div className="absolute inset-0 bg-gradient-to-br from-brand-blue/20 via-transparent to-transparent" />
          {/* Dot texture */}
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff08_1.2px,transparent_1.2px)] [background-size:20px_20px] opacity-70" />

          {/* Content */}
          <div className="relative z-10 max-w-3xl mx-auto px-6 py-16 text-center space-y-7">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-white text-[10px] font-bold uppercase tracking-widest backdrop-blur-md">
              <Cpu className="h-3.5 w-3.5 text-brand-blue" />
              <span>MYHitch Digital Services</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-[1.05] font-sans">
              Digital services that help<br className="hidden sm:inline" /> your events run{" "}
              <span className="bg-gradient-to-r from-brand-blue to-sky-300 bg-clip-text text-transparent">smarter, faster</span>{" "}
              and better.
            </h1>

            <p className="text-sm md:text-base text-neutral-300 font-semibold leading-relaxed max-w-xl mx-auto">
              MYHitch Pass offers hosting, creative media, IT support, customisation, and platform assistance — all in one place.
            </p>

            {/* Stat callouts */}
            <div className="flex flex-wrap justify-center gap-5 pt-1">
              {[
                { icon: Zap, label: "95% Automated" },
                { icon: Clock, label: "24/7 Support" },
                { icon: Globe2, label: "End-to-End" },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2 text-xs font-bold text-neutral-200 bg-white/10 border border-white/15 backdrop-blur-sm px-4 py-2 rounded-full">
                  <Icon className="h-3.5 w-3.5 text-brand-blue" />
                  <span>{label}</span>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap justify-center gap-3 pt-1">
              <a
                href="#digital-services-detail"
                className="flex items-center gap-1.5 bg-brand-blue hover:bg-brand-blue-hover text-white font-extrabold text-xs px-6 py-3 rounded-full transition-all shadow-lg shadow-brand-blue/30 cursor-pointer hover:-translate-y-0.5 duration-200"
              >
                <Globe className="h-3.5 w-3.5" />
                <span>Explore Services</span>
              </a>
              <a
                href="#how-we-work"
                className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 border border-white/25 text-white font-extrabold text-xs px-6 py-3 rounded-full backdrop-blur-sm transition-all cursor-pointer hover:-translate-y-0.5 duration-200"
              >
                <ArrowRight className="h-3.5 w-3.5" />
                <span>How We Work</span>
              </a>
            </div>
          </div>
        </section>

        {/* ── TRUST STRIP (FULL WIDTH) ── */}
        <div
          ref={statsRef}
          className="bg-gradient-to-r from-blue-600 via-sky-500 to-cyan-400 py-12 px-4 sm:px-6 lg:px-8 shadow-[0_4px_24px_0_rgba(2,132,199,0.35)] w-full relative z-20"
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
      </div>

      <div className="relative max-w-6xl mx-auto space-y-12 mt-12 px-4 sm:px-6 lg:px-8">

        {/* ── SERVICES OVERVIEW CARDS (3) ── */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            {
              icon: Globe,
              color: "blue",
              label: "Hosting",
              title: "Hosting Solutions",
              desc: "Speed-optimised hosting, domain management, DNS configuration, and full technical setup for your event platform.",
              image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80",
            },
            {
              icon: Video,
              color: "purple",
              label: "Creative Media",
              title: "Video & Image Editing",
              desc: "Promos, social media reels, branded visuals, and highlight packages crafted for your audience.",
              image: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=600&q=80",
            },
            {
              icon: Headphones,
              color: "emerald",
              label: "IT Support",
              title: "IT Support & Customisation",
              desc: "Troubleshooting, platform integrations, workflow tweaks, and ongoing technical assistance.",
              image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=600&q=80",
            },
          ].map(({ icon: Icon, color, label, title, desc, image }) => (
            <div key={title} className="bg-white border border-border-gray rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all group flex flex-col">
              {/* Image header */}
              <div className="relative h-44 overflow-hidden">
                <img
                  src={image}
                  alt={title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/60 via-transparent to-transparent" />
                {/* Category badge */}
                <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md border border-neutral-100 text-neutral-800 font-extrabold text-[10px] uppercase tracking-wider px-3 py-1 rounded-full shadow-sm">
                  {label}
                </div>
                {/* Icon badge */}
                <div className={`absolute top-3 right-3 h-8 w-8 rounded-full flex items-center justify-center shadow-sm ${
                  color === "blue" ? "bg-brand-blue text-white" :
                  color === "purple" ? "bg-purple-500 text-white" :
                  "bg-emerald-500 text-white"
                }`}>
                  <Icon className="h-4 w-4" />
                </div>
              </div>
              {/* Content */}
              <div className="p-6 flex flex-col flex-1 space-y-3">
                <h3 className="font-extrabold text-neutral-900 text-sm">{title}</h3>
                <p className="text-xs text-neutral-500 font-semibold leading-relaxed flex-1">{desc}</p>
                <div className={`inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider cursor-pointer pt-1 ${
                  color === "blue" ? "text-brand-blue" :
                  color === "purple" ? "text-purple-600" :
                  "text-emerald-600"
                }`}>
                  <span>Learn more</span>
                  <ChevronRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* ── DETAILED SERVICES SECTION ── */}
        <section id="digital-services-detail" className="space-y-5">
          <div className="text-center space-y-1.5">
            <p className="text-[10px] font-black uppercase tracking-widest text-brand-blue">What We Provide</p>
            <h2 className="text-2xl md:text-3xl font-black text-neutral-900 font-sans tracking-tight">Full-service digital support</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                icon: Globe,
                color: "blue",
                label: "Hosting",
                title: "Hosting Solutions",
                image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80",
                points: [
                  "Website setup and deployment on managed servers",
                  "DNS configuration, domain linking & SSL setup",
                  "Uptime monitoring and performance optimisation",
                  "Ongoing maintenance and server-side updates",
                ],
              },
              {
                icon: Video,
                color: "purple",
                label: "Creative Media",
                title: "Video & Image Editing",
                image: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=600&q=80",
                points: [
                  "Promotional video edits for events and campaigns",
                  "Social media graphics, posters and branded visuals",
                  "Highlight reels and post-event recap packages",
                  "Web-optimised image compression and formatting",
                ],
              },
              {
                icon: Headphones,
                color: "emerald",
                label: "IT Support",
                title: "IT Support & Customisation",
                image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=600&q=80",
                points: [
                  "Bug fixes, platform debugging and error resolution",
                  "Dashboard customisation and feature configuration",
                  "WooCommerce, plugin, and third-party integrations",
                  "Ongoing operational support and workflow tweaks",
                ],
              },
            ].map(({ icon: Icon, color, label, title, image, points }) => (
              <div key={title} className="bg-white border border-border-gray rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all group flex flex-col">
                {/* Image header */}
                <div className="relative h-36 overflow-hidden">
                  <img
                    src={image}
                    alt={title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/70 via-neutral-900/20 to-transparent" />
                  {/* Category label */}
                  <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md border border-neutral-100 text-neutral-800 font-extrabold text-[10px] uppercase tracking-wider px-3 py-1 rounded-full shadow-sm">
                    {label}
                  </div>
                  {/* Icon sits over the bottom of the image */}
                  <div className={`absolute bottom-3 right-3 h-9 w-9 rounded-xl flex items-center justify-center shadow-md ${
                    color === "blue" ? "bg-brand-blue text-white" :
                    color === "purple" ? "bg-purple-500 text-white" :
                    "bg-emerald-500 text-white"
                  }`}>
                    <Icon className="h-4.5 w-4.5" />
                  </div>
                </div>
                {/* Content */}
                <div className="p-6 flex flex-col flex-1 space-y-4">
                  <h3 className="font-extrabold text-neutral-900 text-sm">{title}</h3>
                  <ul className="space-y-2.5 flex-1">
                    {points.map((pt) => (
                      <li key={pt} className="flex items-start gap-2.5 text-xs text-neutral-600 font-semibold leading-relaxed">
                        <div className={`h-4 w-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                          color === "blue" ? "bg-brand-blue/10 text-brand-blue" :
                          color === "purple" ? "bg-purple-500/10 text-purple-600" :
                          "bg-emerald-500/10 text-emerald-600"
                        }`}>
                          <Check className="h-2.5 w-2.5" />
                        </div>
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── TRUST / VALUE SECTION ── */}
        <section className="bg-white border border-border-gray rounded-2xl p-8 shadow-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-blue/10 border border-brand-blue/20 text-brand-blue text-[10px] font-bold uppercase tracking-widest">
                <Zap className="h-3.5 w-3.5" />
                <span>95% Automated System</span>
              </div>
              <h3 className="text-xl md:text-2xl font-black text-neutral-900 font-sans tracking-tight leading-snug">
                Built to support real organisers
              </h3>
              <p className="text-xs text-neutral-500 font-semibold leading-relaxed">
                Our digital services are engineered around the specific demands of event organisers — reducing manual overhead so you can focus on what matters most.
              </p>
            </div>
            <div className="space-y-3">
              {[
                { icon: Clock, title: "Fast Response", desc: "Critical requests handled within hours, not days." },
                { icon: Settings, title: "Custom Improvements", desc: "Platform tweaks and feature additions tailored to your workflow." },
                { icon: Globe2, title: "Multi-Domain Support", desc: "Manage multiple event brands under a single support umbrella." },
              ].map(({ icon: Icon, title, desc }) => (
                <div key={title} className="flex items-start gap-3 p-3.5 bg-neutral-50 rounded-xl border border-neutral-100">
                  <div className="h-8 w-8 rounded-lg bg-brand-blue/10 text-brand-blue flex items-center justify-center flex-shrink-0">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-extrabold text-neutral-800">{title}</p>
                    <p className="text-[11px] text-neutral-500 font-semibold mt-0.5">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── PROCESS SECTION ── */}
        <section id="how-we-work" className="space-y-6">
          <div className="text-center space-y-1.5">
            <p className="text-[10px] font-black uppercase tracking-widest text-brand-blue">How We Work</p>
            <h2 className="text-2xl md:text-3xl font-black text-neutral-900 font-sans tracking-tight">Four steps from inquiry to done</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { step: "01", icon: Search, title: "Understand", desc: "We review your platform needs, pain points, and goals before recommending anything." },
              { step: "02", icon: Wrench, title: "Plan", desc: "We map out the right service path — hosting stack, editing scope, or IT fix list." },
              { step: "03", icon: Cpu, title: "Build", desc: "We deliver the work with regular updates and checkpoints along the way." },
              { step: "04", icon: Headphones, title: "Support", desc: "Ongoing improvements, fast responses, and proactive monitoring after go-live." },
            ].map(({ step, icon: Icon, title, desc }, idx) => (
              <div key={step} className="relative bg-white border border-border-gray rounded-2xl p-6 shadow-xs space-y-3">
                {idx < 3 && (
                  <div className="hidden lg:block absolute top-1/2 -right-2.5 -translate-y-1/2 z-10">
                    <ArrowRight className="h-4 w-4 text-neutral-300" />
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-black text-brand-blue uppercase tracking-widest">{step}</span>
                  <div className="h-8 w-8 rounded-lg bg-brand-blue/10 text-brand-blue flex items-center justify-center">
                    <Icon className="h-4 w-4" />
                  </div>
                </div>
                <h4 className="font-extrabold text-neutral-900 text-sm">{title}</h4>
                <p className="text-[11px] text-neutral-500 font-semibold leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── CTA FOOTER BANNER ── */}
        <section className="bg-gradient-to-r from-brand-blue to-blue-600 rounded-2xl px-8 py-10 text-white">
          <div className="max-w-3xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-3 text-center md:text-left">
              <p className="text-[10px] font-black uppercase tracking-widest text-blue-200">Get Started</p>
              <h3 className="text-xl md:text-2xl font-black font-sans tracking-tight">Need extra support?</h3>
              <p className="text-xs text-blue-100 font-semibold">Reach out and we'll match you with the right digital service for your event operations.</p>
              <div className="flex flex-wrap gap-2 justify-center md:justify-start pt-1">
                {["Hosting Support", "Creative Editing", "Customisation", "IT Assistance"].map((tag) => (
                  <span key={tag} className="bg-white/15 border border-white/20 text-white text-[10px] font-bold px-3 py-1 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <a
              href="/contact"
              className="flex-shrink-0 flex items-center gap-2 bg-white text-brand-blue hover:bg-blue-50 font-extrabold text-xs px-6 py-3 rounded-xl transition-all shadow-md cursor-pointer"
            >
              <Mail className="h-3.5 w-3.5" />
              <span>Contact Us</span>
            </a>
          </div>
        </section>

      </div>
    </div>
  );
}
