import Image from "next/image";
import { ArrowRight, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CountUp } from "@/components/ui/count-up";
import { Magnetic } from "@/components/ui/magnetic";
import { RevealWords } from "@/components/ui/reveal-words";
import { whatsapp } from "@/lib/links";
import { config, hero, site } from "@/content/content";

function Stat({
  value,
  label,
  accent = false,
  count,
}: {
  value: string;
  label: string;
  accent?: boolean;
  /** Quando presente, o número conta ao entrar na viewport. */
  count?: React.ComponentProps<typeof CountUp>;
}) {
  return (
    <div className="flex-[1_1_160px] border-l border-white/16 px-[18px] py-4 first:border-l-0">
      <div
        className={`font-display text-[clamp(28px,4.2vw,40px)] leading-[0.9] font-extrabold uppercase ${
          accent ? "text-accent-soft" : ""
        }`}
      >
        {count ? <CountUp {...count} /> : value}
      </div>
      <div className="mt-2 font-sans text-[10px] font-semibold tracking-[0.16em] text-text-dim">
        {label}
      </div>
    </div>
  );
}

export function HeroSection() {
  return (
    <section
      id="s1"
      className="relative flex min-h-[clamp(600px,90vh,920px)] items-end justify-center overflow-hidden border-b border-line bg-bg"
    >
      <div className="pointer-events-none absolute inset-0 bg-bg vl-texture-hero" aria-hidden />
      <Image
        src={site.logo.src}
        alt=""
        aria-hidden
        width={900}
        height={900}
        priority
        className="pointer-events-none absolute top-1/2 left-1/2 z-0 h-auto w-[900px] max-w-none -translate-x-1/2 -translate-y-1/2 opacity-5 saturate-[1.8]"
      />

      <div className="pointer-events-none relative z-2 mx-auto w-full max-w-[1100px] px-[clamp(18px,3vw,44px)] pt-[clamp(72px,11vh,132px)] pb-[clamp(32px,5vw,68px)] text-center">
        <Image
          src={site.logo.src}
          alt={site.logo.alt}
          width={196}
          height={196}
          priority
          className="mx-auto block h-auto w-[clamp(120px,20vw,196px)]"
        />

        <div className="mt-[clamp(14px,2vw,22px)] inline-flex items-center gap-[9px] font-sans text-[10px] font-semibold tracking-[0.18em] text-text-dim">
          <span className="h-1.5 w-1.5 bg-accent vl-pulse" aria-hidden />
          {hero.eyebrow}
        </div>

        <h1 className="mx-auto mt-[clamp(12px,2vw,20px)] max-w-[22ch] font-display text-[clamp(42px,8.4vw,112px)] leading-[0.86] font-extrabold text-balance uppercase">
          <RevealWords
            onMount
            delay={0.15}
            segments={[{ text: hero.titleLead }, { text: hero.titleAccent, accent: true }]}
          />
        </h1>

        <p className="mx-auto mt-[clamp(16px,2.2vw,24px)] max-w-[56ch] text-[clamp(15px,1.9vw,18px)] leading-[1.6] text-pretty text-text-muted">
          {hero.paragraph}
        </p>

        <div className="mx-auto mt-[clamp(24px,3.4vw,38px)] flex max-w-[720px] flex-wrap justify-center border border-white/16 bg-black/35">
          <Stat
            value={hero.stats.vacancies.value}
            label={hero.stats.vacancies.label}
            count={{ value: 120, onMount: true, delay: 0.7 }}
          />
          {config.showPrice ? (
            <Stat
              value={hero.stats.price.value}
              label={hero.stats.price.label}
              accent
              count={{ value: 89.9, prefix: "R$ ", decimals: 2, onMount: true, delay: 0.8 }}
            />
          ) : null}
          <Stat value={hero.stats.duration.value} label={hero.stats.duration.label} />
        </div>

        <div className="pointer-events-auto mt-[clamp(18px,2.6vw,28px)] flex flex-wrap justify-center gap-2.5">
          <Magnetic className="flex-[0_1_250px]">
            <Button {...whatsapp()} size="lg" className="group w-full">
              {hero.primaryCta}
              <ArrowRight
                width={18}
                height={18}
                strokeWidth={1.6}
                aria-hidden
                className="transition-transform duration-300 ease-out group-hover:translate-x-1"
              />
            </Button>
          </Magnetic>
          <Magnetic className="flex-[0_1_220px]">
            <Button {...whatsapp()} variant="outline" size="lg" className="w-full">
              <MessageCircle width={18} height={18} strokeWidth={1.6} aria-hidden />
              {hero.secondaryCta}
            </Button>
          </Magnetic>
        </div>
      </div>
    </section>
  );
}
