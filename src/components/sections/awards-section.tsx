import { Icon } from "@/components/ui/icon";
import { ImageSlot } from "@/components/ui/image-slot";
import { RevealSection } from "@/components/ui/reveal-section";
import { RevealWords } from "@/components/ui/reveal-words";
import { awards } from "@/content/content";

export function AwardsSection() {
  if (awards.items.length === 0) return null;

  return (
    <RevealSection
      id="s7"
      className="border-b border-line bg-bg-alt px-[clamp(18px,3vw,44px)] py-[clamp(44px,5.5vw,88px)] vl-texture-wash"
    >
      <div className="mx-auto max-w-[1240px]">
        <div
          data-stagger
          className="mb-[18px] font-sans text-[10px] font-semibold tracking-[0.2em] text-text-dim"
        >
          {awards.eyebrow}
        </div>
        <h2
          className="font-display text-[clamp(28px,4.2vw,56px)] leading-[0.9] font-extrabold uppercase"
        >
          <RevealWords
            segments={[{ text: awards.titleLead }, { text: awards.titleAccent, accent: true }]}
          />
        </h2>

        <div className="mt-[clamp(30px,4vw,56px)] flex flex-wrap gap-[clamp(14px,2vw,22px)]">
          {awards.photo.src ? (
            <div data-stagger className="min-w-[min(100%,240px)] flex-[0_1_300px]">
              <ImageSlot
                src={awards.photo.src}
                alt={awards.photo.alt}
                aspectRatio="3/4"
                sizes="(max-width: 900px) 100vw, 300px"
              />
            </div>
          ) : null}

          <div className="grid min-w-[min(100%,280px)] flex-[1_1_520px] grid-cols-2 gap-[clamp(14px,2vw,22px)]">
          {awards.items.map((award) => (
            <div
              key={award.title}
              data-stagger
              className="group relative flex min-h-[156px] flex-col items-start justify-end gap-2.5 overflow-hidden border border-line-strong px-3 py-4 transition-colors duration-300 hover:border-accent/45 hover:bg-surface-hover sm:min-h-[196px] sm:flex-row sm:items-end sm:justify-start sm:gap-4 sm:px-5 sm:py-[22px]"
            >
              <Icon
                name={award.icon}
                size={48}
                strokeWidth={2.5}
                className="h-12 w-12 flex-none text-[rgba(46,123,255,0.9)] transition-transform duration-300 ease-out group-hover:-translate-y-1 sm:h-14 sm:w-14 sm:self-end"
              />
              <span
                className="pointer-events-none absolute right-[-64px] bottom-[-84px] vl-watermark transition-transform duration-500 ease-out group-hover:-translate-x-2 group-hover:-translate-y-2"
                aria-hidden
              >
                <Icon name={award.icon} size={260} strokeWidth={1} />
              </span>
              <span className="relative">
                <span className="block font-display text-xl leading-[0.95] font-bold uppercase sm:text-[clamp(24px,3.2vw,32px)]">
                  {award.title}
                </span>
                {/* Prêmio ainda não definido: a linha só existe quando houver valor. */}
                {award.prize ? (
                  <span className="mt-2 block font-sans text-sm text-text-dim">{award.prize}</span>
                ) : null}
              </span>
            </div>
          ))}
          </div>
        </div>
      </div>
    </RevealSection>
  );
}
