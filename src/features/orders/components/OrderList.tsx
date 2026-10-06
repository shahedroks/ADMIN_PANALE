import type { Order } from "@/features/orders/types";
import { formatCurrency, formatDate } from "@/utils/format";

type OrderListProps = {
  orders: Order[];
};

export function OrderList({ orders }: OrderListProps) {
  return (
    <table className="data-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Customer</th>
          <th>Total</th>
          <th>Status</th>
          <th>Created</th>
        </tr>
      </thead>
      <tbody>
        {orders.map((order) => (
          <tr key={order.id}>
            <td>{order.id}</td>
            <td>{order.customerName}</td>
            <td>{formatCurrency(order.total)}</td>
            <td>{order.status}</td>
            <td>{formatDate(order.createdAt)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
