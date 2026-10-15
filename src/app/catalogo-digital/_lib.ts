import fs from "node:fs";
import path from "node:path";
import { categories, products } from "@/lib/data";

// Fotos del catálogo: public/fotos/<CÓDIGO>.webp (o .jpg / .png), ej. CAJ-001.webp.
// Se detectan al compilar: si un producto no tiene foto, se muestra su ícono.
const PHOTO_DIR = path.join(process.cwd(), "public", "fotos");
const PHOTO_EXTENSIONS = ["webp", "png", "jpg", "jpeg"];

export type CatalogItem = {
  id: string;
  sku: string;
  name: string;
  measure: string;
  categorySlug: string;
  photo: string | null;
};

export type CatalogCategory = {
  slug: string;
  name: string;
  description: string;
  items: CatalogItem[];
};

function findPhoto(sku: string) {
  for (const ext of PHOTO_EXTENSIONS) {
    if (fs.existsSync(path.join(PHOTO_DIR, `${sku}.${ext}`))) {
      return `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/fotos/${sku}.${ext}`;
    }
  }
  return null;
}

/** Categorías con productos, en el orden del catálogo (sin precios). */
export function getCatalog(): CatalogCategory[] {
  return categories
    .map((c) => ({
      slug: c.slug,
      name: c.name,
      description: c.description,
      items: products
        .filter((p) => p.categorySlug === c.slug)
        .map((p) => ({
          id: p.id,
          sku: p.sku,
          name: p.name,
          measure: p.unit,
          categorySlug: p.categorySlug,
          photo: findPhoto(p.sku),
        })),
    }))
    .filter((c) => c.items.length > 0);
}

