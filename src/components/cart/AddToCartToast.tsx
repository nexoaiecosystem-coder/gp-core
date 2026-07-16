"use client";

import { CheckCircle2 } from "lucide-react";
import { useCart } from "@/context/CartContext";

export function AddToCartToast() {
  const { lastAdded, openCart } = useCart();

  if (!lastAdded) return null;

  return (
    <div
      key={lastAdded.key}
      className="fixed bottom-24 left-1/2 z-40 -translate-x-1/2 md:bottom-6 md:left-auto md:right-24 md:translate-x-0"
    >
      <button
        onClick={openCart}
        className="toast-pop flex items-center gap-3 rounded-full bg-header px-4 py-3 text-sm text-white shadow-xl hover:bg-black"
      >
        <CheckCircle2 size={18} className="shrink-0 text-brand-soft" />
        <span className="text-left">
          <span className="block font-medium">
            {lastAdded.quantity > 1 ? `${lastAdded.quantity}x ` : ""}
            {lastAdded.name}
          </span>
          <span className="block text-xs text-white/60">Agregado — ver carrito</span>
        </span>
      </button>
    </div>
  );
}
