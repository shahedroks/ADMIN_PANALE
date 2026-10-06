import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AppLayout } from "@/layouts/AppLayout";
import { AuthLayout } from "@/layouts/AuthLayout";
import { LoginPage } from "@/features/auth/pages/LoginPage";
import { DashboardPage } from "@/features/dashboard/pages/DashboardPage";
import { UserDetailPage } from "@/features/user-detail/pages/UserDetailPage";
import { UsersPage } from "@/features/users/pages/UsersPage";
import { OrdersPage } from "@/features/orders/pages/OrdersPage";
import { ItemDetailPage } from "@/features/item-detail/pages/ItemDetailPage";
import { ItemsReviewPage } from "@/features/items-review/pages/ItemsReviewPage";
import { ReportsPage } from "@/features/reports/pages/ReportsPage";
import { SettingsPage } from "@/features/settings/pages/SettingsPage";
import { PlansManagementPage } from "@/features/subscriptions/pages/PlansManagementPage";
import { SubscriptionsOverviewPage } from "@/features/subscriptions/pages/SubscriptionsOverviewPage";
import { ProtectedRoute } from "@/routes/ProtectedRoute";

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="users/:userId" element={<UserDetailPage />} />
            <Route path="users" element={<UsersPage />} />
            <Route path="orders" element={<OrdersPage />} />
            <Route path="items-review/:itemId" element={<ItemDetailPage />} />
            <Route path="items-review" element={<ItemsReviewPage />} />
            <Route path="products" element={<Navigate to="/items-review" replace />} />
            <Route path="reports" element={<ReportsPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="subscriptions/plans" element={<PlansManagementPage />} />
            <Route path="subscriptions" element={<SubscriptionsOverviewPage />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
