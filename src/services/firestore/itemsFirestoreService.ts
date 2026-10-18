import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  where,
  type Timestamp,
} from "firebase/firestore";

import type { ItemDetail } from "@/features/item-detail/types";
import type { ReviewItem } from "@/features/items-review/types";
import { db } from "@/lib/firebase";

type ItemDoc = {
  title?: string;
  categoryName?: string;
  ownerId?: string;
  ownerName?: string;
  status?: string;
  condition?: string;
  estimatedValue?: string;
  location?: string;
  imageUrls?: string[];
  flagKind?: string;
  flagTitle?: string;
  flagMessage?: string;
  moderationNote?: string;
  description?: string;
  wants?: string;
  createdAt?: Timestamp;
};

function hoursAgo(ts?: Timestamp): number {
  if (!ts) return 0;
  const ms = Date.now() - ts.toMillis();
  return Math.max(0, Math.floor(ms / (1000 * 60 * 60)));
}

function mapToReviewItem(id: string, data: ItemDoc): ReviewItem {
  const status = data.status === "pending" ? "awaiting" : "reviewed";
  const flagKind = (data.flagKind as ReviewItem["flagKind"]) ?? "automated";
  return {
    id,
    title: data.title ?? "Untitled",
    category: data.categoryName ?? "—",
    imageSeed: data.imageUrls?.[0] ?? id,
    listedHoursAgo: hoursAgo(data.createdAt),
    status,
    userType: "Swapper",
    userName: data.ownerName ?? data.ownerId ?? "Unknown",
    userVerified: false,
    flagKind,
    flagTitle: data.flagTitle ?? "Pending review",
    flagMessage: data.flagMessage ?? data.moderationNote ?? "",
    condition: data.condition ?? "—",
    estimatedValue: data.estimatedValue ?? "—",
    location: data.location ?? "—",
  };
}

export async function fetchPendingReviewItems(max = 100): Promise<ReviewItem[]> {
  const q = query(
    collection(db, "items"),
    where("status", "==", "pending"),
    orderBy("createdAt", "desc"),
    limit(max),
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => mapToReviewItem(d.id, d.data() as ItemDoc));
}

export async function fetchItemDetail(itemId: string): Promise<ItemDetail | null> {
  const snap = await getDoc(doc(db, "items", itemId));
  if (!snap.exists()) return null;
  const data = snap.data() as ItemDoc;
  const seed = data.imageUrls?.[0] ?? itemId;
  const listed = data.createdAt?.toDate().toLocaleDateString() ?? "—";
  return {
    routeId: snap.id,
    itemCode: snap.id.slice(0, 8).toUpperCase(),
    title: data.title ?? "Untitled",
    listedOn: listed,
    reportedMeta: data.flagMessage ?? "No reports",
    statusLabel: data.status ?? "pending",
    priorityLabel: "Standard",
    gallery: [{ label: "Primary", seed }],
    primarySeed: seed,
    category: data.categoryName ?? "—",
    condition: data.condition ?? "—",
    createdVia: "Mobile app",
    exchangeTags: [data.estimatedValue ?? "—"],
    description: data.description ?? "",
    highlightSnippet: data.wants ?? "",
    violation: {
      ruleId: "MOD-001",
      title: data.flagTitle ?? "Review",
      summary: data.flagMessage ?? data.moderationNote ?? "",
      nlpHits: [],
    },
    owner: {
      name: data.ownerName ?? "Swapper",
      handle: data.ownerId ?? "—",
      memberSince: listed,
      badge: "Member",
      trustScore: "Good",
      swapsLabel: "—",
      infractions: "0",
    },
    suggestedEditNote: data.moderationNote ?? "",
    ruleReference: {
      title: "Community guidelines",
      body: data.moderationNote ?? "Follow SWAP IT listing policies.",
    },
  };
}
