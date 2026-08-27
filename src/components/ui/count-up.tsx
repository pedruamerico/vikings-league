"use client";

import { useEffect, useRef } from "react";
import { animate, useInView, useMotionValue, useReducedMotion } from "motion/react";

type CountUpProps = {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  /** Zeros à esquerda, ex.: 2 para "04". */
  padStart?: number;
  duration?: number;
  className?: string;
  /**
   * Conta na montagem em vez de na rolagem. Necessário acima da dobra, onde o
   * elemento já nasce visível: esperar o scroll deixaria o valor final exposto
   * e a animação só rodaria se o usuário voltasse.
   */
  onMount?: boolean;
  delay?: number;
};

function format(n: number, decimals: number, padStart: number) {
  const fixed = n.toFixed(decimals);
  if (decimals > 0) {
    const [int, frac] = fixed.split(".");
    return `${int.padStart(padStart, "0")},${frac}`;
  }
  return fixed.padStart(padStart, "0");
}

export function CountUp({
  value,
  prefix = "",
  suffix = "",
  decimals = 0,
  padStart = 0,
  duration = 1.6,
  className,
  onMount = false,
  delay = 0,
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -14% 0px" });
  const reduced = useReducedMotion();
  const motionValue = useMotionValue(0);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const reveal = () => {
      node.style.visibility = "visible";
    };

    if (reduced) {
      reveal();
      return;
    }
    if (!onMount && !inView) return;

    // O conteúdo inicial é o valor final (SSR e no-JS). Zera antes de animar,
    // senão o número apareceria pronto.
    node.textContent = prefix + format(0, decimals, padStart) + suffix;
    reveal();

    const controls = animate(motionValue, value, {
      duration,
      delay,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (latest) => {
        node.textContent = prefix + format(latest, decimals, padStart) + suffix;
      },
    });
    return () => controls.stop();
  }, [
    inView,
    onMount,
    delay,
    reduced,
    motionValue,
    value,
    duration,
    prefix,
    suffix,
    decimals,
    padStart,
  ]);

  return (
    <>
      {/* Em onMount o valor sai escondido para não piscar o resultado antes de
          zerar; o efeito o revela. Escondido, não removido — leitor de tela e
          indexação continuam lendo. */}
      <span
        ref={ref}
        className={className}
        style={onMount ? { visibility: "hidden" } : undefined}
        suppressHydrationWarning
      >
        {prefix + format(value, decimals, padStart) + suffix}
      </span>
      {/* Sem JS o efeito nunca roda e o span acima ficaria invisível. */}
      {onMount ? (
        <noscript>
          <span className={className}>
            {prefix + format(value, decimals, padStart) + suffix}
          </span>
        </noscript>
      ) : null}
    </>
  );
}
