"use client";

import { useReveal } from "@/hooks/use-reveal";

type RevealSectionProps = React.ComponentProps<"section">;

/**
 * Wrapper client mínimo: só ancora o IntersectionObserver. O conteúdo continua
 * sendo renderizado no servidor e passa por children.
 */
export function RevealSection({ children, ...props }: RevealSectionProps) {
  const ref = useReveal<HTMLElement>();
  return (
    <section ref={ref} {...props}>
      {children}
    </section>
  );
}
