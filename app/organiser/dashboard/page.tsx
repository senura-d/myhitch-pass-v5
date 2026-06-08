"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";
import { useAppContext } from "@/app/providers";

const OrganizerDashboardView = dynamic(
  () => import("@/src/components/OrganizerDashboardView"),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-screen flex items-center justify-center bg-[#F0F2F5]">
        <div className="flex items-center gap-3 text-neutral-400">
          <Loader2 className="h-5 w-5 animate-spin text-[#00aeef]" />
          <span className="text-sm font-semibold">Loading dashboard…</span>
        </div>
      </div>
    ),
  }
);

import API from "@/src/lib/api";

export default function OrganiserDashboardPage() {
  const { userProfile, isLoggedIn, setPostLoginRedirect } = useAppContext();
  const router = useRouter();

  const [orgEvents, setOrgEvents]     = useState([]);
  const [stats, setStats]             = useState(null);
  const [loading, setLoading]         = useState(true);
  const [accessDenied, setAccessDenied] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) {
      setPostLoginRedirect("organizer");
      router.push("/organiser-sop");
      return;
    }

    // Only use the organiser_token — never fall back to buyer's myhitch_token
    const token = localStorage.getItem("organiser_token");
    if (!token) {
      setAccessDenied(true);
      setLoading(false);
      return;
    }

    const headers = { "Authorization": `Bearer ${token}`, "Accept": "application/json" };

    // Verify role via /auth/me before loading dashboard data
    fetch(`${API}/auth/me`, { headers })
      .then(r => r.json())
      .then(user => {
        if (user.role !== "organizer") {
          setAccessDenied(true);
          setLoading(false);
          return;
        }
        return Promise.all([
          fetch(`${API}/organizer/events`, { headers }).then(r => r.json()),
          fetch(`${API}/organizer/stats`,  { headers }).then(r => r.json()),
        ]).then(([eventsJson, statsJson]) => {
          if (eventsJson.data) setOrgEvents(eventsJson.data);
          if (statsJson.data)  setStats(statsJson.data);
          setLoading(false);
        });
      })
      .catch(() => { setAccessDenied(true); setLoading(false); });
  }, [isLoggedIn, router, setPostLoginRedirect]);

  if (!isLoggedIn) return null;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F0F2F5]">
        <div className="flex items-center gap-3 text-neutral-400">
          <Loader2 className="h-5 w-5 animate-spin text-[#00aeef]" />
          <span className="text-sm font-semibold">Loading dashboard…</span>
        </div>
      </div>
    );
  }

  if (accessDenied) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F0F2F5] px-4">
        <div className="bg-white rounded-2xl shadow-md border border-red-100 p-8 max-w-sm w-full text-center space-y-4">
          <div className="h-14 w-14 rounded-full bg-red-50 flex items-center justify-center mx-auto">
            <Loader2 className="h-6 w-6 text-red-400" />
          </div>
          <h2 className="text-lg font-black text-slate-900">Access Denied</h2>
          <p className="text-sm text-slate-500 font-medium leading-relaxed">
            This dashboard is only available to Organizer accounts. Buyer accounts cannot access this area.
          </p>
          <button
            onClick={() => router.push("/")}
            className="w-full py-3 rounded-full text-white text-xs font-black uppercase tracking-wider"
            style={{ background: "linear-gradient(135deg, #00aeef, #0077b6)" }}
          >
            Go to Homepage
          </button>
        </div>
      </div>
    );
  }

  return (
    <OrganizerDashboardView
      activeEvents={orgEvents}
      onAddEvent={() => {}}
      userProfile={userProfile}
      stats={stats}
    />
  );
}
