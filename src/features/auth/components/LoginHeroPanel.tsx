import { useCountUp } from "@/features/auth/hooks/useCountUp";
import { usePrefersReducedMotion } from "@/features/auth/hooks/usePrefersReducedMotion";

function SwapIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" aria-hidden>
      <rect width="40" height="40" rx="8" fill="#ACF847" />
      <path
        d="M12 16h12l-2.5-2.5M28 24H16l2.5 2.5"
        stroke="#00241A"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M26 14l2 2-2 2M14 26l-2-2 2-2"
        stroke="#00241A"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ShieldCheckIcon() {
  return (
    <svg width="16" height="20" viewBox="0 0 16 20" fill="none" aria-hidden>
      <path
        d="M8 1L2 4v5c0 4.2 2.55 8.13 6 9.5 3.45-1.37 6-5.3 6-9.5V4L8 1z"
        fill="#ACF847"
      />
      <path
        d="M5.5 10l1.8 1.8L10.5 8.5"
        stroke="#00241A"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function TrustScaleIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 3v3M8 6h8M6 9h12v2a6 6 0 01-12 0V9z"
        stroke="#ACF847"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M9 15h6" stroke="#ACF847" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function CommunityShieldIcon() {
  return (
    <svg width="16" height="20" viewBox="0 0 16 20" fill="none" aria-hidden>
      <path
        d="M8 1L2 4v5c0 4.2 2.55 8.13 6 9.5 3.45-1.37 6-5.3 6-9.5V4L8 1z"
        fill="#ACF847"
      />
    </svg>
  );
}

function formatCount(n: number): string {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(n);
}

export function LoginHeroPanel() {
  const reducedMotion = usePrefersReducedMotion();
  const trust = useCountUp(99.98, {
    duration: 1600,
    delay: 600,
    decimals: 2,
    enabled: !reducedMotion,
  });
  const community = useCountUp(14280, {
    duration: 1800,
    delay: 900,
    enabled: !reducedMotion,
  });

  const heroClass = reducedMotion ? "login-hero" : "login-hero login-hero--animate";

  return (
    <aside className={heroClass} aria-label="SWAP IT branding">
      <div className="login-hero__glow login-hero__glow--top" />
      <div className="login-hero__glow login-hero__glow--bottom" />

      <div className="login-hero__brand login-hero__reveal login-hero__reveal--1">
        <div className="login-hero__brand-row">
          <div className="login-hero__logo-wrap">
            <SwapIcon />
          </div>
          <div className="login-hero__brand-text">
            <span className="login-hero__brand-name">SWAP IT</span>
            <span className="login-hero__brand-tag">Moderation &amp; Ops</span>
          </div>
        </div>

        <div className="login-hero__copy">
          <h1 className="login-hero__headline">
            Give things a{" "}
            <span className="login-hero__accent login-hero__accent-shimmer">
              new life.
            </span>
          </h1>
          <p className="login-hero__subline">
            <ShieldCheckIcon />
            <span>Admin control center — safe swapping first</span>
          </p>
        </div>
      </div>

      <div className="login-hero__orbit-wrap login-hero__reveal login-hero__reveal--2">
        <div className="login-hero__orbit">
          <svg className="login-hero__orbit-svg" viewBox="0 0 224 224" aria-hidden>
            <g
              className={
                reducedMotion ? undefined : "login-hero__orbit-spin login-hero__orbit-spin--fwd"
              }
            >
              <circle
                cx="112"
                cy="112"
                r="103"
                fill="none"
                stroke="rgba(172, 248, 71, 0.25)"
                strokeWidth="1.68"
                strokeDasharray="8 10"
              />
              <circle cx="112" cy="9" r="5" fill="#ACF847" className="login-hero__orbit-dot" />
            </g>
            <g
              className={
                reducedMotion ? undefined : "login-hero__orbit-spin login-hero__orbit-spin--rev"
              }
            >
              <circle
                cx="112"
                cy="112"
                r="83"
                fill="none"
                stroke="rgba(163, 208, 190, 0.45)"
                strokeWidth="1.68"
              />
              <circle cx="195" cy="112" r="4" fill="#A3D0BE" className="login-hero__orbit-dot" />
            </g>
          </svg>
          <div className="login-hero__orbit-core">
            <TrustScaleIcon />
            <span className="login-hero__orbit-label">Circular Trust</span>
            <strong className="login-hero__orbit-value">{trust.toFixed(2)}%</strong>
          </div>
        </div>
      </div>

      <div className="login-hero__metric-card login-hero__reveal login-hero__reveal--3">
        <div className="login-hero__metric-icon">
          <CommunityShieldIcon />
        </div>
        <div className="login-hero__metric-body">
          <span className="login-hero__metric-kicker">Community Shield</span>
          <strong className="login-hero__metric-number">
            {formatCount(Math.round(community))}+
          </strong>
          <p className="login-hero__metric-desc">
            Circular peer-to-peer exchanges actively verified and protected
            across all zones.
          </p>
        </div>
      </div>
    </aside>
  );
}
