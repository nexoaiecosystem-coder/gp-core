"use client";

import { useState } from "react";
import Link from "next/link";
import { Input, Label } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export default function RecuperarPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSent(true);
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-6 py-16">
      <h1 className="font-display text-2xl font-bold text-ink">Recuperar contraseña</h1>
      <p className="mt-1 text-sm text-ink-soft">
        Ingresá tu email y te enviamos un link para restablecerla.
      </p>

      {sent ? (
        <div className="mt-8 rounded-2xl border border-line bg-surface p-6 text-center">
          <p className="text-sm font-medium text-ink">Listo, revisá tu correo.</p>
          <p className="mt-1 text-sm text-ink-soft">Te enviamos un enlace para crear una nueva contraseña.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <Button type="submit" size="lg" className="w-full">Enviar enlace</Button>
        </form>
      )}

      <p className="mt-6 text-center text-sm text-ink-soft">
        <Link href="/login" className="font-medium text-brand hover:underline">
          Volver a ingresar
        </Link>
      </p>
    </div>
  );
}
