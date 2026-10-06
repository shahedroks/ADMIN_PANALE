export type UserRole = "admin" | "manager" | "viewer";

/** Legacy admin user type (auth/store). */
export type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
};

export type AccountStatus = "active" | "restricted" | "banned";

export type TrustLevel = "high" | "good" | "low" | "review";

export type SwapperMember = {
  id: string;
  name: string;
  handle: string;
  email: string;
  verified: boolean;
  avatarSeed: string;
  status: AccountStatus;
  trust: TrustLevel;
  trustDots: number;
  swaps: number;
  reports: number;
  lastActive: string;
};

export type UserFilterTab = "all" | "active" | "restricted" | "banned";

export type UserKpi = {
  id: string;
  label: string;
  value: string;
  hint: string;
  hintTone: "positive" | "negative" | "neutral";
  alert?: boolean;
  icon: "members" | "trust" | "restrict" | "flag";
  iconBg: string;
};
