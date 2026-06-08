"use client";

import { useState } from "react";
import {
  ArrowLeft,
  LifeBuoy,
  Mail,
  Search,
  Ticket,
  CreditCard,
  Users,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Sparkles,
} from "lucide-react";

interface Props {
  setView: (view: string) => void;
}

const TOPICS = [
  {
    icon: Ticket,
    title: "Bookings & Tickets",
    desc: "Find a ticket, transfer it, or reissue a lost pass.",
    keyword: "ticket",
  },
  {
    icon: CreditCard,
    title: "Payments & Refunds",
    desc: "Charges, payouts, refund timing, and Stripe support.",
    keyword: "payment",
  },
  {
    icon: Users,
    title: "Organiser Help",
    desc: "Set up your account, create events, manage attendees.",
    keyword: "organiser",
  },
  {
    icon: ShieldCheck,
    title: "Account & Security",
    desc: "Login issues, password resets, account safety.",
    keyword: "account",
  },
];

const FAQS = [
  {
    q: "I haven't received my ticket email. What should I do?",
    a: "Tickets are emailed within a few minutes of purchase. Please check your Junk or Spam folder first. If it still hasn't arrived after 15 minutes, log in to MYHitch Pass and open My Tickets — your digital pass is always available there. Still stuck? Email support@myhitchpass.com.au with your booking reference.",
    tag: "ticket",
  },
  {
    q: "How do I transfer my ticket to someone else?",
    a: "Open My Tickets, choose the booking, and click Transfer. Enter the recipient's email. Once transferred, the new attendee's name is on file for entry verification.",
    tag: "ticket",
  },
  {
    q: "When will I receive a refund?",
    a: "If the event was cancelled by the organiser, refunds are returned to your original payment method within 5–10 business days. Customer-initiated refunds depend on the organiser's policy shown on the event page.",
    tag: "payment",
  },
  {
    q: "I'm an organiser — when do I get paid?",
    a: "Payouts are processed via Stripe within 2–5 business days after each event concludes. Your full payout history is available in your organiser dashboard under Payouts.",
    tag: "organiser",
  },
  {
    q: "How do I become an organiser?",
    a: "Click \"Become an Organiser\" on the homepage or visit our SOP page. You'll fill in a short form, receive login details by email, and then connect Stripe to start selling tickets.",
    tag: "organiser",
  },
  {
    q: "I forgot my password.",
    a: "On the login screen, click \"Forgot password\" and follow the email link to reset it. If you don't receive the reset email within a few minutes, check Junk or Spam.",
    tag: "account",
  },
  {
    q: "Is my payment information secure?",
    a: "Yes. All payments are processed by Stripe, which is PCI-DSS Level 1 certified. MYHitch Pass never sees or stores your full card details.",
    tag: "account",
  },
  {
    q: "Can I get an invoice or receipt for my booking?",
    a: "Every confirmation email doubles as a receipt. For a formal tax invoice (especially for business purchases), email support@myhitchpass.com.au with your booking reference.",
    tag: "payment",
  },
];

