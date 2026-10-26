import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  UserDetailActionLogMarker,
  UserDetailColumnIcon,
  UserDetailSaveIcon,
  UserDetailShieldIcon,
} from "@/components/icons/UserDetailIcons";
import type { UserDetailProfile, UserRestrictionSettings } from "@/features/user-detail/types";
import type { SwapperMember } from "@/features/users/types";
import { useI18n } from "@/i18n";

type UserDetailColumnsProps = {
  profile: UserDetailProfile;
  userId: string;
  memberStatus: SwapperMember["status"];
  restrictionSettings: UserRestrictionSettings;
  onSaveSettings: (settings: UserRestrictionSettings) => Promise<void>;
};

export function UserDetailColumns({
  profile,
  userId,
  memberStatus,
  restrictionSettings,
  onSaveSettings,
}: UserDetailColumnsProps) {
  const { t } = useI18n();
  const itemTotal = profile.items.length;

  const itemStatusLabel = {
    under_review: t("status.underReview"),
    in_swap: t("columns.inSwap"),
    active: t("status.active"),
  } as const;

  return (
    <>
      <div className="user-detail-columns">
        <section className="user-detail-card user-detail-col">
          <div className="user-detail-col__head">
            <h2>
              <UserDetailColumnIcon type="report" /> {t("columns.reports")}
            </h2>
            <span className="user-detail-col__count user-detail-col__count--warn">
              {t("columns.reportsCount", { count: profile.reports.length })}
            </span>
          </div>
          <ul className="user-detail-report-list">
            {profile.reports.length === 0 ? (
              <li>
                <p>{t("columns.reportsEmpty")}</p>
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
                      {report.status === "under_review"
                        ? t("status.underReview")
                        : t("columns.dismissed")}
                    </span>
                  </div>
                  <p>{report.summary}</p>
                  <small>{report.actor}</small>
                </li>
              ))
            )}
          </ul>
          <Link to={`/users/${userId}?panel=reports`} className="user-detail-col__link">
            {t("columns.viewReports")}
          </Link>
        </section>

        <section className="user-detail-card user-detail-col">
          <div className="user-detail-col__head">
            <h2>
              <UserDetailColumnIcon type="items" /> {t("columns.items")}
            </h2>
            <span className="user-detail-col__count">
              {t("columns.reportsCount", { count: itemTotal })}
            </span>
          </div>
          <ul className="user-detail-item-list">
            {profile.items.length === 0 ? (
              <li>
                <p>{t("columns.itemsEmpty")}</p>
              </li>
            ) : (
              profile.items.map((item) => (
                <li key={item.id}>
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
                </li>
              ))
            )}
          </ul>
          <Link to={`/users/${userId}?panel=items`} className="user-detail-col__link">
            {t("columns.viewItems", { count: itemTotal })}
          </Link>
        </section>

        <section className="user-detail-card user-detail-col">
          <div className="user-detail-col__head">
            <h2>
              <UserDetailColumnIcon type="actions" /> {t("columns.log")}
            </h2>
            <span className="user-detail-col__count">
              {t("columns.events", { count: profile.actions.length })}
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
          <Link to={`/users/${userId}?panel=log`} className="user-detail-col__link">
            {t("columns.viewDirectory")}
          </Link>
        </section>
      </div>

      <UserDetailRestrictionPanel
        userId={userId}
        memberStatus={memberStatus}
        initialSettings={restrictionSettings}
        onSaveSettings={onSaveSettings}
      />
    </>
  );
}

function UserDetailRestrictionPanel({
  memberStatus,
  initialSettings,
  onSaveSettings,
}: {
  userId: string;
  memberStatus: SwapperMember["status"];
  initialSettings: UserRestrictionSettings;
  onSaveSettings: (settings: UserRestrictionSettings) => Promise<void>;
}) {
  const { t } = useI18n();
  const [settings, setSettings] = useState<UserRestrictionSettings>(initialSettings);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setSettings(initialSettings);
  }, [initialSettings]);

  function update<K extends keyof UserRestrictionSettings>(
    key: K,
    value: UserRestrictionSettings[K],
  ) {
    setSettings((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <section className="user-detail-card user-detail-restrict">
      <div className="user-detail-col__head">
        <h2>
          <UserDetailShieldIcon />
          {t("columns.restrict")}
        </h2>
        <span className="user-detail-pill user-detail-pill--muted">{t("columns.policy")}</span>
      </div>

      {memberStatus === "banned" && (
        <p className="user-detail-restrict__notice">{t("columns.bannedNotice")}</p>
      )}

      <label className="user-detail-toggle-row">
        <span>
          <strong>{t("columns.manualReview")}</strong>
          <small>{t("columns.manualHint")}</small>
        </span>
        <span className="user-detail-switch">
          <input
            type="checkbox"
            checked={settings.manualReview}
            disabled={memberStatus === "banned"}
            onChange={(e) => update("manualReview", e.target.checked)}
          />
          <span className="user-detail-switch__track" aria-hidden />
        </span>
      </label>
      <label className="user-detail-toggle-row">
        <span>
          <strong>{t("columns.allowChat")}</strong>
          <small>{t("columns.chatHint")}</small>
        </span>
        <span className="user-detail-switch">
          <input
            type="checkbox"
            checked={settings.allowChat}
            disabled={memberStatus === "banned"}
            onChange={(e) => update("allowChat", e.target.checked)}
          />
          <span className="user-detail-switch__track" aria-hidden />
        </span>
      </label>
      <label className="user-detail-toggle-row">
        <span>
          <strong>{t("columns.allowListings")}</strong>
          <small>{t("columns.listingsHint")}</small>
        </span>
        <span className="user-detail-switch">
          <input
            type="checkbox"
            checked={settings.allowListings}
            disabled={memberStatus === "banned"}
            onChange={(e) => update("allowListings", e.target.checked)}
          />
          <span className="user-detail-switch__track" aria-hidden />
        </span>
      </label>

      <label className="user-detail-field" htmlFor="restriction-days">
        {t("columns.duration")}
        <select
          id="restriction-days"
          value={settings.durationDays}
          disabled={memberStatus === "banned"}
          onChange={(e) => update("durationDays", e.target.value)}
        >
          <option value="7">{t("columns.days7")}</option>
          <option value="14">{t("columns.days14")}</option>
          <option value="30">{t("columns.days30")}</option>
        </select>
      </label>

      <label className="user-detail-field" htmlFor="admin-note">
        {t("columns.note")}
        <textarea
          id="admin-note"
          rows={3}
          value={settings.note}
          disabled={memberStatus === "banned"}
          onChange={(e) => update("note", e.target.value)}
          placeholder={t("columns.notePlaceholder")}
        />
      </label>

      <button
        type="button"
        className="user-detail-save"
        disabled={memberStatus === "banned" || saving}
        onClick={() => {
          setSaving(true);
          void onSaveSettings(settings).finally(() => setSaving(false));
        }}
      >
        <UserDetailSaveIcon />
        {saving ? t("columns.saving") : t("columns.save")}
      </button>
    </section>
  );
}
