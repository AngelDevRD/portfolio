import type { Metadata } from "next";
import Link from "next/link";
import {
  FolderKanban, AppWindow, Github, Lightbulb, Mail, FileJson, ExternalLink,
} from "lucide-react";
import { getMobileProjects, getWebProjects } from "@/data";
import { getSupabaseAdmin } from "@/lib/supabase";
import { LogoutButton } from "@/components/admin/logout-button";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "Admin", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

interface SuggestionRow {
  id: string;
  name: string | null;
  email: string;
  title: string;
  description: string;
  category: string | null;
  recommend: string | null;
  created_at: string;
}

async function getSuggestions(): Promise<{ rows: SuggestionRow[]; configured: boolean }> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { rows: [], configured: false };
  const { data, error } = await supabase
    .from("suggestions")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(50);
  if (error) {
    console.error("[admin] suggestions:", error.message);
    return { rows: [], configured: true };
  }
  return { rows: (data as SuggestionRow[]) ?? [], configured: true };
}

export default async function AdminPage() {
  const [mobile, web, { rows: suggestions, configured }] = await Promise.all([
    getMobileProjects(),
    getWebProjects(),
    getSuggestions(),
  ]);

  const stats = [
    { label: "Apps móviles", value: mobile.length, icon: AppWindow },
    { label: "Proyectos web", value: web.length, icon: FolderKanban },
    { label: "Total repos", value: mobile.length + web.length, icon: Github },
    { label: "Sugerencias", value: suggestions.length, icon: Lightbulb },
  ];

  return (
    <div className="section pt-28 pb-16">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Panel de administración</h1>
          <p className="mt-1 text-muted-foreground">Resumen del sitio, sugerencias y gestión de contenido.</p>
        </div>
        <LogoutButton />
      </div>

      {/* Stats */}
      <div className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="card p-5">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent">
              <s.icon className="h-5 w-5" />
            </div>
            <p className="text-2xl font-bold">{s.value}</p>
            <p className="text-sm text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Sugerencias */}
        <section className="lg:col-span-2">
          <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold">
            <Lightbulb className="h-5 w-5 text-accent" /> Buzón de sugerencias
          </h2>

          {!configured && (
            <div className="card p-6 text-sm text-muted-foreground">
              <p className="mb-2 font-medium text-foreground">Supabase no está configurado.</p>
              Añade <code>NEXT_PUBLIC_SUPABASE_URL</code> y <code>SUPABASE_SERVICE_ROLE_KEY</code> en <code>.env.local</code> y crea la tabla <code>suggestions</code> (ver <code>src/lib/supabase.ts</code>). Mientras tanto, las sugerencias te llegan por correo.
            </div>
          )}

          {configured && suggestions.length === 0 && (
            <div className="card p-6 text-sm text-muted-foreground">Aún no hay sugerencias registradas.</div>
          )}

          <div className="space-y-3">
            {suggestions.map((s) => (
              <article key={s.id} className="card p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-semibold">{s.title}</h3>
                    <p className="text-xs text-muted-foreground">
                      {s.name || "Anónimo"} · {s.email} · {formatDate(s.created_at)}
                    </p>
                  </div>
                  {s.category && (
                    <span className="shrink-0 rounded-full bg-muted px-2.5 py-0.5 text-xs">{s.category}</span>
                  )}
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{s.description}</p>
              </article>
            ))}
          </div>
        </section>

        {/* Gestión de contenido */}
        <aside className="space-y-6">
          <div className="card p-6">
            <h2 className="mb-3 flex items-center gap-2 font-semibold">
              <FileJson className="h-5 w-5 text-accent" /> Gestión de contenido
            </h2>
            <p className="mb-4 text-sm text-muted-foreground">
              Cada proyecto es un archivo JSON (versionado en git). Para añadir uno nuevo, copia un archivo existente
              como plantilla, cambia sus campos y haz commit + push:
            </p>
            <ul className="space-y-2 text-sm">
              <li className="rounded-lg bg-muted/60 px-3 py-2 font-mono text-xs">content/projects/mobile/*.json</li>
              <li className="rounded-lg bg-muted/60 px-3 py-2 font-mono text-xs">content/projects/web/*.json</li>
            </ul>
            <p className="mt-3 text-xs text-muted-foreground">
              Versión, tamaño, fecha e historial de las apps móviles se leen en vivo desde GitHub Releases — no se
              editan a mano. Las imágenes van en <code>/public</code>. Tras editar, Vercel redespliega solo.
            </p>
          </div>

          <div className="card p-6">
            <h2 className="mb-3 flex items-center gap-2 font-semibold">
              <Mail className="h-5 w-5 text-accent" /> Mensajes
            </h2>
            <p className="text-sm text-muted-foreground">
              Los mensajes de contacto llegan directamente a tu correo vía Resend. Revísalos en tu bandeja de entrada.
            </p>
          </div>

          <div className="card p-6">
            <h2 className="mb-3 font-semibold">Accesos rápidos</h2>
            <div className="flex flex-col gap-2">
              <Link href="/" className="btn-secondary justify-start"><ExternalLink className="h-4 w-4" /> Ver sitio</Link>
              <Link href="/apps" className="btn-secondary justify-start"><ExternalLink className="h-4 w-4" /> Ver App Store</Link>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
