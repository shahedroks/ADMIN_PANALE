import { useEffect, useState } from "react";

import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import {
  isAdminNotificationSoundEnabled,
  setAdminNotificationSoundEnabled,
} from "@/lib/adminNotificationPrefs";
import { playAdminNotificationSound } from "@/lib/playAdminNotificationSound";
import { useI18n } from "@/i18n";
import { useToast } from "@/store/toastStore";

export function SettingsGeneralPanel() {
  const { t } = useI18n();
  const { pushToast } = useToast();
  const [alertSound, setAlertSound] = useState(true);

  useEffect(() => {
    setAlertSound(isAdminNotificationSoundEnabled());
  }, []);

  return (
    <section className="settings-panel" id="settings-general">
      <div className="settings-panel__head">
        <div>
          <p className="settings-panel__kicker">{t("settings.general.kicker")}</p>
          <h2>{t("settings.general.title")}</h2>
          <p className="settings-panel__desc">{t("settings.general.desc")}</p>
        </div>
        <span className="settings-live">
          <i /> {t("settings.general.live")}
        </span>
      </div>

      <div className="settings-general-grid">
        <div className="settings-language-block settings-general-grid__wide">
          <div>
            <strong>{t("language.panelTitle")}</strong>
            <p>{t("language.panelDescription")}</p>
          </div>
          <LanguageSwitcher variant="settings" />
        </div>

        <div className="settings-2fa-row settings-general-grid__wide">
          <div className="settings-2fa-row__main">
            <div>
              <strong>{t("settings.general.alertTitle")}</strong>
              <p>{t("settings.general.alertDesc")}</p>
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
                  next ? t("settings.general.soundOn") : t("settings.general.soundOff"),
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
