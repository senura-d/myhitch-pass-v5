"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import ProfileView from "@/src/components/ProfileView";
import { useAppContext } from "@/app/providers";
import { Ticket, TicketStatus } from "@/src/types";

import API from "@/src/lib/api";

export default function ProfilePage() {
  const {
    isLoggedIn,
    userProfile,
    setUserProfile,
    tickets: ctxTickets,
    savedEventIds,
    events,
    handleToggleSaveEvent,
    handleLogout,
    handleSelectEvent,
    setView,
  } = useAppContext();

  const router = useRouter();
  const [tickets, setTickets] = useState<Ticket[]>(ctxTickets);
  const [ticketsLoading, setTicketsLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) router.replace("/login");
  }, [isLoggedIn, router]);

  // Refresh profile + tickets directly from DB on mount
  const refreshFromDB = useCallback(async () => {
    const token = localStorage.getItem("myhitch_token");
    if (!token) return;

    setProfileLoading(true);
    try {
      const res = await fetch(`${API}/auth/me`, {
        headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
      });
      if (res.ok) {
        const json = await res.json();
        if (json.id) {
          const profile = { name: json.name ?? "", email: json.email ?? "", avatar: json.avatar_url ?? "" };
          setUserProfile(profile);
          try {
            localStorage.setItem("myhitch_user", JSON.stringify(json));
            localStorage.setItem("myhitch_userProfile", JSON.stringify(profile));
          } catch {}
        }
      }
    } catch {}
    setProfileLoading(false);

    setTicketsLoading(true);
    try {
      const res = await fetch(`${API}/tickets`, {
        headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
      });
      if (res.ok) {
        const json = await res.json();
        if (json.data) setTickets(json.data);
      }
    } catch {}
    setTicketsLoading(false);
  }, [setUserProfile]);

  useEffect(() => {
    if (isLoggedIn) refreshFromDB();
  }, [isLoggedIn, refreshFromDB]);

  // Keep in sync when context tickets update (e.g. new booking)
  useEffect(() => {
    if (ctxTickets.length > 0) setTickets(ctxTickets);
  }, [ctxTickets]);

  if (!isLoggedIn) return null;

  // ── Upload a file → POST /api/auth/avatar ──────────────────────────────────
  const handleUploadAvatar = async (
    file: File
  ): Promise<{ success: boolean; url?: string; error?: string }> => {
    const token = localStorage.getItem("myhitch_token");
    if (!token) return { success: false, error: "Not authenticated." };

    const formData = new FormData();
    formData.append("avatar", file);

    try {
      const res = await fetch(`${API}/auth/avatar`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
        body: formData,
      });
      const json = await res.json();
      if (!res.ok) {
        return { success: false, error: json.message ?? "Upload failed." };
      }
      // Update context so the avatar shows everywhere immediately
      setUserProfile({ ...userProfile, avatar: json.avatar_url });
      try {
        const stored = localStorage.getItem("myhitch_user");
        if (stored) {
          const u = JSON.parse(stored);
          localStorage.setItem("myhitch_user", JSON.stringify({ ...u, avatar_url: json.avatar_url }));
        }
        const storedProfile = localStorage.getItem("myhitch_userProfile");
        if (storedProfile) {
          const p = JSON.parse(storedProfile);
          localStorage.setItem("myhitch_userProfile", JSON.stringify({ ...p, avatar: json.avatar_url }));
        }
      } catch {}
      return { success: true, url: json.avatar_url };
    } catch {
      return { success: false, error: "Network error. Please try again." };
    }
  };

  // ── Save a preset URL → PUT /api/auth/profile with avatar_url ─────────────
  const handleSaveAvatar = async (url: string) => {
    const token = localStorage.getItem("myhitch_token");
    if (!token) return;
    try {
      const res = await fetch(`${API}/auth/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ avatar_url: url || null }),
      });
      const json = await res.json();
      if (res.ok && json.user) {
        setUserProfile({ ...userProfile, avatar: json.user.avatar_url ?? "" });
        try {
          localStorage.setItem("myhitch_user", JSON.stringify(json.user));
          const p = { name: json.user.name, email: json.user.email, avatar: json.user.avatar_url ?? "" };
          localStorage.setItem("myhitch_userProfile", JSON.stringify(p));
        } catch {}
      }
    } catch {}
  };

  // ── Update name / email ────────────────────────────────────────────────────
  const handleUpdateProfile = (name: string, email: string) => {
    setUserProfile({ ...userProfile, name, email });
  };

  // ── Change password ────────────────────────────────────────────────────────
  const handleChangePassword = async (
    current: string,
    next: string
  ): Promise<{ success: boolean; error?: string }> => {
    const token = localStorage.getItem("myhitch_token");
    if (!token) return { success: false, error: "Not authenticated." };
    try {
      const res = await fetch(`${API}/auth/password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          current_password: current,
          password: next,
          password_confirmation: next,
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        const firstError = json.errors
          ? Object.values(json.errors as Record<string, string[]>)[0]?.[0]
          : json.message;
        return { success: false, error: firstError ?? "Password update failed." };
      }
      return { success: true };
    } catch {
      return { success: false, error: "Network error. Please try again." };
    }
  };

  return (
    <div className="animate-fade">
      <ProfileView
        userProfile={userProfile}
        currentAvatar={userProfile.avatar ?? ""}
        tickets={tickets}
        ticketsLoading={ticketsLoading}
        savedEventIds={savedEventIds}
        events={events}
        onUpdateProfile={handleUpdateProfile}
        onSaveAvatar={handleSaveAvatar}
        onUploadAvatar={handleUploadAvatar}
        onChangePassword={handleChangePassword}
        onToggleSave={handleToggleSaveEvent}
        onLogout={handleLogout}
        onSelectEvent={handleSelectEvent}
        onRefresh={refreshFromDB}
        setView={setView}
      />
    </div>
  );
}
