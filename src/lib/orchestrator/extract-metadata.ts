/**
 * Extrae automaticamente los metadatos de una app Flutter directamente desde su repo (via la
 * Contents API de GitHub) para que el alta de una app nueva en el catalogo nunca requiera editar
 * un JSON a mano. Si un dato no se puede determinar, se agrega a `warnings` y el campo queda
 * vacio/ausente -- nunca bloquea el proceso.
 */
import { getRawFile, getRawFileBuffer, listDir } from "./github-content";

export interface ExtractedMetadata {
  name?: string;
  tagline?: string;
  description?: string;
  version?: string;
  packageId?: string;
  tags: string[];
  iconBuffer?: Buffer;
  warnings: string[];
}

const ICON_CANDIDATES = [
  "assets/icon/icon.png",
  "assets/icon.png",
  "assets/images/icon.png",
  "assets/app_icon.png",
  "assets/icons/icon.png",
];

function firstReadmeParagraph(readme: string): string | undefined {
  const withoutTitle = readme.replace(/^#.*\n+/, "");
  const paragraph = withoutTitle
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .find((p) => p.length > 0 && !p.startsWith("#") && !p.startsWith("!["));
  return paragraph?.replace(/\s+/g, " ").trim();
}

async function extractPubspec(owner: string, repo: string, warnings: string[]) {
  const raw = await getRawFile(owner, repo, "pubspec.yaml");
  if (!raw) {
    warnings.push("pubspec.yaml no encontrado");
    return {};
  }
  const version = raw.match(/^version:\s*(\S+)/m)?.[1];
  const tagline = raw.match(/^description:\s*["']?(.*?)["']?\s*$/m)?.[1];
  if (!version) warnings.push("pubspec.yaml sin campo version");
  if (!tagline) warnings.push("pubspec.yaml sin campo description (se usa como tagline)");
  return { version, tagline };
}

async function extractPackageId(owner: string, repo: string, warnings: string[]) {
  const kts = await getRawFile(owner, repo, "android/app/build.gradle.kts");
  const groovy = kts ? null : await getRawFile(owner, repo, "android/app/build.gradle");
  const source = kts ?? groovy;
  const packageId = source?.match(/applicationId\s*=?\s*["']([\w.]+)["']/)?.[1];
  if (!packageId) warnings.push("applicationId no encontrado en android/app/build.gradle(.kts)");
  return packageId;
}

async function extractDisplayName(owner: string, repo: string, warnings: string[]) {
  const infoPlist = await getRawFile(owner, repo, "ios/Runner/Info.plist");
  const fromIos = infoPlist?.match(/<key>CFBundleDisplayName<\/key>\s*<string>(.*?)<\/string>/)?.[1];
  if (fromIos) return fromIos;

  const manifest = await getRawFile(owner, repo, "android/app/src/main/AndroidManifest.xml");
  const fromAndroid = manifest?.match(/android:label="([^"]+)"/)?.[1];
  if (fromAndroid && !fromAndroid.startsWith("@")) return fromAndroid; // "@string/..." no es texto usable

  warnings.push("nombre para mostrar no encontrado en Info.plist ni AndroidManifest.xml, se usa el nombre del repo");
  return undefined;
}

async function extractDescription(owner: string, repo: string, warnings: string[]) {
  const readme = await getRawFile(owner, repo, "README.md");
  const paragraph = readme ? firstReadmeParagraph(readme) : undefined;
  if (!paragraph) warnings.push("README.md sin un primer parrafo utilizable como descripcion");
  return paragraph;
}

async function extractPlatforms(owner: string, repo: string): Promise<string[]> {
  const root = await listDir(owner, repo, "");
  const tags = ["Flutter"];
  if (root.includes("android")) tags.push("Android");
  if (root.includes("windows")) tags.push("Windows");
  if (root.includes("ios")) tags.push("iOS");
  return tags;
}

async function extractIcon(owner: string, repo: string, warnings: string[]) {
  for (const candidate of ICON_CANDIDATES) {
    const buffer = await getRawFileBuffer(owner, repo, candidate);
    if (buffer) return buffer;
  }
  warnings.push(`icono no encontrado (se probaron: ${ICON_CANDIDATES.join(", ")})`);
  return undefined;
}

export async function extractMetadata(owner: string, repo: string): Promise<ExtractedMetadata> {
  const warnings: string[] = [];

  const [pubspec, packageId, name, description, tags, iconBuffer] = await Promise.all([
    extractPubspec(owner, repo, warnings),
    extractPackageId(owner, repo, warnings),
    extractDisplayName(owner, repo, warnings),
    extractDescription(owner, repo, warnings),
    extractPlatforms(owner, repo),
    extractIcon(owner, repo, warnings),
  ]);

  return {
    name,
    tagline: pubspec.tagline,
    description,
    version: pubspec.version,
    packageId,
    tags,
    iconBuffer,
    warnings,
  };
}
