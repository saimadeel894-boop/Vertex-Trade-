import { NextRequest, NextResponse } from "next/server";
import { EmailConfigurationError, sendVerificationEmail } from "@/lib/auth/email";
import { consumeRateLimit } from "@/lib/auth/rate-limit";
import {
  AuthConfigurationError,
  SignupVerificationToken,
  createOtpHash,
  generateOtp,
  isEmail,
  maskEmail,
  normalizeEmail,
  sanitizeName,
  signAuthToken
} from "@/lib/auth/security";

export const runtime = "nodejs";

const OTP_TTL_MINUTES = 10;
const OTP_TTL_MS = OTP_TTL_MINUTES * 60 * 1000;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const name = sanitizeName(body.name);
    const email = normalizeEmail(body.email);
    const password = String(body.password ?? "");
    const confirm = String(body.confirm ?? "");
    const terms = Boolean(body.terms);
    const age = Boolean(body.age);

    const validationError = validateSignup({ age, confirm, email, name, password, terms });
    if (validationError) {
      return NextResponse.json({ ok: false, error: validationError }, { status: 400 });
    }

    const clientIp = getClientIp(request);
    const rate = consumeRateLimit(`signup-otp:${clientIp}:${email}`, 3, 15 * 60 * 1000);
    if (!rate.allowed) {
      return NextResponse.json(
        {
          ok: false,
          error: `Too many verification attempts. Please try again in ${rate.retryAfterSeconds} seconds.`
        },
        { status: 429 }
      );
    }

    const code = generateOtp();
    const expiresAt = Date.now() + OTP_TTL_MS;
    const tokenPayload: SignupVerificationToken = {
      type: "signup_otp",
      email,
      name,
      otpHash: createOtpHash(email, code, expiresAt),
      expiresAt,
      issuedAt: Date.now()
    };
    const verificationToken = signAuthToken(tokenPayload);

    await sendVerificationEmail({
      code,
      expiresInMinutes: OTP_TTL_MINUTES,
      name,
      to: email
    });

    return NextResponse.json({
      ok: true,
      verificationToken,
      maskedEmail: maskEmail(email),
      expiresInSeconds: OTP_TTL_MINUTES * 60
    });
  } catch (error) {
    if (error instanceof EmailConfigurationError || error instanceof AuthConfigurationError) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "Email verification is not configured yet. Add SMTP credentials and AUTH_SECRET in Vercel environment variables."
        },
        { status: 503 }
      );
    }

    console.error("OTP request failed", error);
    return NextResponse.json(
      { ok: false, error: "Unable to send verification email right now. Please try again shortly." },
      { status: 502 }
    );
  }
}

function validateSignup({
  age,
  confirm,
  email,
  name,
  password,
  terms
}: {
  age: boolean;
  confirm: string;
  email: string;
  name: string;
  password: string;
  terms: boolean;
}) {
  if (!name || name.length > 80) return "Please enter your full name.";
  if (!isEmail(email) || email.length > 254) return "Please enter a valid email address.";
  if (password.length < 8 || password.length > 128) return "Password must be between 8 and 128 characters.";
  if (password !== confirm) return "Passwords do not match.";
  if (!terms || !age) return "Please agree to all required terms.";
  return "";
}

function getClientIp(request: NextRequest) {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "local"
  );
}
