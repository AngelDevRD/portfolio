import { cn } from "@/lib/utils";
import type { ProjectStatus } from "@/lib/projects/schema";

const statusMeta: Record<ProjectStatus, { label: string; className: string }> = {
  development: { label: "En desarrollo", className: "bg-amber-500/15 text-amber-500" },
  beta: { label: "Beta", className: "bg-sky-500/15 text-sky-400" },
  published: { label: "Publicado", className: "bg-emerald-500/15 text-emerald-500" },
  maintenance: { label: "Mantenimiento", className: "bg-violet-500/15 text-violet-400" },
  archived: { label: "Archivado", className: "bg-slate-500/15 text-slate-400" },
};

export function StatusBadge({ status, className }: { status: ProjectStatus; className?: string }) {
  const meta = statusMeta[status] ?? { label: status, className: "bg-muted text-muted-foreground" };
  return (
    <span className={cn("rounded-full px-2.5 py-1 text-xs font-semibold", meta.className, className)}>
      {meta.label}
    </span>
  );
}
