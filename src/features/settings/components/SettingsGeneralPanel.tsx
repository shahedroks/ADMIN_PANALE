export function SettingsGeneralPanel() {
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
          <input type="text" defaultValue="SWAP IT" readOnly />
        </label>
      </div>
    </section>
  );
}

