"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Lock, LogOut, LayoutDashboard, ShoppingBag, Tag } from "lucide-react";
import { Input, Label } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

// V1: gate simple con contraseña fija en el cliente, solo para probar el flujo
// visualmente. NO es seguridad real. Cuando conectemos Supabase Auth, esto se
// reemplaza por una verificación real de sesión + rol admin en el servidor.
const ADMIN_PASSWORD = "gpacking2026";
const SESSION_KEY = "gp-core-admin-session";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/pedidos", label: "Pedidos", icon: ShoppingBag },
  { href: "/admin/productos", label: "Precios", icon: Tag },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [unlocked, setUnlocked] = useState(false);
  const [checked, setChecked] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    const session = window.sessionStorage.getItem(SESSION_KEY);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reading session-only auth flag on mount
    if (session === "true") setUnlocked(true);
    setChecked(true);
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      window.sessionStorage.setItem(SESSION_KEY, "true");
      setUnlocked(true);
      setError(false);
    } else {
      setError(true);
    }
  }

  function handleLogout() {
    window.sessionStorage.removeItem(SESSION_KEY);
    setUnlocked(false);
  }

  if (!checked) return null;

  if (!unlocked) {
    return (
      <div className="mx-auto flex min-h-[70vh] max-w-sm flex-col justify-center px-6">
        <div className="mb-6 flex flex-col items-center text-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-soft text-brand-strong">
            <Lock size={20} />
          </div>
          <h1 className="font-display text-xl font-bold text-ink">Acceso administrador</h1>
          <p className="mt-1 text-sm text-ink-soft">Panel interno de G Packing</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <Label htmlFor="admin-password">Contraseña</Label>
            <Input
              id="admin-password"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(false);
              }}
              autoFocus
            />
            {error && <p className="mt-1.5 text-xs text-danger">Contraseña incorrecta.</p>}
          </div>
          <Button type="submit" className="w-full">Ingresar</Button>
        </form>
        <p className="mt-6 text-center text-xs text-muted">
          Placeholder de V1 — se reemplaza por Supabase Auth con rol admin.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1800px] px-6 py-8">
      <div className="mb-6 flex items-center justify-between border-b border-line pb-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted">Panel admin</p>
          <h1 className="font-display text-2xl font-bold text-ink">G Packing</h1>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/" className="text-sm text-ink-soft hover:text-brand">
            Volver al sitio
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-sm text-ink-soft hover:border-danger hover:text-danger"
          >
            <LogOut size={14} /> Salir
          </button>
        </div>
      </div>

      {/* Section nav */}
      <nav className="mb-8 flex flex-wrap gap-1.5">
        {NAV.map((item) => {
          const active = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors",
                active
                  ? "gradient-brand text-white shadow-sm shadow-brand/25"
                  : "border border-line text-ink-soft hover:border-brand hover:text-brand"
              )}
            >
              <item.icon size={15} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {children}
    </div>
  );
}
