import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { ItemDetail } from "@/features/item-detail/types";
import { auth } from "@/lib/firebase";
import { callModerateItem } from "@/lib/callableFunctions";
import { moderateItemFirestore } from "@/services/firestore/itemsModerationFirestoreService";
import { writeAuditLogClient } from "@/services/firestore/auditLogFirestoreService";
import { useI18n } from "@/i18n";
import { useToast } from "@/store/toastStore";

type ItemDetailAdjudicationPanelProps = {
  detail: ItemDetail;
  itemRouteId: string;
};

export function ItemDetailAdjudicationPanel({
  detail,
  itemRouteId,
}: ItemDetailAdjudicationPanelProps) {
  const { t } = useI18n();
  const navigate = useNavigate();
  const { pushToast } = useToast();
  const [editNote, setEditNote] = useState(detail.suggestedEditNote);
  const [auditNote, setAuditNote] = useState("");
  const [notifyOwner, setNotifyOwner] = useState(true);
  const [busy, setBusy] = useState(false);

  const moderatorLabel =
    auth.currentUser?.displayName ??
    auth.currentUser?.email ??
    t("role.admin");

  async function runModeration(
    action: "approve" | "hide" | "reject" | "request_edit",
    note?: string,
  ) {
    setBusy(true);
    const moderatorUid = auth.currentUser?.uid;
    try {
      try {
        await callModerateItem({ itemId: itemRouteId, action, note });
      } catch {
        await moderateItemFirestore(itemRouteId, action, note, moderatorUid);
      }
      pushToast(t("adjudication.toastSaved"), "success");
      if (action === "approve" || action === "hide") {
        navigate("/items-review");
      }
    } catch (e) {
      pushToast(e instanceof Error ? e.message : t("adjudication.toastFailed"), "error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <aside className="item-detail-side">
      <section className="item-detail-card item-detail-adjudication">
        <div className="item-detail-adjudication__head">
          <h2>{t("adjudication.title")}</h2>
          <span className="item-detail-pending">
            <i />{" "}
            {detail.statusLabel === "PENDING" ? t("adjudication.pending") : detail.statusLabel}
          </span>
        </div>

        <p className="item-detail-adjudication__hint">{t("adjudication.suggested")}</p>
        <button
          type="button"
          className="item-detail-btn item-detail-btn--suggest"
          disabled={busy}
          onClick={() => void runModeration("request_edit", editNote)}
        >
          {t("adjudication.requestEdit")}
        </button>
        <textarea
          className="item-detail-textarea"
          value={editNote}
          onChange={(e) => setEditNote(e.target.value)}
          rows={4}
          aria-label={t("adjudication.editAria")}
        />

        <button
          type="button"
          className="item-detail-btn item-detail-btn--approve"
          disabled={busy}
          onClick={() => void runModeration("approve", auditNote || undefined)}
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
          {t("adjudication.approve")}
        </button>
        <button
          type="button"
          className="item-detail-btn item-detail-btn--hide"
          disabled={busy}
          onClick={() => void runModeration("hide", auditNote || undefined)}
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
          {t("adjudication.hide")}
        </button>

        <label className="item-detail-section-label" htmlFor="audit-note">
          {t("adjudication.auditLabel")}
        </label>
        <textarea
          id="audit-note"
          className="item-detail-textarea"
          value={auditNote}
          onChange={(e) => setAuditNote(e.target.value)}
          rows={3}
          placeholder={t("adjudication.auditPlaceholder")}
        />

        <label className="item-detail-check">
          <input
            type="checkbox"
            checked={notifyOwner}
            onChange={(e) => setNotifyOwner(e.target.checked)}
            disabled
          />
          {t("adjudication.notify", {
            state: notifyOwner ? t("adjudication.planned") : t("adjudication.off"),
            ownerName: detail.owner.name,
          })}
        </label>

        <button
          type="button"
          className="item-detail-escalate"
          onClick={() => {
            void writeAuditLogClient({
              action: "item_escalate",
              targetType: "item",
              targetId: itemRouteId,
              note: auditNote || t("adjudication.escalationNote"),
            }).then(() => pushToast(t("adjudication.toastEscalated"), "info"));
          }}
        >
          {t("adjudication.escalate")}
        </button>

        <div className="item-detail-audit-bar">
          {t("adjudication.session", { moderator: moderatorLabel, itemId: itemRouteId })}
        </div>
      </section>

      <section className="item-detail-card item-detail-policy">
        <h3>{detail.ruleReference.title}</h3>
        <p>{detail.ruleReference.body}</p>
      </section>
    </aside>
  );
}
