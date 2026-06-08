"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import MyTicketsView from "@/src/components/MyTicketsView";
import { useAppContext } from "@/app/providers";

export default function MyTicketsPage() {
  const {
    isLoggedIn,
    tickets,
    ticketsLoading,
    handleCancelTicket,
    handleTransferTicket,
    resumeDraftBooking,
  } = useAppContext();

  const router = useRouter();

  useEffect(() => {
    if (!isLoggedIn) router.replace("/login");
  }, [isLoggedIn, router]);

  if (!isLoggedIn) return null;

  if (ticketsLoading) {
    return (
      <div className="min-h-screen bg-soft-bg flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-neutral-400">
          <div className="h-8 w-8 rounded-full border-4 border-brand-blue border-t-transparent animate-spin" />
          <p className="text-sm font-semibold">Loading your tickets…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade">
      <MyTicketsView
        tickets={tickets}
        onCancelTicket={handleCancelTicket}
        onTransferTicket={handleTransferTicket}
        onResumeDraftCheckout={resumeDraftBooking}
      />
    </div>
  );
}
