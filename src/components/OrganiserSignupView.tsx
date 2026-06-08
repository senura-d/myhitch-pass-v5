"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Eye, EyeOff, ArrowRight, Check, Mail, Lock, User, Phone,
  Building2, ExternalLink, RefreshCw, ShieldCheck,
  AlertCircle, ArrowLeft, UserPlus, Banknote, Zap, BarChart3, Clock,
  Loader2, Hash, MapPin,
} from "lucide-react";
import { useAppContext } from "@/app/providers";
import API from "../lib/api";

// ── Types ─────────────────────────────────────────────────────────────────────

interface RegData {
  fullName: string;
  email: string;
  phone: string;
  organisation: string;
  abn: string;
  address: string;
  password: string;
  confirmPassword: string;
  agreeTerms: boolean;
}

const EMPTY: RegData = {
  fullName: "", email: "", phone: "", organisation: "",
  abn: "", address: "", password: "", confirmPassword: "", agreeTerms: false,
};

const STEPS = [
  { n: 2, label: "Details" },
  { n: 3, label: "Verify" },
  { n: 4, label: "Payouts" },
];

// ── Shared UI ─────────────────────────────────────────────────────────────────

function StepBar({ current }: { current: number }) {
  return (
    <div className="flex items-center justify-center gap-2 mb-5">
      {STEPS.map((s, i) => {
        const done = current > s.n;
        const active = current === s.n;
        return (
          <React.Fragment key={s.n}>
            <div className="flex flex-col items-center gap-1">
              <div
                className={`h-9 w-9 rounded-full flex items-center justify-center text-xs font-black transition-all duration-300 ${
                  done
                    ? "bg-emerald-500 text-white shadow-sm"
                    : active
                    ? "bg-brand-blue text-white shadow-lg shadow-brand-blue/30"
                    : "bg-slate-100 text-slate-400"
                }`}
              >
                {done ? <Check className="h-4 w-4" /> : s.n - 1}
              </div>
              <span
                className={`text-[10px] font-bold uppercase tracking-wider ${
                  active ? "text-brand-blue" : done ? "text-emerald-500" : "text-slate-400"
                }`}
              >
                {s.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={`w-14 h-0.5 mb-4 rounded-full transition-all duration-500 ${
                  current > s.n ? "bg-emerald-400" : "bg-slate-200"
                }`}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

function Input({
  label, type = "text", value, onChange, placeholder, required, icon, right, error,
}: {
  label: string; type?: string; value: string; onChange: (v: string) => void;
  placeholder?: string; required?: boolean; icon?: React.ReactNode;
  right?: React.ReactNode; error?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[11px] font-extrabold text-slate-600 uppercase tracking-wider">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <div className="relative">
        {icon && (
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
            {icon}
          </span>
        )}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full ${icon ? "pl-10" : "pl-4"} ${right ? "pr-11" : "pr-4"} py-2.5 rounded-xl border ${
            error
              ? "border-red-300 focus:border-red-400 focus:ring-red-100"
              : "border-slate-200 focus:border-brand-blue focus:ring-brand-blue/10"
          } focus:ring-2 outline-none text-sm font-medium text-dark-text bg-white transition-all placeholder:text-slate-400`}
        />
        {right && (
          <span className="absolute right-3.5 top-1/2 -translate-y-1/2">{right}</span>
        )}
      </div>
      {error && (
        <p className="text-xs text-red-500 font-medium flex items-center gap-1">
          <AlertCircle className="h-3 w-3 flex-shrink-0" />{error}
        </p>
      )}
    </div>
  );
}


// ── Step 1 — Login / Register choice ─────────────────────────────────────────

function Step1({
  onLogin,
  onRegister,
}: {
  onLogin: (email: string, password: string) => Promise<void>;
  onRegister: () => void;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [logoErr, setLogoErr] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isBuyerAccount, setIsBuyerAccount] = useState(false);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!email.trim() || !password) {
      setError("Please enter your email and password.");
      return;
    }
    setError("");
    setIsBuyerAccount(false);
    setLoading(true);
    try {
      await onLogin(email.trim(), password);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Login failed. Please try again.";
      if (msg === "BUYER_ACCOUNT") {
        setIsBuyerAccount(true);
        setError("");
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      key="s1"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex-1 flex flex-col lg:flex-row min-h-[calc(100vh-59px)] w-full"
    >
      {/* ── Left: Login form ── */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10 lg:p-16 bg-white">
        <div className="w-full max-w-md">
          <form onSubmit={handleSubmit}>
          {/* Form card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-5">

            {/* Logo inside form */}
            <div className="flex justify-center pb-2">
              {!logoErr ? (
                <img
                  src="/logo.png"
                  alt="MYHitch Pass"
                  className="h-10 w-auto object-contain"
                  onError={() => setLogoErr(true)}
                />
              ) : (
                <span className="text-2xl font-black tracking-tight">
                  MYHitch<span className="text-brand-blue">Pass</span>
                </span>
              )}
            </div>

            {/* Heading */}
            <div className="text-center">
              <h1 className="text-2xl font-black tracking-tight text-dark-text font-sans mb-1">
                Welcome back
              </h1>
              <p className="text-xs text-slate-500 font-medium">
                Sign in with your MYHitch account to access the dashboard
              </p>
            </div>

            {/* Email */}
            <Input
              label="Email" type="email" value={email} onChange={setEmail}
              placeholder="name@example.com" required icon={<Mail className="h-4 w-4" />}
            />

            {/* Password */}
            <Input
              label="Password" type={showPw ? "text" : "password"}
              value={password} onChange={setPassword} placeholder="Enter your password"
              required icon={<Lock className="h-4 w-4" />}
              right={
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="text-slate-400 hover:text-slate-600 cursor-pointer transition-colors"
                  aria-label={showPw ? "Hide password" : "Show password"}>
                  {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              }
            />

            {/* Remember me + Forgot password */}
            <div className="flex items-center justify-between">
              <label htmlFor="remember-me" className="flex items-center gap-2 cursor-pointer group">
                <input
                  id="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 accent-brand-blue cursor-pointer"
                />
                <span className="text-xs font-semibold text-slate-500 group-hover:text-slate-700 transition-colors select-none">
                  Remember me
                </span>
              </label>
              <button type="button" className="text-xs font-bold text-brand-blue hover:text-brand-blue-hover transition-colors cursor-pointer">
                Forgot password?
              </button>
            </div>

            {/* Buyer account blocked message */}
            {isBuyerAccount && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 space-y-2">
                <div className="flex items-start gap-2.5">
                  <AlertCircle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-extrabold text-amber-800 mb-0.5">Buyer account detected</p>
                    <p className="text-xs text-amber-700 font-medium leading-relaxed">
                      This email is registered as a <strong>buyer account</strong> and cannot access the organiser dashboard.
                      To post and manage events, you need to create a separate organiser account.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={onRegister}
                  className="w-full mt-1 flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs py-2.5 rounded-xl transition-all cursor-pointer active:scale-[0.98]"
                >
                  <UserPlus className="h-3.5 w-3.5" />
                  Create an Organiser Account
                </button>
              </div>
            )}

            {/* Generic error message */}
            {error && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-100 text-red-700 text-xs font-semibold rounded-xl px-4 py-2.5">
                <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
                {error}
              </div>
            )}

            {/* Sign in button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-brand-blue hover:bg-brand-blue-hover text-white font-extrabold text-sm rounded-xl shadow-lg shadow-brand-blue/25 flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> Signing in…</>
              ) : (
                <>Sign in <ArrowRight className="h-4 w-4" /></>
              )}
            </button>
          </div>
          </form>

          {/* Footer */}
          <p className="mt-6 text-center text-sm text-slate-500 font-medium">
            Don&apos;t have an organiser account?{" "}
            <button
              onClick={onRegister}
              className="text-brand-blue font-bold hover:text-brand-blue-hover transition-colors cursor-pointer"
            >
              Create one free
            </button>
          </p>
          <p className="mt-2 text-center text-xs text-slate-400 font-medium">
            Buyers and organisers share the same account — just sign in.
          </p>
        </div>
      </div>

      {/* ── Right: Animated dark gradient hero ── */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900" />
        <div className="absolute top-0 -left-4 w-72 h-72 bg-brand-blue/40 rounded-full mix-blend-screen filter blur-xl opacity-80 animate-blob" />
        <div className="absolute top-0 -right-4 w-72 h-72 bg-sky-400/35 rounded-full mix-blend-screen filter blur-xl opacity-70 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-cyan-400/30 rounded-full mix-blend-screen filter blur-xl opacity-60 animate-blob animation-delay-4000" />
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 1440 560">
            <defs>
              <linearGradient id="org-wave-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#00AEEF" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.15" />
              </linearGradient>
            </defs>
            <path fill="url(#org-wave-grad)" d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,218.7C672,235,768,245,864,234.7C960,224,1056,192,1152,186.7C1248,181,1344,203,1392,213.3L1440,224L1440,560L1392,560C1344,560,1248,560,1152,560C1056,560,960,560,864,560C768,560,672,560,576,560C480,560,384,560,288,560C192,560,96,560,48,560L0,560Z" />
          </svg>
        </div>
        <div className="relative z-10 flex flex-col items-center justify-center p-12 w-full text-center space-y-6">
          <div className="inline-flex rounded-full bg-white/10 backdrop-blur-sm p-4">
            <ShieldCheck className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-3xl lg:text-4xl font-black text-white font-sans leading-tight max-w-sm">
            Organiser Dashboard
          </h2>
          <p className="text-base text-white/75 font-medium max-w-xs leading-relaxed">
            Use your MYHitch account to manage events, track ticket sales, and receive payouts.
          </p>
          <div className="flex justify-center gap-2 pt-2">
            {[0, 1, 2].map((i) => (
              <div key={i} className={`w-2 h-2 rounded-full transition-all ${i === 2 ? "bg-white w-6" : i === 1 ? "bg-white/60" : "bg-white/30"}`} />
            ))}
          </div>
          <button
            onClick={onRegister}
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/25 text-white font-extrabold text-sm px-8 py-2.5 rounded-xl backdrop-blur-sm transition-all cursor-pointer active:scale-[0.98] mt-4"
          >
            Create free account <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// ── Step 2 — Registration Form ────────────────────────────────────────────────

function Step2({
  data, onChange, onSubmit, onBack, submitting, submitError,
}: {
  data: RegData;
  onChange: (f: keyof RegData, v: string | boolean) => void;
  onSubmit: () => void;
  onBack: () => void;
  submitting?: boolean;
  submitError?: string;
}) {
  const [showPw, setShowPw] = useState(false);
  const [showCPw, setShowCPw] = useState(false);
  const [abnLoading, setAbnLoading] = useState(false);
  const [abnError, setAbnError] = useState("");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [errors, setErrors] = useState<Partial<Record<keyof RegData, string>>>({});

  const validate = (): boolean => {
    const e: Partial<Record<keyof RegData, string>> = {};
    if (!data.fullName.trim())       e.fullName     = "Full name is required";
    if (!data.email.trim())          e.email        = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) e.email = "Enter a valid email";
    if (!data.phone.trim())          e.phone        = "Phone number is required";
    if (!data.organisation.trim())   e.organisation = "Organisation name is required";
    if (!data.abn.trim())            e.abn          = "ABN is required — enter it manually if not auto-filled";
    else if (data.abn.length !== 11) e.abn          = "ABN must be 11 digits";
    if (!data.address.trim())        e.address      = "Address is required";
    if (!data.password)              e.password     = "Password is required";
    else if (data.password.length < 8) e.password   = "Password must be at least 8 characters";
    if (!data.confirmPassword)       e.confirmPassword = "Please confirm your password";
    else if (data.password !== data.confirmPassword) e.confirmPassword = "Passwords do not match";
    if (!data.agreeTerms)            e.agreeTerms   = "You must agree to the terms";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) onSubmit();
  };

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    const name = data.organisation.trim();
    if (name.length < 3) {
      onChange("abn", "");
      setAbnError("");
      return;
    }
    debounceRef.current = setTimeout(async () => {
      setAbnLoading(true);
      setAbnError("");
      try {
        const res = await fetch(`/api/abn-lookup?name=${encodeURIComponent(name)}`);
        const json = await res.json();
        if (json.results && json.results.length > 0) {
          onChange("abn", json.results[0].abn);
          setAbnError("");
        } else {
          onChange("abn", "");
          setAbnError(json.error ?? "No ABN found — enter it manually below");
        }
      } catch {
        onChange("abn", "");
        setAbnError("Lookup unavailable — enter ABN manually");
      } finally {
        setAbnLoading(false);
      }
    }, 700);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.organisation]);

  return (
    <motion.div
      key="s2"
      initial={{ opacity: 0, x: 32 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -24 }}
      transition={{ duration: 0.35 }}
      className="bg-white rounded-3xl border border-slate-100 shadow-2xl shadow-slate-200/60 p-5 sm:p-7"
    >
      <div className="mb-4">
        <h2 className="text-xl font-extrabold text-dark-text mb-0.5 font-sans">Create your account</h2>
        <p className="text-sm text-slate-500 font-medium">Fill in your details to get started as an organiser.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <Input label="Full Name" value={data.fullName} onChange={(v) => { onChange("fullName", v); setErrors(p => ({...p, fullName: ""})); }}
          placeholder="Jane Smith" required icon={<User className="h-4 w-4" />} error={errors.fullName} />
        <Input label="Email Address" type="email" value={data.email} onChange={(v) => { onChange("email", v); setErrors(p => ({...p, email: ""})); }}
          placeholder="you@example.com" required icon={<Mail className="h-4 w-4" />} error={errors.email} />
        <Input label="Phone Number" type="tel" value={data.phone} onChange={(v) => { onChange("phone", v); setErrors(p => ({...p, phone: ""})); }}
          placeholder="+61 4XX XXX XXX" required icon={<Phone className="h-4 w-4" />} error={errors.phone} />
        <Input label="Organisation / Business Name" value={data.organisation}
          onChange={(v) => { onChange("organisation", v); setErrors(p => ({...p, organisation: ""})); }}
          placeholder="e.g. Sunset Events Co." required icon={<Building2 className="h-4 w-4" />} error={errors.organisation} />

        {/* ABN — auto-fetched from ABR; editable as fallback */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-extrabold text-slate-600 uppercase tracking-wider">
            ABN <span className="text-red-500">*</span>
            {data.abn && data.abn.length === 11 && (
              <span className="ml-2 text-emerald-500 font-bold normal-case tracking-normal">✓ Found</span>
            )}
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
              {abnLoading
                ? <Loader2 className="h-4 w-4 animate-spin text-brand-blue" />
                : <Hash className="h-4 w-4" />}
            </span>
            <input
              type="text"
              value={data.abn}
              onChange={(e) => { onChange("abn", e.target.value.replace(/\D/g, "").slice(0, 11)); setErrors(p => ({...p, abn: ""})); }}
              placeholder={abnLoading ? "Looking up ABN…" : "Auto-filled or enter manually"}
              className={`w-full pl-10 pr-4 py-2.5 rounded-xl border outline-none text-sm font-medium text-dark-text transition-all placeholder:text-slate-400 ${
                errors.abn
                  ? "border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100"
                  : data.abn && data.abn.length === 11
                    ? "border-emerald-300 bg-emerald-50/40 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                    : "border-slate-200 bg-white focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/10"
              }`}
            />
          </div>
          {errors.abn
            ? <p className="text-xs text-red-500 font-medium flex items-center gap-1"><AlertCircle className="h-3 w-3 flex-shrink-0" />{errors.abn}</p>
            : abnError && !data.abn
              ? <p className="text-xs text-amber-500 font-medium flex items-center gap-1"><AlertCircle className="h-3 w-3 flex-shrink-0" />{abnError}</p>
              : null}
        </div>

        <Input label="Address" value={data.address} onChange={(v) => { onChange("address", v); setErrors(p => ({...p, address: ""})); }}
          placeholder="e.g. 123 Main St, Sydney NSW 2000" required icon={<MapPin className="h-4 w-4" />} error={errors.address} />

        <Input label="Password" type={showPw ? "text" : "password"} value={data.password}
          onChange={(v) => { onChange("password", v); setErrors(p => ({...p, password: ""})); }}
          placeholder="At least 8 characters" required icon={<Lock className="h-4 w-4" />} error={errors.password}
          right={
            <button type="button" onClick={() => setShowPw(!showPw)}
              className="text-slate-400 hover:text-slate-600 cursor-pointer">
              {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          } />
        <Input label="Confirm Password" type={showCPw ? "text" : "password"} value={data.confirmPassword}
          onChange={(v) => { onChange("confirmPassword", v); setErrors(p => ({...p, confirmPassword: ""})); }}
          placeholder="Repeat your password" required icon={<Lock className="h-4 w-4" />} error={errors.confirmPassword}
          right={
            <button type="button" onClick={() => setShowCPw(!showCPw)}
              className="text-slate-400 hover:text-slate-600 cursor-pointer">
              {showCPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          } />
      </div>

      {/* Terms */}
      <div
        className="flex items-start gap-3 mt-3 cursor-pointer group"
        onClick={() => { onChange("agreeTerms", !data.agreeTerms); setErrors(p => ({...p, agreeTerms: ""})); }}
      >
        <div className={`mt-0.5 h-4 w-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all ${
          data.agreeTerms ? "bg-brand-blue border-brand-blue" : "border-slate-300 group-hover:border-brand-blue/50"
        }`}>
          {data.agreeTerms && <Check className="h-2.5 w-2.5 text-white" />}
        </div>
        <span className="text-xs text-slate-600 font-medium leading-relaxed select-none">
          I agree to the{" "}
          <span className="text-brand-blue font-bold hover:underline" onClick={(e) => e.stopPropagation()}>
            Terms & Conditions
          </span>{" "}and the{" "}
          <span className="text-brand-blue font-bold hover:underline" onClick={(e) => e.stopPropagation()}>
            Organiser Agreement
          </span>
        </span>
      </div>

      {errors.agreeTerms && (
        <p className="mt-1.5 text-xs text-red-500 font-medium flex items-center gap-1">
          <AlertCircle className="h-3 w-3 flex-shrink-0" />{errors.agreeTerms}
        </p>
      )}

      {submitError && (
        <p className="mt-3 text-xs text-red-500 font-medium flex items-center gap-1.5 bg-red-50 border border-red-100 rounded-xl px-4 py-2.5">
          <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />{submitError}
        </p>
      )}

      <div className="flex gap-3 mt-4">
        <button onClick={onBack} disabled={submitting}
          className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-extrabold text-sm hover:bg-slate-50 transition-all cursor-pointer active:scale-[0.98] disabled:opacity-50">
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
        <button onClick={handleSubmit} disabled={submitting}
          className="flex-1 bg-brand-blue hover:bg-brand-blue-hover text-white font-extrabold text-sm py-2.5 rounded-xl shadow-lg shadow-brand-blue/25 flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed">
          {submitting
            ? <><Loader2 className="h-4 w-4 animate-spin" /> Creating account…</>
            : <>Create Account &amp; Verify Email <ArrowRight className="h-4 w-4" /></>}
        </button>
      </div>
    </motion.div>
  );
}

// ── Step 3 — Email Verification (OTP) ────────────────────────────────────────

function Step3({ email, onVerified, onResend }: { email: string; onVerified: () => void; onResend: () => void }) {
  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState("");
  const [resent, setResent] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleDigit = (i: number, val: string) => {
    const d = val.replace(/\D/g, "").slice(-1);
    const next = [...digits];
    next[i] = d;
    setDigits(next);
    setError("");
    if (d && i < 5) inputRefs.current[i + 1]?.focus();
  };

  const handleKeyDown = (i: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !digits[i] && i > 0) inputRefs.current[i - 1]?.focus();
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted.length === 6) {
      setDigits(pasted.split(""));
      inputRefs.current[5]?.focus();
    }
  };

  const handleVerify = async () => {
    const code = digits.join("");
    if (code.length < 6) { setError("Enter all 6 digits"); return; }
    setVerifying(true);
    setError("");
    try {
      const res = await fetch(`${API}/auth/verify-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({ code, email }),
      });
      const json = await res.json();
      if (!res.ok) { setError(json.message ?? "Invalid code"); return; }
      if (json.token) localStorage.setItem("organiser_token", json.token);
      onVerified();
    } catch {
      setError("Connection error. Try again.");
    } finally {
      setVerifying(false);
    }
  };

  const handleResend = async () => {
    setResent(true);
    setDigits(["", "", "", "", "", ""]);
    setError("");
    onResend();
    setTimeout(() => setResent(false), 4000);
    inputRefs.current[0]?.focus();
  };

  return (
    <motion.div
      key="s3"
      initial={{ opacity: 0, x: 32 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -24 }}
      transition={{ duration: 0.35 }}
      className="bg-white rounded-3xl border border-slate-100 shadow-2xl shadow-slate-200/60 p-8 sm:p-12 text-center"
    >
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 18 }}
        className="mx-auto mb-5 h-20 w-20 rounded-3xl bg-brand-blue/10 flex items-center justify-center"
      >
        <Mail className="h-10 w-10 text-brand-blue" />
      </motion.div>

      <h2 className="text-2xl font-extrabold text-dark-text mb-1 font-sans">Enter verification code</h2>
      <p className="text-sm text-slate-500 font-medium mb-1">We sent a 6-digit code to</p>
      <p className="text-sm font-black text-brand-blue mb-6">{email || "your@email.com"}</p>

      {/* OTP boxes */}
      <div className="flex justify-center gap-2.5 mb-3" onPaste={handlePaste}>
        {digits.map((d, i) => (
          <input
            key={i}
            ref={el => { inputRefs.current[i] = el; }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={d}
            onChange={e => handleDigit(i, e.target.value)}
            onKeyDown={e => handleKeyDown(i, e)}
            className={`w-12 h-14 text-center text-2xl font-black rounded-xl border-2 outline-none transition-all ${
              error
                ? "border-red-300 bg-red-50"
                : d
                  ? "border-brand-blue bg-brand-blue/5 text-brand-blue"
                  : "border-slate-200 focus:border-brand-blue focus:bg-brand-blue/5"
            }`}
          />
        ))}
      </div>

      {error && (
        <p className="text-xs text-red-500 font-medium flex items-center justify-center gap-1 mb-3">
          <AlertCircle className="h-3 w-3" />{error}
        </p>
      )}

      <button
        onClick={handleVerify}
        disabled={verifying || digits.join("").length < 6}
        className="w-full bg-brand-blue hover:bg-brand-blue-hover text-white font-extrabold text-sm py-3 rounded-xl shadow-lg shadow-brand-blue/25 flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed mb-4 cursor-pointer"
      >
        {verifying ? <><Loader2 className="h-4 w-4 animate-spin" /> Verifying…</> : <><Check className="h-4 w-4" /> Verify Email</>}
      </button>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <button onClick={handleResend} disabled={resent}
          className="flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs px-6 py-2.5 rounded-xl transition-all cursor-pointer active:scale-[0.98] disabled:opacity-60">
          <RefreshCw className={`h-3.5 w-3.5 ${resent ? "animate-spin" : ""}`} />
          {resent ? "New code sent!" : "Resend Code"}
        </button>
      </div>

      <p className="text-xs text-slate-400 font-medium mt-4">
        Can&apos;t find it? Check your spam folder.
      </p>
      <p className="text-xs text-slate-400 font-medium">
        Can&apos;t find it? Check your spam or junk folder.
      </p>
    </motion.div>
  );
}

// ── Step 4 — Connect Stripe ───────────────────────────────────────────────────

function Step4() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [stripeStatus, setStripeStatus] = useState<"unknown" | "connected" | "pending">("unknown");

  // Check existing Stripe status on mount
  useEffect(() => {
    const token = localStorage.getItem("organiser_token") ?? localStorage.getItem("myhitch_token");
    if (!token) return;
    fetch(`${API}/stripe/status`, {
      headers: { "Authorization": `Bearer ${token}`, "Accept": "application/json" },
    })
      .then(r => r.json())
      .then(json => {
        if (json.connected && json.account_status === "active") setStripeStatus("connected");
        else if (json.connected) setStripeStatus("pending");
      })
      .catch(() => {});
  }, []);

  const handleConnect = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("organiser_token") ?? localStorage.getItem("myhitch_token");
      if (!token) { setError("Session expired — please sign in again."); setLoading(false); return; }
      const res = await fetch(`${API}/stripe/connect-url`, {
        headers: { "Authorization": `Bearer ${token}`, "Accept": "application/json" },
      });
      const json = await res.json();
      if (!res.ok) { setError(json.message ?? "Failed to get Stripe onboarding URL."); setLoading(false); return; }
      window.location.href = json.url;
    } catch {
      setError("Connection error. Please check your internet and try again.");
      setLoading(false);
    }
  };

  return (
    <motion.div
      key="s4"
      initial={{ opacity: 0, x: 32 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -24 }}
      transition={{ duration: 0.35 }}
      className="bg-white rounded-3xl border border-slate-100 shadow-2xl shadow-slate-200/60 p-6 sm:p-8"
    >
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* Info */}
        <div className="flex-1">
          {stripeStatus === "connected" && (
            <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold px-4 py-2.5 rounded-xl mb-4">
              <Check className="h-4 w-4 flex-shrink-0" />
              Stripe already connected — you can reconnect below if needed.
            </div>
          )}
          {stripeStatus === "pending" && (
            <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-700 text-xs font-bold px-4 py-2.5 rounded-xl mb-4">
              <RefreshCw className="h-4 w-4 flex-shrink-0" />
              Onboarding incomplete — click Connect to finish your Stripe setup.
            </div>
          )}
          {stripeStatus === "unknown" && (
            <span className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-600 text-xs font-bold px-3 py-1.5 rounded-full mb-4 border border-emerald-100">
              <ShieldCheck className="h-3.5 w-3.5" /> Secure & trusted
            </span>
          )}
          <h2 className="text-xl font-extrabold text-dark-text mb-2 font-sans leading-tight">
            Connect your Stripe account to receive payments
          </h2>
          <p className="text-sm text-slate-600 font-medium leading-relaxed mb-4">
            MYHitch Pass uses Stripe to process all ticket sales. Connect or create a free Stripe account to start receiving payouts directly to your Australian bank account.
          </p>
          <ul className="space-y-2 mb-5">
            {[
              "Payouts land in your bank within 2–3 business days",
              "Industry-standard encryption & fraud protection",
              "No monthly Stripe fees for basic accounts",
              "Works with your existing Stripe account",
            ].map((pt) => (
              <li key={pt} className="flex items-start gap-2.5 text-sm text-slate-600 font-medium">
                <Check className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />{pt}
              </li>
            ))}
          </ul>
          <button onClick={handleConnect} disabled={loading}
            className="flex items-center gap-2.5 bg-[#635BFF] hover:bg-[#4f48e8] text-white font-extrabold text-sm px-7 py-3 rounded-xl shadow-lg shadow-[#635BFF]/25 transition-all active:scale-[0.98] cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ExternalLink className="h-4 w-4" />}
            {loading ? "Redirecting to Stripe…" : "Connect with Stripe"}
          </button>
          {error && (
            <p className="text-xs text-red-500 font-medium flex items-center gap-1 mt-2">
              <AlertCircle className="h-3 w-3" />{error}
            </p>
          )}
          <p className="text-xs text-slate-400 font-medium mt-3">
            You'll be redirected to Stripe's secure onboarding. Return here once connected.
          </p>
        </div>

        {/* Stripe card visual */}
        <div className="w-full lg:w-52 bg-gradient-to-br from-[#635BFF] to-[#9B94FF] rounded-2xl p-5 text-white flex-shrink-0 shadow-xl shadow-[#635BFF]/20">
          <div className="text-3xl font-black mb-0.5 tracking-tight">stripe</div>
          <div className="text-xs text-white/60 font-medium mb-5">Powered by Stripe Connect</div>
          <div className="space-y-2 mb-5">
            <div className="h-1.5 w-3/4 bg-white/20 rounded-full" />
            <div className="h-1.5 w-1/2 bg-white/15 rounded-full" />
          </div>
          <div className="flex items-center gap-2 text-xs font-bold bg-white/10 rounded-xl px-3 py-2">
            <ShieldCheck className="h-3.5 w-3.5" /> PCI DSS compliant
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ── Creative step sidebar (desktop right panel for steps 2-4) ────────────────

const SIDEBAR_STEPS = [
  {
    n: 2,
    label: "Your Details",
    desc: "Create your organiser profile",
    icon: <UserPlus className="h-5 w-5" />,
  },
  {
    n: 3,
    label: "Verify Email",
    desc: "Confirm your email address",
    icon: <Mail className="h-5 w-5" />,
  },
  {
    n: 4,
    label: "Connect Payouts",
    desc: "Link Stripe to receive payments",
    icon: <Banknote className="h-5 w-5" />,
  },
];

function StepSidebar({ current }: { current: number }) {
  return (
    <div className="hidden lg:flex w-[340px] xl:w-[380px] flex-col relative overflow-hidden flex-shrink-0">
      {/* Gradient base */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900" />

      {/* Animated blobs */}
      <div className="absolute top-0 -left-8 w-72 h-72 bg-brand-blue/40 rounded-full mix-blend-screen filter blur-xl opacity-80 animate-blob" />
      <div className="absolute bottom-10 -right-8 w-64 h-64 bg-sky-400/30 rounded-full mix-blend-screen filter blur-xl opacity-60 animate-blob animation-delay-2000" />
      <div className="absolute top-1/2 left-1/4 w-56 h-56 bg-cyan-400/20 rounded-full mix-blend-screen filter blur-xl opacity-50 animate-blob animation-delay-4000" />

      {/* Wave overlay */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 400 800">
          <defs>
            <linearGradient id="sw-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00AEEF" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.1" />
            </linearGradient>
          </defs>
          <path fill="url(#sw-grad)" d="M0,300 C100,250 300,350 400,300 L400,800 L0,800 Z" />
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col h-full px-8 xl:px-10 py-9">

        {/* Brand */}
        <div className="mb-10">
          <div className="flex items-center gap-2.5 mb-2">
            <img
              src="/logo.png"
              alt="MYHitch Pass"
              className="h-8 w-auto object-contain brightness-0 invert"
              onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
            />
          </div>
          <p className="text-[10px] font-extrabold text-white/50 uppercase tracking-widest">
            Organiser Setup
          </p>
        </div>

        {/* Step list */}
        <div className="flex-1 flex flex-col justify-center">
          <p className="text-[10px] font-extrabold text-white/40 uppercase tracking-widest mb-6">
            Your progress
          </p>

          <div className="space-y-1">
            {SIDEBAR_STEPS.map((step, i) => {
              const done = current > step.n;
              const active = current === step.n;

              return (
                <div key={step.n} className="relative">
                  {/* Connector line */}
                  {i < SIDEBAR_STEPS.length - 1 && (
                    <div
                      className={`absolute left-5 top-[52px] w-0.5 h-6 transition-all duration-500 ${
                        done ? "bg-emerald-400/70" : "bg-white/10"
                      }`}
                    />
                  )}

                  <div
                    className={`flex items-start gap-4 p-4 rounded-2xl transition-all duration-300 ${
                      active
                        ? "bg-white/10 border border-white/15 shadow-lg"
                        : "border border-transparent"
                    }`}
                  >
                    {/* Icon circle */}
                    <div
                      className={`h-10 w-10 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                        done
                          ? "bg-emerald-500 shadow-md shadow-emerald-500/30"
                          : active
                          ? "bg-brand-blue shadow-lg shadow-brand-blue/40"
                          : "bg-white/8 border border-white/10"
                      }`}
                    >
                      {done ? (
                        <Check className="h-5 w-5 text-white" />
                      ) : (
                        <span className={active ? "text-white" : "text-white/30"}>
                          {step.icon}
                        </span>
                      )}
                    </div>

                    {/* Text */}
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-sm font-extrabold transition-all ${
                          done
                            ? "text-emerald-400"
                            : active
                            ? "text-white"
                            : "text-white/35"
                        }`}
                      >
                        {step.label}
                      </p>
                      <p
                        className={`text-xs font-medium mt-0.5 transition-all ${
                          active ? "text-white/65" : "text-white/25"
                        }`}
                      >
                        {step.desc}
                      </p>
                    </div>

                    {/* Active pulse dot */}
                    {active && (
                      <div className="flex-shrink-0 mt-1.5">
                        <span className="relative flex h-2.5 w-2.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-blue opacity-60" />
                          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-brand-blue" />
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom stats */}
        <div className="pt-7 border-t border-white/10">
          <p className="text-xs text-white/40 font-medium mb-4 leading-relaxed">
            Takes less than 5 minutes. No credit card required.
          </p>
          <div className="grid grid-cols-3 gap-2">
            {[
              { icon: <Zap className="h-3.5 w-3.5" />, value: "1,100+", label: "Organisers" },
              { icon: <BarChart3 className="h-3.5 w-3.5" />, value: "$2.1M", label: "Paid out" },
              { icon: <Clock className="h-3.5 w-3.5" />, value: "2–3d", label: "Payouts" },
            ].map((stat) => (
              <div key={stat.label} className="bg-white/6 border border-white/8 rounded-xl p-3 text-center">
                <span className="text-white/40 flex justify-center mb-1">{stat.icon}</span>
                <p className="text-white font-black text-sm">{stat.value}</p>
                <p className="text-white/35 text-[9px] font-bold uppercase tracking-wider">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Top bar (shown on all organiser pages) ────────────────────────────────────

function TopBar() {
  return (
    <div className="bg-white border-b border-slate-100 shadow-sm flex-shrink-0">
      <div className="h-[3px] w-full bg-gradient-to-r from-[#00AEEF] via-purple-400 to-pink-400" />
      <div className="h-12 flex items-center justify-end px-4 sm:px-6 lg:px-8">
        <Link href="/"
          className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-brand-blue transition-colors">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to site
        </Link>
      </div>
    </div>
  );
}

// ── Main View ─────────────────────────────────────────────────────────────────

export default function OrganiserSignupView() {
  const router = useRouter();
  const { setUserProfile, handleLoginSuccess } = useAppContext();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<RegData>(EMPTY);
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const update = (f: keyof RegData, v: string | boolean) =>
    setFormData((prev) => ({ ...prev, [f]: v }));

  // ── Real login — called from Step1 ───────────────────────────────────────
  const handleLogin = async (email: string, password: string): Promise<void> => {
    const res = await fetch(`${API}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const json = await res.json();
    if (!res.ok) {
      const msg = json.errors
        ? (Object.values(json.errors as Record<string, string[]>)[0]?.[0] ?? json.message)
        : json.message;
      throw new Error(msg ?? "Invalid credentials. Please try again.");
    }

    const role = json.user?.role;

    // Buyer accounts cannot access the organiser dashboard
    if (role === "buyer") {
      throw new Error(
        "BUYER_ACCOUNT"
      );
    }

    // Only organizer / admin can proceed
    if (json.token) {
      localStorage.setItem("myhitch_token", json.token);
      localStorage.setItem("organiser_token", json.token);
    }
    if (json.user) {
      localStorage.setItem("myhitch_user", JSON.stringify(json.user));
      const profile = { name: json.user.name ?? "", email: json.user.email ?? "", avatar: json.user.avatar_url ?? "" };
      localStorage.setItem("myhitch_userProfile", JSON.stringify(profile));
      setUserProfile(profile);
    }
    handleLoginSuccess(json.user?.name ?? "", json.user?.email ?? email);
    router.push("/organiser/dashboard");
  };

  const handleRegister = async () => {
    setSubmitError("");
    setSubmitting(true);
    try {
      let res: Response;
      try {
        res = await fetch(`${API}/auth/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json", "Accept": "application/json" },
          body: JSON.stringify({
            name:                  formData.fullName,
            email:                 formData.email,
            password:              formData.password,
            password_confirmation: formData.confirmPassword,
            phone:                 formData.phone,
            organisation:          formData.organisation,
            abn:                   formData.abn,
            address:               formData.address,
            role:                  "organizer",
          }),
        });
      } catch {
        setSubmitError("Unable to reach the server. Please check your internet connection.");
        return;
      }

      let json: Record<string, unknown> = {};
      try {
        json = await res.json();
      } catch {
        setSubmitError(`Server error (${res.status}). Please try again.`);
        return;
      }

      if (!res.ok) {
        const errors = json.errors as Record<string, string[]> | undefined;
        const first = errors ? Object.values(errors)[0]?.[0] : undefined;
        setSubmitError(first ?? (json.message as string) ?? "Registration failed. Please try again.");
        return;
      }

      setStep(3);
    } finally {
      setSubmitting(false);
    }
  };

  const handleResend = async () => {
    await fetch(`${API}/auth/resend-verification`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify({ email: formData.email }),
    });
  };


  return (
    <div className="h-screen bg-soft-bg flex flex-col overflow-hidden">
      <TopBar />

      {step === 1 ? (
        <div className="flex-1 flex flex-col overflow-hidden bg-white">
          <AnimatePresence mode="wait">
            <Step1
              key="s1"
              onLogin={handleLogin}
              onRegister={() => setStep(2)}
            />
          </AnimatePresence>
        </div>
      ) : (
        /* Steps 2-4: split layout — form left, creative step panel right */
        <div className="flex-1 flex overflow-hidden">

          {/* ── Left: form with ghost bg image ── */}
          <div className="flex-1 overflow-y-auto scrollbar-none relative flex flex-col">
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-[0.07] pointer-events-none"
              style={{ backgroundImage: "url('/images/cta-bg.png')" }}
              aria-hidden="true"
            />

            {/* Mobile-only compact step bar */}
            <div className="lg:hidden relative z-10 pt-5 px-4 sm:px-6">
              <StepBar current={step} />
            </div>

            <div className="relative z-10 flex-1 flex flex-col justify-center py-4 px-6 sm:px-10 lg:px-14">
              <div className="w-full max-w-3xl mx-auto">
                <AnimatePresence mode="wait">
                  {step === 2 && (
                    <Step2
                      key="s2"
                      data={formData}
                      onChange={update}
                      onSubmit={handleRegister}
                      onBack={() => setStep(1)}
                      submitting={submitting}
                      submitError={submitError}
                    />
                  )}
                  {step === 3 && (
                    <Step3
                      key="s3"
                      email={formData.email}
                      onVerified={() => setStep(4)}
                      onResend={handleResend}
                    />
                  )}
                  {step === 4 && <Step4 key="s4" />}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* ── Right: creative step sidebar (desktop only) ── */}
          <StepSidebar current={step} />
        </div>
      )}
    </div>
  );
}
