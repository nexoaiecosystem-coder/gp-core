import { Truck, ShieldCheck, MessageCircle, Boxes } from "lucide-react";
import { BUSINESS } from "@/lib/constants";

const benefits = [
  {
    icon: Truck,
    title: "Entrega en 24-48hs",
    description: `Coordinamos envío o retiro en ${BUSINESS.deliveryZone}. ${BUSINESS.deliveryNote}.`,
  },
  {
    icon: Boxes,
    title: "Stock permanente",
    description: "Más de 500 productos disponibles para reposición constante.",
  },
  {
    icon: MessageCircle,
    title: "Pedido simple",
    description: "Armás tu pedido online y lo confirmás directo por WhatsApp.",
  },
  {
    icon: ShieldCheck,
    title: "Calidad profesional",
    description: "Productos pensados para uso comercial e industrial real.",
  },
];

export function Benefits() {
  return (
    <section className="mx-auto max-w-[1800px] px-6 py-14">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {benefits.map((b) => (
          <div key={b.title} className="card-elevated flex flex-col gap-3 rounded-2xl border border-line gradient-surface p-5">
            <div className="gradient-chip flex h-10 w-10 items-center justify-center rounded-xl text-white shadow-sm shadow-brand/25">
              <b.icon size={19} />
            </div>
            <p className="text-sm font-semibold text-ink">{b.title}</p>
            <p className="text-sm text-ink-soft">{b.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
