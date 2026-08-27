"use client";

import { Fragment, type ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";
import { useHydrated } from "@/hooks/use-hydrated";

type RevealWordsProps = {
  segments: Array<{ text: string; accent?: boolean }>;
  className?: string;
  tail?: ReactNode;
  onMount?: boolean;
  delay?: number;
};

const WORD = {
  hidden: { opacity: 0, y: "0.35em" },
  visible: { opacity: 1, y: 0 },
};

export function RevealWords({
  segments,
  className,
  tail,
  onMount = false,
  delay = 0,
}: RevealWordsProps) {
  const reduced = useReducedMotion();
  const hydrated = useHydrated();

  if (hydrated && reduced) {
    return (
      <span className={className}>
        {segments.map((seg, i) => (
          <Fragment key={i}>
            {i > 0 ? " " : null}
            <span className={seg.accent ? "text-accent" : undefined}>{seg.text}</span>
          </Fragment>
        ))}
        {tail}
      </span>
    );
  }

  return (
    <motion.span
      className={className}
      initial="hidden"
      {...(onMount
        ? { animate: "visible" }
        : {
            whileInView: "visible",
            viewport: { once: true, margin: "0px 0px -14% 0px" },
          })}
      transition={{ staggerChildren: 0.055, delayChildren: delay }}
    >
      {segments.map((seg, si) => (
        <Fragment key={si}>
          {si > 0 ? " " : null}
          <span className={seg.accent ? "text-accent" : undefined}>
            {seg.text.split(" ").map((word, wi, arr) => {
              const isLastWord = si === segments.length - 1 && wi === arr.length - 1;
              return (
                <Fragment key={wi}>
                  {/* A máscara precisa de folga vertical: sem ela o overflow
                      corta acentos (Á, Ê, Ç) que sobem além da caixa da palavra.
                      O padding é compensado pela margem negativa. */}
                  <span className="-my-[0.15em] inline-block overflow-hidden py-[0.15em] align-bottom">
                    <motion.span
                      className="inline-block"
                      variants={WORD}
                      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    >
                      {word}
                      {isLastWord ? tail : null}
                    </motion.span>
                  </span>
                  {wi < arr.length - 1 ? " " : null}
                </Fragment>
              );
            })}
          </span>
        </Fragment>
      ))}
    </motion.span>
  );
}
