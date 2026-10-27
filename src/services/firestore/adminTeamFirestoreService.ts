import {
  collection,
  getDocs,
  limit,
  query,
  where,
  type Timestamp,
} from "firebase/firestore";

import type { AdminMember, PanelRoleId } from "@/features/settings/data/settingsData";
import { db } from "@/lib/firebase";

const PANEL_ROLES = ["admin", "manager", "viewer"];

function roleVariant(role: string): AdminMember["roleVariant"] {
  if (role === "admin") return "super";
  if (role === "manager") return "moderator";
  if (role === "viewer") return "support";
  return "support";
}

function roleLabel(role: string): string {
  switch (role) {
    case "admin":
      return "Super Admin";
    case "manager":
      return "Moderator";
    case "viewer":
      return "Viewer";
    default:
      return role;
  }
}

function relativeActive(ts?: Timestamp): string {
  if (!ts) return "—";
  const ms = Date.now() - ts.toMillis();
  const hours = Math.floor(ms / (1000 * 60 * 60));
  if (hours < 1) return "Just now";
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function mapUserToAdminMember(
  id: string,
  data: Record<string, unknown>,
): AdminMember | null {
  const role = (data.role as string) ?? "user";
  if (!PANEL_ROLES.includes(role)) return null;
  const email = (data.email as string) ?? "";
  const name =
    (data.displayName as string)?.trim() ||
    email.split("@")[0] ||
    `Admin ${id.slice(0, 6)}`;
  const department =
    role === "admin"
      ? "Executive Leadership"
      : role === "manager"
        ? "Review & Safety"
        : "Operations";
  return {
    id,
    name,
    email,
    role: roleLabel(role),
    panelRole: role as PanelRoleId,
    roleVariant: roleVariant(role),
    department,
    lastActive: relativeActive(data.updatedAt as Timestamp | undefined),
    photoUrl: (data.photoUrl as string | undefined)?.trim() || undefined,
  };
}

export async function fetchAdminTeamMembers(max = 50): Promise<AdminMember[]> {
  const members: AdminMember[] = [];
  for (const role of PANEL_ROLES) {
    const snap = await getDocs(
      query(collection(db, "users"), where("role", "==", role), limit(max)),
    );
    for (const docSnap of snap.docs) {
      const mapped = mapUserToAdminMember(docSnap.id, docSnap.data());
      if (mapped) members.push(mapped);
    }
  }
  members.sort((a, b) => a.name.localeCompare(b.name));
  return members;
}
