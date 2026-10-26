import { useState } from "react";
import type { ItemDetail } from "@/features/item-detail/types";
import { useI18n } from "@/i18n";

type ItemDetailGalleryProps = {
  detail: ItemDetail;
};

function slideImageSrc(slide: ItemDetail["gallery"][number], size: "main" | "thumb") {
  if (slide.url) return slide.url;
  const dims = size === "main" ? "960/640" : "120/90";
  return `https://picsum.photos/seed/${encodeURIComponent(slide.seed)}/${dims}`;
}

export function ItemDetailGallery({ detail }: ItemDetailGalleryProps) {
  const { t } = useI18n();
  const slides =
    detail.gallery.length > 0
      ? detail.gallery
      : [{ label: t("gallery.primary"), seed: detail.primarySeed }];
  const [active, setActive] = useState(0);
  const current = slides[active];
  const hasHostedPhotos = slides.some((s) => Boolean(s.url));
  const fileCountLabel =
    slides.length === 1
      ? t("gallery.file", { count: slides.length })
      : t("gallery.files", { count: slides.length });

  return (
    <section className="item-detail-card item-detail-gallery">
      <div className="item-detail-gallery__main">
        <img src={slideImageSrc(current, "main")} alt={detail.title} />
        <div className="item-detail-gallery__labels">
          <span>{current.label}</span>
          <span>
            {hasHostedPhotos ? t("gallery.uploaded") : t("gallery.none")} • {fileCountLabel}
          </span>
        </div>
        <div className="item-detail-gallery__tools">
          <button type="button" aria-label={t("gallery.zoom")}>
            +
          </button>
          <button type="button" aria-label={t("gallery.expand")}>
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
