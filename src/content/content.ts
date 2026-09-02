/**
 * Fonte única de conteúdo da landing page.
 * Copy verbatim do handoff de design. Campos com string vazia são pendências
 * reais de conteúdo — a seção correspondente degrada sem eles. Não preencher
 * com valor inventado.
 */

export type IconName =
  | "eye"
  | "swords"
  | "bar-chart-3"
  | "network"
  | "shirt"
  | "megaphone"
  | "radio"
  | "users"
  | "line-chart"
  | "trophy"
  | "target"
  | "shield"
  | "hand"
  | "goal"
  | "send"
  | "repeat"
  | "shield-check"
  | "star"
  | "graduation-cap"
  | "play"
  | "globe"
  | "trophy-outline"
  | "shopping-bag";

export type Pillar = {
  icon: IconName;
  title: string;
  description: string;
};

export type Benefit = {
  icon: IconName;
  title: string;
  description: string;
};

export type Phase = {
  index: string;
  date: string;
  title: string;
  description: string;
  highlight: boolean;
};

export type CalendarDay = {
  weekday: string;
  day: string;
  month: string;
  title: string;
  highlight: boolean;
};

export type Metric = {
  icon: IconName;
  title: string;
  description: string;
};

export type Award = {
  icon: IconName;
  title: string;
  /** Pendente: o que cada premiação individual entrega. Vazio = não renderiza. */
  prize: string;
};

/**
 * Item da galeria horizontal. A união discriminada permite adicionar vídeo
 * sem tocar no layout — o componente decide o que renderizar pelo `type`.
 * A ordem do array é a ordem de exibição.
 */
export type GalleryItem =
  | {
      type: "image";
      id: string;
      src: string;
      alt: string;
      label?: string;
      /** object-position, quando o enquadramento padrão corta algo importante. */
      focus?: string;
    }
  | {
      type: "video";
      id: string;
      src: string;
      /** Frame exibido antes do play. Sem ele o card abre preto. */
      poster: string;
      alt: string;
      label?: string;
      focus?: string;
    };

export type PhotoSlot = {
  id: string;
  alt: string;
  /** Pendente: imagens oficiais da Vikings. Vazio = slot texturizado. */
  src: string;
  /** Legenda sobre a foto. Vazia = imagem sem rótulo. */
  caption?: string;
};

export const config = {
  registrationUrl: "#inscricao",
  instagramUrl: "https://www.instagram.com/vikingsteamesports/",
  showPrice: true,
} as const;

export const site = {
  name: "Vikings League",
  org: "Vikings Team E-sports",
  season: "TEMPORADA 2026",
  vacancies: "120 VAGAS",
  price: "R$ 89,90",
  duration: "1 MÊS",
  logo: {
    src: "/images/escudo-vikings.webp",
    alt: "Vikings League",
  },
} as const;

export const nav = {
  ticks: [
    { label: "01", href: "#s1" },
    { label: "02", href: "#sd" },
    { label: "03", href: "#s2" },
    { label: "04", href: "#s3" },
    { label: "05", href: "#s4" },
    { label: "06", href: "#s5" },
    { label: "07", href: "#s6" },
    { label: "08", href: "#s7" },
    { label: "09", href: "#sp" },
    { label: "10", href: "#sn" },
  ],
} as const;

export const header = {
  cta: "GARANTIR VAGA",
  links: [
    { label: "A liga", href: "#s2" },
    { label: "Como funciona", href: "#s4" },
    { label: "Calendário", href: "#s5" },
    { label: "Premiação", href: "#s7" },
  ],
} as const;

