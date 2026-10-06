export type OrderStatus = "pending" | "shipped" | "delivered" | "cancelled";

export type Order = {
  id: string;
  customerName: string;
  total: number;
  status: OrderStatus;
  createdAt: string;
};
