import { Link } from "react-router-dom";
import {
  emptyModerationHealth,
  type ModerationHealthView,
} from "@/features/dashboard/data/dashboardData";

type ModerationHealthPanelProps = {
  moderation?: ModerationHealthView;
};

export function ModerationHealthPanel({ moderation = emptyModerationHealth }: ModerationHealthPanelProps) {
  const badge =
    moderation.urgentCount > 0
      ? "Attention"
      : moderation.closedReportsRate >= 80
        ? "Optimal"
        : "Monitoring";

  const reviewBarWidth =
    moderation.avgReviewMinutes > 0
      ? Math.min(100, Math.round((30 / moderation.avgReviewMinutes) * 72))
      : 0;

  return (
    <aside className="dash-mod-panel">
      <div className="dash-mod-panel__head">
        <div className="dash-mod-panel__title">
          <svg width="14" height="17" viewBox="0 0 14 17" aria-hidden>
            <path d="M7 1L1 4v5c0 4 2.5 7.7 6 9 3.5-1.3 6-5 6-9V4L7 1z" fill="#0D3B2E" />
          </svg>
          <h2>Moderation Health</h2>
        </div>
        <span className="dash-mod-panel__badge">{badge}</span>
      </div>
      <p className="dash-mod-panel__sub">Operational performance and SLA compliance.</p>

      <div className="dash-mod-metric">
        <div className="dash-mod-metric__row">
          <span>Closed reports rate</span>
          <span className="dash-mod-metric__stable">
            <i /> Stable
          </span>
        </div>
        <strong className="dash-mod-metric__value">{moderation.closedReportsRate}%</strong>
        <div className="dash-mod-metric__bar">
          <span style={{ width: `${moderation.closedReportsRate}%` }} />
        </div>
        <p className="dash-mod-metric__hint">{moderation.closedReportsDelta}</p>
      </div>

      <div className="dash-mod-metric">
        <div className="dash-mod-metric__row">
          <span>Average review time</span>
          <span className="dash-mod-metric__stable">
            <i /> Stable
          </span>
        </div>
        <strong className="dash-mod-metric__value">
          {moderation.avgReviewMinutes > 0
            ? `${moderation.avgReviewMinutes} minutes`
            : "—"}
        </strong>
        <div className="dash-mod-metric__bar dash-mod-metric__bar--blue">
          <span style={{ width: `${reviewBarWidth}%` }} />
        </div>
        <p className="dash-mod-metric__hint">{moderation.reviewBenchmark}</p>
      </div>

      {moderation.urgentCount > 0 && (
        <div className="dash-mod-alert">
          <div className="dash-mod-alert__icon">
            <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden>
              <path d="M8 1l7 13H1L8 1z" stroke="#BA1A1A" fill="none" />
              <path d="M8 6v4M8 12h.01" stroke="#BA1A1A" />
            </svg>
          </div>
          <div>
            <strong>Urgent Escalation</strong>
            <p>
              {moderation.urgentCount} high priority user reports require immediate
              verification.
            </p>
            <Link to="/reports" className="dash-mod-alert__link">
              Review now →
            </Link>
          </div>
        </div>
      )}
    </aside>
  );
}
