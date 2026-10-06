function PremiumIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden>
      <circle cx="10" cy="10" r="10" fill="rgba(172, 248, 71, 0.35)" />
      <path
        fill="#416900"
        d="M6.5 10.2 8.8 12.5l4.7-5.2 1.3 1.2-6 6.6-3.3-3.3 1.3-1.2Z"
      />
    </svg>
  );
}

function FreeBaseIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden>
      <path fill="#717974" d="M10 2 4 6v8l6 4 6-4V6l-6-4Zm0 2.2 3.8 2.5v5.6L10 15.8 6.2 12.3V6.7L10 4.2Z" />
    </svg>
  );
}

function GraceIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden>
      <path
        fill="#ba1a1a"
        d="M6 2h8v2H6V2Zm1 3h6v11H7V5Zm2 2v7h2V7H9Zm2 0v7h2V7h-2Z"
      />
    </svg>
  );
}

export function SubscriptionKpiCards() {
  return (
    <div className="sub-kpis">
      <article className="sub-kpi sub-kpi--premium">
        <div className="sub-kpi__top">
          <div>
            <p className="sub-kpi__label">Active Premium</p>
            <strong className="sub-kpi__value">4,820</strong>
            <p className="sub-kpi__meta sub-kpi__meta--positive">
              <span aria-hidden>↑</span> 26.1% Conv.
            </p>
          </div>
          <span className="sub-kpi__icon sub-kpi__icon--premium">
            <PremiumIcon />
          </span>
        </div>
        <div className="sub-kpi__foot sub-kpi__foot--gradient">
          <span>+18.4% monthly cohort spike</span>
        </div>
      </article>

      <article className="sub-kpi">
        <div className="sub-kpi__top">
          <div>
            <p className="sub-kpi__label">Free Base</p>
            <strong className="sub-kpi__value">13,630</strong>
            <p className="sub-kpi__meta">73.9% active free</p>
          </div>
          <span className="sub-kpi__icon sub-kpi__icon--muted">
            <FreeBaseIcon />
          </span>
        </div>
        <div className="sub-kpi__foot">
          <div className="sub-kpi__progress" aria-hidden>
            <span style={{ width: "73.9%" }} />
          </div>
        </div>
      </article>

      <article className="sub-kpi sub-kpi--grace">
        <div className="sub-kpi__top">
          <div>
            <p className="sub-kpi__label">Grace Hopper</p>
            <strong className="sub-kpi__value">86</strong>
            <p className="sub-kpi__meta sub-kpi__meta--danger">7-day recovery</p>
          </div>
          <span className="sub-kpi__icon sub-kpi__icon--danger">
            <GraceIcon />
          </span>
        </div>
        <div className="sub-kpi__foot">
          <span>61% projected reclaim</span>
        </div>
      </article>

      <article className="sub-kpi sub-kpi--mrr">
        <div className="sub-kpi__top">
          <div>
            <div className="sub-kpi__mrr-head">
              <p className="sub-kpi__label sub-kpi__label--inverse">Monthly MRR</p>
              <span className="sub-kpi__delta-pill">+12.8%</span>
            </div>
            <strong className="sub-kpi__value sub-kpi__value--inverse">$38,420</strong>
            <p className="sub-kpi__meta sub-kpi__meta--inverse">+$4,350 from Sep</p>
          </div>
        </div>
        <div className="sub-kpi__foot sub-kpi__foot--inverse">
          <span>Velocity target on schedule</span>
        </div>
      </article>
    </div>
  );
}
