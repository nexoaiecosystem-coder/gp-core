import Link from "next/link";
import { ArrowRight, Pizza, Coffee, Sandwich, Croissant, Hotel, Building2, type LucideIcon } from "lucide-react";
import { rubros } from "@/lib/data";

const RUBRO_ICONS: Record<string, LucideIcon> = {
  pizzerias: Pizza,
  cafeterias: Coffee,
  hamburgueserias: Sandwich,
  panaderias: Croissant,
  hoteles: Hotel,
  empresas: Building2,
};

export function RubroSection() {
  return (
    <section className="bg-surface py-14">
      <div className="mx-auto max-w-[1800px] px-6">
        <div className="mb-6">
          <h2 className="font-display text-2xl font-bold text-ink">Comprá por rubro</h2>
          <p className="mt-1 text-sm text-ink-soft">
            Selecciones armadas según lo que realmente usa cada tipo de negocio
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
          {rubros.map((r) => {
            const Icon = RUBRO_ICONS[r.slug] ?? Building2;
            return (
              <Link
                key={r.slug}
                href={`/catalogo?categoria=${r.categorySlugs[0]}`}
                className="group card-elevated relative flex h-44 items-end overflow-hidden rounded-2xl gradient-brand"
              >
                <Icon
                  className="absolute -right-4 -top-4 h-32 w-32 text-white/10 transition-transform duration-300 group-hover:scale-110"
                  strokeWidth={1}
                />
                <div className="relative flex w-full items-end justify-between p-5">
                  <div>
                    <p className="font-display text-lg font-semibold text-white">{r.name}</p>
                    <p className="mt-0.5 text-xs text-white/70 line-clamp-1">{r.description}</p>
                  </div>
                  <ArrowRight size={18} className="shrink-0 text-white opacity-0 transition-opacity group-hover:opacity-100" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
