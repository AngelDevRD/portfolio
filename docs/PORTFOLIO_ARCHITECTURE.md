# Arquitectura del portafolio

## Resumen general

**Objetivo:** portafolio personal de Angel Daniel Genao Santamaria + "tienda de
aplicaciones" (App Store propia) que distribuye APKs de Flutter fuera de Google Play, con
landing pages de proyectos web/SaaS de clientes.

**Arquitectura:** monolito Next.js (App Router) que sirve tanto el sitio público como su
propia API (`/api/*`), con contenido de catálogo en archivos JSON planos (no hay base de
datos de proyectos) y Supabase solo para dos cosas puntuales: contador de descargas y
buzón de sugerencias. No hay build system separado para backend: todo vive en el mismo
proyecto Next.js.

**Framework:** Next.js 16 (App Router, Turbopack) · React 19 · TypeScript · Tailwind CSS 3.

## Stack tecnológico

| Capa | Tecnología |
|---|---|
| Framework | Next.js 16.2 (App Router, Server Components, Route Handlers) |
| UI | React 19, Tailwind CSS 3, framer-motion, lucide-react |
| Formularios | react-hook-form + zod (`@hookform/resolvers`) |
| Email | Resend (`src/lib/mail.ts`) |
| Datos de catálogo | Archivos JSON en `content/projects/**` validados con Zod |
| Enriquecimiento | API pública de GitHub (releases, stars, lenguajes, contribuidores) |
| Persistencia puntual | Supabase (contador de descargas, tabla `suggestions`) |
| Auth admin | Cookie httpOnly con hash sha256 de una contraseña única (`ADMIN_PASSWORD`), sin usuarios ni roles |
| Hosting | Vercel (ver [DEPLOYMENT.md](./DEPLOYMENT.md)) |

## Estructura del repositorio

```
portfolio/
├── content/projects/
│   ├── mobile/*.json        # apps + juegos Flutter (schema mobileProjectSchema)
│   └── web/*.json           # SaaS + landings (schema webProjectSchema)
├── docs/                    # esta carpeta
├── public/
│   ├── apps/<slug>/icon.png # icono de cada proyecto, servido estático
│   ├── me.png, cv.pdf
├── src/
│   ├── app/
│   │   ├── page.tsx                     # home (todas las secciones del portfolio)
│   │   ├── apps/page.tsx                # listado "App Store"
│   │   ├── apps/[slug]/page.tsx         # ficha de detalle (mobile o web)
│   │   ├── admin/                       # panel simple protegido por cookie
│   │   └── api/
│   │       ├── projects/route.ts                    # catálogo completo (filtrable)
│   │       ├── projects/mobile/route.ts             # solo apps/juegos
│   │       ├── projects/web/route.ts                # solo SaaS/landings
│   │       ├── projects/[slug]/route.ts             # ficha de un proyecto
│   │       ├── projects/[slug]/download/route.ts    # proxy de descarga de APK
│   │       ├── projects/[slug]/update/route.ts       # auto-actualización in-app
│   │       ├── contact/route.ts
│   │       ├── suggestions/route.ts
│   │       └── admin/login/route.ts
│   ├── components/          # ui/, layout/, sections/, forms/, apps/, projects/, admin/
│   ├── data/                # accesores tipados (getAllProjects, getMobileProjects, …)
│   └── lib/
│       ├── projects/        # schema.ts, filter.ts, repository.ts (interfaz), json-repository.ts, factory.ts
│       ├── github/          # enrichment.ts (lectura en vivo de GitHub), types.ts
│       ├── storage/         # apk-provider.ts (interfaz), github-apk-provider.ts, factory.ts
│       ├── downloads/counter.ts   # contador en Supabase
│       ├── auth.ts, mail.ts, supabase.ts, site.ts, validations.ts, utils.ts
├── tools/
│   └── verify-release-version.mjs   # validación de versionado (ver VERSIONING.md)
└── .claude/launch.json      # config del dev server para el Browser pane
```

## Patrón: repositorio + fábrica (intercambiable sin tocar el resto del sistema)

Dos ejemplos del mismo patrón en este repo, pensado para poder cambiar de proveedor sin
tocar rutas ni componentes:

1. **Catálogo de proyectos** — `ProjectRepository` (interfaz) → `JsonProjectRepository`
   (implementación actual, lee `content/projects/**`) → seleccionado en
   `src/lib/projects/factory.ts` vía `PROJECTS_REPOSITORY_DRIVER` (default `"json"`). Ya
   hay un comentario placeholder para una futura `SupabaseProjectRepository`.
2. **Origen de las APK** — `ApkStorageProvider` (interfaz) → `GithubReleaseApkProvider`
   (implementación actual, lee GitHub Releases) → seleccionado en
   `src/lib/storage/factory.ts` vía `APK_STORAGE_DRIVER` (default `"github"`). Migrar a
   Cloudflare R2 o S3 en el futuro implica solo escribir una nueva clase que implemente
   `getApk()` y registrarla en el factory — la ruta `/api/projects/[slug]/download` no
   cambia.

Regla: **cualquier nueva fuente de datos o almacenamiento externo debe seguir este mismo
patrón** (interfaz + implementación + factory con env var), no acoplar el código de la ruta
directamente al proveedor.

## Flujo de navegación

```
/                    → Hero, About, Skills, Projects (web), AppStorePreview, Contact, Suggest
/apps                → listado completo de mobile + web (AppExplorer / ProjectExplorer)
/apps/[slug]         → ficha de detalle unificada (mobile o web, misma plantilla)
/admin/login         → login con ADMIN_PASSWORD
/admin               → panel protegido (cookie httpOnly)
```

## Estado de los proyectos

Ver el índice completo y actualizado en [PROJECTS.md](./PROJECTS.md). Resumen rápido: todos
los proyectos del catálogo están en `status: "development"`, ninguno `featured`. El estado
real (terminado/oculto/en progreso) se gestiona por proyecto vía el campo `status` del JSON
(`development | beta | published | maintenance | archived`) — no hay un estado "oculto"
dedicado; para ocultar un proyecto de la tienda hoy hay que quitar su archivo JSON de
`content/projects/`.

## Convenciones

- **Slugs**: kebab-case, coinciden con el nombre de archivo JSON y con la carpeta en
  `public/apps/<slug>/`.
- **Contenido de catálogo**: nunca se edita a mano sin pasar por el schema Zod
  (`src/lib/projects/schema.ts`) — un JSON inválido rompe el build (`json-repository.ts`
  lanza en `loadDir` si `safeParse` falla).
- **`downloadName`** (opcional, en `projectBaseSchema`): nombre de archivo real para la
  descarga de la APK (sin espacios ni extensión). Si falta, se deriva de `name`
  (`apkFilename()` en `src/lib/storage/apk-provider.ts`).
- **Iconos**: PNG con fondo transparente, esquinas redondeadas ya "horneadas" en la imagen,
  sin matte blanco en las esquinas del canvas (ver nota histórica en
  [CHANGELOG.md](./CHANGELOG.md) sobre el bug de Finanzas360).
- **Nunca** exponer `GITHUB_TOKEN` ni `SUPABASE_SERVICE_ROLE_KEY` al cliente — toda llamada
  a la API de GitHub o a Supabase con rol de servicio ocurre en Route Handlers / Server
  Components.
- **Responsividad**: usar las utilidades ya existentes (`.section`, `sm:`/`lg:` grid
  breakpoints, `truncate`, `min-w-0`, `flex-wrap`) en vez de introducir anchos fijos en
  píxeles.
