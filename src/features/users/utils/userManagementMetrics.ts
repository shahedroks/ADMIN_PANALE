import type { SwapperMember, UserKpi } from "@/features/users/types";

export type UserWorkflowStats = {
  autoRestrictedCount: number;
  verificationPendingCount: number;
  disputedReportsCount: number;
};

export type UserManagementMetrics = {
  kpis: UserKpi[];
  workflow: UserWorkflowStats;
  activeGoodStandingPercent: number;
};

function formatPercent(numerator: number, denominator: number): number {
  if (denominator <= 0) return 0;
  return Math.round((numerator / denominator) * 1000) / 10;
}

export function buildUserManagementMetrics(
  members: SwapperMember[],
  flaggedIncidents: number,
  newThisWeek = 0,
): UserManagementMetrics {
  const total = members.length;
  const active = members.filter((m) => m.status === "active");
  const restricted = members.filter((m) => m.status === "restricted");
  const verifiedActive = active.filter((m) => m.verified || m.trust === "high" || m.trust === "good");
  const trustPercent = formatPercent(verifiedActive.length, Math.max(active.length, 1));
  const activeGoodStanding = active.filter((m) => m.trust !== "low" && m.trust !== "review");
  const activeGoodStandingPercent = formatPercent(activeGoodStanding.length, Math.max(active.length, 1));

  const autoRestrictedCount = restricted.filter((m) => m.reports >= 3).length;
  const verificationPendingCount = active.filter((m) => !m.verified).length;
  const disputedReportsCount = flaggedIncidents;

  const kpis: UserKpi[] = [
    {
      id: "members",
      label: "Total network members",
      value: total.toLocaleString(),
      hint:
        newThisWeek > 0
          ? `+${newThisWeek.toLocaleString()} this week`
          : "Live platform data",
      hintTone: newThisWeek > 0 ? "positive" : "neutral",
      icon: "members",
      iconBg: "#eff4ff",
    },
    {
      id: "trust",
      label: "Verified trust score",
      value: `${trustPercent}%`,
      hint: "Active members in good standing",
      hintTone: trustPercent >= 90 ? "positive" : "neutral",
      icon: "trust",
      iconBg: "#eff4ff",
    },
    {
      id: "restrict",
      label: "Active restrictions",
      value: restricted.length.toLocaleString(),
      hint: restricted.length > 0 ? "Under moderation" : "No active restrictions",
      hintTone: "neutral",
      icon: "restrict",
      iconBg: "#e6eeff",
    },
    {
      id: "flag",
      label: "Flagged incidents",
      value: flaggedIncidents.toLocaleString(),
      hint:
        flaggedIncidents > 0
          ? "Requires supervisor review"
          : "No open incidents",
      hintTone: flaggedIncidents > 0 ? "negative" : "positive",
      alert: flaggedIncidents > 0,
      icon: "flag",
      iconBg: "rgba(255, 218, 214, 0.55)",
    },
  ];

  return {
    kpis,
    workflow: {
      autoRestrictedCount,
      verificationPendingCount,
      disputedReportsCount,
    },
    activeGoodStandingPercent,
  };
}

export function buildPaginationPages(current: number, total: number): number[] {
  if (total <= 1) return [1];
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const pages = new Set<number>([1, total, current]);
  if (current > 1) pages.add(current - 1);
  if (current < total) pages.add(current + 1);
  if (current > 2) pages.add(current - 2);
  if (current < total - 1) pages.add(current + 2);

  return [...pages].sort((a, b) => a - b);
}
