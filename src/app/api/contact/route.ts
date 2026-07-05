import { NextResponse } from "next/server";
import { contactSchema } from "@/lib/validations";
import { sendMail, esc } from "@/lib/mail";

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Cuerpo inválido" }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Datos inválidos", issues: parsed.error.flatten() }, { status: 422 });
  }

  const { name, email, subject, message, company } = parsed.data;

  // Honeypot: si viene relleno, es bot. Fingimos éxito.
  if (company) return NextResponse.json({ ok: true });

  const result = await sendMail({
    subject: `📬 Nuevo mensaje: ${esc(subject)}`,
    replyTo: email,
    html: `
      <div style="font-family:system-ui,sans-serif;max-width:600px">
        <h2>Nuevo mensaje de contacto</h2>
        <p><strong>Nombre:</strong> ${esc(name)}</p>
        <p><strong>Email:</strong> ${esc(email)}</p>
        <p><strong>Asunto:</strong> ${esc(subject)}</p>
        <hr/>
        <p style="white-space:pre-wrap">${esc(message)}</p>
      </div>
    `,
  });

  if (!result.ok) {
    return NextResponse.json({ error: result.error || "No se pudo enviar" }, { status: 502 });
  }

  return NextResponse.json({ ok: true, skipped: result.skipped ?? false });
}
