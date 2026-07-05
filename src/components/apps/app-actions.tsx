"use client";

import { useState } from "react";
import { Share2, Flag, Check } from "lucide-react";
import { site } from "@/lib/site";

export function ShareButton({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);

  async function share() {
    const url = typeof window !== "undefined" ? window.location.href : site.url;
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
        return;
      } catch {
        /* usuario canceló: caemos a copiar */
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard no disponible */
    }
  }

  return (
    <button type="button" onClick={share} className="btn-secondary">
      {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Share2 className="h-4 w-4" />}
      {copied ? "Enlace copiado" : "Compartir"}
    </button>
  );
}

export function ReportButton({ appName }: { appName: string }) {
  const subject = encodeURIComponent(`Reporte de error — ${appName}`);
  const body = encodeURIComponent(
    `Hola, quiero reportar un problema con la app "${appName}".\n\nDescripción del error:\n`
  );
  return (
    <a href={`mailto:${site.email}?subject=${subject}&body=${body}`} className="btn-ghost">
      <Flag className="h-4 w-4" />
      Reportar error
    </a>
  );
}
