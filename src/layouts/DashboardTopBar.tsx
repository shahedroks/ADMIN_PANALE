import { useAppStore } from "@/store";

export function DashboardTopBar() {
  const { user } = useAppStore();
  const displayName = user?.name ?? "Super Admin";
  const roleLabel = user?.role === "admin" ? "Super Admin" : user?.role ?? "Admin";

  return (
    <header className="dash-topbar">
      <p className="dash-topbar__eyebrow">Exchange Control Center</p>
      <div className="dash-topbar__actions">
        <button type="button" className="dash-topbar__bell" aria-label="Notifications">
          <svg width="14" height="17" viewBox="0 0 14 17" aria-hidden>
            <path
              d="M1 13h12l-1.5-1.5V7a5 5 0 00-10 0v4.5L1 13zM5.5 15a2 2 0 004 0"
              stroke="currentColor"
              fill="none"
              strokeWidth="1.2"
            />
          </svg>
          <span className="dash-topbar__bell-dot" />
        </button>
        <div className="dash-topbar__profile">
          <div className="dash-topbar__profile-text">
            <strong>
              {roleLabel} — {displayName}
            </strong>
          </div>
          <div className="dash-topbar__avatar" aria-hidden>
            {displayName.charAt(0)}
          </div>
        </div>
      </div>
    </header>
  );
}
