import { z } from "zod";

export const projectStatusSchema = z.enum([
  "development",
  "beta",
  "published",
  "maintenance",
  "archived",
]);
export type ProjectStatus = z.infer<typeof projectStatusSchema>;

const projectBaseSchema = z.object({
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/, "slug debe ser kebab-case"),
  name: z.string().min(1),
  tagline: z.string().optional(),
  description: z.string().min(1),
  tags: z.array(z.string()).default([]),
  category: z.string().optional(),
  status: projectStatusSchema,
  featured: z.boolean().optional(),
  logo: z.string().min(1),
  screenshots: z.array(z.string()).default([]),
  gif: z.string().optional(),
  video: z.string().optional(),
  repo: z.string().regex(/^[\w.-]+\/[\w.-]+$/, "repo debe tener el formato 'owner/repo'"),
  docsUrl: z.string().url().optional(),
  /** Nombre de archivo (sin extension) usado al descargar la APK. Si falta, se deriva de "name". */
  downloadName: z.string().regex(/^[\w-]+$/, "downloadName debe ser alfanumerico sin espacios").optional(),
  features: z.array(z.string()).optional(),
  requirements: z.array(z.string()).optional(),
});

export const mobileProjectSchema = projectBaseSchema.extend({
  type: z.literal("mobile"),
  packageId: z.string().min(1),
  /** Version por debajo de la cual la app debe forzar la actualizacion (in-app updater). Opcional. */
  minSupportedVersion: z.string().optional(),
});

export const webProjectSchema = projectBaseSchema.extend({
  type: z.literal("web"),
  demoUrl: z.string().url(),
  allowEmbed: z.boolean().optional().default(false),
});

export const catalogProjectSchema = z.discriminatedUnion("type", [
  mobileProjectSchema,
  webProjectSchema,
]);

export type MobileProject = z.infer<typeof mobileProjectSchema>;
export type WebProject = z.infer<typeof webProjectSchema>;
export type CatalogProject = z.infer<typeof catalogProjectSchema>;
