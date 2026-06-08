"use client";

import AboutUsView from "@/src/components/AboutUsView";
import { useAppContext } from "@/app/providers";

export default function AboutPage() {
  const { setView } = useAppContext();
  return (
    <div className="animate-fade">
      <AboutUsView setView={setView} />
    </div>
  );
}
