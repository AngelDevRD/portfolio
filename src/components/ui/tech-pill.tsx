import { cn } from "@/lib/utils";

export function TechPill({ label, className }: { label: string; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-border bg-muted/60 px-2.5 py-0.5 text-xs font-medium text-muted-foreground",
        className
      )}
    >
      {label}
    </span>
  );
}
