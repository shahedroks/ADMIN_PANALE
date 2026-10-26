import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ItemReviewCard } from "@/features/items-review/components/ItemReviewCard";
import { PAGE_SIZE } from "@/features/items-review/data/itemsReviewData";
import type { ItemFilterTab, SortOption } from "@/features/items-review/types";
import { DEFAULT_OWNER_EDIT_REQUEST_KEY } from "@/features/items-review/constants/moderationCopy";
import { useReviewItems } from "@/hooks/useFirestoreAdminData";
import { useI18n } from "@/i18n";
import { bootstrapSwapItFirestore } from "@/services/firestore/bootstrapFirestoreService";
import { useDemoStore } from "@/store/demoStore";
import "@/features/dashboard/styles/dashboard.css";
import "@/features/items-review/styles/items-review.css";

export function ItemsReviewPage() {
  const { t } = useI18n();
  const [searchParams] = useSearchParams();
  const ownerId = searchParams.get("owner")?.trim() ?? "";
  const { items: reviewItems, reload, moderate, batchApprove, loading, error } =
    useReviewItems();
  const { pushToast } = useDemoStore();

  const visibleItems = useMemo(() => {
    let list = reviewItems.filter((i) => !i.hidden);
    if (ownerId) {
      list = list.filter((i) => i.ownerId === ownerId);
    }
    return list;
  }, [reviewItems, ownerId]);

  const [search, setSearch] = useState("");

  const reviewTabCounts = useMemo(
    () => ({
      all: visibleItems.length,
      awaiting: visibleItems.filter((i) => i.status === "awaiting").length,
      reviewed: visibleItems.filter((i) => i.status === "reviewed").length,
    }),
    [visibleItems],
  );

  const [tab, setTab] = useState<ItemFilterTab>("all");
  const [sort, setSort] = useState<SortOption>("oldest");
  const [page, setPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [seeding, setSeeding] = useState(false);

  async function handleSeedDemo() {
    setSeeding(true);
    try {
      const result = await bootstrapSwapItFirestore();
      await reload();
      pushToast(
        t("itemsReview.toast.seed", {
          items: result.items,
          categories: result.categories,
        }),
        "success",
      );
    } catch (e) {
      pushToast(
        e instanceof Error ? e.message : t("itemsReview.toast.seedError"),
        "error",
      );
    } finally {
      setSeeding(false);
    }
  }

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

  async function handleBatchApprove() {
    const safeIds = [...selectedIds].filter((id) => {
      const item = reviewItems.find((i) => i.id === id);
      return item && item.status === "awaiting" && item.flagKind !== "report";
    });
    try {
      await batchApprove(safeIds);
      pushToast(t("itemsReview.toast.batch", { count: safeIds.length }), "success");
    } catch (e) {
      pushToast(e instanceof Error ? e.message : t("itemsReview.toast.batchFail"), "error");
    }
    setSelectedIds(new Set());
  }

  return (
    <div className="dash-page items-review-page">
      {loading && <p className="items-review-loading">{t("itemsReview.loading")}</p>}
      {error && <p className="items-review-error">{error}</p>}
      {ownerId && (
        <p className="items-review-scope">
          {t("itemsReview.scope")} <code>{ownerId.slice(0, 8)}…</code>
          {" · "}
          <a href="/items-review">{t("itemsReview.clearFilter")}</a>
        </p>
      )}
      <header className="items-review-header">
        <div className="items-review-header__title">
          <div className="items-review-header__row">
            <h1>{t("itemsReview.title")}</h1>
            <span className="items-review-badge">
              <i />
              {t("itemsReview.awaiting", { count: reviewTabCounts.awaiting })}
            </span>
          </div>
          <p>{t("itemsReview.subtitle")}</p>
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
            placeholder={t("itemsReview.search")}
            aria-label={t("itemsReview.searchAria")}
          />
        </div>

        <div className="items-review-header__tools">
          <button
            type="button"
            className="items-review-filters"
            onClick={() => pushToast(t("itemsReview.toast.filters"), "info")}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden>
              <path
                d="M1 3h12M3 7h8M5 11h4"
                stroke="currentColor"
                strokeWidth="1.3"
                strokeLinecap="round"
              />
            </svg>
            {t("itemsReview.filters")}
          </button>
          <button
            type="button"
            className="items-review-refresh"
            aria-label={t("itemsReview.refresh")}
            onClick={() => void reload()}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden>
              <path
                d="M13 3v4H9M3 13V9h4M12.5 6A5.5 5.5 0 103 8.5"
                stroke="currentColor"
                fill="none"
                strokeWidth="1.3"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
      </header>

      <div className="items-review-toolbar">
        <div className="items-review-tabs" role="tablist">
          {(
            [
              ["all", "itemsReview.tab.all", reviewTabCounts.all],
              ["awaiting", "itemsReview.tab.awaiting", reviewTabCounts.awaiting],
              ["reviewed", "itemsReview.tab.reviewed", reviewTabCounts.reviewed],
            ] as const
          ).map(([key, labelKey, count]) => (
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
              <span className="items-review-tab__label">{t(labelKey)}</span>
              <span className="items-review-tab__count">{count}</span>
            </button>
          ))}
        </div>
        <label className="items-review-sort">
          {t("itemsReview.sort")}
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortOption)}
          >
            <option value="oldest">{t("itemsReview.sort.oldest")}</option>
            <option value="newest">{t("itemsReview.sort.newest")}</option>
            <option value="value">{t("itemsReview.sort.value")}</option>
          </select>
        </label>
      </div>

      {!loading && !error && filtered.length === 0 && (
        <div className="items-review-empty">
          <p>{t("itemsReview.empty")}</p>
          <button
            type="button"
            className="items-review-seed-btn"
            disabled={seeding}
            onClick={() => void handleSeedDemo()}
          >
            {seeding ? t("itemsReview.seeding") : t("itemsReview.seed")}
          </button>
        </div>
      )}

      <div className="items-review-grid">
        {pageItems.map((item) => (
          <ItemReviewCard
            key={item.id}
            item={item}
            selected={selectedIds.has(item.id)}
            onToggleSelect={() => toggleSelect(item.id)}
            onRequestEdit={() =>
              void moderate(
                item.id,
                "request_edit",
                t(DEFAULT_OWNER_EDIT_REQUEST_KEY),
              )
            }
            onHide={() => void moderate(item.id, "hide")}
          />
        ))}
      </div>

      <footer className="items-review-footer">
        <p>
          {t("itemsReview.footer", {
            start,
            end,
            total: tab === "awaiting" ? pendingTotal : filtered.length,
            pendingWord: tab === "awaiting" ? t("itemsReview.pendingWord") : "",
          })}
        </p>
        <div className="items-review-pagination">
          <button
            type="button"
            disabled={safePage <= 1}
            onClick={() => setPage((p) => p - 1)}
            aria-label={t("itemsReview.prevPage")}
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
            aria-label={t("itemsReview.nextPage")}
          >
            ›
          </button>
        </div>
        <button type="button" className="items-review-batch" onClick={() => void handleBatchApprove()}>
          {t("itemsReview.batchApprove")}
        </button>
      </footer>
    </div>
  );
}
