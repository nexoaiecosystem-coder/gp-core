"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Package } from "lucide-react";

export function Hero() {
  return (
    <section className="gradient-hero relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.07]">
        <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full border-[3px] border-white" />
        <div className="absolute -bottom-32 left-1/3 h-72 w-72 rounded-full border-[3px] border-white" />
      </div>

      <div className="relative mx-auto grid max-w-[1800px] gap-10 px-6 py-16 md:grid-cols-2 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="flex flex-col justify-center"
        >
          <span className="mb-4 inline-flex w-fit items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium text-white/90">
            <Package size={13} /> +500 productos disponibles
          </span>
          <h1 className="font-display text-4xl font-bold leading-[1.1] tracking-tight text-white md:text-5xl">
            Packaging e insumos para tu negocio, en un solo lugar.
          </h1>
          <p className="mt-5 max-w-md text-base text-white/75">
            Cajas, vasos, bolsas, limpieza e higiene para gastronomía, hotelería
            y empresas en todo Uruguay. Pedís online, coordinamos por WhatsApp.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/catalogo"
              className="inline-flex h-12 items-center gap-2 rounded-full bg-white px-6 text-sm font-semibold text-[#082a17] shadow-lg shadow-black/20 transition-transform hover:scale-[1.02]"
            >
              Ver catálogo <ArrowRight size={16} />
            </Link>
            <Link
              href="/personalizado"
              className="inline-flex h-12 items-center gap-2 rounded-full border border-white/30 px-6 text-sm font-medium text-white hover:bg-white/10"
            >
              Packaging personalizado
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.15, ease: "easeOut" }}
          className="relative hidden items-center justify-center md:flex"
        >
          <div className="grid grid-cols-2 gap-4">
            {[
              { n: "500+", l: "Productos" },
              { n: "24-48h", l: "Entrega en Montevideo" },
              { n: "8", l: "Categorías" },
              { n: "100%", l: "Uso profesional" },
            ].map((stat) => (
              <div
                key={stat.l}
                className="flex h-32 w-32 flex-col items-center justify-center rounded-2xl bg-gradient-to-br from-white/[0.18] to-white/[0.04] text-center shadow-lg shadow-black/20 ring-1 ring-white/15 backdrop-blur-sm transition-transform duration-300 hover:scale-[1.04]"
              >
                <span className="font-display text-2xl font-bold text-white tabular">{stat.n}</span>
                <span className="mt-1 px-3 text-xs text-white/70">{stat.l}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
