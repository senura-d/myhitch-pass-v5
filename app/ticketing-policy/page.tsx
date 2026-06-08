"use client";

import TicketingPolicyView from "@/src/components/TicketingPolicyView";
import { useAppContext } from "@/app/providers";

export default function TicketingPolicyPage() {
  const { setView } = useAppContext();
  return <TicketingPolicyView setView={setView} />;
}
