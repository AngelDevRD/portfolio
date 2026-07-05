import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Download, Check, ListChecks, History, Cpu } from "lucide-react";
import { apps, getAppBySlug } from "@/data";
import { Rating } from "@/components/ui/rating";
import { TechPill } from "@/components/ui/tech-pill";
import { Gallery } from "@/components/apps/gallery";
import { ShareButton, ReportButton } from "@/components/apps/app-actions";
import { formatCount, formatDate } from "@/lib/utils";

export function generateStaticParams() {
  return apps.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const app = getAppBySlug(slug);
  if (!app) return { title: "App no encontrada" };
  return {
    title: app.name,
    description: app.tagline,
    openGraph: { title: app.name, description: app.description, images: [app.screenshots[0] ?? app.icon] },
  };
}

export default async function AppDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const app = getAppBySlug(slug);
  if (!app) notFound();

  return (
    <div className="section pt-28 pb-16">
      <Link href="/apps" className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Volver a la App Store
      </Link>

      {/* Encabezado */}
      <header className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-center">
        <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-3xl shadow-lg ring-1 ring-border">
          <Image src={app.icon} alt={`${app.name} icono`} fill sizes="96px" className="object-cover" />
        </div>
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{app.name}</h1>
          <p className="mt-1 text-lg text-muted-foreground">{app.tagline}</p>
          <div className="mt-3 flex flex-wrap items-center gap-4">
            <Rating value={app.rating} />
            <span className="text-sm text-muted-foreground">{formatCount(app.downloads)} descargas</span>
            <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs">{app.platform}</span>
            <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs">{app.category}</span>
          </div>
        </div>
        <div className="flex shrink-0 flex-col gap-2">
          <a href={app.links.download || "#"} target="_blank" rel="noopener noreferrer" className="btn-primary">
            <Download className="h-4 w-4" /> Descargar
          </a>
          <div className="flex gap-2">
            <ShareButton title={app.name} />
          </div>
        </div>
      </header>

      <div className="grid gap-10 lg:grid-cols-3">
        {/* Columna principal */}
        <div className="space-y-10 lg:col-span-2">
          <Gallery images={app.screenshots} alt={app.name} />

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

          <section>
            <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold">
              <History className="h-5 w-5 text-accent" /> Historial de cambios
            </h2>
            <div className="space-y-4">
              {app.changelog.map((c) => (
                <div key={c.version} className="card p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="font-semibold">v{c.version}</span>
                    <span className="text-xs text-muted-foreground">{formatDate(c.date)}</span>
                  </div>
                  <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
                    {c.changes.map((ch) => (
                      <li key={ch}>{ch}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Barra lateral */}
        <aside className="space-y-6">
          <div className="card p-6">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Información</h3>
            <dl className="space-y-3 text-sm">
              <Row label="Versión" value={app.version} />
              <Row label="Tamaño" value={app.size} />
              <Row label="Sistema" value={app.platform} />
              <Row label="Categoría" value={app.category} />
              <Row label="Actualizado" value={formatDate(app.updatedAt)} />
            </dl>
          </div>

          <div className="card p-6">
            <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              <Cpu className="h-4 w-4" /> Tecnologías
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {app.tech.map((t) => (
                <TechPill key={t} label={t} />
              ))}
            </div>
          </div>

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
