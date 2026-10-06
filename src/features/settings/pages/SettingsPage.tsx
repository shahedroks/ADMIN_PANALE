import { useEffect, useState } from "react";
import { SettingsGeneralPanel } from "@/features/settings/components/SettingsGeneralPanel";
import { SettingsSecurityPanel } from "@/features/settings/components/SettingsSecurityPanel";
import { SettingsSubNav } from "@/features/settings/components/SettingsSubNav";
import { SettingsTeamTable } from "@/features/settings/components/SettingsTeamTable";
import { type SettingsSectionId } from "@/features/settings/data/settingsData";
import { useDemoStore } from "@/store/demoStore";
import "@/features/dashboard/styles/dashboard.css";
import "@/features/settings/styles/settings-page.css";

const sectionAnchors: Record<SettingsSectionId, string> = {
  general: "settings-general",
  team: "settings-team",
  security: "settings-security",
};

export function SettingsPage() {
  const { adminTeam } = useDemoStore();
  const [active, setActive] = useState<SettingsSectionId>("general");

  useEffect(() => {
    const id = sectionAnchors[active];
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [active]);

  return (
    <div className="dash-page settings-page">
      <header className="settings-page__header">
        <div>
          <p className="settings-page__breadcrumb">
            Platform governance <span>›</span> Settings
          </p>
          <h1>Settings</h1>
          <p className="settings-page__subtitle">
            Manage platform governance, admin team permissions, and security parameters.
          </p>
        </div>
        <span className="settings-page__status">
          <i />
          System status: Policy sync active
        </span>
      </header>

      <div className="settings-layout">
        <SettingsSubNav active={active} onSelect={setActive} adminTeamCount={adminTeam.length} />

        <div className="settings-workspace">
          <SettingsGeneralPanel />
          <SettingsTeamTable members={adminTeam} />
          <SettingsSecurityPanel />
        </div>
      </div>
    </div>
  );
}
