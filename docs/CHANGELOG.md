# Changelog de arquitectura y decisiones

Historial de cambios no triviales de este repositorio (portafolio). No es un changelog de
producto para usuarios finales — es memoria de decisiones para sesiones futuras. Entradas
más recientes primero.

## 2026-07-11 — Documentación, catálogo, iconos, descargas y updater

- **Documentación**: creada la carpeta `docs/` completa (este documento y sus hermanos).
  Antes no existía documentación técnica del portafolio; cada sesión tenía que re-analizar
  el repo desde cero.
- **Tower agregado al catálogo**: `content/projects/mobile/stack-tower.json` (slug
  `stack-tower`, repo `AngelDevRD/stack_tower`, release `v1.0.0` ya publicado). Antes tenía
  repo y release pero no aparecía en el portafolio.
- **Iconos**: asignados/corregidos para memory-cards, finanzas360, gymflow, luna-bistro,
  nexfit, nexora-crm, nova-dental, number-merge, snake-evolution, stack-tower,
  vertex-studio. `gymflow` y `nexora-crm` tenían el JSON apuntando a
  `/apps/<slug>/icon.png` pero la carpeta no existía — quedó creada.
- **Bug de icono con borde blanco**: los PNG fuente traían un matte blanco de ~1-3px en las
  esquinas del canvas (visible como halo en modo oscuro o sobre fondos no blancos),
  incluyendo el icono viejo de Finanzas360 (que además tenía un margen blanco mucho más
  grande, cerca del 40% del canvas). Corregido con flood-fill desde las esquinas (tolerancia
  sobre blanco puro) para hacer transparente solo el matte, preservando la forma
  redondeada del icono. Script usado: ver `process_icons.py` (no versionado, corrido
  ad-hoc; documentar aquí en vez de dejarlo como script permanente porque no hay pipeline
  de iconos recurrente todavía).
- **Descarga de APK**: `GET /api/projects/[slug]/download` ya no redirige (302) al asset de
  GitHub — ahora siempre streamea el binario desde el servidor, lo que permite forzar
  `Content-Disposition` con el nombre real del proyecto (`Finanzas360.apk` en vez de
  `app-release.apk`, que es como GitHub nombra el asset en todos los releases). Se
  introdujo el campo opcional `downloadName` en el schema de proyectos y la abstracción
  `ApkStorageProvider` (`src/lib/storage/`) para poder migrar a Cloudflare R2/S3 en el
  futuro sin tocar la ruta HTTP.
- **Endpoint `update` endurecido**: ahora expone `apk_size_bytes` y `apk_sha256` (este
  último tomado del campo `digest` que GitHub ya calcula nativamente sobre cada asset del
  release — no se calculaba a mano).
- **Versionado**: agregado `tools/verify-release-version.mjs`, validado contra casos reales
  (compara semver explícito, o contra el último release publicado de un repo de GitHub).
  Aún no integrado en el CI de los repos Flutter (viven fuera de este workspace).
- **Responsividad**: auditado el portafolio en 375/768/1280px (home, `/apps`,
  `/apps/[slug]`, `/admin/login`) — sin overflow horizontal ni tap targets rotos en ningún
  breakpoint. El código ya usaba `.section`, grids con breakpoints, `truncate`, `min-w-0` y
  `flex-wrap` de forma consistente; no se encontraron regresiones que corregir.

## Antes de 2026-07-11

Sin registro — no existía este documento. Usar `git log` para el historial de commits
anterior a esta fecha.
