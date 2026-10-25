import type { SwapperMember } from "@/features/users/types";
import type {
  UserDetailProfile,
  UserListedItem,
  UserReportEntry,
} from "@/features/user-detail/types";
import {
  buildUserActionLog,
  countReportsUnderReview,
} from "@/services/firestore/userDetailFirestoreService";
import type { UserDoc } from "@/services/firestore/usersFirestoreService";

function trustPercent(level: SwapperMember["trust"]): number {
  switch (level) {
    case "high":
      return 98;
    case "good":
      return 92;
    case "review":
      return 74;
    case "low":
      return 41;
    default:
      return 85;
  }
}

function trustLabel(level: SwapperMember["trust"]): string {
  switch (level) {
    case "high":
      return "High";
    case "good":
      return "Good";
    case "review":
      return "Under review";
    case "low":
      return "Low";
    default:
      return "Standard";
  }
}

function formatJoined(createdAt?: UserDoc["createdAt"]): string {
  if (!createdAt) return "Member since —";
  const d = createdAt.toDate();
  return `Member since ${d.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  })}`;
}

function buildTags(doc: UserDoc): string[] {
  const tags: string[] = [];
  if (doc.verified) tags.push("Verified cycler");
  if ((doc.swapCount ?? 0) >= 5) tags.push("Top responder");
  if (doc.location?.trim()) tags.push(doc.location.trim());
  if (!tags.length) tags.push("Community member");
  return tags;
}

export function buildUserDetailProfile(
  member: SwapperMember,
  doc: UserDoc,
  items: UserListedItem[],
  reports: UserReportEntry[],
): UserDetailProfile {
  const bio =
    doc.bio?.trim() ||
    "No biography yet. This member has not added a public bio in the mobile app.";

  return {
    routeId: member.id,
    name: member.name,
    userCode: `#USR-${member.id.slice(0, 8).toUpperCase()}`,
    trusted: member.status === "active" && member.trust !== "low",
    bio,
    tags: buildTags(doc),
    trustPercent: trustPercent(member.trust),
    trustLabel: trustLabel(member.trust),
    joined: formatJoined(doc.createdAt),
    lastActive: member.lastActive,
    swapsCompleted: member.swaps,
    reportsUnderReview: countReportsUnderReview(reports),
    email: member.email,
    handle: member.handle.startsWith("@") ? member.handle : `@${member.handle}`,
    ipAddress: doc.lastKnownIp?.trim() || "Not recorded",
    avatarSeed: member.avatarSeed,
    photoUrl: member.photoUrl,
    reports,
    items,
    actions: buildUserActionLog(member.id, doc, reports),
  };
}
