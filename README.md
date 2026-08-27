# Vikings League

Landing page de divulgação da **Vikings League**, seletiva competitiva de
Pro Clubs / EA Sports FC da Vikings Team E-sports. Página estática, rota única,
com conversão para o WhatsApp da organização.

## Stack

- Next.js 16 (App Router) + TypeScript
- Tailwind CSS v4 — tokens em `@theme` dentro de [globals.css](src/app/globals.css)
- `lucide-react` para ícones
- Fontes via `next/font` (Big Shoulders + Space Grotesk), self-hosted

## Rodar

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # build de produção (estático)
npm run start
npm run lint
```

## Estrutura

```
src/
  app/page.tsx              rota única, monta as seções na ordem
  app/globals.css           design tokens, texturas e keyframes
  content/content.ts        todo o conteúdo textual e datas (fonte única)
  components/sections/      uma seção = um componente
  components/ui/            button, icon, image-slot, reveal-section
  hooks/use-reveal.ts       reveal on scroll (IntersectionObserver)
  lib/links.ts              CTAs; ficam inertes enquanto a URL não existir
```

## Conteúdo

Todo texto, data e link vive em [content.ts](src/content/content.ts) — nada é
hardcoded no JSX. Campos com string vazia são pendências reais de conteúdo; a
seção correspondente degrada sem eles, sem placeholder inventado.

### Pendências para produção

| Campo | Onde | Efeito hoje |
|---|---|---|
| `config.whatsappUrl` | `content.ts` | **Bloqueante** — os 7 CTAs renderizam inertes |
| `org.photo.src` | Quem nós somos | Slot texturizado no lugar da foto |
| `about.photos[].src` | A liga (3 fotos) | Slots texturizados |
| `awards.items[].prize` | Premiação | Card sem a linha do prêmio |
| `org.founded` / `roster` / `competitions` | Quem nós somos | Não renderizam |

Tratamento obrigatório das fotos oficiais (já aplicado pelo `ImageSlot` quando
há `src`): `grayscale(0.7) contrast(1.2) saturate(0.6)` + overlay `#2E7BFF` em
`soft-light` 15%.

## Referência de design

`design_handoff_vikings_league/` guarda o protótipo de origem. Está no
`.gitignore` — é material de referência, não faz parte do build.
