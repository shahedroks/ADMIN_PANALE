import { useState } from "react";
import { useDemoStore } from "@/store/demoStore";

export function SettingsSecurityPanel() {
  const { pushToast } = useDemoStore();
  const [enforce2fa, setEnforce2fa] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState("30");

  return (
    <section className="settings-panel" id="settings-security">
      <div className="settings-panel__head">
        <div>
          <p className="settings-panel__kicker">Hardened perimeter</p>
          <h2>Security parameters</h2>
        </div>
        <button
          type="button"
          className="settings-link-btn settings-link-btn--download"
          onClick={() => pushToast("Security audit log download started (demo).", "info")}
        >
          Download security audit log
        </button>
      </div>

      <div className="settings-2fa-row">
        <div>
          <strong>Enforce two-factor authentication (2FA)</strong>
          <p>Require OTP verification for all admin console sign-ins.</p>
        </div>
        <label className="settings-toggle">
          <input
            type="checkbox"
            checked={enforce2fa}
            onChange={(e) => {
              setEnforce2fa(e.target.checked);
              pushToast(`2FA enforcement ${e.target.checked ? "enabled" : "disabled"}.`);
            }}
          />
          <span className="settings-toggle__track" />
          <span className="settings-toggle__label">{enforce2fa ? "On" : "Off"}</span>
        </label>
      </div>

      <div className="settings-security-grid">
        <div className="settings-security-card">
          <label htmlFor="session-timeout">Session inactivity timeout</label>
          <select
            id="session-timeout"
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
          <span>Root password health</span>
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
    </section>
  );
}
