import { getProductIcon } from "@/lib/productIcons";
import type { Family } from "../_lib";

function Thumb({ family }: { family: Family }) {
  if (family.photo) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- export estático sin optimizador de imágenes
      <img
        src={family.photo}
        alt={family.name}
        loading="lazy"
        className="h-full w-full object-contain"
      />
    );
  }
  const Icon = getProductIcon(family.name, family.sectionSlug);
  /* eslint-disable-next-line react-hooks/static-components -- Icon es un ícono importado existente, no un componente nuevo */
  return <Icon className="h-1/2 w-1/2 text-[#b3b8b1]" strokeWidth={1.4} aria-hidden />;
}

/** Lista estilo catálogo mayorista: foto + nombre, y una fila por variante (detalle · código). */
export function FamilyList({ families }: { families: Family[] }) {
  return (
    <div>
      <div className="hidden grid-cols-[60px_minmax(0,1fr)_minmax(0,1fr)_96px] border-y-2 border-b border-t-[#17191b] border-b-[#e6e6e1] py-2 text-[10.5px] font-semibold uppercase tracking-[0.1em] text-[#868a84] md:grid">
        <span className="col-span-2">Producto</span>
        <span>Detalle</span>
        <span className="text-right">Código</span>
      </div>
      <ul className="border-t-2 border-[#17191b] md:border-t-0">
        {families.map((f) => (
          <li
            key={f.id}
            className="grid grid-cols-[56px_minmax(0,1fr)] gap-x-3 gap-y-2 border-b border-[#e6e6e1] py-3.5 md:grid-cols-[60px_minmax(0,1fr)_minmax(0,1fr)_96px] md:gap-x-0"
          >
            <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded border border-[#e6e6e1] bg-white md:h-[60px] md:w-[60px]">
              <Thumb family={f} />
            </div>
            <h3 className="self-center text-[15px] font-semibold leading-snug text-[#17191b] md:self-start md:pl-5 md:pt-0.5">
              {f.name}
            </h3>
            <div className="col-span-2 md:col-span-2 md:col-start-3">
              {f.rows.map((r) => (
                <div
                  key={r.code}
                  className="grid grid-cols-[minmax(0,1fr)_auto] gap-3 border-t border-[#f0f0ec] py-1.5 first:border-t-0 first:pt-0 md:grid-cols-[minmax(0,1fr)_96px] md:gap-0 md:first:pt-0.5"
                >
                  <span className="tabular text-sm text-[#4b4f52]">{r.detail || "—"}</span>
                  <span className="tabular text-right font-mono text-[13px] font-semibold tracking-wide text-[#0d3d22]">
                    {r.code}
                  </span>
                </div>
              ))}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
