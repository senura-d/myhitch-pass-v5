"use client";

import React from "react";
import {
  ArrowRight,
  ArrowLeft,
  Globe,
  ClipboardList,
  Mail,
  LogIn,
  Landmark,
  CheckCircle2,
  Lock,
  Sparkles,
  LifeBuoy,
  UserPlus,
  FileText,
  Hash,
  Calendar,
  ExternalLink,
} from "lucide-react";

interface OrganiserSOPViewProps {
  setView: (view: string) => void;
  isLoggedIn: boolean;
  onStartOrganiserFlow: () => void;
}

type Step = {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  intro: string;
  items: string[];
  image: string;
  imageAlt: string;
  buttonLabel: string;
  buttonAction: "home" | "login" | "organizer" | "email";
  footer?: string;
};

const STEPS: Step[] = [
  {
    icon: Globe,
    title: "Open the MYHitch Pass website",
    intro: "Start on the main MYHitch Pass page.",
    items: [
      "Open any web browser (Chrome, Safari, Edge, or Firefox).",
      "Type myhitchpass.com.au in the top bar and press Enter.",
      "Look at the top of the page and click the button that says \"Become an Organiser\".",
    ],
    image: "/sop/step-1-homepage.png",
    imageAlt: "MYHitch Pass homepage with the Become an Organiser button highlighted",
    buttonLabel: "Open the homepage",
    buttonAction: "home",
  },
  {
    icon: ClipboardList,
    title: "Fill out the short form",
    intro: "Just three boxes and a Submit button — no payment needed.",
    items: [
      "Type your name (or your business name) in the first box.",
      "Type your email address in the second box.",
      "Type your business address in the third box.",
      "Read what you wrote, then click the blue Submit button.",
    ],
    image: "/sop/step-2-form.png",
    imageAlt: "Become an Organiser registration form with Name, Email, and Address fields",
    buttonLabel: "Open the form",
    buttonAction: "login",
  },
  {
    icon: Mail,
    title: "Check your email",
    intro: "We send your login details straight to your inbox.",
    items: [
      "Open your email app (Gmail, Outlook, Yahoo, etc.).",
      "Look for an email from MYHitch Pass — it has your username and password.",
      "If you don't see it after 5 minutes, check the Spam or Junk folder.",
      "Save the username and password somewhere safe.",
    ],
    image: "/sop/step-3-email.svg",
    imageAlt: "Example login-details email from MYHitch Pass with username and password",
    buttonLabel: "Got it — what's next?",
    buttonAction: "email",
  },
  {
    icon: LogIn,
    title: "Log in to your account",
    intro: "Use the details from the email to sign in.",
    items: [
      "Go back to myhitchpass.com.au.",
      "Click the Log In button at the top right.",
      "Type the username from the email.",
      "Type the password from the email.",
      "Click the blue Log In button.",
    ],
    image: "/sop/step-4-login.png",
    imageAlt: "MYHitch Pass login screen with username and password fields",
    buttonLabel: "Open the login page",
    buttonAction: "login",
  },
  {
    icon: Landmark,
    title: "Connect your bank with Stripe",
    intro: "This is how you'll get paid when people buy your tickets.",
    items: [
      "Inside your dashboard, find the blue button that says \"Connect with Stripe\". Click it.",
      "A new page from Stripe will open — Stripe is the company that handles the money safely.",
      "Fill in your name, business details, and bank account number where Stripe asks.",
      "Click Submit at the end. Stripe will tell you when it's done.",
    ],
    image: "/sop/step-5-stripe.png",
    imageAlt: "Connect with Stripe button inside the organiser dashboard",
    buttonLabel: "Open my dashboard",
    buttonAction: "organizer",
    footer:
      "When Stripe says you're done, your bank is connected. Now you can start selling tickets.",
  },
];

const RESPONSIBILITIES = [
  "Provide accurate information during registration.",
  "Keep organiser login credentials secure.",
  "Set up and maintain correct bank details in Stripe for payouts.",
  "Keep organiser profile and contact details up to date.",
];

