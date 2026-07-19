import { NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";
import { putPortfolioFile, putPortfolioBinaryFile } from "@/lib/orchestrator/github-content";
import { buildCatalogEntry } from "@/lib/orchestrator/catalog-entry";
import { buildMetadataSnapshot } from "@/lib/orchestrator/metadata-file";
import { withRetry } from "@/lib/orchestrator/retry";
import { logOrchestratorEvent } from "@/lib/orchestrator/log";

export const runtime = "nodejs";

/**
 * Webhook que dispara el ultimo paso de cada workflow de Codemagic (script "Notificar al
 * portafolio", ver codemagic.yaml de cada app). Reemplaza el cron del diseno anterior: el
 * asset ya fue subido al GitHub Release por el propio script de Codemagic (que corre en la
 * maquina de build, con el archivo ya local -- no hace falta que este webhook descargue nada
 * de Codemagic). Este endpoint solo:
 *   1. Auto-extrae metadatos del repo (pubspec/README/manifest/Info.plist/assets) y actualiza
 *      el JSON del catalogo -- nunca requiere editar un JSON a mano.
 *   2. Regenera public/metadata.json en vivo desde GitHub Releases (misma fuente que ya usa la
 *      web, ver src/lib/github/enrichment.ts).
 *   3. Verifica con HEAD que el asset recien publicado responde antes de dar el aviso por bueno.
 * Comitea via la Contents API de GitHub (no hay working tree de git en una funcion serverless)
 * y solo si el contenido realmente cambio, para no generar commits vacios en cada llamada.
 *
 * URL configurada una vez por app en su codemagic.yaml:
 *   https://<dominio>/api/orchestrator/webhook?owner=AngelDevRD&repo=nexfit&secret=$WEBHOOK_SECRET
 * Body esperado: {"workflowId": "android-workflow" | "windows-workflow" | "ios-workflow", "buildStatus": "success"}
 */
export async function POST(req: Request) {
  const url = new URL(req.url);
  const owner = url.searchParams.get("owner");
  const repo = url.searchParams.get("repo");
  const secret = url.searchParams.get("secret");

  if (secret !== process.env.WEBHOOK_SECRET) {
    return NextResponse.json({ error: "secret invalido" }, { status: 401 });
  }
  if (!owner || !repo) {
    return NextResponse.json({ error: "faltan owner/repo en la query" }, { status: 400 });
  }

  const payload = await req.json().catch(() => ({}) as Record<string, unknown>);
  const workflowId = typeof payload.workflowId === "string" ? payload.workflowId : undefined;
  const buildStatus = typeof payload.buildStatus === "string" ? payload.buildStatus : "success";

  const slug = repo.toLowerCase();
  const startedAt = Date.now();

  if (buildStatus !== "success") {
    logOrchestratorEvent({ app: slug, repo: `${owner}/${repo}`, platform: workflowId, durationMs: 0, status: "skipped" });
    return NextResponse.json({ ok: true, skipped: "build no exitoso" });
  }

  const warnings: string[] = [];

  try {
    const { entry, iconBuffer, version, warnings: extractWarnings } = await buildCatalogEntry(owner, repo);
    warnings.push(...extractWarnings);

    const catalogFile = path.join(process.cwd(), "content", "projects", "mobile", `${slug}.json`);
    const nextJson = JSON.stringify(entry, null, 2) + "\n";
    const currentJson = fs.existsSync(catalogFile) ? fs.readFileSync(catalogFile, "utf8") : null;
    if (nextJson !== currentJson) {
      await withRetry(() =>
        putPortfolioFile(
          `content/projects/mobile/${slug}.json`,
          nextJson,
          currentJson ? `chore: actualizar catalogo de ${slug} (webhook)` : `feat: alta automatica de ${slug} (webhook)`
        )
      );
    }

    const iconPath = `public/apps/${slug}/icon.png`;
    if (!fs.existsSync(path.join(process.cwd(), iconPath))) {
      if (iconBuffer) {
        await withRetry(() => putPortfolioBinaryFile(iconPath, iconBuffer, `feat: icono automatico de ${slug} (webhook)`));
      } else {
        warnings.push(`[${slug}] sin icono automatico, faltara en /apps/${slug}/icon.png hasta que se agregue uno`);
      }
    }

    const snapshot = await buildMetadataSnapshot();
    const nextMetadataJson = JSON.stringify(snapshot, null, 2) + "\n";
    const metadataFsPath = path.join(process.cwd(), "public/metadata.json");
    const currentMetadataJson = fs.existsSync(metadataFsPath) ? fs.readFileSync(metadataFsPath, "utf8") : null;
    if (nextMetadataJson !== currentMetadataJson) {
      await withRetry(() => putPortfolioFile("public/metadata.json", nextMetadataJson, "chore: actualizar metadata.json (webhook)"));
    }

    // Verifica el enlace que este workflow acaba de publicar (el asset ya lo subio Codemagic al
    // Release; aqui solo confirmamos que el proxy de descarga del portafolio lo sirve bien).
    const asset = snapshot.find((e) => e.slug === slug);
    const checkUrl =
      workflowId === "windows-workflow"
        ? asset?.windows.url
        : workflowId === "android-workflow"
          ? asset?.android.apkUrl
          : undefined; // ios-workflow se distribuye por TestFlight, no hay URL de descarga que verificar
    if (checkUrl) {
      const head = await withRetry(() => fetch(checkUrl, { method: "HEAD" })).catch(() => null);
      if (!head?.ok) warnings.push(`verificacion HEAD fallo para ${workflowId}: ${head?.status ?? "sin respuesta"}`);
    }

    logOrchestratorEvent({
      app: slug,
      repo: `${owner}/${repo}`,
      platform: workflowId,
      version,
      durationMs: Date.now() - startedAt,
      status: "success",
      warnings,
    });

    return NextResponse.json({ ok: true, slug, workflowId, warnings });
  } catch (err) {
    logOrchestratorEvent({
      app: slug,
      repo: `${owner}/${repo}`,
      platform: workflowId,
      durationMs: Date.now() - startedAt,
      status: "error",
      warnings,
      error: String(err),
    });
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
