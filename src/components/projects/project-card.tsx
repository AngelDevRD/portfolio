"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ExternalLink, Github, FileText, CalendarDays } from "lucide-react";
import type { WebProject } from "@/lib/projects/schema";
import type { EnrichedProject } from "@/lib/github/types";
import { TechPill } from "@/components/ui/tech-pill";
import { formatDate, cn } from "@/lib/utils";

const statusMeta: Record<string, { label: string; className: string }> = {
  development: { label: "En desarrollo", className: "bg-amber-500/15 text-amber-500" },
  beta: { label: "Beta", className: "bg-sky-500/15 text-sky-400" },
  published: { label: "Publicado", className: "bg-emerald-500/15 text-emerald-500" },
  maintenance: { label: "Mantenimiento", className: "bg-violet-500/15 text-violet-400" },
  archived: { label: "Archivado", className: "bg-slate-500/15 text-slate-400" },
};

export function ProjectCard({ project }: { project: EnrichedProject<WebProject> }) {
  const status = statusMeta[project.status] ?? { label: project.status, className: "bg-muted text-muted-foreground" };
  const cardImage = project.screenshots[0] ?? project.logo;
  const updatedAt = project.github?.lastCommitAt;

  return (
    <motion.article
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
      className="card group flex h-full flex-col overflow-hidden hover:border-accent/40 hover:shadow-2xl"
    >
      <div className="relative aspect-video overflow-hidden">
        <Image
          src={cardImage}
          alt={project.name}
          fill
          sizes="(max-width: 768px) 100vw, 400px"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-60" />
        <span className={cn("absolute left-3 top-3 rounded-full px-2.5 py-1 text-xs font-semibold backdrop-blur-md", status.className)}>
          {status.label}
        </span>
        {project.category && (
          <span className="absolute right-3 top-3 rounded-full bg-black/40 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-md">
            {project.category}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        {updatedAt && (
          <div className="mb-2 flex items-center gap-1.5 text-xs text-muted-foreground">
            <CalendarDays className="h-3.5 w-3.5" />
            {formatDate(updatedAt)}
          </div>
        )}
        <h3 className="text-lg font-semibold">{project.name}</h3>
        <p className="mt-2 flex-1 text-sm text-muted-foreground">{project.description}</p>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {project.tags.map((t) => (
            <TechPill key={t} label={t} />
          ))}
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" className="btn-primary flex-1 !py-2 text-xs">
            <ExternalLink className="h-3.5 w-3.5" /> Ver Demo
          </a>
          <a href={`https://github.com/${project.repo}`} target="_blank" rel="noopener noreferrer" className="btn-secondary !px-3 !py-2 text-xs" aria-label="Ver código">
            <Github className="h-3.5 w-3.5" />
          </a>
          {project.docsUrl && (
            <a href={project.docsUrl} target="_blank" rel="noopener noreferrer" className="btn-secondary !px-3 !py-2 text-xs" aria-label="Documentación">
              <FileText className="h-3.5 w-3.5" />
            </a>
          )}
        </div>
      </div>
    </motion.article>
  );
}
