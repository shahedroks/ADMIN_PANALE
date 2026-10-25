import {
  collection,
  getCountFromServer,
  getDocs,
  limit,
  query,
  Timestamp,
  where,
  type Query,
} from "firebase/firestore";

import type { ActivityPoint } from "@/features/dashboard/data/dashboardData";
import { db } from "@/lib/firebase";

export type DashboardCounts = {
  users: number;
  pendingItems: number;
  openReports: number;
  approvedItems: number;
};

export type ActivitySummary = {
  dailyAvgActive: string;
  matchConversion: string;
  avgListingsPerMember: string;
};

export type ModerationHealthStats = {
  closedReportsRate: number;
  closedReportsDelta: string;
  avgReviewMinutes: number;
  reviewBenchmark: string;
  urgentCount: number;
};

export type MetricDelta = {
  delta: string;
  deltaTone: "positive" | "negative" | "neutral";
  progressPercent: number;
};

export type DashboardSnapshot = {
  counts: DashboardCounts & {
    activeUsers: number;
    activeUsersFootnote: string;
    matchesAndChats: number;
    urgentOpenReports: number;
  };
  activity: ActivityPoint[];
  activitySummary: ActivitySummary;
  moderation: ModerationHealthStats;
  metricDeltas: {
    matches: MetricDelta;
    reports: MetricDelta;
    items: MetricDelta;
    users: MetricDelta;
  };
};

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function startOfLocalDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

type DayBucket = {
  label: string;
  start: Timestamp;
  end: Timestamp;
};

function buildDayBuckets(endingOn: Date, count: number): DayBucket[] {
  const endDay = startOfLocalDay(endingOn);
  const buckets: DayBucket[] = [];
  for (let offset = count - 1; offset >= 0; offset -= 1) {
    const start = new Date(endDay);
    start.setDate(start.getDate() - offset);
    const end = new Date(start);
    end.setDate(end.getDate() + 1);
    buckets.push({
      label: DAY_LABELS[start.getDay()],
      start: Timestamp.fromDate(start),
      end: Timestamp.fromDate(end),
    });
  }
  return buckets;
}

async function countQuery(q: Query): Promise<number> {
  const snap = await getCountFromServer(q);
  return snap.data().count;
}

async function countUsersActiveInRange(start: Timestamp, end: Timestamp): Promise<number> {
  const q = query(
    collection(db, "users"),
    where("role", "==", "user"),
    where("lastActiveAt", ">=", start),
    where("lastActiveAt", "<", end),
  );
  return countQuery(q);
}

async function countItemsCreatedInRange(start: Timestamp, end: Timestamp): Promise<number> {
  const q = query(
    collection(db, "items"),
    where("createdAt", ">=", start),
    where("createdAt", "<", end),
  );
  return countQuery(q);
}

async function countChatsCreatedInRange(start: Timestamp, end: Timestamp): Promise<number> {
  const q = query(
    collection(db, "chats"),
    where("createdAt", ">=", start),
    where("createdAt", "<", end),
  );
  return countQuery(q);
}

async function countOffersCreatedInRange(start: Timestamp, end: Timestamp): Promise<number> {
  const q = query(
    collection(db, "swapOffers"),
    where("createdAt", ">=", start),
    where("createdAt", "<", end),
  );
  return countQuery(q);
}

function formatPercentDelta(current: number, previous: number): string {
  if (previous === 0) {
    return current > 0 ? "+100%" : "—";
  }
  const pct = ((current - previous) / previous) * 100;
  const sign = pct >= 0 ? "+" : "";
  return `${sign}${pct.toFixed(1)}%`;
}

function deltaTone(current: number, previous: number): MetricDelta["deltaTone"] {
  if (current === previous) return "neutral";
  return current >= previous ? "positive" : "negative";
}

function progressFromDelta(current: number, previous: number): number {
  if (previous <= 0) return current > 0 ? 72 : 40;
  const ratio = current / previous;
  return Math.min(100, Math.max(24, Math.round(ratio * 50)));
}

async function fetchActivitySeries(buckets: DayBucket[]): Promise<ActivityPoint[]> {
  const points = await Promise.all(
    buckets.map(async (bucket) => {
      const [users, items] = await Promise.all([
        countUsersActiveInRange(bucket.start, bucket.end).catch(() => 0),
        countItemsCreatedInRange(bucket.start, bucket.end).catch(() => 0),
      ]);
      return { day: bucket.label, users, items };
    }),
  );
  return points;
}

