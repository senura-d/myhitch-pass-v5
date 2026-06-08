"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle2, Ticket, Mail, Loader2, AlertCircle, QrCode } from "lucide-react";

import API from "@/src/lib/api";

interface TicketRecord {
  id: string;
  eventTitle: string;
  eventDate: string;
  eventTime: string;
  eventLocation: string;
  qrCodeValue: string;
  seatType: string;
  price: number;
  attendeeName: string;
  attendeeEmail: string;
}

function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Stripe appends payment_intent to return_url
  const paymentIntentId =
    searchParams.get("payment_intent") ??
    searchParams.get("ref") ??
    null;
  const redirectStatus  = searchParams.get("redirect_status");
  const eventName       = searchParams.get("event") ?? "your event";

  const [confirming, setConfirming]   = useState(true);
  const [tickets, setTickets]         = useState<TicketRecord[]>([]);
  const [orderId, setOrderId]         = useState<string | null>(null);
  const [confirmError, setConfirmError] = useState<string | null>(null);

  useEffect(() => {
    // Payment failed / cancelled on Stripe side
    if (redirectStatus && redirectStatus !== "succeeded") {
      setConfirmError("Payment was not completed. Please try again.");
      setConfirming(false);
      return;
    }

    if (!paymentIntentId) {
      setConfirming(false);
      return;
    }

    const token      = localStorage.getItem("myhitch_token");
    const storedUser = localStorage.getItem("myhitch_user");
    const buyerEmail = storedUser ? (JSON.parse(storedUser).email ?? null) : null;

    fetch(`${API}/payments/confirm`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({
        payment_intent_id: paymentIntentId,
        buyer_email:       buyerEmail,
      }),
    })
      .then(r => r.json())
      .then(json => {
        if (json.order?.id)  setOrderId(json.order.id);
        if (json.tickets?.length) setTickets(json.tickets);
      })
      .catch(() => {})
      .finally(() => setConfirming(false));
  }, [paymentIntentId, redirectStatus]);

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-lg space-y-5">

        {/* Main confirmation card */}
        <div className="bg-white border border-[#e2e8f0] rounded-[32px] p-8 shadow-sm text-center space-y-5">

          {/* Icon */}
          <div className="flex justify-center">
            {confirming ? (
              <div className="bg-sky-50 border border-sky-100 rounded-full p-5">
                <Loader2 className="h-10 w-10 text-[#00aeef] animate-spin" />
              </div>
            ) : confirmError ? (
              <div className="bg-red-50 border border-red-100 rounded-full p-5">
                <AlertCircle className="h-10 w-10 text-red-500" />
              </div>
            ) : (
              <div className="bg-green-50 border border-green-100 rounded-full p-5">
                <CheckCircle2 className="h-10 w-10 text-green-500" />
              </div>
            )}
          </div>

          {/* Heading */}
          <div className="space-y-1.5">
            {confirming ? (
              <>
                <h1 className="text-xl font-black text-[#0f172a]">Confirming your booking…</h1>
                <p className="text-sm text-neutral-500 font-semibold">Recording your tickets in our system.</p>
              </>
            ) : confirmError ? (
              <>
                <h1 className="text-xl font-black text-[#0f172a]">Payment not completed</h1>
                <p className="text-sm text-red-500 font-semibold">{confirmError}</p>
              </>
            ) : (
              <>
                <h1 className="text-2xl font-black text-[#0f172a] tracking-tight">Booking confirmed!</h1>
                <p className="text-sm text-neutral-500 font-semibold">
                  Your tickets to <span className="text-[#0f172a] font-black">{eventName}</span> are secured.
                </p>
              </>
            )}
          </div>

          {/* Order ref */}
          {!confirming && !confirmError && (orderId ?? paymentIntentId) && (
            <div className="bg-[#f8fafc] border border-[#e2e8f0] rounded-2xl px-5 py-4 text-left">
              <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-1">
                Order Reference
              </p>
              <p className="text-xs font-mono text-[#00aeef] font-bold break-all">
                {orderId ?? paymentIntentId}
              </p>
            </div>
          )}

          {/* Email notice */}
          {!confirming && !confirmError && (
            <div className="flex items-start gap-3 bg-[#e6f8ff] border border-[#00aeef]/20 rounded-2xl px-4 py-4 text-left">
              <Mail className="h-4 w-4 text-[#00aeef] flex-shrink-0 mt-0.5" />
              <p className="text-xs text-[#0f172a] font-semibold leading-relaxed">
                Your e-pass has been issued to your ticket wallet. Check your email for your QR code confirmation.
              </p>
            </div>
          )}

          {/* Actions */}
          {!confirming && (
            <div className="space-y-3 pt-1">
              {confirmError ? (
                <button
                  onClick={() => router.back()}
                  className="w-full rounded-full border-2 border-[#00aeef] text-[#00aeef] transition-colors py-4 font-black uppercase tracking-wider text-xs"
                >
                  Try again
                </button>
              ) : (
                <>
                  <button
                    onClick={() => router.push("/my-tickets")}
                    className="w-full rounded-full bg-[#00aeef] hover:bg-[#0096cf] transition-colors py-4 font-black uppercase tracking-wider text-white text-xs shadow-md shadow-[#00aeef]/20 flex items-center justify-center gap-2"
                  >
                    <Ticket className="h-4 w-4" />
                    View my tickets
                  </button>
                  <button
                    onClick={() => router.push("/events")}
                    className="w-full rounded-full border border-[#e2e8f0] hover:bg-[#f8fafc] transition-colors py-3.5 text-xs font-black uppercase tracking-wider text-neutral-500 hover:text-[#0f172a]"
                  >
                    Browse more events
                  </button>
                </>
              )}
            </div>
          )}
        </div>

        {/* Ticket summary cards */}
        {tickets.length > 0 && (
          <div className="space-y-3">
            <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest px-1">
              Your tickets ({tickets.length})
            </p>
            {tickets.map((t, i) => (
              <div key={t.id ?? i} className="bg-white border border-[#e2e8f0] rounded-[24px] p-5 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0 space-y-1">
                    <p className="text-sm font-black text-[#0f172a] truncate">{t.eventTitle}</p>
                    <p className="text-xs font-bold text-[#00aeef]">{t.seatType}</p>
                    <p className="text-[11px] text-neutral-400 font-semibold">
                      {t.eventDate}{t.eventTime ? ` · ${t.eventTime}` : ""}
                    </p>
                    <p className="text-[11px] text-neutral-400 font-semibold truncate">{t.eventLocation}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <div className="bg-[#f8fafc] border border-[#e2e8f0] rounded-xl p-2.5">
                      <QrCode className="h-8 w-8 text-[#0f172a]" />
                    </div>
                    <p className="text-[10px] font-mono text-neutral-400 max-w-[80px] truncate">{t.qrCodeValue}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <p className="text-center text-[10px] text-neutral-400 font-semibold">
          MY<span className="text-[#00aeef]">Hitch</span> Pass — your secure digital ticket wallet
        </p>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CheckoutSuccessContent />
    </Suspense>
  );
}
