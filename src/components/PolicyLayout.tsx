import React from "react";
import { ArrowLeft, Sparkles } from "lucide-react";

interface PolicyLayoutProps {
  eyebrow: string;
  title: string;
  subtitle: string;
  effectiveDate?: string;
  setView: (view: string) => void;
  children: React.ReactNode;
}

export default function PolicyLayout({
  eyebrow,
  title,
  subtitle,
  effectiveDate,
  setView,
  children,
}: PolicyLayoutProps) {
  return (
    <div className="bg-soft-bg min-h-screen animate-fade">
      <section className="relative overflow-hidden border-b border-border-gray bg-white">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-24 -right-24 w-[480px] h-[480px] rounded-full blur-[120px] opacity-[0.10] bg-brand-blue" />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-14">
          <button
            type="button"
            onClick={() => setView("home")}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-500 hover:text-neutral-900 mb-10 transition-colors cursor-pointer"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to home
          </button>

          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border text-brand-blue border-brand-blue/20 bg-brand-blue/5">
            <Sparkles className="h-3 w-3" />
            <span>{eyebrow}</span>
          </div>

          <h1 className="mt-6 text-3xl sm:text-5xl font-black tracking-tight text-neutral-900 leading-[1.05]">
            {title}
          </h1>

          <p className="mt-4 text-sm sm:text-base text-neutral-600 leading-relaxed max-w-2xl">
            {subtitle}
          </p>

          {effectiveDate && (
            <p className="mt-5 text-[11px] font-bold uppercase tracking-widest text-neutral-400">
              Effective Date: {effectiveDate}
            </p>
          )}
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="bg-white rounded-3xl border border-border-gray shadow-sm p-6 sm:p-10 space-y-8">
          {children}
        </div>
      </section>
    </div>
  );
}

export function PolicySection({
  number,
  title,
  children,
}: {
  number: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="scroll-mt-24">
      <div className="flex items-baseline gap-3 mb-3">
        <span className="text-brand-blue font-black text-sm">{number}.</span>
        <h2 className="text-lg sm:text-xl font-extrabold text-neutral-900">{title}</h2>
      </div>
      <div className="text-sm text-neutral-700 leading-relaxed space-y-3 sm:pl-7">
        {children}
      </div>
    </section>
  );
}

export function PolicyList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2">
      {items.map((it) => (
        <li key={it} className="flex gap-2.5">
          <span className="text-brand-blue font-black shrink-0 leading-snug">•</span>
          <span className="leading-relaxed">{it}</span>
        </li>
      ))}
    </ul>
  );
}
