import { useEffect, useState } from "react";
import type { SubscriptionPlan } from "@/features/subscriptions/data/plansManagementData";
import type { SubscriptionPlanUpdate } from "@/store/demoStore";

type PlanEditorPanelProps = {
  plan: SubscriptionPlan;
  onClose: () => void;
  onSave: (patch: SubscriptionPlanUpdate) => void;
};

export function PlanEditorPanel({ plan, onClose, onSave }: PlanEditorPanelProps) {
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
            <i aria-hidden /> Live configuration
          </span>
          <h2>Edit Plan: {plan.name}</h2>
          <p className="plans-editor__sku">SKU: #{plan.sku}</p>
        </div>
        <button type="button" className="plans-editor__close" onClick={onClose} aria-label="Close">
          ×
        </button>
      </header>

      <div className="plans-editor__scroll">
        <section className="plans-editor__section">
          <h3>
            <span>1</span> Basic Information
          </h3>
          <label className="plans-field">
            Plan Name
            <input type="text" defaultValue={plan.name} readOnly />
          </label>
          <label className="plans-field">
            Plan Description
            <textarea rows={4} defaultValue={plan.longDescription} readOnly />
          </label>
          <div className="plans-field-row">
            <div className="plans-field">
              <span className="plans-field__label">Billing Cadence</span>
              <div className="plans-cadence">
                <button
                  type="button"
                  className={cadence === "monthly" ? "is-on" : undefined}
                  onClick={() => setCadence("monthly")}
                >
                  Monthly
                </button>
                <button
                  type="button"
                  className={cadence === "yearly" ? "is-on" : undefined}
                  onClick={() => setCadence("yearly")}
                >
                  Yearly
                </button>
              </div>
            </div>
            <label className="plans-field">
              Price &amp; Currency
              <div className="plans-price-row">
                <span className="plans-price-row__sym">$</span>
                <input type="text" defaultValue={plan.price.toFixed(2)} readOnly />
                <select defaultValue={plan.currency}>
                  <option value="USD">USD</option>
                </select>
              </div>
            </label>
          </div>
        </section>

        <section className="plans-editor__section">
          <h3>
            <span>2</span> Core Quotas &amp; Limits
          </h3>
          <label className="plans-quota-card">
            <input
              type="checkbox"
              checked={unlimited}
              onChange={(e) => setUnlimited(e.target.checked)}
            />
            <span>
              <strong>Unlimited Listings</strong>
              <small>Remove listing cap for this tier</small>
            </span>
          </label>
          <label className="plans-quota-card plans-quota-card--inline">
            <span>
              <strong>Photos per Listing</strong>
              <small>Max 24 HQ photos</small>
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
              <span>Discovery &amp; Search Radius</span>
              <strong>{radius} Miles</strong>
            </div>
            <input
              type="range"
              min={5}
              max={100}
              value={radius}
              onChange={(e) => setRadius(Number(e.target.value))}
            />
            <div className="plans-slider-field__ends">
              <span>5 mi (Local)</span>
              <span>100 mi (Statewide)</span>
            </div>
          </div>
        </section>

        <section className="plans-editor__section">
          <div className="plans-editor__section-head">
            <h3>
              <span>3</span> Feature Entitlement Gates
            </h3>
            <span className="plans-editor__gate-count">{activeGates} Active</span>
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
          Save Changes
        </button>
      </footer>
    </aside>
  );
}
