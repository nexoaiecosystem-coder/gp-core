"use client";

import { useEffect } from "react";
import Link from "next/link";
import { X, Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { usePriceOverrides } from "@/context/PriceOverridesContext";
import { products } from "@/lib/data";
import { formatUYU, cn } from "@/lib/utils";
import { PRICE_NOTE } from "@/lib/constants";
import { ProductThumb } from "@/components/product/ProductThumb";

export function CartDrawer() {
  const { items, isOpen, closeCart, updateQuantity, removeItem, totalAmount, clearCart } =
    useCart();
  const { getEffectivePrice } = usePriceOverrides();

  // Close on Escape while the drawer is open
  useEffect(() => {
    if (!isOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") closeCart();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, closeCart]);

  const lines = items
    .map((item) => {
      const product = products.find((p) => p.id === item.productId);
      return product ? { item, product } : null;
    })
    .filter(Boolean) as { item: typeof items[number]; product: (typeof products)[number] }[];

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/50 transition-opacity",
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={closeCart}
      />

      {/* Drawer */}
      <aside
        className={cn(
          "fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-surface shadow-2xl transition-transform duration-300",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
        role="dialog"
        aria-modal="true"
        aria-label="Tu pedido"
        aria-hidden={!isOpen}
      >
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <h2 className="text-lg font-semibold text-ink">Tu pedido</h2>
          <button onClick={closeCart} className="rounded-full p-2 hover:bg-paper" aria-label="Cerrar carrito">
            <X size={20} />
          </button>
        </div>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
            <p className="text-ink-soft">Todavía no agregaste productos.</p>
            <Link
              href="/catalogo"
              onClick={closeCart}
              className="inline-flex h-11 items-center justify-center rounded-full border border-line px-5 text-sm font-medium text-ink hover:border-brand hover:text-brand"
            >
              Ver catálogo
            </Link>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-5 py-4">
              <ul className="space-y-4">
                {lines.map(({ item, product }) => (
                  <li key={product.id} className="flex gap-3">
                    <Link
                      href={`/producto/${product.slug}`}
                      onClick={closeCart}
                      className="h-16 w-16 shrink-0 overflow-hidden rounded-lg"
                    >
                      <ProductThumb name={product.name} categorySlug={product.categorySlug} className="h-full w-full" />
                    </Link>
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-medium text-ink line-clamp-2">{product.name}</p>
                        <button
                          onClick={() => removeItem(product.id)}
                          className="shrink-0 text-muted hover:text-danger"
                          aria-label={`Quitar ${product.name}`}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <div className="mt-1.5 flex items-center justify-between">
                        <div className="flex items-center gap-1 rounded-full border border-line">
                          <button
                            onClick={() => updateQuantity(product.id, item.quantity - product.minQty)}
                            className="flex h-7 w-7 items-center justify-center text-ink-soft hover:text-brand"
                            aria-label="Restar cantidad"
                          >
                            <Minus size={13} />
                          </button>
                          <span className="tabular w-8 text-center text-sm">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(product.id, item.quantity + product.minQty)}
                            className="flex h-7 w-7 items-center justify-center text-ink-soft hover:text-brand"
                            aria-label="Sumar cantidad"
                          >
                            <Plus size={13} />
                          </button>
                        </div>
                        <p className="tabular text-sm font-semibold text-brand-strong">
                          {formatUYU(getEffectivePrice(product) * item.quantity)}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Footer */}
            <div className="border-t border-line px-5 py-4">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-sm text-ink-soft">
                  Total estimado
                  <span className="block text-xs text-muted">{PRICE_NOTE}</span>
                </span>
                <span className="tabular text-xl font-semibold text-brand-strong">
                  {formatUYU(totalAmount)}
                </span>
              </div>
              <Link
                href="/carrito"
                onClick={closeCart}
                className="flex h-12 w-full items-center justify-center rounded-full gradient-brand text-base font-medium text-white shadow-md shadow-brand/25 transition-transform hover:-translate-y-0.5"
              >
                Finalizar pedido
              </Link>
              <button
                type="button"
                onClick={clearCart}
                className="mt-3 w-full text-center text-xs text-muted hover:text-danger"
              >
                Vaciar carrito
              </button>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
