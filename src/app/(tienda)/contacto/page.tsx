"use client";

import { useState } from "react";
import { MapPin, Phone, Mail, MessageCircle } from "lucide-react";
import { Input, Label, Textarea } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { CONTACT } from "@/lib/constants";

export default function ContactoPage() {
  const [form, setForm] = useState({ nombre: "", empresa: "", telefono: "", email: "", mensaje: "" });
  const [sent, setSent] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSent(true);
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <h1 className="font-display text-3xl font-bold text-ink">Contacto</h1>
      <p className="mt-2 max-w-lg text-sm text-ink-soft">
        ¿Tenés dudas sobre un producto o querés armar un pedido a medida?
        Escribinos y te respondemos a la brevedad.
      </p>

      <div className="mt-10 grid gap-10 md:grid-cols-[1fr_1.2fr]">
        <div className="space-y-5">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-brand-strong">
              <MapPin size={18} />
            </div>
            <div>
              <p className="text-sm font-semibold text-ink">Dirección</p>
              <p className="text-sm text-ink-soft">{CONTACT.address}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-brand-strong">
              <Phone size={18} />
            </div>
            <div>
              <p className="text-sm font-semibold text-ink">Teléfono</p>
              <p className="text-sm text-ink-soft">{CONTACT.whatsappDisplay}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-brand-strong">
              <Mail size={18} />
            </div>
            <div>
              <p className="text-sm font-semibold text-ink">Email</p>
              <p className="text-sm text-ink-soft">{CONTACT.email}</p>
            </div>
          </div>
          <a
            href={`https://wa.me/${CONTACT.whatsappNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-flex h-11 items-center gap-2 rounded-full bg-whatsapp px-5 text-sm font-medium text-white hover:brightness-95"
          >
            <MessageCircle size={16} /> Escribinos por WhatsApp
          </a>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-line bg-surface p-6">
          {sent ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <p className="text-lg font-semibold text-ink">¡Gracias por escribirnos!</p>
              <p className="mt-1 text-sm text-ink-soft">Te vamos a contactar a la brevedad.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="nombre">Nombre</Label>
                  <Input id="nombre" required value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} />
                </div>
                <div>
                  <Label htmlFor="empresa">Empresa</Label>
                  <Input id="empresa" value={form.empresa} onChange={(e) => setForm({ ...form, empresa: e.target.value })} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="telefono">Teléfono</Label>
                  <Input id="telefono" required value={form.telefono} onChange={(e) => setForm({ ...form, telefono: e.target.value })} />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                </div>
              </div>
              <div>
                <Label htmlFor="mensaje">Mensaje</Label>
                <Textarea id="mensaje" rows={4} required value={form.mensaje} onChange={(e) => setForm({ ...form, mensaje: e.target.value })} />
              </div>
              <Button type="submit" className="w-full" size="lg">Enviar mensaje</Button>
            </>
          )}
        </form>
      </div>
    </div>
  );
}
