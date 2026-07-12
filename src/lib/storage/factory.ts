import type { ApkStorageProvider } from "./apk-provider";
import { GithubReleaseApkProvider } from "./github-apk-provider";
// Futuro: import { R2ApkProvider } from "./r2-apk-provider";
// Futuro: import { S3ApkProvider } from "./s3-apk-provider";

let instance: ApkStorageProvider | null = null;

/** Selecciona la implementación de ApkStorageProvider vía APK_STORAGE_DRIVER (por defecto "github"). */
export function getApkStorageProvider(): ApkStorageProvider {
  if (instance) return instance;

  const driver = process.env.APK_STORAGE_DRIVER ?? "github";
  switch (driver) {
    // case "r2":
    //   instance = new R2ApkProvider();
    //   break;
    // case "s3":
    //   instance = new S3ApkProvider();
    //   break;
    case "github":
    default:
      instance = new GithubReleaseApkProvider();
  }
  return instance;
}
