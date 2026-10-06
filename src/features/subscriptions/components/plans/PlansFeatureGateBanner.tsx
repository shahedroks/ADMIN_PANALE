import { useDemoStore } from "@/store/demoStore";

export function PlansFeatureGateBanner() {
  const { pushToast } = useDemoStore();

  return (
    <section className="plans-gate-banner">
      <div className="plans-gate-banner__icon" aria-hidden>
        <svg viewBox="0 0 24 16">
          <rect x="2" y="4" width="20" height="3" rx="1" fill="#acf847" />
          <rect x="2" y="10" width="20" height="3" rx="1" fill="#acf847" />
          <circle cx="6" cy="5.5" r="1.5" fill="#00241a" />
          <circle cx="6" cy="11.5" r="1.5" fill="#00241a" />
        </svg>
      </div>
      <div className="plans-gate-banner__body">
        <h3>Feature Gate Enforcement Engine</h3>
        <p>
          Real-time edge authorization for mobile and web clients — quotas, entitlements, and
          tier gates synced across active swap nodes.
        </p>
      </div>
      <button
        type="button"
        className="plans-gate-banner__btn"
        onClick={() => pushToast("Feature matrix audit opened (demo).", "info")}
      >
        Audit Feature Matrix
      </button>
    </section>
  );
}
