"use client";

import { FormEvent, useMemo, useState } from "react";

type AuthMode = "signin" | "signup";
type AuthErrors = Partial<Record<"name" | "email" | "password" | "confirm", boolean>>;

function VertexLogo() {
  return (
    <a href="/" className="auth-nav-logo" aria-label="Vertex Markets home">
      <svg width="26" height="26" viewBox="0 0 28 28" fill="none" aria-hidden="true">
        <path
          d="M3 3L14 25L25 3"
          stroke="white"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2.6"
        />
        <path
          d="M8 3L14 17L20 3"
          stroke="white"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.4"
          opacity="0.4"
        />
      </svg>
      <span>
        <span className="auth-brand">VERTEX</span>
        <span className="auth-brand-sub">MARKETS</span>
      </span>
    </a>
  );
}

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="#1877F2" aria-hidden="true">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function EyeIcon({ hidden }: { hidden: boolean }) {
  if (!hidden) {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
        <line x1="1" y1="1" x2="23" y2="23" />
      </svg>
    );
  }

  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function SecurityBadge() {
  return (
    <div className="auth-security-badge">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" aria-hidden="true">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
      <span className="auth-security-badge-text">256-bit SSL encryption - Your data is secure</span>
    </div>
  );
}

function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function getStrength(password: string) {
  let score = 0;
  if (password.length >= 8) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  return [
    { width: "0%", color: "transparent", label: "" },
    { width: "25%", color: "#ef4444", label: "Weak" },
    { width: "50%", color: "#f59e0b", label: "Fair" },
    { width: "75%", color: "#3b82f6", label: "Good" },
    { width: "100%", color: "#22c55e", label: "Strong" }
  ][score];
}

