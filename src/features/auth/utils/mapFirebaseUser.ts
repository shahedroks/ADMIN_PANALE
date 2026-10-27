import type { User as FirebaseUser } from "firebase/auth";
import type { User, UserRole } from "@/features/users/types";
import { resolveUserAvatarUrl } from "@/lib/userAvatar";

export function mapFirebaseUser(
  firebaseUser: FirebaseUser,
  role: UserRole,
  photoUrlFromProfile?: string | null,
): User {
  const email = firebaseUser.email ?? "";
  const name =
    firebaseUser.displayName?.trim() ||
    email.split("@")[0] ||
    "Admin";

  const photoUrl = photoUrlFromProfile?.trim() || firebaseUser.photoURL;

  return {
    id: firebaseUser.uid,
    name,
    email,
    role,
    avatarUrl: resolveUserAvatarUrl({
      photoUrl,
      seed: firebaseUser.uid,
      displayName: name,
    }),
  };
}
