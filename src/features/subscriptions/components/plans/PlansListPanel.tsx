import { useMemo, useState } from "react";
import type {
  PlanFilterTab,
  SubscriptionPlan,
} from "@/features/subscriptions/data/plansManagementData";

type PlansListPanelProps = {
  plans: SubscriptionPlan[];
  selectedId: string;
  onSelect: (id: string) => void;
};

function PlanRowIcon({ tone }: { tone: SubscriptionPlan["iconTone"] }) {
  const className = `plans-row__icon plans-row__icon--${tone}`;
  return (
    <span className={className} aria-hidden>
      {tone === "premium" && (
        <svg viewBox="0 0 14 18">
          <path fill="currentColor" d="M7 1 1 4v4c0 3.5 2.5 6.5 6 8 3.5-1.5 6-4.5 6-8V4L7 1Z" />
        </svg>
      )}
      {tone === "monthly" && (
        <svg viewBox="0 0 12 18">
          <path fill="currentColor" d="M6 0 0 6h4v12h4V6h4L6 0Z" />
        </svg>
      )}
      {tone === "free" && (
        <svg viewBox="0 0 16 16">
          <path fill="currentColor" d="M8 2C5 2 3 4.5 3 7c0 3.5 5 7 5 7s5-3.5 5-7c0-2.5-2-5-5-5Z" />
        </svg>
      )}
      {tone === "draft" && (
        <svg viewBox="0 0 14 14">
          <path fill="currentColor" d="M2 2h10v10H2V2Zm2 2v6h6V4H4Z" />
        </svg>
      )}
    </span>
  );
}

export function PlansListPanel({ plans, selectedId, onSelect }: PlansListPanelProps) {
  const [tab, setTab] = useState<PlanFilterTab>("all");
  const [query, setQuery] = useState("");

  const counts = useMemo(
    () => ({
      all: plans.length,
      active: plans.filter((p) => p.status === "active").length,
      draft: plans.filter((p) => p.status === "draft").length,
    }),
    [plans],
  );

  const filtered = useMemo(() => {
    let list = plans;
    if (tab === "active") list = list.filter((p) => p.status === "active");
    if (tab === "draft") list = list.filter((p) => p.status === "draft");
    const q = query.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q),
      );
    }
    return list;
  }, [plans, tab, query]);

  return (
    <section className="plans-list-card">
      <div className="plans-list-card__toolbar">
        <div className="plans-tabs" role="tablist">
          <button
            type="button"
            role="tab"
            className={tab === "all" ? "plans-tab plans-tab--active" : "plans-tab"}
            onClick={() => setTab("all")}
          >
            All Plans ({counts.all})
          </button>
          <button
            type="button"
            role="tab"
            className={tab === "active" ? "plans-tab plans-tab--active" : "plans-tab"}
            onClick={() => setTab("active")}
          >
            Active ({counts.active})
          </button>
          <button
            type="button"
            role="tab"
            className={tab === "draft" ? "plans-tab plans-tab--active" : "plans-tab"}
            onClick={() => setTab("draft")}
          >
            Draft / Inactive ({counts.draft})
          </button>
        </div>
        <div className="plans-list-search">
          <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden>
            <circle cx="6" cy="6" r="4.5" stroke="#717974" fill="none" />
            <path d="M9.5 9.5 12 12" stroke="#717974" />
          </svg>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by plan name, SKU..."
            aria-label="Search plans"
          />
        </div>
      </div>

      <div className="plans-table-head">
        <span>Plan &amp; SKU</span>
        <span>Price</span>
      </div>

      <ul className="plans-rows">
        {filtered.map((plan) => (
          <li key={plan.id}>
            <button
              type="button"
              className={
                plan.id === selectedId ? "plans-row plans-row--selected" : "plans-row"
              }
              onClick={() => onSelect(plan.id)}
            >
              <div className="plans-row__main">
                <PlanRowIcon tone={plan.iconTone} />
                <div className="plans-row__copy">
                  <div className="plans-row__title-line">
                    <strong>{plan.name}</strong>
                    <span className={`plans-row__badge plans-row__badge--${plan.badgeTone}`}>
                      {plan.badge}
                    </span>
                    {plan.status === "draft" && (
                      <span className="plans-row__status-pill">Inactive</span>
                    )}
                  </div>
                  <p>{plan.description}</p>
                  <code>{plan.sku}</code>
                </div>
              </div>
              <div className="plans-row__price">
                <strong>{plan.priceDisplay}</strong>
                {plan.priceSub && <span>{plan.priceSub}</span>}
              </div>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
