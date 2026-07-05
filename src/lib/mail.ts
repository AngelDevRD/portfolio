import { Resend } from "resend";

/**
 * Envía un correo con Resend. Si no hay RESEND_API_KEY configurada,
 * registra en consola y devuelve { skipped: true } para no romper la app
 * en desarrollo. Configura las claves en .env.local para envíos reales.
 */
export async function sendMail(opts: {
  subject: string;
  html: string;
  replyTo?: string;
}): Promise<{ ok: boolean; skipped?: boolean; error?: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL || "onboarding@resend.dev";

  if (!apiKey || !to) {
    console.warn("[mail] RESEND_API_KEY/CONTACT_TO_EMAIL no configurados. Correo NO enviado:", opts.subject);
    return { ok: true, skipped: true };
  }

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from,
      to,
      subject: opts.subject,
      html: opts.html,
      replyTo: opts.replyTo,
    });
    if (error) return { ok: false, error: error.message };
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Error enviando correo" };
  }
}

/** Escapa HTML básico para evitar inyección en el cuerpo del correo. */
export function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
