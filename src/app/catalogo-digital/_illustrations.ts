// Qué ilustración (dibujo base + color) le toca a cada producto, según su nombre.
// Reglas en orden: gana la primera que coincide. Para ajustar un producto puntual,
// agregá una regla más específica arriba.

export type IllustrationKind =
  | "jug" | "bottle" | "trigger" | "aerosol" | "bar" | "bucket" | "wringer" | "bin" | "wheelie"
  | "bagroll" | "trashbag" | "broom" | "squeegee" | "mop" | "dustpan" | "sponge" | "scrubber"
  | "cloth" | "glove" | "rollbox" | "roll" | "tissue" | "jumbo" | "napkins" | "dispenser"
  | "tshirt" | "paperbag" | "tray" | "traylid" | "disc" | "clamshell" | "flatbox" | "box" | "cup"
  | "lid" | "sticks" | "bowl" | "dip" | "paper" | "pad" | "tape" | "pen" | "stapler"
  | "calculator" | "scissors" | "cutter" | "clips" | "device" | "cartridge";

export type IllustrationSpec = { kind: IllustrationKind; color: string; accent?: string; secondary?: string };

const KRAFT = "#c49a64";
const FOAM = "#f1f1ec";
const ALU = "#c7ccd0";
const CLEAR = "#dfe9ee";
const WOOD = "#d9b98a";

type Rule = [RegExp, IllustrationSpec];

