import { config } from "@/content/content";

/**
 * Enquanto a URL do WhatsApp não for fornecida, os CTAs continuam visíveis
 * (são o eixo da página) mas ficam inertes — sem href e marcados como
 * desabilitados para leitores de tela.
 */
export function ctaProps(url: string) {
  if (!url) {
    return { role: "link" as const, "aria-disabled": true, tabIndex: -1 };
  }
  return { href: url, target: "_blank" as const, rel: "noopener" };
}

export const whatsapp = () => ctaProps(config.whatsappUrl);
export const instagram = () => ctaProps(config.instagramUrl);