export default function HelpDeskView({ setView }: Props) {
  const [query, setQuery] = useState("");
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactCategory, setContactCategory] = useState("Bookings & Tickets");
  const [contactMessage, setContactMessage] = useState("");

  const q = query.trim().toLowerCase();
  const filteredFaqs = q
    ? FAQS.filter((f) => f.q.toLowerCase().includes(q) || f.a.toLowerCase().includes(q))
    : FAQS;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName || !contactEmail || !contactMessage) return;
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setContactName("");
      setContactEmail("");
      setContactMessage("");
    }, 5000);
  };

  return (
    <div className="bg-soft-bg animate-fade">
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-border-gray bg-white">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-24 -right-24 w-[480px] h-[480px] rounded-full blur-[120px] opacity-[0.10] bg-brand-blue" />
        </div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-14">
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
            <span>Help Desk</span>
          </div>

          <h1 className="mt-6 text-3xl sm:text-5xl font-black tracking-tight text-neutral-900 leading-[1.05]">
            How can we help?
          </h1>

          <p className="mt-4 text-sm sm:text-base text-neutral-600 leading-relaxed max-w-2xl">
            Search our help articles, browse topics, or get in touch with the MYHitch Pass support team.
          </p>

          {/* Search */}
          <div className="mt-8 max-w-2xl">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
              <input
                type="text"
                placeholder="Search help articles — try “refund”, “transfer”, “payout”"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-neutral-200 bg-white text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-hidden focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue transition-all"
              />
            </div>
          </div>
        </div>
      </section>

      {/* TOPIC CARDS */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-xs font-black uppercase tracking-widest text-brand-blue mb-4">Browse by topic</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {TOPICS.map((t) => {
            const Icon = t.icon;
            return (
              <button
                type="button"
                key={t.title}
                onClick={() => setQuery(t.keyword)}
                className="text-left p-5 rounded-2xl bg-white border border-border-gray hover:border-brand-blue hover:shadow-md transition-all cursor-pointer group"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-blue/8 text-brand-blue group-hover:bg-brand-blue group-hover:text-white transition-colors mb-3">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-sm font-extrabold text-neutral-900 mb-1">{t.title}</h3>
                <p className="text-xs text-neutral-500 leading-relaxed">{t.desc}</p>
              </button>
            );
          })}
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <h2 className="text-xs font-black uppercase tracking-widest text-brand-blue mb-4">
          Frequently asked questions
        </h2>

        <div className="bg-white rounded-2xl border border-border-gray divide-y divide-neutral-100 shadow-sm">
          {filteredFaqs.length === 0 && (
            <div className="p-8 text-center">
              <p className="text-sm text-neutral-500">
                No articles match "{query}". Try a different keyword or contact us below.
              </p>
            </div>
          )}
          {filteredFaqs.map((f, idx) => {
            const open = openIdx === idx;
            return (
              <div key={f.q}>
                <button
                  type="button"
                  onClick={() => setOpenIdx(open ? null : idx)}
                  className="w-full flex items-center justify-between gap-4 px-5 sm:px-6 py-4 text-left hover:bg-neutral-50 transition-colors cursor-pointer"
                  aria-expanded={open}
                >
                  <span className="text-sm font-extrabold text-neutral-900">{f.q}</span>
                  {open ? (
                    <ChevronUp className="h-4 w-4 text-brand-blue shrink-0" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-neutral-400 shrink-0" />
                  )}
                </button>
                {open && (
                  <div className="px-5 sm:px-6 pb-5 -mt-1">
                    <p className="text-sm text-neutral-600 leading-relaxed">{f.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* CONTACT FORM */}
      <section className="bg-white border-y border-border-gray py-14">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-10 items-start">
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-blue/8 text-brand-blue mb-4">
                <LifeBuoy className="h-6 w-6" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-neutral-900 mb-3">
                Still need help?
              </h2>
              <p className="text-sm text-neutral-600 leading-relaxed mb-6">
                Our support team typically replies within 2 business days. For urgent issues, include your booking reference so we can act quickly.
              </p>
              <a
                href="mailto:support@myhitchpass.com.au"
                className="inline-flex items-center gap-2 text-sm font-extrabold text-brand-blue hover:underline"
              >
                <Mail className="h-4 w-4" />
                support@myhitchpass.com.au
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>

            <form onSubmit={handleSubmit} className="bg-soft-bg rounded-2xl border border-border-gray p-6 space-y-4">
              <div>
                <label htmlFor="hd-name" className="block text-[11px] font-black uppercase tracking-widest text-neutral-500 mb-1.5">
                  Your name
                </label>
                <input
                  id="hd-name"
                  type="text"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 bg-white text-sm focus:outline-hidden focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue transition-all"
                />
              </div>
              <div>
                <label htmlFor="hd-email" className="block text-[11px] font-black uppercase tracking-widest text-neutral-500 mb-1.5">
                  Email address
                </label>
                <input
                  id="hd-email"
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 bg-white text-sm focus:outline-hidden focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue transition-all"
                />
              </div>
              <div>
                <label htmlFor="hd-category" className="block text-[11px] font-black uppercase tracking-widest text-neutral-500 mb-1.5">
                  Category
                </label>
                <select
                  id="hd-category"
                  value={contactCategory}
                  onChange={(e) => setContactCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 bg-white text-sm focus:outline-hidden focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue transition-all"
                >
                  {TOPICS.map((t) => (
                    <option key={t.title} value={t.title}>
                      {t.title}
                    </option>
                  ))}
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label htmlFor="hd-msg" className="block text-[11px] font-black uppercase tracking-widest text-neutral-500 mb-1.5">
                  Message
                </label>
                <textarea
                  id="hd-msg"
                  value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                  required
                  rows={4}
                  placeholder="Describe your issue, including any booking reference if relevant."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 bg-white text-sm resize-none focus:outline-hidden focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue transition-all"
                />
              </div>
              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-white font-extrabold text-xs shadow-md hover:shadow-lg active:scale-[0.98] transition-all cursor-pointer bg-brand-blue hover:bg-brand-blue-hover"
              >
                {submitted ? "Message received — we'll reply soon" : "Send message"}
              </button>
              {submitted && (
                <p className="text-[11px] text-emerald-600 font-bold text-center">
                  Thanks! Our team will get back to you at {contactEmail}.
                </p>
              )}
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
