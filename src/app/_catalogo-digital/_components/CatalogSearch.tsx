"use client";

import { useState, type ReactNode } from "react";
import { Search, X } from "lucide-react";
import type { Family } from "../_lib";
import { FamilyList } from "./FamilyList";

/** Minúsculas y sin tildes, para que "higienico" encuentre "Higiénico". */
function normalize(text: string) {
  return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

/** Buscador por nombre, detalle o código. Sin búsqueda muestra `children` (el índice). */
export function CatalogSearch({ families, children }: { families: Family[]; children: ReactNode }) {
  const [query, setQuery] = useState("");
  const q = normalize(query.trim());
  const results = q
    ? families.filter((f) =>
        normalize(`${f.name} ${f.rows.map((r) => `${r.detail} ${r.code}`).join(" ")}`).includes(q)
      )
    : [];

  return (
    <>
      <div className="relative">
        <Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#868a84]" />
        <input
          id="buscar"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          type="text"
          enterKeyHint="search"
          placeholder="Buscar por producto, medida o código (ej: vaso, 30x30, BOL-012)"
          className="h-12 w-full rounded-md border border-[#e6e6e1] bg-white pl-10 pr-10 text-sm text-[#17191b] placeholder:text-[#868a84] focus:border-[#4f7a2e] focus:outline-none"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            aria-label="Borrar búsqueda"
            className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded text-[#868a84] hover:text-[#17191b]"
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
            <p className="mb-3 text-sm text-[#4b4f52]">
              {results.length} {results.length === 1 ? "resultado" : "resultados"} para “{query.trim()}”
            </p>
            <FamilyList families={results} />
          </>
        ) : (
          <p className="text-sm text-[#4b4f52]">
            No encontramos productos para “{query.trim()}”. Consultanos: trabajamos con una amplia red
            de proveedores.
          </p>
        )}
      </div>
    </>
  );
}
