import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  query,
  type Timestamp,
} from "firebase/firestore";

import type { ItemDetail, GallerySlide } from "@/features/item-detail/types";
import { DEFAULT_OWNER_EDIT_REQUEST } from "@/features/items-review/constants/moderationCopy";
import type { ReviewItem } from "@/features/items-review/types";
import { db } from "@/lib/firebase";
import { resolveListingImageUrl } from "@/lib/listingImageUrl";
import { fetchUserById } from "@/services/firestore/usersFirestoreService";

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
  updatedAt?: Timestamp;
  moderatedAt?: Timestamp;
  approvedAt?: Timestamp;
};

function itemSortKeyMs(data: ItemDoc): number {
  if (data.approvedAt) return data.approvedAt.toMillis();
  if (data.moderatedAt) return data.moderatedAt.toMillis();
  if (data.updatedAt) return data.updatedAt.toMillis();
  if (data.createdAt) return data.createdAt.toMillis();
  return 0;
}

function hoursAgo(ts?: Timestamp): number {
  if (!ts) return 0;
  const ms = Date.now() - ts.toMillis();
  return Math.max(0, Math.floor(ms / (1000 * 60 * 60)));
}

function mapToReviewItem(id: string, data: ItemDoc): ReviewItem {
  const rawStatus = (data.status ?? "pending").toLowerCase();
  const status = rawStatus === "pending" ? "awaiting" : "reviewed";
  const needsModeration = rawStatus === "pending";
  const flagKind = (data.flagKind as ReviewItem["flagKind"]) ?? "automated";
  const flagTitle =
    data.flagTitle?.trim() ?? (needsModeration ? "Pending review" : "");
  const flagMessage =
    data.flagMessage?.trim() ?? data.moderationNote?.trim() ?? "";
  return {
    id,
    ownerId: data.ownerId,
    title: data.title ?? "Untitled",
    category: data.categoryName ?? "—",
    imageSeed: id,
    thumbnailUrl: resolveListingImageUrl(
      id,
      data.categoryName ?? "",
      data.imageUrls,
    ),
    listingStatus: rawStatus,
    listedHoursAgo: hoursAgo(data.createdAt),
    sortKeyMs: itemSortKeyMs(data),
    status,
    userType: "Swapper",
    userName: data.ownerName ?? data.ownerId ?? "Unknown",
    userVerified: false,
    flagKind,
    flagTitle,
    flagMessage,
    condition: data.condition ?? "—",
    estimatedValue: data.estimatedValue ?? "—",
    location: data.location ?? "—",
  };
}

function buildGallery(
  imageUrls: string[] | undefined,
  itemId: string,
  categoryName: string,
): {
  gallery: GallerySlide[];
  primarySeed: string;
} {
  const resolved = resolveListingImageUrl(itemId, categoryName, imageUrls);
  const urls =
    imageUrls?.filter((u) => u.trim()) ??
    (resolved ? [resolved] : []);
  if (!urls.length) {
    return {
      gallery: [{ label: "Primary", seed: itemId, url: resolved }],
      primarySeed: itemId,
    };
  }
  const gallery = urls.map((url, index) => ({
    label: index === 0 ? "Primary" : `Photo ${index + 1}`,
    seed: `${itemId}-${index}`,
    url,
  }));
  return { gallery, primarySeed: gallery[0].seed };
}

function exchangeTagsFromItem(data: ItemDoc): string[] {
  const tags: string[] = [];
  if (data.wants?.trim()) tags.push(data.wants.trim());
  if (data.estimatedValue?.trim()) tags.push(data.estimatedValue.trim());
  if (data.location?.trim()) tags.push(data.location.trim());
  return tags.length ? tags : ["—"];
}

function priorityFromFlag(flagKind?: string): string {
  if (flagKind === "report") return "High";
  if (flagKind === "policy") return "Elevated";
  return "Standard";
}

/** Short line for the item header — not the full owner-facing edit note. */
function headerReportMeta(data: ItemDoc): string {
  const title = data.flagTitle?.trim();
  if (title) return title;

  switch (data.flagKind) {
    case "edit_requested":
      return "Edit requested from owner";
    case "report":
      return "Member report on file";
    case "policy":
      return "Policy review";
    case "automated":
      return "Automated review flag";
    default:
      break;
  }

  const flagMessage = data.flagMessage?.trim();
  if (flagMessage) {
    return flagMessage.length > 72 ? `${flagMessage.slice(0, 69)}…` : flagMessage;
  }

  if ((data.status ?? "pending") === "pending") return "Awaiting moderator review";
  return "No open reports";
}

