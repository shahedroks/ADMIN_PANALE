import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where,
  type Timestamp,
} from "firebase/firestore";

import type { SwapperMember } from "@/features/users/types";
import { db } from "@/lib/firebase";

type UserDoc = {
  email?: string;
  displayName?: string;
  handle?: string;
  accountStatus?: string;
  verified?: boolean;
  trustLevel?: string;
  swapCount?: number;
  reportCount?: number;
  lastActiveAt?: Timestamp;
  createdAt?: Timestamp;
};

function formatLastActive(ts?: Timestamp): string {
  if (!ts) return "—";
  const hours = Math.floor((Date.now() - ts.toMillis()) / (1000 * 60 * 60));
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

function trustDots(level?: string): number {
  switch (level) {
    case "high":
      return 5;
    case "good":
      return 4;
    case "low":
      return 2;
    case "review":
      return 1;
    default:
      return 3;
  }
}

export function mapUserToMember(id: string, data: UserDoc): SwapperMember {
  const status = (data.accountStatus ?? "active") as SwapperMember["status"];
  const trust = (data.trustLevel ?? "good") as SwapperMember["trust"];
  const name = data.displayName ?? data.email?.split("@")[0] ?? "User";
  return {
    id,
    name,
    handle: data.handle ?? id.slice(0, 8),
    email: data.email ?? "",
    verified: data.verified ?? false,
    avatarSeed: id,
    status,
    trust,
    trustDots: trustDots(data.trustLevel),
    swaps: data.swapCount ?? 0,
    reports: data.reportCount ?? 0,
    lastActive: formatLastActive(data.lastActiveAt ?? data.createdAt),
  };
}

export async function fetchSwapperMembers(max = 200): Promise<SwapperMember[]> {
  const q = query(
    collection(db, "users"),
    where("role", "==", "user"),
    orderBy("createdAt", "desc"),
    limit(max),
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => mapUserToMember(d.id, d.data() as UserDoc));
}
