import { Icon } from "@/components/ui/icon";
import { RevealSection } from "@/components/ui/reveal-section";
import { RevealWords } from "@/components/ui/reveal-words";
import { benefits } from "@/content/content";

export function BenefitsSection() {
  return (
    <RevealSection
      id="s3"
      className="border-b border-line bg-bg-alt px-[clamp(18px,3vw,44px)] py-[clamp(52px,7vw,116px)] vl-texture"
    >
      <div className="mx-auto max-w-[1240px]">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div data-stagger>
            <div className="mb-[18px] font-sans text-[10px] font-semibold tracking-[0.2em] text-text-dim">
              {benefits.eyebrow}
            </div>
            <h2 className="max-w-[22ch] font-display text-[clamp(28px,4.2vw,56px)] leading-[0.9] font-extrabold uppercase">
              <RevealWords
                segments={[
                  { text: benefits.titleLead },
                  { text: benefits.titleAccent, accent: true },
                ]}
              />
            </h2>
          </div>
          <div
            data-stagger
            className="font-sans text-[10px] font-semibold tracking-[0.14em] text-text-dim"
          >
            {benefits.counter}
          </div>
        </div>

        <div className="mt-[clamp(30px,4vw,56px)] border-t border-line-strong">
          {benefits.items.map((item) => (
            <div
              key={item.title}
              data-stagger
              className="group relative flex min-h-[116px] flex-wrap items-center gap-x-[22px] gap-y-2.5 overflow-hidden border-b border-line py-[26px] pr-6 pl-2 transition-[padding-left,background-color] duration-[220ms] ease-out hover:bg-surface-hover hover:pl-[22px]"
            >
              <span className="flex flex-[1_1_250px] items-center gap-3.5 font-display text-[clamp(22px,3vw,30px)] font-bold uppercase">
                <Icon
                  name={item.icon}
                  size={56}
                  strokeWidth={2.5}
                  className="flex-none text-[rgba(46,123,255,0.9)]"
                />
                {item.title}
              </span>
              <span className="flex-[1_1_280px] text-[15px] leading-[1.55] text-text-dim">
                {item.description}
              </span>
              <span
                className="pointer-events-none absolute right-[-30px] bottom-[-46px] vl-watermark"
                aria-hidden
              >
                <Icon name={item.icon} size={180} strokeWidth={1} />
              </span>
            </div>
          ))}
        </div>
      </div>
    </RevealSection>
  );
}
