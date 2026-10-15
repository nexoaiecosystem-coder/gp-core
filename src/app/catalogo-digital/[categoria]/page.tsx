import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { getCatalog } from "../_lib";
import { ProductGrid } from "../_components/ProductTile";

export function generateStaticParams() {
  return getCatalog().map((c) => ({ categoria: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ categoria: string }>;
}): Promise<Metadata> {
  const { categoria } = await params;
  const category = getCatalog().find((c) => c.slug === categoria);
  if (!category) return { title: "Categoría no encontrada | G Packing" };
  return {
    title: `${category.name} | Catálogo G Packing`,
    description: `${category.description}. ${category.items.length} productos con medidas y códigos.`,
    openGraph: {
      title: `${category.name} | Catálogo G Packing`,
      description: category.description,
    },
  };
}

export default async function CategoriaPage({
  params,
}: {
  params: Promise<{ categoria: string }>;
}) {
  const { categoria } = await params;
  const catalog = getCatalog();
  const index = catalog.findIndex((c) => c.slug === categoria);
  if (index === -1) notFound();

  const category = catalog[index];
  const prev = catalog[index - 1];
  const next = catalog[index + 1];

  return (
    <>
      {/* Categorías: barra deslizable para saltar entre páginas */}
      <nav className="sticky top-14 z-10 border-b border-line bg-paper/90 backdrop-blur print:hidden">
        <div className="mx-auto flex max-w-6xl gap-2 overflow-x-auto px-4 py-3 [scrollbar-width:none]">
          {catalog.map((c) => (
            <Link
              key={c.slug}
              href={`/catalogo-digital/${c.slug}`}
              aria-current={c.slug === category.slug ? "page" : undefined}
              className={cn(
                "shrink-0 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
                c.slug === category.slug
                  ? "border-transparent bg-[#0d3d22] text-white"
                  : "border-line bg-surface text-ink-soft hover:border-brand hover:text-brand"
              )}
            >
              {c.name}
            </Link>
          ))}
        </div>
      </nav>

      <div className="mx-auto max-w-6xl px-4 py-6 md:py-8">
        <ol className="flex items-center gap-1 text-xs text-muted print:hidden">
          <li>
            <Link href="/catalogo-digital" className="hover:text-brand">
              Catálogo
            </Link>
          </li>
          <ChevronRight size={12} />
          <li className="text-ink-soft">{category.name}</li>
        </ol>

        <div className="mb-5 mt-3 border-b border-line pb-4">
          <h1 className="font-display text-2xl font-bold text-ink md:text-3xl">{category.name}</h1>
          <p className="mt-1 text-sm text-muted">
            {category.description} · {category.items.length} productos
          </p>
        </div>

        <ProductGrid items={category.items} />

        <div className="mt-10 grid grid-cols-2 gap-3 print:hidden">
          {prev ? (
            <Link
              href={`/catalogo-digital/${prev.slug}`}
              className="flex items-center gap-2 rounded-xl border border-line bg-surface p-3 text-sm hover:border-brand"
            >
              <ArrowLeft size={16} className="shrink-0 text-muted" />
              <span className="min-w-0">
                <span className="block text-xs text-muted">Anterior</span>
                <span className="block truncate font-semibold text-ink">{prev.name}</span>
              </span>
            </Link>
          ) : (
            <span />
          )}
          {next && (
            <Link
              href={`/catalogo-digital/${next.slug}`}
              className="flex items-center justify-end gap-2 rounded-xl border border-line bg-surface p-3 text-right text-sm hover:border-brand"
            >
              <span className="min-w-0">
                <span className="block text-xs text-muted">Siguiente</span>
                <span className="block truncate font-semibold text-ink">{next.name}</span>
              </span>
              <ArrowRight size={16} className="shrink-0 text-muted" />
            </Link>
          )}
        </div>
      </div>
    </>
  );
}
