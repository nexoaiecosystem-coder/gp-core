"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect, useMemo } from "react";
import { Search, ShoppingCart, Truck, ShieldCheck, Headset, Award, Menu, X } from "lucide-react";
import { categories, products } from "@/lib/data";
import { BUSINESS } from "@/lib/constants";
import { useCart } from "@/context/CartContext";
import { ProductThumb } from "@/components/product/ProductThumb";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { formatUYU, cn } from "@/lib/utils";

const utilityItems = [
  { icon: Award, title: "Venta mayorista", subtitle: "Precios exclusivos" },
  { icon: Truck, title: "Entrega en 24-48h", subtitle: BUSINESS.deliveryZone },
  { icon: Headset, title: "Atención personalizada", subtitle: "Asesoramiento rápido" },
  { icon: ShieldCheck, title: "Productos de calidad", subtitle: "Materiales certificados" },
];

export function Header() {
  const router = useRouter();
  const { totalItems, totalAmount, openCart } = useCart();
  const [query, setQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(0);
  const searchRef = useRef<HTMLDivElement>(null);

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return products
      .filter((p) => p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q))
      .slice(0, 6);
  }, [query]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function goToProduct(slug: string) {
    setSearchFocused(false);
    setQuery("");
    router.push(`/producto/${slug}`);
  }

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (matches.length > 0 && highlighted < matches.length) {
      goToProduct(matches[highlighted].slug);
      return;
    }
    setSearchFocused(false);
    router.push(query.trim() ? `/catalogo?q=${encodeURIComponent(query.trim())}` : "/catalogo");
  }

  function handleViewAllResults() {
    setSearchFocused(false);
    router.push(`/catalogo?q=${encodeURIComponent(query.trim())}`);
  }

  function handleSearchKeyDown(e: React.KeyboardEvent) {
    if (matches.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlighted((h) => Math.min(h + 1, matches.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlighted((h) => Math.max(h - 1, 0));
    }
  }

  function handleCategoryPick(slug: string) {
    setSearchFocused(false);
    setQuery("");
    router.push(`/catalogo?categoria=${slug}`);
  }

  return (
    <header className="sticky top-0 z-40 bg-header">
      {/* Main row */}
      <div className="mx-auto flex max-w-[1800px] items-center gap-3 px-4 py-3 md:gap-6 md:px-6 md:py-4">
        <button
          className="rounded-lg p-2 text-white md:hidden"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Abrir menú"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        <Link href="/" className="shrink-0 leading-none">
          <span className="font-display text-xl font-bold tracking-tight text-white">
            G<span className="text-accent">PACKING</span>
          </span>
        </Link>

        {/* Search — protagonist */}
        <div ref={searchRef} className="relative flex-1">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setHighlighted(0);
              }}
              onFocus={() => setSearchFocused(true)}
              onKeyDown={handleSearchKeyDown}
              type="text"
              placeholder="Buscar productos, categorías..."
              className={cn(
                "h-11 w-full rounded-lg border border-white/15 bg-surface pl-4 pr-12 text-sm text-ink placeholder:text-muted",
                "transition-colors focus:border-accent focus:outline-none",
                "md:h-12"
              )}
            />
            <button
              type="submit"
              aria-label="Buscar"
              className="absolute right-1.5 top-1/2 flex h-8 w-9 -translate-y-1/2 items-center justify-center rounded-md gradient-brand text-white hover:brightness-110"
            >
              <Search size={16} />
            </button>
          </form>

          {searchFocused && query.trim() && (
            <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-2xl border border-line bg-surface shadow-xl">
              {matches.length === 0 ? (
                <p className="px-4 py-6 text-center text-sm text-ink-soft">
                  No encontramos productos para &quot;{query}&quot;.
                </p>
              ) : (
                <>
                  <ul className="max-h-96 overflow-y-auto py-1">
                    {matches.map((p, i) => {
                      const category = categories.find((c) => c.slug === p.categorySlug);
                      return (
                        <li key={p.id}>
                          <button
                            onClick={() => goToProduct(p.slug)}
                            onMouseEnter={() => setHighlighted(i)}
                            className={cn(
                              "flex w-full items-center gap-3 px-4 py-2.5 text-left",
                              highlighted === i ? "bg-paper" : "bg-surface"
                            )}
                          >
                            <ProductThumb
                              name={p.name}
                              categorySlug={p.categorySlug}
                              className="h-10 w-10 shrink-0 rounded-lg"
                              iconClassName="h-1/2 w-1/2"
                            />
                            <span className="min-w-0 flex-1">
                              <span className="block truncate text-sm font-medium text-ink">{p.name}</span>
                              <span className="block text-xs text-muted">{category?.name}</span>
                            </span>
                            <span className="tabular shrink-0 text-sm font-semibold text-brand-strong">
                              {formatUYU(p.price)}
                            </span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                  <button
                    onClick={handleViewAllResults}
                    className="block w-full border-t border-line px-4 py-2.5 text-left text-sm font-medium text-brand hover:bg-paper"
                  >
                    Ver todos los resultados para &quot;{query}&quot;
                  </button>
                </>
              )}
            </div>
          )}

          {searchFocused && !query.trim() && (
            <div className="absolute left-0 right-0 top-full z-50 mt-2 rounded-2xl border border-line bg-surface p-3 shadow-xl">
              <p className="mb-2 px-2 text-xs font-medium uppercase tracking-wide text-muted">
                Categorías populares
              </p>
              <div className="flex flex-wrap gap-2">
                {categories
                  .filter((c) => c.slug !== "packaging-personalizado")
                  .slice(0, 8)
                  .map((c) => (
                    <button
                      key={c.slug}
                      onClick={() => handleCategoryPick(c.slug)}
                      className="rounded-full border border-line px-3 py-1.5 text-sm text-ink-soft hover:border-brand hover:text-brand"
                    >
                      {c.name}
                    </button>
                  ))}
              </div>
            </div>
          )}
        </div>

        {/* Desktop nav actions */}
        <nav className="hidden items-center gap-1 lg:flex">
          <Link
            href="/personalizado"
            className="rounded-full px-3 py-2 text-sm font-medium text-white/80 hover:text-white"
          >
            Personalizado
          </Link>
          <Link
            href="/contacto"
            className="rounded-full px-3 py-2 text-sm font-medium text-white/80 hover:text-white"
          >
            Contacto
          </Link>
        </nav>

        <ThemeToggle />

        <Link
          href="/login"
          className="hidden shrink-0 items-center gap-2 text-sm text-white/90 hover:text-white sm:flex"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </span>
          <span className="leading-tight">
            <span className="block text-xs text-white/50">Mi cuenta</span>
            <span className="block font-medium">Iniciar sesión</span>
          </span>
        </Link>

        <button
          onClick={openCart}
          className="relative flex shrink-0 items-center gap-2 rounded-lg px-2 py-1.5 text-white hover:bg-white/5"
          aria-label="Abrir carrito"
        >
          <span className="relative flex h-9 w-9 items-center justify-center rounded-full bg-white/10">
            <ShoppingCart size={17} />
            {totalItems > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] font-semibold text-white">
                {totalItems}
              </span>
            )}
          </span>
          <span className="hidden text-left leading-tight sm:block">
            <span className="block text-xs text-white/50">Carrito</span>
            <span className="tabular block font-semibold">
              {new Intl.NumberFormat("es-UY", { style: "currency", currency: "UYU" }).format(totalAmount)}
            </span>
          </span>
        </button>
      </div>

      {/* Utility strip */}
      <div className="hidden border-t border-white/10 bg-header lg:block">
        <div className="mx-auto flex max-w-[1800px] divide-x divide-white/10 px-6">
          {utilityItems.map((item) => (
            <div
              key={item.title}
              className="flex flex-1 items-center justify-center gap-2.5 py-2.5 text-white/85"
            >
              <item.icon size={17} className="shrink-0 text-accent" />
              <span className="text-xs">
                <span className="block font-medium leading-tight">{item.title}</span>
                <span className="block text-white/50 leading-tight">{item.subtitle}</span>
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-white/10 bg-header px-4 py-3 lg:hidden">
          <nav className="flex flex-col gap-1">
            {categories.map((c) => (
              <Link
                key={c.slug}
                href={c.slug === "packaging-personalizado" ? "/personalizado" : `/catalogo?categoria=${c.slug}`}
                onClick={() => setMobileOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm text-white/80 hover:bg-white/5"
              >
                {c.name}
              </Link>
            ))}
            <div className="my-2 h-px bg-white/10" />
            <Link href="/contacto" onClick={() => setMobileOpen(false)} className="rounded-lg px-3 py-2.5 text-sm text-white/80 hover:bg-white/5">
              Contacto
            </Link>
            <Link href="/login" onClick={() => setMobileOpen(false)} className="rounded-lg px-3 py-2.5 text-sm text-white/80 hover:bg-white/5">
              Ingresar
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
