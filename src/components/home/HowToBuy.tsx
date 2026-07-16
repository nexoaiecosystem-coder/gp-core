import { Search, ShoppingCart, MessageCircle } from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "1 · Elegí tus productos",
    description: "Buscá en el catálogo y agregá lo que necesites al pedido, con la cantidad de cada uno.",
  },
  {
    icon: ShoppingCart,
    title: "2 · Completá tu pedido",
    description: "Revisá el total estimado y dejanos tus datos de contacto y empresa.",
  },
  {
    icon: MessageCircle,
    title: "3 · Confirmás por WhatsApp",
    description: "El pedido se envía por WhatsApp y coordinamos pago y entrega directo con vos.",
  },
];

export function HowToBuy() {
  return (
    <section className="border-y border-line bg-paper">
      <div className="mx-auto max-w-[1800px] px-6 py-14">
        <div className="mb-8 text-center">
          <h2 className="font-display text-2xl font-bold text-ink">Comprar es simple</h2>
          <p className="mt-1 text-sm text-ink-soft">Tu pedido mayorista en 3 pasos, sin vueltas.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {steps.map((step) => (
            <div
              key={step.title}
              className="card-elevated flex flex-col items-center gap-3 rounded-2xl border border-line gradient-surface p-6 text-center"
            >
              <span className="gradient-chip flex h-12 w-12 items-center justify-center rounded-full text-white shadow-md shadow-brand/25">
                <step.icon size={22} />
              </span>
              <p className="text-sm font-semibold text-ink">{step.title}</p>
              <p className="text-sm text-ink-soft">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
