# Portafolio + Mini App Store

Sitio web personal inspirado en Apple: portafolio profesional **y** una pequeña App Store para tus aplicaciones. Construido con **Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS · Framer Motion**. Modo claro/oscuro, glassmorphism, parallax, animaciones al scroll, SEO, PWA y accesibilidad.

---

## ✨ Características

- **Inicio** con animación de entrada, parallax y llamadas a la acción.
- **Sobre mí**, **Habilidades** (barras animadas) y **Proyectos** (búsqueda + filtros).
- **Mini App Store** con tarjetas estilo Apple, buscador, filtros y orden (populares / recientes / mejor valoradas).
- **Página individual** por app: galería, video, características, requisitos, historial de cambios, descargar / compartir / reportar.
- **Formulario de contacto** y **"Propón una aplicación"** con validación (Zod + React Hook Form).
- **Panel `/admin`** protegido con contraseña: estadísticas + buzón de sugerencias.
- **SEO** completo: Open Graph, Twitter Cards, `sitemap.xml`, `robots.txt`, imagen OG dinámica, manifest PWA.
- **Accesibilidad**: navegación por teclado, foco visible, ARIA, `prefers-reduced-motion`.

---

## 🚀 Ejecutar en local

Requisitos: **Node.js 18.18+** (recomendado 20+).

```bash
# 1. Instalar dependencias
npm install

# 2. Copiar variables de entorno
cp .env.example .env.local      # en Windows PowerShell: copy .env.example .env.local

# 3. Arrancar el servidor de desarrollo
npm run dev
```

Abre <http://localhost:3000>.

---

## 🔧 Variables de entorno

Edita `.env.local` (todo es **opcional** para desarrollo; el sitio funciona sin claves, pero los correos no se enviarán realmente):

| Variable | Para qué |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | URL pública (sitemap, OG, canonical). |
| `RESEND_API_KEY` | Envío de correos (contacto y sugerencias). [resend.com](https://resend.com) |
| `CONTACT_FROM_EMAIL` | Remitente verificado en Resend. |
| `CONTACT_TO_EMAIL` | Tu correo donde recibes los mensajes. |
| `NEXT_PUBLIC_SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY` | Guardar sugerencias en base de datos. |
| `ADMIN_PASSWORD` | Contraseña del panel `/admin`. |

> Sin `RESEND_API_KEY` los formularios responden OK pero solo registran en consola (modo desarrollo). Sin Supabase, las sugerencias llegan solo por correo.

### Tabla de Supabase (opcional)

En el **SQL Editor** de Supabase:

```sql
create table suggestions (
  id uuid primary key default gen_random_uuid(),
  name text,
  email text not null,
  title text not null,
  description text not null,
  reason text,
  recommend text,
  problem text,
  category text,
  created_at timestamptz default now()
);
```

---

## 📝 Añadir proyectos y apps (sin tocar código)

Todo el contenido vive en JSON. Añade un objeto al array y listo:

- **Proyectos** → [`src/data/projects.json`](src/data/projects.json)
- **Aplicaciones** → [`src/data/apps.json`](src/data/apps.json)
- **Habilidades** → [`src/data/skills.ts`](src/data/skills.ts)
- **Tus datos / redes / branding** → [`src/lib/site.ts`](src/lib/site.ts)

Las imágenes e iconos van en `/public` (o usa URLs remotas). Cada app crea automáticamente su página en `/apps/<slug>`, aparece en la App Store y en el `sitemap.xml`.

### Ejemplo de app (apps.json)

```json
{
  "slug": "mi-app",
  "name": "Mi App",
  "tagline": "Frase corta.",
  "description": "Descripción larga…",
  "icon": "/apps/mi-app/icon.png",
  "screenshots": ["/apps/mi-app/1.png", "/apps/mi-app/2.png"],
  "video": "",
  "version": "1.0.0",
  "category": "Productividad",
  "platform": "Android",
  "size": "20 MB",
  "rating": 4.6,
  "downloads": 1200,
  "updatedAt": "2026-07-01",
  "tech": ["Flutter"],
  "features": ["Rápida", "Bonita"],
  "requirements": ["Android 8+"],
  "changelog": [{ "version": "1.0.0", "date": "2026-07-01", "changes": ["Lanzamiento"] }],
  "links": { "download": "https://…", "more": "" }
}
```

`platform` acepta: `Web`, `Android`, `Windows`, `Herramientas`, `IA`, `Juegos`.

---

## 🖼️ Reemplazar tu foto

Sustituye `public/me.svg` por tu foto (por ejemplo `public/me.jpg`) y actualiza `avatar` en [`src/lib/site.ts`](src/lib/site.ts). Pon también tu CV en `public/cv.pdf`.

---

## 🔐 Panel de administración

1. Define `ADMIN_PASSWORD` en `.env.local`.
2. Entra en `/admin` → te pedirá la contraseña.
3. Verás estadísticas y el buzón de sugerencias (si Supabase está configurado).

> Los proyectos/apps se gestionan por JSON (versionado en git), no desde una base de datos: es más simple, seguro y compatible con el hosting estático de Vercel.

---

## ☁️ Desplegar en Vercel

1. Sube el proyecto a un repositorio de GitHub.
2. En [vercel.com](https://vercel.com) → **New Project** → importa el repo.
3. En **Environment Variables**, añade las de `.env.example` que uses.
4. **Deploy**. Cada `git push` redespliega automáticamente.

Configura `NEXT_PUBLIC_SITE_URL` con tu dominio final para que el SEO y el sitemap usen la URL correcta.

---

## 🗂️ Estructura

```
src/
├─ app/                 # rutas (App Router)
│  ├─ page.tsx          # inicio (todas las secciones)
│  ├─ apps/             # App Store + páginas por app
│  ├─ admin/            # panel protegido
│  ├─ api/              # contact, suggestions, admin login
│  ├─ sitemap.ts robots.ts manifest.ts opengraph-image.tsx
│  └─ layout.tsx globals.css
├─ components/          # UI reutilizable (secciones, forms, apps, layout)
├─ data/               # projects.json, apps.json, skills.ts
├─ lib/                # site, tipos, validaciones, mail, supabase, auth, utils
└─ proxy.ts            # protege /admin (middleware de Next 16)
```

---

## 🧰 Stack

Next.js 15 · React 19 · TypeScript · Tailwind CSS · Framer Motion · Zod · React Hook Form · Lucide React · Supabase · Resend · Vercel.
