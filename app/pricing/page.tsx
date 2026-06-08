"use client";

import PricingView from "@/src/components/PricingView";
import { useAppContext } from "@/app/providers";

export default function PricingPage() {
  const { setView } = useAppContext();
  return (
    <div className="animate-fade">
      <PricingView setView={setView} />
    </div>
  );
}
