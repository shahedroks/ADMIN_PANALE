import { Link } from "react-router-dom";
import type { SwapperMember } from "@/features/users/types";

const statusLabel: Record<SwapperMember["status"], string> = {
  active: "Active",
  restricted: "Temporarily restricted",
  banned: "Banned",
};

const trustLabel: Record<SwapperMember["trust"], string> = {
  high: "High",
  good: "Good",
  low: "Low",
  review: "Under review",
};

type UsersManagementTableProps = {
  rows: SwapperMember[];
  onRestrict: (id: string) => void;
  onBan: (id: string) => void;
  onLift: (id: string) => void;
  onDelete: (id: string) => void;
};

function TrustDots({ count, trust }: { count: number; trust: SwapperMember["trust"] }) {
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
  return (
    <div className="users-table-wrap">
      <table className="users-table">
        <thead>
          <tr>
            <th>User</th>
            <th>Account status</th>
            <th>Trust level</th>
            <th>Swaps</th>
            <th>Reports</th>
            <th>Last active</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={7} className="users-table__empty">
                No members match your filters.
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr key={row.id}>
                <td>
                  <div className="users-table__person">
                    <img
                      src={`https://i.pravatar.cc/64?u=${row.avatarSeed}`}
                      alt=""
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
                  <TrustDots count={row.trustDots} trust={row.trust} />
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
                      Profile
                    </Link>
                    {row.status === "banned" ? (
                      <>
                        <button
                          type="button"
                          className="users-table__action-link users-table__action-link--restrict"
                          onClick={() => onLift(row.id)}
                        >
                          Lift restriction
                        </button>
                        <button
                          type="button"
                          className="users-table__action-link users-table__action-link--danger"
                          onClick={() => onDelete(row.id)}
                        >
                          Delete
                        </button>
                      </>
                    ) : row.status === "restricted" ? (
                      <>
                        <button
                          type="button"
                          className="users-table__action-link users-table__action-link--restrict"
                          onClick={() => onLift(row.id)}
                        >
                          Lift restriction
                        </button>
                        <button
                          type="button"
                          className="users-table__action-link users-table__action-link--danger"
                          onClick={() => onBan(row.id)}
                        >
                          Ban
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          type="button"
                          className="users-table__action-link users-table__action-link--restrict"
                          onClick={() => onRestrict(row.id)}
                        >
                          Restrict
                        </button>
                        <button
                          type="button"
                          className="users-table__action-link users-table__action-link--danger"
                          onClick={() => onBan(row.id)}
                        >
                          Ban
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
