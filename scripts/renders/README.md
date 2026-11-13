# Renders 3D de los productos del catálogo

Genera `public/fotos/<CÓDIGO>.webp` (una imagen por producto) con modelos 3D de three.js,
vista isométrica desde arriba y de costado, y un contorno sutil para despegar los productos blancos.

1. `cd scripts/renders && npm i three@0.169.0 typescript playwright` (y `pip install pillow`)
2. `node jobs.js jobs.json` — arma la lista a partir de `src/lib/catalogo-productos.ts` y `_illustrations.ts`
3. `mkdir -p png && node run.js jobs.json png` — renderiza (Chromium con WebGL)
4. `python post.py png ../../public/fotos hoja.png` — agrega el contorno y exporta en webp

Para un producto nuevo: agregalo en `catalogo-productos.ts`, revisá que su regla en `_illustrations.ts`
le asigne el modelo correcto (los modelos están en `models.js`) y repetí los pasos.
