import { useState } from "react";
import type { ItemDetail } from "@/features/item-detail/types";

type ItemDetailGalleryProps = {
  detail: ItemDetail;
};

function slideImageSrc(slide: ItemDetail["gallery"][number], size: "main" | "thumb") {
  if (slide.url) return slide.url;
  const dims = size === "main" ? "960/640" : "120/90";
  return `https://picsum.photos/seed/${encodeURIComponent(slide.seed)}/${dims}`;
}

export function ItemDetailGallery({ detail }: ItemDetailGalleryProps) {
  const slides =
    detail.gallery.length > 0
      ? detail.gallery
      : [{ label: "Primary", seed: detail.primarySeed }];
  const [active, setActive] = useState(0);
  const current = slides[active];
  const hasHostedPhotos = slides.some((s) => Boolean(s.url));

  return (
    <section className="item-detail-card item-detail-gallery">
      <div className="item-detail-gallery__main">
        <img src={slideImageSrc(current, "main")} alt={detail.title} />
        <div className="item-detail-gallery__labels">
          <span>{current.label}</span>
          <span>
            {hasHostedPhotos ? "Uploaded media" : "No listing photos"} •{" "}
            {slides.length} file{slides.length === 1 ? "" : "s"}
          </span>
        </div>
        <div className="item-detail-gallery__tools">
          <button type="button" aria-label="Zoom">
            +
          </button>
          <button type="button" aria-label="Expand">
            ⤢
          </button>
        </div>
      </div>
      {slides.length > 1 && (
        <div className="item-detail-gallery__thumbs">
          {slides.map((slide, index) => (
            <button
              key={`${slide.seed}-${index}`}
              type="button"
              className={active === index ? "is-active" : undefined}
              onClick={() => setActive(index)}
            >
              <img src={slideImageSrc(slide, "thumb")} alt="" />
              <span>{slide.label}</span>
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
