import { NextRequest, NextResponse } from "next/server";
import { otpStore } from "@/lib/otp-store";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as { email?: string; otp?: string };
    const email = body.email?.trim().toLowerCase();
    const otp   = body.otp?.trim();

    if (!email || !otp) {
      return NextResponse.json(
        { success: false, error: "Email and verification code are required." },
        { status: 400 }
      );
    }

    const entry = otpStore.get(email);

    if (!entry) {
      return NextResponse.json(
        { success: false, error: "No code found for this email. Please request a new one." },
        { status: 400 }
      );
    }

    if (Date.now() > entry.expires) {
      otpStore.delete(email);
      return NextResponse.json(
        { success: false, error: "Code expired. Please request a new one." },
        { status: 400 }
      );
    }

    if (entry.otp !== otp) {
      return NextResponse.json(
        { success: false, error: "Incorrect code. Please check and try again." },
        { status: 400 }
      );
    }

    otpStore.delete(email);
    return NextResponse.json({ success: true, message: "Email verified successfully." });
  } catch {
    return NextResponse.json(
      { success: false, error: "Server error. Please try again." },
      { status: 500 }
    );
  }
}
