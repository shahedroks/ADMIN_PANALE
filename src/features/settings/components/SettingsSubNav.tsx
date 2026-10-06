import { settingsNav, type SettingsSectionId } from "@/features/settings/data/settingsData";

type SettingsSubNavProps = {
  active: SettingsSectionId;
  onSelect: (id: SettingsSectionId) => void;
};

export function SettingsSubNav({ active, onSelect }: SettingsSubNavProps) {
  return (
    <aside className="settings-subnav">
      <p className="settings-subnav__kicker">Configuration deck</p>
      <nav aria-label="Settings sections">
        {settingsNav.map((item) => (
          <button
            key={item.id}
            type="button"
            className={
              active === item.id ? "settings-subnav__item is-active" : "settings-subnav__item"
            }
            onClick={() => onSelect(item.id)}
          >
            <span>
              <strong>{item.label}</strong>
              {"sub" in item && item.sub && <small>{item.sub}</small>}
            </span>
            {"badge" in item && item.badge && (
              <span className="settings-subnav__badge">{item.badge}</span>
            )}
            {item.id === "notifications" && <span className="settings-subnav__chev">›</span>}
            {"icon" in item && item.icon === "lock" && (
              <svg className="settings-subnav__lock" width="12" height="14" viewBox="0 0 12 14" aria-hidden>
                <rect x="2" y="6" width="8" height="7" rx="1" stroke="currentColor" fill="none" />
                <path d="M4 6V4a2 2 0 014 0v2" stroke="currentColor" fill="none" />
              </svg>
            )}
          </button>
        ))}
      </nav>

      <div className="settings-co2">
        <p>CO₂ emissions impact</p>
        <strong>14,280 kg</strong>
        <span>Offset fuel saved via circular swaps this quarter.</span>
      </div>
    </aside>
  );
}
