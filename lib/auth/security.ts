import {
  createHmac,
  randomInt,
  timingSafeEqual
} from "node:crypto";

export type SignupVerificationToken = {
  type: "signup_otp";
  email: string;
  name: string;
  otpHash: string;
  expiresAt: number;
  issuedAt: number;
};

export type SessionToken = {
  type: "session";
  email: string;
  name: string;
  verifiedAt: number;
};

export class AuthConfigurationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthConfigurationError";
  }
}

export function normalizeEmail(value: unknown) {
  return String(value ?? "").trim().toLowerCase();
}

export function sanitizeName(value: unknown) {
  return String(value ?? "").trim().replace(/\s+/g, " ");
}

export function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function maskEmail(email: string) {
  const [name, domain] = email.split("@");
  if (!name || !domain) return email;
  const visible = name.slice(0, Math.min(2, name.length));
  return `${visible}${"*".repeat(Math.max(3, name.length - visible.length))}@${domain}`;
}

export function generateOtp() {
  return String(randomInt(0, 1_000_000)).padStart(6, "0");
}

export function createOtpHash(email: string, code: string, expiresAt: number) {
  return createHmac("sha256", getAuthSecret())
    .update(`${email}:${code}:${expiresAt}`)
    .digest("base64url");
}

export function verifyOtpHash(email: string, code: string, expiresAt: number, expectedHash: string) {
  const actualHash = createOtpHash(email, code, expiresAt);
  return safeEqual(actualHash, expectedHash);
}

export function signAuthToken<T extends object>(payload: T) {
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = createHmac("sha256", getAuthSecret()).update(encodedPayload).digest("base64url");
  return `${encodedPayload}.${signature}`;
}

export function verifyAuthToken<T>(token: unknown) {
  if (typeof token !== "string" || !token.includes(".")) {
    throw new Error("Invalid verification token.");
  }

  const [encodedPayload, signature] = token.split(".");
  const expectedSignature = createHmac("sha256", getAuthSecret()).update(encodedPayload).digest("base64url");
  if (!safeEqual(signature, expectedSignature)) {
    throw new Error("Invalid verification token.");
  }

  try {
    return JSON.parse(Buffer.from(encodedPayload, "base64url").toString("utf8")) as T;
  } catch {
    throw new Error("Invalid verification token.");
  }
}

function getAuthSecret() {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 32) {
    throw new AuthConfigurationError("AUTH_SECRET must be at least 32 characters.");
  }
  return secret;
}

function safeEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  if (leftBuffer.length !== rightBuffer.length) return false;
  return timingSafeEqual(leftBuffer, rightBuffer);
}
