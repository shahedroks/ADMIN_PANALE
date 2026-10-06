import { useState } from "react";
import type { ItemDetail } from "@/features/item-detail/types";
import { useDemoStore } from "@/store/demoStore";

type ItemDetailAdjudicationPanelProps = {
  detail: ItemDetail;
  itemRouteId: string;
};

export function ItemDetailAdjudicationPanel({
  detail,
  itemRouteId,
}: ItemDetailAdjudicationPanelProps) {
  const { approveReviewItem, hideReviewItem, requestEditReviewItem, pushToast } = useDemoStore();
  const [editNote, setEditNote] = useState(detail.suggestedEditNote);
  const [auditNote, setAuditNote] = useState("");
  const [notifyOwner, setNotifyOwner] = useState(true);

  return (
    <aside className="item-detail-side">
      <section className="item-detail-card item-detail-adjudication">
        <div className="item-detail-adjudication__head">
          <h2>Take adjudication</h2>
          <span className="item-detail-pending">
            <i /> Decision pending
          </span>
        </div>

        <p className="item-detail-adjudication__hint">Suggested path</p>
        <button
          type="button"
          className="item-detail-btn item-detail-btn--suggest"
          onClick={() => requestEditReviewItem(itemRouteId, editNote)}
        >
          Request edit from owner
        </button>
        <textarea
          className="item-detail-textarea"
          value={editNote}
          onChange={(e) => setEditNote(e.target.value)}
          rows={4}
          aria-label="Edit request message"
        />

        <button
          type="button"
          className="item-detail-btn item-detail-btn--approve"
          onClick={() => approveReviewItem(itemRouteId)}
        >
          <svg viewBox="0 0 18 18" aria-hidden>
            <circle
              cx="9"
              cy="9"
              r="6.75"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.35"
            />
            <path
              d="m5.9 9 2 2 4.2-4.2"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.35"
            />
          </svg>
          Approve listing (Dismiss flag)
        </button>
        <button
          type="button"
          className="item-detail-btn item-detail-btn--hide"
          onClick={() => hideReviewItem(itemRouteId)}
        >
          <svg viewBox="0 0 18 18" aria-hidden>
            <path
              d="M2.1 9s2.5-4.1 6.9-4.1S15.9 9 15.9 9 13.4 13.1 9 13.1 2.1 9 2.1 9Z"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.35"
            />
            <circle
              cx="9"
              cy="9"
              r="2.1"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.35"
            />
            <path
              d="m3 3 12 12"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeWidth="1.5"
            />
          </svg>
          Hide item from feed (Direct takedown)
        </button>

        <label className="item-detail-section-label" htmlFor="audit-note">
          Internal justification / moderation audit note
        </label>
        <textarea
          id="audit-note"
          className="item-detail-textarea"
          value={auditNote}
          onChange={(e) => setAuditNote(e.target.value)}
          rows={3}
          placeholder="Document rationale for compliance archive…"
        />

        <label className="item-detail-check">
          <input
            type="checkbox"
            checked={notifyOwner}
            onChange={(e) => setNotifyOwner(e.target.checked)}
          />
          Send automated compliance notification to {detail.owner.name}
        </label>

        <button
          type="button"
          className="item-detail-escalate"
          onClick={() => pushToast("Escalation queued for senior admin review.", "info")}
        >
          Escalate to Senior Admin / Legal Supervisor
        </button>
        <p className="item-detail-sla">SLA: 4h left</p>

        <div className="item-detail-audit-bar">
          Audit session active: logged as Sara Miller
        </div>
      </section>

      <section className="item-detail-card item-detail-policy">
        <h3>{detail.ruleReference.title}</h3>
        <p>{detail.ruleReference.body}</p>
      </section>
    </aside>
  );
}
