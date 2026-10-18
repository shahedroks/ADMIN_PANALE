import { useCallback, useEffect, useState } from "react";

import type { ItemDetail } from "@/features/item-detail/types";
import type { ReviewItem } from "@/features/items-review/types";
import type { ModerationReport } from "@/features/reports/types";
import type { SwapperMember } from "@/features/users/types";
import {
  callBanUser,
  callLiftRestriction,
  callModerateItem,
  callModerateItemBatch,
  callRestrictUser,
  callUpdateReport,
} from "@/lib/callableFunctions";
import {
  fetchDashboardCounts,
  type DashboardCounts,
} from "@/services/firestore/dashboardFirestoreService";
import {
  fetchItemDetail,
  fetchPendingReviewItems,
} from "@/services/firestore/itemsFirestoreService";
import { fetchReports } from "@/services/firestore/reportsFirestoreService";
import { fetchSwapperMembers } from "@/services/firestore/usersFirestoreService";

export function useReviewItems() {
  const [items, setItems] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setItems(await fetchPendingReviewItems());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load items");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  const moderate = useCallback(
    async (itemId: string, action: "approve" | "hide" | "reject" | "request_edit", note?: string) => {
      await callModerateItem({ itemId, action, note });
      await reload();
    },
    [reload],
  );

  const batchApprove = useCallback(
    async (itemIds: string[]) => {
      await callModerateItemBatch({ itemIds, action: "approve" });
      await reload();
    },
    [reload],
  );

  return { items, loading, error, reload, moderate, batchApprove };
}

export function useSwapperMembers() {
  const [members, setMembers] = useState<SwapperMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setMembers(await fetchSwapperMembers());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load users");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  return {
    members,
    loading,
    error,
    reload,
    restrictMember: async (userId: string) => {
      await callRestrictUser({ userId });
      await reload();
    },
    banMember: async (userId: string) => {
      await callBanUser({ userId });
      await reload();
    },
    liftMemberRestriction: async (userId: string) => {
      await callLiftRestriction({ userId });
      await reload();
    },
  };
}

export function useModerationReports() {
  const [reports, setReports] = useState<ModerationReport[]>([]);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      setReports(await fetchReports());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  return {
    reports,
    loading,
    reload,
    setReportStatus: async (id: string, status: ModerationReport["status"]) => {
      await callUpdateReport({ reportId: id, status });
      await reload();
    },
  };
}

export function useDashboardCounts() {
  const [counts, setCounts] = useState<DashboardCounts | null>(null);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      setCounts(await fetchDashboardCounts());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  return { counts, loading, reload };
}

export function useItemDetail(itemId: string | undefined) {
  const [detail, setDetail] = useState<ItemDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!itemId) return;
    setLoading(true);
    void fetchItemDetail(itemId).then((d) => {
      setDetail(d);
      setLoading(false);
    });
  }, [itemId]);

  return { detail, loading };
}