export default function OrganiserSOPView({ setView, isLoggedIn, onStartOrganiserFlow }: OrganiserSOPViewProps) {
  const primaryCtaLabel = isLoggedIn ? "Become an Organiser" : "Sign in to continue";
  return (
    <div className="bg-soft-bg animate-fade">
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-border-gray bg-white">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-24 -right-24 w-[480px] h-[480px] rounded-full blur-[120px] opacity-[0.12] bg-brand-blue" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000005_1px,transparent_1px),linear-gradient(to_bottom,#00000005_1px,transparent_1px)] bg-size-[40px_40px] mask-[radial-gradient(ellipse_60%_60%_at_50%_30%,#000_60%,transparent_100%)]" />
        </div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16">
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
            <span>Organiser Onboarding</span>
          </div>

          <h1 className="mt-6 text-3xl sm:text-5xl font-black tracking-tight text-neutral-900 leading-[1.05] max-w-3xl">
            SOP — Become an Organiser on <span className="text-brand-blue">MYHitch Pass</span>
          </h1>

          <p className="mt-5 text-sm sm:text-base text-neutral-600 leading-relaxed max-w-2xl">
            A simple, step-by-step guide to creating your Organiser Account, completing onboarding, and connecting Stripe so you can start selling tickets on MYHitch Pass.
          </p>

          {/* SOP DOCUMENT METADATA */}
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl">
            <MetaCard icon={FileText} label="Version" value="1.0" />
            <MetaCard icon={Hash} label="Reference No." value="SOP-MHP-01" />
            <MetaCard icon={Calendar} label="Effective Date" value="15/12/2025" />
            <MetaCard icon={Globe} label="Website" value="myhitchpass.com.au" />
          </div>

          {isLoggedIn && (
            <div className="mt-9 flex flex-col sm:flex-row sm:items-center gap-4">
              <button
                type="button"
                onClick={onStartOrganiserFlow}
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl text-white font-extrabold text-sm shadow-lg shadow-sky-500/20 hover:shadow-xl active:scale-[0.98] transition-all cursor-pointer bg-brand-blue hover:bg-brand-blue-hover"
              >
                <UserPlus className="h-4 w-4" />
                {primaryCtaLabel}
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}

          {!isLoggedIn && (
            <div className="mt-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border p-4 sm:p-5 bg-brand-blue/5 border-brand-blue/20">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-blue/12 text-brand-blue">
                  <LogIn className="h-4.5 w-4.5" />
                </div>
                <div>
                  <p className="text-sm font-extrabold text-neutral-900">Sign in required</p>
                  <p className="text-xs text-neutral-600 leading-relaxed mt-0.5">
                    You need an organiser account to access the dashboard. Sign in, register, or use the <span className="font-extrabold text-brand-blue">demo account</span> on the login page to explore right away.
                  </p>
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setView("login")}
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-white font-extrabold text-xs shadow-md active:scale-[0.98] transition-all cursor-pointer bg-brand-blue hover:bg-brand-blue-hover"
                >
                  <LogIn className="h-3.5 w-3.5" />
                  Sign in
                </button>
                <button
                  type="button"
                  onClick={() => setView("login")}
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-white border border-neutral-200 text-neutral-800 font-extrabold text-xs hover:bg-neutral-50 transition-colors cursor-pointer"
                >
                  <UserPlus className="h-3.5 w-3.5" />
                  Create account
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* PURPOSE / SCOPE / RESPONSIBILITIES */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <InfoCard label="Purpose">
            This Standard Operating Procedure (SOP) outlines the step-by-step process for creating an Organiser Account on the MYHitch Pass platform and completing the initial onboarding.
          </InfoCard>
          <InfoCard label="Scope">
            This procedure applies to all individuals, businesses, and organisations registering as an Organiser on myhitchpass.com.au.
          </InfoCard>
          <InfoCard label="Responsibilities">
            <ul className="space-y-1.5">
              {RESPONSIBILITIES.map((r) => (
                <li key={r} className="flex gap-2">
                  <span className="text-brand-blue font-black shrink-0">•</span>
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </InfoCard>
        </div>
      </section>

      {/* PROCEDURE TIMELINE */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="mb-2">
          <div className="text-[10px] font-black uppercase tracking-widest mb-2 text-brand-blue">Procedure</div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-neutral-900">The 5-step onboarding journey</h2>
        </div>
        <p className="text-sm text-neutral-500 mb-10 max-w-2xl">
          Follow these five steps in order. Most organisers complete the entire process in under ten minutes.
        </p>

        <ol className="relative space-y-5">
          <div
            className="absolute left-5 sm:left-6 top-3 bottom-3 w-[2px] rounded-full bg-brand-blue/20"
            aria-hidden="true"
          />

          {STEPS.map((step, idx) => {
            const Icon = step.icon;
            const handleStepAction = () => {
              if (step.buttonAction === "organizer") {
                onStartOrganiserFlow();
              } else if (step.buttonAction === "email") {
                window.scrollBy({ top: 600, behavior: "smooth" });
              } else {
                setView(step.buttonAction);
              }
            };

            return (
              <li key={idx} className="relative flex gap-4 sm:gap-6">
                <div className="relative z-10 flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-full text-white font-black text-sm shadow-md bg-brand-blue shadow-[0_0_0_4px_white,0_0_0_5px_rgba(0,174,239,0.1)]">
                  {idx + 1}
                </div>

                <div className="flex-1 bg-white rounded-2xl border border-border-gray p-5 sm:p-7 shadow-sm hover:shadow-md transition-shadow">
                  {/* Header */}
                  <div className="flex items-start gap-3 mb-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-blue/10 text-brand-blue">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg sm:text-xl font-extrabold text-neutral-900 leading-tight">
                        Step {idx + 1} — {step.title}
                      </h3>
                      <p className="text-sm text-neutral-500 mt-1 leading-relaxed">{step.intro}</p>
                    </div>
                  </div>

                  {/* Image + steps grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
                    {/* Image card with fallback */}
                    <StepImage src={step.image} alt={step.imageAlt} Icon={Icon} stepNumber={idx + 1} />

                    {/* Numbered to-do list */}
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-3">
                        What to do
                      </p>
                      <ol className="space-y-3">
                        {step.items.map((it, i) => (
                          <li key={it} className="flex gap-3">
                            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-blue/10 text-brand-blue font-black text-xs">
                              {i + 1}
                            </span>
                            <span className="text-sm text-neutral-700 leading-relaxed pt-0.5">{it}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                  </div>

                  {step.footer && (
                    <p className="text-sm text-neutral-600 leading-relaxed mt-5 pt-4 border-t border-neutral-100">
                      ✅ {step.footer}
                    </p>
                  )}

                  {/* Action button */}
                  {step.buttonAction !== "email" && (
                    <div className="mt-5 pt-5 border-t border-neutral-100">
                      <button
                        type="button"
                        onClick={handleStepAction}
                        className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-white font-extrabold text-xs shadow-md hover:shadow-lg active:scale-[0.98] transition-all cursor-pointer bg-brand-blue hover:bg-brand-blue-hover"
                      >
                        {step.buttonLabel}
                        <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      </section>

      {/* STRIPE / BANK SETUP CALLOUT */}
      <section className="bg-white border-y border-border-gray py-14">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-10 items-start">
            <div>
              <div className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-3">
                <Lock className="h-3 w-3" />
                Stripe Bank Setup
              </div>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-neutral-900 mb-3">
                Connect with Stripe to receive payouts
              </h2>
              <p className="text-sm text-neutral-600 leading-relaxed max-w-2xl mb-5">
                Stripe handles all secure payment processing and payouts for MYHitch Pass organisers. You'll be redirected to Stripe's secure setup page to enter your personal, business, and bank information.
              </p>
              <p className="text-sm text-neutral-600 leading-relaxed max-w-2xl mb-7">
                Once complete, your bank details will be connected to your MYHitch Pass Organiser Account for receiving payouts.
              </p>

              <button
                type="button"
                onClick={onStartOrganiserFlow}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white font-extrabold text-xs shadow-md hover:shadow-lg active:scale-[0.98] transition-all cursor-pointer bg-brand-blue hover:bg-brand-blue-hover"
              >
                {isLoggedIn ? "Connect with Stripe" : "Sign in to connect Stripe"}
                <ArrowRight className="h-4 w-4" />
              </button>
              <p className="text-[11px] text-neutral-500 font-bold mt-3">
                You'll set this up inside your organiser dashboard after logging in.
              </p>
            </div>

            <div className="hidden lg:flex h-44 w-44 shrink-0 items-center justify-center rounded-3xl border bg-brand-blue/5 border-brand-blue/20">
              <Lock className="h-16 w-16 text-brand-blue" />
            </div>
          </div>
        </div>
      </section>

      {/* COMPLETION */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="relative overflow-hidden rounded-3xl p-8 sm:p-12 text-center border bg-emerald-50 border-emerald-200">
          <div className="absolute inset-0 pointer-events-none opacity-50">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[200px] bg-emerald-300 blur-[100px] rounded-full" />
          </div>

          <div className="relative">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg shadow-emerald-500/30 mb-5">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-emerald-950 mb-2">
              Completion
            </h2>
            <p className="text-sm text-emerald-900/80 max-w-xl mx-auto leading-relaxed mb-7">
              Your Organiser Account is now active and your bank details are set up. You can begin creating and managing events on the MYHitch Pass platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                type="button"
                onClick={onStartOrganiserFlow}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-white font-extrabold text-xs shadow-md active:scale-[0.98] transition-all cursor-pointer bg-brand-blue hover:bg-brand-blue-hover"
              >
                {isLoggedIn ? "Go to Organiser Dashboard" : "Sign in to access Dashboard"}
                <ArrowRight className="h-4 w-4" />
              </button>
              {isLoggedIn && (
                <button
                  type="button"
                  onClick={onStartOrganiserFlow}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white text-emerald-900 border border-emerald-200 font-extrabold text-xs hover:bg-emerald-50 transition-colors cursor-pointer"
                >
                  Create my first event
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* SUPPORT CONTACT */}
      <section className="bg-white border-t border-border-gray py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-6 items-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl shrink-0 bg-brand-blue/8 text-brand-blue">
              <LifeBuoy className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-extrabold text-neutral-900 mb-1">Support contact</h2>
              <p className="text-sm text-neutral-600 mb-3">
                Need help with onboarding? Get in touch with our team.
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
          </div>
        </div>
      </section>

      {/* BRAND FOOTER STRIP */}
      <section className="bg-neutral-50 border-t border-border-gray py-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm text-neutral-600 leading-relaxed max-w-2xl mx-auto mb-4">
            Your smart gateway to the world's events. We're redefining how people discover, book, and enjoy live experiences by bringing together a seamless blend of automation, security, and innovation.
          </p>
          <p className="text-[11px] font-bold text-neutral-400">
            © MyHitch Pass Australia 2025. All Rights Reserved.
          </p>
        </div>
      </section>
    </div>
  );
}

function InfoCard({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-border-gray p-5 shadow-sm">
      <div className="inline-block text-[10px] font-black uppercase tracking-widest mb-2 text-brand-blue">
        {label}
      </div>
      <div className="text-sm text-neutral-600 leading-relaxed">{children}</div>
    </div>
  );
}

function StepImage({
  src,
  alt,
  Icon,
  stepNumber,
}: {
  src: string;
  alt: string;
  Icon: React.ComponentType<{ className?: string }>;
  stepNumber: number;
}) {
  const [errored, setErrored] = React.useState(false);

  if (errored) {
    return (
      <div className="relative w-full aspect-[4/3] max-h-[300px] rounded-2xl border border-dashed border-brand-blue/30 bg-brand-blue/5 flex flex-col items-center justify-center text-brand-blue overflow-hidden">
        <Icon className="h-12 w-12 mb-2 opacity-60" />
        <p className="text-xs font-extrabold uppercase tracking-widest">Step {stepNumber} preview</p>
        <p className="text-[10px] text-neutral-550 mt-1 px-4 text-center">
          Drop a screenshot at <code className="font-bold">{src}</code>
        </p>
      </div>
    );
  }

  return (
    <div className="relative w-full aspect-[4/3] max-h-[300px] rounded-2xl border border-brand-blue/15 bg-linear-to-br from-brand-blue/5 via-white to-brand-blue/10 p-4 sm:p-5 flex items-center justify-center overflow-hidden">
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        onError={() => setErrored(true)}
        className="block w-full h-full object-contain rounded-lg"
      />
    </div>
  );
}

function MetaCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-neutral-200 bg-white px-3 py-2.5">
      <div className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-neutral-400 mb-1">
        <Icon className="h-3 w-3" />
        {label}
      </div>
      <div className="text-xs font-extrabold text-neutral-900 truncate">{value}</div>
    </div>
  );
}
