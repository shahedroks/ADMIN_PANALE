import { useState } from "react";
import { Link } from "react-router-dom";
import {
  UserDetailActionLogMarker,
  UserDetailColumnIcon,
  UserDetailSaveIcon,
  UserDetailShieldIcon,
} from "@/components/icons/UserDetailIcons";
import type { UserDetailProfile } from "@/features/user-detail/types";
import { useDemoStore, type UserRestrictionSettings } from "@/store/demoStore";

const itemStatusLabel = {
  under_review: "Under review",
  in_swap: "In swap",
  active: "Active",
} as const;

type UserDetailColumnsProps = {
  profile: UserDetailProfile;
  userId: string;
};

export function UserDetailColumns({ profile, userId }: UserDetailColumnsProps) {
  return (
    <>
    <div className="user-detail-columns">
      <section className="user-detail-card user-detail-col">
        <div className="user-detail-col__head">
          <h2>
            <UserDetailColumnIcon type="report" /> Report History
          </h2>
          <span className="user-detail-col__count user-detail-col__count--warn">
            {profile.reports.length} total
          </span>
        </div>
        <ul className="user-detail-report-list">
          {profile.reports.map((report) => (
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
          ))}
        </ul>
        <Link to="/reports" className="user-detail-col__link">
          View all reports →
        </Link>
      </section>

      <section className="user-detail-card user-detail-col">
        <div className="user-detail-col__head">
          <h2>
            <UserDetailColumnIcon type="items" /> Listed Items
          </h2>
          <span className="user-detail-col__count">12 total</span>
        </div>
        <ul className="user-detail-item-list">
          {profile.items.map((item) => (
            <li key={item.id}>
              <img
                src={`https://picsum.photos/seed/${item.imageSeed}/96/96`}
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
            </li>
          ))}
        </ul>
        <Link to="/items-review" className="user-detail-col__link">
          View all items (12) →
        </Link>
      </section>

      <section className="user-detail-card user-detail-col">
        <div className="user-detail-col__head">
          <h2>
            <UserDetailColumnIcon type="actions" /> Action Log
          </h2>
          <span className="user-detail-col__count">
            {Math.max(profile.actions.length, 8)} events
          </span>
        </div>
        <ul className="user-detail-action-list">
          {profile.actions.map((action) => (
            <li key={action.id}>
              <UserDetailActionLogMarker tone={action.tone} />
              <div>
                <p>{action.text}</p>
                <time>{action.time}</time>
              </div>
            </li>
          ))}
        </ul>
        <Link to="/users" className="user-detail-col__link">
          View all actions ({Math.max(profile.actions.length, 8)}) →
        </Link>
      </section>
    </div>

    <UserDetailRestrictionPanel userId={userId} />
    </>
  );
}

function UserDetailRestrictionPanel({ userId }: { userId: string }) {
  const { userSettings, saveUserSettings } = useDemoStore();
  const initial = userSettings[userId] ?? {
    manualReview: true,
    allowChat: true,
    allowListings: true,
    durationDays: "7",
    note: "",
  };

  const [settings, setSettings] = useState<UserRestrictionSettings>(initial);

  function update<K extends keyof UserRestrictionSettings>(key: K, value: UserRestrictionSettings[K]) {
    setSettings((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <section className="user-detail-card user-detail-restrict">
      <div className="user-detail-col__head">
        <h2>
          <UserDetailShieldIcon />
          Restriction &amp; Ban Settings
        </h2>
        <span className="user-detail-pill user-detail-pill--muted">Policy v2.4</span>
      </div>

      <label className="user-detail-toggle-row">
        <span>
          <strong>Manual report review</strong>
          <small>Require supervisor approval on new reports</small>
        </span>
        <span className="user-detail-switch">
          <input
            type="checkbox"
            checked={settings.manualReview}
            onChange={(e) => update("manualReview", e.target.checked)}
          />
          <span className="user-detail-switch__track" aria-hidden />
        </span>
      </label>
      <label className="user-detail-toggle-row">
        <span>
          <strong>Allow chat messages</strong>
          <small>Peer messaging in active swaps</small>
        </span>
        <span className="user-detail-switch">
          <input
            type="checkbox"
            checked={settings.allowChat}
            onChange={(e) => update("allowChat", e.target.checked)}
          />
          <span className="user-detail-switch__track" aria-hidden />
        </span>
      </label>
      <label className="user-detail-toggle-row">
        <span>
          <strong>Allow new listings</strong>
          <small>Publishing items to marketplace feed</small>
        </span>
        <span className="user-detail-switch">
          <input
            type="checkbox"
            checked={settings.allowListings}
            onChange={(e) => update("allowListings", e.target.checked)}
          />
          <span className="user-detail-switch__track" aria-hidden />
        </span>
      </label>

      <label className="user-detail-field" htmlFor="restriction-days">
        Restriction duration
        <select
          id="restriction-days"
          value={settings.durationDays}
          onChange={(e) => update("durationDays", e.target.value)}
        >
          <option value="7">7 days</option>
          <option value="14">14 days</option>
          <option value="30">30 days</option>
        </select>
      </label>

      <label className="user-detail-field" htmlFor="admin-note">
        Internal admin note
        <textarea
          id="admin-note"
          rows={3}
          value={settings.note}
          onChange={(e) => update("note", e.target.value)}
          placeholder="Document rationale for restriction or ban…"
        />
      </label>

      <button
        type="button"
        className="user-detail-save"
        onClick={() => saveUserSettings(userId, settings)}
      >
        <UserDetailSaveIcon />
        Save settings
      </button>
    </section>
  );
}
