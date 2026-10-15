"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Check,
  Clock,
  CreditCard,
  FileText,
  Link2,
  MapPin,
  Printer,
  Search,
  Share2,
  Truck,
  X,
} from "lucide-react";
import { categories, customizableProducts, products } from "@/lib/data";
import { BUSINESS, CONTACT, PRICE_NOTE, PRICE_NOTE_SHORT } from "@/lib/constants";
import { ProductThumb } from "@/components/product/ProductThumb";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { InstagramIcon, WhatsAppIcon } from "@/components/layout/FloatingActions";
import { cn, formatUYU } from "@/lib/utils";
import type { Product } from "@/lib/types";

const CUSTOM_SECTION_ID = "personalizado";

/** Lowercase + strip accents so "papel higienico" matches "Papel higiénico". */
function normalize(text: string) {
  return text.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}

function whatsappLink(message: string) {
  return `https://wa.me/${CONTACT.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

function productMessage(p: Product) {
  return `Hola G Packing! Quiero consultar por: ${p.name} (${p.unit}) — código ${p.sku}`;
}

/** Share via the native sheet (mobile) or copy the link (desktop). Returns true if copied. */
async function shareOrCopy(url: string, title: string) {
  if (navigator.share) {
    try {
      await navigator.share({ title, url });
      return false;
    } catch {
      // user cancelled the share sheet — fall through to copying
    }
  }
  try {
    await navigator.clipboard.writeText(url);
    return true;
  } catch {
    return false;
  }
}

// Categories that actually have products, in the catalog's order
const sections = categories
  .map((c) => ({ ...c, items: products.filter((p) => p.categorySlug === c.slug) }))
  .filter((c) => c.items.length > 0);

export function CatalogoDigital() {
  const [query, setQuery] = useState("");
  const [activeId, setActiveId] = useState(sections[0]?.slug ?? "");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const q = normalize(query.trim());
  const visibleSections = useMemo(() => {
    if (!q) return sections;
    return sections
      .map((s) => ({
        ...s,
        items: s.items.filter((p) =>
          normalize(`${p.name} ${p.unit} ${p.sku} ${s.name} ${p.tags.join(" ")}`).includes(q)
        ),
      }))
      .filter((s) => s.items.length > 0);
  }, [q]);
  const resultCount = visibleSections.reduce((n, s) => n + s.items.length, 0);

  // Highlight the category chip of the section currently on screen
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>("[data-catalog-section]");
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-140px 0px -65% 0px" }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [visibleSections]);

  // Keep the active chip visible in the horizontal chip bar
  useEffect(() => {
    document
      .getElementById(`chip-${activeId}`)
      ?.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });
  }, [activeId]);

  async function handleShare(hash: string, title: string) {
    const url = `${window.location.origin}${window.location.pathname}${hash}`;
    const copied = await shareOrCopy(url, title);
    if (copied) {
      const key = hash || "page";
      setCopiedKey(key);
      setTimeout(() => setCopiedKey((k) => (k === key ? null : k)), 2000);
    }
  }

  return (
    <div className="flex min-h-full flex-col">
      {/* ── Portada ─────────────────────────────────────────────── */}
      <header className="gradient-hero text-white print:bg-none print:text-ink">
        <div className="mx-auto max-w-6xl px-4 pb-10 pt-5 md:pb-14">
          <div className="flex items-center gap-2">
            <span className="font-display text-xl font-bold tracking-tight">
              G<span className="text-accent print:text-brand">PACKING</span>
            </span>
            <div className="flex-1" />
            <div className="flex items-center gap-2 print:hidden">
              <button
                onClick={() => window.print()}
                className="hidden h-9 items-center gap-1.5 rounded-full bg-white/10 px-3.5 text-sm font-medium transition-colors hover:bg-white/15 sm:flex"
              >
                <Printer size={15} /> Imprimir / PDF
              </button>
              <button
                onClick={() => handleShare("", "Catálogo G Packing")}
                className="flex h-9 items-center gap-1.5 rounded-full bg-white px-3.5 text-sm font-semibold text-[#082a17] transition-colors hover:bg-white/90"
              >
                {copiedKey === "page" ? <Check size={15} /> : <Share2 size={15} />}
                {copiedKey === "page" ? "¡Link copiado!" : "Compartir"}
              </button>
              <ThemeToggle />
            </div>
          </div>

          <div className="mt-10 max-w-2xl md:mt-14">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/60 print:text-muted">
              Catálogo mayorista 2026
            </p>
            <h1 className="mt-3 font-display text-3xl font-bold leading-tight md:text-5xl">
              Packaging e insumos para tu negocio
            </h1>
            <p className="mt-4 text-base text-white/75 md:text-lg print:text-ink-soft">
              {products.length} productos en {sections.length} categorías: descartables, packaging,
              limpieza e higiene. Precios en pesos uruguayos, {PRICE_NOTE}.
            </p>
          </div>

          <div className="mt-7 flex flex-wrap gap-2 text-sm">
            <a
              href={whatsappLink("Hola G Packing! Vi el catálogo y quiero hacer una consulta.")}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-full bg-whatsapp px-4 py-2.5 font-semibold text-[#0b3b1f] shadow-lg transition-transform hover:scale-[1.02]"
            >
              <WhatsAppIcon size={18} /> {CONTACT.whatsappDisplay}
            </a>
            <a
              href={CONTACT.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2.5 font-medium transition-colors hover:bg-white/15"
            >
              <InstagramIcon size={16} /> {CONTACT.instagramHandle}
            </a>
            <span className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2.5 font-medium">
              <MapPin size={16} /> {CONTACT.address}
            </span>
          </div>
        </div>
      </header>

      {/* ── Buscador + categorías (fijo arriba) ─────────────────── */}
      <nav className="sticky top-0 z-20 border-b border-line bg-paper/90 backdrop-blur print:hidden">
        <div className="mx-auto max-w-6xl px-4 pt-3">
          <div className="relative">
            <Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              type="text"
              enterKeyHint="search"
              placeholder="Buscar en el catálogo (ej: vaso, bolsa, guantes)"
              className="h-11 w-full rounded-lg border border-line bg-surface pl-10 pr-10 text-sm text-ink placeholder:text-muted focus:border-accent focus:outline-none"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                aria-label="Borrar búsqueda"
                className="absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-md text-muted hover:text-ink"
              >
                <X size={16} />
              </button>
            )}
          </div>
          <div className="-mx-4 flex gap-2 overflow-x-auto px-4 py-3 [scrollbar-width:none]">
            {visibleSections.map((s) => (
              <a
                key={s.slug}
                id={`chip-${s.slug}`}
                href={`#${s.slug}`}
                className={cn(
                  "shrink-0 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
                  activeId === s.slug
                    ? "border-transparent gradient-brand text-white"
                    : "border-line bg-surface text-ink-soft hover:border-brand hover:text-brand"
                )}
              >
                {s.name}
                <span className="ml-1.5 tabular text-xs opacity-70">{s.items.length}</span>
              </a>
            ))}
            {!q && (
              <a
                id={`chip-${CUSTOM_SECTION_ID}`}
                href={`#${CUSTOM_SECTION_ID}`}
                className={cn(
                  "shrink-0 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
                  activeId === CUSTOM_SECTION_ID
                    ? "border-transparent gradient-brand text-white"
                    : "border-line bg-surface text-ink-soft hover:border-brand hover:text-brand"
                )}
              >
                Personalizado
              </a>
            )}
          </div>
        </div>
      </nav>

      {/* ── Productos por categoría ─────────────────────────────── */}
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
        {q && (
          <p className="mb-6 text-sm text-ink-soft print:hidden">
            {resultCount === 0
              ? `No encontramos productos para “${query.trim()}”.`
              : `${resultCount} ${resultCount === 1 ? "producto" : "productos"} para “${query.trim()}”`}
            {resultCount === 0 && (
              <>
                {" "}
                <a
                  href={whatsappLink(`Hola G Packing! Están vendiendo ${query.trim()}?`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-brand underline underline-offset-2"
                >
                  Preguntanos por WhatsApp
                </a>{" "}
                — trabajamos más productos de los que figuran acá.
              </>
            )}
          </p>
        )}

        <div className="space-y-12">
          {visibleSections.map((s) => (
            <section
              key={s.slug}
              id={s.slug}
              data-catalog-section
              className="scroll-mt-36 print:break-inside-auto"
            >
              <div className="mb-4 flex items-end gap-3 border-b border-line pb-3">
                <div className="min-w-0 flex-1">
                  <h2 className="font-display text-xl font-bold text-ink md:text-2xl">{s.name}</h2>
                  <p className="mt-0.5 text-sm text-muted">{s.description}</p>
                </div>
                <button
                  onClick={() => handleShare(`#${s.slug}`, `${s.name} | Catálogo G Packing`)}
                  className="flex shrink-0 items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-xs font-medium text-ink-soft transition-colors hover:border-brand hover:text-brand print:hidden"
                  aria-label={`Compartir la categoría ${s.name}`}
                >
                  {copiedKey === `#${s.slug}` ? <Check size={14} /> : <Link2 size={14} />}
                  {copiedKey === `#${s.slug}` ? "Copiado" : "Compartir"}
                </button>
              </div>

              <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 print:grid-cols-4 print:gap-2">
                {s.items.map((p) => (
                  <li
                    key={p.id}
                    className="flex flex-col overflow-hidden rounded-xl border border-line bg-surface shadow-[var(--shadow-card)] break-inside-avoid print:shadow-none"
                  >
                    <ProductThumb
                      name={p.name}
                      categorySlug={p.categorySlug}
                      className="aspect-[2/1] w-full print:aspect-[3/1]"
                    />
                    <div className="flex flex-1 flex-col p-3">
                      <h3 className="text-sm font-semibold leading-snug text-ink">{p.name}</h3>
                      <p className="mt-0.5 text-xs text-ink-soft">{p.unit}</p>
                      <p className="mt-0.5 font-mono text-[11px] text-muted">{p.sku}</p>
                      <div className="mt-auto flex items-end justify-between gap-2 pt-3">
                        <div>
                          <p className="tabular font-display text-lg font-bold leading-none text-brand">
                            {formatUYU(p.price)}
                          </p>
                          <p className="mt-1 text-[10px] uppercase tracking-wide text-muted">
                            {PRICE_NOTE_SHORT}
                          </p>
                        </div>
                        <a
                          href={whatsappLink(productMessage(p))}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`Consultar por ${p.name} ${p.unit} en WhatsApp`}
                          title="Consultar por WhatsApp"
                          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-whatsapp text-white transition-transform hover:scale-105 print:hidden"
                        >
                          <WhatsAppIcon size={18} />
                        </a>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          ))}

          {/* ── Packaging personalizado ─────────────────────────── */}
          {!q && (
            <section
              id={CUSTOM_SECTION_ID}
              data-catalog-section
              className="scroll-mt-36 rounded-2xl gradient-cta border border-line p-5 md:p-8 print:break-before-page"
            >
              <div className="flex items-start gap-3">
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
                    Con tu marca
                  </p>
                  <h2 className="mt-1 font-display text-xl font-bold text-ink md:text-2xl">
                    Packaging personalizado
                  </h2>
                  <p className="mt-1 max-w-xl text-sm text-ink-soft">
                    Imprimimos tu logo en bolsas, vasos, cajas y más. Pedinos cotización según
                    cantidad y diseño.
                  </p>
                </div>
              </div>
              <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {customizableProducts.map((c) => (
                  <li
                    key={c.id}
                    className="flex flex-col rounded-xl border border-line bg-surface p-4 break-inside-avoid"
                  >
                    <h3 className="font-semibold text-ink">{c.name}</h3>
                    <p className="mt-1 text-sm text-ink-soft">{c.description}</p>
                    <dl className="mt-3 space-y-1 text-xs text-ink-soft">
                      <div className="flex gap-1">
                        <dt className="font-semibold text-ink">Impresión:</dt>
                        <dd>{c.printColors}</dd>
                      </div>
                      <div className="flex gap-1">
                        <dt className="font-semibold text-ink">Mínimo:</dt>
                        <dd>{c.minQty}</dd>
                      </div>
                    </dl>
                    <a
                      href={whatsappLink(
                        `Hola G Packing! Quiero cotizar ${c.name.toLowerCase()} personalizados con mi marca.`
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 flex items-center justify-center gap-2 rounded-lg gradient-brand px-3 py-2 text-sm font-semibold text-white hover:brightness-110 print:hidden"
                    >
                      <FileText size={15} /> Pedir cotización
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </main>

      {/* ── Condiciones y contacto ──────────────────────────────── */}
      <footer className="border-t border-line bg-surface">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 py-8 text-sm text-ink-soft sm:grid-cols-2 lg:grid-cols-4">
          <p className="flex gap-2.5">
            <Clock size={18} className="shrink-0 text-brand" /> {BUSINESS.hours}
          </p>
          <p className="flex gap-2.5">
            <Truck size={18} className="shrink-0 text-brand" />
            <span>
              {BUSINESS.deliveryZone}
              <br />
              {BUSINESS.deliveryNote}
            </span>
          </p>
          <p className="flex gap-2.5">
            <CreditCard size={18} className="shrink-0 text-brand" />
            <span>
              {BUSINESS.paymentMethods}
              <br />
              {BUSINESS.billing}
            </span>
          </p>
          <p className="flex gap-2.5">
            <WhatsAppIcon size={18} />
            <span>
              Pedidos al {CONTACT.whatsappDisplay}
              <br />
              {CONTACT.email}
            </span>
          </p>
        </div>
        <p className="mx-auto max-w-6xl px-4 pb-24 text-xs text-muted md:pb-8">
          Precios en pesos uruguayos, {PRICE_NOTE}, sujetos a cambio sin previo aviso.
          Las imágenes son ilustrativas. {BUSINESS.minOrder}
        </p>
      </footer>

      {/* WhatsApp flotante */}
      <a
        href={whatsappLink("Hola G Packing! Vi el catálogo y quiero hacer un pedido.")}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Hacer un pedido por WhatsApp"
        className="fixed bottom-5 right-5 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-whatsapp text-white shadow-[var(--shadow-float)] transition-transform hover:scale-105 md:bottom-6 md:right-6 print:hidden"
      >
        <WhatsAppIcon size={28} />
      </a>
    </div>
  );
}
