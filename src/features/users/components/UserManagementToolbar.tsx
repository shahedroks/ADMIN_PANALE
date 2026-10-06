import type { UserFilterTab } from "@/features/users/types";

type UserManagementToolbarProps = {
  search: string;
  onSearchChange: (value: string) => void;
  activeTab: UserFilterTab;
  onTabChange: (tab: UserFilterTab) => void;
  counts: { all: number; active: number; restricted: number; banned: number };
};

export function UserManagementToolbar({
  search,
  onSearchChange,
  activeTab,
  onTabChange,
  counts,
}: UserManagementToolbarProps) {
  const tabs: { id: UserFilterTab; label: string; count: number }[] = [
    { id: "all", label: "All accounts", count: counts.all },
    { id: "active", label: "Active", count: counts.active },
    { id: "restricted", label: "Restricted", count: counts.restricted },
    { id: "banned", label: "Banned", count: counts.banned },
  ];

  return (
    <div className="users-toolbar">
      <div className="users-toolbar__search">
        <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden>
          <circle cx="7" cy="7" r="5" stroke="#717974" fill="none" strokeWidth="1.2" />
          <path d="M11 11l3 3" stroke="#717974" strokeWidth="1.2" />
        </svg>
        <input
          type="search"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by username, full name, or email..."
          aria-label="Search users"
        />
      </div>
      <div className="users-toolbar__tabs" role="tablist">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.id}
            className={activeTab === tab.id ? "users-tab users-tab--active" : "users-tab"}
            onClick={() => onTabChange(tab.id)}
          >
            {tab.label}
            <span>{tab.count.toLocaleString()}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
