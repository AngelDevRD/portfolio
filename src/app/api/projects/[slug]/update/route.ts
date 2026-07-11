import { NextResponse } from "next/server";
import { getProjectRepository } from "@/lib/projects/factory";
import { site } from "@/lib/site";

export const revalidate = 1800;

/**
 * Endpoint de auto-actualizacion para las apps Flutter distribuidas fuera de Google Play.
 * Devuelve la ultima version publicada (leida en vivo de GitHub Releases) y la URL de
 * descarga a traves de nuestro propio proxy (no la URL directa de GitHub), para no exponer
 * el token y para que la descarga cuente en las estadisticas del portafolio.
 *
 * El cliente Flutter es quien decide si hay actualizacion disponible y si es obligatoria,
 * comparando "version" (y opcionalmente "minSupportedVersion") contra su propia version
 * instalada. No exponemos un "build number" separado: GitHub Releases no tiene ese concepto
 * nativo y mantenerlo sincronizado a mano solo genera desincronizacion; la version semver del
 * tag del release es la unica fuente de verdad.
 */
export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await getProjectRepository().getBySlug(slug);
  if (!project || project.type !== "mobile") {
    return NextResponse.json({ error: "App no encontrada" }, { status: 404 });
  }

  const version = project.github?.latestVersion;
  if (!version) {
    return NextResponse.json({ error: "Sin releases publicados" }, { status: 404 });
  }

  const changes = (project.github?.releaseNotes ?? "")
    .split("\n")
    .map((line) => line.replace(/^[-*]\s*/, "").trim())
    .filter(Boolean);

  const base = site.url.replace(/\/$/, "");

  return NextResponse.json({
    version,
    minSupportedVersion: project.minSupportedVersion ?? null,
    apk_url: `${base}/api/projects/${project.slug}/download`,
    changes,
    releaseDate: project.github?.releaseDate ?? null,
  });
}
