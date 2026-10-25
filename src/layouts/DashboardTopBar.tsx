import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useAppStore } from "@/store";
import { formatAdminNotificationTime } from "@/services/firestore/adminLiveNotificationsService";
import { useAdminLiveNotifications } from "@/hooks/useAdminLiveNotifications";

const DEFAULT_AVATAR = "https://i.pravatar.cc/96?u=sara-miller-swap-admin";

export function DashboardTopBar() {
  const { user } = useAppStore();
  const { notifications, unreadCount, markAllRead, markRead } = useAdminLiveNotifications();
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const displayName = user?.name ?? "Sara Miller";
  const roleLabel = user?.role === "admin" ? "Super Admin" : user?.role ?? "Admin";
  const avatarSrc = user?.avatarUrl ?? DEFAULT_AVATAR;

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
      <p className="dash-topbar__eyebrow">Exchange Control Center</p>
      <div className="dash-topbar__actions">
        <div className="dash-topbar__notify-wrap" ref={panelRef}>
          <button
            type="button"
            className="dash-topbar__bell"
            aria-label="Notifications"
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
            <div className="dash-topbar__notify-panel" role="dialog" aria-label="Notifications">
              <p className="dash-topbar__notify-head">Live alerts</p>
              {notifications.length === 0 ? (
                <p className="dash-topbar__notify-empty">No open reports or pending listings.</p>
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
                        <strong>{item.title}</strong>
                        <span>{item.body}</span>
                        <time dateTime={item.createdAt.toISOString()}>
                          {formatAdminNotificationTime(item.createdAt)}
                        </time>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
        <div className="dash-topbar__profile">
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
        </div>
      </div>
    </header>
  );
}
