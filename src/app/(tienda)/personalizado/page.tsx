"use client";

import { useState } from "react";
import { Palette, Layers, Sparkles, PackageOpen, ShoppingBag, CupSoda, Box, StickyNote, type LucideIcon } from "lucide-react";
import { Input, Label, Textarea } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { customizableProducts } from "@/lib/data";

const CUST_ICONS: Record<string, LucideIcon> = {
  "cust-bolsas": ShoppingBag,
  "cust-vasos": CupSoda,
  "cust-cajas": Box,
  "cust-papel-antigrasa": StickyNote,
  "cust-etiquetas": StickyNote,
};

const steps = [
  {
    icon: Palette,
    title: "Nos contás tu idea",
    description: "Completás el formulario con tu marca, colores y el tipo de producto que necesitás personalizar.",
  },
  {
    icon: Layers,
    title: "Te armamos una propuesta",
    description: "Nuestro equipo diseña una muestra digital y te cotiza según cantidad y materiales.",
  },
  {
    icon: Sparkles,
    title: "Producción e impresión",
    description: "Una vez aprobado el diseño, producimos e imprimimos tu packaging a medida.",
  },
];

export default function PersonalizadoPage() {
  const [form, setForm] = useState({ nombre: "", empresa: "", producto: "", cantidad: "", detalle: "" });
  const [sent, setSent] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSent(true);
  }

  return (
    <div>
      <section className="gradient-brand">
        <div className="mx-auto grid max-w-[1800px] gap-8 px-6 py-16 md:grid-cols-2 md:items-center">
          <div>
            <span className="mb-3 inline-flex w-fit rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium text-white/90">
              Packaging Personalizado
            </span>
            <h1 className="font-display text-3xl font-bold leading-tight text-white md:text-4xl">
              Diseñamos e imprimimos packaging con tu marca.
            </h1>
            <p className="mt-4 max-w-md text-sm text-white/75">
              Cajas, bolsas, vasos y etiquetas personalizadas con tu logo y colores.
              Ideal para diferenciar tu negocio en cada entrega.
            </p>
          </div>
          <div className="hidden aspect-[4/3] items-center justify-center overflow-hidden rounded-2xl bg-white/10 md:flex">
            <PackageOpen className="h-28 w-28 text-white/60" strokeWidth={1.2} />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1800px] px-6 py-14">
        <h2 className="mb-8 font-display text-2xl font-bold text-ink">¿Cómo funciona?</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {steps.map((s, i) => (
            <div key={s.title} className="rounded-2xl border border-line bg-surface p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-soft text-brand-strong">
                <s.icon size={19} />
              </div>
              <p className="mt-4 text-sm font-semibold text-ink">{i + 1}. {s.title}</p>
              <p className="mt-1.5 text-sm text-ink-soft">{s.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[1800px] px-6 pb-14">
        <h2 className="mb-2 font-display text-2xl font-bold text-ink">Qué podemos personalizar</h2>
        <p className="mb-8 text-sm text-ink-soft">Cantidad mínima y tipo de impresión de cada línea de producto.</p>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {customizableProducts.map((c) => (
            <div key={c.id} className="overflow-hidden rounded-2xl border border-line bg-surface">
              <div className="flex h-36 w-full items-center justify-center bg-brand-soft">
                {(() => {
                  const Icon = CUST_ICONS[c.id] ?? PackageOpen;
                  return <Icon className="h-14 w-14 text-brand-strong opacity-70" strokeWidth={1.3} />;
                })()}
              </div>
              <div className="p-5">
                <p className="text-sm font-semibold text-ink">{c.name}</p>
                <p className="mt-1 text-sm text-ink-soft">{c.description}</p>
                <dl className="mt-4 space-y-1.5 border-t border-line pt-3 text-xs">
                  <div className="flex justify-between gap-2">
                    <dt className="text-muted">Personalización</dt>
                    <dd className="text-right font-medium text-ink">{c.customizationType}</dd>
                  </div>
                  <div className="flex justify-between gap-2">
                    <dt className="text-muted">Cantidad mínima</dt>
                    <dd className="font-medium text-ink">{c.minQty}</dd>
                  </div>
                  <div className="flex justify-between gap-2">
                    <dt className="text-muted">Colores de impresión</dt>
                    <dd className="font-medium text-ink">{c.printColors}</dd>
                  </div>
                </dl>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 pb-16">
        <div className="rounded-2xl border border-line bg-surface p-6 md:p-8">
          <h2 className="font-display text-xl font-bold text-ink">Solicitá tu cotización</h2>
          <p className="mt-1 text-sm text-ink-soft">Contanos qué necesitás y te contactamos con una propuesta.</p>

          {sent ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <p className="text-lg font-semibold text-ink">¡Recibimos tu solicitud!</p>
              <p className="mt-1 text-sm text-ink-soft">Nuestro equipo te va a contactar para coordinar el diseño.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="nombre">Nombre</Label>
                  <Input id="nombre" required value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} />
                </div>
                <div>
                  <Label htmlFor="empresa">Empresa</Label>
                  <Input id="empresa" required value={form.empresa} onChange={(e) => setForm({ ...form, empresa: e.target.value })} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="producto">Producto a personalizar</Label>
                  <Input id="producto" placeholder="Ej: cajas para pizza" required value={form.producto} onChange={(e) => setForm({ ...form, producto: e.target.value })} />
                </div>
                <div>
                  <Label htmlFor="cantidad">Cantidad estimada</Label>
                  <Input id="cantidad" placeholder="Ej: 1000 unidades" value={form.cantidad} onChange={(e) => setForm({ ...form, cantidad: e.target.value })} />
                </div>
              </div>
              <div>
                <Label htmlFor="detalle">Contanos tu idea</Label>
                <Textarea id="detalle" rows={4} placeholder="Colores, logo, referencias..." value={form.detalle} onChange={(e) => setForm({ ...form, detalle: e.target.value })} />
              </div>
              <Button type="submit" size="lg" className="w-full">Enviar solicitud</Button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
