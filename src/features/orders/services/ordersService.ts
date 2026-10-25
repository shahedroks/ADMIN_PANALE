import type { Order } from "@/features/orders/types";

/** SWAP IT uses swap offers, not e-commerce orders — no Firestore orders collection yet. */
export async function fetchOrders(): Promise<Order[]> {
  return [];
}
