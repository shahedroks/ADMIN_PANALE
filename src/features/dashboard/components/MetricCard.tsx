import {
  DashBoxIcon,
  DashChatIcon,
  DashFlagIcon,
  DashUsersIcon,
} from "@/components/kpi-icons/FigmaMetricIcons";
import type { DashboardMetric } from "@/features/dashboard/data/dashboardData";

function MetricIcon({ type }: { type: DashboardMetric["icon"] }) {
  switch (type) {
    case "chat":
      return <DashChatIcon className="dash-metric__glyph dash-metric__glyph--chat" />;
    case "flag":
      return <DashFlagIcon className="dash-metric__glyph dash-metric__glyph--flag" />;
    case "box":
      return <DashBoxIcon className="dash-metric__glyph dash-metric__glyph--box" />;
    case "users":
      return <DashUsersIcon className="dash-metric__glyph dash-metric__glyph--users" />;
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

  const footnoteClass =
    metric.status === "review"
      ? "dash-metric__footnote dash-metric__footnote--audit"
      : "dash-metric__footnote";

  return (
    <article className="dash-metric">
      <div className="dash-metric__head">
        <div
          className={`dash-metric__icon dash-metric__icon--${metric.icon}`}
          style={{ background: metric.iconBg }}
        >
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
        <span className={deltaClass}>
          {metric.deltaTone === "positive" && (
            <span className="dash-metric__delta-arrow" aria-hidden>
              ↑{" "}
            </span>
          )}
          {metric.delta}
        </span>
      </div>
      <div className="dash-metric__progress" aria-hidden>
        <span
          className="dash-metric__progress-fill"
          style={{
            width: `${metric.progressPercent}%`,
            background: metric.progressColor,
          }}
        />
      </div>
      <p className={footnoteClass}>{metric.footnote}</p>
    </article>
  );
}
