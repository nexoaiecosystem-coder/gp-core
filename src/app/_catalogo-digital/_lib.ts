import fs from "node:fs";
import path from "node:path";
import { catalogSections } from "@/lib/catalogo-productos";

// Fotos del catálogo: public/fotos/<CÓDIGO>.webp (o .jpg / .png), ej. BOL-012.webp.
// Se detectan al compilar. La foto de una familia es la de su primer código que tenga foto.
const PHOTO_DIR = path.join(process.cwd(), "public", "fotos");
const PHOTO_EXTENSIONS = ["webp", "png", "jpg", "jpeg"];

export type FamilyRow = { code: string; detail: string };

/** Un producto con todas sus variantes (filas consecutivas con el mismo nombre). */
export type Family = {
  id: string;
  name: string;
  sectionSlug: string;
  photo: string | null;
  rows: FamilyRow[];
};

export type Section = { slug: string; name: string; prefix: string; families: Family[]; count: number };

function findPhoto(code: string) {
  for (const ext of PHOTO_EXTENSIONS) {
    if (fs.existsSync(path.join(PHOTO_DIR, `${code}.${ext}`))) {
      return `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/fotos/${code}.${ext}`;
    }
  }
  return null;
}

export function getCatalog(): Section[] {
  return catalogSections.map((s) => {
    const families: Family[] = [];
    for (const item of s.items) {
      const last = families[families.length - 1];
      const row = { code: item.code, detail: item.detail };
      if (last && last.name === item.name) {
        last.rows.push(row);
        last.photo ??= findPhoto(item.code);
      } else {
        families.push({
          id: item.code,
          name: item.name,
          sectionSlug: s.slug,
          photo: findPhoto(item.code),
          rows: [row],
        });
      }
    }
    return { slug: s.slug, name: s.name, prefix: s.prefix, families, count: s.items.length };
  });
}
