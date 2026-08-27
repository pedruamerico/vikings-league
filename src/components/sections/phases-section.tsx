import { RevealSection } from "@/components/ui/reveal-section";
import { RevealWords } from "@/components/ui/reveal-words";
import { cn } from "@/lib/utils";
import { phases } from "@/content/content";

export function PhasesSection() {
  return (
    <RevealSection
      id="s4"
      className="border-b border-line bg-bg px-[clamp(18px,3vw,44px)] py-[clamp(44px,5.5vw,88px)] vl-texture"
    >
      <div className="mx-auto max-w-[1240px]">
        <div
          data-stagger
          className="mb-[18px] font-sans text-[10px] font-semibold tracking-[0.2em] text-text-dim"
        >
          {phases.eyebrow}
        </div>
        <h2
          className="font-display text-[clamp(28px,4.2vw,56px)] leading-[0.9] font-extrabold uppercase"
        >
          <RevealWords
            segments={[{ text: phases.titleLead }, { text: phases.titleAccent, accent: true }]}
          />
        </h2>

        <div className="mt-[clamp(30px,4vw,56px)] grid grid-cols-1 gap-0.5 sm:grid-cols-2 lg:grid-cols-4">
          {phases.items.map((phase) => (
            <div
              key={phase.index}
              data-stagger
              className={cn(
                "group relative overflow-hidden border px-5 pt-[22px] pb-[26px] transition-colors duration-300 hover:bg-surface-hover",
                phase.highlight
                  ? "border-accent/40 bg-[linear-gradient(180deg,rgba(46,123,255,0.12),rgba(0,0,0,0)_70%)]"
                  : "border-white/12 hover:border-accent/45",
              )}
            >
              <div className="flex items-center justify-end gap-2.5">
                <span
                  className={cn(
                    "font-sans text-[11px] font-semibold tracking-[0.1em]",
                    phase.highlight ? "text-accent-soft" : "text-text-dim",
                  )}
                >
                  {phase.date}
                </span>
              </div>

              <div className="mt-5 flex items-baseline gap-2.5">
                <span
                  className={cn(
                    "font-display text-[clamp(30px,4vw,40px)] leading-[0.9] font-extrabold uppercase",
                    phase.highlight ? "vl-outline-numeral-accent" : "vl-outline-numeral",
                  )}
                >
                  {phase.index}
                </span>
                <span className="font-display text-[clamp(22px,2.8vw,28px)] font-bold uppercase">
                  {phase.title}
                </span>
              </div>

              <p className="mt-3.5 text-[15px] leading-[1.6] text-pretty text-text-body">
                {phase.description}
              </p>

              <span
                className="pointer-events-none absolute right-[-8px] bottom-[-52px] font-display text-[180px] leading-[0.8] font-extrabold uppercase vl-watermark transition-transform duration-500 ease-out group-hover:-translate-y-2"
                aria-hidden
              >
                {phase.index}
              </span>
            </div>
          ))}
        </div>
      </div>
    </RevealSection>
  );
}
