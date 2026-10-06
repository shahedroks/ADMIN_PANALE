import type { ReportFilterTab } from "@/features/reports/types";

type ReportToolbarProps = {
  activeTab: ReportFilterTab;
  onTabChange: (tab: ReportFilterTab) => void;
  counts: { all: number; high: number; under_review: number };
  search: string;
  onSearchChange: (value: string) => void;
};

export function ReportToolbar({
  activeTab,
  onTabChange,
  counts,
  search,
  onSearchChange,
}: ReportToolbarProps) {
  return (
    <div className="reports-toolbar">
      <div className="reports-toolbar__tabs" role="tablist" aria-label="Filter reports">
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "all"}
          className={activeTab === "all" ? "reports-tab reports-tab--active" : "reports-tab"}
          onClick={() => onTabChange("all")}
        >
          All {counts.all}
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "high"}
          className={activeTab === "high" ? "reports-tab reports-tab--active" : "reports-tab"}
          onClick={() => onTabChange("high")}
        >
          <span className="reports-tab__flag" aria-hidden />
          High priority {counts.high}
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "under_review"}
          className={
            activeTab === "under_review" ? "reports-tab reports-tab--active" : "reports-tab"
          }
          onClick={() => onTabChange("under_review")}
        >
          <span className="reports-tab__clock" aria-hidden />
          Under review {counts.under_review}
        </button>
      </div>

      <div className="reports-toolbar__search">
        <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden>
          <circle cx="7" cy="7" r="5" stroke="#717974" fill="none" strokeWidth="1.2" />
          <path d="M11 11l3 3" stroke="#717974" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
        <input
          type="search"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search reports by ID, user, or keyword..."
          aria-label="Search reports"
        />
        <button type="button" className="reports-toolbar__filter" aria-label="Advanced filters">
          <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden>
            <path d="M2 4h12M4 8h8M6 12h4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
          </svg>
        </button>
      </div>
    </div>
  );
}
