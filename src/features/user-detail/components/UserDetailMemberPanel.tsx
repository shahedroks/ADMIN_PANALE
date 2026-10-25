import { Link } from "react-router-dom";
import { UserDetailActionLogMarker } from "@/components/icons/UserDetailIcons";
import type { UserDetailProfile } from "@/features/user-detail/types";
import { buildUserActionLog } from "@/services/firestore/userDetailFirestoreService";
import type { UserDoc } from "@/services/firestore/usersFirestoreService";
import type { SwapperMember } from "@/features/users/types";

const itemStatusLabel = {
  under_review: "Under review",
  in_swap: "In swap",
  active: "Active",
} as const;

type PanelKind = "reports" | "items" | "log";

type UserDetailMemberPanelProps = {
  panel: PanelKind;
  userId: string;
  member: SwapperMember;
  profile: UserDetailProfile;
  userDoc: UserDoc;
  onClose: () => void;
};

const panelTitles: Record<PanelKind, string> = {
  reports: "Report history",
  items: "Listed items",
  log: "Moderation activity",
};

export function UserDetailMemberPanel({
  panel,
  userId,
  member,
  profile,
  userDoc,
  onClose,
}: UserDetailMemberPanelProps) {
  const fullActions = buildUserActionLog(member.id, userDoc, profile.reports, {
    maxEntries: 50,
  });

  return (
    <section className="user-detail-card user-detail-member-panel" id="member-panel">
      <div className="user-detail-member-panel__head">
        <h2>{panelTitles[panel]} — {profile.name}</h2>
        <button type="button" className="user-detail-member-panel__close" onClick={onClose}>
          Back to profile summary
        </button>
      </div>

      {panel === "reports" && (
        <ul className="user-detail-report-list">
          {profile.reports.length === 0 ? (
            <li>
              <p>No reports filed against this member or their listings.</p>
            </li>
          ) : (
            profile.reports.map((report) => (
              <li key={report.id}>
                <div className="user-detail-report-list__top">
                  <time>{report.date}</time>
                  <span
                    className={
                      report.status === "under_review"
                        ? "user-detail-pill user-detail-pill--compact user-detail-pill--warn"
                        : "user-detail-pill user-detail-pill--compact user-detail-pill--resolved"
                    }
                  >
                    {report.status === "under_review" ? "Under review" : "Dismissed"}
                  </span>
                </div>
                <p>{report.summary}</p>
                <small>{report.actor}</small>
              </li>
            ))
          )}
        </ul>
      )}

      {panel === "items" && (
        <ul className="user-detail-item-list user-detail-item-list--panel">
          {profile.items.length === 0 ? (
            <li>
              <p>No listings published by this member yet.</p>
            </li>
          ) : (
            profile.items.map((item) => (
              <li key={item.id}>
                <Link to={`/items-review/${item.id}`} className="user-detail-item-list__link">
                  <img
                    src={
                      item.thumbnailUrl ??
                      `https://picsum.photos/seed/${item.imageSeed}/96/96`
                    }
                    alt=""
                    width={48}
                    height={48}
                  />
                  <div>
                    <strong>{item.title}</strong>
                    <span>{item.category}</span>
                  </div>
                  <span className={`user-detail-item-status user-detail-item-status--${item.status}`}>
                    <i aria-hidden />
                    {itemStatusLabel[item.status]}
                  </span>
                </Link>
              </li>
            ))
          )}
        </ul>
      )}

      {panel === "log" && (
        <ul className="user-detail-action-list user-detail-action-list--panel">
          {fullActions.map((action) => (
            <li key={action.id}>
              <UserDetailActionLogMarker tone={action.tone} />
              <div>
                <p>{action.text}</p>
                <time>{action.time}</time>
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="user-detail-member-panel__footer">
        {panel === "reports" && (
          <Link to={`/reports?member=${encodeURIComponent(userId)}`} className="user-detail-col__link">
            Open in Reports &amp; Review →
          </Link>
        )}
        {panel === "items" && (
          <Link
            to={`/items-review?owner=${encodeURIComponent(userId)}`}
            className="user-detail-col__link"
          >
            Open in Items Review →
          </Link>
        )}
        {panel === "log" && (
          <Link to="/users" className="user-detail-col__link">
            Open user directory →
          </Link>
        )}
      </div>
    </section>
  );
}
