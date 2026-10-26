import { useEffect, useState } from "react";
import {
  SettingsDownloadIcon,
  SettingsPhoneIcon,
} from "@/features/settings/components/SettingsNavIcon";
import type { AppSettings } from "@/services/firestore/appSettingsFirestoreService";
import { useAppSettings } from "@/hooks/useAppSettings";
import { useI18n } from "@/i18n";
import { useToast } from "@/store/toastStore";

type SettingsSecurityPanelProps = {
  settings: AppSettings | null;
};

export function SettingsSecurityPanel({ settings }: SettingsSecurityPanelProps) {
  const { t } = useI18n();
  const { pushToast } = useToast();
  const { save } = useAppSettings();
  const [enforce2fa, setEnforce2fa] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState("30");

  useEffect(() => {
    if (!settings) return;
    setEnforce2fa(settings.enforceTwoFactor);
    setSessionTimeout(String(settings.sessionTimeoutMinutes));
  }, [settings]);

  return (
    <section className="settings-panel" id="settings-security">
      <div className="settings-panel__head settings-panel__head--stacked">
        <div className="settings-panel__intro">
          <p className="settings-panel__kicker">{t("settings.security.kicker")}</p>
          <h2>{t("settings.security.title")}</h2>
          <p className="settings-panel__desc">{t("settings.security.desc")}</p>
        </div>
        <button
          type="button"
          className="settings-download"
          onClick={() => pushToast(t("settings.security.toastAudit"), "info")}
        >
          <SettingsDownloadIcon />
          {t("settings.security.download")}
        </button>
      </div>

      <div className="settings-policy-grid">
        <div className="settings-2fa-row">
          <div className="settings-2fa-row__main">
            <span className="settings-2fa-row__icon-wrap">
              <SettingsPhoneIcon />
            </span>
            <div>
              <strong>{t("settings.security.2fa")}</strong>
              <p>{t("settings.security.2faDesc")}</p>
            </div>
          </div>
          <label className="settings-toggle settings-toggle--solo">
            <input
              type="checkbox"
              checked={enforce2fa}
              onChange={(e) => {
                const next = e.target.checked;
                setEnforce2fa(next);
                void save({ enforceTwoFactor: next }).then(() =>
                  pushToast(
                    t("settings.security.toast2fa", {
                      state: next ? t("settings.security.enabled") : t("settings.security.disabled"),
                    }),
                  ),
                );
              }}
            />
            <span className="settings-toggle__track" />
          </label>
        </div>

        <div className="settings-security-grid">
          <div className="settings-security-card">
            <strong className="settings-security-card__title">{t("settings.security.session")}</strong>
            <p className="settings-security-card__desc">{t("settings.security.sessionDesc")}</p>
            <select
              id="session-timeout"
              className="settings-security-card__select"
              value={sessionTimeout}
              onChange={(e) => {
                const minutes = Number.parseInt(e.target.value, 10);
                setSessionTimeout(e.target.value);
                void save({ sessionTimeoutMinutes: minutes }).then(() =>
                  pushToast(t("settings.security.toastSession", { minutes }), "info"),
                );
              }}
            >
              <option value="15">{t("settings.security.min15")}</option>
              <option value="30">{t("settings.security.min30")}</option>
              <option value="60">{t("settings.security.min60")}</option>
            </select>
          </div>
        </div>
      </div>
    </section>
  );
}
