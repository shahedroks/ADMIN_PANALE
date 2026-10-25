import { useNavigate } from "react-router-dom";
import { resolveReportTargetPath } from "@/features/reports/utils/reportRoutes";
import type { ModerationReport } from "@/features/reports/types";
import { useToast } from "@/store/toastStore";

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

function getReportThumbnail(row: ModerationReport) {
  const seed = encodeURIComponent(`${row.targetLabel}-${row.id}`);
  return row.targetKind === "user"
    ? `https://i.pravatar.cc/96?u=${seed}`
    : `https://picsum.photos/seed/${seed}/96/96`;
}

type ReportsTableProps = {
  rows: ModerationReport[];
  onReview: (id: string) => void;
  onClose: (id: string) => void;
};

export function ReportsTable({ rows, onReview, onClose }: ReportsTableProps) {
  const navigate = useNavigate();
  const { pushToast } = useToast();

  function handleOpen(row: ModerationReport) {
    onReview(row.id);
    const path = resolveReportTargetPath(row);
    if (path) {
      navigate(path);
      return;
    }
    if (row.targetKind === "conversation") {
      pushToast(`Conversation report ${row.id} — link chat moderation when chat admin ships.`, "info");
      return;
    }
    pushToast("Report has no targetId — cannot open target.", "error");
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
                    <img
                      className="reports-table__thumb"
                      src={getReportThumbnail(row)}
                      alt={`${row.targetLabel} thumbnail`}
                    />
                    <div>
                      <strong>{row.type}</strong>
                      <span>
                        {targetPrefix[row.targetKind]}: {row.targetLabel}
                        {row.targetId ? ` (${row.targetId.slice(0, 8)}…)` : ""}
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
                  <span className={`reports-pill reports-pill--status-${row.status}`}>
                    {statusLabel[row.status]}
                  </span>
                </td>
                <td>{new Date(row.reportedAt).toLocaleDateString()}</td>
                <td>
                  <div className="reports-table__actions">
                    <button type="button" onClick={() => handleOpen(row)}>
                      Open
                    </button>
                    <button type="button" onClick={() => onClose(row.id)}>
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
