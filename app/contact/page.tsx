"use client";

import ContactUsView from "@/src/components/ContactUsView";
import { useAppContext } from "@/app/providers";

export default function ContactPage() {
  const { setView } = useAppContext();
  return (
    <div className="animate-fade">
      <ContactUsView setView={setView} />
    </div>
  );
}
