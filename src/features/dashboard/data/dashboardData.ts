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

export const dashboardMetrics: DashboardMetric[] = [
  {
    id: "matches",
    title: "Matches and Chats",
    value: "1,842",
    delta: "+12%",
    deltaTone: "positive",
    status: "stable",
    statusLabel: "Stable",
    footnote: "vs previous 7 days",
    progressPercent: 72,
    progressColor: "#acf847",
    icon: "chat",
    iconBg: "rgba(172, 248, 71, 0.3)",
  },
  {
    id: "reports",
    title: "Open Reports",
    value: "28",
    delta: "+4 urgent",
    deltaTone: "negative",
    status: "review",
    statusLabel: "Needs review",
    footnote: "Requires manual audit",
    progressPercent: 48,
    progressColor: "#ba1a1a",
    icon: "flag",
    iconBg: "rgba(255, 218, 214, 0.4)",
  },
  {
    id: "items",
    title: "Listed Items",
    value: "6,210",
    delta: "+8.4%",
    deltaTone: "positive",
    status: "stable",
    statusLabel: "Stable",
    footnote: "Circulating inventory",
    progressPercent: 84,
    progressColor: "#0d3b2e",
    icon: "box",
    iconBg: "rgba(190, 237, 217, 0.4)",
  },
  {
    id: "users",
    title: "Active Users",
    value: "14,350",
    delta: "+15.2%",
    deltaTone: "positive",
    status: "stable",
    statusLabel: "Stable",
    footnote: "30-day verified active",
    progressPercent: 91,
    progressColor: "#416900",
    icon: "users",
    iconBg: "#e6eeff",
  },
];

export const platformActivity: ActivityPoint[] = [
  { day: "Mon", users: 9200, items: 4100 },
  { day: "Tue", users: 10400, items: 4500 },
  { day: "Wed", users: 11200, items: 4800 },
  { day: "Thu", users: 11800, items: 5100 },
  { day: "Fri", users: 13820, items: 5940 },
  { day: "Sat", users: 12500, items: 5600 },
  { day: "Sun", users: 10900, items: 5200 },
];

export const activitySummary = {
  dailyAvgActive: "11,490",
  matchConversion: "34.6%",
  avgListingsPerMember: "2.4 items",
};

export const moderationHealth = {
  closedReportsRate: 94,
  closedReportsDelta: "+2.1% SLA increase",
  avgReviewMinutes: 18,
  reviewBenchmark: "12m below benchmark",
  urgentCount: 3,
};
