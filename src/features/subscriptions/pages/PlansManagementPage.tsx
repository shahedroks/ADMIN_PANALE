import { useEffect, useMemo, useState } from "react";
import { PlansFeatureGateBanner } from "@/features/subscriptions/components/plans/PlansFeatureGateBanner";
import { PlanEditorPanel } from "@/features/subscriptions/components/plans/PlanEditorPanel";
import { PlansListPanel } from "@/features/subscriptions/components/plans/PlansListPanel";
import { PlansSummaryKpis } from "@/features/subscriptions/components/plans/PlansSummaryKpis";
import { SubscriptionsComingSoon } from "@/features/subscriptions/components/SubscriptionsComingSoon";
import { SUBSCRIPTIONS_UI_VISIBLE } from "@/features/subscriptions/config/subscriptionsVisibility";
import { useSubscriptionPlans } from "@/hooks/useSubscriptionPlans";
import { useI18n } from "@/i18n";
import { useToast } from "@/store/toastStore";
import "@/features/dashboard/styles/dashboard.css";
import "@/features/subscriptions/styles/subscriptions-coming-soon.css";
import "@/features/subscriptions/styles/subscriptions-page.css";
import "@/features/subscriptions/styles/plans-management.css";

export function PlansManagementPage() {
  if (!SUBSCRIPTIONS_UI_VISIBLE) {
    return <SubscriptionsComingSoon variant="plans" />;
  }

  const { t } = useI18n();
  const { pushToast } = useToast();
  const { plans: subscriptionPlans, loading, error, updatePlan } = useSubscriptionPlans();
  const [selectedId, setSelectedId] = useState("");
  const [editorOpen, setEditorOpen] = useState(true);

  useEffect(() => {
    if (!selectedId && subscriptionPlans[0]) {
      setSelectedId(subscriptionPlans[0].id);
    }
  }, [selectedId, subscriptionPlans]);

  const selectedPlan = useMemo(
    () => subscriptionPlans.find((p) => p.id === selectedId) ?? subscriptionPlans[0],
    [selectedId, subscriptionPlans],
  );

  return (
    <div className="dash-page plans-page">
      {loading && <p>{t("subs.plans.loading")}</p>}
      {error && <p role="alert">{error}</p>}
      <header className="plans-page__header">
        <div className="plans-page__intro">
          <p className="subscriptions-page__breadcrumb">
            {t("subs.breadcrumb.parent")} <span aria-hidden>›</span> {t("subs.plans.breadcrumb")}
          </p>
          <div className="plans-page__title-row">
            <h1>{t("subs.plans.title")}</h1>
            <span className="plans-page__engine-badge">{t("subs.plans.engine")}</span>
          </div>
          <p className="subscriptions-page__subtitle">{t("subs.plans.subtitle")}</p>
        </div>
      </header>

      <PlansSummaryKpis />

      <div className={`plans-layout${editorOpen ? "" : " plans-layout--full"}`}>
        <div className="plans-layout__main">
          <PlansListPanel
            plans={subscriptionPlans}
            selectedId={selectedId}
            onSelect={(id) => {
              setSelectedId(id);
              setEditorOpen(true);
            }}
          />
          <PlansFeatureGateBanner />
        </div>
        {editorOpen && selectedPlan && (
          <PlanEditorPanel
            plan={selectedPlan}
            onClose={() => setEditorOpen(false)}
            onSave={async (patch) => {
              try {
                await updatePlan(selectedPlan.id, patch);
                pushToast(t("subs.plans.saved", { planName: selectedPlan.name }));
              } catch (e) {
                pushToast(
                  e instanceof Error ? e.message : t("subs.plans.saveFailed"),
                  "error",
                );
              }
            }}
          />
        )}
      </div>
    </div>
  );
}
