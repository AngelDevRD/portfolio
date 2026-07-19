/** Registro estructurado de cada corrida del webhook (una linea JSON por evento). Vercel captura
 * stdout/stderr de las funciones y lo indexa por tiempo, asi que una linea JSON parseable ya es
 * suficiente para diagnosticar sin agregar un servicio de logging externo. */
export interface OrchestratorLogEvent {
  app: string;
  repo: string;
  platform?: string;
  version?: string;
  durationMs: number;
  status: "success" | "error" | "skipped";
  warnings?: string[];
  error?: string;
}

export function logOrchestratorEvent(event: OrchestratorLogEvent): void {
  const line = { ts: new Date().toISOString(), source: "orchestrator", ...event };
  if (event.status === "error") {
    console.error(JSON.stringify(line));
  } else {
    console.log(JSON.stringify(line));
  }
}
