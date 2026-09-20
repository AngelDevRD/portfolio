import { Resend } from "resend";

/**
 * Envía un correo con Resend.
 *
 * Sin RESEND_API_KEY/CONTACT_TO_EMAIL no hay envío posible. En desarrollo eso
 * se reporta como `skipped` y no rompe el flujo; en producción se reporta como
 * fallo. Devolver `ok: true` en producción sin haber enviado nada hacía que el
 * formulario mostrara "¡Mensaje enviado!" y el mensaje del visitante se
 * perdiera sin que nadie se enterara.
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
    const detail = "RESEND_API_KEY/CONTACT_TO_EMAIL no configurados";
    if (process.env.NODE_ENV === "production") {
      console.error("[mail]", detail, "-- correo NO enviado:", opts.subject);
      return { ok: false, skipped: true, error: detail };
    }
    console.warn("[mail]", detail, "-- correo NO enviado:", opts.subject);
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
