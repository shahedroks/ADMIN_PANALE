import { Link } from "react-router-dom";

import { UserAvatar } from "@/components/UserAvatar";
import type { SwapperMember } from "@/features/users/types";
import { useI18n } from "@/i18n";

type UsersManagementTableProps = {
  rows: SwapperMember[];
  onRestrict: (id: string) => void;
  onBan: (id: string) => void;
  onLift: (id: string) => void;
  onDelete: (id: string) => void;
};

function TrustDots({
  count,
  trust,
  trustLabel,
}: {
  count: number;
  trust: SwapperMember["trust"];
  trustLabel: Record<SwapperMember["trust"], string>;
}) {
  const tone =
    trust === "low" ? "users-trust--low" : trust === "review" ? "users-trust--review" : "users-trust--good";
  return (
    <div className={`users-trust ${tone}`}>
      <span className="users-trust__label">{trustLabel[trust]}</span>
      <span className="users-trust__dots" aria-hidden>
        {Array.from({ length: 5 }, (_, i) => (
          <i key={i} className={i < count ? "on" : undefined} />
        ))}
      </span>
    </div>
  );
}

export function UsersManagementTable({
  rows,
  onRestrict,
  onBan,
  onLift,
  onDelete,
}: UsersManagementTableProps) {
  const { t } = useI18n();

  const statusLabel: Record<SwapperMember["status"], string> = {
    active: t("status.active"),
    restricted: t("status.restricted"),
    banned: t("status.banned"),
  };

  const trustLabel: Record<SwapperMember["trust"], string> = {
    high: t("trust.high"),
    good: t("trust.good"),
    low: t("trust.low"),
    review: t("trust.review"),
  };

  return (
    <div className="users-table-wrap">
      <table className="users-table">
        <thead>
          <tr>
            <th>{t("users.col.user")}</th>
            <th>{t("users.col.status")}</th>
            <th>{t("users.col.trust")}</th>
            <th>{t("users.col.swaps")}</th>
            <th>{t("users.col.reports")}</th>
            <th>{t("users.col.lastActive")}</th>
            <th>{t("users.col.actions")}</th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={7} className="users-table__empty">
                {t("users.empty")}
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr key={row.id}>
                <td>
                  <div className="users-table__person">
                    <UserAvatar
                      photoUrl={row.photoUrl}
                      seed={row.avatarSeed}
                      displayName={row.name}
                      width={40}
                      height={40}
                    />
                    <div>
                      <strong>
                        {row.name}
                        {row.verified && <span className="users-table__verified">✓</span>}
                      </strong>
                      <span>
                        {row.handle} • {row.email}
                      </span>
                    </div>
                  </div>
                </td>
                <td>
                  <span className={`users-status users-status--${row.status}`}>
                    {statusLabel[row.status]}
                  </span>
                </td>
                <td>
                  <TrustDots count={row.trustDots} trust={row.trust} trustLabel={trustLabel} />
                </td>
                <td>{row.swaps}</td>
                <td>
                  <span
                    className={
                      row.reports >= 5
                        ? "users-reports users-reports--high"
                        : "users-reports"
                    }
                  >
                    {row.reports}
                  </span>
                </td>
                <td className="users-table__muted">{row.lastActive}</td>
                <td>
                  <div className="users-table__actions">
                    <Link
                      to={`/users/${row.id}`}
                      className="users-table__action-link users-table__action-link--profile"
                    >
                      {t("users.action.profile")}
                    </Link>
                    {row.status === "banned" ? (
                      <>
                        <button
                          type="button"
                          className="users-table__action-link users-table__action-link--restrict"
                          onClick={() => onLift(row.id)}
                        >
                          {t("users.action.lift")}
                        </button>
                        <button
                          type="button"
                          className="users-table__action-link users-table__action-link--danger"
                          onClick={() => onDelete(row.id)}
                        >
                          {t("users.action.delete")}
                        </button>
                      </>
                    ) : row.status === "restricted" ? (
                      <>
                        <button
                          type="button"
                          className="users-table__action-link users-table__action-link--restrict"
                          onClick={() => onLift(row.id)}
                        >
                          {t("users.action.lift")}
                        </button>
                        <button
                          type="button"
                          className="users-table__action-link users-table__action-link--danger"
                          onClick={() => onBan(row.id)}
                        >
                          {t("users.action.ban")}
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          type="button"
                          className="users-table__action-link users-table__action-link--restrict"
                          onClick={() => onRestrict(row.id)}
                        >
                          {t("users.action.restrict")}
                        </button>
                        <button
                          type="button"
                          className="users-table__action-link users-table__action-link--danger"
                          onClick={() => onBan(row.id)}
                        >
                          {t("users.action.ban")}
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
