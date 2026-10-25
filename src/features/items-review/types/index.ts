export type ItemReviewStatus = "awaiting" | "reviewed";

export type FlagKind = "report" | "automated" | "trust" | "policy";

export type ListingModerationStatus =
  | "pending"
  | "approved"
  | "hidden"
  | "rejected"
  | string;

export type ReviewItem = {
  id: string;
  ownerId?: string;
  title: string;
  category: string;
  imageSeed: string;
  /** First listing photo from Firestore when available. */
  thumbnailUrl?: string;
  /** Raw Firestore `status` (source of truth for Discover visibility). */
  listingStatus: ListingModerationStatus;
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