function violationSummaryFromItem(data: ItemDoc): string {
  const flagMessage = data.flagMessage?.trim();
  if (flagMessage) return flagMessage;

  if (data.flagKind === "edit_requested" || data.moderationNote?.trim()) {
    return "Moderator requested listing updates from the owner.";
  }

  if ((data.status ?? "pending") === "pending") return "Awaiting moderator review.";
  return "No active violations on record.";
}

const REVIEW_QUEUE_STATUSES = new Set([
  "pending",
  "approved",
  "hidden",
  "rejected",
]);

/** All items moderators need to see (admin panel). */
export async function fetchPendingReviewItems(max = 100): Promise<ReviewItem[]> {
  const snap = await getDocs(query(collection(db, "items"), limit(max)));
  const items = snap.docs
    .filter((d) => {
      const status = (d.data().status as string | undefined) ?? "pending";
      return REVIEW_QUEUE_STATUSES.has(status);
    })
    .map((d) => mapToReviewItem(d.id, d.data() as ItemDoc));
  items.sort((a, b) => b.sortKeyMs - a.sortKeyMs);
  return items;
}

export async function fetchItemDetail(itemId: string): Promise<ItemDetail | null> {
  const snap = await getDoc(doc(db, "items", itemId));
  if (!snap.exists()) return null;
  const data = snap.data() as ItemDoc;
  const ownerId = data.ownerId ?? "";
  const listed = data.createdAt?.toDate().toLocaleDateString() ?? "—";
  const { gallery, primarySeed } = buildGallery(
    data.imageUrls,
    snap.id,
    data.categoryName ?? "",
  );

  const ownerUser = ownerId ? await fetchUserById(ownerId) : null;
  const ownerName =
    data.ownerName ??
    ownerUser?.displayName ??
    ownerUser?.email?.split("@")[0] ??
    "Swapper";
  const rawHandle = ownerUser?.handle?.replace(/^@/, "").trim();
  const handle = rawHandle
    ? `@${rawHandle}`
    : ownerId
      ? `@${ownerId.slice(0, 8)}`
      : "—";
  const memberSince = ownerUser?.createdAt
    ? `Member since ${ownerUser.createdAt.toDate().toLocaleDateString()}`
    : `Listed ${listed}`;
  const trustRaw = ownerUser?.trustLevel ?? "good";
  const trustScore =
    trustRaw.charAt(0).toUpperCase() + trustRaw.slice(1);
  const swapCount = ownerUser?.swapCount ?? 0;
  const reportCount = ownerUser?.reportCount ?? 0;

  const reportedMeta = headerReportMeta(data);
  const violationSummary = violationSummaryFromItem(data);

  const showViolation =
    data.status === "pending" ||
    Boolean(data.flagTitle || data.flagMessage || data.moderationNote);

  return {
    routeId: snap.id,
    itemCode: snap.id.slice(0, 8).toUpperCase(),
    title: data.title ?? "Untitled",
    listedOn: `Listed ${listed}`,
    reportedMeta,
    statusLabel: (data.status ?? "pending").toUpperCase(),
    priorityLabel: priorityFromFlag(data.flagKind),
    gallery,
    primarySeed,
    category: data.categoryName ?? "—",
    condition: data.condition ?? "—",
    createdVia: "Mobile app",
    exchangeTags: exchangeTagsFromItem(data),
    description: data.description ?? "",
    highlightSnippet: data.wants?.trim() ?? "",
    ownerId,
    location: data.location ?? "—",
    wants: data.wants ?? "",
    violation: {
      ruleId: data.flagKind === "report" ? "RPT-001" : "MOD-001",
      title: data.flagTitle ?? "Listing review",
      summary: violationSummary,
      nlpHits: data.flagKind ? [data.flagKind] : [],
    },
    owner: {
      name: ownerName,
      handle,
      memberSince,
      badge: ownerUser?.verified ? "Verified member" : "Member",
      trustScore,
      swapsLabel: `${swapCount} swaps completed`,
      infractions: String(reportCount),
      photoUrl: ownerUser?.photoUrl,
    },
    showViolation,
    suggestedEditNote: data.moderationNote?.trim() || DEFAULT_OWNER_EDIT_REQUEST,
    ruleReference: {
      title: "Community guidelines",
      body:
        data.moderationNote ??
        "Listings must be accurate, safe to swap, and comply with SWAP IT policies.",
    },
  };
}
