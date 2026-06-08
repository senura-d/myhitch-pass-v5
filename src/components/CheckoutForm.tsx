"use client";

import { useState } from "react";
import { useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js";
import { ShieldCheck, CreditCard } from "lucide-react";

interface CheckoutFormProps {
  eventTitle: string;
  ticketName: string;
  quantity: number;
  priceCents: number;
  totalCents: number;
  paymentIntentId: string;
}

function formatAUD(cents: number) {
  return `$${(cents / 100).toFixed(2)} AUD`;
}

export default function CheckoutForm({
  eventTitle,
  ticketName,
  quantity,
  priceCents,
  totalCents,
  paymentIntentId,
}: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsLoading(true);
    setErrorMessage(null);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/checkout/success?event=${encodeURIComponent(eventTitle)}&ref=${paymentIntentId}`,
      },
    });

    if (error) {
      setErrorMessage(error.message ?? "Payment failed. Please try again.");
    }
    setIsLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Order Summary */}
      <div className="bg-[#f8fafc] border border-[#e2e8f0] rounded-[24px] p-5 space-y-3">
        <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400">
          Order Summary
        </p>
        <p className="font-black text-[#0f172a] text-sm leading-tight">{eventTitle}</p>
        <div className="space-y-1.5 text-xs font-semibold text-neutral-500">
          <div className="flex justify-between">
            <span>{ticketName} × {quantity}</span>
            <span className="text-[#0f172a] font-black">{formatAUD(priceCents * quantity)}</span>
          </div>
          <div className="flex justify-between">
            <span>Booking fee</span>
            <span className="text-[#00aeef] font-black">FREE</span>
          </div>
        </div>
        <div className="border-t border-[#e2e8f0] pt-3 flex justify-between items-baseline">
          <span className="text-xs font-black text-neutral-500 uppercase tracking-wider">Total</span>
          <span className="text-2xl font-black text-[#00aeef]">{formatAUD(totalCents)}</span>
        </div>
      </div>

      {/* Stripe Payment Element */}
      <div className="bg-white border border-[#e2e8f0] rounded-[24px] p-5">
        <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-4">
          Payment Details
        </p>
        <PaymentElement options={{ layout: "tabs" }} />
      </div>

      {/* Error */}
      {errorMessage && (
        <div className="rounded-2xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-600 font-semibold">
          {errorMessage}
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={!stripe || isLoading}
        className="w-full rounded-full bg-[#00aeef] hover:bg-[#0096cf] disabled:opacity-50 disabled:cursor-not-allowed transition-colors py-4 px-6 font-black uppercase tracking-wider text-white text-xs flex items-center justify-center gap-2 shadow-md shadow-[#00aeef]/20"
      >
        <CreditCard className="h-4 w-4" />
        {isLoading ? "Processing…" : `Pay ${formatAUD(totalCents)}`}
      </button>

      <div className="flex items-center justify-center gap-1.5 text-[10px] text-neutral-400 font-semibold">
        <ShieldCheck className="h-3.5 w-3.5 text-[#00aeef]" />
        <span>Secured by Stripe — your card details are never stored</span>
      </div>
    </form>
  );
}
