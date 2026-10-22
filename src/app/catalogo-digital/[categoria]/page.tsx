import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cn } from "@/lib/utils";
import { getCatalog } from "../_lib";
import { FamilyList } from "../_components/FamilyList";

export function generateStaticParams() {
  return getCatalog().map((s) => ({ categoria: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ categoria: string }>;
}): Promise<Metadata> {
  const { categoria } = await params;
  const section = getCatalog().find((s) => s.slug === categoria);
  if (!section) return { title: "Categoría no encontrada | G Packing" };
  return {
    title: `${section.name} | Catálogo G Packing`,
    description: `${section.name}: ${section.count} productos con medida y código.`,
    openGraph: { title: `${section.name} | Catálogo G Packing` },
  };
}

export default async function CategoriaPage({
  params,
}: {
  params: Promise<{ categoria: string }>;
}) {
  const { categoria } = await params;
  const catalog = getCatalog();
  const index = catalog.findIndex((s) => s.slug === categoria);
  if (index === -1) notFound();

  const section = catalog[index];
  const prev = catalog[index - 1];
  const next = catalog[index + 1];

  return (
    <>
      {/* Pestañas de categorías */}
      <nav aria-label="Categorías" className="sticky top-[60px] z-10 border-b border-[#e6e6e1] bg-white">
        <div className="mx-auto flex max-w-[1080px] gap-6 overflow-x-auto px-4 [scrollbar-width:none]">
          {catalog.map((s) => (
            <Link
              key={s.slug}
              href={`/catalogo-digital/${s.slug}`}
              aria-current={s.slug === section.slug ? "page" : undefined}
              className={cn(
                "shrink-0 border-b-2 py-2.5 text-sm",
                s.slug === section.slug
                  ? "border-[#0d3d22] font-semibold text-[#0d3d22]"
                  : "border-transparent text-[#4b4f52] hover:text-[#17191b]"
              )}
            >
              {s.name}
            </Link>
          ))}
        </div>
      </nav>

      <div className="mx-auto max-w-[1080px] px-4">
        <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2 pb-4 pt-7">
          <div>
            <p className="text-[12.5px] text-[#868a84]">
              <Link href="/catalogo-digital" className="hover:text-[#0d3d22]">
                Catálogo
              </Link>{" "}
              / {section.name}
            </p>
            <h1 className="mt-1 font-display text-[28px] font-bold leading-tight tracking-tight md:text-[34px]">
              {section.name}
            </h1>
          </div>
          <p className="tabular text-[13px] text-[#868a84]">
            {section.families.length} productos · {section.count} artículos · códigos {section.prefix}
          </p>
        </div>

        <FamilyList families={section.families} />

        <nav aria-label="Otras categorías" className="flex justify-between gap-4 pb-12 pt-7 text-sm">
          {prev ? (
            <Link href={`/catalogo-digital/${prev.slug}`} className="font-semibold hover:text-[#0d3d22]">
              <small className="block text-xs font-normal text-[#868a84]">‹ Anterior</small>
              {prev.name}
            </Link>
          ) : (
            <span />
          )}
          {next && (
            <Link
              href={`/catalogo-digital/${next.slug}`}
              className="text-right font-semibold hover:text-[#0d3d22]"
            >
              <small className="block text-xs font-normal text-[#868a84]">Siguiente ›</small>
              {next.name}
            </Link>
          )}
        </nav>
      </div>
    </>
  );
}
