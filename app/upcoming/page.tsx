"use client";

import UpcomingEventsView from "@/src/components/UpcomingEventsView";
import { useAppContext } from "@/app/providers";

export default function UpcomingPage() {
  const { events, handleSelectEvent, triggerQuickCheckout } = useAppContext();

  return (
    <div className="animate-fade">
      <UpcomingEventsView
        events={events}
        onSelectEvent={handleSelectEvent}
        onQuickBook={triggerQuickCheckout}
      />
    </div>
  );
}
