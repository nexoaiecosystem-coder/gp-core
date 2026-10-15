import { ProductThumb } from "@/components/product/ProductThumb";
import { WhatsAppIcon } from "@/components/layout/FloatingActions";
import { whatsappLink } from "./whatsapp";
import type { CatalogItem } from "../_lib";

function consultLink(item: CatalogItem) {
  return whatsappLink(
    `Hola G Packing! Quiero consultar por: ${item.name} (${item.measure}) — código ${item.sku}`
  );
}

/** Ficha de producto del catálogo: foto, nombre, medida y código. Sin precio. */
export function ProductTile({ item }: { item: CatalogItem }) {
  return (
    <li className="flex flex-col overflow-hidden rounded-xl border border-line bg-surface shadow-[var(--shadow-card)] break-inside-avoid print:shadow-none">
      {item.photo ? (
        <div className="flex aspect-square w-full items-center justify-center bg-white p-3">
          {/* eslint-disable-next-line @next/next/no-img-element -- export estático sin optimizador de imágenes */}
          <img
            src={item.photo}
            alt={`${item.name} — ${item.measure}`}
            loading="lazy"
            className="h-full w-full object-contain"
          />
        </div>
      ) : (
        <ProductThumb
          name={item.name}
          categorySlug={item.categorySlug}
          className="aspect-square w-full"
          iconClassName="h-1/4 w-1/4"
        />
      )}

      <div className="flex flex-1 flex-col border-t border-line p-3">
        <h3 className="text-sm font-semibold leading-snug text-ink">{item.name}</h3>
        <p className="mt-1 text-xs text-ink-soft">{item.measure}</p>
        <div className="mt-auto flex items-center justify-between gap-2 pt-3">
          <span className="rounded-md bg-brand-soft px-2 py-1 font-mono text-xs font-semibold tracking-wide text-brand">
            {item.sku}
          </span>
          <a
            href={consultLink(item)}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Consultar por ${item.name} ${item.measure} en WhatsApp`}
            title="Consultar por WhatsApp"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-whatsapp text-white transition-transform hover:scale-105 print:hidden"
          >
            <WhatsAppIcon size={16} />
          </a>
        </div>
      </div>
    </li>
  );
}

export function ProductGrid({ items }: { items: CatalogItem[] }) {
  return (
    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 print:grid-cols-4 print:gap-2">
      {items.map((item) => (
        <ProductTile key={item.id} item={item} />
      ))}
    </ul>
  );
}
