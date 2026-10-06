import { MetricCard } from "@/features/dashboard/components/MetricCard";
import { ModerationHealthPanel } from "@/features/dashboard/components/ModerationHealthPanel";
import { PlatformActivityChart } from "@/features/dashboard/components/PlatformActivityChart";
import {
  dashboardMetrics,
  platformActivity,
} from "@/features/dashboard/data/dashboardData";
import { useDemoStore } from "@/store/demoStore";
import "@/features/dashboard/styles/dashboard.css";

export function DashboardPage() {
  const { refreshDashboard, pushToast } = useDemoStore();
  return (
    <div className="dash-page">
      <header className="dash-page__header">
        <div>
          <p className="dash-page__eyebrow dash-page__eyebrow--eco">
            Safe swapping ecosystem
            <span className="dash-page__node-inline">
              <i className="dash-page__node-dot" />
              Node: Alpha-Global
            </span>
          </p>
          <h1>Dashboard Overview</h1>
          <p className="dash-page__subtitle">Admin control center — safe swapping first</p>
        </div>
        <div className="dash-page__header-actions">
          <div className="dash-page__live-pill">
            <span className="dash-page__live-dot" />
            Live monitoring
            <span className="dash-page__muted">Updated 2m ago</span>
          </div>
          <button
            type="button"
            className="dash-page__refresh"
            aria-label="Refresh data"
            onClick={refreshDashboard}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden>
              <path
                d="M12 7A5 5 0 1 1 7 2v2M7 1v3h3"
                stroke="currentColor"
                fill="none"
                strokeWidth="1.2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
      </header>

      <div className="dash-metrics">
        {dashboardMetrics.map((metric) => (
          <MetricCard key={metric.id} metric={metric} />
        ))}
      </div>

      <div className="dash-page__grid">
        <PlatformActivityChart
          data={platformActivity}
          onExport={() => pushToast("Platform activity chart exported (demo).", "info")}
        />
        <ModerationHealthPanel />
      </div>
    </div>
  );
}
