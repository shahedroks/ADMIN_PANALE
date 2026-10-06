import type { ReportKpi } from "@/features/reports/types";

function KpiIcon({ type }: { type: ReportKpi["icon"] }) {
  switch (type) {
    case "shield":
      return (
        <svg width="20" height="22" viewBox="0 0 20 22" aria-hidden>
          <path d="M10 1L2 4v6c0 5 3.5 9.6 8 11 4.5-1.4 8-6 8-11V4L10 1z" fill="#DEE9FC" stroke="#00241A" strokeWidth="1" />
        </svg>
      );
    case "flag":
      return (
        <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden>
          <path d="M3 1v16M3 2h10l-2 3 2 3H3" stroke="#BA1A1A" fill="none" strokeWidth="1.4" />
        </svg>
      );
    case "timer":
      return (
        <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden>
          <circle cx="10" cy="11" r="7" stroke="#00241A" fill="#DEE9FC" strokeWidth="1.2" />
          <path d="M10 7v4l2.5 2.5M10 3V1M6 1h8" stroke="#00241A" strokeWidth="1.2" />
        </svg>
      );
    case "leaf":
      return (
        <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden>
          <circle cx="10" cy="10" r="9" fill="rgba(172,248,71,0.35)" />
          <path d="M10 14c-4-2-5-6-5-8 2 0 4 1 5 3 1-2 3-3 5-3-0 2-1 6-5 8z" fill="#304F00" />
        </svg>
      );
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
          <div className="reports-kpi__icon">
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
