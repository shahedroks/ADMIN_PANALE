import type { Order } from "@/features/orders/types";

const MOCK_ORDERS: Order[] = [
  {
    id: "ord-1001",
    customerName: "Jane Doe",
    total: 129.99,
    status: "pending",
    createdAt: "2026-10-01T10:00:00Z",
  },
  {
    id: "ord-1002",
    customerName: "John Smith",
    total: 54.5,
    status: "shipped",
    createdAt: "2026-10-03T14:30:00Z",
  },
];

export async function fetchOrders(): Promise<Order[]> {
  await delay(300);
  return [...MOCK_ORDERS];
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
