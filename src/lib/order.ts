import { CartItem, Product } from "@/lib/types";
import { formatUYU } from "@/lib/utils";
import { CONTACT } from "@/lib/constants";

export type CustomerForm = {
  nombre: string;
  empresa: string;
  telefono: string;
  email: string;
};

export type OrderLine = { item: CartItem; product: Product };

export const emptyCustomer: CustomerForm = {
  nombre: "",
  empresa: "",
  telefono: "",
  email: "",
};

export function isValidPhone(value: string) {
  const digits = value.replace(/[^\d]/g, "");
  // Uruguayan mobile/landline numbers: 8-9 digits is the realistic range,
  // generous enough to also accept a country code prefix (598...).
  return digits.length >= 8 && digits.length <= 12;
}

export function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

/**
 * Builds the wa.me deep link with the full order. Shared by the cart drawer
 * (quick view) and the full checkout page so the message stays identical.
 */
export function buildWhatsappUrl(
  lines: OrderLine[],
  totalAmount: number,
  form: CustomerForm,
  obs: string,
  priceOf: (product: Product) => number
) {
  const header = `Hola G Packing! Quiero hacer un pedido:%0A%0A`;
  const body = lines
    .map(
      ({ item, product }) =>
        `• ${product.name} x${item.quantity} ${product.unit} (${formatUYU(priceOf(product) * item.quantity)})`
    )
    .join("%0A");
  const totals = `%0A%0ATotal estimado: ${formatUYU(totalAmount)}`;
  const contact = `%0A%0ANombre: ${form.nombre}%0AEmpresa: ${form.empresa}%0ATeléfono: ${form.telefono}%0AEmail: ${form.email}`;
  const notes = obs ? `%0AObservaciones: ${obs}` : "";
  const message = encodeURI(header) + body + totals + contact + notes;
  return `https://wa.me/${CONTACT.whatsappNumber}?text=${message}`;
}
