# Apps (Flutter)

Apps Flutter de utilidad general, distribuidas **fuera de Google Play** vía GitHub Releases
+ el proxy de descarga de este portafolio. Ver el sistema completo en
[UPDATE_SYSTEM.md](./UPDATE_SYSTEM.md).

## Finanzas360

- **Slug:** `finanzas360` · **Package ID:** `com.angeldevrd.finanzas360`
- **Repo:** [AngelDevRD/finanzas360](https://github.com/AngelDevRD/finanzas360) (público)
- **Categoría:** Finanzas personales · **Tags:** Flutter, Android
- **Última versión publicada:** v1.0.3 (2026-07-11)
- **Icono web (portafolio):** `public/apps/finanzas360/icon.png` — corregido el 2026-07-11
  (tenía un matte blanco alrededor del ícono redondeado; ver [CHANGELOG.md](./CHANGELOG.md)).
- **Icono/nombre instalado (Android):** ya corregido en el repo desde el commit `774461b`
  (2026-07-10); solo faltaba publicar el release, hecho el 2026-07-11.
- **Descripción:** gestión y seguimiento de finanzas personales.

## MiTienda 360

- **Slug:** `mi-negocio` · **Package ID:** `com.angeldevrd.appgestion`
- **Repo:** [AngelDevRD/mi-negocio](https://github.com/AngelDevRD/mi-negocio) (público)
- **Categoría:** Negocios · **Tags:** Flutter, Android, Offline-first
- **Última versión publicada:** v1.1.1 (2026-07-11)
- **Icono:** `public/apps/mi-negocio/icon.png`
- **Icono instalado (Android):** corregido el 2026-07-11 — el adaptive icon dejaba un anillo
  del color de fondo visible (el `inset="16%"` del XML encogía el foreground otra vez pese a
  que ya llenaba su propio canvas). Ver [CHANGELOG.md](./CHANGELOG.md).
- **Descripción:** gestión de embutidoras, colmados y pequeños negocios alimenticios,
  pensada para funcionar sin conexión.

## NexFit

- **Slug:** `nexfit` · **Package ID:** `com.angeldevrd.nexfit`
- **Repo:** [AngelDevRD/nexfit](https://github.com/AngelDevRD/nexfit) (público, Flutter + FastAPI)
- **Categoría:** Fitness · **Tags:** Flutter, Android
- **Última versión publicada:** v1.0.1 (2026-07-11)
- **Icono:** `public/apps/nexfit/icon.png`
- **Nota:** el nombre/icono instalado mostraba "AppGym" (nombre de un rebrand anterior) por un
  release desactualizado; corregido publicando `v1.0.1` con el branding "NexFit" ya presente
  en el repo. Backend por defecto apunta a `http://10.0.2.2:8000` (solo funciona en emulador
  Android) — pendiente de fix, requiere la URL real del backend desplegado.
- **Descripción:** entrenador personal inteligente para gimnasio, con seguimiento de
  rutinas, entrenamientos y metas.
