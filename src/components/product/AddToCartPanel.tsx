"use client";

import { useState } from "react";
import { Minus, Plus, ShoppingCart } from "lucide-react";
import { Product } from "@/lib/types";
import { formatUYU } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import { usePriceOverrides } from "@/context/PriceOverridesContext";
import { Button } from "@/components/ui/Button";
import { PRICE_NOTE } from "@/lib/constants";

export function AddToCartPanel({ product }: { product: Product }) {
  const { addItem } = useCart();
  const { getEffectivePrice } = usePriceOverrides();
  const price = getEffectivePrice(product);
  const [qty, setQty] = useState(product.minQty);
  const [added, setAdded] = useState(false);

  function handleAdd() {
    addItem(product.id, qty, product.name);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  }

  return (
    <div className="rounded-2xl border border-line bg-surface p-5">
      <p className="tabular text-3xl font-bold text-brand-strong">{formatUYU(price)}</p>
      <p className="mt-1 text-sm text-muted">por {product.unit} · {PRICE_NOTE}</p>

      <div className="mt-5 flex items-center gap-3">
        <span className="text-sm font-medium text-ink-soft">Cantidad</span>
        <div className="flex items-center gap-1 rounded-full border border-line">
          <button
            onClick={() => setQty((q) => Math.max(product.minQty, q - product.minQty))}
            className="flex h-10 w-10 items-center justify-center text-ink-soft hover:text-brand"
            aria-label="Restar cantidad"
          >
            <Minus size={15} />
          </button>
          <span className="tabular w-12 text-center text-sm font-medium">{qty}</span>
          <button
            onClick={() => setQty((q) => q + product.minQty)}
            className="flex h-10 w-10 items-center justify-center text-ink-soft hover:text-brand"
            aria-label="Sumar cantidad"
          >
            <Plus size={15} />
          </button>
        </div>
      </div>
      {product.minQty > 1 && (
        <p className="mt-1.5 text-xs text-muted">Venta mínima: {product.minQty} unidades</p>
      )}

      <Button
        onClick={handleAdd}
        disabled={!product.inStock}
        className="mt-5 w-full"
        size="lg"
      >
        <ShoppingCart size={17} />
        {added ? "¡Agregado!" : product.inStock ? "Agregar al pedido" : "Sin stock"}
      </Button>
    </div>
  );
}
