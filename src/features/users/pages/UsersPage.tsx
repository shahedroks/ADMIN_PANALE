import { useMemo, useState } from "react";
import { UserManagementKpis } from "@/features/users/components/UserManagementKpis";
import { UserManagementToolbar } from "@/features/users/components/UserManagementToolbar";
import { UsersManagementTable } from "@/features/users/components/UsersManagementTable";
import { UserWorkflowCards } from "@/features/users/components/UserWorkflowCards";
import { PAGE_SIZE, userKpis } from "@/features/users/data/usersManagementData";
import type { UserFilterTab } from "@/features/users/types";
import { useDemoStore } from "@/store/demoStore";
import "@/features/dashboard/styles/dashboard.css";
import "@/features/users/styles/users-page.css";

export function UsersPage() {
  const {
    members,
    userCounts,
    restrictMember,
    banMember,
    liftMemberRestriction,
    deleteMember,
    exportMembersCsv,
    pushToast,
  } = useDemoStore();

  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<UserFilterTab>("active");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    let list = members;

    if (tab === "active") list = list.filter((u) => u.status === "active");
    if (tab === "restricted") list = list.filter((u) => u.status === "restricted");
    if (tab === "banned") list = list.filter((u) => u.status === "banned");

    const q = search.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (u) =>
          u.name.toLowerCase().includes(q) ||
          u.handle.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q),
      );
    }

    return list;
  }, [tab, search, members]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageRows = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const start = filtered.length === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1;
  const end = Math.min(safePage * PAGE_SIZE, filtered.length);
  const displayTotal = tab === "all" && !search ? userCounts.all : filtered.length;

  return (
    <div className="dash-page users-page">
      <header className="users-page__header">
        <div>
          <p className="users-page__eyebrow">Community governance • Real-time directory</p>
          <h1>User Management</h1>
          <p className="users-page__subtitle">
            Keep the swapping community safe, verifiable, and trusted across all active nodes.
          </p>
        </div>
        <div className="users-page__actions">
          <button
            type="button"
            className="users-page__select"
            onClick={() => pushToast("Account type filter updated (demo).", "info")}
          >
            All account types ▾
          </button>
          <button type="button" className="users-page__export" onClick={exportMembersCsv}>
            Export user list
          </button>
        </div>
      </header>

      <UserManagementKpis items={userKpis} />

      <UserManagementToolbar
        search={search}
        onSearchChange={(v) => {
          setSearch(v);
          setPage(1);
        }}
        activeTab={tab}
        onTabChange={(t) => {
          setTab(t);
          setPage(1);
        }}
        counts={userCounts}
      />

      <section className="users-table-card">
        <UsersManagementTable
          rows={pageRows}
          onRestrict={restrictMember}
          onBan={banMember}
          onLift={liftMemberRestriction}
          onDelete={deleteMember}
        />
        <footer className="users-pagination">
          <p>
            Showing {start} to {end} of {displayTotal.toLocaleString()} swappers (96.8% active
            good standing)
          </p>
          <div className="users-pagination__controls">
            <button
              type="button"
              disabled={safePage <= 1}
              onClick={() => setPage((p) => p - 1)}
            >
              ‹ Previous
            </button>
            {[1, 2, 3].map((p) => (
              <button
                key={p}
                type="button"
                className={p === safePage ? "is-active" : undefined}
                onClick={() => setPage(p)}
              >
                {p}
              </button>
            ))}
            <span>…</span>
            <button type="button" onClick={() => setPage(Math.min(570, totalPages))}>
              570
            </button>
            <button
              type="button"
              disabled={safePage >= totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next ›
            </button>
          </div>
        </footer>
      </section>

      <UserWorkflowCards />
    </div>
  );
}
