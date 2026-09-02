import Image from "next/image";
import { ClipboardPenLine } from "lucide-react";
import { InstagramIcon } from "@/components/ui/instagram-icon";
import { instagram, registration } from "@/lib/links";
import { footer, site } from "@/content/content";

export function SiteFooter() {
  return (
    <footer className="bg-bg-alt px-[clamp(18px,3vw,44px)] pt-[clamp(34px,5vw,64px)] pb-9 vl-texture">
      <div className="mx-auto grid max-w-[1240px] gap-[clamp(22px,4vw,48px)] sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-3">
            <Image
              src={site.logo.src}
              alt={site.logo.alt}
              width={42}
              height={42}
              className="h-[42px] w-[42px] object-contain"
            />
            <div>
              <div className="font-display text-[19px] font-extrabold uppercase">{footer.org}</div>
              <div className="mt-0.5 text-[13px] text-text-dim">{footer.league}</div>
            </div>
          </div>
          <p className="mt-4 max-w-[40ch] text-sm leading-[1.6] text-text-dim">
            {footer.description}
          </p>
        </div>

        <div>
          <div className="mb-3.5 font-sans text-[10px] font-semibold tracking-[0.16em] text-marker-off">
            {footer.columns.competition.label}
          </div>
          <div className="flex flex-col gap-2.5 text-sm">
            {footer.columns.competition.links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-text-body transition-colors hover:text-accent-soft"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>

        <div>
          <div className="mb-3.5 font-sans text-[10px] font-semibold tracking-[0.16em] text-marker-off">
            {footer.columns.contact.label}
          </div>
          <div className="flex flex-col gap-2.5 text-sm">
            <a
              {...instagram()}
              className="inline-flex items-center gap-2 text-text-body transition-colors hover:text-accent-soft"
            >
              <InstagramIcon />
              {footer.columns.contact.instagram}
            </a>
            <a
              {...registration()}
              className="inline-flex items-center gap-2 text-accent-soft transition-colors hover:text-accent-bright"
            >
              <ClipboardPenLine width={18} height={18} strokeWidth={1.6} aria-hidden />
              {footer.columns.contact.whatsapp}
            </a>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-[clamp(28px,4vw,44px)] flex max-w-[1240px] flex-wrap justify-between gap-2.5 border-t border-line pt-[18px] font-sans text-[10px] tracking-[0.12em] text-marker-off">
        <span>{footer.copyright}</span>
        <span>{footer.season}</span>
      </div>

      <div className="mx-auto mt-3.5 flex max-w-[1240px] flex-wrap items-center gap-x-2.5 gap-y-1.5 border-t border-white/8 pt-3.5 font-sans text-[13px] text-text-dim">
        <Image
          src="/images/pedro-americo-logo.svg"
          alt=""
          width={46}
          height={29}
          className="h-auto w-[46px] opacity-80"
        />
        <span>{footer.credit.text}</span>
        {footer.credit.links.map((link) => (
          <span key={link.href} className="contents">
            <span className="text-text-faint" aria-hidden>
              ·
            </span>
            <a
              href={link.href}
              target="_blank"
              rel="noopener"
              className="text-text-body underline-offset-4 transition-colors hover:text-text hover:underline"
            >
              {link.label}
            </a>
          </span>
        ))}
      </div>
    </footer>
  );
}
