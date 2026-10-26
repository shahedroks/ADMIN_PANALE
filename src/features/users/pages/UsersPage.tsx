import { useMemo, useState } from "react";
import { UserManagementKpis } from "@/features/users/components/UserManagementKpis";
import { UserManagementToolbar } from "@/features/users/components/UserManagementToolbar";
import { UsersManagementTable } from "@/features/users/components/UsersManagementTable";
import { UserWorkflowCards } from "@/features/users/components/UserWorkflowCards";
import { PAGE_SIZE } from "@/features/users/data/usersManagementData";
import type { UserFilterTab } from "@/features/users/types";
import { buildPaginationPages } from "@/features/users/utils/userManagementMetrics";
import { useSwapperMembers } from "@/hooks/useFirestoreAdminData";
import { useI18n } from "@/i18n";
import { useDemoStore } from "@/store/demoStore";
import "@/features/dashboard/styles/dashboard.css";
import "@/features/users/styles/users-page.css";

export function UsersPage() {
  const { t } = useI18n();
  const {
    members,
    metrics,
    restrictMember,
    banMember,
    liftMemberRestriction,
    deleteMember,
    loading,
    error,
  } = useSwapperMembers();
  const { pushToast } = useDemoStore();

  const runAction = async (label: string, action: () => Promise<void>) => {
    try {
      await action();
      pushToast(label, "success");
    } catch (e) {
      pushToast(
        e instanceof Error ? e.message : t("users.toast.failed", { action: label }),
        "error",
      );
    }
  };

  const exportMembersCsv = () => {
    const header = "id,name,email,status\n";
    const body = members
      .map((m) => `${m.id},${m.name},${m.email},${m.status}`)
      .join("\n");
    const blob = new Blob([header + body], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "swappers.csv";
    a.click();
    URL.revokeObjectURL(url);
    pushToast(t("users.toast.exported"));
  };

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
  const pageButtons = buildPaginationPages(safePage, totalPages);

  const start = filtered.length === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1;
  const end = Math.min(safePage * PAGE_SIZE, filtered.length);
  const displayTotal = filtered.length;
  const liveCounts = {
    all: members.length,
    active: members.filter((u) => u.status === "active").length,
    restricted: members.filter((u) => u.status === "restricted").length,
    banned: members.filter((u) => u.status === "banned").length,
  };

  const standingPercent = metrics?.activeGoodStandingPercent ?? 0;

  return (
    <div className="dash-page users-page">
      {loading && <p>{t("users.loading")}</p>}
      {error && <p role="alert">{error}</p>}
      <header className="users-page__header">
        <div>
          <p className="users-page__eyebrow">{t("users.eyebrow")}</p>
          <h1>{t("users.title")}</h1>
          <p className="users-page__subtitle">{t("users.subtitle")}</p>
        </div>
        <div className="users-page__actions">
          <button
            type="button"
            className="users-page__select"
            onClick={() => pushToast(t("users.toast.filter"), "info")}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden>
              <path
                d="M1 3h12M3 7h8M5 11h4"
                stroke="currentColor"
                strokeWidth="1.3"
                strokeLinecap="round"
              />
            </svg>
            {t("users.filterTypes")}
            <svg width="10" height="6" viewBox="0 0 10 6" aria-hidden className="users-page__chev">
              <path d="M1 1l4 4 4-4" stroke="currentColor" fill="none" strokeWidth="1.2" />
            </svg>
          </button>
          <button type="button" className="users-page__export" onClick={exportMembersCsv}>
            <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden>
              <path
                d="M7 1v8M4 6l3 3 3-3M2 12h10"
                stroke="currentColor"
                fill="none"
                strokeWidth="1.3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {t("users.export")}
          </button>
        </div>
      </header>

      <UserManagementKpis items={metrics?.kpis ?? []} />

      <UserManagementToolbar
        search={search}
        onSearchChange={(v) => {
          setSearch(v);
          setPage(1);
        }}
        activeTab={tab}
        onTabChange={(nextTab) => {
          setTab(nextTab);
          setPage(1);
        }}
        counts={liveCounts}
      />

      <section className="users-table-card">
        <UsersManagementTable
          rows={pageRows}
          onRestrict={(id) => runAction(t("users.toast.restricted"), () => restrictMember(id))}
          onBan={(id) => runAction(t("users.toast.banned"), () => banMember(id))}
          onLift={(id) => runAction(t("users.toast.lifted"), () => liftMemberRestriction(id))}
          onDelete={(id) => runAction(t("users.toast.removed"), () => deleteMember(id))}
        />
        <footer className="users-pagination">
          <p>
            {t("users.pagination", {
              start,
              end,
              total: displayTotal,
              percent: standingPercent,
            })}
          </p>
          <div className="users-pagination__controls">
            <button
              type="button"
              disabled={safePage <= 1}
              onClick={() => setPage((p) => p - 1)}
            >
              {t("users.prev")}
            </button>
            {pageButtons.map((p, index) => {
              const prev = pageButtons[index - 1];
              const showEllipsis = prev !== undefined && p - prev > 1;
              return (
                <span key={p} style={{ display: "contents" }}>
                  {showEllipsis && <span>…</span>}
                  <button
                    type="button"
                    className={p === safePage ? "is-active" : undefined}
                    onClick={() => setPage(p)}
                  >
                    {p}
                  </button>
                </span>
              );
            })}
            <button
              type="button"
              disabled={safePage >= totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              {t("users.next")}
            </button>
          </div>
        </footer>
      </section>

      {metrics && <UserWorkflowCards workflow={metrics.workflow} />}
    </div>
  );
}
