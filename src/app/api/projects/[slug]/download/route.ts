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
export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await getProjectRepository().getBySlug(slug);
  if (!project || project.type !== "mobile") {
    return NextResponse.json({ error: "App no encontrada" }, { status: 404 });
  }

  const asset = await getApkStorageProvider().getApk(project);
  if (!asset) {
    return NextResponse.redirect(`https://github.com/${project.repo}/releases`);
  }

  await incrementDownloadCount(project.slug);

  return new NextResponse(asset.body, {
    headers: {
      "Content-Type": "application/vnd.android.package-archive",
      "Content-Disposition": `attachment; filename="${apkFilename(project)}"`,
      ...(asset.contentLength ? { "Content-Length": String(asset.contentLength) } : {}),
    },
  });
}
