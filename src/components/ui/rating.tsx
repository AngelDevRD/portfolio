import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function Rating({ value, className }: { value: number; className?: string }) {
  return (
    <div className={cn("flex items-center gap-0.5", className)} aria-label={`Calificación ${value} de 5`}>
      {Array.from({ length: 5 }).map((_, i) => {
        const filled = i + 1 <= Math.round(value);
        return (
          <Star
            key={i}
            className={cn("h-4 w-4", filled ? "fill-amber-400 text-amber-400" : "text-muted-foreground/40")}
          />
        );
      })}
      <span className="ml-1 text-sm font-medium text-muted-foreground">{value.toFixed(1)}</span>
    </div>
  );
}
