import type { ModerationReport } from "@/features/reports/types";

export function resolveReportTargetPath(report: ModerationReport): string | null {
  const targetId = report.targetId?.trim() ?? "";
  if (!targetId) return null;

  if (report.targetKind === "item") {
    return `/items-review/${targetId}`;
  }
  if (report.targetKind === "user") {
    return `/users/${targetId}`;
  }
  return null;
}
