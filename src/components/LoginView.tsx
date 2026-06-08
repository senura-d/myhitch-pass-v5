"use client";

import React, { useState, useRef } from "react";
import API from "../lib/api";
import { Mail, Lock, User, Sparkles, ShieldCheck, ArrowRight, Chrome, Apple, MessageSquareText, ThumbsUp, ArrowLeft, Ticket as TicketIcon, Loader2, AlertCircle, RefreshCw } from "lucide-react";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? "";

interface LoginViewProps {
  onLoginSuccess: (name: string, email: string) => void;
  onBackToHome: () => void;
}

export default function LoginView({ onLoginSuccess, onBackToHome }: LoginViewProps) {
  const [activeTab, setActiveTab] = useState<"signin" | "signup">("signin");
  const [logoError, setLogoError] = useState(false);
  
  // Fields state
  const [email, setEmail]           = useState("");
  const [password, setPassword]     = useState("");
  const [fullName, setFullName]     = useState("");
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [rememberMe, setRememberMe] = useState(false);
  
  // Forgot Password flow states
  const [isForgotState, setIsForgotState] = useState(false);
  const [recoveryMessage, setRecoveryMessage] = useState("");
  const [recoveryCode, setRecoveryCode] = useState("");
  const [showRecovered, setShowRecovered] = useState(false);
  const [newRequestedPass, setNewRequestedPass] = useState("");
  
  // Action state management
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // OTP verification step (shown after signup)
  const [showOtp, setShowOtp] = useState(false);
  const [otpDigits, setOtpDigits] = useState(["", "", "", "", "", ""]);
  const [otpError, setOtpError] = useState("");
  const [otpVerifying, setOtpVerifying] = useState(false);
  const [otpResent, setOtpResent] = useState(false);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setRecoveryMessage("");
    if (!email) {
      setErrorMessage("Please input your registered email address.");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      const savedUsersStr = localStorage.getItem("myhitch_users");
      const savedUsers = savedUsersStr ? JSON.parse(savedUsersStr) : [];
      
      const found = savedUsers.find((u: any) => u.email.toLowerCase() === email.toLowerCase());
      
      if (email.toLowerCase() === "sarahj@example.com") {
        setRecoveryCode("Sarah Jenkins standard pass: 123456");
        setShowRecovered(true);
      } else if (found) {
        setRecoveryCode(`Registered password is "${found.password}"`);
        setShowRecovered(true);
      } else {
        // Create an account on the spot or prompt
        setErrorMessage("Email address not found. Register a new account pass first on the Sign Up tab.");
      }
    }, 1200);
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRequestedPass.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      const savedUsersStr = localStorage.getItem("myhitch_users");
      let savedUsers = savedUsersStr ? JSON.parse(savedUsersStr) : [];
      
      savedUsers = savedUsers.map((u: any) => {
        if (u.email.toLowerCase() === email.toLowerCase()) {
          return { ...u, password: newRequestedPass };
        }
        return u;
      });

      localStorage.setItem("myhitch_users", JSON.stringify(savedUsers));
      setSuccessMsg("Secure Password updated successfully! Please Sign In.");
      setIsForgotState(false);
      setShowRecovered(false);
      setPassword(newRequestedPass);
      setNewRequestedPass("");
    }, 1000);
  };


  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMsg("");

    if (!email || !password || (activeTab === "signup" && !fullName)) {
      setErrorMessage("Please fill in all required fields.");
      return;
    }
    if (activeTab === "signup" && !agreeTerms) {
      setErrorMessage("You must agree to the Terms & Admissions Policies.");
      return;
    }

    setIsSubmitting(true);

    try {
      if (activeTab === "signup") {
        // Register → sends OTP, does NOT create user yet
        const res = await fetch(`${API}/auth/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json", "Accept": "application/json" },
          body: JSON.stringify({
            name: fullName,
            email,
            password,
            password_confirmation: password,
            role: "buyer",
          }),
        });
        const json = await res.json();
        if (!res.ok) {
          const first = json.errors
            ? Object.values(json.errors as Record<string, string[]>)[0][0]
            : json.message;
          setErrorMessage(first ?? "Registration failed.");
          return;
        }
        // Show OTP step
        setOtpDigits(["", "", "", "", "", ""]);
        setOtpError("");
        setShowOtp(true);

      } else {
        // Sign in
        const res = await fetch(`${API}/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json", "Accept": "application/json" },
          body: JSON.stringify({ email, password }),
        });
        const json = await res.json();
        if (!res.ok) {
          setErrorMessage(json.message ?? "Invalid email or password.");
          return;
        }
        if (json.token) {
          const expiry = rememberMe
            ? Date.now() + 14 * 24 * 60 * 60 * 1000
            : Date.now() +  1 * 24 * 60 * 60 * 1000;
          localStorage.setItem("myhitch_token",        json.token);
          localStorage.setItem("myhitch_token_expiry", String(expiry));
        }
        if (json.user) localStorage.setItem("myhitch_user", JSON.stringify(json.user));
        setSuccessMsg("Sign-in approved!");
        setTimeout(() => onLoginSuccess(json.user?.name ?? email.split("@")[0], json.user?.email ?? email), 800);
      }
    } catch {
      setErrorMessage("Unable to reach server. Check your connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: { credential?: string }) => {
    if (!credentialResponse.credential) return;
    setIsSubmitting(true);
    setErrorMessage("");
    try {
      const res = await fetch(`${API}/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({ id_token: credentialResponse.credential }),
      });
      const json = await res.json();
      if (!res.ok) { setErrorMessage(json.message ?? "Google sign-in failed."); return; }
      const expiry = rememberMe
        ? Date.now() + 14 * 24 * 60 * 60 * 1000
        : Date.now() +  1 * 24 * 60 * 60 * 1000;
      if (json.token) {
        localStorage.setItem("myhitch_token",        json.token);
        localStorage.setItem("myhitch_token_expiry", String(expiry));
      }
      if (json.user) localStorage.setItem("myhitch_user", JSON.stringify(json.user));
      onLoginSuccess(json.user?.name ?? "User", json.user?.email ?? "");
    } catch {
      setErrorMessage("Google sign-in failed. Try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const triggerSocialLogin = (_platform: string) => {
    setErrorMessage("Social login coming soon.");
  };

  const handleOtpDigit = (i: number, val: string) => {
    const d = val.replace(/\D/g, "").slice(-1);
    const next = [...otpDigits];
    next[i] = d;
    setOtpDigits(next);
    setOtpError("");
    if (d && i < 5) otpRefs.current[i + 1]?.focus();
  };

  const handleOtpKeyDown = (i: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otpDigits[i] && i > 0) otpRefs.current[i - 1]?.focus();
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted.length === 6) {
      setOtpDigits(pasted.split(""));
      otpRefs.current[5]?.focus();
    }
  };

  const handleOtpVerify = async () => {
    const code = otpDigits.join("");
    if (code.length < 6) { setOtpError("Enter all 6 digits"); return; }
    setOtpVerifying(true);
    setOtpError("");
    try {
      const res = await fetch(`${API}/auth/verify-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({ code, email }),
      });
      const json = await res.json();
      if (!res.ok) { setOtpError(json.message ?? "Invalid code. Try again."); return; }
      if (json.token) localStorage.setItem("myhitch_token", json.token);
      if (json.user)  localStorage.setItem("myhitch_user",  JSON.stringify(json.user));
      setSuccessMsg("Email verified! Signing you in…");
      setTimeout(() => onLoginSuccess(json.user?.name ?? fullName, json.user?.email ?? email), 800);
    } catch {
      setOtpError("Connection error. Try again.");
    } finally {
      setOtpVerifying(false);
    }
  };

  const handleOtpResend = async () => {
    setOtpResent(true);
    setOtpDigits(["", "", "", "", "", ""]);
    setOtpError("");
    await fetch(`${API}/auth/resend-verification`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify({ email }),
    });
    setTimeout(() => setOtpResent(false), 4000);
    otpRefs.current[0]?.focus();
  };

  // ── OTP verification screen ────────────────────────────────────────────────
  if (showOtp) {
    return (
      <div className="min-h-screen bg-soft-bg flex flex-col items-center justify-center p-6">
        <div className="bg-white rounded-3xl border border-slate-100 shadow-2xl p-8 sm:p-12 w-full max-w-md text-center">
          <div className="mx-auto mb-5 h-20 w-20 rounded-3xl bg-brand-blue/10 flex items-center justify-center">
            <Mail className="h-10 w-10 text-brand-blue" />
          </div>
          <h2 className="text-2xl font-extrabold text-dark-text mb-1">Verify your email</h2>
          <p className="text-sm text-slate-500 mb-1">We sent a 6-digit code to</p>
          <p className="text-sm font-black text-brand-blue mb-6">{email}</p>

          <div className="flex justify-center gap-2.5 mb-3" onPaste={handleOtpPaste}>
            {otpDigits.map((d, i) => (
              <input key={i}
                ref={el => { otpRefs.current[i] = el; }}
                type="text" inputMode="numeric" maxLength={1} value={d}
                onChange={e => handleOtpDigit(i, e.target.value)}
                onKeyDown={e => handleOtpKeyDown(i, e)}
                className={`w-12 h-14 text-center text-2xl font-black rounded-xl border-2 outline-none transition-all ${
                  otpError ? "border-red-300 bg-red-50"
                  : d ? "border-brand-blue bg-brand-blue/5 text-brand-blue"
                  : "border-slate-200 focus:border-brand-blue focus:bg-brand-blue/5"
                }`}
              />
            ))}
          </div>

          {otpError && (
            <p className="text-xs text-red-500 font-medium flex items-center justify-center gap-1 mb-3">
              <AlertCircle className="h-3 w-3" />{otpError}
            </p>
          )}

          <button onClick={handleOtpVerify} disabled={otpVerifying || otpDigits.join("").length < 6}
            className="w-full bg-brand-blue hover:bg-brand-blue-hover text-white font-extrabold text-sm py-3 rounded-xl shadow-lg shadow-brand-blue/25 flex items-center justify-center gap-2 transition-all mb-3 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed">
            {otpVerifying ? <><Loader2 className="h-4 w-4 animate-spin" /> Verifying…</> : "Verify & Create Account →"}
          </button>

          <button onClick={handleOtpResend} disabled={otpResent}
            className="flex items-center justify-center gap-2 mx-auto text-xs text-slate-500 hover:text-brand-blue font-bold transition-colors cursor-pointer disabled:opacity-60">
            <RefreshCw className={`h-3.5 w-3.5 ${otpResent ? "animate-spin" : ""}`} />
            {otpResent ? "New code sent!" : "Resend code"}
          </button>

          <p className="text-xs text-slate-400 mt-4">Can&apos;t find it? Check your spam folder.</p>

          <button onClick={() => { setShowOtp(false); setOtpDigits(["","","","","",""]); }}
            className="mt-3 text-xs text-slate-400 hover:text-slate-600 cursor-pointer">
            ← Back to sign up
          </button>
        </div>
      </div>
    );
  }

  return (
    <div id="auth-page-root" className="min-h-screen bg-soft-bg flex flex-col text-dark-text animate-fade relative overflow-hidden">
      {/* TopBar component */}
      <div className="bg-white border-b border-slate-100 shadow-sm flex-shrink-0 z-10">
        <div className="h-[3px] w-full bg-linear-to-r from-[#00AEEF] via-purple-400 to-pink-400" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <button
            onClick={onBackToHome}
            className="flex items-center gap-2 group cursor-pointer bg-transparent border-none outline-none"
          >
            <img src="/logo.png" alt="MYHitch Pass"
              className="h-8 w-auto object-contain transition-transform group-hover:scale-105"
              onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
            />
          </button>
          <button
            onClick={onBackToHome}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-brand-blue transition-colors cursor-pointer bg-transparent border-none outline-none"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to site
          </button>
        </div>
      </div>

      {/* Main split grid container */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 min-h-[calc(100vh-59px)] w-full bg-white relative">
        {/* Left Side: Form Panel */}
        <div className="bg-white p-8 sm:p-16 lg:p-24 flex flex-col justify-center max-w-xl mx-auto w-full relative z-10 overflow-y-auto">
          
          <div className="space-y-6">
            {/* Core Header section & app identity */}
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-extrabold text-dark-text tracking-tight font-sans">
                {isForgotState ? "Forgot password" : activeTab === "signin" ? "Sign in" : "Create Account"}
              </h2>
              <p className="text-xs text-neutral-550 max-w-xs mx-auto font-semibold leading-relaxed">
                {isForgotState
                  ? "Enter your email and we'll help you get back in."
                  : activeTab === "signin"
                  ? "Welcome back. Sign in to see your tickets."
                  : "Register as an attendee to discover festivals, concert check-ins, and direct booking offers."}
              </p>
            </div>

            {/* Tab Selection */}
            {!isForgotState && (
              <div className="grid grid-cols-2 p-1.5 rounded-full bg-soft-bg border border-border-gray">
                <button
                  id="tab-signin-trigger"
                  type="button"
                  onClick={() => {
                    setActiveTab("signin");
                    setErrorMessage("");
                  }}
                  className={`py-2 text-xs font-black uppercase tracking-wider rounded-full transition-all cursor-pointer ${
                    activeTab === "signin"
                      ? "bg-brand-blue text-white shadow-md shadow-brand-blue/15 animate-fade"
                      : "text-neutral-500 hover:text-dark-text"
                  }`}
                >
                  Sign In
                </button>
                <button
                  id="tab-signup-trigger"
                  type="button"
                  onClick={() => {
                    setActiveTab("signup");
                    setErrorMessage("");
                  }}
                  className={`py-2 text-xs font-black uppercase tracking-wider rounded-full transition-all cursor-pointer ${
                    activeTab === "signup"
                      ? "bg-brand-blue text-white shadow-md shadow-brand-blue/15 animate-fade"
                      : "text-neutral-500 hover:text-dark-text"
                  }`}
                >
                  Sign Up
                </button>
              </div>
            )}

            {/* Notification overlays for success/errors */}
            {errorMessage && (
              <div id="auth-error-banner" className="p-3 bg-red-50 border border-red-100 text-red-800 rounded-2xl text-[11px] font-semibold flex items-start gap-2 animate-fade text-left">
                <span className="h-2 w-2 rounded-full bg-red-500 mt-1 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}
            {successMsg && (
              <div id="auth-success-banner" className="p-3 bg-emerald-50 border border-emerald-100 text-emerald-800 rounded-2xl text-[11px] font-semibold flex items-start gap-2 animate-fade text-left">
                <span className="h-2 w-2 rounded-full bg-emerald-500 mt-1 shrink-0 animate-ping" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* FORGOT PASSWORD FORM BLOCKS */}
            {isForgotState ? (
              <div className="space-y-4 text-left">
                {!showRecovered ? (
                  <form onSubmit={handleForgotSubmit} className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-black text-neutral-500 uppercase tracking-wider">Email</label>
                      <div className="relative">
                        <input
                          id="recovery-input-email"
                          type="email"
                          required
                          placeholder="Enter registered e-mail address"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full bg-soft-bg border border-border-gray focus:border-brand-blue rounded-full px-5 py-3 text-xs text-dark-text focus:outline-none pl-11 font-semibold transition-all shadow-sm"
                        />
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-450" />
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        id="recovery-submit-btn"
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-1 bg-brand-blue hover:bg-brand-blue-hover disabled:bg-neutral-350 text-white font-black uppercase text-xs tracking-wider py-3.5 rounded-full flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
                      >
                        {isSubmitting ? "Searching Core Vault..." : "Initiate Restore Sync"}
                      </button>
                      <button
                        id="recovery-cancel-btn"
                        type="button"
                        onClick={() => {
                          setIsForgotState(false);
                          setErrorMessage("");
                        }}
                        className="bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-extrabold text-xs px-5 rounded-full cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <form onSubmit={handleResetPassword} className="space-y-5">
                    <div className="p-4 bg-light-tint rounded-2xl border border-brand-blue/20 text-xs">
                      <span className="text-[10px] uppercase font-black tracking-widest text-brand-blue block mb-1">Passcode Found</span>
                      <p className="font-mono text-neutral-900 font-extrabold bg-white px-3 py-2.5 rounded-lg border border-border-gray mt-2 text-center text-sm">
                        {recoveryCode}
                      </p>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-black text-neutral-500 uppercase tracking-wider">Configure New Passcode</label>
                      <div className="relative">
                        <input
                          id="recovery-new-password"
                          type="password"
                          required
                          placeholder="e.g. Enter safe recovery code passcode"
                          value={newRequestedPass}
                          onChange={(e) => setNewRequestedPass(e.target.value)}
                          className="w-full bg-soft-bg border border-border-gray focus:border-brand-blue rounded-full px-5 py-3 text-xs text-dark-text focus:outline-none pl-11 font-semibold transition-all shadow-sm"
                        />
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-450" />
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        id="recovery-reset-btn"
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-1 bg-brand-blue hover:bg-brand-blue-hover disabled:bg-neutral-350 text-white font-black uppercase text-xs tracking-wider py-3.5 rounded-full flex items-center justify-center gap-1.5 shadow-md shadow-brand-blue/15 cursor-pointer"
                      >
                        {isSubmitting ? "Locking in Credentials..." : "Refactor Password"}
                      </button>
                      <button
                        id="recovery-success-cancel-btn"
                        type="button"
                        onClick={() => {
                          setIsForgotState(false);
                          setShowRecovered(false);
                        }}
                        className="bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-extrabold text-xs px-5 rounded-full cursor-pointer"
                      >
                        Back to Login
                      </button>
                    </div>
                  </form>
                )}
              </div>
            ) : (
              /* Credentials Form */
              <form onSubmit={handleAuthSubmit} className="space-y-4 text-left">
                {activeTab === "signup" && (
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-black text-neutral-500 uppercase tracking-wider">FULL LEGAL NAME</label>
                    <div className="relative">
                      <input
                        id="auth-input-name"
                        type="text"
                        required={activeTab === "signup"}
                        placeholder="e.g. Sarah Jenkins"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full bg-soft-bg border border-border-gray focus:border-brand-blue rounded-full px-5 py-3 text-xs text-dark-text focus:outline-none pl-11 font-semibold transition-all shadow-sm"
                      />
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-450" />
                    </div>
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="block text-[10px] font-black text-neutral-500 uppercase tracking-wider">E-MAIL ADDRESS</label>
                  <div className="relative">
                    <input
                      id="auth-input-email"
                      type="email"
                      required
                      placeholder="sarahj@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-soft-bg border border-border-gray focus:border-brand-blue rounded-full px-5 py-3 text-xs text-dark-text focus:outline-none pl-11 font-semibold transition-all shadow-sm"
                    />
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-450" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="block text-[10px] font-black text-neutral-500 uppercase tracking-wider">SECURE PASSWORD</label>
                    {activeTab === "signin" && (
                      <button
                        id="forgot-password"
                        type="button"
                        onClick={() => {
                          setIsForgotState(true);
                          setErrorMessage("");
                          setShowRecovered(false);
                        }}
                        className="text-[10px] font-extrabold text-brand-blue hover:text-brand-blue-hover uppercase tracking-wider cursor-pointer bg-transparent border-none outline-none"
                      >
                        Forgot password?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <input
                      id="auth-input-password"
                      type="password"
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-soft-bg border border-border-gray focus:border-brand-blue rounded-full px-5 py-3 text-xs text-dark-text focus:outline-none pl-11 font-semibold transition-all shadow-sm"
                    />
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-450" />
                  </div>
                </div>

                {activeTab === "signup" && (
                  <label className="flex items-start gap-2.5 px-1 py-1 cursor-pointer">
                    <input
                      id="checkbox-terms"
                      type="checkbox"
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                      className="h-4 w-4 mt-0.5 text-brand-blue border-border-gray focus:ring-brand-blue rounded shrink-0"
                    />
                    <span className="text-[10px] font-bold text-neutral-500 leading-normal">
                      I agree to the <span className="text-brand-blue font-extrabold">Instant Booking Terms</span> & <span className="text-brand-blue font-extrabold">Admissions Policies</span> of MYHitch Pass networks.
                    </span>
                  </label>
                )}

                {activeTab === "signin" && (
                  <div className="flex items-center justify-between px-1">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="h-4 w-4 text-brand-blue border-border-gray focus:ring-brand-blue rounded shrink-0 cursor-pointer"
                      />
                      <span className="text-[10px] font-bold text-neutral-500">Remember me</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => { setIsForgotState(true); setErrorMessage(""); setShowRecovered(false); }}
                      className="text-[10px] font-extrabold text-brand-blue hover:text-brand-blue-hover uppercase tracking-wider cursor-pointer bg-transparent border-none outline-none"
                    >
                      Forgot password?
                    </button>
                  </div>
                )}

                <button
                  id="auth-submit-btn"
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-brand-blue hover:bg-brand-blue-hover disabled:bg-neutral-300 text-white font-black uppercase text-xs tracking-wider py-4 rounded-full flex items-center justify-center gap-1.5 shadow-md shadow-brand-blue/15 cursor-pointer active:scale-98 transition-transform"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin inline-block" />
                      <span>Signing you in…</span>
                    </span>
                  ) : (
                    <>
                      <span>{activeTab === "signin" ? "Sign in" : "Generate Pass Credentials"}</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* Social Authentication divider */}
            <div className="relative flex py-2 items-center">
              <div className="grow border-t border-border-gray"></div>
              <span className="shrink mx-4 text-[9px] text-neutral-450 font-black uppercase tracking-widest bg-white z-10">Or sign in with</span>
              <div className="grow border-t border-border-gray"></div>
            </div>

            {/* Social buttons */}
            <div className="flex flex-col gap-3">
              {GOOGLE_CLIENT_ID ? (
                <div className="w-full flex justify-center">
                  <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
                    <GoogleLogin
                      onSuccess={handleGoogleSuccess}
                      onError={() => setErrorMessage("Google sign-in failed. Try again.")}
                      width="100%"
                      shape="pill"
                      text="continue_with"
                      theme="outline"
                    />
                  </GoogleOAuthProvider>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => triggerSocialLogin("Google")}
                  className="w-full bg-white hover:bg-neutral-50 border border-border-gray hover:border-neutral-300 rounded-full py-3 px-4 text-xs font-bold text-neutral-600 flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Chrome className="h-4 w-4 text-red-500" />
                  <span>Continue with Google</span>
                </button>
              )}
              <button
                id="btn-social-apple"
                type="button"
                onClick={() => triggerSocialLogin("Apple")}
                className="w-full bg-white hover:bg-neutral-50 border border-border-gray hover:border-neutral-300 rounded-full py-3 px-4 text-xs font-bold text-neutral-600 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Apple className="h-4 w-4 text-black" />
                <span>Apple ID</span>
              </button>
            </div>

            {/* Security & trust cue block */}
            <div className="bg-emerald-50 rounded-2xl border border-emerald-100 p-3.5 text-[10px] text-emerald-800 font-semibold space-y-1 text-left leading-normal flex items-start gap-2.5">
              <ShieldCheck className="h-4.5 w-4.5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-extrabold block">Your details are safe</span>
                <span>We use the same security as your bank. Your password and card details are never shared with anyone.</span>
              </div>
            </div>
          </div>

        </div>

        {/* Right Side: Visual/Marketing Panel */}
        <div className="bg-linear-to-br from-slate-900 via-brand-blue to-indigo-950 p-8 sm:p-16 lg:p-24 flex flex-col justify-between text-white relative overflow-hidden">
          {/* Decorative glows */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-brand-blue/30 rounded-full blur-3xl opacity-40 pointer-events-none" />
          <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-linear-to-tr from-cyan-400/20 to-blue-500/10 rounded-full blur-3xl opacity-30 pointer-events-none" />

          <div className="relative z-10 my-auto max-w-md mx-auto w-full space-y-6">
            <span className="inline-flex items-center gap-2 bg-white/10 border border-white/10 text-white text-xs font-bold px-3 py-1.5 rounded-full">
              <Sparkles className="h-3.5 w-3.5 text-brand-blue animate-pulse" />
              Premium Experiences Await
            </span>
            <h2 className="text-3xl font-extrabold font-sans leading-tight tracking-tight">
              Discover & Book Australia's Best Live Events
            </h2>
            <p className="text-sm text-white/70 font-medium leading-relaxed font-sans">
              Secure tickets with instant digital passes to festivals, concerts, sports, theatre, and exclusive local experiences.
            </p>
            
            <div className="space-y-4 pt-4">
              {[
                { icon: <TicketIcon className="h-4.5 w-4.5 text-brand-blue" />, text: "100% Guaranteed door access" },
                { icon: <Sparkles className="h-4.5 w-4.5 text-brand-blue" />, text: "Instant digital pass delivery" },
                { icon: <ShieldCheck className="h-4.5 w-4.5 text-brand-blue" />, text: "Secure payments & bank-grade encryption" },
              ].map((item) => (
                <div key={item.text} className="flex items-center gap-3 text-sm font-medium">
                  <div className="h-8 w-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
                    {item.icon}
                  </div>
                  <span>{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
