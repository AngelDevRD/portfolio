import { z } from "zod";

/** Esquema del formulario de contacto. */
export const contactSchema = z.object({
  name: z.string().min(2, "El nombre es demasiado corto").max(80),
  email: z.string().email("Correo electrónico inválido"),
  subject: z.string().min(3, "Añade un asunto").max(120),
  message: z.string().min(10, "Cuéntame un poco más (mín. 10 caracteres)").max(3000),
  // Honeypot anti-spam (debe ir vacío)
  company: z.string().max(0).optional(),
});
export type ContactInput = z.infer<typeof contactSchema>;

/** Esquema del formulario "Propón una aplicación". */
export const suggestionSchema = z.object({
  name: z.string().max(80).optional().or(z.literal("")),
  email: z.string().email("Correo electrónico inválido"),
  title: z.string().min(3, "Ponle un título a tu idea").max(120),
  description: z.string().min(10, "Describe tu idea (mín. 10 caracteres)").max(3000),
  reason: z.string().max(1000).optional().or(z.literal("")),
  recommend: z.enum(["si", "no", "quiza"]).default("si"),
  problem: z.string().max(1000).optional().or(z.literal("")),
  category: z.string().min(1, "Elige una categoría"),
  company: z.string().max(0).optional(),
});
export type SuggestionInput = z.infer<typeof suggestionSchema>;