export const hero = {
  eyebrow: "SELETIVA PRO CLUBS · EA SPORTS FC",
  titleLead: "O seu passaporte para o cenário",
  titleAccent: "competitivo",
  paragraph:
    "Chegou a hora de sair do amadorismo e mostrar o seu verdadeiro valor no campo virtual. Uma peneira competitiva criada para identificar, avaliar e projetar talentos para o cenário competitivo.",
  stats: {
    vacancies: { value: "120", label: "VAGAS" },
    price: { value: "R$ 89,90", label: "INSCRIÇÃO" },
    duration: { value: "1 MÊS", label: "DE COMPETIÇÃO" },
  },
  primaryCta: "GARANTIR MINHA VAGA",
  secondaryCta: "PREENCHER INSCRIÇÃO",
} as const;

export const org = {
  eyebrow: "A ORGANIZAÇÃO",
  titleLead: "Quem nós",
  titleAccent: "somos",
  name: "Vikings Team E-sports",
  category: "Organização de esports · Pro Clubs / EA Sports FC",
  /** Encurtado: numa landing de conversão os números provam mais que o texto. */
  paragraph:
    "Organização de esports de Pro Clubs / EA Sports FC, com elenco próprio e comunidade ativa. A Vikings League é a nossa seletiva para mapear e projetar talentos.",
  followers: { count: 18.8, value: "+18,8 mil", label: "SEGUIDORES NO INSTAGRAM" },
  cta: "GARANTIR MINHA VAGA",
  photo: {
    id: "elenco",
    alt: "Elenco da Vikings Team E-sports com a bandeira da organização na Libertadores do Chile",
    src: "/images/elenco-libertadores.webp",
  } satisfies PhotoSlot,
  achievement: {
    value: "6º",
    label: "LUGAR NA LIBERTADORES DO CHILE",
    detail: "Entre 16 equipes — top 6 da América do Sul.",
  },
  founded: {
    year: "2024",
    by: "VKG_iranzera",
    heading: "Fundador",
    role: "CEO / Fundador",
    paragraph:
      "Fundador e CEO da Vikings Team E-sports desde 2024, VKG_iranzera está à frente da organização responsável pela Vikings League.",
    photo: "/images/ceo-iranzera.webp",
    photoAlt: "VKG_iranzera, fundador e CEO da Vikings Team E-sports",
    instagram: "https://www.instagram.com/vkg_iranzera",
  },
  /** Pendente: quem narra as finais. */
  roster: "",
} as const;

export type Stat = {
  icon: IconName;
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  label: string;
  detail?: string;
};

export const numbers = {
  eyebrow: "A VIKINGS EM NÚMEROS",
  titleLead: "Dois anos construindo",
  titleAccent: "cenário",
  items: [
    {
      icon: "graduation-cap",
      value: 1000,
      prefix: "+",
      label: "ATLETAS FORMADOS",
      detail: "Em dois anos de operação.",
    },
    {
      icon: "play",
      value: 10,
      suffix: " MI",
      label: "VISUALIZAÇÕES/MÊS",
      detail: "Média nas redes sociais da organização.",
    },
    { icon: "globe", value: 9, label: "PAÍSES", detail: "Presença em três continentes." },
    {
      icon: "trophy-outline",
      value: 4,
      label: "PRESENCIAIS DISPUTADOS",
      detail: "Campeonatos fora do ambiente online.",
    },
    {
      icon: "shopping-bag",
      value: 470,
      prefix: "+",
      label: "UNIFORMES VENDIDOS",
      detail: "Desde a fundação, em 2024.",
    },
  ] satisfies Stat[],
  countries: {
    eyebrow: "PRESENÇA INTERNACIONAL",
    title: "De onde a Vikings joga",
    lead: "Uma comunidade conectando jogadores em 9 países.",
    /** Microcopy que dá sentido ao destaque no mapa. */
    legend: "Países com jogadores, membros ou operações Vikings.",
    /** Coordenadas do centroide de cada país, para o mapa de presença. */
    list: [
      { name: "México", lat: 23.6, lon: -102.5 },
      { name: "Colômbia", lat: 4.6, lon: -74.3 },
      { name: "Brasil", lat: -14.2, lon: -51.9 },
      { name: "Uruguai", lat: -32.5, lon: -55.8 },
      { name: "Argentina", lat: -38.4, lon: -63.6 },
      { name: "Chile", lat: -35.7, lon: -71.5 },
      { name: "Portugal", lat: 39.4, lon: -8.2 },
      { name: "Itália", lat: 41.9, lon: 12.6 },
      { name: "Bósnia", lat: 43.9, lon: 17.7 },
    ],
  },
} as const;

