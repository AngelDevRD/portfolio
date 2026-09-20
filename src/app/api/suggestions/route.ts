import { NextResponse } from "next/server";
import { suggestionSchema } from "@/lib/validations";
import { sendMail, esc } from "@/lib/mail";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Cuerpo inválido" }, { status: 400 });
  }

  const parsed = suggestionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Datos inválidos", issues: parsed.error.flatten() }, { status: 422 });
  }

  const d = parsed.data;
  if (d.company) return NextResponse.json({ ok: true }); // honeypot

  // 1) Guardar en Supabase (si está configurado)
  const supabase = getSupabaseAdmin();
  let persisted = false;
  if (supabase) {
    const { error } = await supabase.from("suggestions").insert({
      name: d.name || null,
      email: d.email,
      title: d.title,
      description: d.description,
      reason: d.reason || null,
      recommend: d.recommend,
      problem: d.problem || null,
      category: d.category,
    });
    if (error) {
      console.error("[suggestions] Supabase:", error.message);
    } else {
      persisted = true;
    }
  }

  // 2) Notificar por correo (si está configurado)
  const mail = await sendMail({
    subject: `💡 Nueva sugerencia: ${esc(d.title)}`,
    replyTo: d.email,
    html: `
      <div style="font-family:system-ui,sans-serif;max-width:600px">
        <h2>Nueva idea de aplicación</h2>
        <p><strong>Título:</strong> ${esc(d.title)}</p>
        <p><strong>Categoría:</strong> ${esc(d.category)}</p>
        <p><strong>De:</strong> ${esc(d.name || "Anónimo")} (${esc(d.email)})</p>
        <p><strong>¿Recomendaría?:</strong> ${esc(d.recommend)}</p>
        <hr/>
        <p><strong>Descripción:</strong></p>
        <p style="white-space:pre-wrap">${esc(d.description)}</p>
        ${d.reason ? `<p><strong>¿Por qué la descargaría?</strong> ${esc(d.reason)}</p>` : ""}
        ${d.problem ? `<p><strong>Problema que resuelve:</strong> ${esc(d.problem)}</p>` : ""}
      </div>
    `,
  });

  // La condición anterior era `!mail.ok && !supabase`: si Supabase estaba
  // configurado pero el insert fallaba, o si el correo se "saltaba" por falta
  // de clave, la respuesta era `ok` y la sugerencia se perdía sin rastro. Lo
  // que importa es si quedó guardada en algún lado, no si los servicios están
  // declarados.
  const delivered = persisted || (mail.ok && !mail.skipped);
  if (!delivered) {
    console.error(
      "[suggestions] no se pudo guardar ni notificar:",
      mail.error ?? "sin proveedor de correo",
      persisted ? "" : "-- tampoco se persistió en Supabase"
    );
    return NextResponse.json(
      { error: "No pudimos registrar tu sugerencia. Intentá de nuevo en un rato." },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true });
}
