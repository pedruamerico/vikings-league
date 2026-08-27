import { Icon } from "@/components/ui/icon";
import Image from "next/image";
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

        <div className="mt-[clamp(30px,4vw,56px)] grid grid-cols-2 gap-[clamp(14px,2vw,22px)] lg:grid-cols-4">
          {awards.items.map((award) => (
            <div
              key={award.title}
              data-stagger
              className="group relative flex min-h-[196px] items-end gap-4 overflow-hidden border border-line-strong px-5 py-[22px] transition-colors duration-300 hover:border-accent/45 hover:bg-surface-hover"
            >
              {award.photo ? (
                <>
                  <Image
                    src={award.photo}
                    alt=""
                    fill
                    sizes="(max-width: 640px) 50vw, 25vw"
                    aria-hidden
                    className="object-cover opacity-45 transition-[opacity,transform] duration-500 ease-out group-hover:scale-[1.04] group-hover:opacity-60"
                  />
                  <span
                    className="pointer-events-none absolute inset-0 bg-[linear-gradient(0deg,rgba(11,14,19,0.94),rgba(11,14,19,0.35))]"
                    aria-hidden
                  />
                </>
              ) : (
                <>
                  <Icon
                    name={award.icon}
                    size={56}
                    strokeWidth={2.5}
                    className="flex-none self-end text-[rgba(46,123,255,0.9)] transition-transform duration-300 ease-out group-hover:-translate-y-1"
                  />
                  <span
                    className="pointer-events-none absolute right-[-64px] bottom-[-84px] vl-watermark transition-transform duration-500 ease-out group-hover:-translate-x-2 group-hover:-translate-y-2"
                    aria-hidden
                  >
                    <Icon name={award.icon} size={260} strokeWidth={1} />
                  </span>
                </>
              )}
              <span className="relative">
                <span className="block font-display text-[clamp(24px,3.2vw,32px)] font-bold uppercase">
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
    </RevealSection>
  );
}
