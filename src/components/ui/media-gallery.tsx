"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Play } from "lucide-react";
import { useReducedMotion } from "motion/react";
import { useHydrated } from "@/hooks/use-hydrated";
import { cn } from "@/lib/utils";
import type { GalleryItem } from "@/content/content";

/** Velocidade do deslize automático, em pixels por segundo. */
const DRIFT_PX_S = 22;

/**
 * Galeria horizontal com deslize contínuo, arrasto por mouse e scroll nativo.
 *
 * A lista é duplicada para o loop: ao passar da metade, o scroll volta ao
 * início sem transição visível. Por isso o segundo conjunto é escondido de
 * leitores de tela — é a mesma mídia repetida.
 */
export function MediaGallery({ items, className }: { items: GalleryItem[]; className?: string }) {
  const trackRef = useRef<HTMLUListElement>(null);
  const [playing, setPlaying] = useState<string | null>(null);
  const arrasto = useRef<{ x: number; scroll: number; moveu: boolean } | null>(null);
  const [arrastando, setArrastando] = useState(false);
  const reduced = useReducedMotion();
  // useReducedMotion() é null no primeiro render; sem esperar a hidratação
  // o efeito lia null como "pausado" e nunca reagia depois.
  const hydrated = useHydrated();

  const pausado = !hydrated || arrastando || playing !== null || reduced === true;

  // Deslize automático. Ao cruzar a metade (fim do primeiro conjunto),
  // recua a mesma distância: o conteúdo é idêntico, então não se percebe.
  useEffect(() => {
    if (pausado) return;
    const el = trackRef.current;
    if (!el) return;
    let raf = 0;
    let anterior = performance.now();
    // scrollLeft arredonda para inteiro. A 22px/s são 0,36px por quadro, que
    // se perdia no arredondamento e travava a posição. A posição real é
    // acumulada aqui e só escrita quando passa de 1px.
    let pos = el.scrollLeft;
    const passo = (agora: number) => {
      const dt = (agora - anterior) / 1000;
      anterior = agora;
      const metade = el.scrollWidth / 2;
      pos += DRIFT_PX_S * dt;
      if (pos >= metade) pos -= metade;
      if (Math.abs(pos - el.scrollLeft) >= 1) el.scrollLeft = pos;
      raf = requestAnimationFrame(passo);
    };
    raf = requestAnimationFrame(passo);
    return () => cancelAnimationFrame(raf);
  }, [pausado]);

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    const el = trackRef.current;
    if (!el || e.pointerType === "touch") return; // toque já rola nativamente
    arrasto.current = { x: e.clientX, scroll: el.scrollLeft, moveu: false };
    setArrastando(true);
  }, []);

  useEffect(() => {
    if (!arrastando) return;
    const el = trackRef.current;
    if (!el) return;
    const mover = (e: PointerEvent) => {
      const d = arrasto.current;
      if (!d) return;
      const delta = e.clientX - d.x;
      if (Math.abs(delta) > 3) d.moveu = true;
      el.scrollLeft = d.scroll - delta;
    };
    const soltar = () => {
      setArrastando(false);
      // zera no próximo tick para o clique saber se houve arrasto
      setTimeout(() => {
        arrasto.current = null;
      }, 0);
    };
    window.addEventListener("pointermove", mover);
    window.addEventListener("pointerup", soltar);
    window.addEventListener("pointercancel", soltar);
    return () => {
      window.removeEventListener("pointermove", mover);
      window.removeEventListener("pointerup", soltar);
      window.removeEventListener("pointercancel", soltar);
    };
  }, [arrastando]);

  // Duplica a lista para o loop; sem repetição haveria um salto no fim.
  const loop = reduced === true ? items : [...items, ...items];

  return (
    <div className={cn("relative", className)}>
      <ul
        ref={trackRef}
        onPointerDown={onPointerDown}
        className={cn(
          "vl-scroll-x flex gap-2 overflow-x-auto overscroll-x-contain",
          arrastando ? "cursor-grabbing select-none" : "cursor-grab",
        )}
      >
        {loop.map((item, i) => {
          const clone = i >= items.length;
          const key = clone ? `${item.id}-clone` : item.id;
          return (
            <li
              key={key}
              aria-hidden={clone || undefined}
              className="group relative aspect-3/4 w-[clamp(210px,60vw,268px)] flex-none overflow-hidden bg-bg-alt"
            >
              {item.type === "image" ? (
                <Image
                  src={item.src}
                  alt={clone ? "" : item.alt}
                  fill
                  draggable={false}
                  sizes="(max-width: 640px) 60vw, 268px"
                  style={item.focus ? { objectPosition: item.focus } : undefined}
                  className="pointer-events-none object-cover vl-photo-social transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                />
              ) : playing === key ? (
                <video
                  src={item.src}
                  poster={item.poster}
                  controls
                  autoPlay
                  playsInline
                  preload="none"
                  className="h-full w-full object-cover"
                />
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    if (arrasto.current?.moveu) return; // arrasto não é clique
                    setPlaying(key);
                  }}
                  aria-label={`Reproduzir vídeo: ${item.alt}`}
                  className="absolute inset-0"
                >
                  <Image
                    src={item.poster}
                    alt=""
                    fill
                    draggable={false}
                    sizes="(max-width: 640px) 60vw, 268px"
                    style={item.focus ? { objectPosition: item.focus } : undefined}
                    className="pointer-events-none object-cover vl-photo-social transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                  />
                  <span className="absolute inset-0 grid place-items-center">
                    <span className="grid h-14 w-14 place-items-center border border-white/70 bg-black/45 transition-colors duration-300 group-hover:border-accent group-hover:bg-accent/85">
                      <Play
                        width={22}
                        height={22}
                        strokeWidth={2}
                        className="translate-x-[1px] fill-white text-white"
                      />
                    </span>
                  </span>
                </button>
              )}

              {item.label && playing !== key ? (
                <span className="pointer-events-none absolute inset-x-0 bottom-0 bg-[linear-gradient(0deg,rgba(11,14,19,0.92),transparent)] px-4 pt-10 pb-4 font-sans text-[11px] font-semibold tracking-[0.14em] text-text uppercase">
                  {item.label}
                </span>
              ) : null}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
