import { Navigate, Outlet } from "react-router-dom";
import { useAppStore } from "@/store";

export function ProtectedRoute() {
  const { isAuthenticated, authReady } = useAppStore();

  if (!authReady) {
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
