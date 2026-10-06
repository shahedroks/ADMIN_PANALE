import { Outlet } from "react-router-dom";
import { DemoToastStack } from "@/components/DemoToastStack";
import { ShellPageTitle } from "@/layouts/ShellPageTitle";
import { DashboardSidebar } from "@/layouts/DashboardSidebar";
import { DashboardTopBar } from "@/layouts/DashboardTopBar";
import "@/features/dashboard/styles/dashboard-shell.css";

export function AppLayout() {
  return (
    <div className="dash-shell">
      <ShellPageTitle />
      <DashboardSidebar />
      <div className="dash-shell__main">
        <DashboardTopBar />
        <div className="dash-shell__content">
          <Outlet />
        </div>
      </div>
      <DemoToastStack />
    </div>
  );
}
