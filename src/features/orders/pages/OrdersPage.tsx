import { useEffect, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { OrderList } from "@/features/orders/components/OrderList";
import { fetchOrders } from "@/features/orders/services/ordersService";
import type { Order } from "@/features/orders/types";

export function OrdersPage() {
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
      <PageHeader title="Orders" description="Track customer orders." />
      {loading ? <p>Loading…</p> : <OrderList orders={orders} />}
    </section>
  );
}
