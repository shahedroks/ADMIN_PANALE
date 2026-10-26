import { SettingsImpactLeafIcon, SettingsNavIcon } from "@/features/settings/components/SettingsNavIcon";
import { settingsNav, type SettingsSectionId } from "@/features/settings/data/settingsData";
import { useI18n } from "@/i18n";

type SettingsSubNavProps = {
  active: SettingsSectionId;
  onSelect: (id: SettingsSectionId) => void;
  adminTeamCount?: number;
};

export function SettingsSubNav({ active, onSelect, adminTeamCount }: SettingsSubNavProps) {
  const { t } = useI18n();

  return (
    <aside className="settings-subnav">
      <p className="settings-subnav__kicker">{t("settings.subnav.kicker")}</p>
      <nav aria-label={t("settings.subnav.aria")}>
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
                  <strong>{t(`settings.nav.${item.id}`)}</strong>
                  {item.id === "general" && <small>{t("settings.nav.generalSub")}</small>}
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
          <p>{t("settings.impact.title")}</p>
        </div>
        <strong>14,280 kg</strong>
        <span>{t("settings.impact.body")}</span>
      </div>
    </aside>
  );
}
