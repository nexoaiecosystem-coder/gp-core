"use client";

import { useMemo, useState } from "react";
import { RotateCcw, Search, Check } from "lucide-react";
import { categories, products } from "@/lib/data";
import { usePriceOverrides } from "@/context/PriceOverridesContext";
import { formatUYU, cn } from "@/lib/utils";
import { Input } from "@/components/ui/Input";
import { ProductThumb } from "@/components/product/ProductThumb";

export default function AdminProductosPage() {
  const { overrides, getEffectivePrice, setOverride, resetOverride, resetAll } =
    usePriceOverrides();
  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [savedId, setSavedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let list = products;
    if (categoryFilter) list = list.filter((p) => p.categorySlug === categoryFilter);
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter((p) => p.name.toLowerCase().includes(q));
    }
    return list;
  }, [query, categoryFilter]);

  const overrideCount = Object.keys(overrides).length;

  function handlePriceChange(productId: string, rawValue: string) {
    const value = Number(rawValue);
    if (Number.isNaN(value) || value < 0) return;
    setOverride(productId, value);
    setSavedId(productId);
    window.setTimeout(() => setSavedId((cur) => (cur === productId ? null : cur)), 1200);
  }

  return (
    <div>
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-xl font-bold text-ink">Editor de precios</h2>
          <p className="mt-1 text-sm text-ink-soft">
            {overrideCount > 0
              ? `${overrideCount} producto(s) con precio editado.`
              : "Todos los productos muestran el precio original del catálogo."}
          </p>
        </div>
        {overrideCount > 0 && (
          <button
            onClick={resetAll}
            className="flex items-center gap-1.5 self-start rounded-full border border-line px-3 py-1.5 text-sm text-ink-soft hover:border-danger hover:text-danger"
          >
            <RotateCcw size={14} /> Restablecer todos
          </button>
        )}
      </div>

      <div className="mb-4 flex flex-col gap-2 sm:flex-row">
        <div className="relative flex-1">
          <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar producto..."
            className="pl-10"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="h-11 rounded-xl border border-line bg-surface px-3 text-sm focus:border-brand focus:outline-none"
        >
          <option value="">Todas las categorías</option>
          {categories
            .filter((c) => c.slug !== "packaging-personalizado")
            .map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name}
              </option>
            ))}
        </select>
      </div>

      {/* Mobile: tarjetas apiladas */}
      <div className="space-y-3 sm:hidden">
        {filtered.map((p) => {
          const category = categories.find((c) => c.slug === p.categorySlug);
          const overridden = overrides[p.id] !== undefined;
          return (
            <div
              key={p.id}
              className={cn(
                "rounded-2xl border border-line bg-surface p-4",
                overridden && "bg-accent-soft/40"
              )}
            >
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg">
                  <ProductThumb name={p.name} categorySlug={p.categorySlug} className="h-full w-full" iconClassName="h-1/2 w-1/2" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-ink">{p.name}</p>
                  <p className="text-xs text-muted">
                    {category?.name} · {p.unit}
                  </p>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between gap-3 border-t border-line pt-3">
                <div>
                  <p className="text-xs text-muted">Precio original</p>
                  <p className="tabular text-sm text-ink-soft">{formatUYU(p.price)}</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <label className="text-xs text-muted">Precio actual</label>
                  <div className="flex items-center gap-1.5">
                    <span className="text-ink-soft">$</span>
                    <input
                      type="number"
                      min={0}
                      inputMode="decimal"
                      value={getEffectivePrice(p)}
                      onChange={(e) => handlePriceChange(p.id, e.target.value)}
                      className="tabular h-10 w-28 rounded-lg border border-line bg-surface px-2 text-base focus:border-brand focus:outline-none"
                    />
                    {savedId === p.id && <Check size={15} className="text-whatsapp shrink-0" />}
                  </div>
                </div>
              </div>

              {overridden && (
                <button
                  onClick={() => resetOverride(p.id)}
                  className="mt-2 text-xs text-muted hover:text-danger"
                >
                  Restablecer precio
                </button>
              )}
            </div>
          );
        })}
        {filtered.length === 0 && (
          <p className="rounded-2xl border border-line bg-surface p-8 text-center text-sm text-ink-soft">
            No se encontraron productos.
          </p>
        )}
      </div>

      {/* Desktop / tablet: tabla */}
      <div className="hidden overflow-hidden rounded-2xl border border-line bg-surface sm:block">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line bg-paper text-left text-xs uppercase tracking-wide text-muted">
                <th className="px-4 py-3 font-medium">Producto</th>
                <th className="px-4 py-3 font-medium">Categoría</th>
                <th className="px-4 py-3 font-medium">Precio original</th>
                <th className="px-4 py-3 font-medium">Precio actual</th>
                <th className="px-4 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {filtered.map((p) => {
                const category = categories.find((c) => c.slug === p.categorySlug);
                const overridden = overrides[p.id] !== undefined;
                return (
                  <tr key={p.id} className={cn(overridden && "bg-accent-soft/40")}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg">
                          <ProductThumb name={p.name} categorySlug={p.categorySlug} className="h-full w-full" iconClassName="h-1/2 w-1/2" />
                        </div>
                        <div>
                          <p className="font-medium text-ink">{p.name}</p>
                          <p className="text-xs text-muted">{p.unit}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-ink-soft">{category?.name}</td>
                    <td className="tabular px-4 py-3 text-ink-soft">{formatUYU(p.price)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <span className="text-ink-soft">$</span>
                        <input
                          type="number"
                          min={0}
                          value={getEffectivePrice(p)}
                          onChange={(e) => handlePriceChange(p.id, e.target.value)}
                          className="tabular h-9 w-24 rounded-lg border border-line bg-surface px-2 text-sm focus:border-brand focus:outline-none"
                        />
                        {savedId === p.id && <Check size={15} className="text-whatsapp" />}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      {overridden && (
                        <button
                          onClick={() => resetOverride(p.id)}
                          className="text-xs text-muted hover:text-danger"
                        >
                          Restablecer
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <p className="p-8 text-center text-sm text-ink-soft">No se encontraron productos.</p>
        )}
      </div>
    </div>
  );
}