export type Partner = {
  name: string;
  /** Pendente: logo oficial. Vazio = renderiza só o nome. */
  logo: string;
  /** Perfil do parceiro. Vazio = o card não vira link. */
  url?: string;
  /** Logo em faixa larga (ratio > 2): recebe menos altura para igualar o peso. */
  wide?: boolean;
};

export const partners = {
  eyebrow: "PARCEIROS E PATROCINADORES",
  titleLead: "Quem caminha",
  titleAccent: "com a gente",
  items: [
    {
      name: "EK Uniformes",
      logo: "/images/partners/ek-uniformes-v2.webp",
      url: "https://www.instagram.com/ek.uniformes",
    },
    {
      name: "Bradley Runners",
      logo: "/images/partners/bradley-runners.webp",
      url: "https://www.instagram.com/bradleyrunners",
    },
    {
      name: "Cartzen",
      logo: "/images/partners/cartzen.webp",
      wide: true,
      url: "https://www.instagram.com/cartzenloja",
    },
    {
      name: "Scout Clubs",
      logo: "/images/partners/scout-clubs.webp",
      url: "https://www.instagram.com/scout_clubs",
    },
    { name: "Andromeda Clubs TV", logo: "/images/partners/andromeda-clubs-tv.webp" },
    {
      name: "Vikings das Coins",
      logo: "/images/partners/vikings-das-coins.webp",
      wide: true,
      url: "https://www.instagram.com/vikingsdascoins",
    },
    { name: "Forges Design", logo: "/images/partners/forges-design.webp", wide: true },
    { name: "Viaje com a Gente Sempre", logo: "" },
    {
      name: "Pedro Américo",
      logo: "/images/pedro-americo-logo.svg",
      wide: true,
      url: "https://www.pedroamerico.com",
    },
    { name: "Vikings League", logo: "/images/escudo-vikings.webp" },
  ] satisfies Partner[],
} as const;

export const about = {
  eyebrow: "A LIGA",
  titleLead: "Mais do que uma peneira. Uma porta para o",
  titleAccent: "competitivo",
  titleTail: ".",
  paragraph:
    "A Vikings League foi criada para mapear, avaliar e desenvolver jogadores que buscam competir em um ambiente mais estruturado.",
  pillars: [
    { icon: "eye", title: "Visibilidade", description: "Você aparece para quem escala time." },
    {
      icon: "swords",
      title: "Competição",
      description: "Partidas valendo avaliação, do início ao fim.",
    },
    {
      icon: "bar-chart-3",
      title: "Estatísticas",
      description: "Seu desempenho registrado partida a partida.",
    },
    {
      icon: "network",
      title: "Networking",
      description: "Convivência com jogadores competitivos.",
    },
  ] satisfies Pillar[],
  gallery: [
    {
      type: "image",
      id: "atleta",
      src: "/images/atleta-uniforme.webp",
      alt: "Atleta anunciado pela Vikings Team E-sports com o uniforme oficial",
      label: "Anúncio de atleta",
    },
    {
      type: "image",
      id: "bastidores",
      src: "/images/atleta-transmissao.webp",
      alt: "Atletas da Vikings em partida, de headset e controle em mãos",
      label: "Bastidores de partida",
    },
    {
      type: "image",
      id: "prelecao",
      src: "/images/equipe-huddle.webp",
      alt: "Comissão da Vikings reunida em preleção antes da partida",
      label: "Preleção da equipe",
    },
    {
      type: "image",
      id: "libertadores",
      src: "/images/elenco-libertadores.webp",
      alt: "Elenco da Vikings com a bandeira da organização na Libertadores do Chile",
      label: "Libertadores do Chile",
    },
    {
      type: "image",
      id: "trofeu-proleague",
      src: "/images/trofeu-proleague.webp",
      alt: "Troféu do ProLeague Americas Santiago 2026 com o escudo da Vikings",
      label: "ProLeague Americas",
    },
    {
      type: "image",
      id: "patrocinadores",
      src: "/images/elenco-patrocinadores.webp",
      alt: "Elenco da Vikings reunido com a bandeira dos patrocinadores",
      label: "Parceiros",
    },
    {
      type: "image",
      id: "elenco",
      src: "/images/elenco-uniforme.webp",
      alt: "Elenco da Vikings Team E-sports reunido com o uniforme oficial",
      label: "Elenco",
    },
  ] satisfies GalleryItem[],
  instagram: {
    label: "INSTAGRAM",
    count: 18.8,
    value: "+18,8 MIL",
    caption: "seguidores acompanhando a Vikings Team E-sports",
    cta: "VER PERFIL",
  },
} as const;

