"use client";

import BroadwayTicketsView from "@/src/components/BroadwayTicketsView";
import { useAppContext } from "@/app/providers";

export default function BroadwayTicketsPage() {
  const { events, triggerDetailCheckout, setView } = useAppContext();

  return (
    <div className="animate-fade">
      <BroadwayTicketsView
        events={events}
        onBookTickets={triggerDetailCheckout}
        setView={setView}
      />
    </div>
  );
}
