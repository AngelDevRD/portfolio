import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Cliente de Supabase para el SERVIDOR (usa la service role key).
 * Devuelve null si no hay credenciales configuradas, para que la app
 * funcione sin backend (las sugerencias se enviarán solo por email).
 *
 * Tabla esperada (crea en el SQL editor de Supabase):
 *
 *   create table suggestions (
 *     id uuid primary key default gen_random_uuid(),
 *     name text,
 *     email text not null,
 *     title text not null,
 *     description text not null,
 *     reason text,
 *     recommend text,
 *     problem text,
 *     category text,
 *     created_at timestamptz default now()
 *   );
 */
export function getSupabaseAdmin(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: { persistSession: false },
  });
}
