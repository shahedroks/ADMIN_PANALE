import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { APP_USER_ROLE } from "@/features/auth/constants/userRoles";

export type UserProfile = {
  email: string;
  displayName: string | null;
  role: string;
  photoUrl?: string | null;
};

const usersCollection = "users";

function mapProfileData(data: Record<string, unknown>): UserProfile {
  const role = (data.role as string | undefined)?.trim() || APP_USER_ROLE;
  return {
    email: (data.email as string) ?? "",
    displayName: (data.displayName as string | null) ?? null,
    role,
    photoUrl: (data.photoUrl as string | null | undefined) ?? null,
  };
}

export async function fetchUserProfile(uid: string): Promise<UserProfile | null> {
  const snap = await getDoc(doc(db, usersCollection, uid));
  if (!snap.exists()) return null;
  return mapProfileData(snap.data());
}

/** Finds a profile by email when the Firestore doc id may not match Auth UID. */
export async function fetchUserProfileByEmail(
  email: string,
): Promise<{ uid: string; profile: UserProfile } | null> {
  const normalized = email.trim();
  if (!normalized) return null;

  const snap = await getDocs(
    query(
      collection(db, usersCollection),
      where("email", "==", normalized),
      limit(1),
    ),
  );
  if (snap.empty) {
    const lowerSnap = await getDocs(
      query(
        collection(db, usersCollection),
        where("email", "==", normalized.toLowerCase()),
        limit(1),
      ),
    );
    if (lowerSnap.empty) return null;
    const docSnap = lowerSnap.docs[0];
    return { uid: docSnap.id, profile: mapProfileData(docSnap.data()) };
  }

  const docSnap = snap.docs[0];
  return { uid: docSnap.id, profile: mapProfileData(docSnap.data()) };
}

/** Creates a mobile-app profile if missing (apk registration path). */
export async function ensureAppUserProfile(
  uid: string,
  email: string,
  displayName: string | null,
): Promise<UserProfile> {
  const ref = doc(db, usersCollection, uid);
  const existing = await getDoc(ref);
  if (existing.exists()) {
    const data = existing.data();
    return {
      email: (data.email as string) ?? email,
      displayName: (data.displayName as string | null) ?? displayName,
      role: (data.role as string) ?? APP_USER_ROLE,
    };
  }

  const profile: UserProfile = {
    email,
    displayName,
    role: APP_USER_ROLE,
  };

  await setDoc(ref, {
    email: profile.email,
    displayName: profile.displayName,
    role: profile.role,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return profile;
}
