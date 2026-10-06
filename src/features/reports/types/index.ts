export type ReportPriority = "high" | "medium" | "low";

export type ReportStatus = "under_review" | "open" | "closed";

export type ReportKpi = {
  id: string;
  label: string;
  value: string;
  hint: string;
  hintTone: "positive" | "negative" | "neutral";
  icon: "shield" | "flag" | "timer" | "leaf";
  iconBg: string;
  alert?: boolean;
};

export type ModerationReport = {
  id: string;
  flow: string;
  type: string;
  targetLabel: string;
  targetKind: "item" | "user" | "conversation";
  priority: ReportPriority;
  status: ReportStatus;
  reportedAt: string;
  thumbnailHue: number;
};

export type ReportFilterTab = "all" | "high" | "under_review";
