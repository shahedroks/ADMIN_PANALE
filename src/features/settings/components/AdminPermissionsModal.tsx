import { useEffect, useState } from "react";

import { UserAvatar } from "@/components/UserAvatar";
import type { AdminMember, PanelRoleId } from "@/features/settings/data/settingsData";
import { useI18n } from "@/i18n";
import { callSetUserRole } from "@/lib/callableFunctions";

export type AssignablePanelRole = PanelRoleId | "user";

type AdminPermissionsModalProps = {
  member: AdminMember;
  currentUserId: string;
  onClose: () => void;
  onSaved: () => void;
};

const ROLE_OPTIONS: { value: AssignablePanelRole; labelKey: string; descKey: string }[] = [
  { value: "admin", labelKey: "settings.permissions.roleAdmin", descKey: "settings.permissions.roleAdminDesc" },
  { value: "manager", labelKey: "settings.permissions.roleManager", descKey: "settings.permissions.roleManagerDesc" },
  { value: "viewer", labelKey: "settings.permissions.roleViewer", descKey: "settings.permissions.roleViewerDesc" },
  { value: "user", labelKey: "settings.permissions.roleRevoke", descKey: "settings.permissions.roleRevokeDesc" },
];

export function AdminPermissionsModal({
  member,
  currentUserId,
  onClose,
  onSaved,
}: AdminPermissionsModalProps) {
  const { t } = useI18n();
  const [role, setRole] = useState<AssignablePanelRole>(member.panelRole);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isSelf = member.id === currentUserId;

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  async function handleSave() {
    if (isSelf && role !== member.panelRole) {
      setError(t("settings.permissions.errorSelf"));
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await callSetUserRole({ userId: member.id, role });
      onSaved();
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : t("settings.permissions.errorSave"));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="settings-perm-overlay" role="presentation" onClick={onClose}>
      <div
        className="settings-perm-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="settings-perm-title"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="settings-perm-modal__head">
          <h2 id="settings-perm-title">{t("settings.permissions.title", { name: member.name })}</h2>
          <p>{member.email}</p>
        </header>

        <div className="settings-perm-modal__profile">
          <UserAvatar
            className="settings-perm-modal__avatar"
            photoUrl={member.photoUrl}
            seed={member.id}
            displayName={member.name}
            width={56}
            height={56}
          />
          <span className={`settings-role settings-role--${member.roleVariant}`}>{member.role}</span>
        </div>

        <fieldset className="settings-perm-modal__roles" disabled={saving}>
          <legend>{t("settings.permissions.roleLegend")}</legend>
          {ROLE_OPTIONS.map((opt) => (
            <label key={opt.value} className="settings-perm-role-option">
              <input
                type="radio"
                name="panel-role"
                value={opt.value}
                checked={role === opt.value}
                onChange={() => setRole(opt.value)}
              />
              <span>
                <strong>{t(opt.labelKey)}</strong>
                <small>{t(opt.descKey)}</small>
              </span>
            </label>
          ))}
        </fieldset>

        {isSelf && (
          <p className="settings-perm-modal__hint">{t("settings.permissions.selfHint")}</p>
        )}

        {error && (
          <p className="settings-perm-modal__error" role="alert">
            {error}
          </p>
        )}

        <footer className="settings-perm-modal__actions">
          <button type="button" className="settings-btn settings-btn--ghost" onClick={onClose} disabled={saving}>
            {t("settings.permissions.cancel")}
          </button>
          <button
            type="button"
            className="settings-btn settings-btn--invite"
            onClick={() => void handleSave()}
            disabled={saving}
          >
            {saving ? t("settings.permissions.saving") : t("settings.permissions.save")}
          </button>
        </footer>
      </div>
    </div>
  );
}
