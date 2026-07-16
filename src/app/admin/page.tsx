"use client";

import { useMemo } from "react";
import Link from "next/link";
import {
  Boxes,
  Layers,
  AlertTriangle,
  Pencil,
  ArrowRight,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";
import { categories, products } from "@/lib/data";
import { usePriceOverrides } from "@/context/PriceOverridesContext";
import { sampleOrders, ordersThisMonth, ORDER_STATUS_LABEL, type OrderStatus } from "@/lib/sampleOrders";
import { formatUYU, cn } from "@/lib/utils";

const STATUS_STYLES: Record<OrderStatus, string> = {
  nuevo: "bg-brand-soft text-brand-strong",
  preparando: "bg-accent-soft text-accent",
  entregado: "bg-paper text-ink-soft border border-line",
};

function StatTile({
  icon: Icon,
  label,
  value,
  hint,
  accent,
}: {
  icon: LucideIcon;
  label: string;
  value: string | number;
  hint?: string;
  accent?: boolean;
}) {
  return (
    <div className="card-elevated rounded-2xl border border-line gradient-surface p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-ink-soft">{label}</p>
        <span
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-xl text-white shadow-sm",
            accent ? "bg-danger shadow-danger/25" : "gradient-chip shadow-brand/25"
          )}
        >
          <Icon size={17} />
        </span>
      </div>
      <p className="tabular mt-3 font-display text-3xl font-bold text-ink">{value}</p>
      {hint && <p className="mt-0.5 text-xs text-muted">{hint}</p>}
    </div>
  );
}

