import type { Order } from "@/features/orders/types";
import { useI18n } from "@/i18n";
import { formatCurrency, formatDate } from "@/utils/format";

type OrderListProps = {
  orders: Order[];
};

export function OrderList({ orders }: OrderListProps) {
  const { t } = useI18n();

  return (
    <table className="data-table">
      <thead>
        <tr>
          <th>{t("orders.col.id")}</th>
          <th>{t("orders.col.customer")}</th>
          <th>{t("orders.col.total")}</th>
          <th>{t("orders.col.status")}</th>
          <th>{t("orders.col.created")}</th>
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
