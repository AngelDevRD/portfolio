# Política de versionado

## Regla oficial

1. Nunca publicar dos GitHub Releases con el mismo número de versión (tag).
2. `versionName` de la APK = tag del release sin la `v` (`--build-name`), lo inyecta el CI.
   `pubspec.yaml` **no** es fuente de verdad de versión (su `version:` es cosmético).
3. `versionCode` de la APK = `github.run_number` del workflow de release (`--build-number`),
   creciente por construcción. No borrar ni recrear el workflow en otra ruta sin revisar el
   contador (ver CHANGELOG 2026-09-08, caso mi-negocio).
4. La versión nueva debe ser **estrictamente mayor** (semver: major.minor.patch) que la
   última ya publicada. Si no lo es, el proceso de release debe **fallar automáticamente**,
   no publicarse "con una advertencia".

## Cómo se publica una versión (estado actual, los 8 repos Flutter)

- **Automático (lo normal):** `git push` a la rama por defecto (`master`; `main` en anivault)
  con cambios en `lib/`, `android/`, `assets/`, `windows/` o `pubspec.*`. El job `version`
  del workflow toma el último release publicado y suma 1 al patch (`v1.0.3` → `v1.0.4`),
  compila, firma y publica el release con ese tag. Pushes que solo tocan docs/CI no publican.
- **Saltar un push:** incluir `[skip release]` en el mensaje del commit.
- **Versión explícita (minor/major):** `git tag v2.0.0 && git push origin v2.0.0`.
- Ningún paso toca este repo ni requiere redeploy de Vercel: el portafolio lee el release en
  vivo (ver [UPDATE_SYSTEM.md](./UPDATE_SYSTEM.md)).

## Por qué la fuente de verdad es el tag del release, no un campo aparte

Este repo (el portafolio) **no** persiste `versionName`/`versionCode` en ningún JSON de
`content/projects/`. El endpoint `/api/projects/[slug]/update` lee la versión en vivo del
tag del último GitHub Release (`project.github.latestVersion`, calculado en
`src/lib/github/enrichment.ts`). Mantener un número de versión duplicado a mano en el
portafolio generaría desincronización garantizada; el tag de GitHub es la única fuente de
verdad. Ver el contrato completo en [UPDATE_SYSTEM.md](./UPDATE_SYSTEM.md).

## Validación automática

`tools/verify-release-version.mjs` implementa la regla 4. Pensado para correr como paso de
CI en cada uno de los repos Flutter (finanzas360, mi-negocio, nexfit, snake_evolution,
number_merge, memory_cards, stack_tower) **antes** de crear el GitHub Release, o justo
después para verificar contra el historial.

**Modo A — comparar dos versiones explícitas** (típico en CI, antes de crear el tag):
```bash
node tools/verify-release-version.mjs --new v1.2.0 --previous v1.1.0
```

**Modo B — comparar contra el último release ya publicado en GitHub:**
```bash
node tools/verify-release-version.mjs --repo AngelDevRD/finanzas360 --new v1.2.0
```
(usa `GITHUB_TOKEN` del entorno si el repo es privado)

Sale con código 1 y mensaje de error si la nueva versión no es estrictamente mayor. Sale 0
si es válida o si no hay versión previa (primer release del repo).

## Cómo integrarlo en un repo Flutter (pendiente de hacer en cada repo, fuera de este workspace)

Ejemplo de paso de GitHub Actions antes del job que crea el release:

```yaml
- name: Verificar que la version es superior a la ultima publicada
  run: |
    NEW_VERSION="v$(grep '^version:' pubspec.yaml | cut -d' ' -f2 | cut -d'+' -f1)"
    node tools/verify-release-version.mjs --repo ${{ github.repository }} --new "$NEW_VERSION"
  env:
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

Esto requiere copiar (o consumir vía submódulo/paquete) `tools/verify-release-version.mjs`
en cada repo Flutter, ya que ese script vive en este repo (portafolio) y los repos Flutter
son proyectos separados fuera de este workspace.
