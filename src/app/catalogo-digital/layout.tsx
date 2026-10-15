import Link from "next/link";
import { Clock, CreditCard, MapPin, Truck } from "lucide-react";
import { BUSINESS, CONTACT } from "@/lib/constants";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { InstagramIcon, WhatsAppIcon } from "@/components/layout/FloatingActions";
import { PrintButton, ShareButton } from "./_components/ShareButton";
import { whatsappLink } from "./_components/whatsapp";

// Catálogo para compartir: sin carrito, sin precios, sin el header de la tienda.
export default function CatalogoDigitalLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <header className="sticky top-0 z-20 bg-header text-white print:static print:bg-transparent print:text-ink">
        <div className="mx-auto flex h-14 max-w-6xl items-center gap-2 px-4">
          <Link href="/catalogo-digital" className="shrink-0 leading-none">
            <span className="font-display text-lg font-bold tracking-tight">
              G<span className="text-accent print:text-brand">PACKING</span>
            </span>
            <span className="ml-2 hidden text-xs font-medium text-white/60 sm:inline print:text-muted">
              Catálogo de productos
            </span>
          </Link>
          <div className="flex-1" />
          <PrintButton />
          <ShareButton title="Catálogo G Packing" />
          <ThemeToggle className="print:hidden" />
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-line bg-surface">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 py-8 text-sm text-ink-soft sm:grid-cols-2 lg:grid-cols-4">
          <a
            href={whatsappLink("Hola G Packing! Vi el catálogo y quiero hacer una consulta.")}
            target="_blank"
            rel="noopener noreferrer"
            className="flex gap-2.5 hover:text-brand"
          >
            <span className="shrink-0 text-whatsapp">
              <WhatsAppIcon size={18} />
            </span>
            <span>
              Pedidos al {CONTACT.whatsappDisplay}
              <br />
              {CONTACT.email}
            </span>
          </a>
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
        </div>
        <div className="mx-auto flex max-w-6xl flex-wrap gap-x-6 gap-y-2 px-4 pb-24 text-xs text-muted md:pb-8">
          <span className="flex items-center gap-1.5">
            <MapPin size={14} /> {CONTACT.address}
          </span>
          <a
            href={CONTACT.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 hover:text-brand"
          >
            <InstagramIcon size={13} /> {CONTACT.instagramHandle}
          </a>
          <span>Las imágenes son ilustrativas.</span>
        </div>
      </footer>

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
