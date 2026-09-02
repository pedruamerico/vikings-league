import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CountUp } from "@/components/ui/count-up";
import { InstagramIcon } from "@/components/ui/instagram-icon";
import { RevealSection } from "@/components/ui/reveal-section";
import { org } from "@/content/content";
import { registration } from "@/lib/links";

const headingClass =
  "font-display text-[clamp(32px,4.4vw,56px)] leading-[0.9] font-extrabold uppercase";

export function OrgSection() {
  return (
    <RevealSection
      id="sd"
      className="border-b border-line bg-bg-alt px-[clamp(18px,3vw,44px)] py-[clamp(44px,6vw,96px)] vl-texture"
    >
      <div className="mx-auto max-w-[1240px]">
        <div className="grid gap-[clamp(44px,5vw,72px)] md:grid-cols-2">
          <article data-stagger className="flex min-w-0 flex-col">
            <h2 className={headingClass}>{org.founded.heading}</h2>
            <div className="relative mt-[clamp(20px,2.4vw,30px)] aspect-[16/11] overflow-hidden bg-bg">
              <Image
                src={org.founded.photo}
                alt={org.founded.photoAlt}
                fill
                sizes="(max-width: 767px) 100vw, 50vw"
                className="object-cover object-[center_22%] vl-photo-social"
              />
            </div>
            <div className="mt-[clamp(20px,2.6vw,30px)] border-t border-line-strong pt-5">
              <a
                href={org.founded.instagram}
                target="_blank"
                rel="noopener"
                className="group inline-flex items-center gap-2 font-display text-[clamp(24px,2.8vw,34px)] leading-none font-bold uppercase"
              >
                {org.founded.by}
                <InstagramIcon
                  size={16}
                  className="text-accent-soft transition-colors group-hover:text-accent-bright"
                />
              </a>
              <p className="mt-2 font-sans text-[11px] font-semibold tracking-[0.16em] text-accent-soft uppercase">
                {org.founded.role}
              </p>
              <p className="mt-4 max-w-[52ch] text-[clamp(15px,1.6vw,17px)] leading-[1.65] text-pretty text-text-muted">
                {org.founded.paragraph}
              </p>
            </div>
          </article>

          <article data-stagger className="flex min-w-0 flex-col">
            <h2 className={headingClass}>
              {org.titleLead} <span className="text-accent">{org.titleAccent}</span>
            </h2>
            <div className="relative mt-[clamp(20px,2.4vw,30px)] aspect-[16/11] overflow-hidden bg-bg">
              <Image
                src={org.photo.src}
                alt={org.photo.alt}
                fill
                sizes="(max-width: 767px) 100vw, 50vw"
                className="object-cover object-center vl-photo"
              />
              <span
                className="pointer-events-none absolute inset-0 bg-accent opacity-15 mix-blend-soft-light"
                aria-hidden
              />
            </div>
            <div className="mt-[clamp(20px,2.6vw,30px)] border-t border-line-strong pt-5">
              <h3 className="font-display text-[clamp(24px,2.8vw,34px)] leading-none font-bold uppercase">
                {org.name}
              </h3>
              <p className="mt-2 font-sans text-[11px] font-semibold tracking-[0.16em] text-accent-soft uppercase">
                {org.category}
              </p>
              <p className="mt-4 max-w-[52ch] text-[clamp(15px,1.6vw,17px)] leading-[1.65] text-pretty text-text-muted">
                {org.paragraph}
              </p>
            </div>
          </article>
        </div>

        <div
          data-stagger
          className="mt-[clamp(44px,6vw,76px)] grid border-y border-line-strong sm:grid-cols-2"
        >
          <div className="py-[clamp(24px,3vw,34px)] sm:pr-[clamp(28px,5vw,64px)]">
            <div className="font-display text-[clamp(38px,5vw,62px)] leading-[0.9] font-extrabold uppercase">
              <CountUp value={org.followers.count} prefix="+" decimals={1} suffix=" mil" />
            </div>
            <div className="mt-2 font-sans text-[10px] font-semibold tracking-[0.16em] text-text-dim">
              {org.followers.label}
            </div>
          </div>
          <div className="border-t border-line-strong py-[clamp(24px,3vw,34px)] sm:border-t-0 sm:border-l sm:pl-[clamp(28px,5vw,64px)]">
            <div className="font-display text-[clamp(38px,5vw,62px)] leading-[0.9] font-extrabold text-accent-soft uppercase">
              {org.achievement.value}
            </div>
            <div className="mt-2 font-sans text-[10px] font-semibold tracking-[0.16em] text-text-dim">
              {org.achievement.label}
            </div>
            <div className="mt-1.5 font-sans text-[13px] leading-[1.5] text-text-dim">
              {org.achievement.detail}
            </div>
          </div>
        </div>

        <div data-stagger className="mt-[clamp(28px,4vw,42px)] flex justify-center">
          <Button {...registration()}>
            {org.cta}
            <ArrowRight width={18} height={18} strokeWidth={1.6} aria-hidden />
          </Button>
        </div>
      </div>
    </RevealSection>
  );
}
