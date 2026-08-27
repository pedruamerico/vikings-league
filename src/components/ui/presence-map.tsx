"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { geoOrthographic, geoPath, geoGraticule10 } from "d3-geo";
import { useReducedMotion } from "motion/react";
import { useHydrated } from "@/hooks/use-hydrated";
import { cn } from "@/lib/utils";
import { GLOBE_BASE, GLOBE_ITEMS } from "./presence-map-data";

const SIZE = 640;
const RADIUS = SIZE / 2 - 10;
const CENTER = SIZE / 2;
/** Uma volta a cada 40s. */
const DEG_PER_MS = 360 / 40_000;

const START_LON = 30;

export function PresenceMap({ className }: { className?: string }) {
  const reduced = useReducedMotion();
  const hydrated = useHydrated();
  const [lon, setLon] = useState(START_LON);
  const [active, setActive] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const drag = useRef<{ x: number } | null>(null);

  const projection = useMemo(
    () =>
      geoOrthographic()
        .rotate([lon, -5])
        .scale(RADIUS)
        .translate([CENTER, CENTER])
        .clipAngle(90),
    [lon],
  );

  const path = useMemo(() => geoPath(projection), [projection]);

  useEffect(() => {
    if (!hydrated || reduced) return;
    let raf = 0;
    let prev = performance.now();
    const tick = (now: number) => {
      const dt = now - prev;
      prev = now;
      setLon((l) => (l + dt * DEG_PER_MS) % 360);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [hydrated, reduced]);

  // Sem array de dependências este efeito rodava a cada quadro da rotação, e o
  // onUp que ele registrava zerava a pausa continuamente.
  useEffect(() => {
    if (!dragging) return;
    const onMove = (e: PointerEvent) => {
      const d = drag.current;
      if (!d) return;
      // Soma o deslocamento desde o último evento em vez de fixar um ângulo
      // absoluto: assim o arrasto acompanha a rotação, que nunca para.
      const delta = (e.clientX - d.x) * 0.35;
      d.x = e.clientX;
      setLon((l) => (l + delta) % 360);
    };
    const onUp = () => {
      drag.current = null;
      setDragging(false);
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, [dragging]);

  const basePath = useMemo(
    () => GLOBE_BASE.map((g) => path(g)).filter(Boolean).join(" "),
    [path],
  );
  const graticule = useMemo(() => path(geoGraticule10()) ?? "", [path]);

  const visible = GLOBE_ITEMS.map((item) => {
    const d = path(item.geometry);
    const point = projection([item.lon, item.lat]);
    if (!point) return null;
    const [x, y] = point;
    const dist = Math.hypot(x - CENTER, y - CENTER);
    if (!d || dist > RADIUS) return null;
    // Perto da borda o país está virando para trás: o pin some gradualmente
    // em vez de piscar de uma vez.
    const edge = 1 - Math.min(1, Math.max(0, (dist - RADIUS * 0.86) / (RADIUS * 0.14)));
    return { ...item, d, x, y, edge };
  }).filter((v): v is NonNullable<typeof v> => v !== null);

  if (!hydrated) {
    return (
      <div
        className={cn("mx-auto w-full max-w-[530px]", className)}
        style={{ aspectRatio: "1" }}
        aria-hidden
      />
    );
  }

  /**
   * Coloca os pins evitando sobreposição: cada um tenta a posição natural e,
   * se colidir com um já colocado, desce até achar espaço. Sem isso, países
   * vizinhos (Itália/Portugal, Uruguai/Argentina) escrevem um por cima do outro.
   */
  const placed: Array<{
    item: (typeof visible)[number];
    px: number;
    py: number;
    w: number;
    flip: boolean;
  }> = [];

  for (const item of [...visible].sort((a, b) => a.y - b.y)) {
    const w = item.name.length * 8.2 + 18;
    const flip = item.x > CENTER;
    const px = flip ? item.x - w - 16 : item.x + 16;
    const base = item.y - 11;
    let py = base;
    // Tenta acima e abaixo alternadamente: distribui melhor que só empurrar
    // para baixo, que amontoava tudo num lado.
    for (let step = 0; step < 16; step += 1) {
      const offset = Math.ceil(step / 2) * 26 * (step % 2 === 0 ? 1 : -1);
      py = base + offset;
      const hit = placed.some(
        (o) => Math.abs(o.py - py) < 25 && o.px < px + w + 10 && px < o.px + o.w + 10,
      );
      if (!hit) break;
    }
    placed.push({ item, px, py, w, flip });
  }

  return (
    <div className={cn("mx-auto w-full max-w-[530px]", className)}>
      <svg
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        className="h-auto w-full cursor-grab touch-none select-none active:cursor-grabbing"
        role="img"
        aria-label={`Globo com a presença da Vikings Team E-sports em ${GLOBE_ITEMS.length} países: ${GLOBE_ITEMS.map((i) => i.name).join(", ")}.`}
        onPointerLeave={() => setActive(null)}
        onPointerDown={(e) => {
          drag.current = { x: e.clientX };
          setDragging(true);
        }}
      >
        <defs>
          <radialGradient id="globe-sphere" cx="36%" cy="30%" r="80%">
            <stop offset="0%" stopColor="#1B2739" />
            <stop offset="100%" stopColor="#0A0D12" />
          </radialGradient>
        </defs>

        <circle cx={CENTER} cy={CENTER} r={RADIUS} fill="url(#globe-sphere)" />
        <path d={graticule} className="fill-none stroke-white/8" strokeWidth="0.6" />
        <path d={basePath} className="fill-white/8" />

        {visible.map((item) => {
          const isActive = active === item.name;
          return (
            <path
              key={item.name}
              d={item.d}
              onPointerEnter={() => setActive(item.name)}
              className={cn(
                "cursor-pointer transition-[fill,stroke] duration-200",
                isActive
                  ? "fill-accent/80 stroke-accent-soft"
                  : active
                    ? "fill-accent/18 stroke-accent/40"
                    : "fill-accent/35 stroke-accent/75",
              )}
              strokeWidth="1"
            />
          );
        })}

        {placed.map(({ item, px, py, w, flip }) => {
          const isActive = active === item.name;
          return (
            <g
              key={`pin-${item.name}`}
              className="pointer-events-none transition-opacity duration-300"
              opacity={item.edge}
            >
              <line
                x1={item.x}
                y1={item.y}
                x2={flip ? px + w : px}
                y2={py + 11}
                className={cn("stroke-accent", isActive ? "opacity-90" : "opacity-45")}
                strokeWidth="1"
              />
              <circle
                cx={item.x}
                cy={item.y}
                r={isActive ? 5 : 3.5}
                className={cn(isActive ? "fill-white" : "fill-accent")}
              />
              <rect
                x={px}
                y={py}
                width={w}
                height={22}
                rx="0"
                className={cn(
                  "stroke-accent/60",
                  isActive ? "fill-accent" : "fill-[#0B0E13]/90",
                )}
                strokeWidth="1"
              />
              <text
                x={px + w / 2}
                y={py + 15}
                textAnchor="middle"
                className={cn(
                  "font-sans text-[14px] font-semibold",
                  isActive ? "fill-white" : "fill-text",
                )}
              >
                {item.name}
              </text>
            </g>
          );
        })}

        <circle
          cx={CENTER}
          cy={CENTER}
          r={RADIUS}
          className="pointer-events-none fill-none stroke-white/16"
          strokeWidth="1"
        />
      </svg>
    </div>
  );
}
