import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { UserAvatar } from "@/components/UserAvatar";
import { updateAdminProfile } from "@/features/auth/services/adminProfileService";
import { useI18n } from "@/i18n";
import { useAppStore } from "@/store";
import { useToast } from "@/store/toastStore";

type AdminProfileEditModalProps = {
  onClose: () => void;
};

export function AdminProfileEditModal({ onClose }: AdminProfileEditModalProps) {
  const { t } = useI18n();
  const { user, refreshUser } = useAppStore();
  const { pushToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState(user?.name ?? "");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  useEffect(() => {
    return () => {
      if (photoPreview) URL.revokeObjectURL(photoPreview);
    };
  }, [photoPreview]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (!user) return null;

  function handlePhotoPick(file: File | undefined) {
    if (!file) return;
    if (photoPreview) URL.revokeObjectURL(photoPreview);
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
    setError(null);
  }

  async function handleSave() {
    setSaving(true);
    setError(null);
    try {
      await updateAdminProfile({ displayName: name, photoFile });
      await refreshUser();
      pushToast(t("profile.edit.saved"), "success");
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : t("profile.edit.error"));
    } finally {
      setSaving(false);
    }
  }

  const previewPhotoUrl = photoPreview ?? user.avatarUrl;

  return createPortal(
    <div className="dash-profile-overlay" role="presentation" onClick={onClose}>
      <div
        className="dash-profile-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="dash-profile-title"
        aria-describedby="dash-profile-desc"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="dash-profile-modal__close"
          aria-label={t("profile.edit.close")}
          onClick={onClose}
          disabled={saving}
        >
          ×
        </button>

        <header className="dash-profile-modal__head">
          <p className="dash-profile-modal__kicker">{t("profile.edit.kicker")}</p>
          <h2 id="dash-profile-title">{t("profile.edit.title")}</h2>
          <p id="dash-profile-desc" className="dash-profile-modal__subtitle">
            {t("profile.edit.subtitle")}
          </p>
        </header>

        <section className="dash-profile-modal__photo-card" aria-label={t("profile.edit.photoSection")}>
          <div className="dash-profile-modal__avatar-wrap">
            <UserAvatar
              className="dash-profile-modal__avatar"
              photoUrl={previewPhotoUrl}
              seed={user.id}
              displayName={name}
              width={96}
              height={96}
            />
          </div>
          <p className="dash-profile-modal__email">{user.email}</p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="dash-profile-modal__file"
            onChange={(e) => handlePhotoPick(e.target.files?.[0])}
          />
          <button
            type="button"
            className="dash-profile-modal__photo-btn"
            disabled={saving}
            onClick={() => fileInputRef.current?.click()}
          >
            {t("profile.edit.changePhoto")}
          </button>
          <p className="dash-profile-modal__photo-hint">{t("profile.edit.photoHint")}</p>
        </section>

        <label className="dash-profile-modal__field">
          <span>{t("profile.edit.name")}</span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={saving}
            autoComplete="name"
            placeholder={t("profile.edit.namePlaceholder")}
          />
        </label>

        {error && (
          <p className="dash-profile-modal__error" role="alert">{error}</p>
        )}

        <footer className="dash-profile-modal__actions">
          <button
            type="button"
            className="dash-profile-modal__btn dash-profile-modal__btn--ghost"
            onClick={onClose}
            disabled={saving}
          >
            {t("profile.edit.cancel")}
          </button>
          <button
            type="button"
            className="dash-profile-modal__btn dash-profile-modal__btn--primary"
            onClick={() => void handleSave()}
            disabled={saving || !name.trim()}
          >
            {saving ? t("profile.edit.saving") : t("profile.edit.save")}
          </button>
        </footer>
      </div>
    </div>,
    document.body,
  );
}
