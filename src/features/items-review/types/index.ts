export type ItemReviewStatus = "awaiting" | "reviewed";

export type FlagKind = "report" | "automated" | "trust" | "policy";

export type ReviewItem = {
  id: string;
  title: string;
  category: string;
  imageSeed: string;
  listedHoursAgo: number;
  status: ItemReviewStatus;
  userType: string;
  userName: string;
  userVerified: boolean;
  userRating?: number;
  flagKind: FlagKind;
  flagTitle: string;
  flagMessage: string;
  condition: string;
  estimatedValue: string;
  location: string;
  selected?: boolean;
  hidden?: boolean;
};

export type ItemFilterTab = "all" | "awaiting" | "reviewed";

export type SortOption = "oldest" | "newest" | "value";
