import type { UserKpi } from "@/features/users/types";

function KpiIcon({ type }: { type: UserKpi["icon"] }) {
  const stroke = "#00241A";
  switch (type) {
    case "members":
      return (
        <svg width="20" height="18" viewBox="0 0 20 18" aria-hidden>
          <circle cx="7" cy="5" r="3" stroke={stroke} fill="#DEE9FC" />
          <path d="M1 16c0-3 2.7-5 6-5s6 2 6 5" stroke={stroke} fill="none" />
        </svg>
      );
    case "trust":
      return (
        <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden>
          <path d="M10 2L3 5v5c0 4.5 3 8.5 7 9.5 4-1 7-5 7-9.5V5L10 2z" fill="#DEE9FC" stroke={stroke} />
          <path d="M7 10l2 2 4-4" stroke="#304F00" strokeWidth="1.5" />
        </svg>
      );
    case "restrict":
      return (
        <svg width="18" height="20" viewBox="0 0 18 20" aria-hidden>
          <path d="M9 1L2 4v5c0 4 2.5 7.7 6 9" stroke={stroke} fill="#DEE9FC" />
        </svg>
      );
    case "flag":
      return (
        <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden>
          <circle cx="9" cy="9" r="7" stroke="#BA1A1A" fill="#FFE8E8" />
          <path d="M9 5v4M9 12h.01" stroke="#BA1A1A" />
        </svg>
      );
  }
}

type UserManagementKpisProps = {
  items: UserKpi[];
};

export function UserManagementKpis({ items }: UserManagementKpisProps) {
  return (
    <div className="users-kpis">
      {items.map((kpi) => (
        <article
          key={kpi.id}
          className={`users-kpi${kpi.alert ? " users-kpi--alert" : ""}`}
        >
          <div className="users-kpi__icon">
            <KpiIcon type={kpi.icon} />
          </div>
          <p className="users-kpi__label">{kpi.label}</p>
          <strong className="users-kpi__value">{kpi.value}</strong>
          <span className={`users-kpi__hint users-kpi__hint--${kpi.hintTone}`}>
            {kpi.hint}
          </span>
        </article>
      ))}
    </div>
  );
}
