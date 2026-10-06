import { NavLink, useNavigate } from "react-router-dom";
import { useAppStore } from "@/store";

const navItems = [
  { to: "/dashboard", label: "Dashboard Overview", icon: "grid" as const, end: true },
  { to: "/reports", label: "Reports & Review", icon: "flag" as const },
  { to: "/items-review", label: "Items Review", icon: "review" as const },
  { to: "/users", label: "User Management", icon: "users" as const },
  { to: "/settings", label: "Settings", icon: "settings" as const },
];

function NavIcon({ type }: { type: (typeof navItems)[number]["icon"] }) {
  const stroke = "currentColor";
  switch (type) {
    case "grid":
      return (
        <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden>
          <rect x="1" y="1" width="5" height="5" rx="1" stroke={stroke} fill="none" />
          <rect x="8" y="1" width="5" height="5" rx="1" stroke={stroke} fill="none" />
          <rect x="1" y="8" width="5" height="5" rx="1" stroke={stroke} fill="none" />
          <rect x="8" y="8" width="5" height="5" rx="1" stroke={stroke} fill="none" />
        </svg>
      );
    case "flag":
      return (
        <svg width="12" height="13" viewBox="0 0 12 13" aria-hidden>
          <path d="M2 1v11M2 2h7l-1.5 2L9 6H2" stroke={stroke} fill="none" strokeWidth="1.2" />
        </svg>
      );
    case "review":
      return (
        <svg width="14" height="13" viewBox="0 0 14 13" aria-hidden>
          <path
            d="M1 2h12v8H4l-2 2V2z"
            stroke={stroke}
            fill="none"
            strokeWidth="1.2"
          />
          <path d="M4 5h6M4 7h4" stroke={stroke} strokeWidth="1.1" />
        </svg>
      );
    case "users":
      return (
        <svg width="14" height="12" viewBox="0 0 14 12" aria-hidden>
          <circle cx="5" cy="3.5" r="2" stroke={stroke} fill="none" />
          <path d="M1 11c0-2.2 1.8-3.5 4-3.5s4 1.3 4 3.5" stroke={stroke} fill="none" />
          <circle cx="10" cy="4" r="1.5" stroke={stroke} fill="none" />
        </svg>
      );
    case "settings":
      return (
        <svg width="13" height="13" viewBox="0 0 13 13" aria-hidden>
          <circle cx="6.5" cy="6.5" r="2" stroke={stroke} fill="none" />
          <path
            d="M6.5 1v1.2M6.5 10.8V12M1 6.5h1.2M10.8 6.5H12M2.8 2.8l.85.85M9.35 9.35l.85.85M2.8 10.2l.85-.85M9.35 3.65l.85-.85"
            stroke={stroke}
            strokeWidth="1.1"
          />
        </svg>
      );
  }
}

function BrandIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" aria-hidden>
      <rect width="32" height="32" rx="8" fill="#0D3B2E" />
      <path
        d="M10 13h8l-2-2M22 19h-8l2 2M20 11l2 2-2 2M12 21l-2-2 2-2"
        stroke="#ACF847"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function DashboardSidebar() {
  const navigate = useNavigate();
  const { logout } = useAppStore();

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  return (
    <aside className="dash-sidebar">
      <div className="dash-sidebar__top">
        <div className="dash-sidebar__brand">
          <BrandIcon />
          <span className="dash-sidebar__brand-stack">
            <span>SWAP IT</span>
            <small>Control Center</small>
          </span>
        </div>
        <nav className="dash-sidebar__nav" aria-label="Main">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                isActive ? "dash-sidebar__link dash-sidebar__link--active" : "dash-sidebar__link"
              }
            >
              <NavIcon type={item.icon} />
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>
      <button type="button" className="dash-sidebar__logout" onClick={handleLogout}>
        <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden>
          <path
            d="M5 1H2v12h3M9 10l3-3-3-3M6 7h6"
            stroke="currentColor"
            fill="none"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
        </svg>
        Log out
      </button>
    </aside>
  );
}
