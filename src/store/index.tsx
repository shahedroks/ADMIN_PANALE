import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { User } from "@/features/users/types";

const SESSION_KEY = "swapit_demo_session";

type AppState = {
  user: User | null;
  isAuthenticated: boolean;
};

type AppContextValue = AppState & {
  login: (user: User) => void;
  logout: () => void;
};

const AppContext = createContext<AppContextValue | null>(null);

const DEFAULT_ADMIN_AVATAR = "https://i.pravatar.cc/96?u=sara-miller-swap-admin";

function readStoredUser(): User | null {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as User;
    if (!parsed.avatarUrl) {
      return { ...parsed, avatarUrl: DEFAULT_ADMIN_AVATAR };
    }
    return parsed;
  } catch {
    return null;
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => readStoredUser());

  const login = useCallback((next: User) => {
    setUser(next);
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(next));
  }, []);
  const logout = useCallback(() => {
    setUser(null);
    sessionStorage.removeItem(SESSION_KEY);
  }, []);

  const value = useMemo<AppContextValue>(
    () => ({
      user,
      isAuthenticated: user !== null,
      login,
      logout,
    }),
    [user, login, logout],
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
