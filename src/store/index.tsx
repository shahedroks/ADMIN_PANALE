import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { onAuthStateChanged } from "firebase/auth";
import type { User } from "@/features/users/types";
import { auth } from "@/lib/firebase";
import { resolveAdminUser } from "@/features/auth/utils/resolveAdminUser";
import { logoutFromFirebase } from "@/features/auth/services/authService";

type AppState = {
  user: User | null;
  isAuthenticated: boolean;
  authReady: boolean;
  authError: string | null;
};

type AppContextValue = AppState & {
  login: (user: User) => void;
  refreshUser: () => Promise<void>;
  logout: () => Promise<void>;
  clearAuthError: () => void;
};

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    return onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        setUser(null);
        setAuthReady(true);
        return;
      }

      try {
        const appUser = await resolveAdminUser(firebaseUser);
        setUser(appUser);
        setAuthError(null);
      } catch (error) {
        setUser(null);
        setAuthError(
          error instanceof Error
            ? error.message
            : "You do not have admin access.",
        );
      } finally {
        setAuthReady(true);
      }
    });
  }, []);

  const login = useCallback((next: User) => {
    setUser(next);
    setAuthError(null);
  }, []);

  const refreshUser = useCallback(async () => {
    const firebaseUser = auth.currentUser;
    if (!firebaseUser) return;
    const appUser = await resolveAdminUser(firebaseUser);
    setUser(appUser);
    setAuthError(null);
  }, []);

  const logout = useCallback(async () => {
    await logoutFromFirebase();
    setUser(null);
  }, []);

  const clearAuthError = useCallback(() => setAuthError(null), []);

  const value = useMemo<AppContextValue>(
    () => ({
      user,
      isAuthenticated: user !== null,
      authReady,
      authError,
      login,
      refreshUser,
      logout,
      clearAuthError,
    }),
    [user, authReady, authError, login, refreshUser, logout, clearAuthError],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppStore(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error("useAppStore must be used within AppProvider");
  }
  return ctx;
}
