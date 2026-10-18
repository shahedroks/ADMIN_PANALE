import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { APP_USER_ROLE } from "@/features/auth/constants/userRoles";

export type UserProfile = {
  email: string;
  displayName: string | null;
  role: string;
};

const usersCollection = "users";

export async function fetchUserProfile(uid: string): Promise<UserProfile | null> {
  const snap = await getDoc(doc(db, usersCollection, uid));
  if (!snap.exists()) return null;
  const data = snap.data();
  return {
    email: (data.email as string) ?? "",
    displayName: (data.displayName as string | null) ?? null,
    role: (data.role as string) ?? APP_USER_ROLE,
  };
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
