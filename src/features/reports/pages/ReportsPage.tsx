import { useMemo, useState } from "react";
import { ReportKpiCards } from "@/features/reports/components/ReportKpiCards";
import { ReportsPagination } from "@/features/reports/components/ReportsPagination";
import { ReportsTable } from "@/features/reports/components/ReportsTable";
import { ReportToolbar } from "@/features/reports/components/ReportToolbar";
import { PAGE_SIZE, reportKpis } from "@/features/reports/data/reportsData";
import type { ReportFilterTab } from "@/features/reports/types";
import { useModerationReports } from "@/hooks/useFirestoreAdminData";
import { useDemoStore } from "@/store/demoStore";
import "@/features/dashboard/styles/dashboard.css";
import "@/features/reports/styles/reports-page.css";

export function ReportsPage() {
  const { reports, setReportStatus, loading } = useModerationReports();
  const { pushToast } = useDemoStore();

  const reportCounts = useMemo(
    () => ({
      all: reports.length,
      high: reports.filter((r) => r.priority === "high").length,
      under_review: reports.filter((r) => r.status === "under_review").length,
    }),
    [reports],
  );

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
          r.targetLabel.toLowerCase().includes(q),
      );
    }

    return list;
  }, [activeTab, search, reports]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageRows = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  return (
    <div className="dash-page reports-page">
      {loading && <p>Loading reports…</p>}
      <ReportKpiCards items={reportKpis} />
      <ReportToolbar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        counts={reportCounts}
        search={search}
        onSearchChange={setSearch}
      />
      <ReportsTable
        rows={pageRows}
        reviewItems={[]}
        members={[]}
        onReview={(id) => {
          void setReportStatus(id, "under_review");
          pushToast("Report marked under review.", "success");
        }}
        onClose={(id) => {
          void setReportStatus(id, "closed");
          pushToast("Report closed.", "success");
        }}
      />
      <ReportsPagination
        page={safePage}
        pageSize={PAGE_SIZE}
        total={filtered.length}
        onPageChange={setPage}
      />
    </div>
  );
}
