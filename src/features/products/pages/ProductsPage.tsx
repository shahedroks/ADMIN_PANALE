import { useEffect, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { ProductList } from "@/features/products/components/ProductList";
import { fetchProducts } from "@/features/products/services/productsService";
import type { Product } from "@/features/products/types";
import { useI18n } from "@/i18n";

export function ProductsPage() {
  const { t } = useI18n();
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
      <PageHeader title={t("products.title")} description={t("products.desc")} />
      {loading ? <p>{t("products.loading")}</p> : <ProductList products={products} />}
    </section>
  );
}
