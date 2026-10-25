import { useCallback, useEffect, useState } from "react";

import type { SubscriptionPlan } from "@/features/subscriptions/data/plansManagementData";
import { callUpdateSubscriptionPlan } from "@/lib/callableFunctions";
import {
  fetchSubscriptionPlans,
  updateSubscriptionPlanFirestore,
  type SubscriptionPlanUpdate,
} from "@/services/firestore/subscriptionPlansFirestoreService";
import { getCountFromServer, collection, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { plansSummaryKpis } from "@/features/subscriptions/data/plansManagementData";

export type PlanSummaryKpi = (typeof plansSummaryKpis)[number];

export function useSubscriptionPlans() {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [kpis, setKpis] = useState<PlanSummaryKpi[]>(plansSummaryKpis);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const nextPlans = await fetchSubscriptionPlans();
      setPlans(nextPlans);

      const usersCol = collection(db, "users");
      const [totalUsers, paidSnap] = await Promise.all([
        getCountFromServer(query(usersCol)).catch(() => null),
        getCountFromServer(
          query(usersCol, where("subscriptionTier", "in", ["premium", "monthly", "yearly"])),
        ).catch(() => null),
      ]);
      const total = totalUsers?.data().count ?? 0;
      const paid = paidSnap?.data().count ?? 0;
      const conversion = total > 0 ? `${((paid / total) * 100).toFixed(1)}%` : "—";

      setKpis([
        {
          ...plansSummaryKpis[0],
          value: paid.toLocaleString(),
          hint: total > 0 ? `${conversion} of members` : "Live platform data",
        },
        {
          ...plansSummaryKpis[1],
          value: "—",
          hint: "Connect billing for MRR",
        },
        {
          ...plansSummaryKpis[2],
          value: total.toLocaleString(),
          hint: "Registered swappers",
        },
        {
          ...plansSummaryKpis[3],
          value: conversion,
          hint: "Paid tier share",
        },
      ]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load plans");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  const updatePlan = useCallback(
    async (planId: string, patch: SubscriptionPlanUpdate) => {
      try {
        await callUpdateSubscriptionPlan({ planId, patch });
      } catch {
        await updateSubscriptionPlanFirestore(planId, patch);
      }
      await reload();
    },
    [reload],
  );

  return { plans, kpis, loading, error, reload, updatePlan };
}

export type { SubscriptionPlanUpdate };
