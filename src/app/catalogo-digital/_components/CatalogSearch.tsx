"use client";

import { useState, type ReactNode } from "react";
import { Search, X } from "lucide-react";
import type { CatalogItem } from "../_lib";
import { ProductGrid } from "./ProductTile";
import { whatsappLink } from "./whatsapp";

/** Lowercase + sin tildes, para que "higienico" encuentre "higiénico". */
function normalize(text: string) {
  return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

/** Buscador por nombre, medida o código. Sin búsqueda muestra `children` (el índice). */
export function CatalogSearch({ items, children }: { items: CatalogItem[]; children: ReactNode }) {
  const [query, setQuery] = useState("");
  const q = normalize(query.trim());
  const results = q
    ? items.filter((i) => normalize(`${i.name} ${i.measure} ${i.sku}`).includes(q))
    : [];

  return (
    <>
      <div className="relative print:hidden">
        <Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          type="text"
          enterKeyHint="search"
          placeholder="Buscar por nombre, medida o código (ej: vaso, 30x30, BOL-004)"
          className="h-12 w-full rounded-xl border border-line bg-surface pl-10 pr-10 text-sm text-ink shadow-[var(--shadow-card)] placeholder:text-muted focus:border-accent focus:outline-none"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            aria-label="Borrar búsqueda"
            className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md text-muted hover:text-ink"
          >
            <X size={16} />
          </button>
        )}
      </div>

      <div className="mt-8">
        {!q ? (
          children
        ) : results.length > 0 ? (
          <>
            <p className="mb-4 text-sm text-ink-soft">
              {results.length} {results.length === 1 ? "producto" : "productos"} para “{query.trim()}”
            </p>
            <ProductGrid items={results} />
          </>
        ) : (
          <p className="text-sm text-ink-soft">
            No encontramos productos para “{query.trim()}”.{" "}
            <a
              href={whatsappLink(`Hola G Packing! Tienen ${query.trim()}?`)}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-brand underline underline-offset-2"
            >
              Preguntanos por WhatsApp
            </a>
            .
          </p>
        )}
      </div>
    </>
  );
}
