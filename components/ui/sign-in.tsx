"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import {
  Eye, EyeOff, Mail, Lock, User,
  Zap, BarChart3, Clock, ArrowRight, CheckCircle2, ShieldCheck,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
export interface Testimonial {
  avatarSrc: string;
  name: string;
  handle: string;
  text: string;
}

export interface SignUpData {
  fullName: string;
  email: string;
  phone: string;
  organisation: string;
  eventType: string;
  password: string;
}

export interface SignInPageProps {
  heroImageSrc?: string;
  testimonials?: Testimonial[];
  onSignIn?: (data: { email: string; password: string; rememberMe: boolean }) => Promise<{ success: boolean; error?: string }> | void;
  onSignUp?: (data: SignUpData) => Promise<{ success: boolean; error?: string }> | void;
  onVerifyOtp?: (email: string, otp: string) => Promise<{ success: boolean; error?: string }> | void;
  onResendOtp?: (email: string) => void;
  onResetPassword?: () => void;
  signUpError?: string | null;
}

// ─── Field ────────────────────────────────────────────────────────────────────
const Field = ({
  label, id, type = "text", placeholder, value, onChange, icon: Icon, required = false,
}: {
  label: string; id: string; type?: string; placeholder?: string;
  value: string; onChange: (v: string) => void;
  icon?: React.ComponentType<{ className?: string }>; required?: boolean;
}) => (
  <div className="space-y-1.5">
    <label htmlFor={id} className="block text-[10px] font-bold uppercase tracking-[0.15em] text-[#64748b]">
      {label}
    </label>
    <div className="relative">
      {Icon && <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />}
      <input
        id={id} type={type} placeholder={placeholder} value={value}
        onChange={(e) => onChange(e.target.value)} required={required}
        className={`w-full h-11 rounded-xl border border-gray-200 bg-gray-50 text-sm text-[#0d0f14]
          placeholder:text-gray-400 focus:outline-none focus:border-[#00aeef]/60
          focus:bg-[#00aeef]/5 transition-all duration-200 ${Icon ? "pl-10 pr-4" : "px-4"}`}
      />
    </div>
  </div>
);

