import type { Product } from "@/features/products/types";

const MOCK_PRODUCTS: Product[] = [
  { id: "p1", name: "Widget A", sku: "WGT-A", price: 19.99, stock: 120 },
  { id: "p2", name: "Widget B", sku: "WGT-B", price: 29.99, stock: 45 },
];

export async function fetchProducts(): Promise<Product[]> {
  await delay(300);
  return [...MOCK_PRODUCTS];
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
