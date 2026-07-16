"use client";

import { ProductThumb } from "./ProductThumb";

export function ProductGallery({ name, categorySlug }: { name: string; categorySlug: string }) {
  return (
    <div>
      <div className="aspect-square overflow-hidden rounded-2xl border border-line bg-surface">
        <ProductThumb name={name} categorySlug={categorySlug} className="h-full w-full" iconClassName="h-1/4 w-1/4" />
      </div>
      <p className="mt-3 text-center text-xs text-muted">
        Foto ilustrativa — pendiente de reemplazar por la foto real del producto.
      </p>
    </div>
  );
}
