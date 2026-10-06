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
          <h2>Owner account &amp; reliability record</h2>
          <a href="#owner">View owner profile</a>
        </div>
        <div className="item-detail-owner__body">
          <div className="item-detail-owner__avatar" aria-hidden>
            {detail.owner.name.charAt(0)}
          </div>
          <div>
            <strong>{detail.owner.name}</strong>
            <span>
              {detail.owner.handle} • {detail.owner.memberSince}
            </span>
            <span className="item-detail-owner__badge">{detail.owner.badge}</span>
          </div>
          <div className="item-detail-owner__stats">
            <div>
              <span>Trust score</span>
              <strong>{detail.owner.trustScore}</strong>
              <small>{detail.owner.swapsLabel}</small>
            </div>
            <div>
              <span>Infractions</span>
              <strong>{detail.owner.infractions}</strong>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
