import { FirebaseError } from "firebase/app";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import type { LoginCredentials, AuthSession } from "@/features/auth/types";
import type { User } from "@/features/users/types";
import { auth } from "@/lib/firebase";
import { resolveAdminUser } from "@/features/auth/utils/resolveAdminUser";

export async function login(
  credentials: LoginCredentials,
): Promise<{ user: User; session: AuthSession }> {
  if (!credentials.email || !credentials.password) {
    throw new Error("Email and password are required.");
  }

  try {
    const credential = await signInWithEmailAndPassword(
      auth,
      credentials.email.trim(),
      credentials.password,
    );
    const user = await resolveAdminUser(credential.user);
    const token = await credential.user.getIdToken();

    return {
      user,
      session: {
        token,
        expiresAt: new Date(Date.now() + 3600000).toISOString(),
      },
    };
  } catch (error) {
    if (error instanceof FirebaseError) {
      throw error;
    }
    if (error instanceof Error && error.message.includes("admin access")) {
      throw error;
    }
    throw error;
  }
}

export async function logoutFromFirebase(): Promise<void> {
  await signOut(auth);
}
