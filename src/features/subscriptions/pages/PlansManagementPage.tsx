import { useMemo, useState } from "react";
import { PlansFeatureGateBanner } from "@/features/subscriptions/components/plans/PlansFeatureGateBanner";
import { PlanEditorPanel } from "@/features/subscriptions/components/plans/PlanEditorPanel";
import { PlansListPanel } from "@/features/subscriptions/components/plans/PlansListPanel";
import { PlansSummaryKpis } from "@/features/subscriptions/components/plans/PlansSummaryKpis";
import { SubscriptionsComingSoon } from "@/features/subscriptions/components/SubscriptionsComingSoon";
import { SUBSCRIPTIONS_UI_VISIBLE } from "@/features/subscriptions/config/subscriptionsVisibility";
import { useDemoStore } from "@/store/demoStore";
import "@/features/dashboard/styles/dashboard.css";
import "@/features/subscriptions/styles/subscriptions-coming-soon.css";
import "@/features/subscriptions/styles/subscriptions-page.css";
import "@/features/subscriptions/styles/plans-management.css";

export function PlansManagementPage() {
  if (!SUBSCRIPTIONS_UI_VISIBLE) {
    return <SubscriptionsComingSoon variant="plans" />;
  }

  const { pushToast, subscriptionPlans, updateSubscriptionPlan } = useDemoStore();
  const [selectedId, setSelectedId] = useState(() => subscriptionPlans[0]?.id ?? "");
  const [editorOpen, setEditorOpen] = useState(true);

  const selectedPlan = useMemo(
    () => subscriptionPlans.find((p) => p.id === selectedId) ?? subscriptionPlans[0],
    [selectedId, subscriptionPlans],
  );

  return (
    <div className="dash-page plans-page">
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
        <div className="plans-page__actions">
          <button
            type="button"
            className="plans-btn plans-btn--outline"
            onClick={() => pushToast("Reorder priority mode opened (demo).", "info")}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden>
              <path d="M2 3h10M2 7h10M2 11h10" stroke="currentColor" strokeWidth="1.2" />
            </svg>
            Reorder Priority
          </button>
          <button
            type="button"
            className="plans-btn plans-btn--primary"
            onClick={() => pushToast("Create new plan wizard opened (demo).")}
          >
            + Create New Plan
          </button>
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
            onSave={(patch) => updateSubscriptionPlan(selectedPlan.id, patch)}
          />
        )}
      </div>
    </div>
  );
}
