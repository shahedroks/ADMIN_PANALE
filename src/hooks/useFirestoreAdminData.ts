import { useCallback, useEffect, useState } from "react";

import type { ItemDetail } from "@/features/item-detail/types";
import type { ReviewItem } from "@/features/items-review/types";
import type { ModerationReport } from "@/features/reports/types";
import {
  buildUserManagementMetrics,
  type UserManagementMetrics,
} from "@/features/users/utils/userManagementMetrics";
import type { SwapperMember } from "@/features/users/types";
import {
  callBanUser,
  callDeleteUser,
  callLiftRestriction,
  callModerateItem,
  callModerateItemBatch,
  callRestrictUser,
  callUpdateReport,
} from "@/lib/callableFunctions";
import { auth } from "@/lib/firebase";
import {
  moderateItemBatchFirestore,
  moderateItemFirestore,
} from "@/services/firestore/itemsModerationFirestoreService";
import {
  fetchDashboardSnapshot,
  type DashboardSnapshot,
} from "@/services/firestore/dashboardFirestoreService";
import {
  fetchItemDetail,
  fetchPendingReviewItems,
} from "@/services/firestore/itemsFirestoreService";
import { fetchReports } from "@/services/firestore/reportsFirestoreService";
import {
  countMembersJoinedSince,
  fetchOpenReportCount,
  subscribeSwapperMembers,
  subscribeUserMember,
} from "@/services/firestore/usersFirestoreService";
import { buildUserDetailProfile } from "@/features/user-detail/utils/buildUserDetailProfile";
import type { UserDetailProfile, UserRestrictionSettings } from "@/features/user-detail/types";
import {
  fetchListedItemsForUser,
  fetchReportsForUser,
} from "@/services/firestore/userDetailFirestoreService";
import {
  banUserFirestore,
  liftRestrictionFirestore,
  restrictUserFirestore,
  saveUserRestrictionSettingsFirestore,
  softDeleteUserFirestore,
} from "@/services/firestore/usersModerationFirestoreService";
import { fetchUserById, type UserDoc } from "@/services/firestore/usersFirestoreService";

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
      const moderatorUid = auth.currentUser?.uid;
      try {
        await callModerateItem({ itemId, action, note });
      } catch {
        await moderateItemFirestore(itemId, action, note, moderatorUid);
      }
      await reload();
    },
    [reload],
  );

  const batchApprove = useCallback(
    async (itemIds: string[]) => {
      const moderatorUid = auth.currentUser?.uid;
      try {
        await callModerateItemBatch({ itemIds, action: "approve" });
      } catch {
        await moderateItemBatchFirestore(itemIds, "approve", moderatorUid);
      }
      await reload();
    },
    [reload],
  );

  return { items, loading, error, reload, moderate, batchApprove };
}

async function withModerationFallback(
  primary: () => Promise<unknown>,
  fallback: () => Promise<void>,
): Promise<void> {
  try {
    await primary();
  } catch {
    await fallback();
  }
}

function useUserModerationActions() {
  const restrictMember = useCallback(async (userId: string) => {
    await withModerationFallback(
      () => callRestrictUser({ userId }),
      () => restrictUserFirestore(userId),
    );
  }, []);

  const banMember = useCallback(async (userId: string) => {
    await withModerationFallback(
      () => callBanUser({ userId }),
      () => banUserFirestore(userId),
    );
  }, []);

  const liftMemberRestriction = useCallback(async (userId: string) => {
    await withModerationFallback(
      () => callLiftRestriction({ userId }),
      () => liftRestrictionFirestore(userId),
    );
  }, []);

  const deleteMember = useCallback(async (userId: string) => {
    await withModerationFallback(
      () => callDeleteUser({ userId }),
      () => softDeleteUserFirestore(userId),
    );
  }, []);

  return { restrictMember, banMember, liftMemberRestriction, deleteMember };
}

