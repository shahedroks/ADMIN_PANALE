import type { ItemDetail } from "@/features/item-detail/types";
import { ItemDetailGallery } from "@/features/item-detail/components/ItemDetailGallery";

type ItemDetailMainColumnProps = {
  detail: ItemDetail;
};

function renderHighlightedDescription(detail: ItemDetail) {
  const parts = detail.description.split(detail.highlightSnippet);
  if (parts.length === 1) return detail.description;

  return (
    <>
      {parts[0]}
      <mark className="item-detail-highlight">{detail.highlightSnippet}</mark>
      {parts[1]}
    </>
  );
}

export function ItemDetailMainColumn({ detail }: ItemDetailMainColumnProps) {
  return (
    <div className="item-detail-main">
      <ItemDetailGallery detail={detail} />

      <section className="item-detail-card">
        <h2>Listing details</h2>
        <div className="item-detail-meta-grid">
          <div>
            <span>Primary category</span>
            <strong>{detail.category}</strong>
          </div>
          <div>
            <span>Claimed condition</span>
            <strong>{detail.condition}</strong>
          </div>
          <div>
            <span>Source</span>
            <strong>{detail.createdVia}</strong>
          </div>
        </div>

        <p className="item-detail-section-label">What they want in exchange</p>
        <div className="item-detail-tags">
          {detail.exchangeTags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>

        <p className="item-detail-section-label">User description</p>
        <div className="item-detail-description">
          {renderHighlightedDescription(detail)}
        </div>

        <div className="item-detail-violation">
          <strong>Flagged rule violation: Rule {detail.violation.ruleId}</strong>
          <p>{detail.violation.title}</p>
          <p>{detail.violation.summary}</p>
          <p className="item-detail-violation__hits">
            NLP hits: {detail.violation.nlpHits.join(", ")}
          </p>
        </div>
      </section>

      <section className="item-detail-card item-detail-owner">
        <div className="item-detail-owner__head">
          <h2>
            <svg viewBox="0 0 16 16" aria-hidden>
              <path
                d="M8 1.5 2.5 3.8v4.1c0 3.1 2.1 5.9 5.5 7.1 3.4-1.2 5.5-4 5.5-7.1V3.8L8 1.5Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.25"
              />
              <path
                d="m5.7 8.1 1.5 1.5 3.2-3.2"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.25"
              />
            </svg>
            Owner account &amp; reliability record
          </h2>
          <a href="#owner">
            View owner profile <span aria-hidden>→</span>
          </a>
        </div>
        <div className="item-detail-owner__body">
          <img
            className="item-detail-owner__avatar"
            src={`https://i.pravatar.cc/80?u=${encodeURIComponent(detail.owner.handle)}`}
            alt=""
          />
          <div className="item-detail-owner__identity">
            <div className="item-detail-owner__name">
              <strong>{detail.owner.name}</strong>
              <span>{detail.owner.handle}</span>
            </div>
            <p>
              {detail.owner.badge} <i aria-hidden>•</i> {detail.owner.memberSince}
            </p>
          </div>
          <div className="item-detail-owner__stats">
            <div className="item-detail-owner__stat item-detail-owner__stat--trust">
              <span>Trust score</span>
              <strong>{detail.owner.trustScore}</strong>
              <small>{detail.owner.swapsLabel}</small>
            </div>
            <div className="item-detail-owner__stat">
              <span>Infractions</span>
              <strong>{detail.owner.infractions}</strong>
              <small>
                {detail.owner.infractions.startsWith("0")
                  ? "Clean disciplinary history"
                  : "Review account history"}
              </small>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
