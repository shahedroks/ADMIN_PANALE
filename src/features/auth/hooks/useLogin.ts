import { useCallback, useState } from "react";
import { login } from "@/features/auth/services/authService";
import type { LoginCredentials } from "@/features/auth/types";
import { firebaseAuthErrorMessage } from "@/features/auth/utils/firebaseAuthErrors";
import { useI18n } from "@/i18n";
import { useAppStore } from "@/store";

export function useLogin() {
  const { t } = useI18n();
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
        setError(firebaseAuthErrorMessage(e, t));
        throw e;
      } finally {
        setLoading(false);
      }
    },
    [setSessionUser, t],
  );

  return { submit, loading, error };
}
