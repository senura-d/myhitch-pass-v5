import { ShieldCheck, Sparkles, Users, Award, Heart, CheckCircle2 } from "lucide-react";
import { RealTicketsIcon, HonestPricesIcon, HostEventIcon } from "./CustomIcons";

interface AboutUsViewProps {
  setView: (view: string) => void;
}

export default function AboutUsView({ setView }: AboutUsViewProps) {
  const stats = [
    { label: "Tickets Sold", value: "250K+" },
    { label: "Verified Events", value: "1,200+" },
    { label: "Active Organisers", value: "350+" },
    { label: "Customer Rating", value: "4.9/5" },
  ];

  const values = [
    {
      icon: <RealTicketsIcon className="h-6 w-6 text-brand-blue" />,
      title: "100% Secure Entry",
      description: "Our proprietary cryptographically signed digital passes prevent duplication, counterfeiting, and entry fraud."
    },
    {
      icon: <HonestPricesIcon className="h-6 w-6 text-brand-blue" />,
      title: "Premium Experience",
      description: "From easy seat maps to seamless checkouts, we ensure every attendee feels like a VIP from purchase to entry."
    },
    {
      icon: <HostEventIcon className="h-6 w-6 text-brand-blue" />,
      title: "Organiser Empowerment",
      description: "We equip event promoters and local creators with high-tech check-in tools and instant financial settlements."
    }
  ];

  const team = [
    {
      name: "Marcus Vance",
      role: "Co-Founder & CEO",
      bio: "Former event coordinator with 15+ years in ticketing systems.",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&h=300&q=80"
    },
    {
      name: "Elisa Thorne",
      role: "Head of Operations",
      bio: "Streamlining venue relationships and onboarding global tour setups.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&h=300&q=80"
    },
    {
      name: "Dave Chen",
      role: "CTO",
      bio: "Security engineer specialized in cryptography and microservices.",
      image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&h=300&q=80"
    }
  ];

  return (
    <div className="bg-soft-bg min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-16">
        
        {/* Hero Banner Section */}
        <section className="relative rounded-3xl overflow-hidden bg-linear-to-tr from-indigo-950 via-neutral-900 to-indigo-900 text-white p-8 md:p-16 text-center shadow-xl">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-size-[40px_40px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-brand-blue/15 rounded-full blur-[100px] pointer-events-none" />
          
          <div className="relative z-10 max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-blue/10 border border-brand-blue/20 text-brand-blue text-[10px] font-bold uppercase tracking-widest">
              <Award className="h-3.5 w-3.5" />
              <span>Who We Are</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-none font-sans">
              Redefining Live <span className="text-brand-blue">Event Passports</span>
            </h1>
            <p className="text-sm md:text-base text-neutral-400 font-semibold leading-relaxed">
              At MYHitch Pass, we believe getting into an event should be as exciting as the performance itself. We build premium, fraud-proof digital ticketing tech that bridges local organizers with live experience enthusiasts.
            </p>
            <div className="pt-4 flex flex-wrap justify-center gap-4">
              <button
                onClick={() => setView("events")}
                className="bg-brand-blue hover:bg-brand-blue-hover text-white font-extrabold text-xs px-6 py-3 rounded-xl transition-all cursor-pointer shadow-md shadow-brand-blue/15"
              >
                Browse Events
              </button>
              <button
                onClick={() => setView("organiser-sop")}
                className="bg-white/10 hover:bg-white/15 text-white border border-white/20 font-extrabold text-xs px-6 py-3 rounded-xl transition-all cursor-pointer"
              >
                Become an Organizer
              </button>
            </div>
          </div>
        </section>

        {/* Stats Grid */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-white border border-border-gray p-6 rounded-2xl text-center shadow-xs">
              <p className="text-3xl font-extrabold text-brand-blue font-sans">{stat.value}</p>
              <p className="text-xs text-neutral-500 font-bold mt-1 uppercase tracking-wider">{stat.label}</p>
            </div>
          ))}
        </section>

        {/* Core Values / Features */}
        <section className="space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3.5xl font-extrabold text-neutral-900">Our Core Principles</h2>
            <p className="text-xs text-neutral-500 font-bold uppercase tracking-widest">Driven by security, transparency, and innovation</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((val, idx) => (
              <div key={idx} className="bg-white border border-border-gray p-8 rounded-2xl shadow-xs hover:shadow-md transition-all flex flex-col items-center text-center space-y-4">
                <div className="h-12 w-12 bg-light-tint rounded-xl flex items-center justify-center">
                  {val.icon}
                </div>
                <h3 className="text-base font-extrabold text-neutral-900">{val.title}</h3>
                <p className="text-xs text-neutral-550 leading-relaxed font-semibold">{val.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Meet the Team */}
        <section className="space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3.5xl font-extrabold text-neutral-900">Meet the Innovators</h2>
            <p className="text-xs text-neutral-500 font-bold uppercase tracking-widest">The team building the future of ticketing</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, idx) => (
              <div key={idx} className="bg-white border border-border-gray overflow-hidden rounded-2xl shadow-xs group">
                <div className="aspect-square relative overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent opacity-80" />
                  <div className="absolute bottom-4 left-4 text-white">
                    <p className="font-extrabold text-base">{member.name}</p>
                    <p className="text-xs text-brand-blue font-bold">{member.role}</p>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-xs text-neutral-550 leading-relaxed font-semibold">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Security Statement banner */}
        <section className="bg-emerald-50/50 border border-emerald-100 rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center gap-6 justify-between">
          <div className="space-y-2 text-left">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100/60 text-emerald-700 text-[10px] font-bold uppercase tracking-widest">
              <CheckCircle2 className="h-3 w-3" />
              <span>Verified Safe</span>
            </span>
            <h3 className="text-lg md:text-xl font-extrabold text-emerald-900">Australian Consumer Protected Guarantee</h3>
            <p className="text-xs text-emerald-700 font-semibold max-w-xl">
              All transactions on MYHitch Pass comply with Australia's consumer laws. When an event is cancelled or significantly rescheduled, you are guaranteed a full refund of your pass value automatically.
            </p>
          </div>
          <button
            onClick={() => setView("ticketing-policy")}
            className="shrink-0 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs px-6 py-3 rounded-xl transition-all cursor-pointer shadow-md shadow-emerald-600/10"
          >
            Read Ticketing Policy
          </button>
        </section>

      </div>
    </div>
  );
}
