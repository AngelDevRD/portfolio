import { NextResponse } from "next/server";
import { getProjectRepository } from "@/lib/projects/factory";
import { incrementDownloadCount } from "@/lib/downloads/counter";
import { getApkStorageProvider } from "@/lib/storage/factory";
import { apkFilename } from "@/lib/storage/apk-provider";

export const dynamic = "force-dynamic";

/**
 * Proxy de descarga: siempre streamea el binario a través del servidor (nunca redirige al
 * origen real), para poder forzar el nombre de archivo real vía Content-Disposition en
 * todos los navegadores. El origen (hoy GitHub Releases) es intercambiable — ver
 * @/lib/storage/factory.
 */
const CONTENT_TYPE_BY_KIND = {
  apk: "application/vnd.android.package-archive",
  aab: "application/octet-stream",
  windows: "application/zip",
} as const;

export async function GET(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const url = new URL(req.url);
  const kind = (url.searchParams.get("platform") as "apk" | "aab" | "windows" | null) ?? "apk";
  if (kind !== "apk" && kind !== "aab" && kind !== "windows") {
    return NextResponse.json({ error: "platform invalido" }, { status: 400 });
  }

  const project = await getProjectRepository().getBySlug(slug);
  if (!project || project.type !== "mobile") {
    return NextResponse.json({ error: "App no encontrada" }, { status: 404 });
  }

  const asset = await getApkStorageProvider().getApk(project, kind);
  if (!asset) {
    return NextResponse.redirect(`https://github.com/${project.repo}/releases`);
  }

  await incrementDownloadCount(project.slug);

  return new NextResponse(asset.body, {
    headers: {
      "Content-Type": CONTENT_TYPE_BY_KIND[kind],
      "Content-Disposition": `attachment; filename="${apkFilename(project, kind)}"`,
      ...(asset.contentLength ? { "Content-Length": String(asset.contentLength) } : {}),
    },
  });
}
