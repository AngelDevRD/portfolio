"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ExternalLink, Github, FileText, CalendarDays } from "lucide-react";
import type { Project } from "@/lib/types";
import { TechPill } from "@/components/ui/tech-pill";
import { formatDate, cn } from "@/lib/utils";

const statusStyles: Record<string, string> = {
  Completado: "bg-emerald-500/15 text-emerald-500",
  "En progreso": "bg-amber-500/15 text-amber-500",
  Pausado: "bg-slate-500/15 text-slate-400",
  Concepto: "bg-violet-500/15 text-violet-400",
};

export function ProjectCard({ project }: { project: Project }) {
  return (
    <motion.article
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
      className="card group flex h-full flex-col overflow-hidden hover:border-accent/40 hover:shadow-2xl"
    >
      <div className="relative aspect-video overflow-hidden">
        <Image
          src={project.image}
          alt={project.name}
          fill
          sizes="(max-width: 768px) 100vw, 400px"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-60" />
        <span
          className={cn(
            "absolute left-3 top-3 rounded-full px-2.5 py-1 text-xs font-semibold backdrop-blur-md",
            statusStyles[project.status] ?? "bg-muted text-muted-foreground"
          )}
        >
          {project.status}
        </span>
        <span className="absolute right-3 top-3 rounded-full bg-black/40 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-md">
          {project.category}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="mb-2 flex items-center gap-1.5 text-xs text-muted-foreground">
          <CalendarDays className="h-3.5 w-3.5" />
          {formatDate(project.date)}
        </div>
        <h3 className="text-lg font-semibold">{project.name}</h3>
        <p className="mt-2 flex-1 text-sm text-muted-foreground">{project.description}</p>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {project.tech.map((t) => (
            <TechPill key={t} label={t} />
          ))}
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {project.links.live && (
            <a href={project.links.live} target="_blank" rel="noopener noreferrer" className="btn-primary flex-1 !py-2 text-xs">
              <ExternalLink className="h-3.5 w-3.5" /> Abrir
            </a>
          )}
          {project.links.github && (
            <a href={project.links.github} target="_blank" rel="noopener noreferrer" className="btn-secondary !px-3 !py-2 text-xs" aria-label="GitHub">
              <Github className="h-3.5 w-3.5" />
            </a>
          )}
          {project.links.docs && (
            <a href={project.links.docs} target="_blank" rel="noopener noreferrer" className="btn-secondary !px-3 !py-2 text-xs" aria-label="Documentación">
              <FileText className="h-3.5 w-3.5" />
            </a>
          )}
        </div>
      </div>
    </motion.article>
  );
}
