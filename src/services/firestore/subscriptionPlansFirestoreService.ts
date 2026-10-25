import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";

import {
  subscriptionPlans as defaultPlans,
  type SubscriptionPlan,
} from "@/features/subscriptions/data/plansManagementData";
import { db } from "@/lib/firebase";

const PLANS_DOC = doc(db, "settings", "subscriptionPlans");

function clonePlans(plans: SubscriptionPlan[]): SubscriptionPlan[] {
  return plans.map((p) => ({
    ...p,
    featureGates: p.featureGates.map((g) => ({ ...g })),
  }));
}

export async function fetchSubscriptionPlans(): Promise<SubscriptionPlan[]> {
  const snap = await getDoc(PLANS_DOC);
  const raw = snap.data()?.plans;
  if (Array.isArray(raw) && raw.length > 0) {
    return raw as SubscriptionPlan[];
  }
  const seeded = clonePlans(defaultPlans);
  await setDoc(
    PLANS_DOC,
    { plans: seeded, updatedAt: serverTimestamp(), seededFrom: "defaults" },
    { merge: true },
  );
  return seeded;
}

export type SubscriptionPlanUpdate = Pick<
  SubscriptionPlan,
  "listingUnlimited" | "photosPerListing" | "searchRadiusMiles" | "featureGates" | "cadence"
>;

export async function updateSubscriptionPlanFirestore(
  planId: string,
  patch: SubscriptionPlanUpdate,
): Promise<SubscriptionPlan[]> {
  const plans = await fetchSubscriptionPlans();
  const next = plans.map((p) =>
    p.id === planId
      ? {
          ...p,
          ...patch,
          featureGates: patch.featureGates.map((g) => ({ ...g })),
        }
      : p,
  );
  await setDoc(PLANS_DOC, { plans: next, updatedAt: serverTimestamp() }, { merge: true });
  return next;
}
