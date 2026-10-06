import type { DashboardMetric } from "@/features/dashboard/data/dashboardData";

function MetricIcon({ type }: { type: DashboardMetric["icon"] }) {
  const stroke = "#00241A";
  switch (type) {
    case "chat":
      return (
        <svg width="18" height="16" viewBox="0 0 18 16" aria-hidden>
          <path
            d="M1 2h16v10H6l-3 3V2z"
            stroke={stroke}
            fill="none"
            strokeWidth="1.3"
          />
        </svg>
      );
    case "flag":
      return (
        <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden>
          <path d="M3 1v14M3 2h9l-2 2.5L12 7H3" stroke="#BA1A1A" fill="none" strokeWidth="1.3" />
        </svg>
      );
    case "box":
      return (
        <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden>
          <path
            d="M1 5l7-4 7 4v6l-7 4-7-4V5z"
            stroke={stroke}
            fill="none"
            strokeWidth="1.3"
          />
        </svg>
      );
    case "users":
      return (
        <svg width="18" height="14" viewBox="0 0 18 14" aria-hidden>
          <circle cx="6" cy="4" r="2.5" stroke={stroke} fill="none" />
          <path d="M1 13c0-2.8 2.2-4.5 5-4.5s5 1.7 5 4.5" stroke={stroke} fill="none" />
          <circle cx="13" cy="5" r="2" stroke={stroke} fill="none" />
        </svg>
      );
  }
}

type MetricCardProps = {
  metric: DashboardMetric;
};

export function MetricCard({ metric }: MetricCardProps) {
  const deltaClass =
    metric.deltaTone === "negative"
      ? "dash-metric__delta dash-metric__delta--negative"
      : "dash-metric__delta dash-metric__delta--positive";

  const statusClass =
    metric.status === "review"
      ? "dash-metric__status dash-metric__status--review"
      : "dash-metric__status dash-metric__status--stable";

  return (
    <article className="dash-metric">
      <div className="dash-metric__head">
        <div className="dash-metric__icon">
          <MetricIcon type={metric.icon} />
        </div>
        <span className={statusClass}>
          <span className="dash-metric__status-dot" />
          {metric.statusLabel}
        </span>
      </div>
      <h3 className="dash-metric__title">{metric.title}</h3>
      <div className="dash-metric__value-row">
        <strong className="dash-metric__value">{metric.value}</strong>
        <span className={deltaClass}>{metric.delta}</span>
      </div>
      {metric.note && <p className="dash-metric__note">{metric.note}</p>}
    </article>
  );
}