export function AuthPage({ mode }: { mode: AuthMode }) {
  const isSignup = mode === "signup";
  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
    terms: false,
    age: false
  });
  const [errors, setErrors] = useState<AuthErrors>({});
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState<Record<string, boolean>>({});

  const strength = useMemo(() => getStrength(values.password), [values.password]);

  const updateValue = (key: keyof typeof values, value: string | boolean) => {
    setValues((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: false }));
    if (message) setMessage("");
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors: AuthErrors = {};
    if (isSignup && !values.name.trim()) nextErrors.name = true;
    if (!isEmail(values.email.trim())) nextErrors.email = true;
    if (isSignup ? values.password.length < 8 : !values.password) nextErrors.password = true;
    if (isSignup && values.password !== values.confirm) nextErrors.confirm = true;

    setErrors(nextErrors);
    if (isSignup && (!values.terms || !values.age)) {
      setMessage("Please agree to all required terms.");
    }

    if (Object.keys(nextErrors).length || (isSignup && (!values.terms || !values.age))) return;

    setSubmitting(true);
    setMessage(isSignup ? "Creating account..." : "Signing in...");
    window.setTimeout(() => {
      setMessage(isSignup ? "Account created! Redirecting..." : "Success! Redirecting...");
      window.setTimeout(() => {
        window.location.href = "/";
      }, 1200);
    }, isSignup ? 1400 : 1200);
  };

  const inputType = (key: string) => (passwordVisible[key] ? "text" : "password");

  return (
    <main className="auth-page-shell">
      <div className="auth-bg" />
      <div className="auth-bg-grid" />

      <div className="auth-page">
        <nav className="auth-navbar">
          <VertexLogo />
        </nav>

        <div className="auth-wrap">
          <section className="auth-card" aria-labelledby="auth-title">
            <h1 className="auth-title" id="auth-title">
              {isSignup ? "Create your account" : "Welcome back"}
            </h1>
            <p className="auth-sub">
              {isSignup ? "Join thousands of traders on Vertex Markets" : "Sign in to your Vertex Markets account"}
            </p>

            <div className="auth-social-btns">
              <button className="auth-btn-social" type="button">
                <GoogleIcon />
                Google
              </button>
              <button className="auth-btn-social" type="button">
                <FacebookIcon />
                Facebook
              </button>
            </div>

            <div className="auth-divider">
              <span className="auth-divider-text">{isSignup ? "or create with email" : "or sign in with email"}</span>
            </div>

            <form onSubmit={handleSubmit} noValidate>
              {isSignup ? (
                <div className="auth-form-group">
                  <label className="auth-form-label" htmlFor="signup-name">
                    Full Name
                  </label>
                  <input
                    className={`auth-form-input${errors.name ? " error" : ""}`}
                    id="signup-name"
                    autoComplete="name"
                    placeholder="John Smith"
                    value={values.name}
                    onChange={(event) => updateValue("name", event.target.value)}
                    type="text"
                  />
                  <div className="auth-form-error">Please enter your full name.</div>
                </div>
              ) : null}

              <div className="auth-form-group">
                <label className="auth-form-label" htmlFor={`${mode}-email`}>
                  Email address
                </label>
                <input
                  className={`auth-form-input${errors.email ? " error" : ""}`}
                  id={`${mode}-email`}
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={values.email}
                  onChange={(event) => updateValue("email", event.target.value)}
                  type="email"
                />
                <div className="auth-form-error">Please enter a valid email address.</div>
              </div>

              <div className="auth-form-group">
                <label className="auth-form-label" htmlFor={`${mode}-password`}>
                  Password
                </label>
                <div className="auth-input-wrap">
                  <input
                    className={`auth-form-input${errors.password ? " error" : ""}`}
                    id={`${mode}-password`}
                    autoComplete={isSignup ? "new-password" : "current-password"}
                    placeholder={isSignup ? "Create a strong password" : "Enter your password"}
                    value={values.password}
                    onChange={(event) => updateValue("password", event.target.value)}
                    type={inputType("password")}
                  />
                  <button
                    className="auth-pw-toggle"
                    type="button"
                    aria-label={passwordVisible.password ? "Hide password" : "Show password"}
                    onClick={() => setPasswordVisible((current) => ({ ...current, password: !current.password }))}
                  >
                    <EyeIcon hidden={!passwordVisible.password} />
                  </button>
                </div>
                {isSignup ? (
                  <div className="auth-pw-strength">
                    <div className="auth-pw-strength-bar">
                      <div
                        className="auth-pw-strength-fill"
                        style={{ width: strength.width, background: strength.color }}
                      />
                    </div>
                    <span className="auth-pw-strength-text" style={{ color: strength.color }}>
                      {strength.label}
                    </span>
                  </div>
                ) : null}
                <div className="auth-form-error">
                  {isSignup ? "Password must be at least 8 characters." : "Password is required."}
                </div>
              </div>

              {isSignup ? (
                <div className="auth-form-group">
                  <label className="auth-form-label" htmlFor="signup-confirm">
                    Confirm Password
                  </label>
                  <div className="auth-input-wrap">
                    <input
                      className={`auth-form-input${errors.confirm ? " error" : ""}`}
                      id="signup-confirm"
                      autoComplete="new-password"
                      placeholder="Repeat your password"
                      value={values.confirm}
                      onChange={(event) => updateValue("confirm", event.target.value)}
                      type={inputType("confirm")}
                    />
                    <button
                      className="auth-pw-toggle"
                      type="button"
                      aria-label={passwordVisible.confirm ? "Hide password" : "Show password"}
                      onClick={() => setPasswordVisible((current) => ({ ...current, confirm: !current.confirm }))}
                    >
                      <EyeIcon hidden={!passwordVisible.confirm} />
                    </button>
                  </div>
                  <div className="auth-form-error">Passwords do not match.</div>
                </div>
              ) : (
                <div className="auth-forgot">
                  <a href="#">Forgot password?</a>
                </div>
              )}

              {isSignup ? (
                <>
                  <div className="auth-checkbox-group">
                    <input
                      className="auth-form-checkbox"
                      id="agreeTerms"
                      checked={values.terms}
                      onChange={(event) => updateValue("terms", event.target.checked)}
                      type="checkbox"
                    />
                    <label className="auth-checkbox-label" htmlFor="agreeTerms">
                      I agree to the <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>
                    </label>
                  </div>
                  <div className="auth-checkbox-group">
                    <input
                      className="auth-form-checkbox"
                      id="agreeAge"
                      checked={values.age}
                      onChange={(event) => updateValue("age", event.target.checked)}
                      type="checkbox"
                    />
                    <label className="auth-checkbox-label" htmlFor="agreeAge">
                      I confirm I am 18 years of age or older
                    </label>
                  </div>
                </>
              ) : null}

              {message ? <p className="auth-status-message">{message}</p> : null}

              <button className="auth-btn-submit" type="submit" disabled={submitting}>
                {submitting ? (isSignup ? "Creating account..." : "Signing in...") : isSignup ? "Create Account" : "Sign In"}
              </button>
            </form>

            <SecurityBadge />

            <p className="auth-switch">
              {isSignup ? "Already have an account? " : "Don't have an account? "}
              <a href={isSignup ? "/signin" : "/signup"}>{isSignup ? "Sign in" : "Create account"}</a>
            </p>

            {isSignup ? (
              <p className="auth-terms-text">
                By creating an account, you agree to Vertex Markets account security and compliance checks.
              </p>
            ) : null}
          </section>
        </div>
      </div>
    </main>
  );
}
