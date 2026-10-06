import { useEffect, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { ProductList } from "@/features/products/components/ProductList";
import { fetchProducts } from "@/features/products/services/productsService";
import type { Product } from "@/features/products/types";

export function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetchProducts().then((data) => {
      if (!cancelled) {
        setProducts(data);
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section>
      <PageHeader title="Products" description="Catalog and inventory." />
      {loading ? <p>Loading…</p> : <ProductList products={products} />}
    </section>
  );
}
