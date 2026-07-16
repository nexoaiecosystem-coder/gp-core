"use client";

import { useState } from "react";
import Link from "next/link";
import { Input, Label } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export default function RegistroPage() {
  const [form, setForm] = useState({ nombre: "", empresa: "", email: "", telefono: "", password: "" });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // V1: sin conexión real a Supabase Auth todavía. Placeholder de flujo.
    alert("Registro simulado — todavía no conectado a Supabase Auth.");
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-6 py-16">
      <h1 className="font-display text-2xl font-bold text-ink">Creá tu cuenta</h1>
      <p className="mt-1 text-sm text-ink-soft">Registrate para agilizar tus próximos pedidos.</p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
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
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </div>
        <div>
          <Label htmlFor="telefono">Teléfono</Label>
          <Input id="telefono" required value={form.telefono} onChange={(e) => setForm({ ...form, telefono: e.target.value })} />
        </div>
        <div>
          <Label htmlFor="password">Contraseña</Label>
          <Input id="password" type="password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        </div>
        <Button type="submit" size="lg" className="w-full">Crear cuenta</Button>
      </form>

      <p className="mt-6 text-center text-sm text-ink-soft">
        ¿Ya tenés cuenta?{" "}
        <Link href="/login" className="font-medium text-brand hover:underline">
          Ingresá
        </Link>
      </p>
    </div>
  );
}
