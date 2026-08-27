import Image from "next/image";
import { InstagramIcon } from "@/components/ui/instagram-icon";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CountUp } from "@/components/ui/count-up";
import { ImageSlot } from "@/components/ui/image-slot";
import { RevealSection } from "@/components/ui/reveal-section";
import { whatsapp } from "@/lib/links";
import { org } from "@/content/content";

export function OrgSection() {
  return (
    <RevealSection
      id="sd"
      className="border-b border-line bg-bg-alt px-[clamp(18px,3vw,44px)] py-[clamp(44px,6vw,96px)] vl-texture"
    >
      <div className="mx-auto flex max-w-[1240px] flex-wrap items-center gap-[clamp(24px,4vw,60px)]">
        <div data-stagger className="min-w-[min(100%,260px)] flex-[0_1_380px]">
          <ImageSlot
            src={org.photo.src || undefined}
            alt={org.photo.alt}
            aspectRatio="3/4"
            sizes="(max-width: 900px) 100vw, 380px"
          />
        </div>

        <div data-stagger className="min-w-[min(100%,300px)] flex-[1_1_380px]">
          <div className="mb-4 font-sans text-[10px] font-semibold tracking-[0.2em] text-text-dim">
            {org.eyebrow}
          </div>
          <h2 className="font-display text-[clamp(30px,5vw,64px)] leading-[0.9] font-extrabold uppercase">
            {org.titleLead} <span className="text-accent">{org.titleAccent}</span>
          </h2>
          <p className="mt-4 max-w-[52ch] text-[clamp(15px,2vw,17px)] leading-[1.6] text-pretty text-text-muted">
            {org.paragraph}
          </p>

          {org.founded.year ? (
            /* Card do responsável: foto ao lado do nome, Instagram embaixo.
               Sem a foto o card continua válido, só com o texto. */
            <div className="mt-6 flex items-center gap-4 border border-line-strong bg-bg/40 p-4">
              {org.founded.photo ? (
                <span className="relative block h-16 w-16 flex-none overflow-hidden border border-line-strong">
                  <Image
                    src={org.founded.photo}
                    alt={org.founded.photoAlt}
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                </span>
              ) : null}

              <div className="min-w-0">
                <div className="font-sans text-[10px] font-semibold tracking-[0.16em] text-text-dim uppercase">
                  Fundada em {org.founded.year}
                </div>
                <div className="mt-1 font-display text-[clamp(19px,2vw,24px)] leading-[1.05] font-bold uppercase">
                  {org.founded.by}
                </div>
                <div className="mt-0.5 font-sans text-[13px] text-text-dim">{org.founded.role}</div>

                {org.founded.instagram ? (
                  <a
                    href={org.founded.instagram}
                    target="_blank"
                    rel="noopener"
                    className="mt-2 inline-flex items-center gap-1.5 font-sans text-[12px] font-semibold text-accent-soft transition-colors hover:text-accent-bright"
                  >
                    <InstagramIcon size={14} />
                    @vkg_iranzera
                  </a>
                ) : null}
              </div>
            </div>
          ) : null}

          <div className="mt-[clamp(22px,3vw,32px)] flex flex-wrap gap-x-[clamp(28px,5vw,64px)] gap-y-6">
            <div>
              <div className="font-display text-[clamp(30px,4.4vw,54px)] leading-[0.9] font-extrabold uppercase">
                <CountUp value={org.followers.count} prefix="+" decimals={1} suffix=" mil" />
              </div>
              <div className="mt-2 font-sans text-[10px] font-semibold tracking-[0.16em] text-text-dim">
                {org.followers.label}
              </div>
            </div>

            {org.achievement.value ? (
              <div className="border-l border-line-strong pl-[clamp(20px,3vw,32px)]">
                <div className="font-display text-[clamp(30px,4.4vw,54px)] leading-[0.9] font-extrabold text-accent-soft uppercase">
                  {org.achievement.value}
                </div>
                <div className="mt-2 font-sans text-[10px] font-semibold tracking-[0.16em] text-text-dim">
                  {org.achievement.label}
                </div>
                <div className="mt-1.5 max-w-[30ch] font-sans text-[13px] leading-[1.5] text-text-dim">
                  {org.achievement.detail}
                </div>
              </div>
            ) : null}
          </div>

          <Button {...whatsapp()} className="mt-[clamp(22px,3vw,32px)]">
            {org.cta}
            <ArrowRight width={18} height={18} strokeWidth={1.6} aria-hidden />
          </Button>
        </div>
      </div>
    </RevealSection>
  );
}
