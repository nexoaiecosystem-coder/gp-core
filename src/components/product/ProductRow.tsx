"use client";

import { useState } from "react";
import Link from "next/link";
import { Minus, Plus, Heart } from "lucide-react";
import { Product } from "@/lib/types";
import { formatUYU } from "@/lib/utils";
import { PRICE_NOTE_SHORT } from "@/lib/constants";
import { useCart } from "@/context/CartContext";
import { usePriceOverrides } from "@/context/PriceOverridesContext";
import { Badge } from "@/components/ui/Badge";
import { ProductThumb } from "./ProductThumb";

export function ProductRow({ product }: { product: Product }) {
  const { addItem } = useCart();
  const { getEffectivePrice } = usePriceOverrides();
  const price = getEffectivePrice(product);
  const [qty, setQty] = useState(product.minQty);

  return (
    <div className="flex flex-col gap-4 border-b border-line py-5 last:border-b-0 sm:flex-row sm:items-center">
      <Link
        href={`/producto/${product.slug}`}
        className="h-24 w-24 shrink-0 overflow-hidden rounded-xl"
      >
        <ProductThumb name={product.name} categorySlug={product.categorySlug} className="h-full w-full" />
      </Link>

      <div className="flex-1">
        <Link href={`/producto/${product.slug}`}>
          <h3 className="font-medium text-ink hover:text-brand">{product.name}</h3>
        </Link>
        <p className="mt-0.5 text-sm text-ink-soft">{product.unit}</p>
        {(product.material || (product.features && product.features.length > 0)) && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {product.material && <Badge>{product.material}</Badge>}
            {product.features?.map((f) => (
              <Badge key={f} className="bg-accent-soft text-accent">
                {f}
              </Badge>
            ))}
          </div>
        )}
        <p className="mt-2 text-xs text-muted">
          SKU: {product.sku}
          {product.minQty > 1 && <> · Mínimo {product.minQty} un.</>}
        </p>
      </div>

      <div className="flex items-center justify-between gap-6 sm:flex-col sm:items-end sm:justify-center sm:gap-2">
        <div className="text-right">
          <p className="tabular text-lg font-bold text-ink">{formatUYU(price)}</p>
          <p className="text-xs text-muted">
            Precio por {product.unit.toLowerCase().startsWith("pack") || product.unit.toLowerCase().startsWith("caja") ? "pack" : "unidad"} · {PRICE_NOTE_SHORT}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 rounded-lg border border-line">
            <button
              onClick={() => setQty((q) => Math.max(product.minQty, q - product.minQty))}
              className="flex h-9 w-8 items-center justify-center text-ink-soft hover:text-brand"
              aria-label="Restar cantidad"
            >
              <Minus size={13} />
            </button>
            <span className="tabular w-6 text-center text-sm">{qty}</span>
            <button
              onClick={() => setQty((q) => q + product.minQty)}
              className="flex h-9 w-8 items-center justify-center text-ink-soft hover:text-brand"
              aria-label="Sumar cantidad"
            >
              <Plus size={13} />
            </button>
          </div>
          <button
            onClick={() => addItem(product.id, qty, product.name)}
            disabled={!product.inStock}
            className="gradient-brand h-9 rounded-lg px-4 text-sm font-medium text-white shadow-sm shadow-brand/25 transition-transform hover:-translate-y-0.5 disabled:translate-y-0 disabled:opacity-40 disabled:shadow-none"
          >
            {product.inStock ? "Agregar al carrito" : "Sin stock"}
          </button>
          <button
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-line text-muted hover:border-danger hover:text-danger"
            aria-label={`Guardar ${product.name}`}
          >
            <Heart size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
