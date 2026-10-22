import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { customizableProducts } from "@/lib/data";
import { getCatalog } from "./_lib";
import { CatalogSearch } from "./_components/CatalogSearch";

export const metadata: Metadata = {
  title: "Catálogo de productos | G Packing",
  description:
    "Catálogo de G Packing: packaging, descartables, limpieza y papelería. Cada producto con su medida y código.",
  openGraph: {
    title: "Catálogo de productos | G Packing",
    description: "Packaging, descartables, limpieza y papelería. Medidas y códigos de cada producto.",
    type: "website",
    locale: "es_UY",
  },
};

export default function CatalogoDigitalPage() {
  const catalog = getCatalog();
  const families = catalog.flatMap((s) => s.families);
  const total = catalog.reduce((n, s) => n + s.count, 0);

  return (
    <div className="mx-auto max-w-[1080px] px-4 pb-14 pt-8 md:pt-12">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#868a84]">
        Packaging y limpieza
      </p>
      <h1 className="mt-2 font-display text-3xl font-bold leading-tight tracking-tight md:text-4xl">
        Catálogo de productos
      </h1>
      <p className="mb-6 mt-2 max-w-[60ch] text-[#4b4f52]">
        {total} productos en {catalog.length} categorías. Cada producto tiene su código: usalo para
        consultar o hacer tu pedido.
      </p>

      <CatalogSearch families={families}>
        <h2 className="border-b-2 border-[#17191b] pb-2 text-[10.5px] font-semibold uppercase tracking-[0.1em] text-[#868a84]">
          Categorías
        </h2>
        <ul className="grid sm:grid-cols-2 sm:gap-x-10">
          {catalog.map((s) => (
            <li key={s.slug}>
              <Link
                href={`/catalogo-digital/${s.slug}`}
                className="group flex items-center gap-3 border-b border-[#e6e6e1] py-3.5"
              >
                <span className="w-11 shrink-0 font-mono text-[13px] font-semibold text-[#0d3d22]">
                  {s.prefix}
                </span>
                <span className="min-w-0 flex-1 font-semibold group-hover:text-[#0d3d22]">{s.name}</span>
                <span className="tabular text-sm text-[#868a84]">{s.count}</span>
                <ChevronRight size={16} className="text-[#b3b8b1] group-hover:text-[#0d3d22]" />
              </Link>
            </li>
          ))}
        </ul>

        <section className="mt-14">
          <h2 className="font-display text-xl font-bold md:text-2xl">Packaging personalizado</h2>
          <p className="mb-4 mt-1 max-w-[60ch] text-[#4b4f52]">
            Imprimimos tu marca en bolsas, vasos, cajas, papel antigrasa y etiquetas. Consultanos por
            cantidades y diseño.
          </p>
          <div className="hidden grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)_minmax(0,1fr)] border-b border-t-2 border-b-[#e6e6e1] border-t-[#17191b] py-2 text-[10.5px] font-semibold uppercase tracking-[0.1em] text-[#868a84] md:grid">
            <span>Producto</span>
            <span>Impresión</span>
            <span>Mínimo</span>
          </div>
          <ul className="border-t-2 border-[#17191b] md:border-t-0">
            {customizableProducts.map((c) => (
              <li
                key={c.id}
                className="grid gap-1 border-b border-[#e6e6e1] py-3 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)_minmax(0,1fr)] md:gap-0"
              >
                <div>
                  <h3 className="font-semibold">{c.name}</h3>
                  <p className="text-[13px] text-[#868a84]">{c.description}</p>
                </div>
                <span className="text-sm text-[#4b4f52]">
                  <span className="md:hidden">Impresión: </span>
                  {c.printColors}
                </span>
                <span className="text-sm text-[#4b4f52]">
                  <span className="md:hidden">Mínimo: </span>
                  {c.minQty}
                </span>
              </li>
            ))}
          </ul>
        </section>
      </CatalogSearch>
    </div>
  );
}
