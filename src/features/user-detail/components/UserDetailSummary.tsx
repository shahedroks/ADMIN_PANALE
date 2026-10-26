import { UserAvatar } from "@/components/UserAvatar";
import type { UserDetailProfile } from "@/features/user-detail/types";
import { useI18n } from "@/i18n";

type UserDetailSummaryProps = {
  profile: UserDetailProfile;
};

function SummaryIcon({ type }: { type: "trust" | "calendar" | "clock" | "swap" | "report" }) {
  const paths = {
    trust: "M8 1.5 2.5 3.8v4.1c0 3.1 2.1 5.9 5.5 7.1 3.4-1.2 5.5-4 5.5-7.1V3.8L8 1.5Z",
    calendar: "M3 3.5h10v10H3v-10Zm2-2v4m6-4v4M3 6.5h10",
    clock: "M8 2a6 6 0 1 0 0 12A6 6 0 0 0 8 2Zm0 3v3l2 1.5",
    swap: "M3 5h9l-2-2m3 8H4l2 2",
    report: "M3 2.5h8l2 2v9H3v-11Zm7 0v3h3M8 7v3m0 2v.1",
  };
  return (
    <svg viewBox="0 0 16 16" aria-hidden>
      <path
        d={paths[type]}
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.25"
      />
    </svg>
  );
}

function TagIcon({ index }: { index: number }) {
  if (index === 0) return <span aria-hidden>✓</span>;
  if (index === 1) return <span aria-hidden>★</span>;
  return <span aria-hidden>⌖</span>;
}

export function UserDetailSummary({ profile }: UserDetailSummaryProps) {
  const { t } = useI18n();
  const memberSince = profile.joined.replace(/^Member since\s*/i, "").trim();

  return (
    <section className="user-detail-card user-detail-summary">
      <div className="user-detail-summary__bio">
        <h2>{t("summary.bio")}</h2>
        <p>{profile.bio}</p>
        <div className="user-detail-tags">
          {profile.tags.map((tag, index) => (
            <span key={tag}>
              <TagIcon index={index} />
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="user-detail-summary__metrics">
        <div className="user-detail-stat-row user-detail-stat-row--trust">
          <span className="user-detail-stat-row__label">
            <SummaryIcon type="trust" /> {t("summary.trust")}
          </span>
          <div className="user-detail-stat-row__trust">
            <strong>{profile.trustLabel} • {profile.trustPercent}%</strong>
            <div className="user-detail-trust__bar">
              <span style={{ width: `${profile.trustPercent}%` }} />
            </div>
          </div>
        </div>
        <div className="user-detail-stat-row">
          <span className="user-detail-stat-row__label">
            <SummaryIcon type="calendar" /> {t("summary.joined")}
          </span>
          <span className="user-detail-stat-row__value">{profile.joined}</span>
        </div>
        <div className="user-detail-stat-row">
          <span className="user-detail-stat-row__label">
            <SummaryIcon type="clock" /> {t("summary.lastActive")}
          </span>
          <span className="user-detail-stat-row__value">{profile.lastActive}</span>
        </div>
        <div className="user-detail-stat-row">
          <span className="user-detail-stat-row__label">
            <SummaryIcon type="swap" /> {t("summary.totalSwaps")}
          </span>
          <span className="user-detail-stat-row__value user-detail-stat-row__value--good">
            {t("summary.completed", { count: profile.swapsCompleted })}
          </span>
        </div>
        <div className="user-detail-stat-row">
          <span className="user-detail-stat-row__label">
            <SummaryIcon type="report" /> {t("summary.reportStatus")}
          </span>
          <span className="user-detail-pill user-detail-pill--warn">
            {t("summary.reportsReview", { count: profile.reportsUnderReview })}
          </span>
        </div>
      </div>

      <div className="user-detail-summary__contact">
        <div className="user-detail-avatar-wrap">
          <UserAvatar
            photoUrl={profile.photoUrl}
            seed={profile.avatarSeed}
            displayName={profile.name}
            width={80}
            height={80}
          />
          {profile.trusted && <span className="user-detail-avatar-wrap__badge">✓</span>}
        </div>
        <p className="user-detail-contact__email">{profile.email}</p>
        <p className="user-detail-contact__handle">{profile.handle}</p>
        <p className="user-detail-contact__member">
          {profile.trusted ? t("summary.activeCitizen") : t("summary.member")}
          <i aria-hidden>•</i>
          {t("summary.memberSince", { date: memberSince })}
        </p>
        <code>{profile.ipAddress}</code>
      </div>
    </section>
  );
}
