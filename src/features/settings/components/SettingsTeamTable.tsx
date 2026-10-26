import { SettingsInviteIcon } from "@/features/settings/components/SettingsNavIcon";
import type { AdminMember } from "@/features/settings/data/settingsData";
import { useI18n } from "@/i18n";
import { useToast } from "@/store/toastStore";

type SettingsTeamTableProps = {
  members: AdminMember[];
};

export function SettingsTeamTable({ members }: SettingsTeamTableProps) {
  const { t } = useI18n();
  const { pushToast } = useToast();

  return (
    <section className="settings-panel" id="settings-team">
      <div className="settings-panel__head">
        <div>
          <p className="settings-panel__kicker">{t("settings.team.kicker")}</p>
          <h2>{t("settings.team.title", { count: members.length })}</h2>
        </div>
        <button
          type="button"
          className="settings-btn settings-btn--invite"
          onClick={() => pushToast(t("settings.team.toastInvite"))}
        >
          <SettingsInviteIcon />
          {t("settings.team.invite")}
        </button>
      </div>

      <div className="settings-table-wrap">
        <table className="settings-table">
          <thead>
            <tr>
              <th>{t("settings.team.colName")}</th>
              <th>{t("settings.team.colRole")}</th>
              <th>{t("settings.team.colDept")}</th>
              <th>{t("settings.team.colActive")}</th>
              <th>{t("settings.team.colActions")}</th>
            </tr>
          </thead>
          <tbody>
            {members.map((member) => (
              <tr key={member.id}>
                <td>
                  <div className="settings-table__person">
                    {member.roleVariant === "automated" ? (
                      <span className="settings-table__avatar settings-table__avatar--bot" aria-hidden>
                        <svg viewBox="0 0 18 16" width="18" height="16">
                          <path
                            fill="#85a391"
                            d="M3 5.5h12v7H3v-7Zm1.5-2h9l1 2h-11l1-2ZM7 8.25h1.5v1.5H7v-1.5Zm3 0h1.5v1.5H10v-1.5Z"
                          />
                        </svg>
                      </span>
                    ) : (
                      <img
                        className="settings-table__avatar"
                        src={`https://i.pravatar.cc/72?u=${encodeURIComponent(member.email)}`}
                        alt=""
                        width={36}
                        height={36}
                      />
                    )}
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
                    onClick={() =>
                      pushToast(t("settings.team.toastEdit", { name: member.name }), "info")
                    }
                  >
                    {t("settings.team.edit")}
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
