import { Info } from "lucide-react";
import { Icon } from "@/components/ui/icon";
import { RevealSection } from "@/components/ui/reveal-section";
import { cn } from "@/lib/utils";
import { scouting } from "@/content/content";

function FormationLine({ label, active }: { label: string; active: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <span
        className={cn(
          "flex-[0_0_58px] font-sans text-[11px] font-bold",
          active ? "text-accent-soft" : "text-text-dim",
        )}
      >
        {label}
      </span>
      <span
        className="grid min-w-0 max-w-[252px] flex-[1_1_auto] grid-cols-[repeat(16,minmax(0,1fr))] gap-1"
        aria-hidden
      >
        {Array.from({ length: scouting.formation.playersPerLine }, (_, i) => (
          <span
            key={i}
            className={cn("aspect-square w-full", active ? "bg-accent" : "bg-marker-off")}
          />
        ))}
      </span>
    </div>
  );
}

export function ScoutingSection() {
  return (
    <RevealSection
      id="s6"
      className="border-b border-line bg-bg px-[clamp(18px,3vw,44px)] py-[clamp(52px,7vw,116px)] vl-texture"
    >
      <div className="mx-auto flex max-w-[1240px] flex-wrap gap-[clamp(26px,4vw,64px)]">
        <div data-stagger className="min-w-[min(100%,260px)] flex-[1_1_260px]">
          <div className="mb-[18px] font-sans text-[10px] font-semibold tracking-[0.2em] text-text-dim">
            {scouting.eyebrow}
          </div>
          <h2 className="max-w-[20ch] font-display text-[clamp(30px,5.4vw,72px)] leading-[0.95] font-extrabold text-balance uppercase">
            {scouting.titleLead} <span className="text-accent">{scouting.titleAccent}</span>{" "}
            {scouting.titleTail}
          </h2>
          <p className="mt-[22px] max-w-[46ch] text-[clamp(15px,2vw,18px)] leading-[1.65] text-pretty text-text-body">
            {scouting.paragraph}
          </p>

          <div className="mt-[22px] inline-flex items-center gap-[9px] border border-dashed border-white/22 px-[13px] py-2.5 font-sans text-[10px] font-semibold tracking-[0.1em] text-text-dim">
            <Info width={18} height={18} strokeWidth={1.6} aria-hidden />
            {scouting.chip}
          </div>

          <div className="mt-[clamp(28px,4vw,44px)]">
            <div className="font-sans text-[10px] font-semibold tracking-[0.16em] text-text-dim">
              {scouting.formation.label}
            </div>
            <div className="mt-4 flex flex-col gap-3">
              {scouting.formation.lines.map((line) => (
                <FormationLine key={line.label} label={line.label} active={line.active} />
              ))}
            </div>

            <div className="mt-[18px] flex flex-col gap-1.5 font-sans text-[10px] font-semibold tracking-[0.1em] text-text-dim">
              {scouting.formation.summary.map((item) => (
                <span key={item} className="whitespace-nowrap">
                  {item}
                </span>
              ))}
            </div>

            <p className="mt-3.5 max-w-[52ch] text-sm leading-[1.6] text-pretty text-text-dim">
              {scouting.formation.funnel}
            </p>
          </div>
        </div>

        <div className="flex min-w-[min(100%,290px)] flex-[2_1_520px] flex-col gap-[clamp(16px,2.2vw,26px)]">
          {scouting.metrics.map((metric, i) => (
            <div
              key={metric.title}
              data-stagger
              className="border-t border-line-strong pt-[clamp(14px,1.8vw,20px)]"
            >
              <div className="flex items-center gap-3.5">
                <Icon
                  name={metric.icon}
                  size={30}
                  strokeWidth={2}
                  className="flex-none text-accent"
                />
                <span
                  className={cn(
                    "font-display text-[clamp(28px,4.4vw,54px)] leading-[0.92] font-extrabold uppercase",
                    i % 2 === 1 ? "text-accent-soft" : "text-text",
                  )}
                >
                  {metric.title}
                </span>
              </div>
              <div className="mt-2 font-sans text-sm leading-[1.5] text-text-dim">
                {metric.description}
              </div>
            </div>
          ))}
        </div>
      </div>
    </RevealSection>
  );
}
