# Vikings League

Landing page de divulgação da **Vikings League**, seletiva competitiva de
Pro Clubs / EA Sports FC da Vikings Team E-sports. A inscrição envia os dados
ao Supabase e libera o grupo da organização somente depois do registro.

## Stack

- Next.js 16 (App Router) + TypeScript
- Supabase Database e Storage
- Tailwind CSS v4, com tokens em `@theme` dentro de [globals.css](src/app/globals.css)
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

Variáveis server-side obrigatórias:

```text
SUPABASE_URL
SUPABASE_SECRET_KEY
SUPABASE_REGISTRATION_PHOTOS_BUCKET
WHATSAPP_GROUP_URL
NEXT_PUBLIC_TURNSTILE_SITE_KEY
TURNSTILE_SECRET_KEY
```

Somente `NEXT_PUBLIC_TURNSTILE_SITE_KEY` pode ser exposta ao navegador.

## Estrutura

```
src/
  app/page.tsx              rota única, monta as seções na ordem
  app/api/registrations/    valida, envia a foto e persiste a inscrição
  app/entregauniforme/      cadastro de endereço para entrega do uniforme
  app/api/uniform-deliveries/ valida e persiste os dados de entrega
  app/globals.css           design tokens, texturas e keyframes
  content/content.ts        todo o conteúdo textual e datas (fonte única)
  components/sections/      uma seção = um componente
  components/ui/            button, icon, image-slot, reveal-section
  hooks/use-reveal.ts       reveal on scroll (IntersectionObserver)
  lib/links.ts              destinos compartilhados dos CTAs
  lib/supabase-admin.ts     cliente Supabase exclusivo do servidor
```

## Conteúdo

Todo texto, data e link vive em [content.ts](src/content/content.ts) — nada é
hardcoded no JSX. Campos com string vazia são pendências reais de conteúdo; a
seção correspondente degrada sem eles, sem placeholder inventado.

### Pendências para produção

| Campo | Onde | Efeito hoje |
|---|---|---|
| `about.photos[].src` | A liga (3 fotos) | Slots texturizados |
| `awards.items[].prize` | Premiação | Card sem a linha do prêmio |
| `org.roster` / `competitions` | Quem nós somos | Não renderizam |

Tratamento obrigatório das fotos oficiais (já aplicado pelo `ImageSlot` quando
há `src`): `grayscale(0.7) contrast(1.2) saturate(0.6)` + overlay `#2E7BFF` em
`soft-light` 15%.

## Referência de design

`design_handoff_vikings_league/` guarda o protótipo de origem. Está no
`.gitignore` — é material de referência, não faz parte do build.
