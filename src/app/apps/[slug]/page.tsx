import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Download, ExternalLink, Github, Check, ListChecks, History, Cpu } from "lucide-react";
import { getAllProjects, getProjectBySlug } from "@/data";
import { TechPill } from "@/components/ui/tech-pill";
import { Gallery } from "@/components/apps/gallery";
import { ShareButton, ReportButton } from "@/components/apps/app-actions";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatBytes, formatCount, formatDate } from "@/lib/utils";

export const revalidate = 1800;

export async function generateStaticParams() {
  const projects = await getAllProjects();
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const app = await getProjectBySlug(slug);
  if (!app) return { title: "Proyecto no encontrado" };
  return {
    title: app.name,
    description: app.tagline,
    openGraph: { title: app.name, description: app.description, images: [app.screenshots[0] ?? app.logo] },
  };
}

export default async function AppDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const app = await getProjectBySlug(slug);
  if (!app) notFound();

  const isMobile = app.type === "mobile";
  const downloadUrl = isMobile ? `/api/projects/${app.slug}/download` : undefined;

  return (
    <div className="section pt-28 pb-16">
      <Link href="/apps" className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Volver a la App Store
      </Link>

      {/* Encabezado */}
      <header className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-center">
        <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-3xl shadow-lg ring-1 ring-border">
          <Image src={app.logo} alt={`${app.name} icono`} fill sizes="96px" className="object-cover" />
        </div>
        <div className="flex-1">
          <div className="mb-1 flex flex-wrap items-center gap-2">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{app.name}</h1>
            <StatusBadge status={app.status} />
          </div>
          <p className="mt-1 text-lg text-muted-foreground">{app.tagline}</p>
          {isMobile && (
            <p className="mt-2 text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">{formatCount(app.downloads)}</span> descargas
            </p>
          )}
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {app.tags.map((t) => (
              <span key={t} className="rounded-full bg-muted px-2.5 py-0.5 text-xs">{t}</span>
            ))}
          </div>
        </div>
        <div className="flex shrink-0 flex-col gap-2">
          {isMobile ? (
            <a href={downloadUrl} className="btn-primary">
              <Download className="h-4 w-4" /> Descargar
            </a>
          ) : (
            <a href={app.demoUrl} target="_blank" rel="noopener noreferrer" className="btn-primary">
              <ExternalLink className="h-4 w-4" /> Ver Demo
            </a>
          )}
          <div className="flex gap-2">
            <a
              href={`https://github.com/${app.repo}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary !px-3 !py-2 text-sm"
              aria-label="Ver código"
            >
              <Github className="h-4 w-4" /> Código
            </a>
            <ShareButton title={app.name} />
          </div>
        </div>
      </header>

      <div className="grid gap-10 lg:grid-cols-3">
        {/* Columna principal */}
        <div className="space-y-10 lg:col-span-2">
          {app.screenshots.length > 0 && <Gallery images={app.screenshots} alt={app.name} />}

          {app.video && (
            <div className="glass-strong aspect-video overflow-hidden rounded-3xl">
              <iframe
                src={app.video}
                title={`Video de ${app.name}`}
                className="h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          )}

          <section>
            <h2 className="mb-3 text-xl font-semibold">Descripción</h2>
            <p className="leading-relaxed text-muted-foreground">{app.description}</p>
          </section>

          {app.features && app.features.length > 0 && (
            <section>
              <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold">
                <ListChecks className="h-5 w-5 text-accent" /> Características
              </h2>
              <ul className="grid gap-2 sm:grid-cols-2">
                {app.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                    {f}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {isMobile && app.github?.releaseHistory && app.github.releaseHistory.length > 0 && (
            <section>
              <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold">
                <History className="h-5 w-5 text-accent" /> Historial de cambios
              </h2>
              <div className="space-y-4">
                {app.github.releaseHistory.map((r) => (
                  <div key={r.version} className="card p-4">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="font-semibold">{r.version}</span>
                      <span className="text-xs text-muted-foreground">{formatDate(r.date)}</span>
                    </div>
                    {r.notes && (
                      <p className="whitespace-pre-wrap text-sm text-muted-foreground">{r.notes}</p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Barra lateral */}
        <aside className="space-y-6">
          <div className="card p-6">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Información</h3>
            <dl className="space-y-3 text-sm">
              {isMobile && <Row label="Versión" value={app.github?.latestVersion ?? "—"} />}
              {isMobile && <Row label="Descargas" value={formatCount(app.downloads)} />}
              {isMobile && (
                <Row label="Tamaño" value={app.github?.apkSizeBytes ? formatBytes(app.github.apkSizeBytes) : "—"} />
              )}
              <Row label="Categoría" value={app.category ?? "—"} />
              <Row
                label="Actualizado"
                value={
                  isMobile
                    ? app.github?.releaseDate
                      ? formatDate(app.github.releaseDate)
                      : "—"
                    : app.github?.lastCommitAt
                      ? formatDate(app.github.lastCommitAt)
                      : "—"
                }
              />
              {app.github?.license && <Row label="Licencia" value={app.github.license} />}
              {typeof app.github?.contributors === "number" && (
                <Row label="Contribuidores" value={String(app.github.contributors)} />
              )}
              {typeof app.github?.starsCount === "number" && (
                <Row label="Estrellas" value={String(app.github.starsCount)} />
              )}
            </dl>
          </div>

          <div className="card p-6">
            <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              <Cpu className="h-4 w-4" /> Tecnologías
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {app.tags.map((t) => (
                <TechPill key={t} label={t} />
              ))}
            </div>
          </div>

          {app.requirements && app.requirements.length > 0 && (
            <div className="card p-6">
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Requisitos</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {app.requirements.map((r) => (
                  <li key={r} className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                    {r}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <ReportButton appName={app.name} />
        </aside>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="font-medium">{value}</dd>
    </div>
  );
}
