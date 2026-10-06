import { Link, useParams } from "react-router-dom";
import { UserDetailColumns } from "@/features/user-detail/components/UserDetailColumns";
import { UserDetailSummary } from "@/features/user-detail/components/UserDetailSummary";
import { useDemoStore } from "@/store/demoStore";
import "@/features/dashboard/styles/dashboard.css";
import "@/features/user-detail/styles/user-detail.css";

export function UserDetailPage() {
  const { userId } = useParams();
  const { getUserProfile, restrictMember, banMember, members } = useDemoStore();
  const profile = getUserProfile(userId);
  const member = members.find((m) => m.id === profile.routeId);

  if (!member) {
    return (
      <div className="dash-page user-detail-page">
        <Link to="/users" className="user-detail-back">
          ← Back to User Management
        </Link>
        <p>User not found in demo directory.</p>
      </div>
    );
  }

  return (
    <div className="dash-page user-detail-page">
      <header className="user-detail-header">
        <Link to="/users" className="user-detail-back">
          ← Back to User Management
        </Link>
        <div className="user-detail-header__row">
          <div className="user-detail-header__title">
            <h1>User Details</h1>
            {profile.trusted && (
              <span className="user-detail-pill user-detail-pill--trusted">Trusted</span>
            )}
            <span className="user-detail-pill user-detail-pill--code">{profile.userCode}</span>
            <span className="user-detail-header__name">{profile.name}</span>
          </div>
          <div className="user-detail-header__actions">
            <button
              type="button"
              className="user-detail-action user-detail-action--warn"
              onClick={() => restrictMember(member.id)}
              disabled={member.status === "banned"}
            >
              Temporarily restrict
            </button>
            <button
              type="button"
              className="user-detail-action user-detail-action--ban"
              onClick={() => banMember(member.id)}
              disabled={member.status === "banned"}
            >
              Ban account
            </button>
          </div>
        </div>
      </header>

      <UserDetailSummary profile={profile} />
      <UserDetailColumns profile={profile} userId={member.id} />
    </div>
  );
}
