import { Link } from "react-router-dom";
import type { ReviewItem } from "@/features/items-review/types";
import { useI18n } from "@/i18n";

function FlagGlyph({ kind }: { kind: ReviewItem["flagKind"] }) {
  const stroke = "#B45309";
  switch (kind) {
    case "report":
      return (
        <svg viewBox="0 0 16 16" aria-hidden>
          <path d="M8 1.5L1.5 13h13L8 1.5z" stroke={stroke} fill="none" strokeWidth="1.2" />
          <path d="M8 6v3.5M8 11.5h.01" stroke={stroke} strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      );
    case "automated":
      return (
        <svg viewBox="0 0 16 16" aria-hidden>
          <rect x="3" y="5" width="10" height="7" rx="1" stroke={stroke} fill="none" strokeWidth="1.2" />
          <circle cx="6" cy="8.5" r="1" fill={stroke} />
          <circle cx="10" cy="8.5" r="1" fill={stroke} />
          <path d="M5 5V4a3 3 0 016 0v1" stroke={stroke} strokeWidth="1.2" />
        </svg>
      );
    case "trust":
      return (
        <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden>
          <path d="M7 1L2 3v4c0 3 2.2 5.8 5 6.5 2.8-.7 5-3.5 5-6.5V3L7 1z" stroke={stroke} fill="none" />
        </svg>
      );
    case "policy":
      return (
        <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden>
          <path d="M3 2h8v10H3V2zM5 5h4M5 8h4" stroke={stroke} fill="none" />
        </svg>
      );
  }
}

type ItemReviewCardProps = {
  item: ReviewItem;
  selected: boolean;
  onToggleSelect: () => void;
  onRequestEdit: () => void;
  onHide: () => void;
};

export function ItemReviewCard({
  item,
  selected,
  onToggleSelect,
  onRequestEdit,
  onHide,
}: ItemReviewCardProps) {
  const { t } = useI18n();
  const imageUrl = item.thumbnailUrl ?? "";

  function listingStatusLabel(listingStatus: ReviewItem["listingStatus"]): string {
    switch (listingStatus) {
      case "approved":
        return t("itemCard.approved");
      case "pending":
        return t("itemCard.pending");
      case "hidden":
        return t("itemCard.hidden");
      case "rejected":
        return t("itemCard.rejected");
      default:
        return listingStatus;
    }
  }

  function showModerationFlag(reviewItem: ReviewItem): boolean {
    if (reviewItem.listingStatus === "pending") return true;
    return Boolean(reviewItem.flagTitle.trim() || reviewItem.flagMessage.trim());
  }

  return (
    <article className={`item-card${selected ? " item-card--selected" : ""}`}>
      <div className="item-card__media">
        <img src={imageUrl} alt="" loading="lazy" />
        <span className="item-card__category">{item.category}</span>
        <button type="button" className="item-card__favorite" aria-label={t("itemCard.save")}>
          <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden>
            <path
              d="M7 12.5S1.5 9 1.5 5.5a3 3 0 016 0 3 3 0 016 0c0 3.5-5.5 7-5.5 7z"
              stroke="currentColor"
              fill="none"
              strokeWidth="1.2"
            />
          </svg>
        </button>
        <span className="item-card__id">{t("itemCard.id")}{item.id}</span>
      </div>

      <div className="item-card__body">
        <div className="item-card__meta">
          <span
            className={
              item.listingStatus === "approved"
                ? "item-card__status item-card__status--done"
                : item.listingStatus === "pending"
                  ? "item-card__status"
                  : "item-card__status item-card__status--done"
            }
          >
            <i /> {listingStatusLabel(item.listingStatus)}
          </span>
          <span className="item-card__time">
            {t("itemCard.listed", { hours: item.listedHoursAgo })}
          </span>
        </div>

        <h2>
          <Link to={`/items-review/${item.id}`} className="item-card__title-link">
            {item.title}
          </Link>
        </h2>

        <div className="item-card__user">
          <span className="item-card__avatar" aria-hidden>
            {item.userName.charAt(0)}
          </span>
          <div>
            <span className="item-card__user-type">{item.userType}</span>
            <strong>
              {item.userName}
              {item.userVerified && <span className="item-card__verified">✓</span>}
              {item.userRating != null && (
                <span className="item-card__rating">★ {item.userRating}</span>
              )}
            </strong>
          </div>
        </div>

        {showModerationFlag(item) && (
          <div className={`item-card__flag item-card__flag--${item.flagKind}`}>
            <span className="item-card__flag-icon" aria-hidden>
              <FlagGlyph kind={item.flagKind} />
            </span>
            <div>
              <strong>
                {(item.flagTitle || t("itemCard.flag")).toUpperCase()}
              </strong>
              {item.flagMessage ? <p>{item.flagMessage}</p> : null}
            </div>
          </div>
        )}

        <div className="item-card__tags">
          <span>{t("itemCard.condition", { value: item.condition })}</span>
          <span>{t("itemCard.value", { value: item.estimatedValue })}</span>
          <span>{item.location}</span>
        </div>

        <div className="item-card__actions">
          <button
            type="button"
            className="item-card__btn item-card__btn--edit"
            onClick={onRequestEdit}
          >
            {t("itemCard.requestEdit")}
          </button>
          <button type="button" className="item-card__btn item-card__btn--hide" onClick={onHide}>
            {t("itemCard.hide")}
          </button>
          <button
            type="button"
            className={`item-card__select${selected ? " is-on" : ""}`}
            onClick={onToggleSelect}
            aria-label={selected ? t("itemCard.deselect") : t("itemCard.select")}
          >
            ✓
          </button>
        </div>
      </div>
    </article>
  );
}
