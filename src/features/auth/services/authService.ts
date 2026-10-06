import type { LoginCredentials, AuthSession } from "@/features/auth/types";
import type { User } from "@/features/users/types";

const MOCK_USER: User = {
  id: "1",
  name: "Sara Miller",
  email: "admin@swapit.io",
  role: "admin",
};

export async function login(
  credentials: LoginCredentials,
): Promise<{ user: User; session: AuthSession }> {
  await delay(400);

  if (!credentials.email || !credentials.password) {
    throw new Error("Email and password are required.");
  }

  return {
    user: { ...MOCK_USER, email: credentials.email },
    session: {
      token: "mock-token",
      expiresAt: new Date(Date.now() + 86400000).toISOString(),
    },
  };
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