async function sumMatchesActivity(buckets: DayBucket[]): Promise<number> {
  const counts = await Promise.all(
    buckets.map(async (bucket) => {
      const [chats, offers] = await Promise.all([
        countChatsCreatedInRange(bucket.start, bucket.end).catch(() => 0),
        countOffersCreatedInRange(bucket.start, bucket.end).catch(() => 0),
      ]);
      return chats + offers;
    }),
  );
  return counts.reduce((sum, n) => sum + n, 0);
}

async function sumUserActivity(buckets: DayBucket[]): Promise<number> {
  const counts = await Promise.all(
    buckets.map((bucket) => countUsersActiveInRange(bucket.start, bucket.end).catch(() => 0)),
  );
  return counts.reduce((sum, n) => sum + n, 0);
}

async function sumItemActivity(buckets: DayBucket[]): Promise<number> {
  const counts = await Promise.all(
    buckets.map((bucket) => countItemsCreatedInRange(bucket.start, bucket.end).catch(() => 0)),
  );
  return counts.reduce((sum, n) => sum + n, 0);
}

async function fetchModerationStats(): Promise<ModerationHealthStats> {
  const [closed, open, underReview, urgentOpen] = await Promise.all([
    countQuery(query(collection(db, "reports"), where("status", "==", "closed"))).catch(() => 0),
    countQuery(query(collection(db, "reports"), where("status", "==", "open"))).catch(() => 0),
    countQuery(query(collection(db, "reports"), where("status", "==", "under_review"))).catch(
      () => 0,
    ),
    countQuery(
      query(
        collection(db, "reports"),
        where("status", "in", ["open", "under_review"]),
        where("priority", "==", "high"),
      ),
    ).catch(() => 0),
  ]);

  const actionable = closed + open + underReview;
  const closedReportsRate =
    actionable > 0 ? Math.round((closed / actionable) * 100) : closed > 0 ? 100 : 0;

  const closedSnap = await getDocs(
    query(collection(db, "reports"), where("status", "==", "closed"), limit(100)),
  ).catch(() => null);

  let avgReviewMinutes = 0;
  if (closedSnap && closedSnap.size > 0) {
    let totalMs = 0;
    let counted = 0;
    closedSnap.forEach((docSnap) => {
      const data = docSnap.data();
      const createdAt = data.createdAt as Timestamp | undefined;
      const updatedAt = data.updatedAt as Timestamp | undefined;
      if (createdAt && updatedAt) {
        totalMs += updatedAt.toMillis() - createdAt.toMillis();
        counted += 1;
      }
    });
    if (counted > 0) {
      avgReviewMinutes = Math.max(1, Math.round(totalMs / counted / (1000 * 60)));
    }
  }

  const reviewBenchmark =
    avgReviewMinutes === 0
      ? "No closed reports yet"
      : avgReviewMinutes <= 30
        ? "Within SLA benchmark"
        : "Above SLA benchmark";

  const prevBuckets = buildDayBuckets(
    new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    7,
  );
  const [closedPrevWeek, closedThisWeek] = await Promise.all([
    Promise.all(
      prevBuckets.map((bucket) =>
        countQuery(
          query(
            collection(db, "reports"),
            where("status", "==", "closed"),
            where("updatedAt", ">=", bucket.start),
            where("updatedAt", "<", bucket.end),
          ),
        ).catch(() => 0),
      ),
    ).then((vals) => vals.reduce((a, b) => a + b, 0)),
    Promise.all(
      buildDayBuckets(new Date(), 7).map((bucket) =>
        countQuery(
          query(
            collection(db, "reports"),
            where("status", "==", "closed"),
            where("updatedAt", ">=", bucket.start),
            where("updatedAt", "<", bucket.end),
          ),
        ).catch(() => 0),
      ),
    ).then((vals) => vals.reduce((a, b) => a + b, 0)),
  ]);

  const closedReportsDelta =
    closedPrevWeek === 0 && closedThisWeek === 0
      ? "No closures this period"
      : `${formatPercentDelta(closedThisWeek, closedPrevWeek)} vs prior week`;

  return {
    closedReportsRate,
    closedReportsDelta,
    avgReviewMinutes,
    reviewBenchmark,
    urgentCount: urgentOpen,
  };
}

