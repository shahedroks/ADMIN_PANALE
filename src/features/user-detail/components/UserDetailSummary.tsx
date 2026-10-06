import type { UserDetailProfile } from "@/features/user-detail/types";

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
  const memberSince = profile.joined.replace(/^Member since\s*/i, "").trim();

  return (
    <section className="user-detail-card user-detail-summary">
      <div className="user-detail-summary__bio">
        <h2>Biography &amp; stance</h2>
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
            <SummaryIcon type="trust" /> Trust level
          </span>
          <div className="user-detail-stat-row__trust">
            <strong>High • {profile.trustPercent}%</strong>
            <div className="user-detail-trust__bar">
              <span style={{ width: `${profile.trustPercent}%` }} />
            </div>
          </div>
        </div>
        <div className="user-detail-stat-row">
          <span className="user-detail-stat-row__label">
            <SummaryIcon type="calendar" /> Joined date
          </span>
          <span className="user-detail-stat-row__value">{profile.joined}</span>
        </div>
        <div className="user-detail-stat-row">
          <span className="user-detail-stat-row__label">
            <SummaryIcon type="clock" /> Last active
          </span>
          <span className="user-detail-stat-row__value">{profile.lastActive}</span>
        </div>
        <div className="user-detail-stat-row">
          <span className="user-detail-stat-row__label">
            <SummaryIcon type="swap" /> Total swaps
          </span>
          <span className="user-detail-stat-row__value user-detail-stat-row__value--good">
            {profile.swapsCompleted} completed
          </span>
        </div>
        <div className="user-detail-stat-row">
          <span className="user-detail-stat-row__label">
            <SummaryIcon type="report" /> Report status
          </span>
          <span className="user-detail-pill user-detail-pill--warn">
            {profile.reportsUnderReview} under review
          </span>
        </div>
      </div>

      <div className="user-detail-summary__contact">
        <div className="user-detail-avatar-wrap">
          <img
            src={`https://i.pravatar.cc/160?u=${profile.avatarSeed}`}
            alt=""
            width={80}
            height={80}
          />
          {profile.trusted && <span className="user-detail-avatar-wrap__badge">✓</span>}
        </div>
        <p className="user-detail-contact__email">{profile.email}</p>
        <p className="user-detail-contact__handle">{profile.handle}</p>
        <p className="user-detail-contact__member">
          {profile.trusted ? "Active citizen" : "Member"}
          <i aria-hidden>•</i>
          Member since {memberSince}
        </p>
        <code>{profile.ipAddress}</code>
      </div>
    </section>
  );
}
