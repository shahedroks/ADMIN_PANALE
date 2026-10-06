import { useCallback, useState } from "react";
import { login } from "@/features/auth/services/authService";
import type { LoginCredentials } from "@/features/auth/types";
import { useAppStore } from "@/store";

export function useLogin() {
  const { login: setSessionUser } = useAppStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = useCallback(
    async (credentials: LoginCredentials) => {
      setLoading(true);
      setError(null);
      try {
        const { user } = await login(credentials);
        setSessionUser(user);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Login failed.");
        throw e;
      } finally {
        setLoading(false);
      }
    },
    [setSessionUser],
  );

  return { submit, loading, error };
}
