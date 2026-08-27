import { ArrowUpRight } from "lucide-react";
import { InstagramIcon } from "@/components/ui/instagram-icon";
import { CountUp } from "@/components/ui/count-up";
import { Icon } from "@/components/ui/icon";
import { ImageSlot } from "@/components/ui/image-slot";
import { RevealSection } from "@/components/ui/reveal-section";
import { instagram } from "@/lib/links";
import { about } from "@/content/content";

export function AboutSection() {
  return (
    <RevealSection
      id="s2"
      className="border-b border-line bg-bg px-[clamp(18px,3vw,44px)] py-[clamp(52px,7vw,116px)] vl-texture"
    >
      <div className="mx-auto max-w-[1240px]">
        <div
          data-stagger
          className="mb-[18px] font-sans text-[10px] font-semibold tracking-[0.2em] text-text-dim"
        >
          {about.eyebrow}
        </div>
        <h2
          data-stagger
          className="max-w-[24ch] font-display text-[clamp(28px,4.2vw,56px)] leading-[0.9] font-extrabold text-balance uppercase"
        >
          {about.titleLead} <span className="text-accent">{about.titleAccent}</span>
          {about.titleTail}
        </h2>
        <p
          data-stagger
          className="mt-[22px] max-w-[60ch] text-[clamp(15px,2vw,18px)] leading-[1.65] text-pretty text-text-body"
        >
          {about.paragraph}
        </p>

        <div className="mt-[clamp(34px,5vw,72px)] flex flex-wrap gap-x-[clamp(24px,4vw,56px)] gap-y-[clamp(20px,3vw,40px)]">
          {about.pillars.map((pillar) => (
            <div
              key={pillar.title}
              data-stagger
              className="min-w-[min(100%,240px)] flex-[1_1_45%] border-t border-line-strong pt-5"
            >
              <Icon name={pillar.icon} size={34} strokeWidth={2} className="text-accent" />
              <span className="mt-3.5 block font-display text-[clamp(28px,4.4vw,54px)] leading-[0.95] font-extrabold uppercase">
                {pillar.title}
              </span>
              <span className="mt-2 block max-w-[34ch] text-sm leading-[1.55] text-text-dim">
                {pillar.description}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-[clamp(28px,4vw,52px)] grid grid-cols-1 gap-0.5 sm:grid-cols-2 lg:grid-cols-4">
          {about.photos.map((photo) => (
            <figure key={photo.id} data-stagger className="group relative m-0 overflow-hidden">
              <ImageSlot
                src={photo.src || undefined}
                alt={photo.alt}
                aspectRatio="3/4"
                treatment="social"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                imageClassName="transition-transform duration-500 ease-out group-hover:scale-[1.05]"
              />
              {photo.caption ? (
                <figcaption className="pointer-events-none absolute inset-x-0 bottom-0 bg-[linear-gradient(0deg,rgba(11,14,19,0.92),transparent)] px-4 pt-10 pb-4 font-sans text-[11px] font-semibold tracking-[0.14em] text-text uppercase">
                  {photo.caption}
                </figcaption>
              ) : null}
            </figure>
          ))}

          <a
            {...instagram()}
            data-stagger
            className="group flex flex-col gap-8 border border-line-strong bg-bg-alt p-5 sm:aspect-3/4 sm:gap-0 transition-colors duration-300 hover:border-accent/50 hover:bg-surface-hover"
          >
            <span className="flex items-center gap-2 font-sans text-[10px] font-semibold tracking-[0.14em] text-text-dim">
              <span className="grid place-items-center text-accent">
                <InstagramIcon />
              </span>
              {about.instagram.label}
            </span>

            <span className="flex flex-1 flex-col justify-center">
              <span className="block font-display text-[clamp(40px,5.6vw,68px)] leading-[0.88] font-extrabold uppercase">
                <CountUp value={15.6} prefix="+" decimals={1} suffix=" MIL" />
              </span>
              <span className="mt-4 block max-w-[24ch] text-[14px] leading-[1.55] text-text-dim">
                {about.instagram.caption}
              </span>
            </span>

            <span className="inline-flex items-center gap-[7px] font-sans text-xs font-bold text-accent-soft transition-colors group-hover:text-accent-bright">
              {about.instagram.cta}
              <ArrowUpRight
                width={18}
                height={18}
                strokeWidth={1.6}
                aria-hidden
                className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </span>
          </a>
        </div>
      </div>
    </RevealSection>
  );
}
