"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Download, Info } from "lucide-react";
import type { AppItem } from "@/lib/types";
import { Rating } from "@/components/ui/rating";
import { formatCount } from "@/lib/utils";

export function AppCard({ app }: { app: AppItem }) {
  return (
    <motion.article
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
      className="card group flex h-full flex-col p-5 hover:border-accent/40 hover:shadow-2xl"
    >
      <div className="flex items-start gap-4">
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl shadow-md ring-1 ring-border">
          <Image src={app.icon} alt={`${app.name} icono`} fill sizes="64px" className="object-cover" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <h3 className="truncate text-lg font-semibold">{app.name}</h3>
            <span className="shrink-0 rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
              {app.platform}
            </span>
          </div>
          <p className="truncate text-sm text-muted-foreground">{app.tagline}</p>
          <div className="mt-1.5 flex items-center gap-3">
            <Rating value={app.rating} />
          </div>
        </div>
      </div>

      <p className="mt-4 line-clamp-2 flex-1 text-sm text-muted-foreground">{app.description}</p>

      <dl className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
        <div className="rounded-xl bg-muted/60 py-2">
          <dt className="text-muted-foreground">Descargas</dt>
          <dd className="font-semibold">{formatCount(app.downloads)}</dd>
        </div>
        <div className="rounded-xl bg-muted/60 py-2">
          <dt className="text-muted-foreground">Versión</dt>
          <dd className="font-semibold">{app.version}</dd>
        </div>
        <div className="rounded-xl bg-muted/60 py-2">
          <dt className="text-muted-foreground">Tamaño</dt>
          <dd className="font-semibold">{app.size}</dd>
        </div>
      </dl>

      <div className="mt-5 flex gap-2">
        <a
          href={app.links.download || "#"}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary flex-1 !py-2 text-sm"
        >
          <Download className="h-4 w-4" /> Descargar
        </a>
        <Link href={`/apps/${app.slug}`} className="btn-secondary !py-2 text-sm">
          <Info className="h-4 w-4" /> Más info
        </Link>
      </div>
    </motion.article>
  );
}