export const benefits = {
  eyebrow: "O QUE VOCÊ RECEBE",
  titleLead: "Sua inscrição vai",
  titleAccent: "além do campo",
  counter: "6 ITENS INCLUSOS",
  items: [
    {
      icon: "shirt",
      title: "Uniforme oficial",
      description: "Uniforme oficial da Vikings Team E-sports.",
    },
    {
      icon: "swords",
      title: "Competição",
      description: "Acesso aos campeonatos da fase de avaliação.",
    },
    {
      icon: "megaphone",
      title: "Marketing",
      description: "Divulgação individual e coletiva dos atletas.",
    },
    {
      icon: "radio",
      title: "Visibilidade",
      description: "Conteúdo, destaques e transmissões no Instagram oficial.",
    },
    { icon: "users", title: "Comunidade", description: "Networking com jogadores competitivos." },
    {
      icon: "line-chart",
      title: "Scouting",
      description: "Avaliação através de estatísticas de desempenho.",
    },
  ] satisfies Benefit[],
} as const;

export const phases = {
  eyebrow: "COMO FUNCIONA",
  titleLead: "Do draft à",
  titleAccent: "oportunidade",
  items: [
    {
      index: "01",
      date: "04 SET",
      title: "Draft",
      description:
        "Os capitães são definidos e os 48 atletas distribuídos nas 3 lines de 16 jogadores.",
      highlight: false,
    },
    {
      index: "02",
      date: "05—06 SET",
      title: "Fase de grupos",
      description: "Os jogadores entram em campo e começam a ser avaliados.",
      highlight: false,
    },
    {
      index: "03",
      date: "SCOUT CLUBS",
      title: "Scouting",
      description: "As partidas são contabilizadas através da plataforma Scout Clubs.",
      highlight: false,
    },
    {
      index: "04",
      date: "12 SET",
      title: "Fases finais",
      description: "As partidas decisivas contam com transmissão e narração profissional.",
      highlight: true,
    },
  ] satisfies Phase[],
} as const;

export const calendar = {
  eyebrow: "CALENDÁRIO",
  season: "TEMPORADA 2026",
  titleLead: "Setembro",
  titleAccent: "decide",
  paragraph:
    "Quatro datas: o draft abre a liga, a fase de grupos define os classificados e as finais têm transmissão e narração.",
  days: [
    { weekday: "QUINTA", day: "04", month: "SET", title: "Draft", highlight: false },
    { weekday: "SEXTA", day: "05", month: "SET", title: "Fase de grupos", highlight: false },
    { weekday: "SÁBADO", day: "06", month: "SET", title: "Fase de grupos", highlight: false },
    { weekday: "SEXTA", day: "12", month: "SET", title: "Finais", highlight: true },
  ] satisfies CalendarDay[],
} as const;

