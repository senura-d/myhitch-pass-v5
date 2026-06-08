"use client";

import PrivacyCharterView from "@/src/components/PrivacyCharterView";
import { useAppContext } from "@/app/providers";

export default function PrivacyPage() {
  const { setView } = useAppContext();
  return <PrivacyCharterView setView={setView} />;
}
