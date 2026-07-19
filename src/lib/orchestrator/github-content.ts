/**
 * Helpers de la API de GitHub usados por el webhook del orquestador (src/app/api/orchestrator/
 * webhook/route.ts). Corren dentro de una funcion serverless de Vercel: no hay working tree de
 * git persistente, asi que "comitear" un archivo significa usar la Contents API (GET para el sha
 * actual + PUT para crear/actualizar), no `git commit`/`git push` de shell.
 *
 * Principio de minimo privilegio: dos tokens con alcance distinto, nunca uno solo compartido.
 *   - METADATA_GH_TOKEN: Contents:Read-only, scope solo a los repos Flutter. Se usa nada mas
 *     para leer pubspec.yaml/README/manifest/etc. -- nunca escribe nada.
 *   - PORTFOLIO_GH_TOKEN: Contents:Read-and-write, scope solo a protafolioweb. Es el unico que
 *     puede comitear. Un tercer token (RELEASE_GH_TOKEN) vive solo en Codemagic y nunca llega
 *     a este repo -- ver codemagic.yaml de cada app.
 */
import { withRetry } from "./retry";

const GITHUB_API = "https://api.github.com";

function metadataAuthHeaders(accept = "application/vnd.github+json") {
  const token = process.env.METADATA_GH_TOKEN;
  if (!token) throw new Error("Falta METADATA_GH_TOKEN en el entorno");
  return { Accept: accept, "X-GitHub-Api-Version": "2022-11-28", Authorization: `Bearer ${token}` };
}

function portfolioAuthHeaders(accept = "application/vnd.github+json") {
  const token = process.env.PORTFOLIO_GH_TOKEN;
  if (!token) throw new Error("Falta PORTFOLIO_GH_TOKEN en el entorno");
  return { Accept: accept, "X-GitHub-Api-Version": "2022-11-28", Authorization: `Bearer ${token}` };
}

/** Contenido crudo de un archivo de un repo Flutter, o null si no existe (404). Solo lectura. */
export async function getRawFile(owner: string, repo: string, filePath: string): Promise<string | null> {
  return withRetry(async () => {
    const res = await fetch(`${GITHUB_API}/repos/${owner}/${repo}/contents/${filePath}`, {
      headers: metadataAuthHeaders("application/vnd.github.raw"),
    });
    if (res.status === 404) return null;
    if (!res.ok) throw new Error(`GET ${owner}/${repo}/${filePath} -> HTTP ${res.status}`);
    return res.text();
  });
}

/** Bytes crudos de un archivo binario (p. ej. un icono), o null si no existe. Solo lectura. */
export async function getRawFileBuffer(owner: string, repo: string, filePath: string): Promise<Buffer | null> {
  return withRetry(async () => {
    const res = await fetch(`${GITHUB_API}/repos/${owner}/${repo}/contents/${filePath}`, {
      headers: metadataAuthHeaders("application/vnd.github.raw"),
    });
    if (res.status === 404) return null;
    if (!res.ok) throw new Error(`GET ${owner}/${repo}/${filePath} -> HTTP ${res.status}`);
    return Buffer.from(await res.arrayBuffer());
  });
}

/** Lista nombres de entradas en una carpeta del repo (para detectar plataformas: android/ios/windows). */
export async function listDir(owner: string, repo: string, dirPath: string): Promise<string[]> {
  return withRetry(async () => {
    const res = await fetch(`${GITHUB_API}/repos/${owner}/${repo}/contents/${dirPath}`, {
      headers: metadataAuthHeaders(),
    });
    if (res.status === 404) return [];
    if (!res.ok) throw new Error(`GET ${owner}/${repo}/${dirPath} -> HTTP ${res.status}`);
    const entries = (await res.json()) as { name: string }[];
    return entries.map((e) => e.name);
  });
}

async function putFile(filePath: string, base64Content: string, message: string): Promise<void> {
  const [owner, repo] = portfolioRepo();
  await withRetry(async () => {
    const getRes = await fetch(`${GITHUB_API}/repos/${owner}/${repo}/contents/${filePath}`, {
      headers: portfolioAuthHeaders(),
    });
    const sha = getRes.ok ? ((await getRes.json()) as { sha: string }).sha : undefined;

    const putRes = await fetch(`${GITHUB_API}/repos/${owner}/${repo}/contents/${filePath}`, {
      method: "PUT",
      headers: portfolioAuthHeaders(),
      body: JSON.stringify({ message, content: base64Content, sha, branch: "main" }),
    });
    if (!putRes.ok) {
      throw new Error(`PUT ${filePath} en portafolio -> HTTP ${putRes.status}: ${await putRes.text()}`);
    }
  });
}

/**
 * Crea o actualiza un archivo de texto EN EL REPO DEL PORTAFOLIO (a diferencia de las funciones
 * de arriba, que solo leen de los repos Flutter con un token distinto).
 */
export async function putPortfolioFile(filePath: string, content: string, message: string): Promise<void> {
  await putFile(filePath, Buffer.from(content, "utf8").toString("base64"), message);
}

/** Igual que putPortfolioFile pero para binarios (iconos descargados de un repo Flutter). */
export async function putPortfolioBinaryFile(filePath: string, buffer: Buffer, message: string): Promise<void> {
  await putFile(filePath, buffer.toString("base64"), message);
}

function portfolioRepo(): [string, string] {
  const value = process.env.PORTFOLIO_REPO ?? "AngelDevRD/protafolioweb";
  const [owner, repo] = value.split("/");
  return [owner, repo];
}
