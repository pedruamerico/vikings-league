import { cn } from "@/lib/utils";

export const inputClass =
  "min-h-11 w-full border border-white/14 bg-black/25 px-3.5 py-2.5 text-[15px] text-text outline-none transition-colors placeholder:text-text-faint focus:border-accent focus:bg-black/40";

export function Field({
  label,
  hint,
  children,
  className,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={cn("block", className)}>
      <span className="mb-1.5 flex items-baseline justify-between gap-3 font-sans text-[11px] font-semibold tracking-[0.12em] text-text-muted uppercase">
        {label}
        {hint ? <span className="text-[10px] tracking-normal text-text-faint normal-case">{hint}</span> : null}
      </span>
      {children}
    </label>
  );
}
