"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SignInPage, SignUpData, Testimonial } from "@/components/ui/sign-in";
import { useAppContext } from "@/app/providers";

import API from "@/src/lib/api";

const testimonials: Testimonial[] = [
  {
    avatarSrc: "https://randomuser.me/api/portraits/women/57.jpg",
    name: "Sarah Chen",
    handle: "@sarahdigital",
    text: "Listed our first event same day. Tickets sold out in 48 hours!",
  },
  {
    avatarSrc: "https://randomuser.me/api/portraits/men/64.jpg",
    name: "Marcus Johnson",
    handle: "@marcustech",
    text: "Real-time dashboard and fast payouts. Best event platform in AU.",
  },
];

export default function LoginPage() {
  const { handleLoginSuccess } = useAppContext();
  const router = useRouter();
  const [pendingName, setPendingName] = useState("");

  // ── Sign In → POST /auth/login ───────────────────────────────────────────
  const handleSignIn = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
    rememberMe: boolean;
  }): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch(`${API}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const json = await res.json();
      if (!res.ok || !json.token) {
        return { success: false, error: json.message ?? "Invalid email or password." };
      }
      const role = json.user?.role ?? "buyer";
      localStorage.setItem("myhitch_token", json.token);
      localStorage.setItem("myhitch_user", JSON.stringify(json.user ?? {}));
      localStorage.setItem("myhitch_user_role", role);
      // organiser_token is ONLY set for organizer accounts
      if (role === "organizer") {
        localStorage.setItem("organiser_token", json.token);
      } else {
        localStorage.removeItem("organiser_token");
      }
      handleLoginSuccess(json.user?.name ?? email.split("@")[0], json.user?.email ?? email);
      return { success: true };
    } catch {
      return { success: false, error: "Network error. Please check your connection." };
    }
  };

  // ── Register → POST /auth/register (Laravel sends OTP via Mailtrap) ──────
  const handleSignUp = async (
    data: SignUpData
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch(`${API}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          name: data.fullName,
          email: data.email,
          password: data.password,
          password_confirmation: data.password,
          role: "buyer",
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        // Laravel validation errors come back as { errors: { field: [msg] } }
        const firstError = json.errors
          ? Object.values(json.errors as Record<string, string[]>)[0]?.[0]
          : json.message;
        return { success: false, error: firstError ?? "Registration failed." };
      }
      setPendingName(data.fullName);
      return { success: true };
    } catch {
      return { success: false, error: "Network error. Please check your connection." };
    }
  };

  // ── Verify OTP → POST /auth/verify-email ─────────────────────────────────
  const handleVerifyOtp = async (
    email: string,
    otp: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch(`${API}/auth/verify-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ email, code: otp }),
      });
      const json = await res.json();
      if (!res.ok || !json.token) {
        return { success: false, error: json.message ?? "Incorrect code. Please try again." };
      }
      const verifiedRole = json.user?.role ?? "buyer";
      localStorage.setItem("myhitch_token", json.token);
      localStorage.setItem("myhitch_user", JSON.stringify(json.user ?? {}));
      localStorage.setItem("myhitch_user_role", verifiedRole);
      if (verifiedRole === "organizer") {
        localStorage.setItem("organiser_token", json.token);
      } else {
        localStorage.removeItem("organiser_token");
      }
      const name = json.user?.name ?? pendingName ?? email.split("@")[0];
      handleLoginSuccess(name, json.user?.email ?? email);
      return { success: true };
    } catch {
      return { success: false, error: "Network error. Please check your connection." };
    }
  };

  // ── Resend OTP → POST /auth/resend-verification ───────────────────────────
  const handleResendOtp = async (email: string) => {
    await fetch(`${API}/auth/resend-verification`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ email }),
    }).catch(() => {});
  };

  return (
    <SignInPage
      heroImageSrc="https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=1800&q=80"
      testimonials={testimonials}
      onSignIn={handleSignIn}
      onSignUp={handleSignUp}
      onVerifyOtp={handleVerifyOtp}
      onResendOtp={handleResendOtp}
      onResetPassword={() => router.push("/forgot-password")}
    />
  );
}
