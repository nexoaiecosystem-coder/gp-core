import type { Metadata } from "next";
import { CatalogoDigital } from "./CatalogoDigital";

export const metadata: Metadata = {
  title: "Catálogo Mayorista 2026 | G Packing",
  description:
    "Catálogo y lista de precios de G Packing: packaging, descartables, limpieza e higiene para tu negocio. Consultas y pedidos por WhatsApp.",
  openGraph: {
    title: "Catálogo Mayorista 2026 | G Packing",
    description: "Packaging, descartables, limpieza e higiene. Precios mayoristas y pedidos por WhatsApp.",
    type: "website",
    locale: "es_UY",
  },
};

export default function CatalogoDigitalPage() {
  return <CatalogoDigital />;
}
