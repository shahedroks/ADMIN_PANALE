import {
  PlanBanknoteIcon,
  PlanPriceTagIcon,
  PlanRecycleIcon,
  PlanVerifiedBadgeIcon,
} from "@/components/kpi-icons/FigmaMetricIcons";
import type { PlanSummaryKpiIcon } from "@/features/subscriptions/data/plansManagementData";
import { useDemoStore } from "@/store/demoStore";

function KpiGlyph({ type }: { type: PlanSummaryKpiIcon }) {
  switch (type) {
    case "tag":
      return <PlanPriceTagIcon className="plans-kpi__glyph" />;
    case "cash":
      return <PlanBanknoteIcon className="plans-kpi__glyph" />;
    case "cycle":
      return <PlanRecycleIcon className="plans-kpi__glyph" />;
    case "verified":
      return <PlanVerifiedBadgeIcon className="plans-kpi__glyph plans-kpi__glyph--verified" />;
  }
}

export function PlansSummaryKpis() {
  const { subscriptionPlanKpis } = useDemoStore();
  return (
    <div className="plans-kpis">
      {subscriptionPlanKpis.map((kpi) => (
        <article key={kpi.id} className="plans-kpi">
          <div>
            <p className="plans-kpi__label">{kpi.label}</p>
            <strong className="plans-kpi__value">{kpi.value}</strong>
            <span
              className={
                kpi.hintTone === "positive"
                  ? "plans-kpi__hint plans-kpi__hint--positive"
                  : "plans-kpi__hint"
              }
            >
              {kpi.hint}
            </span>
          </div>
          <span className="plans-kpi__icon" style={{ background: kpi.iconBg }}>
            <KpiGlyph type={kpi.icon} />
          </span>
        </article>
      ))}
    </div>
  );
}
