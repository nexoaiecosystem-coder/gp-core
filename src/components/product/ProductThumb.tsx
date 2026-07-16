import { getProductIcon, getCategoryTint } from "@/lib/productIcons";
import { cn } from "@/lib/utils";

type Props = {
  name: string;
  categorySlug: string;
  className?: string;
  iconClassName?: string;
};

// V1: mientras no tengamos fotos reales de cada producto, mostramos una
// tarjeta con un ícono relacionado al producto (detectado por su nombre) en
// vez de una foto random de picsum.photos. Es deliberadamente "no-foto" para
// que quede claro que es un placeholder, no el producto real.
export function ProductThumb({ name, categorySlug, className, iconClassName }: Props) {
  const Icon = getProductIcon(name, categorySlug);
  const tint = getCategoryTint(categorySlug);

  return (
    <div className={cn("flex items-center justify-center", tint, className)}>
      {/* eslint-disable-next-line react-hooks/static-components -- Icon references an existing imported icon component, not a newly defined one; selecting which to render is safe */}
      <Icon className={cn("h-1/3 w-1/3 opacity-80", iconClassName)} strokeWidth={1.5} />
    </div>
  );
}
