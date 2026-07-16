// ⚠️ DATOS DE EJEMPLO — no son pedidos reales. Sirven para mostrar cómo se vería
// la gestión de pedidos en el panel. Cuando conectemos Supabase, esta lista se
// reemplaza por los pedidos reales guardados en la base de datos.

export type OrderStatus = "nuevo" | "preparando" | "entregado";

export type SampleOrder = {
  id: string;
  date: string; // ISO
  customer: string;
  company: string;
  items: number;
  total: number;
  status: OrderStatus;
};

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  nuevo: "Nuevo",
  preparando: "Preparando",
  entregado: "Entregado",
};

export const sampleOrders: SampleOrder[] = [
  { id: "GP-1042", date: "2026-07-07", customer: "Martín Suárez", company: "Pizzería La Leña", items: 8, total: 9840, status: "nuevo" },
  { id: "GP-1041", date: "2026-07-07", customer: "Carla Méndez", company: "Café Aroma", items: 5, total: 4210, status: "nuevo" },
  { id: "GP-1040", date: "2026-07-06", customer: "Diego Fernández", company: "Hotel Rambla", items: 14, total: 18750, status: "preparando" },
  { id: "GP-1039", date: "2026-07-06", customer: "Lucía Barreto", company: "Panadería del Sur", items: 6, total: 5320, status: "preparando" },
  { id: "GP-1038", date: "2026-07-05", customer: "Andrés Rocha", company: "Burger House", items: 11, total: 12600, status: "entregado" },
  { id: "GP-1037", date: "2026-07-04", customer: "Valentina Pérez", company: "Rotisería Doña Ana", items: 4, total: 3180, status: "entregado" },
  { id: "GP-1036", date: "2026-07-03", customer: "Gonzalo Díaz", company: "Almacén El Trigal", items: 9, total: 7450, status: "entregado" },
  { id: "GP-1035", date: "2026-07-02", customer: "Sofía Núñez", company: "Catering Delicias", items: 22, total: 26900, status: "entregado" },
];

export function ordersThisMonth(orders: SampleOrder[] = sampleOrders) {
  const now = new Date();
  return orders.filter((o) => {
    const d = new Date(o.date);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });
}
