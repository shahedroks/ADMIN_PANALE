import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLogin } from "@/features/auth/hooks/useLogin";

function MailIcon() {
  return (
    <svg width="20" height="16" viewBox="0 0 20 16" fill="none" aria-hidden>
      <path
        d="M1 3l9 6 9-6M2 14h16a1 1 0 001-1V3a1 1 0 00-1-1H2a1 1 0 00-1 1v10a1 1 0 001 1z"
        stroke="#717974"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg width="18" height="20" viewBox="0 0 18 20" fill="none" aria-hidden>
      <rect
        x="3"
        y="9"
        width="12"
        height="9"
        rx="2"
        stroke="#717974"
        strokeWidth="1.5"
      />
      <path
        d="M6 9V6a3 3 0 016 0v3"
        stroke="#717974"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function EyeIcon({ hidden }: { hidden: boolean }) {
  if (hidden) {
    return (
      <svg width="22" height="16" viewBox="0 0 22 16" fill="none" aria-hidden>
        <path
          d="M1 1l20 14M10 6a3 3 0 013 3M4.5 4.5A9.7 9.7 0 0111 3c4 0 7.5 2.5 10 7a10.8 10.8 0 01-2.2 3.2M7.8 7.8A3 3 0 0011 12"
          stroke="#717974"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    );
  }
  return (
    <svg width="22" height="16" viewBox="0 0 22 16" fill="none" aria-hidden>
      <path
        d="M1 8s3.5-7 10-7 10 7 10 7-3.5 7-10 7S1 8 1 8z"
        stroke="#717974"
        strokeWidth="1.5"
      />
      <circle cx="11" cy="8" r="3" stroke="#717974" strokeWidth="1.5" />
    </svg>
  );
}

function RestrictedIcon() {
  return (
    <svg width="18" height="20" viewBox="0 0 18 20" fill="none" aria-hidden>
      <path
        d="M9 1L2 4v5c0 4.2 2.55 8.13 6 9.5 3.45-1.37 6-5.3 6-9.5V4L9 1z"
        fill="#00241A"
      />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M3 8h10M9 4l4 4-4 4"
        stroke="#FFFFFF"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SecureLockIcon() {
  return (
    <svg width="16" height="21" viewBox="0 0 16 21" fill="none" aria-hidden>
      <rect x="2" y="9" width="12" height="10" rx="2" fill="#00241A" />
      <path
        d="M5 9V6a3 3 0 016 0v3"
        stroke="#00241A"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function LoginForm() {
  const navigate = useNavigate();
  const { submit, loading, error } = useLogin();
  const [email, setEmail] = useState("admin@swapit.io");
  const [password, setPassword] = useState("CircularEco2024!");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    try {
      await submit({ email, password });
      navigate("/dashboard", { replace: true });
    } catch {
      /* error surfaced via hook */
    }
  }

  return (
    <section className="login-form-panel login-form-panel--animate">
      <div className="login-form-panel__inner">
        <header className="login-form-panel__header login-reveal login-reveal--1">
          <span className="login-form-panel__badge">
            <RestrictedIcon />
            Restricted Personnel
          </span>
          <h1>Admin Login</h1>
          <p>
            Enter your administrative credentials to access moderation console.
          </p>
        </header>

        <form className="login-form-panel__form" onSubmit={handleSubmit}>
          {error && <p className="login-form-panel__error">{error}</p>}

          <div className="login-field login-reveal login-reveal--2">
            <label htmlFor="admin-email">Email Address</label>
            <div className="login-field__control">
              <span className="login-field__icon login-field__icon--left">
                <MailIcon />
              </span>
              <input
                id="admin-email"
                className="login-field__input login-field__input--email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </div>
          </div>

          <div className="login-field login-reveal login-reveal--3">
            <label htmlFor="admin-password">Password</label>
            <div className="login-field__control">
              <span className="login-field__icon login-field__icon--left">
                <LockIcon />
              </span>
              <input
                id="admin-password"
                className="login-field__input"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                className="login-field__toggle"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                <EyeIcon hidden={showPassword} />
              </button>
            </div>
          </div>

          <div className="login-form-panel__utilities login-reveal login-reveal--4">
            <label className="login-form-panel__remember">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
              />
              Remember me
            </label>
            <a href="#forgot" className="login-form-panel__forgot">
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            className={`login-form-panel__submit login-reveal login-reveal--5${loading ? " login-form-panel__submit--loading" : ""}`}
            disabled={loading}
          >
            {loading && <span className="login-form-panel__spinner" aria-hidden />}
            <span>{loading ? "Signing in…" : "Log in to Admin Console"}</span>
            {!loading && (
              <span className="login-form-panel__submit-arrow">
                <ArrowRightIcon />
              </span>
            )}
          </button>
        </form>

        <footer className="login-form-panel__footer login-reveal login-reveal--6">
          <span className="login-form-panel__footer-icon">
            <SecureLockIcon />
          </span>
          <span>
            Secured with enterprise 2FA &amp; end-to-end audit logging
          </span>
        </footer>
      </div>
    </section>
  );
}
