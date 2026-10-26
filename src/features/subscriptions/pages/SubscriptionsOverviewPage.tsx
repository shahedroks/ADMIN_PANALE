import { MrrVelocityChart } from "@/features/subscriptions/components/MrrVelocityChart";
import { SubscriptionsComingSoon } from "@/features/subscriptions/components/SubscriptionsComingSoon";
import { SubscriptionGrowthChart } from "@/features/subscriptions/components/SubscriptionGrowthChart";
import { SubscriptionKpiCards } from "@/features/subscriptions/components/SubscriptionKpiCards";
import { SUBSCRIPTIONS_UI_VISIBLE } from "@/features/subscriptions/config/subscriptionsVisibility";
import { useI18n } from "@/i18n";
import "@/features/dashboard/styles/dashboard.css";
import "@/features/subscriptions/styles/subscriptions-coming-soon.css";
import "@/features/subscriptions/styles/subscriptions-page.css";

export function SubscriptionsOverviewPage() {
  const { t } = useI18n();

  if (!SUBSCRIPTIONS_UI_VISIBLE) {
    return <SubscriptionsComingSoon variant="overview" />;
  }

  return (
    <div className="dash-page subscriptions-page">
      <header className="subscriptions-page__header">
        <div className="subscriptions-page__crumb-row">
          <p className="subscriptions-page__breadcrumb">
            {t("subs.breadcrumb.parent")} <span aria-hidden>›</span> {t("subs.breadcrumb.overview")}
          </p>
          <span className="subscriptions-page__live-dot" aria-hidden />
        </div>
        <div className="subscriptions-page__title-row">
          <div>
            <h1>{t("subs.overviewTitle")}</h1>
            <p className="subscriptions-page__subtitle">
              {t("subs.overviewSubtitle")}
              <span className="subscriptions-page__subtitle-dot" aria-hidden />
            </p>
          </div>
          <div className="subscriptions-page__filters">
            <button type="button" className="subscriptions-page__filter">
              <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden>
                <rect x="2" y="3" width="10" height="9" rx="1" stroke="currentColor" fill="none" />
                <path d="M4 1v3M10 1v3M2 6h10" stroke="currentColor" />
              </svg>
              {t("subs.filter30")}
              <span className="subscriptions-page__chev">▾</span>
            </button>
            <button type="button" className="subscriptions-page__filter">
              {t("subs.filterUsd")}
              <span className="subscriptions-page__chev">⇅</span>
            </button>
          </div>
        </div>
      </header>

      <SubscriptionKpiCards />

      <div className="subscriptions-charts">
        <section className="subscriptions-card">
          <header className="subscriptions-card__head">
            <div>
              <div className="subscriptions-card__title-row">
                <h2>{t("subs.growthTitle")}</h2>
                <span className="subscriptions-card__pill subscriptions-card__pill--live">
                  {t("subs.liveStream")}
                </span>
              </div>
              <p>{t("subs.growthSubtitle")}</p>
            </div>
            <button type="button" className="subscriptions-card__chip">
              {t("subs.subscribers")}
            </button>
          </header>
          <SubscriptionGrowthChart />
        </section>

        <section className="subscriptions-card">
          <header className="subscriptions-card__head">
            <div>
              <div className="subscriptions-card__title-row">
                <h2>{t("subs.mrrTitle")}</h2>
                <span className="subscriptions-card__pill subscriptions-card__pill--mrr">
                  {t("subs.mrrFlow")}
                </span>
              </div>
              <p>{t("subs.mrrSubtitle")}</p>
            </div>
          </header>
          <MrrVelocityChart />
        </section>
      </div>
    </div>
  );
}
