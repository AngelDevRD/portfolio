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
    if (error) console.error("[suggestions] Supabase:", error.message);
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

  if (!mail.ok && !supabase) {
    return NextResponse.json({ error: mail.error || "No se pudo procesar" }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
