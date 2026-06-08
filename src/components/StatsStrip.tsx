"use client";

import { useEffect, useRef, useState } from "react";

const STATS = [
  { value: 4200, suffix: "+", label: "Events Listed" },
  { value: 128000, suffix: "+", label: "Tickets Sold" },
  { value: 38, suffix: "", label: "Cities" },
  { value: 1100, suffix: "+", label: "Organisers" },
];

function formatNumber(n: number): string {
  if (n >= 1000) return (n / 1000).toFixed(n % 1000 === 0 ? 0 : 1) + "k";
  return n.toString();
}

function CountUp({ target, duration = 1500, start }: { target: number; duration?: number; start: boolean }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!start) return;
    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (startTime === null) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [start, target, duration]);

  return <>{formatNumber(count)}</>;
}

export default function StatsStrip() {
  const ref = useRef<HTMLDivElement>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="bg-gradient-to-r from-blue-600 via-sky-500 to-cyan-400 py-12 px-4 sm:px-6 lg:px-8 shadow-[0_4px_24px_0_rgba(2,132,199,0.35)]"
    >
      <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-white text-center">
        {STATS.map((s) => (
          <div key={s.label} className="flex flex-col items-center gap-1.5">
            <span className="text-4xl sm:text-5xl font-black font-mono tabular-nums">
              <CountUp target={s.value} start={started} />
              {s.suffix}
            </span>
            <span className="text-xs font-bold text-white/70 uppercase tracking-widest">
              {s.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
