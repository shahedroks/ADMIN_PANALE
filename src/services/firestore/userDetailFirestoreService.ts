import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where,
  type Timestamp,
} from "firebase/firestore";

import type {
  UserActionLogEntry,
  UserListedItem,
  UserReportEntry,
} from "@/features/user-detail/types";
import { resolveListingImageUrl } from "@/lib/listingImageUrl";
import { db } from "@/lib/firebase";
import type { UserDoc } from "@/services/firestore/usersFirestoreService";

type ReportDoc = {
  reporterId?: string;
  targetType?: string;
  targetId?: string;
  title?: string;
  message?: string;
  status?: string;
  createdAt?: Timestamp;
};

type ItemDoc = {
  title?: string;
  categoryName?: string;
  status?: string;
  imageUrls?: string[];
};

function formatReportDate(ts?: Timestamp): string {
  if (!ts) return "—";
  return ts.toDate().toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function mapReportStatus(raw?: string): UserReportEntry["status"] {
  const s = (raw ?? "open").toLowerCase();
  if (s === "open" || s === "under_review") return "under_review";
  return "dismissed";
}

function mapListingStatus(raw?: string): UserListedItem["status"] {
  const s = (raw ?? "pending").toLowerCase();
  if (s === "pending") return "under_review";
  if (s === "swapped" || s === "in_swap") return "in_swap";
  return "active";
}

function relativeTime(ts?: Timestamp): string {
  if (!ts) return "—";
  const hours = Math.floor((Date.now() - ts.toMillis()) / (1000 * 60 * 60));
  if (hours < 1) return "0h ago";
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return `${Math.floor(days / 7)}w ago`;
}

export async function fetchListedItemsForUser(
  userId: string,
  max = 50,
): Promise<UserListedItem[]> {
  const q = query(
    collection(db, "items"),
    where("ownerId", "==", userId),
    limit(max),
  );
  const snap = await getDocs(q);
  const items = snap.docs.map((d) => {
    const data = d.data() as ItemDoc;
    return {
      id: d.id,
      title: data.title ?? "Untitled",
      category: data.categoryName ?? "—",
      status: mapListingStatus(data.status),
      imageSeed: d.id,
      thumbnailUrl: resolveListingImageUrl(
        d.id,
        data.categoryName ?? "",
        data.imageUrls,
      ),
    };
  });
  items.sort((a, b) => a.title.localeCompare(b.title));
  return items;
}

export async function fetchReportsForUser(
  userId: string,
  ownedItemIds: Set<string>,
  max = 120,
): Promise<UserReportEntry[]> {
  const q = query(collection(db, "reports"), orderBy("createdAt", "desc"), limit(max));
  const snap = await getDocs(q);
  const entries: UserReportEntry[] = [];

  for (const docSnap of snap.docs) {
    const data = docSnap.data() as ReportDoc;
    const targetType = (data.targetType ?? "item").toLowerCase();
    const targetId = data.targetId ?? "";
    const isUserTarget = targetType === "user" && targetId === userId;
    const isOwnedItem = targetType === "item" && targetId && ownedItemIds.has(targetId);
    if (!isUserTarget && !isOwnedItem) continue;

    const summary =
      data.message?.trim() ||
      data.title?.trim() ||
      "Moderation report";
    const actor = data.reporterId
      ? `Reported by @${data.reporterId.slice(0, 8)}`
      : "Community report";

    entries.push({
      id: docSnap.id,
      date: formatReportDate(data.createdAt),
      status: mapReportStatus(data.status),
      summary,
      actor,
    });
  }

  return entries;
}

export function buildUserActionLog(
  userId: string,
  doc: UserDoc & {
    restrictedAt?: Timestamp;
    bannedAt?: Timestamp;
    liftedAt?: Timestamp;
    verified?: boolean;
  },
  reports: UserReportEntry[],
  options?: { maxEntries?: number },
): UserActionLogEntry[] {
  const maxEntries = options?.maxEntries ?? 8;
  const entries: UserActionLogEntry[] = [];

  if (doc.restrictedAt) {
    entries.push({
      id: `${userId}-restricted`,
      time: relativeTime(doc.restrictedAt),
      text: "Account temporarily restricted by moderation",
      tone: "review",
    });
  }
  if (doc.bannedAt) {
    entries.push({
      id: `${userId}-banned`,
      time: relativeTime(doc.bannedAt),
      text: "Account banned from the network",
      tone: "flag",
    });
  }
  if (doc.liftedAt) {
    entries.push({
      id: `${userId}-lifted`,
      time: relativeTime(doc.liftedAt),
      text: "Restriction lifted — account restored to active",
      tone: "verify",
    });
  }
  if (doc.verified) {
    entries.push({
      id: `${userId}-verified`,
      time: relativeTime(doc.createdAt),
      text: "Identity verification badge active",
      tone: "verify",
    });
  }

  const reportSlots = Math.max(0, maxEntries - entries.length - 1);
  for (const report of reports.slice(0, reportSlots)) {
    entries.push({
      id: `report-${report.id}`,
      time: report.date,
      text:
        report.status === "under_review"
          ? `Report #${report.id.slice(0, 6)} marked under review`
          : `Report #${report.id.slice(0, 6)} dismissed`,
      tone: report.status === "under_review" ? "review" : "system",
    });
  }

  if (!entries.length) {
    entries.push({
      id: `${userId}-created`,
      time: relativeTime(doc.createdAt),
      text: "Account created on SWAP IT",
      tone: "system",
    });
  }

  return entries.slice(0, maxEntries);
}

export function countReportsUnderReview(reports: UserReportEntry[]): number {
  return reports.filter((r) => r.status === "under_review").length;
}