export function useSwapperMembers() {
  const [members, setMembers] = useState<SwapperMember[]>([]);
  const [metrics, setMetrics] = useState<UserManagementMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const moderation = useUserModerationActions();

  const refreshMetrics = useCallback(async (nextMembers: SwapperMember[]) => {
    const [flaggedIncidents, newThisWeek] = await Promise.all([
      fetchOpenReportCount().catch(() => 0),
      countMembersJoinedSince(7).catch(() => 0),
    ]);
    setMetrics(buildUserManagementMetrics(nextMembers, flaggedIncidents, newThisWeek));
  }, []);

  const reload = useCallback(async () => {
    setError(null);
    await refreshMetrics(members);
  }, [members, refreshMetrics]);

  useEffect(() => {
    setLoading(true);
    setError(null);
    const unsub = subscribeSwapperMembers(
      (next) => {
        setMembers(next);
        setLoading(false);
        void refreshMetrics(next);
      },
      (message) => {
        setError(message);
        setLoading(false);
      },
    );
    return () => unsub();
  }, [refreshMetrics]);

  return {
    members,
    metrics,
    loading,
    error,
    reload,
    ...moderation,
  };
}

export function useSwapperMemberDetail(userId: string | undefined) {
  const [member, setMember] = useState<SwapperMember | null>(null);
  const [profile, setProfile] = useState<UserDetailProfile | null>(null);
  const [userDoc, setUserDoc] = useState<UserDoc | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const moderation = useUserModerationActions();

  const reloadProfile = useCallback(async (nextMember: SwapperMember) => {
    const doc = (await fetchUserById(nextMember.id)) ?? {};
    setUserDoc(doc);
    const items = await fetchListedItemsForUser(nextMember.id);
    const ownedIds = new Set(items.map((item) => item.id));
    const reports = await fetchReportsForUser(nextMember.id, ownedIds);
    setProfile(buildUserDetailProfile(nextMember, doc, items, reports));
  }, []);

  useEffect(() => {
    if (!userId) {
      setMember(null);
      setProfile(null);
      setUserDoc(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    const unsub = subscribeUserMember(
      userId,
      (next) => {
        setMember(next);
        setError(next ? null : "User not found.");
        if (!next) {
          setProfile(null);
          setUserDoc(null);
          setLoading(false);
          return;
        }
        void reloadProfile(next).finally(() => setLoading(false));
      },
      (message) => {
        setError(message);
        setLoading(false);
      },
    );
    return () => unsub();
  }, [userId, reloadProfile]);

  const saveRestrictionSettings = useCallback(
    async (settings: UserRestrictionSettings) => {
      if (!userId) return;
      await saveUserRestrictionSettingsFirestore(userId, settings);
      if (member) {
        await reloadProfile(member);
      }
    },
    [member, reloadProfile, userId],
  );

  const restrictionSettings: UserRestrictionSettings | null = userDoc
    ? {
        manualReview: userDoc.restriction?.manualReview ?? false,
        allowChat: userDoc.restriction?.allowChat ?? true,
        allowListings: userDoc.restriction?.allowListings ?? true,
        durationDays: userDoc.restriction?.durationDays ?? "7",
        note: userDoc.restriction?.note ?? "",
      }
    : null;

  return {
    member,
    profile,
    userDoc,
    restrictionSettings,
    loading,
    error,
    saveRestrictionSettings,
    ...moderation,
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

export function useDashboardSnapshot() {
  const [snapshot, setSnapshot] = useState<DashboardSnapshot | null>(null);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      setSnapshot(await fetchDashboardSnapshot());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  return { snapshot, loading, reload };
}

export function useItemDetail(itemId: string | undefined) {
  const [detail, setDetail] = useState<ItemDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!itemId) {
      setDetail(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    void fetchItemDetail(itemId)
      .then((d) => {
        setDetail(d);
      })
      .catch((e) => {
        setDetail(null);
        setError(e instanceof Error ? e.message : "Failed to load item");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [itemId]);

  return { detail, loading, error };
}
