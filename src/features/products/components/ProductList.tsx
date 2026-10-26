import type { Product } from "@/features/products/types";
import { useI18n } from "@/i18n";
import { formatCurrency } from "@/utils/format";

type ProductListProps = {
  products: Product[];
};

export function ProductList({ products }: ProductListProps) {
  const { t } = useI18n();

  return (
    <table className="data-table">
      <thead>
        <tr>
          <th>{t("products.col.name")}</th>
          <th>{t("products.col.sku")}</th>
          <th>{t("products.col.price")}</th>
          <th>{t("products.col.stock")}</th>
        </tr>
      </thead>
      <tbody>
        {products.map((product) => (
          <tr key={product.id}>
            <td>{product.name}</td>
            <td>{product.sku}</td>
            <td>{formatCurrency(product.price)}</td>
            <td>{product.stock}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
