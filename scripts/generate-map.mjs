/**
 * Extrai do world-atlas a geometria usada pelo globo.
 *
 * Emite GeoJSON simplificado — não paths prontos — porque o globo gira no
 * cliente e reprojeta a cada quadro. world-atlas fica em devDependencies:
 * só o recorte necessário entra no bundle.
 *
 * Roda com `node scripts/generate-map.mjs`.
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { createRequire } from "node:module";
import { feature } from "topojson-client";

const require = createRequire(import.meta.url);
const world = JSON.parse(
  readFileSync(require.resolve("world-atlas/countries-110m.json"), "utf8"),
);
const countries = feature(world, world.objects.countries);

const MARKS = [
  { name: "México", id: "Mexico", lat: 23.6, lon: -102.5 },
  { name: "Colômbia", id: "Colombia", lat: 4.6, lon: -74.3 },
  { name: "Brasil", id: "Brazil", lat: -10.0, lon: -52.0 },
  { name: "Uruguai", id: "Uruguay", lat: -32.8, lon: -55.8 },
  { name: "Argentina", id: "Argentina", lat: -36.0, lon: -64.5 },
  { name: "Chile", id: "Chile", lat: -37.0, lon: -71.5 },
  { name: "Portugal", id: "Portugal", lat: 39.6, lon: -8.2 },
  { name: "Itália", id: "Italy", lat: 42.8, lon: 12.6 },
  { name: "Bósnia", id: "Bosnia and Herz.", lat: 44.0, lon: 17.9 },
];

const PRESENT = new Set(MARKS.map((m) => m.id));

/** Arredonda coordenadas e descarta vértices quase coincidentes. */
function simplify(geometry, dec, minStep) {
  const f = 10 ** dec;
  const ring = (pts) => {
    const out = [];
    for (const p of pts) {
      const q = [Math.round(p[0] * f) / f, Math.round(p[1] * f) / f];
      const last = out[out.length - 1];
      if (!last || Math.hypot(q[0] - last[0], q[1] - last[1]) >= minStep) out.push(q);
    }
    if (out.length < 4) return null;
    out[out.length - 1] = out[0];
    return out;
  };
  const poly = (rings) => rings.map(ring).filter(Boolean);
  if (geometry.type === "Polygon") {
    const r = poly(geometry.coordinates);
    return r.length ? { type: "Polygon", coordinates: r } : null;
  }
  const polys = geometry.coordinates.map(poly).filter((p) => p.length);
  return polys.length ? { type: "MultiPolygon", coordinates: polys } : null;
}

const present = [];
const base = [];

for (const f of countries.features) {
  const name = f.properties.name;
  const isPresent = PRESENT.has(name);
  // Destacados guardam mais detalhe; o contexto pode ser grosseiro.
  const geom = simplify(f.geometry, isPresent ? 2 : 1, isPresent ? 0.12 : 1.1);
  if (!geom) continue;
  if (isPresent) present.push({ name, geometry: geom });
  else base.push(geom);
}

const items = MARKS.map((m) => {
  const shape = present.find((p) => p.name === m.id);
  if (!shape) throw new Error(`sem geometria para ${m.id}`);
  return { name: m.name, geometry: shape.geometry, lon: m.lon, lat: m.lat };
});

mkdirSync("src/components/ui", { recursive: true });
writeFileSync(
  "src/components/ui/presence-map-data.ts",
  `// GERADO por scripts/generate-map.mjs — não editar à mão.
import type { Geometry } from "geojson";

export type GlobeItem = { name: string; geometry: Geometry; lon: number; lat: number };

export const GLOBE_BASE: Geometry[] = ${JSON.stringify(base)};

export const GLOBE_ITEMS: GlobeItem[] = ${JSON.stringify(items)};
`,
);

console.log("destacados:", items.length, "| contexto:", base.length);
