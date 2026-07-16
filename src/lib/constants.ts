export const CONTACT = {
  whatsappDisplay: "092 206 960",
  whatsappNumber: "59892206960", // wa.me format: 598 + number without leading 0
  email: "j.pino62@gmail.com",
  instagramHandle: "@gpackingeinsumos",
  instagramUrl: "https://instagram.com/gpackingeinsumos",
  address: "Canelones 1599, Montevideo, Uruguay",
};

// ⚠️ DATOS A CONFIRMAR CON FABIÁN antes de publicar — hoy son valores de ejemplo
// para que la maqueta se vea completa. Cambialos acá y se actualizan en todo el sitio.
export const BUSINESS = {
  hours: "Lun a Vie 9 a 18h · Sáb 9 a 13h",
  deliveryZone: "Montevideo y área metropolitana",
  deliveryNote: "Envíos al interior a coordinar",
  paymentMethods: "Efectivo, transferencia y débito",
  billing: "Facturamos a empresas (RUT)",
  minOrder: "", // ej: "Pedido mínimo $ 2.000" — dejar "" si no aplica
};

// ⚠️ ¿Los precios son con IVA incluido o sin IVA? Cambiá este único valor.
export const PRICE_IVA_INCLUDED = true;
export const PRICE_NOTE = PRICE_IVA_INCLUDED ? "IVA incluido" : "+ IVA";
export const PRICE_NOTE_SHORT = PRICE_IVA_INCLUDED ? "IVA inc." : "+ IVA";
