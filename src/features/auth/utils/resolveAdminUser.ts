import { signOut, type User as FirebaseUser } from "firebase/auth";
import type { User } from "@/features/users/types";
import { auth } from "@/lib/firebase";
import { isBootstrapAdminAccount } from "@/features/auth/constants/bootstrapAdmin";
import { isAdminPanelRole } from "@/features/auth/constants/userRoles";
import {
  fetchUserProfile,
  fetchUserProfileByEmail,
} from "@/features/auth/services/userProfileService";
import { mapFirebaseUser } from "@/features/auth/utils/mapFirebaseUser";

function adminAccessError(
  firebaseUser: FirebaseUser,
  detail: string,
): Error {
  return new Error(
    `${detail} (Auth UID: ${firebaseUser.uid}, email: ${firebaseUser.email ?? "—"}). ` +
      "In User Management, ensure a profile exists for this account with role admin, manager, or viewer.",
  );
}

export async function resolveAdminUser(
  firebaseUser: FirebaseUser,
): Promise<User> {
  if (isBootstrapAdminAccount(firebaseUser.uid, firebaseUser.email)) {
    return mapFirebaseUser(firebaseUser, "admin");
  }

  let profile = await fetchUserProfile(firebaseUser.uid);
  let profileUid = firebaseUser.uid;

  if (!profile && firebaseUser.email) {
    const byEmail = await fetchUserProfileByEmail(firebaseUser.email);
    if (byEmail) {
      profile = byEmail.profile;
      profileUid = byEmail.uid;
    }
  }

  if (!profile) {
    await signOut(auth);
    throw adminAccessError(
      firebaseUser,
      "No users profile found for this account",
    );
  }

  if (!isAdminPanelRole(profile.role)) {
    await signOut(auth);
    if (profileUid !== firebaseUser.uid) {
      throw adminAccessError(
        firebaseUser,
        `Profile with role "${profile.role}" is stored under users/${profileUid}, not your Auth UID`,
      );
    }
    throw adminAccessError(
      firebaseUser,
      `Your role is "${profile.role}" — admin panel requires admin, manager, or viewer`,
    );
  }

  if (profileUid !== firebaseUser.uid) {
    await signOut(auth);
    throw adminAccessError(
      firebaseUser,
      `Admin role is on users/${profileUid} but you signed in as users/${firebaseUser.uid}`,
    );
  }

  return mapFirebaseUser(firebaseUser, profile.role);
}
