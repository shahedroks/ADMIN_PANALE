import { useEffect, useRef, useState } from "react";
import { useAppStore } from "@/store";
import { useDemoStore } from "@/store/demoStore";

const DEFAULT_AVATAR = "https://i.pravatar.cc/96?u=sara-miller-swap-admin";

const notifications = [
  {
    id: "n1",
    title: "3 high-priority reports",
    body: "User safety queue needs verification within 2h.",
    time: "2m ago",
  },
  {
    id: "n2",
    title: "Policy sync complete",
    body: "Community rules v2.4 deployed to all nodes.",
    time: "18m ago",
  },
  {
    id: "n3",
    title: "Batch review ready",
    body: "12 safe listings cleared for auto-approve.",
    time: "1h ago",
  },
];

export function DashboardTopBar() {
  const { user } = useAppStore();
  const { pushToast } = useDemoStore();
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
            <span className="dash-topbar__bell-dot" />
          </button>
          {open && (
            <div className="dash-topbar__notify-panel" role="dialog" aria-label="Notifications">
              <p className="dash-topbar__notify-head">Notifications</p>
              <ul>
                {notifications.map((item) => (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => {
                        pushToast(item.title, "info");
                        setOpen(false);
                      }}
                    >
                      <strong>{item.title}</strong>
                      <span>{item.body}</span>
                      <time>{item.time}</time>
                    </button>
                  </li>
                ))}
              </ul>
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
