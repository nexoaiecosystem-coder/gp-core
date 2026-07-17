import Link from "next/link";
import { FileText, CreditCard, Clock, Truck } from "lucide-react";
import { categories } from "@/lib/data";
import { CONTACT, BUSINESS } from "@/lib/constants";

const trustItems = [
  { icon: FileText, title: "Facturación a empresas", detail: BUSINESS.billing },
  { icon: CreditCard, title: "Formas de pago", detail: BUSINESS.paymentMethods },
  { icon: Clock, title: "Horario de atención", detail: BUSINESS.hours },
  { icon: Truck, title: "Entregas", detail: `${BUSINESS.deliveryZone} · ${BUSINESS.deliveryNote}` },
];

export function Footer() {
  return (
    <footer className="border-t border-line bg-surface">
      {/* Trust band: operational facts a B2B buyer wants confirmed */}
      <div className="border-b border-line bg-paper">
        <div className="mx-auto grid max-w-[1800px] gap-4 px-6 py-6 sm:grid-cols-2 lg:grid-cols-4">
          {trustItems.map((item) => (
            <div key={item.title} className="flex items-start gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-soft text-brand-strong">
                <item.icon size={17} />
              </span>
              <span>
                <span className="block text-sm font-semibold text-ink">{item.title}</span>
                <span className="block text-xs text-ink-soft">{item.detail}</span>
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto grid max-w-[1800px] gap-10 px-6 py-12 md:grid-cols-4">
        <div>
          <p className="font-display text-lg font-bold text-brand-strong">
            G<span className="text-accent">Packing</span>
          </p>
          <p className="mt-3 max-w-xs text-sm text-ink-soft">
            Packaging, limpieza e higiene para empresas y gastronomía en Uruguay.
            Más de 500 productos, pedidos por WhatsApp.
          </p>
        </div>

        <div>
          <p className="mb-3 text-sm font-semibold text-ink">Categorías</p>
          <ul className="space-y-2">
            {categories.slice(0, 5).map((c) => (
              <li key={c.slug}>
                <Link href={`/catalogo?categoria=${c.slug}`} className="text-sm text-ink-soft hover:text-brand">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="mb-3 text-sm font-semibold text-ink">Empresa</p>
          <ul className="space-y-2">
            <li><Link href="/catalogo" className="text-sm text-ink-soft hover:text-brand">Catálogo completo</Link></li>
            <li><Link href="/personalizado" className="text-sm text-ink-soft hover:text-brand">Packaging personalizado</Link></li>
            <li><Link href="/contacto" className="text-sm text-ink-soft hover:text-brand">Contacto</Link></li>
          </ul>
        </div>

        <div>
          <p className="mb-3 text-sm font-semibold text-ink">Contacto</p>
          <ul className="space-y-2 text-sm text-ink-soft">
            <li>{CONTACT.address}</li>
            <li>
              <a href={`https://wa.me/${CONTACT.whatsappNumber}`} target="_blank" rel="noopener noreferrer" className="hover:text-whatsapp">
                WhatsApp: {CONTACT.whatsappDisplay}
              </a>
            </li>
            <li>
              <a href={CONTACT.instagramUrl} target="_blank" rel="noopener noreferrer" className="hover:text-brand">
                {CONTACT.instagramHandle}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="mx-auto flex max-w-[1800px] flex-col items-center justify-between gap-2 px-6 py-5 text-xs text-muted md:flex-row">
          <p>© {new Date().getFullYear()} G Packing. Todos los derechos reservados.</p>
          <div className="flex items-center gap-4">
            <Link href="/admin" className="hover:text-brand">
              Panel administrador
            </Link>
            <p>
              Desarrollado por{" "}
              <span className="font-medium text-ink-soft">Victory &amp; Solutions</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
