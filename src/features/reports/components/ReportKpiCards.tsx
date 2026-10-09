import {
  ReportKpiLeafIcon,
  ReportKpiShieldIcon,
  ReportKpiTimerIcon,
} from "@/features/reports/components/ReportGlyphs";
import type { ReportKpi } from "@/features/reports/types";
import containerImage from "../../../../doc/Container.png";

function KpiIcon({ type }: { type: ReportKpi["icon"] }) {
  switch (type) {
    case "shield":
      return <ReportKpiShieldIcon className="reports-kpi__glyph" />;
    case "flag":
      return (
        <img
          src={containerImage}
          alt=""
          className="reports-kpi__glyph reports-kpi__glyph--flag"
        />
      );
    case "timer":
      return <ReportKpiTimerIcon className="reports-kpi__glyph" />;
    case "leaf":
      return <ReportKpiLeafIcon className="reports-kpi__glyph" />;
  }
}

type ReportKpiCardsProps = {
  items: ReportKpi[];
};

export function ReportKpiCards({ items }: ReportKpiCardsProps) {
  return (
    <div className="reports-kpis">
      {items.map((kpi) => (
        <article
          key={kpi.id}
          className={`reports-kpi${kpi.alert ? " reports-kpi--alert" : ""}`}
        >
          <div
            className="reports-kpi__icon"
            style={{ background: kpi.iconBg }}
          >
            <KpiIcon type={kpi.icon} />
          </div>
          <p className="reports-kpi__label">{kpi.label}</p>
          <strong className="reports-kpi__value">{kpi.value}</strong>
          <span className={`reports-kpi__hint reports-kpi__hint--${kpi.hintTone}`}>
            {kpi.hint}
          </span>
        </article>
      ))}
    </div>
  );
}
