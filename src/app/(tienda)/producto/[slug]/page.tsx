import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { getProductBySlug, getRelatedProducts, categories, products } from "@/lib/data";
import { ProductGallery } from "@/components/product/ProductGallery";
import { AddToCartPanel } from "@/components/product/AddToCartPanel";
import { ProductCard } from "@/components/product/ProductCard";
import { Badge } from "@/components/ui/Badge";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return { title: "Producto no encontrado | G Packing" };
  return {
    title: `${product.name} — ${product.unit} | G Packing`,
    description: product.description,
    openGraph: {
      title: `${product.name} | G Packing`,
      description: product.description,
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const category = categories.find((c) => c.slug === product.categorySlug);
  const related = getRelatedProducts(product);

  return (
    <div className="mx-auto max-w-[1800px] px-6 py-8">
      <nav className="mb-6 flex flex-wrap items-center gap-1.5 text-sm text-muted">
        <Link href="/" className="hover:text-brand">Inicio</Link>
        <ChevronRight size={14} />
        <Link href={`/catalogo?categoria=${category?.slug}`} className="hover:text-brand">
          {category?.name}
        </Link>
        <ChevronRight size={14} />
        <span className="text-ink line-clamp-1">{product.name}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2">
        <ProductGallery name={product.name} categorySlug={product.categorySlug} />

        <div>
          <div className="mb-2 flex flex-wrap gap-2">
            {product.tags.map((t) => (
              <Badge key={t}>{t}</Badge>
            ))}
          </div>
          <h1 className="font-display text-2xl font-bold text-ink md:text-3xl">{product.name}</h1>
          <p className="mt-3 text-sm leading-relaxed text-ink-soft">{product.description}</p>

          <div className="mt-6">
            <AddToCartPanel product={product} />
          </div>

          <div className="mt-8">
            <p className="mb-3 text-sm font-semibold text-ink">Especificaciones</p>
            <dl className="divide-y divide-line rounded-2xl border border-line">
              {product.specs.map((spec) => (
                <div key={spec.label} className="flex justify-between px-4 py-3 text-sm">
                  <dt className="text-ink-soft">{spec.label}</dt>
                  <dd className="font-medium text-ink">{spec.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <div className="mt-16">
          <h2 className="mb-5 font-display text-xl font-bold text-ink">Productos relacionados</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
