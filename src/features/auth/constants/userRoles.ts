import type { UserRole } from "@/features/users/types";

/** Mobile app sign-ups (apk-). */
export const APP_USER_ROLE = "user" as const;

export const ADMIN_PANEL_ROLES: readonly UserRole[] = [
  "admin",
  "manager",
  "viewer",
];

export function isAdminPanelRole(
  role: string | undefined | null,
): role is UserRole {
  return (
    role === "admin" || role === "manager" || role === "viewer"
  );
}
