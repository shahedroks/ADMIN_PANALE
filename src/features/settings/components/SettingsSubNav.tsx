import { SettingsImpactLeafIcon, SettingsNavIcon } from "@/features/settings/components/SettingsNavIcon";
import { settingsNav, type SettingsSectionId } from "@/features/settings/data/settingsData";

type SettingsSubNavProps = {
  active: SettingsSectionId;
  onSelect: (id: SettingsSectionId) => void;
  adminTeamCount?: number;
};

export function SettingsSubNav({ active, onSelect, adminTeamCount }: SettingsSubNavProps) {
  return (
    <aside className="settings-subnav">
      <p className="settings-subnav__kicker">Configuration deck</p>
      <nav aria-label="Settings sections">
        {settingsNav.map((item) => {
          const isActive = active === item.id;
          return (
            <button
              key={item.id}
              type="button"
              className={
                isActive ? "settings-subnav__item is-active" : "settings-subnav__item"
              }
              onClick={() => onSelect(item.id)}
            >
              <span className="settings-subnav__main">
                <SettingsNavIcon id={item.icon} active={isActive} />
                <span className="settings-subnav__copy">
                  <strong>{item.label}</strong>
                  {"sub" in item && item.sub && <small>{item.sub}</small>}
                </span>
              </span>
              <span className="settings-subnav__aside">
                {item.id === "team" && adminTeamCount != null && (
                  <span className="settings-subnav__badge">{adminTeamCount}</span>
                )}
                {"showLiveDotWhenActive" in item &&
                  item.showLiveDotWhenActive &&
                  isActive && <span className="settings-subnav__live-dot" aria-hidden />}
              </span>
            </button>
          );
        })}
      </nav>

      <div className="settings-impact">
        <div className="settings-impact__title">
          <SettingsImpactLeafIcon />
          <p>Circulate impact</p>
        </div>
        <strong>14,280 kg</strong>
        <span>
          Carbon offset facilitated through verified peer-to-peer handoffs this cycle.
        </span>
      </div>
    </aside>
  );
}
