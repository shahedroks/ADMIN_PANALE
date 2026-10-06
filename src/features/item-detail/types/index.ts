export type GallerySlide = {
  label: string;
  seed: string;
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
  owner: {
    name: string;
    handle: string;
    memberSince: string;
    badge: string;
    trustScore: string;
    swapsLabel: string;
    infractions: string;
  };
  suggestedEditNote: string;
  ruleReference: {
    title: string;
    body: string;
  };
};
