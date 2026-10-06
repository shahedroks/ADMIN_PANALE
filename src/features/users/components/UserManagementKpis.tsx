import {
  UserMembersOutlineIcon,
  UserShieldOutlineIcon,
  UserTargetIcon,
  UserTrustSealIcon,
} from "@/components/kpi-icons/FigmaMetricIcons";
import type { UserKpi } from "@/features/users/types";

function KpiIcon({ type }: { type: UserKpi["icon"] }) {
  switch (type) {
    case "members":
      return (
        <UserMembersOutlineIcon className="users-kpi__glyph users-kpi__glyph--members" />
      );
    case "trust":
      return <UserTrustSealIcon className="users-kpi__glyph users-kpi__glyph--trust" />;
    case "restrict":
      return (
        <UserShieldOutlineIcon className="users-kpi__glyph users-kpi__glyph--restrict" />
      );
    case "flag":
      return <UserTargetIcon className="users-kpi__glyph users-kpi__glyph--flag" />;
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
          <div className="users-kpi__body">
            <p className="users-kpi__label">{kpi.label}</p>
            <strong className="users-kpi__value">{kpi.value}</strong>
            <span className={`users-kpi__hint users-kpi__hint--${kpi.hintTone}`}>
              {kpi.hintTone === "positive" && (
                <span className="users-kpi__hint-arrow" aria-hidden>
                  ↑{" "}
                </span>
              )}
              {kpi.hint}
            </span>
          </div>
          <div className="users-kpi__icon" style={{ background: kpi.iconBg }}>
            <KpiIcon type={kpi.icon} />
          </div>
        </article>
      ))}
    </div>
  );
}
