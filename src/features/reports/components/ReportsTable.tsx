import { useNavigate } from "react-router-dom";
import { resolveReportTargetPath } from "@/features/reports/utils/reportRoutes";
import type { ModerationReport } from "@/features/reports/types";
import { useI18n } from "@/i18n";
import { useToast } from "@/store/toastStore";

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
  const { t } = useI18n();
  const navigate = useNavigate();
  const { pushToast } = useToast();

  const priorityLabel: Record<ModerationReport["priority"], string> = {
    high: t("priority.high"),
    medium: t("priority.medium"),
    low: t("priority.low"),
  };

  const statusLabel: Record<ModerationReport["status"], string> = {
    under_review: t("status.underReview"),
    open: t("status.open"),
    closed: t("status.closed"),
  };

  const targetPrefix: Record<ModerationReport["targetKind"], string> = {
    item: t("target.item"),
    user: t("target.user"),
    conversation: t("target.conversation"),
  };

  function handleOpen(row: ModerationReport) {
    onReview(row.id);
    const path = resolveReportTargetPath(row);
    if (path) {
      navigate(path);
      return;
    }
    if (row.targetKind === "conversation") {
      pushToast(t("reports.toast.chatPending", { id: row.id }), "info");
      return;
    }
    pushToast(t("reports.toast.noTarget"), "error");
  }

  return (
    <div className="reports-table-wrap">
      <table className="reports-table">
        <thead>
          <tr>
            <th>{t("reports.col.id")}</th>
            <th>{t("reports.col.type")}</th>
            <th>{t("reports.col.priority")}</th>
            <th>{t("reports.col.status")}</th>
            <th>{t("reports.col.date")}</th>
            <th>{t("reports.col.action")}</th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={6} className="reports-table__empty">
                {t("reports.empty")}
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
                      alt={t("reports.thumbnail", { label: row.targetLabel })}
                    />
                    <div>
                      <strong>{row.type}</strong>
                      <span>
                        {t("target.line", {
                          kind: targetPrefix[row.targetKind],
                          label: row.targetLabel,
                        })}
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
                      {t("reports.action.open")}
                    </button>
                    <button type="button" onClick={() => onClose(row.id)}>
                      {t("reports.action.close")}
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
