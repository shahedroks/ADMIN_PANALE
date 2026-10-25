import { Link, useParams } from "react-router-dom";
import { ItemDetailAdjudicationPanel } from "@/features/item-detail/components/ItemDetailAdjudicationPanel";
import { ItemDetailMainColumn } from "@/features/item-detail/components/ItemDetailMainColumn";
import { useItemDetail } from "@/hooks/useFirestoreAdminData";
import "@/features/dashboard/styles/dashboard.css";
import "@/features/item-detail/styles/item-detail.css";

export function ItemDetailPage() {
  const { itemId } = useParams();
  const { detail, loading, error } = useItemDetail(itemId);

  if (loading) {
    return (
      <div className="dash-page item-detail-page">
        <p>Loading listing…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dash-page item-detail-page">
        <p className="items-review-error">{error}</p>
        <Link to="/items-review">← Back to Items Review</Link>
      </div>
    );
  }

  if (!detail) {
    return (
      <div className="dash-page item-detail-page">
        <p>Listing not found.</p>
        <Link to="/items-review">← Back to Items Review</Link>
      </div>
    );
  }

  return (
    <div className="dash-page item-detail-page">
      <header className="item-detail-header">
        <Link to="/items-review" className="item-detail-back">
          ← Back to Items Review
        </Link>
        <p className="item-detail-meta-line">
          {detail.listedOn}
          <span className="item-detail-meta-line__report">{detail.reportedMeta}</span>
        </p>
        <div className="item-detail-title-row">
          <h1>{detail.title}</h1>
          <span className="item-detail-code">{detail.itemCode}</span>
          <span className="item-detail-badge item-detail-badge--review">
            {detail.statusLabel}
          </span>
          <span className="item-detail-badge item-detail-badge--high">
            {detail.priorityLabel}
          </span>
        </div>
      </header>

      <div className="item-detail-layout">
        <ItemDetailMainColumn detail={detail} />
        <ItemDetailAdjudicationPanel detail={detail} itemRouteId={detail.routeId} />
      </div>
    </div>
  );
}
