import { useI18n } from "@/i18n";
import { useDemoStore } from "@/store/demoStore";

export function PlansFeatureGateBanner() {
  const { t } = useI18n();
  const { pushToast } = useDemoStore();

  return (
    <section className="plans-gate-banner">
      <div className="plans-gate-banner__icon" aria-hidden>
        <svg viewBox="0 0 24 16">
          <rect x="2" y="4" width="20" height="3" rx="1" fill="var(--swapit-accent)" />
          <rect x="2" y="10" width="20" height="3" rx="1" fill="var(--swapit-accent)" />
          <circle cx="6" cy="5.5" r="1.5" fill="var(--swapit-primary-dark)" />
          <circle cx="6" cy="11.5" r="1.5" fill="var(--swapit-primary-dark)" />
        </svg>
      </div>
      <div className="plans-gate-banner__body">
        <h3>{t("subs.gate.title")}</h3>
        <p>{t("subs.gate.body")}</p>
      </div>
      <button
        type="button"
        className="plans-gate-banner__btn"
        onClick={() => pushToast(t("subs.gate.toast"), "info")}
      >
        {t("subs.gate.action")}
      </button>
    </section>
  );
}
