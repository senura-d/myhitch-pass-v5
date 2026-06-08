"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import EventDetailView from "@/src/components/EventDetailView";
import { useAppContext } from "@/app/providers";

type Params = Promise<{ id: string }>;

export default function EventDetailPage({ params }: { params: Params }) {
  const { id } = use(params);
  const { events, savedEventIds, handleToggleSaveEvent, triggerDetailCheckout, addToCart } =
    useAppContext();
  const router = useRouter();

  const event = events.find((e) => e.id === id) ?? events[0];

  return (
    <div className="animate-fade">
      <EventDetailView
        event={event}
        onBack={() => router.push("/events")}
        onBookTickets={triggerDetailCheckout}
        onAddToCart={addToCart}
        savedEventIds={savedEventIds}
        onToggleSave={handleToggleSaveEvent}
      />
    </div>
  );
}
