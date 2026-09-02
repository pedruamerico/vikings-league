import Image from "next/image";
import { ClipboardPenLine } from "lucide-react";
import { Button } from "@/components/ui/button";
import { registration } from "@/lib/links";
import { header, site } from "@/content/content";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-70 flex items-center justify-between gap-3 border-b border-line bg-[rgba(11,14,19,0.92)] px-[clamp(14px,3vw,34px)] py-2.5 backdrop-blur-[16px]">
      <div className="flex min-w-0 items-center gap-2.5">
        <Image
          src={site.logo.src}
          alt={site.logo.alt}
          width={32}
          height={32}
          priority
          className="h-8 w-8 flex-none object-contain"
        />
        <span className="hidden font-display text-lg font-extrabold tracking-[0.03em] uppercase min-[400px]:inline">
          {site.name}
        </span>
      </div>
      <nav className="hidden items-center gap-[clamp(18px,2.4vw,34px)] lg:flex">
        {header.links.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="font-sans text-[11px] font-semibold tracking-[0.14em] whitespace-nowrap text-text-dim uppercase transition-colors hover:text-text"
          >
            {link.label}
          </a>
        ))}
      </nav>

      <div className="flex items-center gap-3">
        <Button {...registration()} size="sm" className="whitespace-nowrap max-[399px]:px-3">
          <ClipboardPenLine width={18} height={18} strokeWidth={1.6} aria-hidden />
          {header.cta}
        </Button>
      </div>
    </header>
  );
}
