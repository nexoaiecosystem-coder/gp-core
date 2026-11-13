"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight, Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { usePriceOverrides } from "@/context/PriceOverridesContext";
import { useCustomerInfo } from "@/hooks/useCustomerInfo";
import { products } from "@/lib/data";
import { formatUYU, cn } from "@/lib/utils";
import { PRICE_NOTE } from "@/lib/constants";
import { Button } from "@/components/ui/Button";
import { Input, Label, Textarea } from "@/components/ui/Input";
import { ProductThumb } from "@/components/product/ProductThumb";
import {
  buildWhatsappUrl,
  isValidEmail,
  isValidPhone,
  OrderLine,
} from "@/lib/order";

export default function CartPage() {
  const { items, updateQuantity, removeItem, totalItems, totalAmount, clearCart } =
    useCart();
  const { getEffectivePrice } = usePriceOverrides();
  const { form, setForm } = useCustomerInfo();

  const [obs, setObs] = useState("");
  const [errors, setErrors] = useState<{ telefono?: string; email?: string }>({});

  const lines = items
    .map((item) => {
      const product = products.find((p) => p.id === item.productId);
      return product ? { item, product } : null;
    })
    .filter(Boolean) as OrderLine[];

  function validate() {
    const next: { telefono?: string; email?: string } = {};
    if (!isValidPhone(form.telefono)) {
      next.telefono = "Ingresá un teléfono válido (mínimo 8 dígitos).";
    }
    if (!isValidEmail(form.email)) {
      next.email = "Ingresá un email válido.";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    const url = buildWhatsappUrl(lines, totalAmount, form, obs, getEffectivePrice);
    window.open(url, "_blank");
  }

  return (
    <div className="mx-auto max-w-[1200px] px-6 py-8">
      <nav className="mb-6 flex items-center gap-1.5 text-sm text-muted">
        <Link href="/" className="hover:text-brand">Inicio</Link>
        <ChevronRight size={14} />
        <span className="text-ink">Tu pedido</span>
      </nav>

      <h1 className="font-display text-2xl font-bold text-ink md:text-3xl">Tu pedido</h1>

      {lines.length === 0 ? (
        <div className="mt-8 flex flex-col items-center justify-center gap-4 rounded-2xl border border-line bg-surface py-20 text-center">
          <p className="text-ink-soft">Todavía no agregaste productos.</p>
          <Link
            href="/catalogo"
            className="inline-flex h-11 items-center justify-center rounded-full gradient-brand px-6 text-sm font-medium text-white shadow-md shadow-brand/25 transition-transform hover:-translate-y-0.5"
          >
            Ver catálogo
          </Link>
        </div>
      ) : (
        <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_380px]">
          {/* Items + observaciones */}
          <div>
            <p className="mb-3 text-sm text-ink-soft">
              {totalItems} {totalItems === 1 ? "artículo" : "artículos"} en el pedido
            </p>
            <ul className="divide-y divide-line rounded-2xl border border-line bg-surface px-5">
              {lines.map(({ item, product }) => (
                <li key={product.id} className="flex gap-4 py-5">
                  <Link
                    href={`/producto/${product.slug}`}
                    className="h-20 w-20 shrink-0 overflow-hidden rounded-xl"
                  >
                    <ProductThumb name={product.name} categorySlug={product.categorySlug} className="h-full w-full" />
                  </Link>
                  <div className="flex flex-1 flex-col">
                    <div className="flex items-start justify-between gap-3">
                      <Link href={`/producto/${product.slug}`} className="text-sm font-medium text-ink hover:text-brand">
                        {product.name}
                      </Link>
                      <button
                        onClick={() => removeItem(product.id)}
                        className="shrink-0 text-muted hover:text-danger"
                        aria-label={`Quitar ${product.name}`}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <p className="mt-0.5 text-xs text-muted">{product.unit} · SKU {product.sku}</p>
                    <div className="mt-auto flex items-center justify-between pt-3">
                      <div className="flex items-center gap-1 rounded-full border border-line">
                        <button
                          onClick={() => updateQuantity(product.id, item.quantity - product.minQty)}
                          className="flex h-8 w-8 items-center justify-center text-ink-soft hover:text-brand"
                          aria-label="Restar cantidad"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="tabular w-10 text-center text-sm">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(product.id, item.quantity + product.minQty)}
                          className="flex h-8 w-8 items-center justify-center text-ink-soft hover:text-brand"
                          aria-label="Sumar cantidad"
                        >
                          <Plus size={14} />
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

            <button
              onClick={clearCart}
              className="mt-4 text-sm text-muted hover:text-danger"
            >
              Vaciar carrito
            </button>
          </div>

          {/* Summary + customer form */}
          <form
            onSubmit={handleSubmit}
            className="h-fit rounded-2xl border border-line bg-surface p-5 lg:sticky lg:top-24"
          >
            <p className="text-sm font-semibold text-ink">Tus datos</p>
            <p className="mt-0.5 text-xs text-muted">Los guardamos en este navegador para tu próximo pedido.</p>

            <div className="mt-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="nombre">Nombre</Label>
                  <Input
                    id="nombre"
                    required
                    value={form.nombre}
                    onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="empresa">Empresa</Label>
                  <Input
                    id="empresa"
                    value={form.empresa}
                    onChange={(e) => setForm({ ...form, empresa: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="telefono">Teléfono</Label>
                <Input
                  id="telefono"
                  required
                  type="tel"
                  placeholder="Ej: 099 123 456"
                  value={form.telefono}
                  onChange={(e) => {
                    setForm({ ...form, telefono: e.target.value });
                    if (errors.telefono) setErrors({ ...errors, telefono: undefined });
                  }}
                  className={errors.telefono ? "border-danger focus:border-danger focus:ring-danger/20" : undefined}
                />
                {errors.telefono && <p className="mt-1 text-xs text-danger">{errors.telefono}</p>}
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  placeholder="tu@empresa.com"
                  value={form.email}
                  onChange={(e) => {
                    setForm({ ...form, email: e.target.value });
                    if (errors.email) setErrors({ ...errors, email: undefined });
                  }}
                  className={errors.email ? "border-danger focus:border-danger focus:ring-danger/20" : undefined}
                />
                {errors.email && <p className="mt-1 text-xs text-danger">{errors.email}</p>}
              </div>
              <div>
                <Label htmlFor="obs">Observaciones</Label>
                <Textarea
                  id="obs"
                  rows={2}
                  placeholder="Ej: coordinar retiro, entregar en el turno de la tarde..."
                  value={obs}
                  onChange={(e) => setObs(e.target.value)}
                />
              </div>
            </div>

            <div className="mt-5 flex items-center justify-between border-t border-line pt-4">
              <span className="text-sm text-ink-soft">
                Total estimado
                <span className="block text-xs text-muted">{PRICE_NOTE}</span>
              </span>
              <span className="tabular text-2xl font-bold text-brand-strong">
                {formatUYU(totalAmount)}
              </span>
            </div>

            <Button type="submit" variant="whatsapp" className="mt-4 w-full" size="lg">
              Enviar pedido por WhatsApp
            </Button>
            <p className="mt-2 text-center text-xs text-muted">
              El pedido no se procesa hasta que confirmes el mensaje en WhatsApp.
            </p>
            <Link
              href="/catalogo"
              className={cn(
                "mt-3 flex h-11 items-center justify-center rounded-full border border-line text-sm font-medium text-ink",
                "hover:border-brand hover:text-brand"
              )}
            >
              Seguir comprando
            </Link>
          </form>
        </div>
      )}
    </div>
  );
}
