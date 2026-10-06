import type { SwapperMember, UserKpi } from "@/features/users/types";

export const userKpis: UserKpi[] = [
  {
    id: "members",
    label: "Total network members",
    value: "3,420",
    hint: "+142 this week",
    hintTone: "positive",
    icon: "members",
  },
  {
    id: "trust",
    label: "Verified trust score",
    value: "96.8%",
    hint: "Peer-attested",
    hintTone: "positive",
    icon: "trust",
  },
  {
    id: "restrict",
    label: "Active restrictions",
    value: "78",
    hint: "Under moderation",
    hintTone: "neutral",
    icon: "restrict",
  },
  {
    id: "flag",
    label: "Flagged incidents",
    value: "11",
    hint: "Requires supervisor review",
    hintTone: "negative",
    alert: true,
    icon: "flag",
  },
];

export const userFilterCounts = {
  all: 3420,
  active: 3310,
  restricted: 78,
  banned: 32,
};

export const PAGE_SIZE = 6;

const baseMembers: SwapperMember[] = [
  {
    id: "u1",
    name: "Marcus Chen",
    handle: "@marcus_c",
    email: "marcus.chen@mail.io",
    verified: true,
    avatarSeed: "marcus",
    status: "active",
    trust: "high",
    trustDots: 5,
    swaps: 34,
    reports: 0,
    lastActive: "10m ago",
  },
  {
    id: "u2",
    name: "Elena Rostova",
    handle: "@elena_r",
    email: "elena.r@mail.io",
    verified: true,
    avatarSeed: "elena",
    status: "active",
    trust: "good",
    trustDots: 4,
    swaps: 21,
    reports: 1,
    lastActive: "1h ago",
  },
  {
    id: "u3",
    name: "Sam Keller",
    handle: "@sam_k",
    email: "sam.keller@mail.io",
    verified: false,
    avatarSeed: "sam",
    status: "restricted",
    trust: "review",
    trustDots: 2,
    swaps: 6,
    reports: 4,
    lastActive: "Yesterday",
  },
  {
    id: "u4",
    name: "Jordan Ayers",
    handle: "@jayers",
    email: "j.ayers@mail.io",
    verified: true,
    avatarSeed: "jordan",
    status: "active",
    trust: "good",
    trustDots: 4,
    swaps: 18,
    reports: 0,
    lastActive: "3h ago",
  },
  {
    id: "u5",
    name: "Priya Nair",
    handle: "@priya_n",
    email: "priya.n@mail.io",
    verified: true,
    avatarSeed: "priya",
    status: "restricted",
    trust: "review",
    trustDots: 3,
    swaps: 12,
    reports: 3,
    lastActive: "2d ago",
  },
  {
    id: "u6",
    name: "Alex M.",
    handle: "@alex_m",
    email: "alex.m@mail.io",
    verified: false,
    avatarSeed: "alex",
    status: "banned",
    trust: "low",
    trustDots: 1,
    swaps: 2,
    reports: 9,
    lastActive: "1w ago",
  },
];

export const swapperMembers: SwapperMember[] = [...baseMembers];

while (swapperMembers.length < 24) {
  const i = swapperMembers.length;
  swapperMembers.push({
    ...baseMembers[i % baseMembers.length],
    id: `u${i + 1}`,
    name: `Member ${i + 1}`,
    handle: `@member_${i + 1}`,
    email: `member${i + 1}@mail.io`,
    avatarSeed: `member-${i}`,
  });
}

export const workflowCards = [
  {
    title: "Auto-restrictions",
    body: "Users with 3+ unresolved reports are automatically quarantined from new swap requests.",
    link: "Review automated rules →",
  },
  {
    title: "Verification queue",
    body: "42 members requested verified physical drop badges pending batch review.",
    link: "Open batch validator →",
  },
  {
    title: "Mediation room",
    body: "2 disputed trades currently active and awaiting moderator assignment.",
    link: "Enter mediation dashboard →",
  },
];
