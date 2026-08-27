"use client";

import { useEffect, useRef } from "react";

const DURATION_DELAY = 70;
const CLIP_OFFSET = 120;

/**
 * Revela os filhos [data-stagger] / [data-clip] da seção quando ela entra na
 * viewport. O "já revelado" vive num Set do próprio hook, não como atributo no
 * DOM — flag no DOM sobrevive a remontagem e trava o observer.
 */
export function useReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const revealed = useRef(new Set<Element>());

  useEffect(() => {
    const section = ref.current;
    if (!section) return;

    const staggerNodes = Array.from(section.querySelectorAll<HTMLElement>("[data-stagger]"));
    const clipNodes = Array.from(section.querySelectorAll<HTMLElement>("[data-clip]"));

    const reducedMotion =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reducedMotion || typeof IntersectionObserver === "undefined") return;

    // Seções acima da dobra entram sem animação.
    if (section.getBoundingClientRect().top < window.innerHeight * 0.85) return;

    // Só esconde depois de confirmar que o observer vai rodar.
    const armed = [...staggerNodes, ...clipNodes];
    armed.forEach((node) => node.setAttribute("data-armed", "true"));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting || revealed.current.has(entry.target)) return;
          revealed.current.add(entry.target);
          observer.unobserve(entry.target);

          const targets = staggerNodes.length ? staggerNodes : [section];
          targets.forEach((node, i) => {
            node.style.setProperty("--vl-delay", `${i * DURATION_DELAY}ms`);
            node.setAttribute("data-revealed", "true");
          });

          clipNodes.forEach((node, i) => {
            node.style.setProperty("--vl-delay", `${i * DURATION_DELAY + CLIP_OFFSET}ms`);
            node.setAttribute("data-revealed", "true");
          });
        });
      },
      { rootMargin: "0px 0px -14% 0px", threshold: 0.04 },
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return ref;
}
