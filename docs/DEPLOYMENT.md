# Despliegue

## Hosting

Vercel (carpeta `.vercel/` presente en el repo). Build: `next build` (Next.js 16,
Turbopack). Sin configuración de infraestructura adicional (sin Docker, sin servidor propio).

## Variables de entorno

Ver `.env.example` (plantilla) — copiar a `.env.local` para desarrollo local y configurar
los mismos valores en el dashboard de Vercel (Project Settings → Environment Variables)
para producción.

| Variable | Uso | Obligatoria |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | URL absoluta del sitio, usada para generar `apk_url` en el endpoint `update` y metadatos OG | Sí en producción (default `http://localhost:3000`) |
| `RESEND_API_KEY` | Envío de correos de contacto/sugerencias | No — si falta, `sendMail` no envía pero no rompe la request |
| `CONTACT_FROM_EMAIL` | Remitente verificado en Resend | Recomendada |
| `CONTACT_TO_EMAIL` | Destino de los correos de contacto/sugerencias | Recomendada |
| `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Cliente público de Supabase (contador de descargas, lectura) | No — el contador degrada a 0 si falta |
| `SUPABASE_SERVICE_ROLE_KEY` | Cliente admin de Supabase (insertar sugerencias) — **solo servidor** | No — la tabla de sugerencias no se llena si falta |
| `ADMIN_PASSWORD` | Contraseña única del panel `/admin` | Sí para usar el panel (500 si falta y se intenta login) |
| `GITHUB_TOKEN` | Autenticación contra la API de GitHub (evita el rate-limit anónimo de 60 req/h; los 8 repos Flutter son públicos, gymflow y nexora-crm son privados) | Recomendada — sin ella, con poco tráfico ya se agota el límite anónimo y las apps dejan de mostrar versión y descarga |
| `PROJECTS_REPOSITORY_DRIVER` | Selecciona la implementación de `ProjectRepository` (`src/lib/projects/factory.ts`) | No, default `"json"` |
| `APK_STORAGE_DRIVER` | Selecciona la implementación de `ApkStorageProvider` (`src/lib/storage/factory.ts`) | No, default `"github"` |

## Dominios

No hay dominio custom confirmado en este repo — `NEXT_PUBLIC_SITE_URL` debe apuntar al
dominio real de producción una vez asignado en Vercel.

## Nota de seguridad

`GITHUB_TOKEN` y `SUPABASE_SERVICE_ROLE_KEY` deben configurarse **solo** como variables de
servidor en Vercel (nunca con prefijo `NEXT_PUBLIC_`). El código ya respeta esta separación
(ver `src/lib/github/enrichment.ts`, `src/lib/storage/github-apk-provider.ts` y
`src/lib/supabase.ts`) — no romper esa convención al tocar estos archivos.
