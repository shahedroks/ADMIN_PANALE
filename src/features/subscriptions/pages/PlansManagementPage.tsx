import { useEffect, useMemo, useState } from "react";
import { PlansFeatureGateBanner } from "@/features/subscriptions/components/plans/PlansFeatureGateBanner";
import { PlanEditorPanel } from "@/features/subscriptions/components/plans/PlanEditorPanel";
import { PlansListPanel } from "@/features/subscriptions/components/plans/PlansListPanel";
import { PlansSummaryKpis } from "@/features/subscriptions/components/plans/PlansSummaryKpis";
import { SubscriptionsComingSoon } from "@/features/subscriptions/components/SubscriptionsComingSoon";
import { SUBSCRIPTIONS_UI_VISIBLE } from "@/features/subscriptions/config/subscriptionsVisibility";
import { useSubscriptionPlans } from "@/hooks/useSubscriptionPlans";
import { useToast } from "@/store/toastStore";
import "@/features/dashboard/styles/dashboard.css";
import "@/features/subscriptions/styles/subscriptions-coming-soon.css";
import "@/features/subscriptions/styles/subscriptions-page.css";
import "@/features/subscriptions/styles/plans-management.css";

export function PlansManagementPage() {
  if (!SUBSCRIPTIONS_UI_VISIBLE) {
    return <SubscriptionsComingSoon variant="plans" />;
  }

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
      {loading && <p>Loading subscription plans…</p>}
      {error && <p role="alert">{error}</p>}
      <header className="plans-page__header">
        <div className="plans-page__intro">
          <p className="subscriptions-page__breadcrumb">
            Subscriptions <span aria-hidden>›</span> Plans Management
          </p>
          <div className="plans-page__title-row">
            <h1>Plans &amp; Tier Configuration</h1>
            <span className="plans-page__engine-badge">Engine v2.4</span>
          </div>
          <p className="subscriptions-page__subtitle">
            Manage marketplace membership tiers, pricing models, listing quotas, and entitlement
            gates for the SWAP IT subscription suite.
          </p>
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
                pushToast(`${selectedPlan.name} saved successfully.`);
              } catch (e) {
                pushToast(
                  e instanceof Error ? e.message : "Could not save plan.",
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
