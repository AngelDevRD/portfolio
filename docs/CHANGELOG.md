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

## 2026-07-11 (continuación) — Fix de zoom inicial en móvil y correcciones en 4 repos Flutter

- **Zoom inicial en móvil**: causa raíz encontrada en `src/app/layout.tsx` — el `export const
  viewport` solo definía `themeColor`, sin `width`/`initialScale`. En Next.js, un `viewport`
  custom **reemplaza** el default en vez de complementarlo, así que el meta tag generado no
  incluía `width=device-width, initial-scale=1`. Los navegadores móviles entonces renderizaban
  el layout como si fuera de escritorio (~980px) y lo escalaban para que quepa — de ahí el
  "zoom" que se corregía solo al hacer zoom out manualmente. Fix: agregar `width:
  "device-width", initialScale: 1` al objeto `viewport`. Confirmado en el HTML generado
  (`<meta name="viewport" content="width=device-width, initial-scale=1">`). Se repitieron
  además los chequeos de `100vw`, anchos fijos, `min-width` y animaciones de carga pedidos
  explícitamente — ninguno era la causa; el único uso de `100vw` es en atributos `sizes` de
  `next/image` (correcto), y las animaciones de entrada (`Reveal`, `Hero`) solo usan
  `transform: translate` (no afecta el ancho de la caja).
- **Nombre/icono instalado de 4 apps Flutter** (repos fuera de este workspace, clonados y
  corregidos ad-hoc vía `gh`):
  - **Tower (`AngelDevRD/stack_tower`)**: `android:label` decía `"stack_tower"` (nombre
    interno) → corregido a `"Tower"`. Icono launcher reemplazado (usaba el genérico de
    Flutter) por el oficial. Publicado como `v1.0.1`.
  - **NexFit (`AngelDevRD/nexfit`)**: el `android:label` y el icono launcher **ya estaban
    corregidos** en commits previos (`22d2c6f`, `d9b20e4`, `84bfa4b`, `688f412`, todos del
    2026-07-11) pero nunca se había publicado un release con esos cambios — el APK instalada
    por el usuario seguía siendo la `v1.0.0` del 2026-07-05, de ahí que mostrara "AppGym" y el
    icono genérico. Se reemplazó además el texto interno "AppGym" visible en pantallas
    (login, lista de ejercicios, wearables, nombre del archivo de backup exportado) por
    "NexFit". Publicado como `v1.0.1`.
    - **Bug no relacionado detectado** (análisis, sin fix aplicado): `lib/core/app_config.dart`
      apunta por defecto a `http://10.0.2.2:8000` (loopback del emulador Android) cuando no se
      pasa `--dart-define=API_BASE_URL=...`, y el workflow de release
      (`flutter build apk --release`) no pasa ese override — la APK pública distribuida no
      puede conectar a ningún backend real. No es un problema del sistema de auto-actualización
      del portafolio; requiere la URL real del backend desplegado para corregirse.
  - **Finanzas360 (`AngelDevRD/finanzas360`)**: el icono adaptive ya estaba corregido en el
    commit `774461b` (2026-07-10, sesión previa) pero tampoco se había publicado — el pubspec
    ya estaba en `1.0.3+4` sin ningún tag/release correspondiente. Solo se publicó el HEAD
    existente como `v1.0.3` (sin cambios de código).
  - **Mi Negocio 360 (`AngelDevRD/mi-negocio`)**: bug real encontrado y corregido. Usa
    adaptive icon (`background` sólido + `foreground` con `inset="16%"` obligatorio en el
    XML). El foreground ya llenaba su propio canvas y su color de borde ya coincidía con el
    `ic_launcher_background`, pero el inset del 16% igual encogía todo el conjunto dejando un
    anillo de color plano visible alrededor del ícono real (confirmado simulando el render
    adaptive con máscara circular antes/después). Fix: escalar el contenido del foreground
    ~1.47× (`1 / (1 - 2×0.16)`) antes de recortarlo al canvas, para que tras el inset
    obligatorio el resultado visible llene el círculo completo — mismo principio que la
    corrección previa de Finanzas360. Publicado como `v1.1.1`.
  - Los 4 repos usan el mismo patrón de CI (`GitHub Actions` con trigger `on: push: tags:
    "v*.*.*"` → build + release), validado con `tools/verify-release-version.mjs` antes de
    cada tag.

## Antes de 2026-07-11

Sin registro — no existía este documento. Usar `git log` para el historial de commits
anterior a esta fecha.
