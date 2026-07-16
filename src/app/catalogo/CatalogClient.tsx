"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ChevronRight, SlidersHorizontal, X } from "lucide-react";
import { categories, products } from "@/lib/data";
import { ProductRow } from "@/components/product/ProductRow";
import { usePriceOverrides } from "@/context/PriceOverridesContext";
import { formatUYU, cn } from "@/lib/utils";
import { PRICE_NOTE } from "@/lib/constants";

type SortKey = "relevancia" | "precio-asc" | "precio-desc" | "nombre";

const PAGE_SIZE = 24;

export function CatalogClient() {
  const searchParams = useSearchParams();
  const { getEffectivePrice } = usePriceOverrides();
  const initialCategory = searchParams.get("categoria") ?? "";
  const initialQuery = searchParams.get("q") ?? "";

  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [query, setQuery] = useState(initialQuery);
  const [sort, setSort] = useState<SortKey>("relevancia");
  const [page, setPage] = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [materialFilters, setMaterialFilters] = useState<string[]>([]);
  const [featureFilters, setFeatureFilters] = useState<string[]>([]);

  const priceBounds = useMemo(() => {
    const prices = products.map((p) => getEffectivePrice(p));
    return { min: 0, max: Math.ceil(Math.max(...prices) / 100) * 100 };
  }, [getEffectivePrice]);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  const effectiveMaxPrice = maxPrice ?? priceBounds.max;

  // Options available within the currently selected category (contextual, like the reference)
  const scopedProducts = useMemo(
    () => (activeCategory ? products.filter((p) => p.categorySlug === activeCategory) : products),
    [activeCategory]
  );
  const availableMaterials = useMemo(
    () => Array.from(new Set(scopedProducts.map((p) => p.material).filter(Boolean))) as string[],
    [scopedProducts]
  );
  const availableFeatures = useMemo(
    () => Array.from(new Set(scopedProducts.flatMap((p) => p.features ?? []))),
    [scopedProducts]
  );

  const filtered = useMemo(() => {
    let list = [...products];

    if (activeCategory) list = list.filter((p) => p.categorySlug === activeCategory);
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    if (materialFilters.length > 0) {
      list = list.filter((p) => p.material && materialFilters.includes(p.material));
    }
    if (featureFilters.length > 0) {
      list = list.filter((p) => p.features?.some((f) => featureFilters.includes(f)));
    }
    list = list.filter((p) => getEffectivePrice(p) <= effectiveMaxPrice);

    switch (sort) {
      case "precio-asc":
        list.sort((a, b) => getEffectivePrice(a) - getEffectivePrice(b));
        break;
      case "precio-desc":
        list.sort((a, b) => getEffectivePrice(b) - getEffectivePrice(a));
        break;
      case "nombre":
        list.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }

    return list;
  }, [activeCategory, query, sort, materialFilters, featureFilters, effectiveMaxPrice, getEffectivePrice]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const activeCategoryName = categories.find((c) => c.slug === activeCategory)?.name;
  const rangeStart = filtered.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const rangeEnd = Math.min(page * PAGE_SIZE, filtered.length);

  function handleCategoryClick(slug: string) {
    setActiveCategory((prev) => (prev === slug ? "" : slug));
    setMaterialFilters([]);
    setFeatureFilters([]);
    setPage(1);
  }

  function toggleMaterial(m: string) {
    setMaterialFilters((prev) => (prev.includes(m) ? prev.filter((x) => x !== m) : [...prev, m]));
    setPage(1);
  }

  function toggleFeature(f: string) {
    setFeatureFilters((prev) => (prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f]));
    setPage(1);
  }

  function clearAllFilters() {
    setActiveCategory("");
    setQuery("");
    setMaterialFilters([]);
    setFeatureFilters([]);
    setMaxPrice(null);
  }

  const activeFilterCount =
    materialFilters.length + featureFilters.length + (maxPrice !== null ? 1 : 0);

  return (
    <div className="mx-auto max-w-[1800px] px-6 py-8">
      {/* Breadcrumb */}
      <nav className="mb-5 flex items-center gap-1.5 text-sm text-muted">
        <Link href="/" className="hover:text-brand">Inicio</Link>
        <ChevronRight size={14} />
        <span className="text-ink">{activeCategoryName ?? "Catálogo"}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
        {/* Filters sidebar */}
        <aside className={cn("lg:block", filtersOpen ? "block" : "hidden")}>
          <div className="mb-6">
            <p className="mb-3 text-sm font-semibold text-ink">Categorías</p>
            <ul className="space-y-1">
              <li>
                <button
                  onClick={() => handleCategoryClick("")}
                  className={cn(
                    "flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm hover:bg-paper",
                    !activeCategory ? "bg-brand-soft font-medium text-brand-strong" : "text-ink-soft"
                  )}
                >
                  <span>Todas las categorías</span>
                  <span className="text-xs text-muted">{products.length}</span>
                </button>
              </li>
              {categories
                .filter((c) => c.slug !== "packaging-personalizado")
                .map((c) => (
                  <li key={c.slug}>
                    <button
                      onClick={() => handleCategoryClick(c.slug)}
                      className={cn(
                        "flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm hover:bg-paper",
                        activeCategory === c.slug ? "bg-brand-soft font-medium text-brand-strong" : "text-ink-soft"
                      )}
                    >
                      <span>{c.name}</span>
                      <span className="text-xs text-muted">{c.productCount}</span>
                    </button>
                  </li>
                ))}
            </ul>
          </div>

          {(availableMaterials.length > 0 || availableFeatures.length > 0) && (
            <div className="mb-6 border-t border-line pt-5">
              <p className="mb-3 text-sm font-semibold text-ink">Filtrar por</p>

              {availableMaterials.length > 0 && (
                <div className="mb-4">
                  <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted">Material</p>
                  <ul className="space-y-2">
                    {availableMaterials.map((m) => (
                      <li key={m}>
                        <label className="flex cursor-pointer items-center gap-2 text-sm text-ink-soft">
                          <input
                            type="checkbox"
                            checked={materialFilters.includes(m)}
                            onChange={() => toggleMaterial(m)}
                            className="h-4 w-4 rounded border-line text-brand focus:ring-brand/30"
                          />
                          {m}
                        </label>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {availableFeatures.length > 0 && (
                <div className="mb-4">
                  <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted">Características</p>
                  <ul className="space-y-2">
                    {availableFeatures.map((f) => (
                      <li key={f}>
                        <label className="flex cursor-pointer items-center gap-2 text-sm text-ink-soft">
                          <input
                            type="checkbox"
                            checked={featureFilters.includes(f)}
                            onChange={() => toggleFeature(f)}
                            className="h-4 w-4 rounded border-line text-brand focus:ring-brand/30"
                          />
                          {f}
                        </label>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          <div className="border-t border-line pt-5">
            <p className="mb-3 text-sm font-semibold text-ink">Precio</p>
            <input
              type="range"
              min={priceBounds.min}
              max={priceBounds.max}
              step={50}
              value={effectiveMaxPrice}
              onChange={(e) => {
                setMaxPrice(Number(e.target.value));
                setPage(1);
              }}
              className="w-full accent-brand"
            />
            <div className="mt-1 flex justify-between text-xs text-muted">
              <span>{formatUYU(priceBounds.min)}</span>
              <span className="tabular font-medium text-ink">{formatUYU(effectiveMaxPrice)}</span>
            </div>
          </div>

          {activeFilterCount > 0 && (
            <button
              onClick={clearAllFilters}
              className="mt-6 flex items-center gap-1.5 text-sm font-medium text-brand hover:underline"
            >
              <X size={14} /> Limpiar filtros ({activeFilterCount})
            </button>
          )}
        </aside>

        {/* Results */}
        <div>
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="font-display text-2xl font-bold text-ink">
                {activeCategoryName ?? "Catálogo completo"}
              </h1>
              <p className="mt-1 text-sm text-ink-soft">
                {filtered.length > 0
                  ? `Mostrando ${rangeStart}-${rangeEnd} de ${filtered.length} productos`
                  : "0 productos encontrados"}
                <span className="text-muted"> · Precios mayoristas ({PRICE_NOTE})</span>
              </p>
            </div>

            <div className="flex flex-wrap gap-2 sm:flex-nowrap">
              <input
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setPage(1);
                }}
                placeholder="Buscar en el catálogo..."
                className="h-10 min-w-0 flex-1 rounded-lg border border-line bg-surface px-4 text-sm focus:border-brand focus:outline-none sm:w-56 sm:flex-none"
              />
              <button
                onClick={() => setFiltersOpen((v) => !v)}
                className="flex h-10 shrink-0 items-center gap-1.5 rounded-lg border border-line px-3 text-sm text-ink-soft lg:hidden"
              >
                <SlidersHorizontal size={15} /> Filtros
              </button>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
                className="h-10 min-w-0 flex-1 rounded-lg border border-line bg-surface px-3 text-sm focus:border-brand focus:outline-none sm:flex-none"
              >
                <option value="relevancia">Ordenar por: Relevancia</option>
                <option value="precio-asc">Precio: menor a mayor</option>
                <option value="precio-desc">Precio: mayor a menor</option>
                <option value="nombre">Nombre (A-Z)</option>
              </select>
            </div>
          </div>

          <div className="rounded-2xl border border-line bg-surface px-5">
            {paged.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <p className="text-ink-soft">No encontramos productos con esos filtros.</p>
                <button
                  onClick={clearAllFilters}
                  className="mt-3 text-sm font-medium text-brand hover:underline"
                >
                  Limpiar filtros
                </button>
              </div>
            ) : (
              paged.map((p) => <ProductRow key={p.id} product={p} />)
            )}
          </div>

          {totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-2">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={cn(
                    "h-9 w-9 rounded-full text-sm",
                    page === i + 1
                      ? "gradient-brand text-white"
                      : "border border-line text-ink-soft hover:border-brand hover:text-brand"
                  )}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
