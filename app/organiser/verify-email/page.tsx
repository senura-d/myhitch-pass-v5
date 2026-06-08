"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function VerifyEmailRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/organiser/signup");
  }, [router]);

  return (
    <div className="h-screen flex items-center justify-center bg-soft-bg">
      <p className="text-sm text-slate-500 font-medium">Redirecting…</p>
    </div>
  );
}
