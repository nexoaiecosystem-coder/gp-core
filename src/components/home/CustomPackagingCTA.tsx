import Link from "next/link";
import { ArrowRight, Palette } from "lucide-react";

export function CustomPackagingCTA() {
  return (
    <section className="mx-auto max-w-[1800px] px-6 pb-14">
      <div className="gradient-cta relative overflow-hidden rounded-3xl shadow-[var(--shadow-card)] ring-1 ring-accent/10">
        <div className="grid gap-8 p-8 md:grid-cols-2 md:p-12">
          <div className="flex flex-col justify-center">
            <span className="mb-3 w-fit rounded-full bg-white px-3 py-1 text-xs font-medium text-accent">
              Packaging a medida
            </span>
            <h2 className="font-display text-2xl font-bold text-brand-strong md:text-3xl">
              Tu marca, impresa en tu packaging.
            </h2>
            <p className="mt-3 max-w-md text-sm text-ink-soft">
              Diseñamos e imprimimos cajas, bolsas y etiquetas con tu logo y colores.
              Ideal para diferenciarte en cada entrega.
            </p>
            <Link
              href="/personalizado"
              className="gradient-brand mt-6 inline-flex h-11 w-fit items-center gap-2 rounded-full px-5 text-sm font-semibold text-white shadow-md shadow-brand/25 transition-transform hover:-translate-y-0.5 hover:shadow-lg hover:shadow-brand/30"
            >
              Solicitar cotización <ArrowRight size={15} />
            </Link>
          </div>
          <div className="hidden min-h-[220px] items-center justify-center overflow-hidden rounded-2xl bg-white/60 md:flex">
            <Palette className="h-24 w-24 text-accent opacity-70" strokeWidth={1.2} />
          </div>
        </div>
      </div>
    </section>
  );
}
