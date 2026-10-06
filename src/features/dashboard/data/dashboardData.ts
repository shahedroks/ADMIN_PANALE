export type MetricStatus = "stable" | "review";

export type DashboardMetric = {
  id: string;
  title: string;
  value: string;
  delta: string;
  deltaTone: "positive" | "negative" | "neutral";
  status: MetricStatus;
  statusLabel: string;
  note?: string;
  icon: "chat" | "flag" | "box" | "users";
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
    icon: "chat",
  },
  {
    id: "reports",
    title: "Open Reports",
    value: "28",
    delta: "+4 urgent",
    deltaTone: "negative",
    status: "review",
    statusLabel: "Needs review",
    note: "Requires manual audit",
    icon: "flag",
  },
  {
    id: "items",
    title: "Listed Items",
    value: "6,210",
    delta: "+8.4%",
    deltaTone: "positive",
    status: "stable",
    statusLabel: "Stable",
    note: "Circulating inventory",
    icon: "box",
  },
  {
    id: "users",
    title: "Active Users",
    value: "14,350",
    delta: "+15.2%",
    deltaTone: "positive",
    status: "stable",
    statusLabel: "Stable",
    note: "30-day verified active",
    icon: "users",
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
