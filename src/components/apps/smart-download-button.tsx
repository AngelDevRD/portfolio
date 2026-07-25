"use client";

import { useEffect, useRef } from "react";
import { Download } from "lucide-react";
import { isWindowsPlatform } from "@/lib/utils";

/** Botón "Descargar" principal: si el usuario está en Windows y la app publicó build de
 * Windows, sirve ese asset directo en vez de forzar siempre el APK de Android. Parte del
 * href apuntando al APK (igual que el render server) y lo corrige tras montar, para no
 * romper el HTML de SSR con un valor que depende de `navigator`. */
export function SmartDownloadButton({ slug, hasWindows }: { slug: string; hasWindows: boolean }) {
  const ref = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (hasWindows && isWindowsPlatform() && ref.current) {
      ref.current.href = `/api/projects/${slug}/download?platform=windows`;
    }
  }, [hasWindows, slug]);

  return (
    <a ref={ref} href={`/api/projects/${slug}/download`} className="btn-primary">
      <Download className="h-4 w-4" /> Descargar
    </a>
  );
}
