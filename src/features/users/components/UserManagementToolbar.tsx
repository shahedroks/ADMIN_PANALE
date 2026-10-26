import type { UserFilterTab } from "@/features/users/types";
import { useI18n } from "@/i18n";

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
  const { t } = useI18n();

  const tabs: { id: UserFilterTab; labelKey: string; count: number }[] = [
    { id: "all", labelKey: "users.tab.all", count: counts.all },
    { id: "active", labelKey: "users.tab.active", count: counts.active },
    { id: "restricted", labelKey: "users.tab.restricted", count: counts.restricted },
    { id: "banned", labelKey: "users.tab.banned", count: counts.banned },
  ];

  return (
    <div className="users-toolbar">
      <div className="users-toolbar__search">
        <svg width="15" height="15" viewBox="0 0 16 16" aria-hidden>
          <circle cx="7" cy="7" r="5" stroke="#414845" fill="none" strokeWidth="1.2" />
          <path d="M11 11l3 3" stroke="#414845" strokeWidth="1.2" />
        </svg>
        <input
          type="search"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={t("users.search")}
          aria-label={t("users.searchAria")}
        />
      </div>
      <div className="users-toolbar__tabs" role="tablist">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.id}
            className={
              activeTab === tab.id
                ? tab.id === "all"
                  ? "users-tab users-tab--active-all"
                  : "users-tab users-tab--active"
                : "users-tab"
            }
            onClick={() => onTabChange(tab.id)}
          >
            {activeTab === tab.id && tab.id !== "all" && (
              <span className="users-tab__dot" aria-hidden />
            )}
            <span className="users-tab__label">{t(tab.labelKey)}</span>
            <span className="users-tab__count">{tab.count.toLocaleString()}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
