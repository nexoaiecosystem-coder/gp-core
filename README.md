# GP Core — V1

Ecommerce B2B de G Packing. V1 navegable con el catálogo real de productos (precios provisorios) según el brief del proyecto.

## Stack

- Next.js 16 (App Router) + TypeScript
- TailwindCSS v4
- Componentes estilo shadcn/ui (escritos a mano, sin CLI)
- lucide-react (íconos), framer-motion (animaciones)
- Datos en `src/lib/data.ts` — 120 productos reales extraídos del catálogo PDF de G Packing (todavía sin Supabase conectado)

## Cómo correrlo en tu compu

```powershell
cd "C:\ruta\donde\lo\pusiste\gp-core"
npm install
npm run dev
```

Abrí [http://localhost:3000](http://localhost:3000).

## Qué incluye esta V1

- **Home, Catálogo, Producto, Carrito, Contacto, Personalizado, Login, Registro** — como en la V1 anterior
- **120 productos reales** en 12 categorías (Limpieza, Higiene Personal y Lavado, Baldes y Residuos, Elementos de Limpieza, Guantes y Accesorios, Papel e Higiene, Bolsas, Bandejas, Cajas, Vasos y Tapas, Bowls y Contenedores, Papelería) + Packaging Personalizado con su propia tabla de productos personalizables
- **Panel de administrador** en `/admin` (contraseña: `gpacking2026`) con editor de precios en `/admin/productos`

## Editor de precios — cómo funciona en esta V1

Es un **placeholder funcional**, no un sistema real todavía:
- Los cambios de precio se guardan en el `localStorage` del navegador que los edita.
- Si vos cambiás un precio en tu compu, **no se va a ver reflejado en la compu de Fabián** — cada navegador tiene su propia copia.
- Sirve para probar el diseño y el flujo de edición. Cuando conectemos Supabase, migramos el editor para que guarde en una base de datos compartida, sin rehacer el diseño.
- La contraseña de admin (`gpacking2026`) está fija en el código, solo para simular el flujo — no es seguridad real. Se reemplaza por Supabase Auth con rol admin.

## Catálogo rediseñado (v3)

- Header negro con franja de beneficios y categorías, buscador protagonista
- Catálogo con sidebar de filtros: categoría, material (Kraft/PET/Aluminio/etc.), características (Ecológico, Apto microondas, Sin polvo...) y rango de precio
- Filas de producto con SKU visible, badges de material/características, selector de cantidad y "Agregar al carrito" — igual que antes, se abre el Drawer lateral al agregar
- Material y características se infirieron automáticamente del nombre del producto — vale la pena que Fabián los revise, puede haber alguno mal etiquetado

## Sobre las fotos del catálogo PDF

Revisamos el PDF a nivel técnico: cada página está exportada como una sola imagen aplanada (típico de diseños hechos en Canva), con las fotos de producto, textos y tabla de precios todos fusionados en un único archivo por página. No hay fotos individuales de cada producto para extraer.

**Solución de V1:** en vez de fotos random de picsum.photos (paisajes, gente, etc. sin relación con el producto), cada producto y categoría ahora muestra una **tarjeta con un ícono relacionado**, detectado automáticamente por su nombre (`src/lib/productIcons.ts`). Por ejemplo: "Alcohol en gel" → ícono de gotas, "Bolsa camiseta negra" → ícono de bolsa, "Vaso plástico 500cc" → ícono de vaso. No son fotos reales, pero al menos son visualmente coherentes con lo que se vende, y no confunden dando a entender que es una foto real del producto. Se reemplaza fácilmente por fotos reales más adelante — solo hay que actualizar el campo `images` de cada producto en `data.ts` y volver a usar `next/image`.

## Qué falta (a propósito, para próximas iteraciones)

- Conectar Supabase (Auth real + base de datos + editor de precios persistente)
- Fotos reales de G Packing por producto (hoy son placeholders de picsum.photos)
- Revisar precios reales, material/características auto-detectados, y copy con Fabián
- Deploy a Vercel

## Notas de datos

Los 120 productos, sus precios y presentaciones vienen del catálogo PDF que mandaste (`Catálogo Mayorista 2026`). Los precios son los que figuran ahí — a confirmar como valores reales o de referencia con Fabián antes de publicar.
