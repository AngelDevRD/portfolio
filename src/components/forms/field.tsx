import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export function Field({
  label,
  htmlFor,
  error,
  children,
  optional,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  children: ReactNode;
  optional?: boolean;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1.5 flex items-center gap-2 text-sm font-medium">
        {label}
        {optional && <span className="text-xs text-muted-foreground">(opcional)</span>}
      </label>
      {children}
      {error && (
        <p className="mt-1 text-xs text-red-500" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

export const inputClass = (hasError?: boolean) =>
  cn(
    "w-full rounded-xl border bg-card/60 px-4 py-2.5 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:ring-2 focus:ring-accent/50",
    hasError ? "border-red-500/60" : "border-border"
  );
