import { useMemo, useState } from "react";
import { ItemReviewCard } from "@/features/items-review/components/ItemReviewCard";
import { PAGE_SIZE } from "@/features/items-review/data/itemsReviewData";
import type { ItemFilterTab, SortOption } from "@/features/items-review/types";
import { useDemoStore } from "@/store/demoStore";
import "@/features/dashboard/styles/dashboard.css";
import "@/features/items-review/styles/items-review.css";

export function ItemsReviewPage() {
  const {
    reviewItems,
    reviewTabCounts,
    hideReviewItem,
    requestEditReviewItem,
    batchApproveSafeItems,
    pushToast,
  } = useDemoStore();

  const visibleItems = useMemo(() => reviewItems.filter((i) => !i.hidden), [reviewItems]);

  const [tab, setTab] = useState<ItemFilterTab>("awaiting");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortOption>("oldest");
  const [page, setPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(
    () => new Set(visibleItems.filter((i) => i.selected).map((i) => i.id)),
  );

  const filtered = useMemo(() => {
    let list = visibleItems;

    if (tab === "awaiting") list = list.filter((i) => i.status === "awaiting");
    if (tab === "reviewed") list = list.filter((i) => i.status === "reviewed");

    const q = search.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (i) =>
          i.title.toLowerCase().includes(q) ||
          i.userName.toLowerCase().includes(q) ||
          i.id.toLowerCase().includes(q),
      );
    }

    list = [...list].sort((a, b) => {
      if (sort === "newest") return a.listedHoursAgo - b.listedHoursAgo;
      if (sort === "value") return a.estimatedValue.localeCompare(b.estimatedValue);
      return b.listedHoursAgo - a.listedHoursAgo;
    });

    return list;
  }, [tab, search, sort, visibleItems]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageItems = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const pendingTotal = visibleItems.filter((i) => i.status === "awaiting").length;
  const start = filtered.length === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1;
  const end = Math.min(safePage * PAGE_SIZE, filtered.length);

  function toggleSelect(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function handleBatchApprove() {
    const safeIds = [...selectedIds].filter((id) => {
      const item = reviewItems.find((i) => i.id === id);
      return item && item.status === "awaiting" && item.flagKind !== "report";
    });
    batchApproveSafeItems(safeIds);
    setSelectedIds(new Set());
  }

  return (
    <div className="dash-page items-review-page">
      <header className="items-review-header">
        <div className="items-review-header__title">
          <div className="items-review-header__row">
            <h1>Items Review</h1>
            <span className="items-review-badge">
              <i />
              {reviewTabCounts.awaiting} items awaiting review
            </span>
          </div>
          <p>Review listed items before making a decision.</p>
        </div>

        <div className="items-review-header__search">
          <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden>
            <circle cx="7" cy="7" r="5" stroke="#717974" fill="none" strokeWidth="1.2" />
            <path d="M11 11l3 3" stroke="#717974" strokeWidth="1.2" />
          </svg>
          <input
            type="search"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search items or swapper..."
            aria-label="Search items"
          />
        </div>

        <div className="items-review-header__tools">
          <button
            type="button"
            className="items-review-filters"
            onClick={() => pushToast("Advanced filters panel (demo).", "info")}
          >
            Filters
          </button>
          <button
            type="button"
            className="items-review-refresh"
            aria-label="Refresh"
            onClick={() => pushToast("Review queue synced with marketplace feed.", "info")}
          >
            ↻
          </button>
        </div>
      </header>

      <div className="items-review-toolbar">
        <div className="items-review-tabs" role="tablist">
          {(
            [
              ["all", `All items (${reviewTabCounts.all})`],
              ["awaiting", `Awaiting review (${reviewTabCounts.awaiting})`],
              ["reviewed", `Reviewed (${reviewTabCounts.reviewed})`],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              type="button"
              role="tab"
              aria-selected={tab === key}
              className={tab === key ? "items-review-tab is-active" : "items-review-tab"}
              onClick={() => {
                setTab(key);
                setPage(1);
              }}
            >
              {label}
            </button>
          ))}
        </div>
        <label className="items-review-sort">
          Sort by:
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortOption)}
          >
            <option value="oldest">Oldest first</option>
            <option value="newest">Newest first</option>
            <option value="value">Est. value</option>
          </select>
        </label>
      </div>

      <div className="items-review-grid">
        {pageItems.map((item) => (
          <ItemReviewCard
            key={item.id}
            item={item}
            selected={selectedIds.has(item.id)}
            onToggleSelect={() => toggleSelect(item.id)}
            onRequestEdit={() =>
              requestEditReviewItem(
                item.id,
                "Please update listing copy to stay within SWAP IT escrow rules.",
              )
            }
            onHide={() => hideReviewItem(item.id)}
          />
        ))}
      </div>

      <footer className="items-review-footer">
        <p>
          Showing {start}–{end} of {tab === "awaiting" ? pendingTotal : filtered.length}{" "}
          {tab === "awaiting" ? "pending" : ""} listings
        </p>
        <div className="items-review-pagination">
          <button
            type="button"
            disabled={safePage <= 1}
            onClick={() => setPage((p) => p - 1)}
            aria-label="Previous page"
          >
            ‹
          </button>
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              type="button"
              className={p === safePage ? "is-active" : undefined}
              onClick={() => setPage(p)}
            >
              {p}
            </button>
          ))}
          <button
            type="button"
            disabled={safePage >= totalPages}
            onClick={() => setPage((p) => p + 1)}
            aria-label="Next page"
          >
            ›
          </button>
        </div>
        <button type="button" className="items-review-batch" onClick={handleBatchApprove}>
          ✓ Approve all safe items (batch)
        </button>
      </footer>
    </div>
  );
}
