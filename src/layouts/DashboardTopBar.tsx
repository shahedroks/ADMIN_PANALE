import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useFormatAdminTime } from "@/hooks/useFormatAdminTime";
import { useAdminLiveNotifications } from "@/hooks/useAdminLiveNotifications";
import { useI18n } from "@/i18n";
import type { AdminLiveNotification } from "@/services/firestore/adminLiveNotificationsService";
import { useAppStore } from "@/store";

import { AdminProfileEditModal } from "@/layouts/AdminProfileEditModal";
import { resolveUserAvatarUrl } from "@/lib/userAvatar";

function notificationTitle(
  item: AdminLiveNotification,
  t: (key: string) => string,
): string {
  if (item.kind === "report") {
    if (item.title === "High-priority report") return t("notify.highReport");
    return t("notify.newReport");
  }
  if (item.title === "Listing pending review") return t("notify.pendingListing");
  return t("notify.newListing");
}

export function DashboardTopBar() {
  const { t } = useI18n();
  const formatTime = useFormatAdminTime();
  const { user } = useAppStore();
  const { notifications, unreadCount, markAllRead, markRead } = useAdminLiveNotifications();
  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const displayName = user?.name ?? "Sara Miller";
  const roleLabel =
    user?.role === "admin" ? t("role.superAdmin") : user?.role ?? t("role.admin");
  const avatarSrc =
    user?.avatarUrl ??
    resolveUserAvatarUrl({ seed: "guest", displayName: "Admin" });

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!panelRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [open]);

  useEffect(() => {
    if (open) markAllRead();
  }, [open, markAllRead]);

  return (
    <header className="dash-topbar">
      <p className="dash-topbar__eyebrow">{t("topbar.eyebrow")}</p>
      <div className="dash-topbar__actions">
        <LanguageSwitcher />
        <div className="dash-topbar__notify-wrap" ref={panelRef}>
          <button
            type="button"
            className="dash-topbar__bell"
            aria-label={t("topbar.notifications")}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <svg width="14" height="17" viewBox="0 0 14 17" aria-hidden>
              <path
                d="M1 13h12l-1.5-1.5V7a5 5 0 00-10 0v4.5L1 13zM5.5 15a2 2 0 004 0"
                stroke="currentColor"
                fill="none"
                strokeWidth="1.2"
              />
            </svg>
            {unreadCount > 0 && (
              <span className="dash-topbar__bell-dot" aria-hidden />
            )}
          </button>
          {open && (
            <div
              className="dash-topbar__notify-panel"
              role="dialog"
              aria-label={t("topbar.notifications")}
            >
              <p className="dash-topbar__notify-head">{t("topbar.liveAlerts")}</p>
              {notifications.length === 0 ? (
                <p className="dash-topbar__notify-empty">{t("topbar.notificationsEmpty")}</p>
              ) : (
                <ul>
                  {notifications.map((item) => (
                    <li key={item.id}>
                      <Link
                        to={item.href}
                        className="dash-topbar__notify-link"
                        onClick={() => {
                          markRead(item.id);
                          setOpen(false);
                        }}
                      >
                        <strong>{notificationTitle(item, t)}</strong>
                        <span>{item.body}</span>
                        <time dateTime={item.createdAt.toISOString()}>
                          {formatTime(item.createdAt)}
                        </time>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
        <button
          type="button"
          className="dash-topbar__profile"
          aria-label={t("topbar.editProfile")}
          onClick={() => setProfileOpen(true)}
        >
          <div className="dash-topbar__profile-text">
            <strong className="dash-topbar__profile-name">{displayName}</strong>
            <span className="dash-topbar__profile-role">{roleLabel}</span>
          </div>
          <img
            className="dash-topbar__avatar"
            src={avatarSrc}
            alt=""
            width={32}
            height={32}
          />
        </button>
      </div>
      {profileOpen && <AdminProfileEditModal onClose={() => setProfileOpen(false)} />}
    </header>
  );
}
