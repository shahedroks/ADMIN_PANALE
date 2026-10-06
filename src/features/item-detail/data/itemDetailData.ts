import type { ItemDetail } from "@/features/item-detail/types";

export const itemDetailStatic = {
  gallery: [
    { label: "Front", seed: "turntable-front" },
    { label: "Needle", seed: "turntable-needle" },
    { label: "Arm", seed: "turntable-arm" },
    { label: "Serial", seed: "turntable-serial" },
  ],
  exchangeTags: ["Mechanical Keyboards", "Film Cameras", "Hi-Fi Speakers"],
  description:
    'Beautiful rosewood vintage turntable. Works perfectly, includes original dust cover. Prefer local pickup in Brooklyn. Direct cash wire transfer preferred before meetup outside Brooklyn zone. Message on telegram @marcus_trade for faster response.',
  highlightSnippet:
    "Direct cash wire transfer preferred before meetup outside Brooklyn zone. Message on telegram @marcus_trade",
  violation: {
    ruleId: "3.4",
    title: "Off-Platform Financial Solicitations & External Contact Directing",
    summary:
      "System NLP auto-flagged off-platform payment language and external contact handles in the listing body.",
    nlpHits: ['"cash wire transfer"', '"@marcus_trade"'],
  },
  suggestedEditNote:
    "Please remove mentions of wire transfers and external Telegram contact. All coordination must stay inside SWAP IT escrow chat per Rule 3.4.",
  ruleReference: {
    title: "Community Policy Reference — Rule 3.4",
    body: "Users may not solicit off-platform financial transactions or share external contact handles (Telegram, WhatsApp, Venmo, etc.) before a verified in-app swap is initiated.",
  },
} satisfies Pick<
  ItemDetail,
  | "gallery"
  | "exchangeTags"
  | "description"
  | "highlightSnippet"
  | "violation"
  | "suggestedEditNote"
  | "ruleReference"
>;
