"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { nav } from "@/content/content";

/**
 * Rail lateral fixo. A marca ativa é a última seção cujo topo já passou de 42%
 * da viewport. Escondido no mobile — não há largura para ele.
 */
export function SideRail() {
  const [active, setActive] = useState(-1);

  useEffect(() => {
    const onScroll = () => {
      const mid = window.innerHeight * 0.42;
      let next = -1;
      nav.ticks.forEach((tick, i) => {
        const section = document.querySelector(tick.href);
        if (section && section.getBoundingClientRect().top <= mid) next = i;
      });
      setActive(next);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      aria-label="Seções da página"
      className="fixed inset-y-0 left-0 z-75 hidden w-[clamp(30px,4vw,54px)] flex-col items-center justify-center gap-3.5 border-r border-line bg-bg md:flex"
    >
      {nav.ticks.map((tick, i) => (
        <a
          key={tick.href}
          href={tick.href}
          className={cn(
            "flex flex-col items-center gap-1.5 font-sans text-[9px] font-semibold tracking-[0.08em] transition-colors",
            i === active ? "text-accent" : "text-rail",
          )}
        >
          {tick.label}
          <span className="block h-4 w-px bg-current" aria-hidden />
        </a>
      ))}
    </nav>
  );
}
