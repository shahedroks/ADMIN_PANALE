import { useMemo } from "react";
import { MetricCard } from "@/features/dashboard/components/MetricCard";
import { ModerationHealthPanel } from "@/features/dashboard/components/ModerationHealthPanel";
import { PlatformActivityChart } from "@/features/dashboard/components/PlatformActivityChart";
import {
  emptyActivitySummary,
  emptyModerationHealth,
  emptyPlatformActivity,
  skeletonDashboardMetrics,
  type DashboardMetric,
} from "@/features/dashboard/data/dashboardData";
import { useDashboardSnapshot } from "@/hooks/useFirestoreAdminData";
import type { DashboardSnapshot } from "@/services/firestore/dashboardFirestoreService";
import { useDemoStore } from "@/store/demoStore";
import "@/features/dashboard/styles/dashboard.css";

function buildMetricsFromSnapshot(snapshot: DashboardSnapshot): DashboardMetric[] {
  const { counts, metricDeltas } = snapshot;
  const reportsNeedReview = counts.openReports > 0 || counts.urgentOpenReports > 0;

  return skeletonDashboardMetrics.map((base) => {
    switch (base.id) {
      case "matches":
        return {
          ...base,
          value: counts.matchesAndChats.toLocaleString(),
          delta: metricDeltas.matches.delta,
          deltaTone: metricDeltas.matches.deltaTone,
          progressPercent: metricDeltas.matches.progressPercent,
        };
      case "reports":
        return {
          ...base,
          value: counts.openReports.toLocaleString(),
          delta: metricDeltas.reports.delta,
          deltaTone: metricDeltas.reports.deltaTone,
          status: reportsNeedReview ? "review" : "stable",
          statusLabel: reportsNeedReview ? "Needs review" : "Stable",
          footnote: reportsNeedReview ? "Requires manual audit" : "Queue clear",
          progressPercent: metricDeltas.reports.progressPercent,
        };
      case "items":
        return {
          ...base,
          value: counts.approvedItems.toLocaleString(),
          delta: metricDeltas.items.delta,
          deltaTone: metricDeltas.items.deltaTone,
          footnote: `${counts.pendingItems} pending review`,
          progressPercent: metricDeltas.items.progressPercent,
        };
      case "users":
        return {
          ...base,
          value: counts.activeUsers.toLocaleString(),
          delta: metricDeltas.users.delta,
          deltaTone: metricDeltas.users.deltaTone,
          footnote: counts.activeUsersFootnote,
          progressPercent: metricDeltas.users.progressPercent,
        };
      default:
        return base;
    }
  });
}

export function DashboardPage() {
  const { snapshot, reload } = useDashboardSnapshot();
  const { pushToast } = useDemoStore();

  const metrics = useMemo(
    () => (snapshot ? buildMetricsFromSnapshot(snapshot) : skeletonDashboardMetrics),
    [snapshot],
  );

  const activity = snapshot?.activity ?? emptyPlatformActivity;
  const activitySummary = snapshot?.activitySummary ?? emptyActivitySummary;
  const moderation = snapshot?.moderation ?? emptyModerationHealth;

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
          </div>
          <button
            type="button"
            className="dash-page__refresh"
            aria-label="Refresh data"
            onClick={() => {
              void reload();
              pushToast("Dashboard metrics refreshed.", "success");
            }}
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
        {metrics.map((metric) => (
          <MetricCard key={metric.id} metric={metric} />
        ))}
      </div>

      <div className="dash-page__grid">
        <PlatformActivityChart
          data={activity}
          summary={activitySummary}
          onExport={() => pushToast("Chart exported from current view.", "info")}
        />
        <ModerationHealthPanel moderation={moderation} />
      </div>
    </div>
  );
}
