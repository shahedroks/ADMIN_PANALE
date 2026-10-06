export type PlanStatus = "active" | "draft";

export type SubscriptionPlan = {
  id: string;
  name: string;
  sku: string;
  badge: string;
  badgeTone: "best" | "flex" | "base" | "draft";
  description: string;
  longDescription: string;
  priceDisplay: string;
  priceSub?: string;
  price: number;
  currency: string;
  cadence: "monthly" | "yearly" | "free";
  status: PlanStatus;
  iconTone: "premium" | "monthly" | "free" | "draft";
  listingUnlimited: boolean;
  photosPerListing: number;
  searchRadiusMiles: number;
  featureGates: { id: string; title: string; subtitle: string; enabled: boolean }[];
};

export type PlanSummaryKpiIcon = "tag" | "cash" | "cycle" | "verified";

export const plansSummaryKpis = [
  {
    id: "paid",
    label: "Paid Subscribers",
    value: "4,820",
    hint: "+14.8% vs last mo",
    hintTone: "positive" as const,
    icon: "tag" as const,
    iconBg: "rgba(0, 36, 26, 0.05)",
  },
  {
    id: "mrr",
    label: "Active MRR",
    value: "$26,820",
    hint: "+$5.56 ARPU",
    hintTone: "positive" as const,
    icon: "cash" as const,
    iconBg: "rgba(172, 248, 71, 0.2)",
  },
  {
    id: "circulating",
    label: "Total Circulating",
    value: "18,450",
    hint: "Free + Paid Swappers",
    hintTone: "neutral" as const,
    icon: "cycle" as const,
    iconBg: "rgba(0, 36, 26, 0.05)",
  },
  {
    id: "conversion",
    label: "Paid Conversion",
    value: "26.1%",
    hint: "Tier-1 Benchmark",
    hintTone: "neutral" as const,
    icon: "verified" as const,
    iconBg: "#caead6",
  },
];

export const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: "prem-yr",
    name: "Premium Yearly",
    sku: "SWAP-TIER-PREM-YR",
    badge: "Best value",
    badgeTone: "best",
    description: "Maximum circular perks with smart matching & locker network.",
    longDescription:
      "Unlock unlimited listings, statewide discovery, smart-match routing, and verified locker handoffs for power swappers committed to the circular economy.",
    priceDisplay: "$59.99",
    priceSub: "/ year ($4.99/mo)",
    price: 59.99,
    currency: "USD",
    cadence: "yearly",
    status: "active",
    iconTone: "premium",
    listingUnlimited: true,
    photosPerListing: 8,
    searchRadiusMiles: 25,
    featureGates: [
      { id: "g1", title: "Smart Match Routing", subtitle: "Priority queue for AI pairing", enabled: true },
      { id: "g2", title: "Locker Network Access", subtitle: "Verified handoff nodes", enabled: true },
      { id: "g3", title: "Boosted Discovery", subtitle: "Elevated search placement", enabled: true },
      { id: "g4", title: "Concierge Escrow", subtitle: "Premium dispute lane", enabled: true },
    ],
  },
  {
    id: "prem-mo",
    name: "Premium Monthly",
    sku: "SWAP-TIER-PREM-MO",
    badge: "Flexible",
    badgeTone: "flex",
    description: "Month-to-month commitment with priority safe swap access.",
    longDescription:
      "Flexible premium access with priority moderation, extended photo limits, and expanded discovery radius without annual commitment.",
    priceDisplay: "$6.99",
    priceSub: "/ month",
    price: 6.99,
    currency: "USD",
    cadence: "monthly",
    status: "active",
    iconTone: "monthly",
    listingUnlimited: false,
    photosPerListing: 6,
    searchRadiusMiles: 15,
    featureGates: [
      { id: "g1", title: "Smart Match Routing", subtitle: "Priority queue for AI pairing", enabled: true },
      { id: "g2", title: "Locker Network Access", subtitle: "Verified handoff nodes", enabled: false },
      { id: "g3", title: "Boosted Discovery", subtitle: "Elevated search placement", enabled: true },
      { id: "g4", title: "Concierge Escrow", subtitle: "Premium dispute lane", enabled: false },
    ],
  },
  {
    id: "free",
    name: "Free Swapper",
    sku: "SWAP-TIER-FREE-BASE",
    badge: "Default baseline",
    badgeTone: "base",
    description: "Zero commitment entry-level neighborhood circular trading.",
    longDescription:
      "Baseline tier for new members with core listing limits, local discovery, and community safety tooling at no cost.",
    priceDisplay: "$0.00",
    priceSub: "/ forever",
    price: 0,
    currency: "USD",
    cadence: "free",
    status: "active",
    iconTone: "free",
    listingUnlimited: false,
    photosPerListing: 3,
    searchRadiusMiles: 5,
    featureGates: [
      { id: "g1", title: "Smart Match Routing", subtitle: "Priority queue for AI pairing", enabled: false },
      { id: "g2", title: "Locker Network Access", subtitle: "Verified handoff nodes", enabled: false },
      { id: "g3", title: "Boosted Discovery", subtitle: "Elevated search placement", enabled: false },
      { id: "g4", title: "Concierge Escrow", subtitle: "Premium dispute lane", enabled: false },
    ],
  },
  {
    id: "hub-draft",
    name: "Hub Plus Pilot",
    sku: "SWAP-TIER-HUB-DR",
    badge: "Draft",
    badgeTone: "draft",
    description: "Campus hub bundle — staging for Q1 rollout.",
    longDescription: "Draft configuration for university hub pilots with custom quotas and sponsor billing.",
    priceDisplay: "$12.99",
    priceSub: "/ month",
    price: 12.99,
    currency: "USD",
    cadence: "monthly",
    status: "draft",
    iconTone: "draft",
    listingUnlimited: false,
    photosPerListing: 5,
    searchRadiusMiles: 10,
    featureGates: [
      { id: "g1", title: "Smart Match Routing", subtitle: "Priority queue for AI pairing", enabled: true },
      { id: "g2", title: "Locker Network Access", subtitle: "Verified handoff nodes", enabled: false },
      { id: "g3", title: "Boosted Discovery", subtitle: "Elevated search placement", enabled: false },
      { id: "g4", title: "Concierge Escrow", subtitle: "Premium dispute lane", enabled: false },
    ],
  },
];

export type PlanFilterTab = "all" | "active" | "draft";
