import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { ItemDetail } from "@/features/item-detail/types";
import { reviewItems as initialReviewItems } from "@/features/items-review/data/itemsReviewData";
import type { ReviewItem } from "@/features/items-review/types";
import {
  moderationReports as initialReports,
} from "@/features/reports/data/reportsData";
import type { ModerationReport } from "@/features/reports/types";
import type { UserActionLogEntry, UserDetailProfile } from "@/features/user-detail/types";
import { itemDetailStatic } from "@/features/item-detail/data/itemDetailData";
import { marcusProfileBase } from "@/features/user-detail/data/userDetailData";
import {
  swapperMembers as initialMembers,
} from "@/features/users/data/usersManagementData";
import type { SwapperMember } from "@/features/users/types";
import {
  adminMembers as initialAdminTeam,
  type AdminMember,
} from "@/features/settings/data/settingsData";
import {
  plansSummaryKpis as initialPlanKpis,
  subscriptionPlans as initialSubscriptionPlans,
  type SubscriptionPlan,
} from "@/features/subscriptions/data/plansManagementData";

export type ToastTone = "success" | "info" | "error";

export type DemoToast = {
  id: string;
  message: string;
  tone: ToastTone;
};

export type UserRestrictionSettings = {
  manualReview: boolean;
  allowChat: boolean;
  allowListings: boolean;
  durationDays: string;
  note: string;
};

export type SubscriptionPlanUpdate = Pick<
  SubscriptionPlan,
  "listingUnlimited" | "photosPerListing" | "searchRadiusMiles" | "featureGates" | "cadence"
>;

type DemoStoreValue = {
  reports: ModerationReport[];
  reviewItems: ReviewItem[];
  members: SwapperMember[];
  adminTeam: AdminMember[];
  subscriptionPlans: SubscriptionPlan[];
  subscriptionPlanKpis: typeof initialPlanKpis;
  toasts: DemoToast[];
  userSettings: Record<string, UserRestrictionSettings>;
  userActionLogs: Record<string, UserActionLogEntry[]>;
  reportCounts: ReturnType<typeof computeReportCounts>;
  userCounts: ReturnType<typeof computeUserCounts>;
  reviewTabCounts: ReturnType<typeof computeReviewTabCounts>;
  planCounts: ReturnType<typeof computePlanCounts>;
  dismissToast: (id: string) => void;
  pushToast: (message: string, tone?: ToastTone) => void;
  setReportStatus: (id: string, status: ModerationReport["status"]) => void;
  reviewReport: (id: string) => void;
  closeReport: (id: string) => void;
  approveReviewItem: (id: string) => void;
  hideReviewItem: (id: string) => void;
  requestEditReviewItem: (id: string, message: string) => void;
  batchApproveSafeItems: (ids: string[]) => void;
  restrictMember: (id: string) => void;
  banMember: (id: string) => void;
  liftMemberRestriction: (id: string) => void;
  deleteMember: (id: string) => void;
  saveUserSettings: (userId: string, settings: UserRestrictionSettings) => void;
  getUserProfile: (userId: string | undefined) => UserDetailProfile;
  getItemDetailByRouteId: (routeId: string | undefined) => ItemDetail;
  exportReportsCsv: () => void;
  exportMembersCsv: () => void;
  refreshDashboard: () => void;
  updateSubscriptionPlan: (id: string, patch: SubscriptionPlanUpdate) => void;
};

const DemoContext = createContext<DemoStoreValue | null>(null);

function cloneReviewItems(): ReviewItem[] {
  return initialReviewItems.map((item) => ({ ...item }));
}

function cloneReports(): ModerationReport[] {
  return initialReports.map((r) => ({ ...r }));
}

function cloneMembers(): SwapperMember[] {
  return initialMembers.map((m) => ({ ...m }));
}

function cloneSubscriptionPlans(): SubscriptionPlan[] {
  return initialSubscriptionPlans.map((p) => ({
    ...p,
    featureGates: p.featureGates.map((g) => ({ ...g })),
  }));
}

function cloneAdminTeam(): AdminMember[] {
  return initialAdminTeam.map((m) => ({ ...m }));
}

function computePlanCounts(plans: SubscriptionPlan[]) {
  return {
    all: plans.length,
    active: plans.filter((p) => p.status === "active").length,
    draft: plans.filter((p) => p.status === "draft").length,
  };
}

