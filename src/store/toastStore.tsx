import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type ToastTone = "success" | "info" | "error";

export type AppToast = {
  id: string;
  message: string;
  tone: ToastTone;
};

type ToastStoreValue = {
  toasts: AppToast[];
  dismissToast: (id: string) => void;
  pushToast: (message: string, tone?: ToastTone) => void;
};

const ToastContext = createContext<ToastStoreValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<AppToast[]>([]);

  const pushToast = useCallback((message: string, tone: ToastTone = "success") => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    setToasts((prev) => [...prev, { id, message, tone }]);
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3200);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const value = useMemo<ToastStoreValue>(
    () => ({ toasts, dismissToast, pushToast }),
    [toasts, dismissToast, pushToast],
  );

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>;
}

export function useToast(): ToastStoreValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

/** @deprecated Use useToast */
export function useDemoStore(): Pick<ToastStoreValue, "toasts" | "dismissToast" | "pushToast"> {
  return useToast();
}

/** @deprecated Use ToastProvider */
export const DemoProvider = ToastProvider;