export const scouting = {
  eyebrow: "ESTATÍSTICAS E SCOUTING",
  titleLead: "Aqui,",
  titleAccent: "desempenho",
  titleTail: "fala mais alto",
  paragraph:
    "Todos os jogos serão contabilizados através da plataforma Scout Clubs, permitindo uma avaliação baseada no desempenho dos atletas.",
  chip: "MÉTRICAS ACOMPANHADAS NA AVALIAÇÃO",
  formation: {
    label: "FORMAÇÃO DA LIGA",
    lines: [
      { label: "LINE 01", active: true },
      { label: "LINE 02", active: false },
      { label: "LINE 03", active: false },
    ],
    playersPerLine: 16,
    summary: ["48 ATLETAS", "3 LINES COMPETITIVAS", "16 JOGADORES POR LINE"],
    funnel: "Das 120 vagas de inscrição, 48 atletas são distribuídos em 3 lines de 16 jogadores.",
  },
  metrics: [
    { icon: "goal", title: "Gols", description: "Finalizações convertidas em cada partida." },
    { icon: "send", title: "Assistências", description: "Passes que resultam em gol." },
    { icon: "repeat", title: "Passes", description: "Volume e acerto na distribuição." },
    { icon: "shield-check", title: "Desarmes", description: "Bolas recuperadas na defesa." },
    { icon: "star", title: "Nota média", description: "Média geral do desempenho na liga." },
  ] satisfies Metric[],
} as const;

export const awards = {
  eyebrow: "PREMIAÇÃO",
  titleLead: "Seu desempenho será",
  titleAccent: "reconhecido",
  photo: {
    id: "trofeu",
    alt: "Troféu de artilheiro do campeonato da Vikings League",
    src: "/images/trofeu-artilheiro.webp",
  } satisfies PhotoSlot,
  items: [
    { icon: "trophy", title: "Artilheiro", prize: "" },
    { icon: "target", title: "Líder de assistências", prize: "" },
    { icon: "shield", title: "Melhor zagueiro", prize: "" },
    { icon: "hand", title: "Melhor goleiro", prize: "" },
  ] satisfies Award[],
} as const;

export const finalCta = {
  titleLead: "Pronto para mostrar do que você é",
  titleAccent: "capaz",
  titleTail: "?",
  /** Absorvido da antiga seção "Oportunidade", que duplicava este CTA. */
  paragraph:
    "Você não está entrando apenas para disputar partidas. Está entrando para mostrar que merece estar entre os melhores.",
  offer: {
    price: "R$ 89,90",
    label: "Inscrição para a Vikings League",
    vacancies: "120 vagas disponíveis",
    duration: "1 mês de competição",
  },
  cta: "GARANTIR MINHA VAGA",
  note: "O link do grupo é liberado depois que a inscrição for registrada.",
} as const;

export const footer = {
  org: "Vikings Team E-sports",
  league: "Vikings League",
  description:
    "Organização de esports responsável pela Vikings League, seletiva competitiva de Pro Clubs / EA Sports FC.",
  columns: {
    competition: {
      label: "COMPETIÇÃO",
      links: [
        { label: "A liga", href: "#s2" },
        { label: "Como funciona", href: "#s4" },
        { label: "Calendário", href: "#s5" },
        { label: "Premiação", href: "#s7" },
        { label: "Parceiros", href: "#sp" },
      ],
    },
    contact: {
      label: "CONTATO",
      instagram: "@vikingsteamesports",
      whatsapp: "Inscrição",
    },
  },
  copyright: "© VIKINGS TEAM E-SPORTS",
  season: "VIKINGS LEAGUE · TEMPORADA 2026",
  credit: {
    text: "Desenvolvido por Pedro Américo",
    links: [
      { label: "GitHub", href: "https://github.com/pedruamerico/" },
      { label: "LinkedIn", href: "https://linkedin.com/in/pedruamerico" },
    ],
  },
} as const;
