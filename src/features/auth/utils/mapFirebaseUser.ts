import type { User as FirebaseUser } from "firebase/auth";
import type { User, UserRole } from "@/features/users/types";

const DEFAULT_ADMIN_AVATAR =
  "https://i.pravatar.cc/96?u=sara-miller-swap-admin";

export function mapFirebaseUser(
  firebaseUser: FirebaseUser,
  role: UserRole,
): User {
  const email = firebaseUser.email ?? "";
  const name =
    firebaseUser.displayName?.trim() ||
    email.split("@")[0] ||
    "Admin";

  return {
    id: firebaseUser.uid,
    name,
    email,
    role,
    avatarUrl: firebaseUser.photoURL ?? DEFAULT_ADMIN_AVATAR,
  };
}
