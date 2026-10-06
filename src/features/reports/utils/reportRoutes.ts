import type { ReviewItem } from "@/features/items-review/types";
import type { ModerationReport } from "@/features/reports/types";
import type { SwapperMember } from "@/features/users/types";

export function resolveReportTargetPath(
  report: ModerationReport,
  reviewItems: ReviewItem[],
  members: SwapperMember[],
): string | null {
  if (report.targetKind === "item") {
    const needle = report.targetLabel.toLowerCase();
    const item =
      reviewItems.find((i) => i.title.toLowerCase().includes(needle.split(" ")[0] ?? "")) ??
      reviewItems.find((i) => needle.includes(i.title.toLowerCase().slice(0, 6))) ??
      reviewItems[0];
    return item ? `/items-review/${item.id}` : null;
  }

  if (report.targetKind === "user") {
    const first = report.targetLabel.split(".")[0]?.split(" ")[0]?.toLowerCase() ?? "";
    const member =
      members.find((m) => m.name.toLowerCase().includes(first)) ??
      members.find((m) => report.targetLabel.includes(m.name.split(" ")[0] ?? "")) ??
      members[0];
    return member ? `/users/${member.id}` : null;
  }

  return null;
}
