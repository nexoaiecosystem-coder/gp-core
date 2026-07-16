import { Suspense } from "react";
import { CatalogClient } from "./CatalogClient";

export const metadata = {
  title: "Catálogo | G Packing",
};

export default function CatalogoPage() {
  return (
    <Suspense fallback={null}>
      <CatalogClient />
    </Suspense>
  );
}
