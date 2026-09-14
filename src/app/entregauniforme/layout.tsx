import Image from "next/image";
import Link from "next/link";
import { site } from "@/content/content";

export default function UniformDeliveryLayout({ children }: LayoutProps<"/entregauniforme">) {
  return (
    <div className="min-h-screen bg-bg text-text vl-texture-page">
      <header className="border-b border-line bg-[rgba(11,14,19,0.92)] px-[clamp(14px,3vw,34px)] py-2.5">
        <Link href="/" className="inline-flex items-center gap-2.5">
          <Image
            src={site.logo.src}
            alt={site.logo.alt}
            width={32}
            height={32}
            priority
            className="h-8 w-8 flex-none object-contain"
          />
          <span className="font-display text-lg font-extrabold tracking-[0.03em] uppercase">{site.name}</span>
        </Link>
      </header>
      {children}
    </div>
  );
}
