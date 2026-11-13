"use client";

import { useState } from "react";
import { Check, Share2 } from "lucide-react";

/** Abre el menú nativo de compartir (celular) o copia el link de la página actual. */
export function ShareButton({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);

  async function handleClick() {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
        return;
      } catch {
        // compartir cancelado: copiamos el link
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
      className="flex h-9 shrink-0 items-center gap-1.5 rounded-md border border-[#e6e6e1] px-3 text-sm font-medium text-[#17191b] transition-colors hover:border-[#0d3d22] hover:text-[#0d3d22]"
    >
      {copied ? <Check size={15} /> : <Share2 size={15} />}
      <span className="hidden sm:inline">{copied ? "¡Link copiado!" : "Compartir"}</span>
    </button>
  );
}
