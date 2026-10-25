import { useEffect, useState } from "react";
import {
  SettingsDownloadIcon,
  SettingsPhoneIcon,
} from "@/features/settings/components/SettingsNavIcon";
import type { AppSettings } from "@/services/firestore/appSettingsFirestoreService";
import { useAppSettings } from "@/hooks/useAppSettings";
import { useToast } from "@/store/toastStore";

type SettingsSecurityPanelProps = {
  settings: AppSettings | null;
};

export function SettingsSecurityPanel({ settings }: SettingsSecurityPanelProps) {
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
          <p className="settings-panel__kicker">Hardened perimeter</p>
          <h2>Security Parameters</h2>
          <p className="settings-panel__desc">
            Manage enforcement policies, session governance, and downloadable audit
            trails for privileged console access.
          </p>
        </div>
        <button
          type="button"
          className="settings-download"
          onClick={() => pushToast("Audit log export will be available in a future release.", "info")}
        >
          <SettingsDownloadIcon />
          Download Security Audit Log
        </button>
      </div>

      <div className="settings-policy-grid">
        <div className="settings-2fa-row">
          <div className="settings-2fa-row__main">
            <span className="settings-2fa-row__icon-wrap">
              <SettingsPhoneIcon />
            </span>
            <div>
              <strong>Enforce Two-Factor Authentication (2FA)</strong>
              <p>Require OTP verification for all admin console sign-ins.</p>
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
                  pushToast(`2FA enforcement ${next ? "enabled" : "disabled"}.`),
                );
              }}
            />
            <span className="settings-toggle__track" />
          </label>
        </div>

        <div className="settings-security-grid">
          <div className="settings-security-card">
            <strong className="settings-security-card__title">Session Inactivity Timeout</strong>
            <p className="settings-security-card__desc">
              Automatically close idle staff sessions to mitigate unattended terminal risks.
            </p>
            <select
              id="session-timeout"
              className="settings-security-card__select"
              value={sessionTimeout}
              onChange={(e) => {
                const minutes = Number.parseInt(e.target.value, 10);
                setSessionTimeout(e.target.value);
                void save({ sessionTimeoutMinutes: minutes }).then(() =>
                  pushToast(`Session timeout set to ${minutes} minutes.`),
                );
              }}
            >
              <option value="15">15 minutes of inactivity</option>
              <option value="30">30 minutes of inactivity</option>
              <option value="60">60 minutes of inactivity</option>
            </select>
          </div>
        </div>
      </div>
    </section>
  );
}
