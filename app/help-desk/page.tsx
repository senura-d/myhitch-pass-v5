"use client";

import HelpDeskView from "@/src/components/HelpDeskView";
import { useAppContext } from "@/app/providers";

export default function HelpDeskPage() {
  const { setView } = useAppContext();
  return <HelpDeskView setView={setView} />;
}
