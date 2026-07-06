import { getSupabasePublic } from "@/lib/supabase";

/** Lee el contador de descargas de un proyecto. 0 si no hay Supabase configurado o aún no tiene registros. */
export async function getDownloadCount(slug: string): Promise<number> {
  const supabase = getSupabasePublic();
  if (!supabase) return 0;

  const { data, error } = await supabase
    .from("portfolio_project_downloads")
    .select("count")
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    console.warn(`[downloads] no se pudo leer el contador de ${slug}:`, error.message);
    return 0;
  }
  return data?.count ?? 0;
}

/** Incrementa atómicamente el contador de descargas vía RPC. No lanza si falla, solo lo registra. */
export async function incrementDownloadCount(slug: string): Promise<void> {
  const supabase = getSupabasePublic();
  if (!supabase) return;

  const { error } = await supabase.rpc("increment_portfolio_download", { p_slug: slug });
  if (error) console.warn(`[downloads] no se pudo incrementar el contador de ${slug}:`, error.message);
}
