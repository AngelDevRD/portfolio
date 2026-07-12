# Sistema de auto-actualización in-app

Sistema propio (similar a Google Play) para que las apps/juegos Flutter distribuidos fuera
de la Play Store se auto-actualicen. **El lado servidor (este repo) está completo.** El
lado cliente (Flutter) vive en cada repo de app y aún no está implementado — este documento
es el contrato exacto que ese cliente debe seguir para que, al abrir cualquiera de los
repos Flutter, solo falte escribir la UI/lógica de consumo.

## Arquitectura

```
App Flutter instalada
   │  1. GET /api/projects/<slug>/update
   ▼
Portfolio (Next.js)
   │  lee en vivo el ultimo GitHub Release del repo (cache 30 min)
   ▼
Respuesta JSON con version, tamaño, checksum, changelog y URL de descarga
   │
   ▼
App Flutter compara version vs la instalada → decide si notifica/obliga
   │  2. GET /api/projects/<slug>/download (si el usuario acepta actualizar)
   ▼
Portfolio streamea el APK (proxy, nunca expone el token de GitHub) → contador +1
   │
   ▼
App Flutter verifica sha256 → lanza el instalador nativo de Android
```

## Contrato del servidor (ya implementado en este repo)

### 1. Consultar versión disponible

`GET /api/projects/<slug>/update` → ver [API.md](./API.md) para la ruta completa. Respuesta:

| Campo | Tipo | Descripción |
|---|---|---|
| `version` | string | Tag semver del último release (ej. `"v1.2.0"`) |
| `minSupportedVersion` | string \| null | Si está seteada, versiones por debajo deben forzar la actualización (campo opcional en el JSON del proyecto, `minSupportedVersion`) |
| `apk_url` | string | URL absoluta al proxy de descarga (**no** la URL directa de GitHub) |
| `apk_size_bytes` | number \| null | Tamaño del APK en bytes, para mostrar barra de progreso |
| `apk_sha256` | string \| null | Checksum, formato `"sha256:<hex>"` (viene nativo del campo `digest` de la API de GitHub Releases — no se calcula a mano) |
| `changes` | string[] | Cada línea del changelog del release, ya parseada (sin viñetas ni el "Full Changelog" automático de GitHub) |
| `releaseDate` | string \| null | ISO 8601 |

### 2. Descargar el APK

`GET /api/projects/<slug>/download` → siempre streamea el binario (no redirige salvo que no
haya ningún asset publicado). Ver [API.md](./API.md).

### 3. Verificación de integridad

El checksum ya viaja en la respuesta de `update` (`apk_sha256`). El cliente debe calcular el
sha256 del archivo descargado y compararlo **antes** de invocar el instalador — si no
coincide, descartar el archivo y no instalar.

## Contrato del cliente Flutter (pendiente de implementar en cada repo Flutter)

El cliente es quien decide toda la política de UX; el servidor solo informa datos. Flujo
esperado:

1. **Consultar** `GET /api/projects/<slug>/update` (con un timeout corto; si falla, no
   bloquear el uso de la app).
2. **Comparar** `version` contra la versión instalada (`PackageInfo.fromPlatform()` en
   Flutter). Usar comparación semver, no comparación de strings.
3. Si `minSupportedVersion` existe y la versión instalada es menor, la actualización es
   **obligatoria** (bloquear el uso hasta actualizar). Si no, es opcional.
4. **Notificar** al usuario (diálogo/banner) con el changelog (`changes`) y el tamaño
   (`apk_size_bytes`, formatear a MB/KB).
5. Si el usuario acepta, **descargar** `apk_url` mostrando barra de progreso y porcentaje
   (Flutter: `Dio` o `http` con `onReceiveProgress` / stream de bytes).
6. **Verificar integridad**: calcular sha256 del archivo descargado y compararlo con
   `apk_sha256`. Si no coincide, descartar y mostrar error — nunca instalar un archivo cuyo
   checksum no verifica.
7. **Preparar la instalación**: Android exige que el usuario confirme la instalación de
   fuentes desconocidas (`REQUEST_INSTALL_PACKAGES`) — el cliente debe guiar explícitamente
   este paso (no se puede saltar por restricciones del sistema operativo). Paquete
   recomendado: `open_file` o `install_plugin` para invocar el instalador nativo con el APK
   descargado.
8. **Conservar datos del usuario**: una actualización de APK en Android nunca borra los
   datos de la app instalada (mismo `packageId`, misma firma) — no se requiere lógica
   adicional de este repo para esto, es comportamiento nativo de Android siempre que el
   `packageId`/firma no cambien entre versiones.

## Qué falta por repo Flutter (fuera de este workspace)

- Implementar los pasos 1–8 anteriores como un servicio/paquete reutilizable (podría
  compartirse entre los 7 repos Flutter como un paquete Dart interno).
- Integrar `tools/verify-release-version.mjs` (o su lógica) en el CI de cada repo antes de
  publicar un release — ver [VERSIONING.md](./VERSIONING.md).
- Configurar `minSupportedVersion` en el JSON del proyecto correspondiente
  (`content/projects/mobile/<slug>.json`, en este repo) cuando se necesite forzar una
  actualización obligatoria.
