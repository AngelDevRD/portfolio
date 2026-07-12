# API (`src/app/api/**`)

Todas las rutas son Route Handlers de Next.js. Ninguna requiere autenticación salvo
`/api/admin/*`. Ninguna acepta CORS especial (mismo origen).

## Catálogo de proyectos

### `GET /api/projects`
Lista todo el catálogo (mobile + web), enriquecido en vivo con GitHub y el contador de
descargas. Cachea 30 min (`revalidate = 1800`).

Query params (todos opcionales, vía `parseFilterFromRequest`):
- `tags` — coma-separado, AND (debe tener todos)
- `status` — `development | beta | published | maintenance | archived`
- `category`
- `q` — búsqueda libre en nombre/descripción/tags

Respuesta: `{ data: EnrichedProject<CatalogProject>[] }`

### `GET /api/projects/mobile` / `GET /api/projects/web`
Igual que el anterior pero filtrado por tipo. Mismos query params.

### `GET /api/projects/[slug]`
Ficha de un proyecto. 404 si no existe. `{ data: EnrichedProject<CatalogProject> }`.

## Descarga de APK

### `GET /api/projects/[slug]/download`
Proxy de descarga. 404 si el proyecto no existe o no es `mobile`. Streamea **siempre** el
binario a través del servidor (nunca redirige al origen real) usando
`getApkStorageProvider()` (ver [UPDATE_SYSTEM.md](./UPDATE_SYSTEM.md) y
`src/lib/storage/`). Si no hay ningún asset publicado, redirige a
`https://github.com/<repo>/releases` como fallback.

Headers de la respuesta:
- `Content-Type: application/vnd.android.package-archive`
- `Content-Disposition: attachment; filename="<NombreReal>.apk"` — el nombre viene de
  `downloadName` en el JSON del proyecto, o se deriva de `name` (`apkFilename()`)
- `Content-Length` cuando el proveedor lo reporta

Efecto secundario: incrementa el contador de descargas en Supabase
(`incrementDownloadCount`) antes de responder.

## Auto-actualización in-app

### `GET /api/projects/[slug]/update`
Ver contrato completo en [UPDATE_SYSTEM.md](./UPDATE_SYSTEM.md). Cachea 30 min.

Respuesta:
```json
{
  "version": "v1.2.0",
  "minSupportedVersion": null,
  "apk_url": "https://.../api/projects/<slug>/download",
  "apk_size_bytes": 49660208,
  "apk_sha256": "sha256:ba5ff985...",
  "changes": ["Corrige crash al abrir", "Nuevo icono"],
  "releaseDate": "2026-07-11T00:09:22Z"
}
```

## Formularios

### `POST /api/contact`
Body validado con `contactSchema` (zod, `src/lib/validations.ts`): `name`, `email`,
`subject`, `message`, `company` (honeypot). Si `company` viene relleno, responde `{ok:true}`
sin enviar nada (bot). Envía correo vía Resend (`sendMail`). 422 si falla la validación, 502
si falla el envío.

### `POST /api/suggestions`
Body validado con `suggestionSchema`. Guarda en la tabla `suggestions` de Supabase (si está
configurado) **y** notifica por correo. Honeypot igual que contacto. Si Supabase no está
configurado y el correo falla, responde 502; si al menos uno de los dos funcionó, `{ok:true}`.

## Admin

### `POST /api/admin/login`
Body `{ password }`. Compara contra `process.env.ADMIN_PASSWORD` (comparación simple, sin
hashing de la contraseña en reposo — v1, un solo admin). Si coincide, setea cookie httpOnly
`ADMIN_COOKIE` con `sha256(password)`, `sameSite=lax`, `maxAge=8h`. 401 si no coincide, 500
si `ADMIN_PASSWORD` no está seteada en el server.

### `DELETE /api/admin/login`
Logout: borra la cookie.

## Convenciones de la API

- Todas las respuestas de error usan `{ error: string }` (y a veces `issues` con el detalle
  de zod en 422).
- Ninguna ruta expone `GITHUB_TOKEN` ni `SUPABASE_SERVICE_ROLE_KEY` al cliente.
- Cambiar el contrato de cualquiera de estas rutas (nuevo campo, nuevo código de estado)
  requiere actualizar este documento en el mismo cambio.
