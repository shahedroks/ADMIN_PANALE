/** Same demo URLs as Flutter `listing_image_url.dart` — keeps admin & app in sync. */
const DEMO_LISTING_IMAGE_URLS: Record<string, string> = {
  "demo-keyboard":
    "https://images.unsplash.com/photo-1587829745530-0ce173b4c7ff?w=800&h=800&fit=crop",
  "demo-plant":
    "https://images.unsplash.com/photo-1614598805887-660977271048?w=800&h=800&fit=crop",
  "demo-books":
    "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&h=800&fit=crop",
  "demo-lamp":
    "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&h=800&fit=crop",
  "demo-pending-camera":
    "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&h=800&fit=crop",
  "demo-pending-chair":
    "https://images.unsplash.com/photo-1580480051063-82288b6a5c39?w=800&h=800&fit=crop",
};

function placeholderForListing(listingId: string, categoryName: string): string {
  const byId = DEMO_LISTING_IMAGE_URLS[listingId];
  if (byId) return byId;

  const cat = categoryName.toLowerCase();
  if (cat.includes("electronic") || cat.includes("music")) {
    return "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800&h=800&fit=crop";
  }
  if (cat.includes("garden") || cat.includes("plant") || cat.includes("home")) {
    return "https://images.unsplash.com/photo-1614598805887-660977271048?w=800&h=800&fit=crop";
  }
  if (cat.includes("book")) {
    return "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&h=800&fit=crop";
  }
  if (cat.includes("cloth") || cat.includes("fashion")) {
    return "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800&h=800&fit=crop";
  }
  if (cat.includes("sport")) {
    return "https://images.unsplash.com/photo-1461896836934-ffe607ad81d5?w=800&h=800&fit=crop";
  }
  const seed = encodeURIComponent(listingId || "swap-it");
  return `https://picsum.photos/seed/${seed}/480/360`;
}

export function resolveListingImageUrl(
  listingId: string,
  categoryName: string,
  imageUrls?: string[],
): string {
  const first = imageUrls?.map((u) => u.trim()).find(Boolean);
  if (first) return first;
  return placeholderForListing(listingId, categoryName);
}
