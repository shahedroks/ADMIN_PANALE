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
import { useI18n } from "@/i18n";
import type { DashboardSnapshot } from "@/services/firestore/dashboardFirestoreService";
import { useDemoStore } from "@/store/demoStore";
import "@/features/dashboard/styles/dashboard.css";

type TranslateFn = (key: string, params?: Record<string, string | number>) => string;

const METRIC_TITLE_KEYS: Record<string, string> = {
  matches: "metric.matches",
  reports: "metric.reports",
  items: "metric.items",
  users: "metric.users",
};

function localizeMetricBase(metric: DashboardMetric, t: TranslateFn): DashboardMetric {
  const titleKey = METRIC_TITLE_KEYS[metric.id];
  let footnote = metric.footnote;
  if (metric.id === "matches") footnote = t("metric.vs7days");
  if (metric.id === "items" && metric.footnote === "Circulating inventory") {
    footnote = t("metric.circulating");
  }
  if (metric.id === "users" && metric.footnote === "30-day verified active") {
    footnote = t("metric.active30d");
  }
  return {
    ...metric,
    title: titleKey ? t(titleKey) : metric.title,
    statusLabel:
      metric.status === "review" ? t("metric.status.needsReview") : t("metric.status.stable"),
    footnote,
  };
}

function buildMetricsFromSnapshot(snapshot: DashboardSnapshot, t: TranslateFn): DashboardMetric[] {
  const { counts, metricDeltas } = snapshot;
  const reportsNeedReview = counts.openReports > 0 || counts.urgentOpenReports > 0;

  return skeletonDashboardMetrics.map((base) => {
    const localized = localizeMetricBase(base, t);
    switch (base.id) {
      case "matches":
        return {
          ...localized,
          value: counts.matchesAndChats.toLocaleString(),
          delta: metricDeltas.matches.delta,
          deltaTone: metricDeltas.matches.deltaTone,
          progressPercent: metricDeltas.matches.progressPercent,
        };
      case "reports":
        return {
          ...localized,
          value: counts.openReports.toLocaleString(),
          delta: metricDeltas.reports.delta,
          deltaTone: metricDeltas.reports.deltaTone,
          status: reportsNeedReview ? "review" : "stable",
          statusLabel: reportsNeedReview
            ? t("metric.status.needsReview")
            : t("metric.status.stable"),
          footnote: reportsNeedReview
            ? t("metric.footnote.requiresAudit")
            : t("metric.footnote.queueClear"),
          progressPercent: metricDeltas.reports.progressPercent,
        };
      case "items":
        return {
          ...localized,
          value: counts.approvedItems.toLocaleString(),
          delta: metricDeltas.items.delta,
          deltaTone: metricDeltas.items.deltaTone,
          footnote: t("metric.footnote.pendingReview", { count: counts.pendingItems }),
          progressPercent: metricDeltas.items.progressPercent,
        };
      case "users":
        return {
          ...localized,
          value: counts.activeUsers.toLocaleString(),
          delta: metricDeltas.users.delta,
          deltaTone: metricDeltas.users.deltaTone,
          footnote: counts.activeUsersFootnote || t("metric.active30d"),
          progressPercent: metricDeltas.users.progressPercent,
        };
      default:
        return localized;
    }
  });
}

export function DashboardPage() {
  const { t } = useI18n();
  const { snapshot, reload } = useDashboardSnapshot();
  const { pushToast } = useDemoStore();

  const metrics = useMemo(
    () =>
      snapshot
        ? buildMetricsFromSnapshot(snapshot, t)
        : skeletonDashboardMetrics.map((m) => localizeMetricBase(m, t)),
    [snapshot, t],
  );

  const activity = snapshot?.activity ?? emptyPlatformActivity;
  const activitySummary = snapshot?.activitySummary ?? emptyActivitySummary;
  const moderation = snapshot?.moderation ?? emptyModerationHealth;

  return (
    <div className="dash-page">
      <header className="dash-page__header">
        <div>
          <p className="dash-page__eyebrow dash-page__eyebrow--eco">
            {t("dashboard.eyebrow")}
            <span className="dash-page__node-inline">
              <i className="dash-page__node-dot" />
              {t("dashboard.node")}
            </span>
          </p>
          <h1>{t("dashboard.title")}</h1>
          <p className="dash-page__subtitle">{t("dashboard.subtitle")}</p>
        </div>
        <div className="dash-page__header-actions">
          <div className="dash-page__live-pill">
            <span className="dash-page__live-dot" />
            {t("dashboard.liveMonitoring")}
          </div>
          <button
            type="button"
            className="dash-page__refresh"
            aria-label={t("dashboard.refresh")}
            onClick={() => {
              void reload();
              pushToast(t("dashboard.toastRefreshed"), "success");
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
          onExport={() => pushToast(t("dashboard.toastChartExported"), "info")}
        />
        <ModerationHealthPanel moderation={moderation} />
      </div>
    </div>
  );
}
