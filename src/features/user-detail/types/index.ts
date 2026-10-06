export type UserReportEntry = {
  id: string;
  date: string;
  status: "under_review" | "dismissed";
  summary: string;
  actor: string;
};

export type UserListedItem = {
  id: string;
  title: string;
  category: string;
  status: "under_review" | "in_swap" | "active";
  imageSeed: string;
};

export type UserActionLogEntry = {
  id: string;
  time: string;
  text: string;
  tone: "review" | "flag" | "verify" | "system";
};

export type UserDetailProfile = {
  routeId: string;
  userCode: string;
  name: string;
  trusted: boolean;
  bio: string;
  tags: string[];
  trustPercent: number;
  joined: string;
  lastActive: string;
  swapsCompleted: number;
  reportsUnderReview: number;
  email: string;
  handle: string;
  ipAddress: string;
  avatarSeed: string;
  reports: UserReportEntry[];
  items: UserListedItem[];
  actions: UserActionLogEntry[];
};
