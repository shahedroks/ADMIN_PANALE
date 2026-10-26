import { useEffect, useState } from "react";
import type { SubscriptionPlan } from "@/features/subscriptions/data/plansManagementData";
import type { SubscriptionPlanUpdate } from "@/features/subscriptions/data/plansManagementData";
import { useI18n } from "@/i18n";

type PlanEditorPanelProps = {
  plan: SubscriptionPlan;
  onClose: () => void;
  onSave: (patch: SubscriptionPlanUpdate) => void;
};

export function PlanEditorPanel({ plan, onClose, onSave }: PlanEditorPanelProps) {
  const { t } = useI18n();
  const [cadence, setCadence] = useState(plan.cadence === "yearly" ? "yearly" : "monthly");
  const [unlimited, setUnlimited] = useState(plan.listingUnlimited);
  const [photos, setPhotos] = useState(plan.photosPerListing);
  const [radius, setRadius] = useState(plan.searchRadiusMiles);
  const [gates, setGates] = useState(plan.featureGates);

  useEffect(() => {
    setCadence(plan.cadence === "yearly" ? "yearly" : "monthly");
    setUnlimited(plan.listingUnlimited);
    setPhotos(plan.photosPerListing);
    setRadius(plan.searchRadiusMiles);
    setGates(plan.featureGates);
  }, [plan]);

  const activeGates = gates.filter((g) => g.enabled).length;

  function toggleGate(id: string) {
    setGates((prev) =>
      prev.map((g) => (g.id === id ? { ...g, enabled: !g.enabled } : g)),
    );
  }

  return (
    <aside className="plans-editor">
      <header className="plans-editor__head">
        <div>
          <span className="plans-editor__live">
            <i aria-hidden /> {t("subs.editor.live")}
          </span>
          <h2>{t("subs.editor.title", { name: plan.name })}</h2>
          <p className="plans-editor__sku">{t("subs.editor.sku", { sku: plan.sku })}</p>
        </div>
        <button type="button" className="plans-editor__close" onClick={onClose} aria-label={t("subs.editor.close")}>
          ×
        </button>
      </header>

      <div className="plans-editor__scroll">
        <section className="plans-editor__section">
          <h3>
            <span>1</span> {t("subs.editor.basic")}
          </h3>
          <label className="plans-field">
            {t("subs.editor.planName")}
            <input type="text" defaultValue={plan.name} readOnly />
          </label>
          <label className="plans-field">
            {t("subs.editor.planDesc")}
            <textarea rows={4} defaultValue={plan.longDescription} readOnly />
          </label>
          <div className="plans-field-row">
            <div className="plans-field">
              <span className="plans-field__label">{t("subs.editor.cadence")}</span>
              <div className="plans-cadence">
                <button
                  type="button"
                  className={cadence === "monthly" ? "is-on" : undefined}
                  onClick={() => setCadence("monthly")}
                >
                  {t("subs.editor.monthly")}
                </button>
                <button
                  type="button"
                  className={cadence === "yearly" ? "is-on" : undefined}
                  onClick={() => setCadence("yearly")}
                >
                  {t("subs.editor.yearly")}
                </button>
              </div>
            </div>
            <label className="plans-field">
              {t("subs.editor.price")}
              <div className="plans-price-row">
                <span className="plans-price-row__sym">$</span>
                <input type="text" defaultValue={plan.price.toFixed(2)} readOnly />
                <select defaultValue={plan.currency}>
                  <option value="USD">{t("subs.editor.usd")}</option>
                </select>
              </div>
            </label>
          </div>
        </section>

        <section className="plans-editor__section">
          <h3>
            <span>2</span> {t("subs.editor.quotas")}
          </h3>
          <label className="plans-quota-card">
            <input
              type="checkbox"
              checked={unlimited}
              onChange={(e) => setUnlimited(e.target.checked)}
            />
            <span>
              <strong>{t("subs.editor.unlimited")}</strong>
              <small>{t("subs.editor.unlimitedHint")}</small>
            </span>
          </label>
          <label className="plans-quota-card plans-quota-card--inline">
            <span>
              <strong>{t("subs.editor.photos")}</strong>
              <small>{t("subs.editor.photosHint")}</small>
            </span>
            <input
              type="number"
              min={1}
              max={24}
              value={photos}
              onChange={(e) => setPhotos(Number(e.target.value))}
            />
          </label>
          <div className="plans-slider-field">
            <div className="plans-slider-field__labels">
              <span>{t("subs.editor.radius")}</span>
              <strong>{t("subs.editor.radiusValue", { miles: radius })}</strong>
            </div>
            <input
              type="range"
              min={5}
              max={100}
              value={radius}
              onChange={(e) => setRadius(Number(e.target.value))}
            />
            <div className="plans-slider-field__ends">
              <span>{t("subs.editor.radiusMin")}</span>
              <span>{t("subs.editor.radiusMax")}</span>
            </div>
          </div>
        </section>

        <section className="plans-editor__section">
          <div className="plans-editor__section-head">
            <h3>
              <span>3</span> {t("subs.editor.gates")}
            </h3>
            <span className="plans-editor__gate-count">
              {t("subs.editor.gatesActive", { count: activeGates })}
            </span>
          </div>
          <ul className="plans-gates">
            {gates.map((gate) => (
              <li key={gate.id}>
                <div className="plans-gates__icon" aria-hidden />
                <div>
                  <strong>{gate.title}</strong>
                  <span>{gate.subtitle}</span>
                </div>
                <label className="plans-toggle">
                  <input
                    type="checkbox"
                    checked={gate.enabled}
                    onChange={() => toggleGate(gate.id)}
                  />
                  <span className="plans-toggle__track" />
                </label>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <footer className="plans-editor__foot">
        <button
          type="button"
          className="plans-btn plans-btn--primary"
          onClick={() =>
            onSave({
              cadence: cadence === "yearly" ? "yearly" : "monthly",
              listingUnlimited: unlimited,
              photosPerListing: photos,
              searchRadiusMiles: radius,
              featureGates: gates,
            })
          }
        >
          {t("subs.editor.save")}
        </button>
      </footer>
    </aside>
  );
}