const RULES: Rule[] = [
  // Limpieza (líquidos)
  [/limpia horno mr|mr m[uú]sculo/i, { kind: "aerosol", color: "#e8622a", secondary: "#e8622a" }],
  [/limpia horno|alfombras/i, { kind: "aerosol", color: "#f2c230", secondary: "#e58a2b" }],
  [/aromatizante ambiente saphirus/i, { kind: "aerosol", color: "#8d6cc4", secondary: "#c9b6e8" }],
  [/desodorante de ambiente|desinfectante de ambiente/i, { kind: "aerosol", color: "#3e8ed0", secondary: "#9cc6ea" }],
  [/lustramuebles/i, { kind: "trigger", color: "#9a5b2e", accent: "#f4f4f2" }],
  [/limpia vidrio/i, { kind: "trigger", color: "#4fa8e0", accent: "#1f5f9e" }],
  [/con gatillo|saca sarro/i, { kind: "trigger", color: "#78c2a4", accent: "#2f6f55" }],
  [/aromatizante textil/i, { kind: "trigger", color: "#e9a3c3", accent: "#8a3b62" }],
  [/crema multiuso/i, { kind: "bottle", color: "#f0f0ec", accent: "#3e8ed0" }],
  [/lavandina en gel/i, { kind: "bottle", color: "#9fd3e8", accent: "#2b6f9e" }],
  [/fabuloso/i, { kind: "bottle", color: "#b08ad6", accent: "#5a3a8a" }],
  [/soda c[aá]ustica/i, { kind: "bottle", color: "#f4f4f2", accent: "#c0392b" }],
  [/alcohol en gel/i, { kind: "jug", color: "#e4f0f5" }],
  [/alcohol azul/i, { kind: "jug", color: "#3f7ee0" }],
  [/alcohol|vinagre/i, { kind: "jug", color: "#e8f1f4" }],
  [/hipoclorito|amonio/i, { kind: "jug", color: "#f2f0d8" }],
  [/abrillantador|lavavajillas/i, { kind: "jug", color: "#5fb3d9" }],
  [/detergente biodegradable|multiuso eco/i, { kind: "jug", color: "#e8e230" }],
  [/detergente|desengrasante/i, { kind: "jug", color: "#2f8a52" }],
  [/limpiador multiuso pro/i, { kind: "jug", color: "#e2732a" }],
  [/^cera/i, { kind: "jug", color: "#c98a3e" }],
  [/jab[oó]n para manos/i, { kind: "jug", color: "#b9e39a" }],
  [/jab[oó]n para ropa/i, { kind: "jug", color: "#2f5fd1" }],
  [/suavizante/i, { kind: "jug", color: "#a8d4f2" }],
  [/jab[oó]n en barra dove/i, { kind: "bar", color: "#f6f6f4" }],
  [/jab[oó]n en barra/i, { kind: "bar", color: "#f3d27a" }],

  // Residuos
  [/escurridor/i, { kind: "wringer", color: "#8c9399" }],
  [/balde transparente/i, { kind: "bucket", color: CLEAR }],
  [/balde/i, { kind: "bucket", color: "#2f3133" }],
  [/ruedas/i, { kind: "wheelie", color: "#2f5bb5" }],
  [/basurero/i, { kind: "bin", color: "#3a3c3e", secondary: "#55585b" }],
  [/residuo transparente/i, { kind: "trashbag", color: "#e3ecf0" }],
  [/residuo en rollo/i, { kind: "bagroll", color: "#2a2b2d", accent: "#ef6c2f" }],
  [/residuo/i, { kind: "trashbag", color: "#2f3133" }],

  // Elementos de limpieza
  [/escobill[oó]n/i, { kind: "broom", color: "#3a3a3a", secondary: WOOD }],
  [/escoba de exterior/i, { kind: "broom", color: "#2f8a52", secondary: "#c7ccd0" }],
  [/escoba/i, { kind: "broom", color: "#d64545", secondary: "#c7ccd0" }],
  [/lampazo para vidrio/i, { kind: "squeegee", color: "#3e8ed0", secondary: "#c7ccd0" }],
  [/lampazo/i, { kind: "squeegee", color: "#2f3133", secondary: "#c7ccd0" }],
  [/pala/i, { kind: "dustpan", color: "#3fa7c9" }],
  [/mopa|ballerina/i, { kind: "mop", color: "#f2efe6", secondary: "#c7ccd0" }],
  [/esponja de fibra/i, { kind: "sponge", color: "#f2d24b", accent: "#2f7a45" }],
  [/esponja de bronce/i, { kind: "scrubber", color: "#c9973e" }],
  [/esponja/i, { kind: "scrubber", color: "#b9bfc3" }],
  [/rollo fibra verde/i, { kind: "roll", color: "#2f7a45" }],
  [/franela/i, { kind: "cloth", color: "#f08a2a", accent: "#ffffff" }],
  [/microfibra para vidrio/i, { kind: "cloth", color: "#5aa9e6", accent: "#ffffff" }],
  [/microfibra/i, { kind: "cloth", color: "#f2c230", accent: "#ffffff" }],
  [/pa[nñ]o de piso/i, { kind: "cloth", color: "#d8d4c8", accent: "#2f5bb5" }],
  [/rejilla/i, { kind: "cloth", color: "#f4f4f2", accent: "#d64545" }],

  // Guantes
  [/guantes de nitrilo/i, { kind: "glove", color: "#4a78d1" }],
  [/guantes de l[aá]tex/i, { kind: "glove", color: "#f1e3c8" }],
  [/guantes de nylon/i, { kind: "glove", color: "#f4f4f2" }],
  [/guantes/i, { kind: "glove", color: "#e94b4b" }],

  // Rollos para alimentos
  [/aluminio pop-up|hojas de aluminio/i, { kind: "box", color: "#2b4c9a", accent: ALU }],
  [/rollo de aluminio/i, { kind: "rollbox", color: "#f4f4f2", accent: "#2f8a52" }],
  [/rollo de film/i, { kind: "rollbox", color: "#f4f4f2", accent: "#3e8ed0" }],
  [/papel manteca/i, { kind: "rollbox", color: "#f4f4f2", accent: KRAFT }],
  [/duofresh|acoplado/i, { kind: "flatbox", color: "#efe9d6", accent: "#ef8a2a" }],

  // Papel e higiene
  [/papel higi[eé]nico hogar/i, { kind: "tissue", color: "#ffffff" }],
  [/papel higi[eé]nico/i, { kind: "jumbo", color: "#f6f6f2" }],
  [/toalla de cocina eco|bobina/i, { kind: "jumbo", color: "#f6f6f2" }],
  [/toalla de cocina/i, { kind: "tissue", color: "#ffffff" }],
  [/dispensador/i, { kind: "dispenser", color: "#f4f4f2", accent: "#4f9a5e" }],
  [/servilleta|toalla|maxwipe/i, { kind: "napkins", color: "#ffffff", accent: "#3e8ed0" }],

  // Bolsas
  [/camiseta/i, { kind: "tshirt", color: "#e8f0f3" }],
  [/delivery de papel|baguette|bizcochos|empanadas/i, { kind: "paperbag", color: KRAFT }],
  [/unisol|bolsa en rollo|rollo separador/i, { kind: "bagroll", color: "#f2f4f5", accent: "#3a9a52" }],
  [/bolsa transparente/i, { kind: "trashbag", color: "#e6eef2" }],

  // Bandejas y contenedores
  [/bandeja de aluminio/i, { kind: "traylid", color: ALU, accent: "#f4f4f2" }],
  [/tapa para bandeja/i, { kind: "lid", color: CLEAR }],
  [/bandeja pl[aá]stica con tapa|tortera|tupper/i, { kind: "traylid", color: "#e9eef0", accent: CLEAR }],
  [/bandeja pl[aá]stica/i, { kind: "tray", color: "#e9eef0" }],
  [/bandeja de cart[oó]n|fuente/i, { kind: "tray", color: KRAFT }],
  [/bandeja de espuma/i, { kind: "tray", color: FOAM }],
  [/disco de espuma/i, { kind: "disc", color: FOAM }],
  [/bisagra/i, { kind: "clamshell", color: FOAM }],

  // Cajas
  [/caja pizza .*blanca/i, { kind: "flatbox", color: "#f3f3ef", accent: "#c0392b" }],
  [/caja pizza|caja chivito/i, { kind: "flatbox", color: KRAFT, accent: "#7a5530" }],
  [/caja torta|caja para masas/i, { kind: "box", color: "#f3f3ef", accent: "#e5b3c6" }],
  [/casquete/i, { kind: "dip", color: "#f3f3ef", accent: "#f3f3ef" }],

  // Vasos
  [/tapa domo|tapa cruz|tapa para vaso|tapa biopoly|tapa para vasos/i, { kind: "lid", color: "#f4f4f2" }],
  [/vaso pet|vaso biodegradable/i, { kind: "cup", color: CLEAR, accent: CLEAR }],
  [/vaso de espuma/i, { kind: "cup", color: FOAM, accent: FOAM }],
  [/corrugado/i, { kind: "cup", color: "#2f3133", accent: "#45484b" }],
  [/doble pared|polipapel|vasos impresos/i, { kind: "cup", color: "#e9dcc4", accent: "#2f8a52" }],
  [/faja/i, { kind: "cup", color: "#f4f4f2", accent: KRAFT }],
  [/portavasos/i, { kind: "tray", color: "#cdb68f" }],
  [/separador para cereales/i, { kind: "dip", color: CLEAR, accent: CLEAR }],
  [/sorbitos/i, { kind: "sticks", color: "#f0e6d0", accent: "#2f8a52" }],
  [/brochette|sushi/i, { kind: "sticks", color: WOOD, accent: "#b5864d" }],

  // Bowls y dips
  [/tapa para bowl/i, { kind: "lid", color: "#efe9da" }],
  [/bowl de bagazo|caja natural|porta frita/i, { kind: "bowl", color: "#efe9da", accent: "#efe9da" }],
  [/bowl|bamboo|sopa|pote ensalada/i, { kind: "bowl", color: KRAFT, accent: CLEAR }],
  [/dip negro/i, { kind: "dip", color: "#2f3133", accent: CLEAR }],
  [/dip|kit pote/i, { kind: "dip", color: CLEAR, accent: CLEAR }],

  // Papelería
  [/hojas a4/i, { kind: "paper", color: "#fbfbf8", accent: "#2f8a52" }],
  [/notas adhesivas neón/i, { kind: "pad", color: "#ff5fa2" }],
  [/block|talonario|libreta|sobre/i, { kind: "pad", color: "#3e8ed0" }],
  [/notas adhesivas/i, { kind: "pad", color: "#f2e24b" }],
  [/porta cinta/i, { kind: "stapler", color: "#2f3133" }],
  [/cinta pato/i, { kind: "tape", color: "#9aa0a6" }],
  [/cinta de papel|enmascarar/i, { kind: "tape", color: "#efe3c4" }],
  [/cinta/i, { kind: "tape", color: "#e9e2c8" }],
  [/engrampadora/i, { kind: "stapler", color: "#2f3133" }],
  [/grapas/i, { kind: "box", color: "#f4f4f2", accent: "#2b3d6b" }],
  [/clips|gomitas/i, { kind: "clips", color: "#9aa0a6" }],
  [/resaltador/i, { kind: "pen", color: "#f2e24b" }],
  [/lapicera|marcador/i, { kind: "pen", color: "#2f5bb5" }],
  [/tijera/i, { kind: "scissors", color: "#d64545" }],
  [/trincheta/i, { kind: "cutter", color: "#f2c230" }],
  [/calculadora/i, { kind: "calculator", color: "#e4e4df" }],
  [/etiquetadora/i, { kind: "device", color: "#e04a3a" }],
  [/rollo pos|rollo comanda|rollo para balanza/i, { kind: "tape", color: "#fbfbf8" }],
  [/t[oó]ner|tinta|cartucho/i, { kind: "cartridge", color: "#f4f4f2", accent: "#8db33a" }],
];

const FALLBACK: IllustrationSpec = { kind: "box", color: KRAFT, accent: "#7a5530" };

export function illustrationFor(name: string): IllustrationSpec {
  return RULES.find(([re]) => re.test(name))?.[1] ?? FALLBACK;
}

/** Para revisar qué productos caen en la ilustración genérica. */
export function usesFallback(name: string) {
  return !RULES.some(([re]) => re.test(name));
}
