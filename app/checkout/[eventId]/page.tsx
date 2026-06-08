"use client";

import { use, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "@/src/components/CheckoutForm";
import { ArrowLeft, Ticket } from "lucide-react";
import Link from "next/link";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
import API from "@/src/lib/api";

interface IntentResponse {
  client_secret: string;
  amount: number;
  total: number;
  event: {
    id: string;
    title: string;
    ticket_name: string;
    price_cents: number;
  };
}

type Params = Promise<{ eventId: string }>;

export default function CheckoutPage({ params }: { params: Params }) {
  const { eventId } = use(params);
  const searchParams = useSearchParams();

  const ticketTypeId = searchParams.get("ticketTypeId") ?? undefined;
  const initialQty = Math.max(1, Number(searchParams.get("qty") ?? "1"));

  const [step, setStep] = useState<"email" | "pay">("email");
  const [buyerName, setBuyerName] = useState("");
  const [buyerEmail, setBuyerEmail] = useState("");
  const [quantity] = useState(initialQty);
  const [intentData, setIntentData] = useState<IntentResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleContinue(e: React.FormEvent) {
    e.preventDefault();
    if (!buyerEmail) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API}/payments/create-intent`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event_id: eventId,
          quantity,
          buyer_email: buyerEmail,
          buyer_name: buyerName.trim() || undefined,
          ...(ticketTypeId ? { ticket_type_id: ticketTypeId } : {}),
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message ?? "Could not create payment. Please try again.");
      }

      const data: IntentResponse = await res.json();
      setIntentData(data);
      setStep("pay");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  const elementsOptions = intentData
    ? {
        clientSecret: intentData.client_secret,
        appearance: {
          theme: "stripe" as const,
          variables: {
            colorPrimary: "#00aeef",
            colorBackground: "#ffffff",
            colorText: "#0f172a",
            colorDanger: "#ef4444",
            borderRadius: "12px",
            fontFamily: "inherit",
            fontSizeBase: "13px",
          },
          rules: {
            ".Input": { border: "1px solid #e2e8f0", boxShadow: "none" },
            ".Input:focus": { border: "1px solid #00aeef", boxShadow: "0 0 0 2px rgba(0,174,239,0.15)" },
            ".Tab": { border: "1px solid #e2e8f0" },
            ".Tab--selected": { border: "1px solid #00aeef", color: "#00aeef" },
          },
        },
      }
    : null;

  return (
    <div className="min-h-screen bg-[#f8fafc] py-10 px-4">
      <div className="max-w-md mx-auto">

        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Link
            href={`/events/${eventId}`}
            className="flex items-center gap-1.5 text-xs font-bold text-neutral-500 hover:text-[#0f172a] transition-colors uppercase tracking-wider border border-[#e2e8f0] bg-white rounded-full px-3 py-2 shadow-sm"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back
          </Link>
          <div className="flex items-center gap-2">
            <div className="bg-[#00aeef]/10 rounded-full p-1.5">
              <Ticket className="h-4 w-4 text-[#00aeef]" />
            </div>
            <span className="font-black text-[#0f172a] text-sm tracking-tight">
              MY<span className="text-[#00aeef]">Hitch</span> Pass — Checkout
            </span>
          </div>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-2 mb-6">
          <div className={`h-2 flex-1 rounded-full transition-colors ${step === "email" ? "bg-[#00aeef]" : "bg-[#00aeef]"}`} />
          <div className={`h-2 flex-1 rounded-full transition-colors ${step === "pay" ? "bg-[#00aeef]" : "bg-[#e2e8f0]"}`} />
        </div>

        {/* Step 1 — Email */}
        {step === "email" && (
          <div className="bg-white border border-[#e2e8f0] rounded-[32px] p-6 shadow-sm">
            <h1 className="text-lg font-black text-[#0f172a] mb-1">Contact details</h1>
            <p className="text-xs text-neutral-500 font-semibold mb-6">
              {quantity} ticket{quantity !== 1 ? "s" : ""} · your confirmation will be sent here
            </p>

            <form onSubmit={handleContinue} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-[10px] font-black uppercase tracking-widest text-neutral-400">
                  Full name
                </label>
                <input
                  type="text"
                  required
                  value={buyerName}
                  onChange={(e) => setBuyerName(e.target.value)}
                  placeholder="Jane Smith"
                  className="w-full rounded-2xl bg-[#f8fafc] border border-[#e2e8f0] px-4 py-3 text-sm text-[#0f172a] placeholder-neutral-400 outline-none focus:border-[#00aeef] focus:ring-2 focus:ring-[#00aeef]/15 transition font-medium"
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-[10px] font-black uppercase tracking-widest text-neutral-400">
                  Email address
                </label>
                <input
                  type="email"
                  required
                  value={buyerEmail}
                  onChange={(e) => setBuyerEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-2xl bg-[#f8fafc] border border-[#e2e8f0] px-4 py-3 text-sm text-[#0f172a] placeholder-neutral-400 outline-none focus:border-[#00aeef] focus:ring-2 focus:ring-[#00aeef]/15 transition font-medium"
                />
              </div>

              {error && (
                <div className="rounded-2xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-600 font-semibold">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !buyerEmail || !buyerName.trim()}
                className="w-full rounded-full bg-[#00aeef] hover:bg-[#0096cf] disabled:opacity-50 disabled:cursor-not-allowed transition-colors py-4 font-black uppercase tracking-wider text-white text-xs shadow-md shadow-[#00aeef]/20"
              >
                {loading ? "Loading…" : "Continue to payment →"}
              </button>
            </form>
          </div>
        )}

        {/* Step 2 — Payment */}
        {step === "pay" && intentData && elementsOptions && (
          <div className="bg-white border border-[#e2e8f0] rounded-[32px] p-6 shadow-sm">
            <h1 className="text-lg font-black text-[#0f172a] mb-1">Secure payment</h1>
            <p className="text-xs text-neutral-500 font-semibold mb-6">{buyerEmail}</p>

            <Elements stripe={stripePromise} options={elementsOptions}>
              <CheckoutForm
                eventTitle={intentData.event.title}
                ticketName={intentData.event.ticket_name}
                quantity={quantity}
                priceCents={intentData.event.price_cents}
                totalCents={intentData.total}
                paymentIntentId={intentData.client_secret.split("_secret_")[0]}
              />
            </Elements>

            <button
              onClick={() => setStep("email")}
              className="mt-5 w-full text-xs text-neutral-400 hover:text-neutral-600 font-semibold transition text-center"
            >
              ← Change email
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
