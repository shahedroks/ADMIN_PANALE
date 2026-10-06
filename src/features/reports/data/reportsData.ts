import type { ModerationReport, ReportKpi } from "@/features/reports/types";

export const reportKpis: ReportKpi[] = [
  {
    id: "incidents",
    label: "Active Incidents",
    value: "28",
    hint: "↓ 14% vs yesterday",
    hintTone: "positive",
    icon: "shield",
  },
  {
    id: "urgency",
    label: "High Urgency",
    value: "06",
    hint: "! Action required <2h",
    hintTone: "negative",
    icon: "flag",
    alert: true,
  },
  {
    id: "resolution",
    label: "Avg Resolution Time",
    value: "3.4 hrs",
    hint: "94% SLA met",
    hintTone: "positive",
    icon: "timer",
  },
  {
    id: "clean",
    label: "Clean Trades MTD",
    value: "99.2%",
    hint: "4,120 transactions",
    hintTone: "neutral",
    icon: "leaf",
  },
];

export const moderationReports: ModerationReport[] = [
  {
    id: "1048",
    flow: "P2P Swap Flow",
    type: "Inappropriate content",
    targetLabel: "Vintage Turntable",
    targetKind: "item",
    priority: "high",
    status: "under_review",
    reportedAt: "Oct 26, 2023 | 10:14 AM",
    thumbnailHue: 28,
  },
  {
    id: "1047",
    flow: "User Safety Flow",
    type: "Scam / fraud risk",
    targetLabel: "Alex M.",
    targetKind: "user",
    priority: "medium",
    status: "open",
    reportedAt: "Oct 26, 2023 | 09:02 AM",
    thumbnailHue: 210,
  },
  {
    id: "1046",
    flow: "Messaging Flow",
    type: "Harassment",
    targetLabel: "Swap #991",
    targetKind: "conversation",
    priority: "low",
    status: "closed",
    reportedAt: "Oct 25, 2023 | 06:45 PM",
    thumbnailHue: 160,
  },
  {
    id: "1045",
    flow: "P2P Swap Flow",
    type: "Counterfeit item",
    targetLabel: "Designer Sneakers",
    targetKind: "item",
    priority: "high",
    status: "open",
    reportedAt: "Oct 25, 2023 | 03:20 PM",
    thumbnailHue: 340,
  },
  {
    id: "1044",
    flow: "Listing Flow",
    type: "Misleading description",
    targetLabel: "Camera Kit",
    targetKind: "item",
    priority: "medium",
    status: "under_review",
    reportedAt: "Oct 25, 2023 | 11:08 AM",
    thumbnailHue: 45,
  },
  {
    id: "1043",
    flow: "User Safety Flow",
    type: "Spam outreach",
    targetLabel: "Jordan K.",
    targetKind: "user",
    priority: "low",
    status: "closed",
    reportedAt: "Oct 24, 2023 | 04:55 PM",
    thumbnailHue: 190,
  },
  {
    id: "1042",
    flow: "P2P Swap Flow",
    type: "No-show exchange",
    targetLabel: "Bookshelf Unit",
    targetKind: "item",
    priority: "medium",
    status: "under_review",
    reportedAt: "Oct 24, 2023 | 01:12 PM",
    thumbnailHue: 25,
  },
  {
    id: "1041",
    flow: "Messaging Flow",
    type: "Threatening language",
    targetLabel: "Swap #880",
    targetKind: "conversation",
    priority: "high",
    status: "open",
    reportedAt: "Oct 23, 2023 | 08:40 PM",
    thumbnailHue: 0,
  },
];

const extraTemplates: Omit<ModerationReport, "id" | "reportedAt">[] = [
  {
    flow: "Listing Flow",
    type: "Duplicate listing",
    targetLabel: "Office Chair",
    targetKind: "item",
    priority: "low",
    status: "closed",
    thumbnailHue: 200,
  },
  {
    flow: "P2P Swap Flow",
    type: "Damaged goods claim",
    targetLabel: "Electric Guitar",
    targetKind: "item",
    priority: "medium",
    status: "under_review",
    thumbnailHue: 15,
  },
  {
    flow: "User Safety Flow",
    type: "Identity mismatch",
    targetLabel: "Taylor R.",
    targetKind: "user",
    priority: "high",
    status: "under_review",
    thumbnailHue: 280,
  },
];

while (moderationReports.length < 28) {
  const i = moderationReports.length;
  const t = extraTemplates[i % extraTemplates.length];
  moderationReports.push({
    ...t,
    id: String(1040 - (i - 8)),
    reportedAt: `Oct ${Math.max(1, 22 - Math.floor(i / 3))}, 2023 | 02:15 PM`,
  });
}

export const filterCounts = {
  all: 28,
  high: 6,
  under_review: 14,
};

export const PAGE_SIZE = 6;
