"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Search } from "lucide-react";
import { SectionHeader } from "@/components/ui/section-header";
import { Reveal } from "@/components/ui/reveal";
import { ProjectCard } from "@/components/projects/project-card";
import { projects, projectCategories } from "@/data";

export function Projects() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("Todos");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return projects.filter((p) => {
      const matchCat = category === "Todos" || p.category === category;
      const matchQuery =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.tech.some((t) => t.toLowerCase().includes(q));
      return matchCat && matchQuery;
    });
  }, [query, category]);

  const categories = ["Todos", ...projectCategories];

  return (
    <section id="projects" className="section scroll-mt-24 py-24">
      <SectionHeader
        eyebrow="Proyectos"
        title="Cosas que he construido"
        subtitle="Busca por nombre o tecnología y filtra por categoría."
      />

      <Reveal className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar proyecto o tecnología…"
            aria-label="Buscar proyectos"
            className="glass w-full rounded-full py-2.5 pl-10 pr-4 text-sm outline-none ring-accent/50 focus:ring-2"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCategory(c)}
              className={
                "rounded-full px-4 py-2 text-sm font-medium transition-colors " +
                (category === c
                  ? "bg-accent text-accent-foreground shadow"
                  : "glass text-muted-foreground hover:text-foreground")
              }
            >
              {c}
            </button>
          ))}
        </div>
      </Reveal>

      <motion.div layout className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {filtered.map((p) => (
            <motion.div
              key={p.slug}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.25 }}
            >
              <ProjectCard project={p} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {filtered.length === 0 && (
        <p className="py-16 text-center text-muted-foreground">
          {projects.length === 0
            ? "Próximamente: aquí aparecerán mis proyectos."
            : "No hay proyectos que coincidan con tu búsqueda."}
        </p>
      )}
    </section>
  );
}
