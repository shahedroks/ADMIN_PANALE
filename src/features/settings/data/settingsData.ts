export type AdminMember = {
  id: string;
  name: string;
  email: string;
  role: string;
  roleVariant: "super" | "moderator" | "support";
  department: string;
  lastActive: string;
};

export const adminMembers: AdminMember[] = [
  {
    id: "1",
    name: "Sara Miller",
    email: "sara.miller@swapit.io",
    role: "Super Admin",
    roleVariant: "super",
    department: "Executive Leadership",
    lastActive: "Just now",
  },
  {
    id: "2",
    name: "Elena Rostova",
    email: "elena.r@swapit.io",
    role: "Moderator",
    roleVariant: "moderator",
    department: "Review & Safety",
    lastActive: "4h ago",
  },
  {
    id: "3",
    name: "James Okonkwo",
    email: "j.okonkwo@swapit.io",
    role: "Support Lead",
    roleVariant: "support",
    department: "Member Success",
    lastActive: "1d ago",
  },
  {
    id: "4",
    name: "Priya Shah",
    email: "priya.shah@swapit.io",
    role: "Moderator",
    roleVariant: "moderator",
    department: "Content Review",
    lastActive: "2d ago",
  },
  {
    id: "5",
    name: "Daniel Wu",
    email: "d.wu@swapit.io",
    role: "Support Lead",
    roleVariant: "support",
    department: "Trust Operations",
    lastActive: "3d ago",
  },
];

export const settingsNav = [
  { id: "general", label: "General", sub: "Profile & overview" },
  { id: "team", label: "Team & Roles", badge: "5" },
  { id: "notifications", label: "Notifications" },
  { id: "security", label: "Security", icon: "lock" as const },
] as const;

export type SettingsSectionId = (typeof settingsNav)[number]["id"];
