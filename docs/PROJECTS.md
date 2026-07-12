# Índice de proyectos

Fuente de verdad estructural: `content/projects/mobile/*.json` y `content/projects/web/*.json`.
Los campos de versión/build/fecha de este documento son una **foto** tomada el 2026-07-11 —
la fuente de verdad en vivo siempre es la API de GitHub (leída por
`src/lib/github/enrichment.ts`, cacheada 30 min) y el endpoint `GET /api/projects`. Actualizar
esta tabla cada vez que se agregue o retire un proyecto del catálogo.

## Apps (Flutter, distribución fuera de Google Play)

| Nombre | Slug | Estado | Tecnologías | Package ID | Repo | Última versión | Icono | Ruta |
|---|---|---|---|---|---|---|---|---|
| Finanzas360 | `finanzas360` | development | Flutter, Android | `com.angeldevrd.finanzas360` | [AngelDevRD/finanzas360](https://github.com/AngelDevRD/finanzas360) | v1.0.0 | `/apps/finanzas360/icon.png` | `/apps/finanzas360` |
| MiTienda 360 | `mi-negocio` | development | Flutter, Android, Offline-first | `com.angeldevrd.appgestion` | [AngelDevRD/mi-negocio](https://github.com/AngelDevRD/mi-negocio) | v1.1.0 | `/apps/mi-negocio/icon.png` | `/apps/mi-negocio` |
| NexFit | `nexfit` | development | Flutter, Android | `com.angeldevrd.nexfit` | [AngelDevRD/nexfit](https://github.com/AngelDevRD/nexfit) | v1.0.0 | `/apps/nexfit/icon.png` | `/apps/nexfit` |

Detalle completo en [APPS.md](./APPS.md).

## Juegos (Flutter, distribución fuera de Google Play)

| Nombre | Slug | Estado | Categoría | Package ID | Repo | Última versión | Icono | Ruta |
|---|---|---|---|---|---|---|---|---|
| Snake Evolution | `snake-evolution` | development | Arcade | `com.portfolio.snakeevolution.snake_evolution` | [AngelDevRD/snake_evolution](https://github.com/AngelDevRD/snake_evolution) | v1.0.1 | `/apps/snake-evolution/icon.png` | `/apps/snake-evolution` |
| Number Merge | `number-merge` | development | Puzzle | `com.portfolio.numbermerge.number_merge` | [AngelDevRD/number_merge](https://github.com/AngelDevRD/number_merge) | v1.0.1 | `/apps/number-merge/icon.png` | `/apps/number-merge` |
| Memory Cards | `memory-cards` | development | Puzzle | `com.portfolio.memorycards.memory_cards` | [AngelDevRD/memory_cards](https://github.com/AngelDevRD/memory_cards) | v1.0.1 | `/apps/memory-cards/icon.png` | `/apps/memory-cards` |
| Tower | `stack-tower` | development | Arcade | `com.portfolio.stacktower.stack_tower` | [AngelDevRD/stack_tower](https://github.com/AngelDevRD/stack_tower) | v1.0.0 | `/apps/stack-tower/icon.png` | `/apps/stack-tower` |

Detalle completo en [GAMES.md](./GAMES.md).

## SaaS (Next.js)

| Nombre | Slug | Estado | Tecnologías | Repo | Demo | Icono | Ruta |
|---|---|---|---|---|---|---|---|
| GymFlow | `gymflow` | development | Next.js, SaaS, Prisma | [AngelDevRD/gymflow](https://github.com/AngelDevRD/gymflow) | [demo](https://gymflow-flax-ten.vercel.app) | `/apps/gymflow/icon.png` | `/apps/gymflow` |
| Nexora CRM | `nexora-crm` | development | Next.js, SaaS, Prisma, Stripe | [AngelDevRD/nexora-crm](https://github.com/AngelDevRD/nexora-crm) | [demo](https://nexora-crm-flax.vercel.app) | `/apps/nexora-crm/icon.png` | `/apps/nexora-crm` |

Detalle completo en [SAAS.md](./SAAS.md).

## Landing pages

| Nombre | Slug | Categoría | Tecnologías | Repo | Demo | Icono | Ruta |
|---|---|---|---|---|---|---|---|
| Luna Bistro | `luna-bistro` | Restaurante | Next.js | [AngelDevRD/luna-bistro](https://github.com/AngelDevRD/luna-bistro) | [demo](https://luna-bistro-gamma.vercel.app) | `/apps/luna-bistro/icon.png` | `/apps/luna-bistro` |
| Nova Dental | `nova-dental` | Clínica dental | HTML, CSS, JS | [AngelDevRD/nova-dental](https://github.com/AngelDevRD/nova-dental) | [demo](https://nova-dental-ecru.vercel.app) | `/apps/nova-dental/icon.png` | `/apps/nova-dental` |
| Vertex Studio | `vertex-studio` | Agencia digital | Next.js | [AngelDevRD/vertex-studio](https://github.com/AngelDevRD/vertex-studio) | [demo](https://vertex-studio-pied.vercel.app) | `/apps/vertex-studio/icon.png` | `/apps/vertex-studio` |

## Resumen por estado

Todos los proyectos están actualmente en `status: "development"` y ninguno tiene
`featured: true`. Ninguno tiene capturas de pantalla cargadas (`screenshots: []`) todavía.

## Cómo agregar un proyecto nuevo (checklist)

1. Crear `content/projects/mobile/<slug>.json` o `content/projects/web/<slug>.json`
   siguiendo `src/lib/projects/schema.ts` (slug kebab-case, `repo` en formato `owner/repo`).
2. Crear `public/apps/<slug>/icon.png` (PNG, fondo transparente, sin matte blanco en las
   esquinas — ver convención en [PORTFOLIO_ARCHITECTURE.md](./PORTFOLIO_ARCHITECTURE.md)).
3. Si es mobile: confirmar que el repo tenga al menos un GitHub Release con un asset `.apk`
   (si no, la descarga cae al fallback `https://github.com/<repo>/releases`).
4. Añadir su fila en la tabla correspondiente de este documento y su ficha en
   `APPS.md` / `GAMES.md` / `SAAS.md`.
5. Registrar el cambio en [CHANGELOG.md](./CHANGELOG.md).
