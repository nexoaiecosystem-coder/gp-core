import Link from "next/link";
import { getFeaturedProducts } from "@/lib/data";
import { ProductCard } from "@/components/product/ProductCard";

export function FeaturedProducts() {
  const featured = getFeaturedProducts();

  return (
    <section className="mx-auto max-w-[1800px] px-6 py-14">
      <div className="mb-6 flex items-end justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold text-ink">Productos destacados</h2>
          <p className="mt-1 text-sm text-ink-soft">Los más pedidos por nuestros clientes</p>
        </div>
        <Link href="/catalogo" className="hidden text-sm font-medium text-brand hover:underline sm:block">
          Ver todo
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6 2xl:grid-cols-8">
        {featured.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}
