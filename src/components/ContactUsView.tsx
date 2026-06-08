"use client";

import React, { useState } from "react";
import { Mail, Phone, MapPin, Send, ShieldCheck, Heart, Sparkles } from "lucide-react";

interface ContactUsViewProps {
  setView: (view: string) => void;
}

export default function ContactUsView({ setView }: ContactUsViewProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("General Inquiry");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && email.trim() && message.trim()) {
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setName("");
        setEmail("");
        setMessage("");
      }, 5000);
    }
  };

  const contactMethods = [
    {
      icon: <Mail className="h-5 w-5 text-brand-blue" />,
      title: "Email Support",
      value: "support@myhitchpass.com.au",
      desc: "Response within 24 hours (usually faster on weekends).",
      href: "mailto:support@myhitchpass.com.au",
    },
    {
      icon: <Phone className="h-5 w-5 text-brand-blue" />,
      title: "Phone Assistance",
      value: "+61 2 9000 1234",
      desc: "Mon-Fri, 9:00 AM - 6:00 PM AEST.",
      href: "tel:+61290001234",
    },
    {
      icon: <MapPin className="h-5 w-5 text-brand-blue" />,
      title: "Headquarters",
      value: "Level 14, 201 Sussex St",
      desc: "Sydney, NSW 2000, Australia",
      href: "https://maps.google.com",
    }
  ];

  return (
    <div className="bg-soft-bg min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-12">
        
        {/* Header Block */}
        <section className="text-center max-w-2xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-blue/10 border border-brand-blue/20 text-brand-blue text-[10px] font-bold uppercase tracking-widest">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Connect with Us</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-none font-sans text-neutral-900">
            Contact <span className="text-brand-blue">MYHitch Pass</span>
          </h1>
          <p className="text-sm text-neutral-500 font-semibold leading-relaxed">
            Need help with a ticketing order, event payout, or RSA security question? Get in touch with our Australian support team.
          </p>
        </section>

        {/* Contact Info & Contact Form Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 items-stretch">
          
          {/* Left Column: Contact Methods */}
          <div className="md:col-span-2 space-y-6">
            <div className="space-y-4">
              {contactMethods.map((method, idx) => (
                <a
                  key={idx}
                  href={method.href}
                  target={method.href.startsWith("http") ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  className="bg-white border border-border-gray hover:border-brand-blue/30 p-5 rounded-2xl shadow-xs hover:shadow-md transition-all flex items-start gap-4 text-left group"
                >
                  <div className="h-10 w-10 bg-light-tint rounded-xl flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    {method.icon}
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">{method.title}</h3>
                    <p className="text-sm font-extrabold text-neutral-900 mt-0.5">{method.value}</p>
                    <p className="text-[11px] text-neutral-550 font-semibold mt-1">{method.desc}</p>
                  </div>
                </a>
              ))}
            </div>

            <div className="bg-linear-to-tr from-indigo-950 to-indigo-900 text-white rounded-2xl p-6 space-y-4 shadow-sm relative overflow-hidden">
              <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-brand-blue/20 rounded-full blur-xl pointer-events-none" />
              <div className="flex items-center gap-2 text-brand-blue">
                <ShieldCheck className="h-5 w-5" />
                <span className="text-[10px] font-black uppercase tracking-wider">Gate Check Guarantee</span>
              </div>
              <h4 className="text-sm font-extrabold">Instant Support on Event Days</h4>
              <p className="text-xs text-neutral-400 font-semibold leading-relaxed">
                If you're at a venue entrance and having trouble loading your barcode ticket, please login and show the offline check-in reference in your app, or flag down the door steward.
              </p>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="md:col-span-3 bg-white border border-border-gray rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col justify-between">
            {submitted ? (
              <div className="flex flex-col items-center justify-center text-center py-16 space-y-4 h-full animate-fade">
                <div className="h-14 w-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center shadow-xs">
                  <Heart className="h-6 w-6 fill-emerald-100 text-emerald-650 animate-pulse" />
                </div>
                <h3 className="text-base font-extrabold text-neutral-900">Inquiry Dispatched!</h3>
                <p className="text-xs text-neutral-550 leading-relaxed max-w-sm font-semibold">
                  Thank you for reaching out, <span className="font-extrabold text-brand-blue">{name}</span>. A copy of your inquiry has been recorded, and our team will get back to you at <span className="font-bold text-neutral-800">{email}</span> within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-left">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-neutral-600 mb-1.5">Your Name</label>
                    <input
                      type="text"
                      required
                      placeholder="Sarah Jenkins"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-neutral-50 border border-border-gray rounded-xl py-2.5 px-3.5 text-xs font-semibold focus:outline-none focus:border-brand-blue focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-neutral-600 mb-1.5">Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder="sarahj@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-neutral-50 border border-border-gray rounded-xl py-2.5 px-3.5 text-xs font-semibold focus:outline-none focus:border-brand-blue focus:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-600 mb-1.5">Inquiry Type</label>
                  <select
                    title="Inquiry Type"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full bg-neutral-50 border border-border-gray rounded-xl py-2.5 px-3.5 text-xs font-semibold focus:outline-none focus:border-brand-blue focus:bg-white cursor-pointer"
                  >
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Ticketing Support">Order & Ticket Support</option>
                    <option value="Refund Request">Refund Request</option>
                    <option value="Become an Organiser">Become an Organiser</option>
                    <option value="Technical Bug">Report a Bug</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-600 mb-1.5">Your Message</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Provide as much detail as possible (including order IDs or event dates if applicable)..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full bg-neutral-50 border border-border-gray rounded-xl py-2.5 px-3.5 text-xs font-semibold focus:outline-none focus:border-brand-blue focus:bg-white resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-brand-blue hover:bg-brand-blue-hover text-white font-extrabold text-xs py-3.5 rounded-xl transition-all cursor-pointer shadow-md shadow-brand-blue/15 flex items-center justify-center gap-2"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>Send Message</span>
                </button>
              </form>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
