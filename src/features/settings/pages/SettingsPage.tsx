import { useEffect, useState } from "react";
import { SettingsGeneralPanel } from "@/features/settings/components/SettingsGeneralPanel";
import { SettingsSecurityPanel } from "@/features/settings/components/SettingsSecurityPanel";
import { SettingsSubNav } from "@/features/settings/components/SettingsSubNav";
import { SettingsTeamTable } from "@/features/settings/components/SettingsTeamTable";
import { type SettingsSectionId } from "@/features/settings/data/settingsData";
import { useAdminTeam, useAppSettings } from "@/hooks/useAppSettings";
import { useI18n } from "@/i18n";
import "@/features/dashboard/styles/dashboard.css";
import "@/features/settings/styles/settings-page.css";

const sectionAnchors: Record<SettingsSectionId, string> = {
  general: "settings-general",
  team: "settings-team",
  security: "settings-security",
};

export function SettingsPage() {
  const { t } = useI18n();
  const { members: adminTeam, loading: teamLoading, reload: reloadAdminTeam } = useAdminTeam();
  const { settings, loading: settingsLoading } = useAppSettings();
  const [active, setActive] = useState<SettingsSectionId>("general");

  useEffect(() => {
    const id = sectionAnchors[active];
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [active]);

  return (
    <div className="dash-page settings-page">
      {(teamLoading || settingsLoading) && <p>{t("settings.loading")}</p>}
      <header className="settings-page__header">
        <div>
          <p className="settings-page__breadcrumb">
            {t("settings.breadcrumb.platform")} <span>›</span> {t("settings.breadcrumb.settings")}
          </p>
          <h1>{t("settings.title")}</h1>
          <p className="settings-page__subtitle">{t("settings.subtitle")}</p>
        </div>
        <span className="settings-page__status">
          <i />
          {t("settings.status")}
        </span>
      </header>

      <div className="settings-layout">
        <SettingsSubNav active={active} onSelect={setActive} adminTeamCount={adminTeam.length} />

        <div className="settings-workspace">
          <SettingsGeneralPanel />
          <SettingsTeamTable members={adminTeam} onTeamChanged={() => void reloadAdminTeam()} />
          <SettingsSecurityPanel settings={settings} />
        </div>
      </div>
    </div>
  );
}
