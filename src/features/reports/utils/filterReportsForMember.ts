import type { ModerationReport } from "@/features/reports/types";

/** Reports filed against this member or their listings. */
export function filterReportsForMember(
  reports: ModerationReport[],
  memberId: string,
  ownedItemIds: Set<string>,
): ModerationReport[] {
  return reports.filter((report) => {
    if (report.targetKind === "user" && report.targetId === memberId) return true;
    if (report.targetKind === "item" && report.targetId && ownedItemIds.has(report.targetId)) {
      return true;
    }
    return false;
  });
}
