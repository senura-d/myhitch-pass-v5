import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { otpStore } from "@/lib/otp-store";

export const runtime = "nodejs";

function buildEmailHtml(otp: string, name: string) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Your MYHitch Pass verification code</title>
</head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:'DM Sans',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0"
          style="background:#ffffff;border-radius:16px;overflow:hidden;
                 box-shadow:0 4px 24px rgba(0,0,0,0.08);">

          <!-- Header gradient bar -->
          <tr>
            <td style="height:4px;background:linear-gradient(90deg,#00aeef,#7c3aed);"></td>
          </tr>

          <!-- Logo area -->
          <tr>
            <td align="center" style="padding:36px 40px 24px;">
              <span style="font-size:22px;font-weight:800;color:#0d0f14;letter-spacing:-0.5px;">
                MYHitch<span style="color:#00aeef;">Pass</span>
              </span>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:0 40px 40px;">
              <h1 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#0d0f14;">
                Hi ${name}, here is your verification code
              </h1>
              <p style="margin:0 0 28px;font-size:15px;color:#475569;line-height:1.6;">
                Enter this 6-digit code on the MYHitch Pass signup page to verify your
                email address. The code expires in <strong>10 minutes</strong>.
              </p>

              <!-- OTP box -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center"
                    style="background:#f8fafc;border:2px solid #e2e8f0;border-radius:12px;
                           padding:28px 0;">
                    <span style="font-size:42px;font-weight:800;letter-spacing:12px;
                                 color:#0d0f14;font-family:'Courier New',monospace;">
                      ${otp}
                    </span>
                  </td>
                </tr>
              </table>

              <p style="margin:24px 0 0;font-size:13px;color:#94a3b8;line-height:1.6;">
                If you didn't create a MYHitch Pass account, you can safely ignore this email.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f8fafc;border-top:1px solid #e2e8f0;
                       padding:20px 40px;text-align:center;">
              <p style="margin:0;font-size:12px;color:#94a3b8;">
                © ${new Date().getFullYear()} MYHitch Pass · Australia's Premier Event Platform
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as { email?: string; name?: string };
    const email = body.email?.trim().toLowerCase();
    const name  = body.name?.trim() || "there";

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { success: false, error: "A valid email address is required." },
        { status: 400 }
      );
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore.set(email, { otp, expires: Date.now() + 10 * 60 * 1000 });

    // Create transporter inside handler so env vars are always fresh
    const transporter = nodemailer.createTransport({
      host:   process.env.MAILTRAP_HOST   ?? "sandbox.smtp.mailtrap.io",
      port:   Number(process.env.MAILTRAP_PORT ?? 587),
      secure: false,
      auth: {
        user: process.env.MAILTRAP_USER,
        pass: process.env.MAILTRAP_PASS,
      },
      connectionTimeout: 10_000,
      greetingTimeout:   10_000,
    });

    await transporter.sendMail({
      from:    process.env.EMAIL_FROM ?? "MYHitch <noreply@myhitch.com.au>",
      to:      email,
      subject: "Your MYHitch Pass verification code",
      html:    buildEmailHtml(otp, name),
      text:    `Hi ${name},\n\nYour MYHitch Pass verification code is: ${otp}\n\nThis code expires in 10 minutes.\n\nIf you didn't create an account, please ignore this email.`,
    });

    return NextResponse.json({ success: true, message: "Verification code sent." });
  } catch (err) {
    console.error("[send-otp]", err);
    return NextResponse.json(
      { success: false, error: "Failed to send verification email. Please try again." },
      { status: 500 }
    );
  }
}
