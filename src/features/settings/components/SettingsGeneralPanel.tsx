export function SettingsGeneralPanel() {
  return (
    <section className="settings-panel" id="settings-general">
      <div className="settings-panel__head">
        <div>
          <p className="settings-panel__kicker">Primary parameters</p>
          <h2>General settings</h2>
          <p className="settings-panel__desc">
            Define marketplace identity, default moderation posture, and public-facing
            policy sync behavior for the SWAP IT exchange network.
          </p>
        </div>
        <span className="settings-live">
          <i /> Live mode
        </span>
      </div>

      <div className="settings-general-grid">
        <label>
          Platform display name
          <input type="text" defaultValue="SWAP IT" readOnly />
        </label>
        <label>
          Default moderation queue
          <select defaultValue="balanced">
            <option value="balanced">Balanced review</option>
            <option value="strict">Strict pre-publish</option>
          </select>
        </label>
        <label className="settings-general-grid__wide">
          Public policy footer
          <textarea
            rows={3}
            defaultValue="Safe swapping first — all exchanges must remain on-platform until escrow is verified."
            readOnly
          />
        </label>
      </div>
    </section>
  );
}

export function SettingsNotificationsPanel() {
  return (
    <section className="settings-panel settings-panel--muted" id="settings-notifications">
      <p className="settings-panel__kicker">Alert routing</p>
      <h2>Notifications</h2>
      <p className="settings-panel__desc">
        Configure escalation channels for high-priority reports and SLA breaches.
      </p>
      <ul className="settings-notify-list">
        <li>
          <span>Urgent report push</span>
          <strong>Enabled</strong>
        </li>
        <li>
          <span>Weekly moderation digest</span>
          <strong>Mon 09:00 UTC</strong>
        </li>
        <li>
          <span>Policy sync failures</span>
          <strong>Email + Slack</strong>
        </li>
      </ul>
    </section>
  );
}