function computeReportCounts(reports: ModerationReport[]) {
  return {
    all: reports.length,
    high: reports.filter((r) => r.priority === "high").length,
    under_review: reports.filter((r) => r.status === "under_review").length,
  };
}

function computeUserCounts(members: SwapperMember[]) {
  return {
    all: members.length,
    active: members.filter((m) => m.status === "active").length,
    restricted: members.filter((m) => m.status === "restricted").length,
    banned: members.filter((m) => m.status === "banned").length,
  };
}

function computeReviewTabCounts(items: ReviewItem[]) {
  const visible = items.filter((i) => !i.hidden);
  return {
    all: visible.length,
    awaiting: visible.filter((i) => i.status === "awaiting").length,
    reviewed: visible.filter((i) => i.status === "reviewed").length,
  };
}

export function DemoProvider({ children }: { children: ReactNode }) {
  const [reports, setReports] = useState<ModerationReport[]>(cloneReports);
  const [reviewItems, setReviewItems] = useState<ReviewItem[]>(cloneReviewItems);
  const [members, setMembers] = useState<SwapperMember[]>(cloneMembers);
  const [adminTeam] = useState<AdminMember[]>(cloneAdminTeam);
  const [subscriptionPlans, setSubscriptionPlans] = useState<SubscriptionPlan[]>(
    cloneSubscriptionPlans,
  );
  const [toasts, setToasts] = useState<DemoToast[]>([]);
  const [userSettings, setUserSettings] = useState<Record<string, UserRestrictionSettings>>({});
  const [userActionLogs, setUserActionLogs] = useState<Record<string, UserActionLogEntry[]>>(
    {},
  );

  const pushToast = useCallback((message: string, tone: ToastTone = "success") => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    setToasts((prev) => [...prev, { id, message, tone }]);
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3200);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const appendUserLog = useCallback((userId: string, text: string, tone: UserActionLogEntry["tone"]) => {
    const entry: UserActionLogEntry = {
      id: `${userId}-${Date.now()}`,
      time: "Just now",
      text,
      tone,
    };
    setUserActionLogs((prev) => ({
      ...prev,
      [userId]: [entry, ...(prev[userId] ?? marcusProfileBase.actions)].slice(0, 12),
    }));
  }, []);

  const setReportStatus = useCallback(
    (id: string, status: ModerationReport["status"]) => {
      setReports((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
      pushToast(`Report #${id} marked as ${status.replace("_", " ")}.`);
    },
    [pushToast],
  );

  const reviewReport = useCallback(
    (id: string) => setReportStatus(id, "under_review"),
    [setReportStatus],
  );

  const closeReport = useCallback(
    (id: string) => setReportStatus(id, "closed"),
    [setReportStatus],
  );

  const approveReviewItem = useCallback(
    (id: string) => {
      setReviewItems((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, status: "reviewed", hidden: false } : item,
        ),
      );
      pushToast(`Item #${id} approved and marked reviewed.`);
    },
    [pushToast],
  );

  const hideReviewItem = useCallback(
    (id: string) => {
      setReviewItems((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, status: "reviewed", hidden: true } : item,
        ),
      );
      pushToast(`Item #${id} hidden from marketplace feed.`, "info");
    },
    [pushToast],
  );

  const requestEditReviewItem = useCallback(
    (id: string, message: string) => {
      pushToast(`Edit request sent to owner for #${id}.`, "info");
      if (message.trim()) {
        pushToast("Owner notified with your compliance message.", "success");
      }
    },
    [pushToast],
  );

  const batchApproveSafeItems = useCallback(
    (ids: string[]) => {
      if (ids.length === 0) {
        pushToast("Select at least one safe item to batch approve.", "error");
        return;
      }
      setReviewItems((prev) =>
        prev.map((item) =>
          ids.includes(item.id) ? { ...item, status: "reviewed" } : item,
        ),
      );
      pushToast(`Batch approved ${ids.length} item(s).`);
    },
    [pushToast],
  );

  const restrictMember = useCallback(
    (id: string) => {
      setMembers((prev) =>
        prev.map((m) => (m.id === id ? { ...m, status: "restricted", trust: "review", trustDots: 2 } : m)),
      );
      appendUserLog(id, "Account temporarily restricted by moderator", "review");
      pushToast("User account temporarily restricted.", "info");
    },
    [appendUserLog, pushToast],
  );

  const banMember = useCallback(
    (id: string) => {
      setMembers((prev) =>
        prev.map((m) =>
          m.id === id ? { ...m, status: "banned", trust: "low", trustDots: 1 } : m,
        ),
      );
      appendUserLog(id, "Account banned from SWAP IT network", "flag");
      pushToast("User account banned.", "error");
    },
    [appendUserLog, pushToast],
  );

  const liftMemberRestriction = useCallback(
    (id: string) => {
      setMembers((prev) =>
        prev.map((m) =>
          m.id === id ? { ...m, status: "active", trust: "good", trustDots: 4 } : m,
        ),
      );
      appendUserLog(id, "Restriction lifted — account restored to active", "verify");
      pushToast("Restriction lifted. User is active again.");
    },
    [appendUserLog, pushToast],
  );

  const deleteMember = useCallback(
    (id: string) => {
      setMembers((prev) => prev.filter((m) => m.id !== id));
      pushToast("User record removed from directory.", "error");
    },
    [pushToast],
  );

  const saveUserSettings = useCallback(
    (userId: string, settings: UserRestrictionSettings) => {
      setUserSettings((prev) => ({ ...prev, [userId]: settings }));
      appendUserLog(userId, "Restriction & ban settings updated by Sara Miller", "system");
      pushToast("User restriction settings saved.");
    },
    [appendUserLog, pushToast],
  );

  const getUserProfile = useCallback(
    (userId: string | undefined): UserDetailProfile => {
      const member = members.find((m) => m.id === userId) ?? members[0];
      const logs = userActionLogs[member.id] ?? marcusProfileBase.actions;

      return {
        routeId: member.id,
        name: member.name,
        userCode: `#USR-${member.id.replace("u", "")}`,
        trusted: member.status === "active" && member.trust !== "low",
        bio: marcusProfileBase.bio,
        tags: marcusProfileBase.tags,
        trustPercent: member.trust === "high" ? 98 : member.trust === "good" ? 92 : member.trust === "review" ? 74 : 41,
        joined: marcusProfileBase.joined,
        lastActive: member.lastActive,
        swapsCompleted: member.swaps,
        reportsUnderReview: member.reports > 0 ? 1 : 0,
        email: member.email,
        handle: member.handle,
        ipAddress: marcusProfileBase.ipAddress,
        avatarSeed: member.avatarSeed,
        reports: marcusProfileBase.reports,
        items: marcusProfileBase.items,
        actions: logs,
      };
    },
    [members, userActionLogs, userSettings],
  );

  const getItemDetailByRouteId = useCallback(
    (routeId: string | undefined) => {
      const item = reviewItems.find((i) => i.id === routeId) ?? reviewItems[0];
      const useTurntableCopy = item.title.toLowerCase().includes("turntable");
      return {
        routeId: item.id,
        itemCode: `#${item.id}`,
        title: useTurntableCopy ? "Vintage Vinyl Turntable" : item.title,
        listedOn: `Listed ${item.listedHoursAgo}h ago`,
        reportedMeta: `Flagged via ${item.flagTitle.toLowerCase()}`,
        statusLabel: item.hidden ? "Hidden from feed" : "Under moderation review",
        priorityLabel: item.flagKind === "report" ? "Priority: High" : "Priority: Medium",
        primarySeed: useTurntableCopy ? "turntable" : item.imageSeed,
        gallery: itemDetailStatic.gallery,
        category: item.category,
        condition: item.condition,
        createdVia: "Created via Peer Client",
        exchangeTags: itemDetailStatic.exchangeTags,
        description: itemDetailStatic.description,
        highlightSnippet: itemDetailStatic.highlightSnippet,
        violation: itemDetailStatic.violation,
        owner: {
          name: item.userName,
          handle: item.userName.includes("@") ? item.userName : `@${item.userName.toLowerCase().replace(/\s/g, "_")}`,
          memberSince: "Member since Jan 2022",
          badge: item.userType,
          trustScore: item.userVerified ? "98% Positive" : "72% Positive",
          swapsLabel: "34 completed swaps",
          infractions: "0 past violations",
        },
        suggestedEditNote: itemDetailStatic.suggestedEditNote,
        ruleReference: itemDetailStatic.ruleReference,
      };
    },
    [reviewItems],
  );

  const exportReportsCsv = useCallback(() => {
    const header = "id,type,target,priority,status,date\n";
    const rows = reports
      .map(
        (r) =>
          `${r.id},${r.type},${r.targetLabel},${r.priority},${r.status},${r.reportedAt}`,
      )
      .join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "swapit-reports-export.csv";
    a.click();
    URL.revokeObjectURL(url);
    pushToast("Reports exported as CSV.");
  }, [reports, pushToast]);

  const refreshDashboard = useCallback(() => {
    pushToast("Dashboard metrics refreshed (demo sync).", "info");
  }, [pushToast]);

  const updateSubscriptionPlan = useCallback(
    (id: string, patch: SubscriptionPlanUpdate) => {
      let savedName = "Plan";
      setSubscriptionPlans((prev) => {
        savedName = prev.find((p) => p.id === id)?.name ?? "Plan";
        return prev.map((p) =>
          p.id === id
            ? {
                ...p,
                ...patch,
                featureGates: patch.featureGates.map((g) => ({ ...g })),
              }
            : p,
        );
      });
      pushToast(`${savedName} configuration saved.`);
    },
    [pushToast],
  );

  const exportMembersCsv = useCallback(() => {
    const header = "id,name,handle,email,status,trust,swaps,reports\n";
    const rows = members
      .map(
        (m) =>
          `${m.id},${m.name},${m.handle},${m.email},${m.status},${m.trust},${m.swaps},${m.reports}`,
      )
      .join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "swapit-users-export.csv";
    a.click();
    URL.revokeObjectURL(url);
    pushToast("User directory exported as CSV.");
  }, [members, pushToast]);

  const reportCounts = useMemo(() => computeReportCounts(reports), [reports]);
  const userCounts = useMemo(() => computeUserCounts(members), [members]);
  const reviewTabCounts = useMemo(() => computeReviewTabCounts(reviewItems), [reviewItems]);
  const planCounts = useMemo(() => computePlanCounts(subscriptionPlans), [subscriptionPlans]);

  const value = useMemo<DemoStoreValue>(
    () => ({
      reports,
      reviewItems,
      members,
      adminTeam,
      subscriptionPlans,
      subscriptionPlanKpis: initialPlanKpis,
      toasts,
      userSettings,
      userActionLogs,
      reportCounts,
      userCounts,
      reviewTabCounts,
      planCounts,
      dismissToast,
      pushToast,
      setReportStatus,
      reviewReport,
      closeReport,
      approveReviewItem,
      hideReviewItem,
      requestEditReviewItem,
      batchApproveSafeItems,
      restrictMember,
      banMember,
      liftMemberRestriction,
      deleteMember,
      saveUserSettings,
      getUserProfile,
      getItemDetailByRouteId,
      exportReportsCsv,
      exportMembersCsv,
      refreshDashboard,
      updateSubscriptionPlan,
    }),
    [
      reports,
      reviewItems,
      members,
      adminTeam,
      subscriptionPlans,
      toasts,
      userSettings,
      userActionLogs,
      reportCounts,
      userCounts,
      reviewTabCounts,
      planCounts,
      dismissToast,
      pushToast,
      setReportStatus,
      reviewReport,
      closeReport,
      approveReviewItem,
      hideReviewItem,
      requestEditReviewItem,
      batchApproveSafeItems,
      restrictMember,
      banMember,
      liftMemberRestriction,
      deleteMember,
      saveUserSettings,
      getUserProfile,
      getItemDetailByRouteId,
      exportReportsCsv,
      exportMembersCsv,
      refreshDashboard,
      updateSubscriptionPlan,
    ],
  );

  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>;
}

export function useDemoStore(): DemoStoreValue {
  const ctx = useContext(DemoContext);
  if (!ctx) throw new Error("useDemoStore must be used within DemoProvider");
  return ctx;
}

export function useReviewTabCounts() {
  const { reviewItems } = useDemoStore();
  return useMemo(() => computeReviewTabCounts(reviewItems), [reviewItems]);
}
