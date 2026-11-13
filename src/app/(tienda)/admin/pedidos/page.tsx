"use client";

import { useMemo, useState } from "react";
import { Info } from "lucide-react";
import {
  sampleOrders,
  ORDER_STATUS_LABEL,
  type OrderStatus,
} from "@/lib/sampleOrders";
import { formatUYU, cn } from "@/lib/utils";

const STATUS_STYLES: Record<OrderStatus, string> = {
  nuevo: "bg-brand-soft text-brand-strong",
  preparando: "bg-accent-soft text-accent",
  entregado: "bg-paper text-ink-soft border border-line",
};

const FILTERS: { value: OrderStatus | "todos"; label: string }[] = [
  { value: "todos", label: "Todos" },
  { value: "nuevo", label: "Nuevos" },
  { value: "preparando", label: "Preparando" },
  { value: "entregado", label: "Entregados" },
];

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("es-UY", { day: "2-digit", month: "short" });
}

export default function AdminPedidosPage() {
  const [filter, setFilter] = useState<OrderStatus | "todos">("todos");

  const filtered = useMemo(
    () => (filter === "todos" ? sampleOrders : sampleOrders.filter((o) => o.status === filter)),
    [filter]
  );
  const total = filtered.reduce((s, o) => s + o.total, 0);

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-xl font-bold text-ink">Pedidos</h2>
          <p className="mt-1 text-sm text-ink-soft">Gestión de pedidos entrantes.</p>
        </div>
        <span className="flex w-fit items-center gap-1.5 rounded-full bg-accent-soft px-3 py-1.5 text-xs font-medium text-accent">
          <Info size={13} /> Datos de ejemplo — se conectan a Supabase en producción
        </span>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-1.5">
        {FILTERS.map((f) => {
          const count = f.value === "todos" ? sampleOrders.length : sampleOrders.filter((o) => o.status === f.value).length;
          return (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={cn(
                "rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors",
                filter === f.value
                  ? "gradient-brand text-white"
                  : "border border-line text-ink-soft hover:border-brand hover:text-brand"
              )}
            >
              {f.label} <span className="tabular opacity-70">({count})</span>
            </button>
          );
        })}
      </div>

      <div className="overflow-hidden rounded-2xl border border-line bg-surface">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b border-line bg-paper text-left text-xs uppercase tracking-wide text-muted">
                <th className="px-4 py-3 font-medium">Pedido</th>
                <th className="px-4 py-3 font-medium">Fecha</th>
                <th className="px-4 py-3 font-medium">Cliente</th>
                <th className="px-4 py-3 font-medium">Items</th>
                <th className="px-4 py-3 font-medium">Total</th>
                <th className="px-4 py-3 font-medium">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {filtered.map((o) => (
                <tr key={o.id} className="hover:bg-paper/60">
                  <td className="px-4 py-3 font-medium text-ink">{o.id}</td>
                  <td className="px-4 py-3 text-ink-soft">{formatDate(o.date)}</td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-ink">{o.company}</p>
                    <p className="text-xs text-muted">{o.customer}</p>
                  </td>
                  <td className="tabular px-4 py-3 text-ink-soft">{o.items}</td>
                  <td className="tabular px-4 py-3 font-semibold text-ink">{formatUYU(o.total)}</td>
                  <td className="px-4 py-3">
                    <span className={cn("rounded-full px-2.5 py-1 text-xs font-medium", STATUS_STYLES[o.status])}>
                      {ORDER_STATUS_LABEL[o.status]}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t border-line bg-paper">
                <td className="px-4 py-3 text-xs font-medium uppercase tracking-wide text-muted" colSpan={4}>
                  {filtered.length} pedido(s)
                </td>
                <td className="tabular px-4 py-3 font-bold text-brand-strong" colSpan={2}>
                  {formatUYU(total)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}
