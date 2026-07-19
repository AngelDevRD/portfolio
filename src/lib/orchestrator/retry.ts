/** Reintenta una operacion de red hasta `retries` veces con backoff simple, para que un timeout
 * o un 502 transitorio de GitHub no tumbe todo el webhook. No reintenta errores de programacion
 * (esos deben fallar rapido), solo se usa alrededor de llamadas fetch/API externas. */
export async function withRetry<T>(fn: () => Promise<T>, retries = 3, baseDelayMs = 500): Promise<T> {
  let lastError: unknown;
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      if (attempt === retries) break;
      await new Promise((r) => setTimeout(r, baseDelayMs * attempt));
    }
  }
  throw lastError;
}