export default function AdminDashboard() {
  const { overrides, getEffectivePrice } = usePriceOverrides();

  const catalogCategories = useMemo(
    () => categories.filter((c) => c.slug !== "packaging-personalizado"),
    []
  );

  const stats = useMemo(() => {
    const outOfStock = products.filter((p) => !p.inStock);
    const prices = products.map((p) => getEffectivePrice(p));
    const byCategory = catalogCategories
      .map((c) => ({
        name: c.name,
        slug: c.slug,
        count: products.filter((p) => p.categorySlug === c.slug).length,
      }))
      .sort((a, b) => b.count - a.count);
    const maxCount = Math.max(...byCategory.map((c) => c.count), 1);
    return {
      outOfStock,
      inStockCount: products.length - outOfStock.length,
      min: Math.min(...prices),
      max: Math.max(...prices),
      avg: Math.round(prices.reduce((s, p) => s + p, 0) / prices.length),
      featured: products.filter((p) => p.featured).length,
      byCategory,
      maxCount,
    };
  }, [getEffectivePrice, catalogCategories]);

  const monthOrders = ordersThisMonth();
  const monthRevenue = monthOrders.reduce((s, o) => s + o.total, 0);
  const stockPct = Math.round((stats.inStockCount / products.length) * 100);

  return (
    <div className="space-y-8">
      {/* KPI row (real data) */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile icon={Boxes} label="Productos" value={products.length} hint={`${stats.featured} destacados`} />
        <StatTile icon={Layers} label="Categorías" value={catalogCategories.length} hint="rubros activos" />
        <StatTile icon={AlertTriangle} label="Sin stock" value={stats.outOfStock.length} hint="requieren reposición" accent={stats.outOfStock.length > 0} />
        <StatTile icon={Pencil} label="Precios editados" value={Object.keys(overrides).length} hint="cambios sin publicar" />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        {/* Catalog by category (real) */}
        <div className="card-elevated rounded-2xl border border-line gradient-surface p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-ink">Productos por categoría</h2>
            <Link href="/admin/productos" className="text-xs font-medium text-brand hover:underline">
              Ver catálogo
            </Link>
          </div>
          <ul className="space-y-2.5">
            {stats.byCategory.map((c) => (
              <li key={c.slug} className="flex items-center gap-3">
                <span className="w-40 shrink-0 truncate text-sm text-ink-soft">{c.name}</span>
                <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-paper">
                  <div
                    className="h-full rounded-full gradient-brand"
                    style={{ width: `${(c.count / stats.maxCount) * 100}%` }}
                  />
                </div>
                <span className="tabular w-8 shrink-0 text-right text-sm font-medium text-ink">{c.count}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Stock + price stats (real) */}
        <div className="space-y-6">
          <div className="card-elevated rounded-2xl border border-line gradient-surface p-5">
            <h2 className="mb-3 text-sm font-semibold text-ink">Estado de stock</h2>
            <div className="flex items-end justify-between">
              <div>
                <p className="tabular font-display text-3xl font-bold text-brand-strong">{stockPct}%</p>
                <p className="text-xs text-muted">disponibilidad del catálogo</p>
              </div>
              <div className="text-right text-xs text-ink-soft">
                <p><span className="tabular font-semibold text-ink">{stats.inStockCount}</span> en stock</p>
                <p><span className="tabular font-semibold text-danger">{stats.outOfStock.length}</span> sin stock</p>
              </div>
            </div>
            <div className="mt-3 flex h-2.5 overflow-hidden rounded-full bg-paper">
              <div className="h-full gradient-brand" style={{ width: `${stockPct}%` }} />
              <div className="h-full bg-danger" style={{ width: `${100 - stockPct}%` }} />
            </div>
          </div>

          <div className="card-elevated rounded-2xl border border-line gradient-surface p-5">
            <h2 className="mb-3 text-sm font-semibold text-ink">Rango de precios</h2>
            <div className="grid grid-cols-3 gap-2 text-center">
              {[
                { l: "Mínimo", v: stats.min },
                { l: "Promedio", v: stats.avg },
                { l: "Máximo", v: stats.max },
              ].map((s) => (
                <div key={s.l} className="rounded-xl border border-line bg-paper py-3">
                  <p className="tabular text-sm font-bold text-ink">{formatUYU(s.v)}</p>
                  <p className="mt-0.5 text-[11px] text-muted">{s.l}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Out of stock (real, actionable) */}
      {stats.outOfStock.length > 0 && (
        <div className="card-elevated rounded-2xl border border-line gradient-surface p-5">
          <div className="mb-3 flex items-center gap-2">
            <AlertTriangle size={16} className="text-danger" />
            <h2 className="text-sm font-semibold text-ink">Productos sin stock</h2>
            <span className="rounded-full bg-danger/10 px-2 py-0.5 text-xs font-medium text-danger">
              {stats.outOfStock.length}
            </span>
          </div>
          <ul className="divide-y divide-line">
            {stats.outOfStock.map((p) => {
              const cat = categories.find((c) => c.slug === p.categorySlug);
              return (
                <li key={p.id} className="flex items-center justify-between py-2.5">
                  <div>
                    <p className="text-sm font-medium text-ink">{p.name}</p>
                    <p className="text-xs text-muted">{cat?.name} · {p.unit}</p>
                  </div>
                  <Link href={`/producto/${p.slug}`} className="text-xs font-medium text-brand hover:underline">
                    Ver
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {/* Recent orders (SAMPLE) */}
      <div className="card-elevated rounded-2xl border border-line gradient-surface p-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <TrendingUp size={16} className="text-brand" />
            <h2 className="text-sm font-semibold text-ink">Pedidos recientes</h2>
            <span className="rounded-full bg-accent-soft px-2 py-0.5 text-[11px] font-medium text-accent">
              Datos de ejemplo
            </span>
          </div>
          <Link href="/admin/pedidos" className="flex items-center gap-1 text-xs font-medium text-brand hover:underline">
            Ver todos <ArrowRight size={13} />
          </Link>
        </div>

        <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-line bg-paper p-3">
            <p className="tabular text-lg font-bold text-ink">{monthOrders.length}</p>
            <p className="text-xs text-muted">Pedidos este mes</p>
          </div>
          <div className="rounded-xl border border-line bg-paper p-3">
            <p className="tabular text-lg font-bold text-brand-strong">{formatUYU(monthRevenue)}</p>
            <p className="text-xs text-muted">Ingresos estimados</p>
          </div>
          <div className="rounded-xl border border-line bg-paper p-3">
            <p className="tabular text-lg font-bold text-ink">
              {sampleOrders.filter((o) => o.status !== "entregado").length}
            </p>
            <p className="text-xs text-muted">Pendientes</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[520px] text-sm">
            <thead>
              <tr className="border-b border-line text-left text-xs uppercase tracking-wide text-muted">
                <th className="py-2 pr-4 font-medium">Pedido</th>
                <th className="py-2 pr-4 font-medium">Empresa</th>
                <th className="py-2 pr-4 font-medium">Items</th>
                <th className="py-2 pr-4 font-medium">Total</th>
                <th className="py-2 font-medium">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {sampleOrders.slice(0, 5).map((o) => (
                <tr key={o.id}>
                  <td className="py-2.5 pr-4 font-medium text-ink">{o.id}</td>
                  <td className="py-2.5 pr-4 text-ink-soft">
                    {o.company}
                    <span className="block text-xs text-muted">{o.customer}</span>
                  </td>
                  <td className="tabular py-2.5 pr-4 text-ink-soft">{o.items}</td>
                  <td className="tabular py-2.5 pr-4 font-semibold text-ink">{formatUYU(o.total)}</td>
                  <td className="py-2.5">
                    <span className={cn("rounded-full px-2.5 py-1 text-xs font-medium", STATUS_STYLES[o.status])}>
                      {ORDER_STATUS_LABEL[o.status]}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
