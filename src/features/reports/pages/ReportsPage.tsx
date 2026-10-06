import { useMemo, useState } from "react";
import { ReportKpiCards } from "@/features/reports/components/ReportKpiCards";
import { ReportsPagination } from "@/features/reports/components/ReportsPagination";
import { ReportsTable } from "@/features/reports/components/ReportsTable";
import { ReportToolbar } from "@/features/reports/components/ReportToolbar";
import { PAGE_SIZE, reportKpis } from "@/features/reports/data/reportsData";
import type { ReportFilterTab } from "@/features/reports/types";
import { useDemoStore } from "@/store/demoStore";
import "@/features/dashboard/styles/dashboard.css";
import "@/features/reports/styles/reports-page.css";

export function ReportsPage() {
  const {
    reports,
    reportCounts,
    reviewItems,
    members,
    reviewReport,
    closeReport,
    pushToast,
  } = useDemoStore();

  const [activeTab, setActiveTab] = useState<ReportFilterTab>("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    let list = reports;

    if (activeTab === "high") {
      list = list.filter((r) => r.priority === "high");
    } else if (activeTab === "under_review") {
      list = list.filter((r) => r.status === "under_review");
    }

    const q = search.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (r) =>
          r.id.includes(q) ||
          r.type.toLowerCase().includes(q) ||
          r.targetLabel.toLowerCase().includes(q) ||
          r.flow.toLowerCase().includes(q),
      );
    }

    return list;
  }, [activeTab, search, reports]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);

  const pageRows = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);
  const paginationTotal = filtered.length;

  function handleTabChange(tab: ReportFilterTab) {
    setActiveTab(tab);
    setPage(1);
  }

  function handleSearchChange(value: string) {
    setSearch(value);
    setPage(1);
  }

  return (
    <div className="dash-page reports-page">
      <header className="reports-page__header">
        <div>
          <p className="reports-page__eyebrow">
            <span className="reports-page__live" />
            Moderation deck • Live stream
          </p>
          <h1>Reports &amp; Review</h1>
          <p className="reports-page__subtitle">
            Track reports and take the right action across the peer exchange network.
          </p>
        </div>
        <button
          type="button"
          className="reports-page__rules"
          onClick={() => pushToast("Community policy handbook opened (demo).", "info")}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden>
            <path
              d="M2 3h10v2H2V3zM3 7h8v2H3V7zM5 11h4v2H5v-2z"
              fill="currentColor"
            />
          </svg>
          View Rules
        </button>
      </header>

      <ReportKpiCards items={reportKpis} />

      <ReportToolbar
        activeTab={activeTab}
        onTabChange={handleTabChange}
        counts={reportCounts}
        search={search}
        onSearchChange={handleSearchChange}
      />

      <section className="reports-table-card">
        <ReportsTable
          rows={pageRows}
          reviewItems={reviewItems}
          members={members}
          onReview={reviewReport}
          onClose={closeReport}
        />
        <ReportsPagination
          page={safePage}
          pageSize={PAGE_SIZE}
          total={paginationTotal}
          onPageChange={setPage}
        />
      </section>
    </div>
  );
}
