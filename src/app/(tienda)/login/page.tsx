"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Input, Label } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { isAdminCredentials, setAdminSession } from "@/lib/adminAuth";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Si son las credenciales del administrador, entra a su panel.
    if (isAdminCredentials(form.email, form.password)) {
      setAdminSession();
      router.push("/admin");
      return;
    }
    // V1: cuenta de cliente todavía sin conexión real a Supabase Auth.
    alert("Login simulado — todavía no conectado a Supabase Auth.");
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-6 py-16">
      <h1 className="font-display text-2xl font-bold text-ink">Ingresá a tu cuenta</h1>
      <p className="mt-1 text-sm text-ink-soft">Accedé para ver tu historial y agilizar tus pedidos.</p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </div>
        <div>
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Contraseña</Label>
            <Link href="/login/recuperar" className="text-xs font-medium text-brand hover:underline">
              ¿Olvidaste tu contraseña?
            </Link>
          </div>
          <Input id="password" type="password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        </div>
        <Button type="submit" size="lg" className="w-full">Ingresar</Button>
      </form>

      <p className="mt-6 text-center text-sm text-ink-soft">
        ¿No tenés cuenta?{" "}
        <Link href="/registro" className="font-medium text-brand hover:underline">
          Registrate
        </Link>
      </p>
    </div>
  );
}
