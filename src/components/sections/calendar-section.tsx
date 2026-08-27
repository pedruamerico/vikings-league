import { RevealSection } from "@/components/ui/reveal-section";
import { cn } from "@/lib/utils";
import { calendar } from "@/content/content";

export function CalendarSection() {
  return (
    <RevealSection
      id="s5"
      className="border-b border-line bg-bg-alt py-[clamp(52px,7vw,116px)] vl-texture-wash"
    >
      <div className="mx-auto max-w-[1240px] px-[clamp(18px,3vw,44px)]">
        <div
          data-stagger
          className="mb-[18px] flex flex-wrap items-center justify-between gap-3 font-sans text-[10px] font-semibold tracking-[0.2em] text-text-dim"
        >
          <span>{calendar.eyebrow}</span>
          <span className="tracking-[0.14em]">{calendar.season}</span>
        </div>
        <h2
          data-stagger
          className="font-display text-[clamp(30px,5.4vw,72px)] leading-[0.9] font-extrabold uppercase"
        >
          {calendar.titleLead} <span className="text-accent">{calendar.titleAccent}</span>
        </h2>
        <p
          data-stagger
          className="mt-4 max-w-[46ch] text-[clamp(14px,1.8vw,16px)] leading-[1.6] text-text-dim"
        >
          {calendar.paragraph}
        </p>
      </div>

      <div className="mt-[clamp(30px,4vw,56px)] flex flex-col border-y border-line-strong sm:flex-row sm:flex-nowrap">
        {calendar.days.map((day, i) => (
          <div
            key={`${day.day}-${i}`}
            data-stagger
            className={cn(
              "flex min-w-0 flex-[1_1_0] flex-col justify-between gap-[clamp(24px,3vw,40px)] px-[clamp(16px,2vw,26px)] py-[clamp(20px,2.4vw,30px)] transition-colors duration-[220ms] hover:bg-surface-hover",
              "min-h-[clamp(210px,26vw,260px)] border-t border-line first:border-t-0 sm:border-t-0 sm:border-l",
              day.highlight
                ? "border-l-white/28 bg-[linear-gradient(200deg,rgba(46,123,255,0.16),rgba(0,0,0,0)_72%)]"
                : "sm:border-l-line",
            )}
          >
            <div className="flex items-center justify-between gap-2.5">
              <span
                className={cn(
                  "font-sans text-[10px] font-semibold tracking-[0.18em]",
                  day.highlight ? "text-accent-soft" : "text-text-dim",
                )}
              >
                {day.weekday}
              </span>
            </div>

            <div>
              <div className="flex items-baseline gap-2.5">
                <span
                  data-clip
                  className={cn(
                    "font-display text-[clamp(88px,15vw,210px)] leading-[0.82] font-extrabold tracking-[-0.01em] uppercase",
                    day.highlight && "text-accent-soft",
                  )}
                >
                  {day.day}
                </span>
                <span
                  className={cn(
                    "font-sans text-xs font-semibold tracking-[0.16em]",
                    day.highlight ? "text-accent-soft" : "text-text-dim",
                  )}
                >
                  {day.month}
                </span>
              </div>
              <div className="mt-[clamp(14px,1.8vw,20px)] border-t border-line pt-[clamp(12px,1.6vw,16px)] font-display text-[clamp(20px,2.4vw,27px)] leading-[1.05] font-bold uppercase">
                {day.title}
              </div>
            </div>
          </div>
        ))}
      </div>
    </RevealSection>
  );
}
