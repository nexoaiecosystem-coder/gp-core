import Link from "next/link";
import { categories } from "@/lib/data";
import { ProductThumb } from "@/components/product/ProductThumb";

export function CategoryGrid() {
  const homeCategories = categories.filter((c) => c.showOnHome);

  return (
    <section className="mx-auto max-w-[1800px] px-6 py-10">
      <div className="mb-6 flex items-end justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold text-ink">Categorías</h2>
          <p className="mt-1 text-sm text-ink-soft">Encontrá lo que necesitás por rubro de producto</p>
        </div>
        <Link href="/catalogo" className="hidden text-sm font-medium text-brand hover:underline sm:block">
          Ver todas las categorías
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 2xl:grid-cols-6">
        {homeCategories.map((c) => (
          <Link
            key={c.slug}
            href={c.slug === "packaging-personalizado" ? "/personalizado" : `/catalogo?categoria=${c.slug}`}
            className="group card-elevated overflow-hidden rounded-2xl border border-line gradient-surface"
          >
            <div className="aspect-[4/3] overflow-hidden">
              <ProductThumb
                name={c.name}
                categorySlug={c.slug}
                className="h-full w-full transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div className="p-3.5">
              <p className="text-sm font-semibold text-ink">{c.name}</p>
              {c.productCount > 0 && (
                <p className="mt-0.5 text-xs text-muted">{c.productCount} productos</p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
