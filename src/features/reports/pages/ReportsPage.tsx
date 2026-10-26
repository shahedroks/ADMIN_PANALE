import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ReportKpiCards } from "@/features/reports/components/ReportKpiCards";
import { ReportsPagination } from "@/features/reports/components/ReportsPagination";
import { ReportsTable } from "@/features/reports/components/ReportsTable";
import { ReportToolbar } from "@/features/reports/components/ReportToolbar";
import { PAGE_SIZE } from "@/features/reports/data/reportsData";
import type { ReportFilterTab, ReportKpi } from "@/features/reports/types";
import { filterReportsForMember } from "@/features/reports/utils/filterReportsForMember";
import { useModerationReports } from "@/hooks/useFirestoreAdminData";
import { fetchReportKpis } from "@/services/firestore/reportsFirestoreService";
import { fetchListedItemsForUser } from "@/services/firestore/userDetailFirestoreService";
import { useI18n } from "@/i18n";
import { useToast } from "@/store/toastStore";
import "@/features/dashboard/styles/dashboard.css";
import "@/features/reports/styles/reports-page.css";

export function ReportsPage() {
  const { t } = useI18n();
  const [searchParams] = useSearchParams();
  const memberId = searchParams.get("member")?.trim() ?? "";
  const { reports, setReportStatus, loading } = useModerationReports();
  const { pushToast } = useToast();
  const [kpis, setKpis] = useState<ReportKpi[]>([]);
  const [ownedItemIds, setOwnedItemIds] = useState<Set<string> | null>(null);

  useEffect(() => {
    if (!memberId) {
      setOwnedItemIds(null);
      return;
    }
    void fetchListedItemsForUser(memberId).then((items) => {
      setOwnedItemIds(new Set(items.map((item) => item.id)));
    });
  }, [memberId]);

  const scopedReports = useMemo(() => {
    if (!memberId || ownedItemIds === null) return reports;
    return filterReportsForMember(reports, memberId, ownedItemIds);
  }, [reports, memberId, ownedItemIds]);

  useEffect(() => {
    if (loading) return;
    if (memberId && ownedItemIds === null) return;
    void fetchReportKpis(scopedReports).then(setKpis);
  }, [scopedReports, loading, memberId, ownedItemIds]);

  const reportCounts = useMemo(
    () => ({
      all: scopedReports.length,
      high: scopedReports.filter((r) => r.priority === "high").length,
      under_review: scopedReports.filter((r) => r.status === "under_review").length,
    }),
    [scopedReports],
  );

  const [activeTab, setActiveTab] = useState<ReportFilterTab>("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    let list = scopedReports;

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
          (r.targetId ?? "").toLowerCase().includes(q),
      );
    }

    return list;
  }, [activeTab, search, scopedReports]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageRows = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  return (
    <div className="dash-page reports-page">
      {loading && <p>{t("reports.loading")}</p>}
      {memberId && (
        <p className="reports-page__scope">
          {t("reports.scope")}{" "}
          <code>{memberId.slice(0, 8)}…</code>
          {" · "}
          <a href="/reports">{t("reports.clearFilter")}</a>
        </p>
      )}
      <ReportKpiCards items={kpis} />
      <ReportToolbar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        counts={reportCounts}
        search={search}
        onSearchChange={setSearch}
      />
      <ReportsTable
        rows={pageRows}
        onReview={(id) => {
          void setReportStatus(id, "under_review");
          pushToast(t("reports.toastReview"), "success");
        }}
        onClose={(id) => {
          void setReportStatus(id, "closed");
          pushToast(t("reports.toastClosed"), "success");
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