// ─── Password Field ───────────────────────────────────────────────────────────
const PasswordField = ({
  label, id, placeholder, value, onChange,
}: {
  label: string; id: string; placeholder?: string; value: string; onChange: (v: string) => void;
}) => {
  const [show, setShow] = useState(false);
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-[10px] font-bold uppercase tracking-[0.15em] text-[#64748b]">
        {label}
      </label>
      <div className="relative">
        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          id={id} type={show ? "text" : "password"} placeholder={placeholder} value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full h-11 rounded-xl border border-gray-200 bg-gray-50 text-sm text-[#0d0f14]
            pl-10 pr-11 placeholder:text-gray-400 focus:outline-none focus:border-[#00aeef]/60
            focus:bg-[#00aeef]/5 transition-all duration-200"
        />
        <button type="button" onClick={() => setShow(!show)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
          {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );
};

// ─── Feature Pill ─────────────────────────────────────────────────────────────
const FeaturePill = ({ icon, text }: { icon: React.ReactNode; text: string }) => (
  <div className="flex items-center gap-3 text-sm text-white/80">
    <div className="h-9 w-9 rounded-xl bg-[#00aeef]/10 border border-[#00aeef]/20
      flex items-center justify-center shrink-0 text-[#00aeef]">
      {icon}
    </div>
    <span>{text}</span>
  </div>
);

// ─── Testimonial Card ─────────────────────────────────────────────────────────
const TestimonialCard = ({ t, delay }: { t: Testimonial; delay: string }) => (
  <div className={`animate-testimonial ${delay} flex flex-col gap-2 rounded-2xl
    bg-[#0d0f14]/75 backdrop-blur-xl border border-white/10 p-4 w-52 shrink-0`}>
    <div className="flex items-center gap-2.5">
      <img src={t.avatarSrc} alt={t.name} className="h-8 w-8 rounded-xl object-cover" />
      <div>
        <p className="text-xs font-semibold text-white leading-none">{t.name}</p>
        <p className="text-[10px] text-[#475569] mt-0.5">{t.handle}</p>
      </div>
    </div>
    <p className="text-xs text-white/65 leading-relaxed">{t.text}</p>
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────
export const SignInPage: React.FC<SignInPageProps> = ({
  heroImageSrc = "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=1800&q=80",
  testimonials = [],
  onSignIn, onSignUp, onVerifyOtp, onResendOtp, onResetPassword, signUpError,
}) => {
  const [mode, setMode] = useState<"signin" | "signup" | "verify">("signin");

  // sign-in
  const [siEmail, setSiEmail] = useState("");
  const [siPassword, setSiPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  // sign-up
  const [suFullName, setSuFullName] = useState("");
  const [suEmail, setSuEmail] = useState("");
  const [suPassword, setSuPassword] = useState("");
  const [suConfirm, setSuConfirm] = useState("");
  const [suTerms, setSuTerms] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [signInError, setSignInError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // OTP verify
  const [otpDigits, setOtpDigits] = useState<string[]>(Array(6).fill(""));
  const [pendingEmail, setPendingEmail] = useState("");
  const [otpError, setOtpError] = useState<string | null>(null);
  const [resendTimer, setResendTimer] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startResendTimer = () => {
    setResendTimer(60);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setResendTimer((t) => {
        if (t <= 1) { clearInterval(timerRef.current!); return 0; }
        return t - 1;
      });
    }, 1000);
  };

  useEffect(() => () => { if (timerRef.current) clearInterval(timerRef.current); }, []);

  // ── Handlers ────────────────────────────────────────────────────────────────
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignInError(null);
    setIsSubmitting(true);
    const result = await onSignIn?.({ email: siEmail, password: siPassword, rememberMe });
    setIsSubmitting(false);
    if (result && result.success === false) {
      setSignInError(result.error ?? "Invalid email or password.");
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    if (suPassword !== suConfirm) { setLocalError("Passwords do not match."); return; }
    if (!suTerms) { setLocalError("You must agree to the Terms & Conditions."); return; }

    const data: SignUpData = {
      fullName: suFullName, email: suEmail,
      phone: "", organisation: "", eventType: "", password: suPassword,
    };

    // If OTP verification is wired up, request code then switch to verify step.
    if (onVerifyOtp) {
      setIsSubmitting(true);
      const result = await onSignUp?.(data);
      setIsSubmitting(false);
      if (result && result.success === false) {
        setLocalError(result.error ?? "Something went wrong. Please try again.");
        return;
      }
      setPendingEmail(suEmail);
      setOtpDigits(Array(6).fill(""));
      setOtpError(null);
      setMode("verify");
      startResendTimer();
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
    } else {
      onSignUp?.(data);
    }
  };

  // OTP digit input
  const handleOtpChange = (i: number, val: string) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...otpDigits];
    next[i] = val;
    setOtpDigits(next);
    if (val && i < 5) inputRefs.current[i + 1]?.focus();
  };

  const handleOtpKeyDown = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otpDigits[i] && i > 0) {
      inputRefs.current[i - 1]?.focus();
    }
  };

  // Support pasting the full 6-digit code
  const handleOtpPaste = (e: React.ClipboardEvent) => {
    const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (text.length > 0) {
      const next = Array(6).fill("");
      text.split("").forEach((c, idx) => { next[idx] = c; });
      setOtpDigits(next);
      inputRefs.current[Math.min(text.length, 5)]?.focus();
      e.preventDefault();
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = otpDigits.join("");
    if (code.length < 6) { setOtpError("Please enter the full 6-digit code."); return; }
    setIsSubmitting(true);
    const result = await onVerifyOtp?.(pendingEmail, code);
    setIsSubmitting(false);
    if (result && result.success === false) {
      setOtpError(result.error ?? "Verification failed. Please try again.");
      setOtpDigits(Array(6).fill(""));
      setTimeout(() => inputRefs.current[0]?.focus(), 50);
    }
  };

  const handleResendOtp = () => {
    if (resendTimer > 0) return;
    onResendOtp?.(pendingEmail);
    setOtpDigits(Array(6).fill(""));
    setOtpError(null);
    startResendTimer();
    setTimeout(() => inputRefs.current[0]?.focus(), 50);
  };

  const error = localError ?? signUpError;

  return (
    <div className="h-screen w-screen flex overflow-hidden bg-white">

      {/* ── LEFT PANEL ──────────────────────────────────────────── */}
      <div className="relative flex-1 flex flex-col overflow-y-auto">

        {/* Mesh gradient background */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full
            bg-[#00d4ff]/10 blur-[120px]" />
          <div className="absolute bottom-0 left-1/2 w-[400px] h-[400px] rounded-full
            bg-[#7c3aed]/8 blur-[100px]" />
        </div>

        {/* Logo */}
        <div className="relative z-10 px-8 pt-8 pb-6 shrink-0">
          <div className="flex items-center justify-center">
            <Image src="/logo.png" alt="MYHitch Pass" width={160} height={56}
              className="object-contain" style={{ height: "56px", width: "auto" }} />
          </div>
        </div>

        {/* Tab toggle — hidden during OTP verify step */}
        {mode !== "verify" && (
          <div className="relative z-10 px-8 shrink-0">
            <div className="w-full max-w-md mx-auto">
              <div className="flex gap-1 p-1 rounded-xl bg-gray-100 border border-gray-200">
                {(["signin", "signup"] as const).map((m) => (
                  <button key={m} type="button"
                    onClick={() => { setMode(m); setLocalError(null); setSignInError(null); }}
                    className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                      mode === m
                        ? "bg-[#00aeef] text-white shadow-lg shadow-[#00aeef]/30"
                        : "text-[#475569] hover:text-[#0d0f14]"
                    }`}>
                    {m === "signin" ? "Sign In" : "Create Account"}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Form content */}
        <div className="relative z-10 flex justify-center px-8 pt-7 pb-8 overflow-y-auto">
          <div className="w-full max-w-md">

            {/* ── SIGN IN ── */}
            {mode === "signin" && (
              <>
                <div className="mb-6">
                  <h1 className="text-3xl font-bold text-[#0d0f14] mb-1">Welcome back</h1>
                  <p className="text-sm text-[#475569]">
                    Sign in to your account to discover and book events.
                  </p>
                </div>

                <form onSubmit={handleSignIn} className="space-y-4">
                  <Field label="Email Address" id="si-email" type="email"
                    placeholder="you@example.com" value={siEmail}
                    onChange={setSiEmail} icon={Mail} required />
                  <PasswordField label="Password" id="si-password"
                    placeholder="Enter your password" value={siPassword} onChange={setSiPassword} />

                  <div className="flex items-center justify-between text-sm">
                    <label className="flex items-center gap-2.5 cursor-pointer">
                      <input type="checkbox" checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="h-4 w-4 rounded accent-[#00aeef]" />
                      <span className="text-[#64748b]">Remember me</span>
                    </label>
                    <button type="button" onClick={onResetPassword}
                      className="text-[#00aeef] hover:underline transition-colors text-sm">
                      Forgot password?
                    </button>
                  </div>

                  {signInError && (
                    <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20
                      rounded-xl px-3.5 py-2.5">
                      {signInError}
                    </p>
                  )}

                  <button type="submit" disabled={isSubmitting}
                    className="w-full h-12 rounded-xl bg-[#00aeef] hover:bg-[#0096cf] text-white
                      font-semibold transition-all duration-200 shadow-lg shadow-[#00aeef]/20 mt-1
                      disabled:opacity-60 disabled:cursor-not-allowed">
                    {isSubmitting ? "Signing in…" : "Sign In"}
                  </button>
                </form>

                <p className="text-center text-sm text-gray-500 mt-5">
                  New to MYHitch?{" "}
                  <button type="button" onClick={() => setMode("signup")}
                    className="text-[#00aeef] font-semibold hover:underline">
                    Create a free account
                  </button>
                </p>
              </>
            )}

            {/* ── CREATE ACCOUNT ── */}
            {mode === "signup" && (
              <>
                <div className="mb-6">
                  <h1 className="text-3xl font-bold text-[#0d0f14] mb-1">Create your account</h1>
                  <p className="text-sm text-[#475569]">
                    Join MYHitch to discover and book events near you.
                  </p>
                </div>

                <form onSubmit={handleSignUp} className="space-y-4">
                  <Field label="Full Name" id="su-name" placeholder="Jane Smith"
                    value={suFullName} onChange={setSuFullName} icon={User} required />

                  <Field label="Email Address" id="su-email" type="email"
                    placeholder="you@example.com" value={suEmail}
                    onChange={setSuEmail} icon={Mail} required />

                  <PasswordField label="Password" id="su-password"
                    placeholder="At least 8 characters" value={suPassword} onChange={setSuPassword} />

                  <PasswordField label="Confirm Password" id="su-confirm"
                    placeholder="Repeat password" value={suConfirm} onChange={setSuConfirm} />

                  <label className="flex items-start gap-2.5 cursor-pointer text-sm">
                    <input type="checkbox" checked={suTerms}
                      onChange={(e) => setSuTerms(e.target.checked)}
                      className="mt-0.5 h-4 w-4 rounded accent-[#00aeef] shrink-0" />
                    <span className="text-[#475569]">
                      I agree to the{" "}
                      <a href="/terms" className="text-[#00aeef] hover:underline">Terms &amp; Conditions</a>
                      {" "}and{" "}
                      <a href="/privacy" className="text-[#00aeef] hover:underline">Privacy Policy</a>
                    </span>
                  </label>

                  {error && (
                    <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20
                      rounded-xl px-3.5 py-2.5">
                      {error}
                    </p>
                  )}

                  <button type="submit" disabled={isSubmitting}
                    className="w-full h-12 rounded-xl bg-[#00aeef] hover:bg-[#0096cf] text-white
                      font-semibold transition-all duration-200 shadow-lg shadow-[#00aeef]/20
                      disabled:opacity-60 disabled:cursor-not-allowed">
                    {isSubmitting ? "Sending code…" : "Create Account"}
                  </button>
                </form>

                <p className="text-center text-sm text-gray-500 mt-5">
                  Already have an account?{" "}
                  <button type="button" onClick={() => setMode("signin")}
                    className="text-[#00aeef] font-semibold hover:underline">
                    Sign in
                  </button>
                </p>
              </>
            )}

            {/* ── VERIFY EMAIL (OTP) ── */}
            {mode === "verify" && (
              <>
                <div className="mb-6">
                  <div className="h-12 w-12 rounded-2xl bg-[#00aeef]/10 border border-[#00aeef]/20
                    flex items-center justify-center mb-4">
                    <ShieldCheck className="h-6 w-6 text-[#00aeef]" />
                  </div>
                  <h1 className="text-3xl font-bold text-[#0d0f14] mb-1">Verify your email</h1>
                  <p className="text-sm text-[#475569]">
                    We sent a 6-digit code to{" "}
                    <span className="font-semibold text-[#0d0f14]">{pendingEmail}</span>.
                    Enter it below to activate your account.
                  </p>
                </div>

                <form onSubmit={handleVerifyOtp} className="space-y-6">
                  {/* OTP digit boxes */}
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#64748b] mb-3">
                      Verification Code
                    </p>
                    <div className="flex gap-2.5 justify-between" onPaste={handleOtpPaste}>
                      {otpDigits.map((digit, i) => (
                        <input
                          key={i}
                          ref={(el) => { inputRefs.current[i] = el; }}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleOtpChange(i, e.target.value)}
                          onKeyDown={(e) => handleOtpKeyDown(i, e)}
                          className="h-14 w-full rounded-xl border-2 border-gray-200 bg-gray-50
                            text-center text-xl font-bold text-[#0d0f14] focus:outline-none
                            focus:border-[#00aeef] focus:bg-[#00aeef]/5 transition-all duration-200
                            caret-transparent"
                        />
                      ))}
                    </div>
                  </div>

                  {otpError && (
                    <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20
                      rounded-xl px-3.5 py-2.5">
                      {otpError}
                    </p>
                  )}

                  <button type="submit" disabled={isSubmitting}
                    className="w-full h-12 rounded-xl bg-[#00aeef] hover:bg-[#0096cf] text-white
                      font-semibold transition-all duration-200 shadow-lg shadow-[#00aeef]/20
                      disabled:opacity-60 disabled:cursor-not-allowed">
                    {isSubmitting ? "Verifying…" : "Verify Email"}
                  </button>
                </form>

                <div className="text-center mt-5 space-y-3">
                  <p className="text-sm text-[#475569]">
                    {"Didn't receive a code? "}
                    {resendTimer > 0 ? (
                      <span className="font-semibold text-[#0d0f14]">
                        Resend in {resendTimer}s
                      </span>
                    ) : (
                      <button type="button" onClick={handleResendOtp}
                        className="text-[#00aeef] font-semibold hover:underline">
                        Resend code
                      </button>
                    )}
                  </p>
                  <button type="button"
                    onClick={() => { setMode("signup"); setLocalError(null); }}
                    className="text-sm text-[#64748b] hover:text-[#0d0f14] transition-colors">
                    ← Back to sign up
                  </button>
                </div>
              </>
            )}

          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL ─────────────────────────────────────────── */}
      <div className="hidden lg:flex w-[48%] xl:w-[52%] relative overflow-hidden m-3 rounded-2xl">
        <img
          src={heroImageSrc}
          alt="Live event"
          className="absolute inset-0 w-full h-full object-cover animate-slide-right animate-delay-200"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-[#0d0f14] via-[#0d0f14]/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0d0f14]/30 to-transparent" />
        <div className="absolute -top-20 right-10 w-72 h-72 rounded-full bg-[#00d4ff]/15 blur-[80px]" />
        <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-[#7c3aed]/15 blur-[80px]" />

        <div className="absolute top-1/2 -translate-y-[55%] left-8 right-8 animate-element animate-delay-400">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#00aeef] mb-3">
            Australia&apos;s Premier Event Platform
          </p>
          <h2 className="text-4xl xl:text-5xl font-bold text-white leading-[1.1] mb-6">
            Discover events.<br />
            <span className="text-[#00aeef]">Book instantly.</span>
          </h2>
          <div className="space-y-3 mb-7">
            <FeaturePill icon={<Zap className="h-4 w-4" />} text="Instant digital ticket delivery" />
            <FeaturePill icon={<BarChart3 className="h-4 w-4" />} text="Concerts, festivals & more" />
            <FeaturePill icon={<Clock className="h-4 w-4" />} text="100% guaranteed door access" />
            <FeaturePill icon={<CheckCircle2 className="h-4 w-4" />} text="Secure payments & easy refunds" />
          </div>

          {mode === "signin" && (
            <button type="button" onClick={() => setMode("signup")}
              className="inline-flex items-center gap-2 rounded-xl bg-white text-[#0d0f14]
                px-6 py-3 text-sm font-bold hover:bg-[#00aeef] hover:text-white
                transition-all duration-200 shadow-2xl shadow-black/40">
              Create a free account
              <ArrowRight className="h-4 w-4" />
            </button>
          )}
        </div>

        {testimonials.length > 0 && (
          <div className="absolute bottom-8 left-8 right-8 flex gap-3">
            {testimonials.slice(0, 2).map((t, i) => (
              <TestimonialCard key={t.handle} t={t}
                delay={i === 0 ? "animate-delay-700" : "animate-delay-900"} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
