"use client";

import { Calendar, Mail, Send, CheckCircle2, Instagram, Facebook } from "lucide-react";
import React, { useState } from "react";

interface FooterProps {
  setView: (view: string) => void;
}

export default function Footer({ setView }: FooterProps) {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [logoError, setLogoError] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setTimeout(() => {
        setSubscribed(false);
        setEmail("");
      }, 4000);
    }
  };

  return (
    <footer id="app-footer" className="bg-soft-bg text-neutral-500 border-t border-border-gray">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12 pb-12 border-b border-border-gray">
          
          {/* Brand & Mission column */}
          <div className="md:col-span-1 space-y-4">
            <button
              onClick={() => setView("home")}
              className="flex items-center text-dark-text cursor-pointer select-none h-9"
            >
              {!logoError ? (
                <img
                  src="/logo.png"
                  alt="MYHitchPass Logo"
                  className="h-8 sm:h-9 w-auto object-contain text-left"
                  onError={() => setLogoError(true)}
                />
              ) : (
                <span className="text-2xl font-black tracking-tight uppercase font-sans">
                  MYHitch<span className="text-brand-blue">Pass</span>
                </span>
              )}
            </button>
            <p className="text-sm text-neutral-500 leading-relaxed font-semibold">
              Find events you'll love, or sell tickets to your own. Simple ticketing for everyone.
            </p>
            {/* Social handles */}
            <div className="flex items-center gap-3 pt-2">
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="p-2.5 bg-white border border-border-gray hover:border-pink-500 text-neutral-500 hover:text-pink-600 rounded-full transition-all flex items-center justify-center"
                aria-label="Instagram"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="p-2.5 bg-white border border-border-gray hover:border-blue-600 text-neutral-500 hover:text-blue-600 rounded-full transition-all flex items-center justify-center"
                aria-label="Facebook"
              >
                <Facebook className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Quick links columns */}
          <div className="grid grid-cols-2 gap-8 md:col-span-2">
            <div>
              <h3 className="text-dark-text font-black text-sm tracking-wider uppercase mb-4">Find events</h3>
              <ul className="space-y-2.5 text-xs text-neutral-500 font-bold">
                <li><button onClick={() => setView("events")} className="hover:text-brand-blue transition-colors cursor-pointer text-left">Music & concerts</button></li>
                <li><button onClick={() => setView("events")} className="hover:text-brand-blue transition-colors cursor-pointer text-left">Festivals</button></li>
                <li><button onClick={() => setView("events")} className="hover:text-brand-blue transition-colors cursor-pointer text-left">Sports & games</button></li>
                <li><button onClick={() => setView("events")} className="hover:text-brand-blue transition-colors cursor-pointer text-left">Theatre & shows</button></li>
              </ul>
            </div>
            <div>
              <h3 className="text-dark-text font-black text-sm tracking-wider uppercase mb-4">Sell tickets</h3>
              <ul className="space-y-2.5 text-xs text-neutral-500 font-bold">
                <li><button onClick={() => setView("organiser-sop")} className="hover:text-brand-blue transition-colors cursor-pointer text-left">How to get started</button></li>
                <li><button onClick={() => setView("pricing")} className="hover:text-brand-blue transition-colors cursor-pointer text-left">Pricing & fees</button></li>
                <li><button onClick={() => setView("organiser-sop")} className="hover:text-brand-blue transition-colors cursor-pointer text-left">Getting paid</button></li>
                <li><button onClick={() => setView("help-desk")} className="hover:text-brand-blue transition-colors cursor-pointer text-left">Organiser help</button></li>
              </ul>
            </div>
          </div>

          {/* Newsletter Column */}
          <div className="md:col-span-1 space-y-4">
            <h3 className="text-dark-text font-black text-sm tracking-wider uppercase mb-1">Stay updated</h3>
            <p className="text-xs text-neutral-500 leading-relaxed font-semibold">
              Get an email when new events drop in your area. Unsubscribe anytime.
            </p>
            <form onSubmit={handleSubscribe} className="relative mt-2">
              <input
                id="footer-email-input"
                type="email"
                required
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white border border-border-gray hover:border-brand-blue/30 focus:border-brand-blue rounded-full px-5 py-3 text-xs text-dark-text focus:outline-none pr-12 placeholder-neutral-400 font-semibold shadow-sm"
              />
              <button
                id="footer-email-submit-btn"
                type="submit"
                className="absolute right-1.5 top-1.5 p-1.5 bg-brand-blue text-white rounded-full hover:bg-brand-blue-hover transition-colors cursor-pointer"
              >
                {subscribed ? <CheckCircle2 className="h-4 w-4 text-emerald-300" /> : <Send className="h-4 w-4" />}
              </button>
            </form>
            {subscribed && (
              <p className="text-emerald-500 text-[11px] font-semibold animate-fade">
                You're in! We'll email you when new events go live.
              </p>
            )}
          </div>
        </div>

        {/* Bottom row copyrights */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-400 gap-4">
          <div className="font-semibold text-center sm:text-left">
            &copy; 2026 MYHitch Pass Inc.
          </div>
          <div className="flex items-center gap-6 font-semibold">
            <button type="button" onClick={() => setView("privacy")} className="hover:text-brand-blue transition-colors cursor-pointer">Privacy Charter</button>
            <button type="button" onClick={() => setView("ticketing-policy")} className="hover:text-brand-blue transition-colors cursor-pointer">Ticketing Policy</button>
            <button type="button" onClick={() => setView("help-desk")} className="hover:text-brand-blue transition-colors cursor-pointer">Help desk</button>
          </div>
        </div>
      </div>
    </footer>
  );
}
