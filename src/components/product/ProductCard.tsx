"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { Product } from "@/lib/types";
import { formatUYU, cn } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import { usePriceOverrides } from "@/context/PriceOverridesContext";
import { ProductThumb } from "./ProductThumb";

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const { getEffectivePrice } = usePriceOverrides();
  const price = getEffectivePrice(product);

  return (
    <div className="group card-elevated relative flex flex-col rounded-2xl border border-line gradient-surface p-3">
      <Link
        href={`/producto/${product.slug}`}
        className="relative mb-3 block aspect-square overflow-hidden rounded-xl bg-paper"
      >
        <ProductThumb
          name={product.name}
          categorySlug={product.categorySlug}
          className="absolute inset-0 transition-transform duration-300 group-hover:scale-105"
        />
        {!product.inStock && (
          <span className="absolute left-2 top-2 rounded-full bg-surface/95 px-2.5 py-1 text-[11px] font-medium text-ink-soft">
            Sin stock
          </span>
        )}
      </Link>

      <Link href={`/producto/${product.slug}`} className="flex-1">
        <h3 className="line-clamp-2 text-sm font-medium text-ink">
          {product.name}
        </h3>
      </Link>

      <div className="mt-2 flex items-end justify-between">
        <div>
          <p className="tabular text-base font-semibold text-brand-strong">
            {formatUYU(price)}
          </p>
          <p className="text-xs text-muted">por {product.unit}</p>
        </div>
        <button
          onClick={() => addItem(product.id, product.minQty, product.name)}
          disabled={!product.inStock}
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-full gradient-brand text-white shadow-md shadow-brand/25 transition-transform",
            "hover:-translate-y-0.5 hover:shadow-lg hover:shadow-brand/30 active:scale-95 disabled:opacity-40 disabled:pointer-events-none disabled:shadow-none"
          )}
          aria-label={`Agregar ${product.name} al pedido`}
          title="Agregar al pedido"
        >
          <Plus size={18} strokeWidth={2.5} />
        </button>
      </div>
      {product.minQty > 1 && (
        <p className="mt-1 text-[11px] text-muted">Mínimo {product.minQty} un.</p>
      )}
    </div>
  );
}
