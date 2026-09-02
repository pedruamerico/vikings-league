import { config } from "@/content/content";

/** Mantém links opcionais acessíveis quando uma URL de conteúdo está pendente. */
export function ctaProps(url: string) {
  if (!url) {
    return { role: "link" as const, "aria-disabled": true, tabIndex: -1 };
  }
  return { href: url, target: "_blank" as const, rel: "noopener" };
}

export const registration = () => ({ href: config.registrationUrl });
export const instagram = () => ctaProps(config.instagramUrl);
