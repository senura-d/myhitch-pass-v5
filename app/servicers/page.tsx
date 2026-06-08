"use client";

import ServicersView from "@/src/components/ServicersView";
import { useAppContext } from "@/app/providers";

export default function ServicersPage() {
  const { setView } = useAppContext();
  return (
    <div className="animate-fade">
      <ServicersView setView={setView} />
    </div>
  );
}
