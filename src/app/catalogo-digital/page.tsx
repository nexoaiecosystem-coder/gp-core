import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, FileText } from "lucide-react";
import { customizableProducts } from "@/lib/data";
import { ProductThumb } from "@/components/product/ProductThumb";
import { getCatalog } from "./_lib";
import { CatalogSearch } from "./_components/CatalogSearch";
import { whatsappLink } from "./_components/whatsapp";

export const metadata: Metadata = {
  title: "Catálogo de productos | G Packing",
  description:
    "Catálogo de G Packing: packaging, descartables, limpieza e higiene para tu negocio. Medidas y códigos de cada producto, pedidos por WhatsApp.",
  openGraph: {
    title: "Catálogo de productos | G Packing",
    description: "Packaging, descartables, limpieza e higiene. Consultas y pedidos por WhatsApp.",
    type: "website",
    locale: "es_UY",
  },
};

export default function CatalogoDigitalPage() {
  const catalog = getCatalog();
  const allItems = catalog.flatMap((c) => c.items);

  return (
    <>
      <section className="gradient-hero text-white print:bg-none print:text-ink">
        <div className="mx-auto max-w-6xl px-4 pb-20 pt-10 md:pb-24 md:pt-14">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/60 print:text-muted">
            Catálogo 2026
          </p>
          <h1 className="mt-3 max-w-2xl font-display text-3xl font-bold leading-tight md:text-5xl">
            Packaging e insumos para tu negocio
          </h1>
          <p className="mt-4 max-w-2xl text-base text-white/75 md:text-lg print:text-ink-soft">
            {allItems.length} productos en {catalog.length} categorías. Elegí una categoría, buscá
            el producto y pedilo por WhatsApp con su código.
          </p>
        </div>
      </section>

      <div className="mx-auto -mt-10 max-w-6xl px-4 pb-12 md:-mt-12">
        <CatalogSearch items={allItems}>
          <h2 className="font-display text-xl font-bold text-ink md:text-2xl">Categorías</h2>
          <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {catalog.map((c) => {
              const cover = c.items.find((i) => i.photo) ?? c.items[0];
              return (
                <li key={c.slug}>
                  <Link
                    href={`/catalogo-digital/${c.slug}`}
                    className="group flex h-full flex-col overflow-hidden rounded-xl border border-line bg-surface shadow-[var(--shadow-card)] transition-shadow hover:shadow-[var(--shadow-card-hover)]"
                  >
                    {cover.photo ? (
                      <div className="flex aspect-[4/3] items-center justify-center bg-white p-3">
                        {/* eslint-disable-next-line @next/next/no-img-element -- export estático sin optimizador de imágenes */}
                        <img src={cover.photo} alt="" className="h-full w-full object-contain" />
                      </div>
                    ) : (
                      <ProductThumb
                        name={cover.name}
                        categorySlug={c.slug}
                        className="aspect-[4/3]"
                        iconClassName="h-1/4 w-1/4"
                      />
                    )}
                    <div className="flex flex-1 items-center gap-2 border-t border-line p-3">
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold leading-snug text-ink">{c.name}</h3>
                        <p className="mt-0.5 text-xs text-muted">{c.items.length} productos</p>
                      </div>
                      <ArrowRight
                        size={16}
                        className="shrink-0 text-muted transition-transform group-hover:translate-x-0.5 group-hover:text-brand"
                      />
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>

          <section className="mt-12 rounded-2xl border border-line gradient-cta p-5 md:p-8 print:break-before-page">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">Con tu marca</p>
            <h2 className="mt-1 font-display text-xl font-bold text-ink md:text-2xl">
              Packaging personalizado
            </h2>
            <p className="mt-1 max-w-xl text-sm text-ink-soft">
              Imprimimos tu logo en bolsas, vasos, cajas y más. Pedinos cotización según cantidad y
              diseño.
            </p>
            <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {customizableProducts.map((c) => (
                <li
                  key={c.id}
                  className="flex flex-col rounded-xl border border-line bg-surface p-4 break-inside-avoid"
                >
                  <h3 className="font-semibold text-ink">{c.name}</h3>
                  <p className="mt-1 text-sm text-ink-soft">{c.description}</p>
                  <dl className="mt-3 space-y-1 text-xs text-ink-soft">
                    <div className="flex gap-1">
                      <dt className="font-semibold text-ink">Impresión:</dt>
                      <dd>{c.printColors}</dd>
                    </div>
                    <div className="flex gap-1">
                      <dt className="font-semibold text-ink">Mínimo:</dt>
                      <dd>{c.minQty}</dd>
                    </div>
                  </dl>
                  <a
                    href={whatsappLink(
                      `Hola G Packing! Quiero cotizar ${c.name.toLowerCase()} personalizados con mi marca.`
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 flex items-center justify-center gap-2 rounded-lg gradient-brand px-3 py-2 text-sm font-semibold text-white hover:brightness-110 print:hidden"
                  >
                    <FileText size={15} /> Pedir cotización
                  </a>
                </li>
              ))}
            </ul>
          </section>
        </CatalogSearch>
      </div>
    </>
  );
}
