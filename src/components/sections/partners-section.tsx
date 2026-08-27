import Image from "next/image";
import { RevealSection } from "@/components/ui/reveal-section";
import { RevealWords } from "@/components/ui/reveal-words";
import { partners } from "@/content/content";

export function PartnersSection() {
  if (partners.items.length === 0) return null;

  return (
    <RevealSection
      id="sp"
      className="border-b border-line bg-bg px-[clamp(18px,3vw,44px)] py-[clamp(36px,4vw,64px)] vl-texture"
    >
      <div className="mx-auto max-w-[1240px]">
        <div
          data-stagger
          className="mb-[18px] font-sans text-[10px] font-semibold tracking-[0.2em] text-text-dim"
        >
          {partners.eyebrow}
        </div>
        <h2 className="font-display text-[clamp(28px,4.2vw,56px)] leading-[0.9] font-extrabold uppercase">
          <RevealWords
            segments={[{ text: partners.titleLead }, { text: partners.titleAccent, accent: true }]}
          />
        </h2>

        <div className="mt-[clamp(30px,4vw,56px)] grid grid-cols-2 border-t border-line-strong lg:grid-cols-5">
          {partners.items.map((partner) => {
            const Celula = partner.url ? "a" : "div";
            const linkProps = partner.url
              ? { href: partner.url, target: "_blank" as const, rel: "noopener", "aria-label": `${partner.name} no Instagram` }
              : {};
            return (
            <Celula
              key={partner.name}
              {...linkProps}
              data-stagger
              className="group flex min-h-[136px] items-center justify-center border-b border-line px-5 py-7 text-center transition-colors duration-300 hover:bg-surface-hover not-[:nth-child(2n+1)]:border-l lg:nth-[2n+1]:border-l lg:not-[:nth-child(5n+1)]:border-l lg:nth-[5n+1]:border-l-0"
            >
              {partner.logo ? (
                /* Caixa única e centrada para todos. Os logos vão de 0.86
                   (quadrado) a 4.44 (faixa larga); a altura é compensada por
                   proporção para igualar o peso visual dentro da mesma caixa. */
                <span
                  className="relative block w-full max-w-[160px]"
                  style={{ height: partner.wide ? "2.75rem" : "5.25rem" }}
                >
                  <Image
                    src={partner.logo}
                    alt={partner.name}
                    fill
                    sizes="160px"
                    className="object-contain"
                  />
                </span>
              ) : (
                /* Sem logo, o nome ocupa a mesma caixa dos logos para a grade
                   não perder o ritmo. */
                <span className="flex h-16 w-full max-w-[150px] items-center justify-center font-display text-[clamp(17px,1.6vw,21px)] leading-[1.1] font-bold text-text-body uppercase transition-colors duration-300 group-hover:text-text">
                  {partner.name}
                </span>
              )}
            </Celula>
            );
          })}
        </div>
      </div>
    </RevealSection>
  );
}
