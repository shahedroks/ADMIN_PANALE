import { signOut, type User as FirebaseUser } from "firebase/auth";
import type { User } from "@/features/users/types";
import { auth } from "@/lib/firebase";
import { isAdminPanelRole } from "@/features/auth/constants/userRoles";
import { fetchUserProfile } from "@/features/auth/services/userProfileService";
import { mapFirebaseUser } from "@/features/auth/utils/mapFirebaseUser";

export async function resolveAdminUser(
  firebaseUser: FirebaseUser,
): Promise<User> {
  const profile = await fetchUserProfile(firebaseUser.uid);

  if (!profile || !isAdminPanelRole(profile.role)) {
    await signOut(auth);
    throw new Error(
      "You do not have admin access. Ask a super admin to set your role in Firebase.",
    );
  }

  return mapFirebaseUser(firebaseUser, profile.role);
}
