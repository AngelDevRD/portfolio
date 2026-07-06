"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Download, Info } from "lucide-react";
import type { MobileProject } from "@/lib/projects/schema";
import type { EnrichedProject } from "@/lib/github/types";
import { formatBytes, formatCount, formatDate } from "@/lib/utils";

export function AppCard({ app }: { app: EnrichedProject<MobileProject> }) {
  const downloadUrl = `/api/projects/${app.slug}/download`;

  return (
    <motion.article
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
      className="card group flex h-full flex-col p-5 hover:border-accent/40 hover:shadow-2xl"
    >
      <div className="flex items-start gap-4">
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl shadow-md ring-1 ring-border">
          <Image src={app.logo} alt={`${app.name} icono`} fill sizes="64px" className="object-cover" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-lg font-semibold">{app.name}</h3>
          <p className="truncate text-sm text-muted-foreground">{app.tagline}</p>
          <div className="mt-1.5 flex flex-wrap gap-1">
            {app.tags.slice(0, 3).map((t) => (
              <span key={t} className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>

      <p className="mt-4 line-clamp-2 flex-1 text-sm text-muted-foreground">{app.description}</p>

      <dl className="mt-4 grid grid-cols-2 gap-2 text-center text-xs">
        <div className="rounded-xl bg-muted/60 py-2">
          <dt className="text-muted-foreground">Versión</dt>
          <dd className="font-semibold">{app.github?.latestVersion ?? "—"}</dd>
        </div>
        <div className="rounded-xl bg-muted/60 py-2">
          <dt className="text-muted-foreground">Descargas</dt>
          <dd className="font-semibold">{formatCount(app.downloads)}</dd>
        </div>
        <div className="rounded-xl bg-muted/60 py-2">
          <dt className="text-muted-foreground">Tamaño</dt>
          <dd className="font-semibold">
            {app.github?.apkSizeBytes ? formatBytes(app.github.apkSizeBytes) : "—"}
          </dd>
        </div>
        <div className="rounded-xl bg-muted/60 py-2">
          <dt className="text-muted-foreground">Actualizado</dt>
          <dd className="font-semibold">
            {app.github?.releaseDate ? formatDate(app.github.releaseDate) : "—"}
          </dd>
        </div>
      </dl>

      <div className="mt-5 flex gap-2">
        <a href={downloadUrl} className="btn-primary flex-1 !py-2 text-sm">
          <Download className="h-4 w-4" /> Descargar
        </a>
        <Link href={`/apps/${app.slug}`} className="btn-secondary !py-2 text-sm">
          <Info className="h-4 w-4" /> Más info
        </Link>
      </div>
    </motion.article>
  );
}
