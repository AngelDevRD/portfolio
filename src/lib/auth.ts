import { createHash } from "crypto";

export const ADMIN_COOKIE = "admin_token";

/** SHA-256 hex (Node runtime). Debe coincidir con el cálculo edge del middleware. */
export function sha256Hex(input: string): string {
  return createHash("sha256").update(input).digest("hex");
}

/** Token esperado derivado de ADMIN_PASSWORD. */
export function expectedToken(): string | null {
  const pw = process.env.ADMIN_PASSWORD;
  if (!pw) return null;
  return sha256Hex(pw);
}
