import { useNavigate } from "react-router-dom";
import type { ReviewItem } from "@/features/items-review/types";
import { resolveReportTargetPath } from "@/features/reports/utils/reportRoutes";
import type { ModerationReport } from "@/features/reports/types";
import type { SwapperMember } from "@/features/users/types";
import { useDemoStore } from "@/store/demoStore";

const priorityLabel: Record<ModerationReport["priority"], string> = {
  high: "High",
  medium: "Medium",
  low: "Low",
};

const statusLabel: Record<ModerationReport["status"], string> = {
  under_review: "Under review",
  open: "Open",
  closed: "Closed",
};

const targetPrefix: Record<ModerationReport["targetKind"], string> = {
  item: "Item",
  user: "User",
  conversation: "Conversation",
};

type ReportsTableProps = {
  rows: ModerationReport[];
  reviewItems: ReviewItem[];
  members: SwapperMember[];
  onReview: (id: string) => void;
  onClose: (id: string) => void;
};

export function ReportsTable({ rows, reviewItems, members, onReview, onClose }: ReportsTableProps) {
  const navigate = useNavigate();
  const { pushToast } = useDemoStore();

  function handleOpen(row: ModerationReport) {
    onReview(row.id);
    const path = resolveReportTargetPath(row, reviewItems, members);
    if (path) {
      navigate(path);
      return;
    }
    pushToast(`Conversation ${row.targetLabel} opened in moderation inbox (demo).`, "info");
  }

  return (
    <div className="reports-table-wrap">
      <table className="reports-table">
        <thead>
          <tr>
            <th>Report ID</th>
            <th>Report type &amp; target</th>
            <th>Priority</th>
            <th>Status</th>
            <th>Report date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={6} className="reports-table__empty">
                No reports match your filters.
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr key={row.id}>
                <td>
                  <strong>#{row.id}</strong>
                  <span>{row.flow}</span>
                </td>
                <td>
                  <div className="reports-table__target">
                    <div
                      className="reports-table__thumb"
                      style={{
                        background: `linear-gradient(135deg, hsl(${row.thumbnailHue} 45% 72%), hsl(${row.thumbnailHue} 35% 55%))`,
                      }}
                      aria-hidden
                    />
                    <div>
                      <strong>{row.type}</strong>
                      <span>
                        {targetPrefix[row.targetKind]}: {row.targetLabel}
                      </span>
                    </div>
                  </div>
                </td>
                <td>
                  <span className={`reports-pill reports-pill--${row.priority}`}>
                    {priorityLabel[row.priority]}
                  </span>
                </td>
                <td>
                  <span className={`reports-status reports-status--${row.status}`}>
                    {statusLabel[row.status]}
                  </span>
                </td>
                <td className="reports-table__date">{row.reportedAt}</td>
                <td>
                  <div className="reports-table__actions">
                    <button
                      type="button"
                      className="reports-action reports-action--open"
                      onClick={() => handleOpen(row)}
                    >
                      Open
                    </button>
                    <button
                      type="button"
                      className="reports-action reports-action--review"
                      onClick={() => onReview(row.id)}
                    >
                      Review
                    </button>
                    <button
                      type="button"
                      className="reports-action reports-action--close"
                      onClick={() => onClose(row.id)}
                    >
                      Close
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
