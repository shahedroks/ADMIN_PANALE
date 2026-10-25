import { doc, serverTimestamp, setDoc, writeBatch } from "firebase/firestore";

import { auth, db } from "@/lib/firebase";

const categories = [
  { id: "electronics", name: "Electronics", slug: "electronics", sortOrder: 1 },
  { id: "home", name: "Home", slug: "home", sortOrder: 2 },
  { id: "books", name: "Books", slug: "books", sortOrder: 3 },
  { id: "clothes", name: "Clothes", slug: "clothes", sortOrder: 4 },
  { id: "sports", name: "Sports", slug: "sports", sortOrder: 5 },
  { id: "music", name: "Music", slug: "music", sortOrder: 6 },
  { id: "art", name: "Art", slug: "art", sortOrder: 7 },
  { id: "toys", name: "Toys", slug: "toys", sortOrder: 8 },
  { id: "garden", name: "Garden", slug: "garden", sortOrder: 9 },
  { id: "tools", name: "Tools", slug: "tools", sortOrder: 10 },
];

const demoItems = [
  {
    id: "demo-keyboard",
    title: "Mechanical Keyboard",
    description: "RGB mechanical keyboard, lightly used.",
    wants: "Turntable or studio headphones",
    categoryId: "electronics",
    categoryName: "Electronics",
    condition: "Like new",
    location: "Dhaka",
    imageUrls: [
      "https://images.unsplash.com/photo-1587829745530-0ce173b4c7ff?w=800&h=800&fit=crop",
    ],
    status: "approved",
    estimatedValue: "৳8,500",
  },
  {
    id: "demo-plant",
    title: "Monstera Plant",
    description: "Healthy indoor plant with ceramic pot.",
    wants: "Home decor or books",
    categoryId: "garden",
    categoryName: "Garden",
    condition: "Good",
    location: "Nearby",
    imageUrls: [
      "https://images.unsplash.com/photo-1614598805887-660977271048?w=800&h=800&fit=crop",
    ],
    status: "approved",
    estimatedValue: "৳2,200",
  },
  {
    id: "demo-books",
    title: "Design Book Bundle",
    description: "Three UX and product design books.",
    wants: "Electronics accessories",
    categoryId: "books",
    categoryName: "Books",
    condition: "Good",
    location: "Gulshan",
    imageUrls: [
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&h=800&fit=crop",
    ],
    status: "approved",
  },
  {
    id: "demo-lamp",
    title: "Desk Lamp",
    description: "Warm LED desk lamp with dimmer.",
    wants: "Kitchen items",
    categoryId: "home",
    categoryName: "Home",
    condition: "Like new",
    location: "Banani",
    imageUrls: [
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&h=800&fit=crop",
    ],
    status: "approved",
  },
  {
    id: "demo-pending-camera",
    title: "Mirrorless Camera Body",
    description: "Includes battery and charger. Light cosmetic wear.",
    wants: "Lens or drone",
    categoryId: "electronics",
    categoryName: "Electronics",
    condition: "Good",
    location: "Dhaka",
    imageUrls: [
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&h=800&fit=crop",
    ],
    status: "pending",
    estimatedValue: "৳45,000",
  },
  {
    id: "demo-pending-chair",
    title: "Ergonomic Office Chair",
    description: "Adjustable lumbar support, wheels recently replaced.",
    wants: "Standing desk",
    categoryId: "home",
    categoryName: "Home",
    condition: "Good",
    location: "Banani",
    imageUrls: [
      "https://images.unsplash.com/photo-1580480051063-82288b6a5c39?w=800&h=800&fit=crop",
    ],
    status: "pending",
  },
];

export async function seedCategoriesFirestore(): Promise<number> {
  const batch = writeBatch(db);
  for (const cat of categories) {
    batch.set(
      doc(db, "categories", cat.id),
      {
        name: cat.name,
        slug: cat.slug,
        sortOrder: cat.sortOrder,
        active: true,
        updatedAt: serverTimestamp(),
      },
      { merge: true },
    );
  }
  await batch.commit();
  return categories.length;
}

export async function seedDemoListingsFirestore(ownerId?: string): Promise<number> {
  const owner = ownerId ?? auth.currentUser?.uid ?? "demo-owner";
  const batch = writeBatch(db);
  const now = serverTimestamp();
  for (const item of demoItems) {
    batch.set(doc(db, "items", item.id), {
      ownerId: owner,
      ownerName: "Swap Demo",
      title: item.title,
      description: item.description,
      wants: item.wants,
      categoryId: item.categoryId,
      categoryName: item.categoryName,
      condition: item.condition,
      location: item.location,
      imageUrls: item.imageUrls,
      status: item.status,
      ...(item.status === "approved"
        ? { flagKind: null, flagTitle: null, flagMessage: null, moderationNote: null }
        : {}),
      ...(item.estimatedValue ? { estimatedValue: item.estimatedValue } : {}),
      createdAt: now,
      updatedAt: now,
    });
  }
  await batch.commit();
  return demoItems.length;
}

export async function seedAppSettingsFirestore(): Promise<void> {
  await setDoc(
    doc(db, "settings", "app"),
    {
      maintenanceMode: false,
      minAppVersion: "1.0.0",
      legal: {
        communityGuidelinesUrl: "https://swapit.io/community-guidelines",
        termsOfServiceUrl: "https://swapit.io/terms",
        privacyPolicyUrl: "https://swapit.io/privacy",
        supportUrl: "mailto:support@swapit.io",
      },
      support: {
        responseTimeLabel: "Response avg 14 mins",
      },
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );
}

export async function bootstrapSwapItFirestore(): Promise<{
  categories: number;
  items: number;
}> {
  const categoryCount = await seedCategoriesFirestore();
  try {
    await seedAppSettingsFirestore();
  } catch {
    /* settings are optional for demo seed */
  }
  const itemCount = await seedDemoListingsFirestore();
  return { categories: categoryCount, items: itemCount };
}
