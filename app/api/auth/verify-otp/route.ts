import { NextRequest, NextResponse } from "next/server";
import { consumeRateLimit } from "@/lib/auth/rate-limit";
import {
  AuthConfigurationError,
  SessionToken,
  SignupVerificationToken,
  signAuthToken,
  verifyAuthToken,
  verifyOtpHash
} from "@/lib/auth/security";

export const runtime = "nodejs";

const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const code = String(body.code ?? "").replace(/\D/g, "");
    if (!/^\d{6}$/.test(code)) {
      return NextResponse.json({ ok: false, error: "Enter the 6-digit verification code." }, { status: 400 });
    }

    const payload = verifyAuthToken<SignupVerificationToken>(body.verificationToken);
    if (payload.type !== "signup_otp" || !payload.email || !payload.otpHash) {
      return NextResponse.json({ ok: false, error: "Invalid verification session." }, { status: 400 });
    }

    if (payload.expiresAt <= Date.now()) {
      return NextResponse.json(
        { ok: false, error: "Verification code expired. Please request a new code." },
        { status: 410 }
      );
    }

    const clientIp = getClientIp(request);
    const rate = consumeRateLimit(`verify-otp:${clientIp}:${payload.email}`, 6, 10 * 60 * 1000);
    if (!rate.allowed) {
      return NextResponse.json(
        {
          ok: false,
          error: `Too many incorrect codes. Please try again in ${rate.retryAfterSeconds} seconds.`
        },
        { status: 429 }
      );
    }

    if (!verifyOtpHash(payload.email, code, payload.expiresAt, payload.otpHash)) {
      return NextResponse.json({ ok: false, error: "Invalid verification code." }, { status: 400 });
    }

    const sessionPayload: SessionToken = {
      type: "session",
      email: payload.email,
      name: payload.name,
      verifiedAt: Date.now()
    };
    const sessionToken = signAuthToken(sessionPayload);
    const response = NextResponse.json({ ok: true, redirectTo: "/" });

    response.cookies.set("vertex_session", sessionToken, {
      httpOnly: true,
      maxAge: SESSION_MAX_AGE_SECONDS,
      path: "/",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production"
    });

    return response;
  } catch (error) {
    if (error instanceof AuthConfigurationError) {
      return NextResponse.json(
        {
          ok: false,
          error: "Email verification is not configured yet. Add AUTH_SECRET in Vercel environment variables."
        },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Verification failed." },
      { status: 400 }
    );
  }
}

function getClientIp(request: NextRequest) {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "local"
  );
}
