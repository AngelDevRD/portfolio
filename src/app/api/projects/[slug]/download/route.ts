import { NextResponse } from "next/server";
import { getProjectRepository } from "@/lib/projects/factory";

export const dynamic = "force-dynamic";

function authHeaders(accept: string): HeadersInit {
  const token = process.env.GITHUB_TOKEN;
  return {
    Accept: accept,
    "X-GitHub-Api-Version": "2022-11-28",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

/**
 * Proxy de descarga: el token de GitHub vive solo en el servidor. El navegador nunca lo ve,
 * solo recibe un redirect a la URL firmada y de corta duración que GitHub genera por request.
 */
export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await getProjectRepository().getBySlug(slug);
  if (!project || project.type !== "mobile") {
    return NextResponse.json({ error: "App no encontrada" }, { status: 404 });
  }

  const assetUrl = project.github?.downloadAssetUrl;
  if (!assetUrl) {
    return NextResponse.redirect(`https://github.com/${project.repo}/releases`);
  }

  const assetRes = await fetch(assetUrl, {
    headers: authHeaders("application/octet-stream"),
    redirect: "manual",
    cache: "no-store",
  });

  const location = assetRes.headers.get("location");
  if (assetRes.status >= 300 && assetRes.status < 400 && location) {
    return NextResponse.redirect(location, { status: 302 });
  }

  if (assetRes.ok && assetRes.body) {
    return new NextResponse(assetRes.body, {
      headers: {
        "Content-Type": "application/vnd.android.package-archive",
        "Content-Disposition": `attachment; filename="${project.slug}.apk"`,
      },
    });
  }

  return NextResponse.json({ error: "No se pudo obtener el archivo" }, { status: 502 });
}