export async function fetchDashboardCounts(): Promise<DashboardCounts> {
  const usersQ = query(collection(db, "users"), where("role", "==", "user"));
  const pendingQ = query(collection(db, "items"), where("status", "==", "pending"));
  const openReportsQ = query(
    collection(db, "reports"),
    where("status", "in", ["open", "under_review"]),
  );
  const approvedQ = query(collection(db, "items"), where("status", "==", "approved"));

  const [users, pendingItems, openReports, approvedItems] = await Promise.all([
    getCountFromServer(usersQ),
    getCountFromServer(pendingQ),
    getCountFromServer(openReportsQ),
    getCountFromServer(approvedQ),
  ]);

  return {
    users: users.data().count,
    pendingItems: pendingItems.data().count,
    openReports: openReports.data().count,
    approvedItems: approvedItems.data().count,
  };
}

export async function fetchDashboardSnapshot(): Promise<DashboardSnapshot> {
  const since30d = Timestamp.fromMillis(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const currentBuckets = buildDayBuckets(new Date(), 7);
  const previousBuckets = buildDayBuckets(
    new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    7,
  );

  const [
    baseCounts,
    chatsTotal,
    offersTotal,
    activeUsers30d,
    urgentOpenReports,
    activity,
    moderation,
    matchesCurrent,
    matchesPrevious,
    usersCurrent,
    usersPrevious,
    itemsCurrent,
    itemsPrevious,
    acceptedOffers,
    totalOffers,
  ] = await Promise.all([
    fetchDashboardCounts(),
    countQuery(query(collection(db, "chats"))).catch(() => 0),
    countQuery(query(collection(db, "swapOffers"))).catch(() => 0),
    countQuery(
      query(
        collection(db, "users"),
        where("role", "==", "user"),
        where("lastActiveAt", ">=", since30d),
      ),
    ).catch(() => null),
    countQuery(
      query(
        collection(db, "reports"),
        where("status", "in", ["open", "under_review"]),
        where("priority", "==", "high"),
      ),
    ).catch(() => 0),
    fetchActivitySeries(currentBuckets),
    fetchModerationStats(),
    sumMatchesActivity(currentBuckets),
    sumMatchesActivity(previousBuckets),
    sumUserActivity(currentBuckets),
    sumUserActivity(previousBuckets),
    sumItemActivity(currentBuckets),
    sumItemActivity(previousBuckets),
    countQuery(
      query(collection(db, "swapOffers"), where("status", "in", ["accepted", "completed"])),
    ).catch(() => 0),
    countQuery(query(collection(db, "swapOffers"))).catch(() => 0),
  ]);

  const activeUsers =
    activeUsers30d ?? baseCounts.users;
  const activeUsersFootnote =
    activeUsers30d === null ? "All app users (activity index pending)" : "30-day verified active";

  const dailyAvg =
    activity.length > 0
      ? Math.round(activity.reduce((sum, p) => sum + p.users, 0) / activity.length)
      : 0;

  const matchConversion =
    totalOffers > 0
      ? `${((acceptedOffers / totalOffers) * 100).toFixed(1)}%`
      : "—";

  const avgListingsPerMember =
    activeUsers > 0
      ? `${(baseCounts.approvedItems / activeUsers).toFixed(1)} items`
      : "—";

  const reportsDeltaLabel =
    urgentOpenReports > 0
      ? `+${urgentOpenReports} urgent`
      : baseCounts.openReports > 0
        ? `${baseCounts.openReports} open`
        : "—";

  return {
    counts: {
      ...baseCounts,
      activeUsers,
      activeUsersFootnote,
      matchesAndChats: chatsTotal + offersTotal,
      urgentOpenReports,
    },
    activity,
    activitySummary: {
      dailyAvgActive: dailyAvg.toLocaleString(),
      matchConversion,
      avgListingsPerMember,
    },
    moderation,
    metricDeltas: {
      matches: {
        delta: formatPercentDelta(matchesCurrent, matchesPrevious),
        deltaTone: deltaTone(matchesCurrent, matchesPrevious),
        progressPercent: progressFromDelta(matchesCurrent, matchesPrevious),
      },
      reports: {
        delta: reportsDeltaLabel,
        deltaTone: urgentOpenReports > 0 || baseCounts.openReports > 0 ? "negative" : "neutral",
        progressPercent:
          baseCounts.openReports > 0
            ? Math.min(100, 40 + baseCounts.openReports * 8)
            : moderation.closedReportsRate,
      },
      items: {
        delta: formatPercentDelta(itemsCurrent, itemsPrevious),
        deltaTone: deltaTone(itemsCurrent, itemsPrevious),
        progressPercent: progressFromDelta(itemsCurrent, itemsPrevious),
      },
      users: {
        delta: formatPercentDelta(usersCurrent, usersPrevious),
        deltaTone: deltaTone(usersCurrent, usersPrevious),
        progressPercent: progressFromDelta(usersCurrent, usersPrevious),
      },
    },
  };
}
