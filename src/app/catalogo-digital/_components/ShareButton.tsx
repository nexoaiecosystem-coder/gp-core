"use client";

import { useState } from "react";
import { Check, Share2 } from "lucide-react";
import { cn } from "@/lib/utils";

/** Abre el menú nativo de compartir (celular) o copia el link de la página actual. */
export function ShareButton({ title, className }: { title: string; className?: string }) {
  const [copied, setCopied] = useState(false);

  async function handleClick() {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
        return;
      } catch {
        // compartir cancelado — copiamos el link
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // sin permiso de portapapeles
    }
  }

  return (
    <button
      onClick={handleClick}
      className={cn(
        "flex h-9 items-center gap-1.5 rounded-full bg-white px-3.5 text-sm font-semibold text-[#082a17] transition-colors hover:bg-white/90 print:hidden",
        className
      )}
    >
      {copied ? <Check size={15} /> : <Share2 size={15} />}
      {copied ? "¡Link copiado!" : "Compartir"}
    </button>
  );
}

export function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="hidden h-9 items-center gap-1.5 rounded-full bg-white/10 px-3.5 text-sm font-medium text-white transition-colors hover:bg-white/15 sm:flex print:hidden"
    >
      Imprimir / PDF
    </button>
  );
}
