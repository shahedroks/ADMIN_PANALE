import type { AdminMember } from "@/features/settings/data/settingsData";
import { useDemoStore } from "@/store/demoStore";

type SettingsTeamTableProps = {
  members: AdminMember[];
};

export function SettingsTeamTable({ members }: SettingsTeamTableProps) {
  const { pushToast } = useDemoStore();

  return (
    <section className="settings-panel" id="settings-team">
      <div className="settings-panel__head">
        <div>
          <p className="settings-panel__kicker">Access control</p>
          <h2>Admin team members ({members.length} active)</h2>
        </div>
        <button
          type="button"
          className="settings-btn settings-btn--primary"
          onClick={() => pushToast("Admin invite sent (demo).")}
        >
          + Invite admin
        </button>
      </div>

      <div className="settings-table-wrap">
        <table className="settings-table">
          <thead>
            <tr>
              <th>Name &amp; email</th>
              <th>Role scope</th>
              <th>Department / focus</th>
              <th>Last active</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {members.map((member) => (
              <tr key={member.id}>
                <td>
                  <div className="settings-table__person">
                    <span className="settings-table__avatar" aria-hidden>
                      {member.name.charAt(0)}
                    </span>
                    <div>
                      <strong>{member.name}</strong>
                      <span>{member.email}</span>
                    </div>
                  </div>
                </td>
                <td>
                  <span className={`settings-role settings-role--${member.roleVariant}`}>
                    {member.role}
                  </span>
                </td>
                <td>{member.department}</td>
                <td className="settings-table__muted">{member.lastActive}</td>
                <td>
                  <button
                    type="button"
                    className="settings-link-btn"
                    onClick={() => pushToast(`Editing permissions for ${member.name} (demo).`, "info")}
                  >
                    Edit permissions
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
