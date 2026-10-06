import type { UserActionLogEntry, UserListedItem, UserReportEntry } from "@/features/user-detail/types";

export const marcusProfileBase = {
  bio: "Long-time circular economy advocate focused on audio gear and film photography. Known for fast responses and careful packaging during local swaps.",
  tags: ["Verified cycler", "Top responder", "Brooklyn, NY"],
  joined: "Jan 14, 2023",
  ipAddress: "198.51.100.42",
  reports: [
    {
      id: "r1",
      date: "Oct 24, 2023",
      status: "under_review",
      summary: "Potential off-platform payment language in turntable listing.",
      actor: "Reported by @elena_r",
    },
    {
      id: "r2",
      date: "Aug 02, 2023",
      status: "dismissed",
      summary: "Mismatch on item condition — resolved via mediation.",
      actor: "Cleared by Sara Miller",
    },
  ] as UserReportEntry[],
  items: [
    {
      id: "i1",
      title: "Vintage Vinyl Turntable",
      category: "Electronics",
      status: "under_review",
      imageSeed: "turntable",
    },
    {
      id: "i2",
      title: "Keychron K2 V2 Keyboard",
      category: "Electronics",
      status: "in_swap",
      imageSeed: "keyboard",
    },
    {
      id: "i3",
      title: "Olympus OM-1 35mm Film",
      category: "Photography",
      status: "active",
      imageSeed: "camera",
    },
  ] as UserListedItem[],
  actions: [
    {
      id: "a1",
      time: "2h ago",
      text: "Report #1048 marked under review by Sara Miller",
      tone: "review",
    },
    {
      id: "a2",
      time: "1d ago",
      text: "Automated NLP flag on listing #SW-9821",
      tone: "flag",
    },
    {
      id: "a3",
      time: "3d ago",
      text: "Identity verification badge renewed",
      tone: "verify",
    },
    {
      id: "a4",
      time: "1w ago",
      text: "Trust score recalculated (+2%)",
      tone: "system",
    },
  ] as UserActionLogEntry[],
};
