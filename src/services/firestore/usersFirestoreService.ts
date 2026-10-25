import {
  collection,
  doc,
  getCountFromServer,
  getDoc,
  getDocs,
  limit,
  onSnapshot,
  query,
  Timestamp,
  where,
  type Unsubscribe,
} from "firebase/firestore";

import type { SwapperMember } from "@/features/users/types";
import { db } from "@/lib/firebase";

export type UserRestrictionDoc = {
  manualReview?: boolean;
  allowChat?: boolean;
  allowListings?: boolean;
  durationDays?: string;
  note?: string;
};

export type UserDoc = {
  email?: string;
  displayName?: string;
  handle?: string;
  photoUrl?: string;
  bio?: string;
  location?: string;
  accountStatus?: string;
  verified?: boolean;
  trustLevel?: string;
  swapCount?: number;
  reportCount?: number;
  lastActiveAt?: Timestamp;
  createdAt?: Timestamp;
  lastKnownIp?: string;
  restriction?: UserRestrictionDoc;
  restrictedAt?: Timestamp;
  bannedAt?: Timestamp;
  liftedAt?: Timestamp;
};

function formatLastActive(ts?: Timestamp): string {
  if (!ts) return "—";
  const hours = Math.floor((Date.now() - ts.toMillis()) / (1000 * 60 * 60));
  if (hours < 1) return "0h ago";
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

function sortMembers(members: SwapperMember[]): SwapperMember[] {
  return [...members].sort((a, b) => a.name.localeCompare(b.name));
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
    photoUrl: data.photoUrl,
    status,
    trust,
    trustDots: trustDots(data.trustLevel),
    swaps: data.swapCount ?? 0,
    reports: data.reportCount ?? 0,
    lastActive: formatLastActive(data.lastActiveAt ?? data.createdAt),
  };
}

export async function fetchUserById(uid: string): Promise<UserDoc | null> {
  const snap = await getDoc(doc(db, "users", uid));
  if (!snap.exists()) return null;
  return snap.data() as UserDoc;
}

async function loadSwapperMemberDocs(max: number): Promise<SwapperMember[]> {
  const q = query(collection(db, "users"), where("role", "==", "user"), limit(max));
  const snap = await getDocs(q);
  return sortMembers(snap.docs.map((d) => mapUserToMember(d.id, d.data() as UserDoc)));
}

export async function fetchSwapperMembers(max = 500): Promise<SwapperMember[]> {
  return loadSwapperMemberDocs(max);
}

export function subscribeUserMember(
  userId: string,
  onData: (member: SwapperMember | null) => void,
  onError: (message: string) => void,
): Unsubscribe {
  return onSnapshot(
    doc(db, "users", userId),
    (snap) => {
      if (!snap.exists()) {
        onData(null);
        return;
      }
      onData(mapUserToMember(snap.id, snap.data() as UserDoc));
    },
    (err) => onError(err.message),
  );
}

export function subscribeSwapperMembers(
  onData: (members: SwapperMember[]) => void,
  onError: (message: string) => void,
  max = 500,
): Unsubscribe {
  const q = query(collection(db, "users"), where("role", "==", "user"), limit(max));
  return onSnapshot(
    q,
    (snap) => {
      onData(sortMembers(snap.docs.map((d) => mapUserToMember(d.id, d.data() as UserDoc))));
    },
    (err) => {
      onError(err.message);
    },
  );
}

export async function fetchOpenReportCount(): Promise<number> {
  const q = query(
    collection(db, "reports"),
    where("status", "in", ["open", "under_review"]),
  );
  const snap = await getCountFromServer(q);
  return snap.data().count;
}

export async function countMembersJoinedSince(days: number): Promise<number> {
  const since = Timestamp.fromMillis(Date.now() - days * 24 * 60 * 60 * 1000);
  try {
    const q = query(
      collection(db, "users"),
      where("role", "==", "user"),
      where("createdAt", ">=", since),
    );
    const snap = await getCountFromServer(q);
    return snap.data().count;
  } catch {
    return 0;
  }
}
