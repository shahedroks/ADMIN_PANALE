import { useState } from "react";
import {
  SettingsDownloadIcon,
  SettingsPhoneIcon,
} from "@/features/settings/components/SettingsNavIcon";
import { useDemoStore } from "@/store/demoStore";

export function SettingsSecurityPanel() {
  const { pushToast } = useDemoStore();
  const [enforce2fa, setEnforce2fa] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState("30");

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
          onClick={() => pushToast("Security audit log download started (demo).", "info")}
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
                setEnforce2fa(e.target.checked);
                pushToast(`2FA enforcement ${e.target.checked ? "enabled" : "disabled"}.`);
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
                setSessionTimeout(e.target.value);
                pushToast(`Session timeout set to ${e.target.value} minutes.`);
              }}
            >
              <option value="15">15 minutes of inactivity</option>
              <option value="30">30 minutes of inactivity</option>
              <option value="60">60 minutes of inactivity</option>
            </select>
          </div>
          <div className="settings-security-card">
            <strong className="settings-security-card__title">Root Password Health</strong>
            <div className="settings-strength">
              <span style={{ width: "85%" }} />
            </div>
            <p className="settings-strength__label">Strong</p>
            <button
              type="button"
              className="settings-btn settings-btn--outline"
              onClick={() => pushToast("Password reset email sent to root admin (demo).", "info")}
            >
              Change master password
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
