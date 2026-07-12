# Documentación del portafolio

Memoria técnica permanente del repo `portfolio` (portfolio-appstore). El objetivo de esta
carpeta es que ninguna sesión futura tenga que re-analizar el repositorio desde cero: cada
documento cubre una responsabilidad y se actualiza cuando el proyecto cambia en esa área.

## Índice

| Documento | Responsabilidad |
|---|---|
| [PORTFOLIO_ARCHITECTURE.md](./PORTFOLIO_ARCHITECTURE.md) | Visión general, stack, estructura de carpetas, convenciones |
| [PROJECTS.md](./PROJECTS.md) | Índice único de **todos** los proyectos del ecosistema (apps, juegos, SaaS, landings) |
| [APPS.md](./APPS.md) | Detalle de las apps Flutter distribuidas fuera de Google Play |
| [GAMES.md](./GAMES.md) | Detalle de los juegos Flutter |
| [SAAS.md](./SAAS.md) | Detalle de los proyectos SaaS (Next.js) |
| [API.md](./API.md) | Contrato de cada endpoint de `src/app/api` |
| [VERSIONING.md](./VERSIONING.md) | Política de versiones y su validación automática |
| [UPDATE_SYSTEM.md](./UPDATE_SYSTEM.md) | Sistema de auto-actualización in-app (contrato servidor + cliente) |
| [DEPLOYMENT.md](./DEPLOYMENT.md) | Despliegue, variables de entorno, dominios |
| [CHANGELOG.md](./CHANGELOG.md) | Historial de cambios relevantes de este repositorio |

## Regla de actualización (obligatoria)

Cuando un cambio de código toque una de estas áreas, el mismo cambio debe actualizar el
documento correspondiente en la misma sesión/commit:

- Nuevo proyecto (app, juego, SaaS o landing) → añadir fila en **PROJECTS.md** + su ficha en
  **APPS.md** / **GAMES.md** / **SAAS.md** según el tipo.
- Nuevo endpoint o cambio de contrato de uno existente → **API.md**.
- Cambio en la regla de versiones o en `tools/verify-release-version.mjs` → **VERSIONING.md**.
- Cambio en el endpoint `update`, en el proxy de descarga o en el contrato del cliente →
  **UPDATE_SYSTEM.md**.
- Cambio de variables de entorno, proveedor de hosting o dominio → **DEPLOYMENT.md**.
- Cualquier cambio no trivial → una línea en **CHANGELOG.md**.

No dejar esta tarea para "después": un documento desactualizado es peor que no tenerlo,
porque genera decisiones basadas en información falsa.
