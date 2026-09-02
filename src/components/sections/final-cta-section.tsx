import Image from "next/image";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RevealSection } from "@/components/ui/reveal-section";
import { RevealWords } from "@/components/ui/reveal-words";
import { finalCta, site } from "@/content/content";
import { registration } from "@/lib/links";

export function FinalCtaSection() {
  return (
    <RevealSection
      id="inscricao"
      className="scroll-mt-16 border-b border-line bg-bg px-[clamp(18px,3vw,44px)] py-[clamp(52px,8vw,130px)] vl-texture"
    >
      <div className="mx-auto max-w-[1240px]">
        <div className="flex flex-wrap items-start gap-[clamp(24px,4vw,64px)]">
          <div className="min-w-[min(100%,300px)] flex-[1_1_460px]">
            <Image
              data-stagger
              src={site.logo.src}
              alt={site.logo.alt}
              width={116}
              height={116}
              className="block h-auto w-[clamp(88px,12vw,116px)]"
            />
            <h2
              className="mt-[clamp(16px,2.4vw,26px)] max-w-[20ch] font-display text-[clamp(36px,7.4vw,104px)] leading-[0.95] font-extrabold text-balance uppercase"
            >
              <RevealWords
                segments={[
                  { text: finalCta.titleLead },
                  { text: finalCta.titleAccent, accent: true },
                ]}
                tail={finalCta.titleTail}
              />
            </h2>
          </div>

          <div className="min-w-[min(100%,280px)] flex-[1_1_360px]">
            <p
              data-stagger
              className="text-[clamp(15px,2vw,18px)] leading-[1.6] text-pretty text-text-muted"
            >
              {finalCta.paragraph}
            </p>

            {/* O preço vem antes do botão: quem clica precisa saber o que está
                comprando. Antes ele era microtexto depois do CTA. */}
            <div
              data-stagger
              className="mt-[clamp(22px,3vw,32px)] border border-line-strong bg-black/25 p-[clamp(18px,2.4vw,26px)]"
            >
              <div className="font-display text-[clamp(40px,5.4vw,64px)] leading-[0.9] font-extrabold text-accent-soft uppercase">
                {finalCta.offer.price}
              </div>
              <div className="mt-2.5 font-sans text-[14px] leading-[1.5] text-text">
                {finalCta.offer.label}
              </div>
              <div className="mt-1 flex flex-wrap items-center gap-2 font-sans text-[13px] text-text-dim">
                <span>{finalCta.offer.vacancies}</span>
                <span className="text-accent" aria-hidden>
                  /
                </span>
                <span>{finalCta.offer.duration}</span>
              </div>

              <Button {...registration()} size="block" className="mt-[clamp(18px,2.4vw,24px)]">
                {finalCta.cta}
                <ArrowRight width={18} height={18} strokeWidth={1.6} aria-hidden />
              </Button>

              <p className="mt-3 flex items-center justify-center gap-2 font-sans text-[12px] text-text-dim">
                <ShieldCheck width={15} height={15} strokeWidth={1.6} aria-hidden />
                {finalCta.note}
              </p>
            </div>

          </div>
        </div>
      </div>
    </RevealSection>
  );
}
