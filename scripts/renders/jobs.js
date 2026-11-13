// Genera la lista de renders (una por familia) leyendo los datos del catálogo y las reglas de ilustración.
const ts = require('../../node_modules/typescript');
const fs = require('fs');
function load(file) { const src = fs.readFileSync(file, 'utf8'); const js = ts.transpileModule(src, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText; const m = { exports: {} }; new Function('module', 'exports', 'require', js)(m, m.exports, require); return m.exports; }
const { catalogSections } = load('../../src/lib/catalogo-productos.ts');
const { illustrationFor } = load('../../src/app/catalogo-digital/_illustrations.ts');
const jobs = [];
for (const s of catalogSections) { let last = null; for (const it of s.items) { if (last === it.name) continue; last = it.name; const sp = illustrationFor(it.name); jobs.push({ file: it.code, kind: sp.kind, opts: { ...sp, name: it.name } }); } }
fs.writeFileSync(process.argv[2], JSON.stringify(jobs, null, 1)); console.log(jobs.length);
