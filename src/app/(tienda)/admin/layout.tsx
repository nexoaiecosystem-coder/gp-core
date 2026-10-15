"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, LayoutDashboard, ShoppingBag, Tag } from "lucide-react";
import { cn } from "@/lib/utils";
import { hasAdminSession, clearAdminSession } from "@/lib/adminAuth";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/pedidos", label: "Pedidos", icon: ShoppingBag },
  { href: "/admin/productos", label: "Precios", icon: Tag },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [status, setStatus] = useState<"checking" | "ok">("checking");

  useEffect(() => {
    if (hasAdminSession()) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- session check is client-only
      setStatus("ok");
    } else {
      // No es admin: lo mandamos al login normal (Mi cuenta).
      router.replace("/login");
    }
  }, [router]);

  function handleLogout() {
    clearAdminSession();
    router.push("/");
  }

  if (status !== "ok") return null;

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
            <LogOut size={14} /> Cerrar sesión
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
