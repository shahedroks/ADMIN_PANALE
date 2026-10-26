import { useEffect, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { OrderList } from "@/features/orders/components/OrderList";
import { fetchOrders } from "@/features/orders/services/ordersService";
import type { Order } from "@/features/orders/types";
import { useI18n } from "@/i18n";

export function OrdersPage() {
  const { t } = useI18n();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetchOrders().then((data) => {
      if (!cancelled) {
        setOrders(data);
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section>
      <PageHeader title={t("orders.title")} description={t("orders.desc")} />
      {loading ? <p>{t("orders.loading")}</p> : <OrderList orders={orders} />}
    </section>
  );
}
