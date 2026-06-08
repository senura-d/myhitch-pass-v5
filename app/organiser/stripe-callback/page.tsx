"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle, XCircle, Loader2, RefreshCw } from "lucide-react";

import API from "@/src/lib/api";

function StripeCallbackContent() {
  const router  = useRouter();
  const params  = useSearchParams();
  const [status,  setStatus]  = useState<"loading" | "success" | "incomplete" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const account = params.get("account");
    const refresh = params.get("refresh");
    const error   = params.get("error");

    if (error) {
      setStatus("error");
      setMessage("Stripe connection was cancelled.");
      return;
    }

    if (!account) {
      setStatus("error");
      setMessage("Missing account parameter.");
      return;
    }

    // If Stripe sent user back via refresh URL — re-generate onboarding link
    if (refresh === "1") {
      const token = localStorage.getItem("organiser_token") ?? localStorage.getItem("myhitch_token");
      if (!token) { router.push("/organiser/signup"); return; }

      fetch(`${API}/stripe/connect-url`, {
        headers: { "Authorization": `Bearer ${token}`, "Accept": "application/json" },
      })
        .then(r => r.json())
        .then(json => {
          if (json.url) window.location.href = json.url;
          else { setStatus("error"); setMessage("Could not refresh onboarding link."); }
        })
        .catch(() => { setStatus("error"); setMessage("Network error."); });
      return;
    }

    // Normal return — verify account with backend and save to DB
    fetch(`${API}/stripe/callback`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify({ account }),
    })
      .then(r => r.json())
      .then(json => {
        if (json.active) {
          setStatus("success");
          setMessage("Stripe account connected! Redirecting to your dashboard…");
          setTimeout(() => router.push("/organiser/dashboard"), 2500);
        } else if (json.stripe_account_id) {
          setStatus("incomplete");
          setMessage(json.message ?? "Please complete your Stripe onboarding.");
        } else {
          setStatus("error");
          setMessage(json.message ?? "Connection failed.");
        }
      })
      .catch(() => { setStatus("error"); setMessage("Network error. Please try again."); });
  }, [params, router]);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-3xl border border-slate-100 shadow-2xl p-10 max-w-sm w-full text-center">
        {status === "loading" && (
          <>
            <Loader2 className="h-14 w-14 text-[#635BFF] animate-spin mx-auto mb-5" />
            <h2 className="text-lg font-extrabold text-slate-800 mb-2">Connecting Stripe…</h2>
            <p className="text-sm text-slate-500">Verifying your account. Please wait.</p>
          </>
        )}
        {status === "success" && (
          <>
            <CheckCircle className="h-14 w-14 text-emerald-500 mx-auto mb-5" />
            <h2 className="text-lg font-extrabold text-slate-800 mb-2">Connected!</h2>
            <p className="text-sm text-slate-500">{message}</p>
          </>
        )}
        {status === "incomplete" && (
          <>
            <RefreshCw className="h-14 w-14 text-amber-500 mx-auto mb-5" />
            <h2 className="text-lg font-extrabold text-slate-800 mb-2">Onboarding incomplete</h2>
            <p className="text-sm text-slate-500 mb-6">{message}</p>
            <button
              onClick={() => router.push("/organiser/signup")}
              className="w-full bg-[#635BFF] hover:bg-[#4f48e8] text-white font-extrabold text-sm py-3 rounded-xl transition-all cursor-pointer"
            >
              Complete onboarding
            </button>
          </>
        )}
        {status === "error" && (
          <>
            <XCircle className="h-14 w-14 text-red-400 mx-auto mb-5" />
            <h2 className="text-lg font-extrabold text-slate-800 mb-2">Connection failed</h2>
            <p className="text-sm text-slate-500 mb-6">{message}</p>
            <button
              onClick={() => router.push("/organiser/signup")}
              className="w-full bg-[#635BFF] hover:bg-[#4f48e8] text-white font-extrabold text-sm py-3 rounded-xl transition-all cursor-pointer"
            >
              Try again
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default function StripeCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="h-10 w-10 text-[#635BFF] animate-spin" />
      </div>
    }>
      <StripeCallbackContent />
    </Suspense>
  );
}
