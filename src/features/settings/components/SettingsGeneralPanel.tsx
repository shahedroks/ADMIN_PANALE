import { useEffect, useState } from "react";

import type { AppSettings } from "@/services/firestore/appSettingsFirestoreService";
import { useAppSettings } from "@/hooks/useAppSettings";
import {
  isAdminNotificationSoundEnabled,
  setAdminNotificationSoundEnabled,
} from "@/lib/adminNotificationPrefs";
import { playAdminNotificationSound } from "@/lib/playAdminNotificationSound";
import { useToast } from "@/store/toastStore";

type SettingsGeneralPanelProps = {
  settings: AppSettings | null;
};

export function SettingsGeneralPanel({ settings }: SettingsGeneralPanelProps) {
  const { save } = useAppSettings();
  const { pushToast } = useToast();
  const [alertSound, setAlertSound] = useState(true);

  useEffect(() => {
    setAlertSound(isAdminNotificationSoundEnabled());
  }, []);

  return (
    <section className="settings-panel" id="settings-general">
      <div className="settings-panel__head">
        <div>
          <p className="settings-panel__kicker">Primary parameters</p>
          <h2>General Settings</h2>
          <p className="settings-panel__desc">
            Define the core marketplace identity for the SWAP IT exchange network.
          </p>
        </div>
        <span className="settings-live">
          <i /> Live mode
        </span>
      </div>

      <div className="settings-general-grid">
        <label className="settings-general-grid__wide">
          Platform display name
          <input
            type="text"
            defaultValue={settings?.platformDisplayName ?? "SWAP IT"}
            key={settings?.platformDisplayName ?? "default"}
            onBlur={(e) => {
              const value = e.target.value.trim() || "SWAP IT";
              void save({ platformDisplayName: value }).then(() =>
                pushToast("Platform name saved."),
              );
            }}
          />
        </label>

        <div className="settings-2fa-row settings-general-grid__wide">
          <div className="settings-2fa-row__main">
            <div>
              <strong>Console alert sound</strong>
              <p>
                Play a short tone when a new report or pending listing arrives while
                the admin panel is open.
              </p>
            </div>
          </div>
          <label className="settings-toggle settings-toggle--solo">
            <input
              type="checkbox"
              checked={alertSound}
              onChange={(e) => {
                const next = e.target.checked;
                setAlertSound(next);
                setAdminNotificationSoundEnabled(next);
                if (next) playAdminNotificationSound();
                pushToast(
                  next ? "Alert sound enabled." : "Alert sound muted.",
                  "info",
                );
              }}
            />
            <span className="settings-toggle__track" />
          </label>
        </div>
      </div>
    </section>
  );
}
