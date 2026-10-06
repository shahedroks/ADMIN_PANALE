import type { UserDetailProfile } from "@/features/user-detail/types";

type UserDetailSummaryProps = {
  profile: UserDetailProfile;
};

export function UserDetailSummary({ profile }: UserDetailSummaryProps) {
  return (
    <section className="user-detail-card user-detail-summary">
      <div className="user-detail-summary__bio">
        <h2>Biography &amp; stance</h2>
        <p>{profile.bio}</p>
        <div className="user-detail-tags">
          {profile.tags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
      </div>

      <div className="user-detail-summary__stats">
        <div className="user-detail-trust">
          <span>Trust level</span>
          <strong>High • {profile.trustPercent}%</strong>
          <div className="user-detail-trust__bar">
            <span style={{ width: `${profile.trustPercent}%` }} />
          </div>
        </div>
        <dl className="user-detail-stat-list">
          <div>
            <dt>Joined date</dt>
            <dd>{profile.joined}</dd>
          </div>
          <div>
            <dt>Last active</dt>
            <dd>{profile.lastActive}</dd>
          </div>
          <div>
            <dt>Total swaps</dt>
            <dd className="user-detail-stat-list__good">
              {profile.swapsCompleted} completed
            </dd>
          </div>
          <div>
            <dt>Report status</dt>
            <dd>
              <span className="user-detail-pill user-detail-pill--warn">
                {profile.reportsUnderReview} under review
              </span>
            </dd>
          </div>
        </dl>
      </div>

      <div className="user-detail-summary__contact">
        <div className="user-detail-avatar-wrap">
          <img
            src={`https://i.pravatar.cc/120?u=${profile.avatarSeed}`}
            alt=""
            width={88}
            height={88}
          />
          {profile.trusted && <span className="user-detail-avatar-wrap__badge">✓</span>}
        </div>
        <p>{profile.email}</p>
        <p>{profile.handle}</p>
        <code>{profile.ipAddress}</code>
      </div>
    </section>
  );
}
