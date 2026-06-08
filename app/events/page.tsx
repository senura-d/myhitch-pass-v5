"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import EventListingView from "@/src/components/EventListingView";
import { useAppContext } from "@/app/providers";

function EventsContent() {
  const { events, eventsLoading, handleSelectEvent, triggerQuickCheckout } = useAppContext();
  const searchParams = useSearchParams();

  const initialQuery    = searchParams.get("q")   ?? "";
  const initialCategory = searchParams.get("cat") ?? "";
  const initialLocation = searchParams.get("loc") ?? "";

  if (eventsLoading && events.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="h-8 w-48 bg-slate-200 rounded-xl animate-pulse mb-6" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm">
              <div className="h-48 bg-slate-200 animate-pulse" />
              <div className="p-4 space-y-3">
                <div className="h-5 bg-slate-200 rounded animate-pulse w-3/4" />
                <div className="h-4 bg-slate-100 rounded animate-pulse w-1/2" />
                <div className="h-4 bg-slate-100 rounded animate-pulse w-2/3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade">
      <EventListingView
        events={events}
        initialCategory={initialCategory}
        initialQuery={initialQuery}
        initialLocation={initialLocation}
        onSelectEvent={handleSelectEvent}
        onQuickBook={triggerQuickCheckout}
      />
    </div>
  );
}

export default function EventsPage() {
  return (
    <Suspense>
      <EventsContent />
    </Suspense>
  );
}
