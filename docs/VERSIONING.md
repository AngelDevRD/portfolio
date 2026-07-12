# Política de versionado

## Regla oficial

1. Nunca publicar dos GitHub Releases con el mismo número de versión (tag).
2. Toda APK nueva debe incrementar `versionName` en el `pubspec.yaml` / `build.gradle` del
   repo Flutter correspondiente.
3. Toda APK nueva debe incrementar `versionCode` (Android) o el build number de
   `pubspec.yaml` (`version: X.Y.Z+build`).
4. La versión nueva debe ser **estrictamente mayor** (semver: major.minor.patch) que la
   última ya publicada. Si no lo es, el proceso de release debe **fallar automáticamente**,
   no publicarse "con una advertencia".

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
