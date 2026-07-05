"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Search, SlidersHorizontal } from "lucide-react";
import { AppCard } from "./app-card";
import type { MobileProject } from "@/lib/projects/schema";
import type { EnrichedProject } from "@/lib/github/types";

type SortKey = "recientes" | "estrellas";
type App = EnrichedProject<MobileProject>;

export function AppExplorer({ apps }: { apps: App[] }) {
  const [query, setQuery] = useState("");
  const [tag, setTag] = useState<string | null>(null);
  const [sort, setSort] = useState<SortKey>("recientes");

  const allTags = useMemo(() => Array.from(new Set(apps.flatMap((a) => a.tags))), [apps]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = apps.filter((a) => {
      const matchTag = !tag || a.tags.includes(tag);
      const matchQuery =
        !q ||
        a.name.toLowerCase().includes(q) ||
        a.description.toLowerCase().includes(q) ||
        a.tags.some((t) => t.toLowerCase().includes(q));
      return matchTag && matchQuery;
    });

    list = [...list].sort((a, b) => {
      if (sort === "estrellas") return (b.github?.starsCount ?? 0) - (a.github?.starsCount ?? 0);
      const dateA = a.github?.releaseDate ?? a.github?.lastCommitAt ?? "";
      const dateB = b.github?.releaseDate ?? b.github?.lastCommitAt ?? "";
      return dateB.localeCompare(dateA);
    });
    return list;
  }, [apps, query, tag, sort]);

  return (
    <div>
      {/* Buscador */}
      <div className="relative mb-6">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar por nombre o tecnología…"
          aria-label="Buscar aplicaciones"
          className="glass-strong w-full rounded-2xl py-3.5 pl-12 pr-4 text-sm outline-none ring-accent/50 focus:ring-2"
        />
      </div>

      {/* Filtros */}
      <div className="mb-8 space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setTag(null)}
            className={
              "rounded-full px-4 py-1.5 text-sm font-medium transition-colors " +
              (!tag ? "bg-accent text-accent-foreground shadow" : "glass text-muted-foreground hover:text-foreground")
            }
          >
            Todos
          </button>
          {allTags.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTag(tag === t ? null : t)}
              className={
                "rounded-full border px-3 py-1 text-xs font-medium transition-colors " +
                (tag === t
                  ? "border-accent bg-accent/10 text-accent"
                  : "border-border text-muted-foreground hover:text-foreground")
              }
            >
              {t}
            </button>
          ))}

          <div className="ml-auto flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              aria-label="Ordenar aplicaciones"
              className="glass rounded-full px-3 py-1.5 text-sm outline-none ring-accent/50 focus:ring-2"
            >
              <option value="recientes">Más recientes</option>
              <option value="estrellas">Más estrellas</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid */}
      <motion.div layout className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {filtered.map((a) => (
            <motion.div
              key={a.slug}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.25 }}
            >
              <AppCard app={a} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {filtered.length === 0 && (
        <p className="py-16 text-center text-muted-foreground">
          {apps.length === 0
            ? "Próximamente: aquí aparecerán mis aplicaciones."
            : "No encontramos aplicaciones con esos filtros."}
        </p>
      )}
    </div>
  );
}
