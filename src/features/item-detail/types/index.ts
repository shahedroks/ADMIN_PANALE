export type GallerySlide = {
  label: string;
  /** Fallback for placeholder when [url] is missing. */
  seed: string;
  url?: string;
};

export type ItemDetail = {
  routeId: string;
  itemCode: string;
  title: string;
  listedOn: string;
  reportedMeta: string;
  statusLabel: string;
  priorityLabel: string;
  gallery: GallerySlide[];
  primarySeed: string;
  category: string;
  condition: string;
  createdVia: string;
  exchangeTags: string[];
  description: string;
  highlightSnippet: string;
  violation: {
    ruleId: string;
    title: string;
    summary: string;
    nlpHits: string[];
  };
  ownerId: string;
  location: string;
  wants: string;
  owner: {
    name: string;
    handle: string;
    memberSince: string;
    badge: string;
    trustScore: string;
    swapsLabel: string;
    infractions: string;
    photoUrl?: string;
  };
  showViolation: boolean;
  suggestedEditNote: string;
  ruleReference: {
    title: string;
    body: string;
  };
};
