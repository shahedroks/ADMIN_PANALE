import { useState } from "react";
import type { ItemDetail } from "@/features/item-detail/types";

type ItemDetailGalleryProps = {
  detail: ItemDetail;
};

export function ItemDetailGallery({ detail }: ItemDetailGalleryProps) {
  const [active, setActive] = useState(0);
  const slides = [
    { label: "Primary", seed: detail.primarySeed },
    ...detail.gallery,
  ];
  const current = slides[active];

  return (
    <section className="item-detail-card item-detail-gallery">
      <div className="item-detail-gallery__main">
        <img
          src={`https://picsum.photos/seed/${current.seed}/960/640`}
          alt=""
        />
        <div className="item-detail-gallery__labels">
          <span>Primary Evidence</span>
          <span>Original Asset • 4032 × 3024</span>
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
      <div className="item-detail-gallery__thumbs">
        {slides.slice(1).map((slide, index) => (
          <button
            key={slide.label}
            type="button"
            className={active === index + 1 ? "is-active" : undefined}
            onClick={() => setActive(index + 1)}
          >
            <img src={`https://picsum.photos/seed/${slide.seed}/120/90`} alt="" />
            <span>{slide.label}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
