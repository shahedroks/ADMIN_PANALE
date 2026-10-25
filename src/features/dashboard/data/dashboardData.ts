export type MetricStatus = "stable" | "review";

export type DashboardMetric = {
  id: string;
  title: string;
  value: string;
  delta: string;
  deltaTone: "positive" | "negative" | "neutral";
  status: MetricStatus;
  statusLabel: string;
  footnote: string;
  progressPercent: number;
  progressColor: string;
  icon: "chat" | "flag" | "box" | "users";
  iconBg: string;
};

export type ActivityPoint = {
  day: string;
  users: number;
  items: number;
};

export type ActivitySummary = {
  dailyAvgActive: string;
  matchConversion: string;
  avgListingsPerMember: string;
};

export type ModerationHealthView = {
  closedReportsRate: number;
  closedReportsDelta: string;
  avgReviewMinutes: number;
  reviewBenchmark: string;
  urgentCount: number;
};

const emptyWeek: ActivityPoint[] = [
  { day: "Mon", users: 0, items: 0 },
  { day: "Tue", users: 0, items: 0 },
  { day: "Wed", users: 0, items: 0 },
  { day: "Thu", users: 0, items: 0 },
  { day: "Fri", users: 0, items: 0 },
  { day: "Sat", users: 0, items: 0 },
  { day: "Sun", users: 0, items: 0 },
];

export const emptyActivitySummary: ActivitySummary = {
  dailyAvgActive: "0",
  matchConversion: "—",
  avgListingsPerMember: "—",
};

export const emptyModerationHealth: ModerationHealthView = {
  closedReportsRate: 0,
  closedReportsDelta: "Loading…",
  avgReviewMinutes: 0,
  reviewBenchmark: "—",
  urgentCount: 0,
};

export const skeletonDashboardMetrics: DashboardMetric[] = [
  {
    id: "matches",
    title: "Matches and Chats",
    value: "—",
    delta: "—",
    deltaTone: "neutral",
    status: "stable",
    statusLabel: "Stable",
    footnote: "vs previous 7 days",
    progressPercent: 0,
    progressColor: "var(--swapit-accent)",
    icon: "chat",
    iconBg: "rgba(163, 114, 34, 0.3)",
  },
  {
    id: "reports",
    title: "Open Reports",
    value: "—",
    delta: "—",
    deltaTone: "neutral",
    status: "stable",
    statusLabel: "Stable",
    footnote: "Requires manual audit",
    progressPercent: 0,
    progressColor: "#ba1a1a",
    icon: "flag",
    iconBg: "rgba(255, 218, 214, 0.4)",
  },
  {
    id: "items",
    title: "Listed Items",
    value: "—",
    delta: "—",
    deltaTone: "neutral",
    status: "stable",
    statusLabel: "Stable",
    footnote: "Circulating inventory",
    progressPercent: 0,
    progressColor: "#0d3b2e",
    icon: "box",
    iconBg: "rgba(190, 237, 217, 0.4)",
  },
  {
    id: "users",
    title: "Active Users",
    value: "—",
    delta: "—",
    deltaTone: "neutral",
    status: "stable",
    statusLabel: "Stable",
    footnote: "30-day verified active",
    progressPercent: 0,
    progressColor: "var(--swapit-primary-dark)",
    icon: "users",
    iconBg: "#e6eeff",
  },
];

export const emptyPlatformActivity = emptyWeek;
