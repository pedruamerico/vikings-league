import type { Metadata } from "next";
import { UniformDeliveryForm } from "@/components/uniform-delivery-form";
import { site } from "@/content/content";

export const metadata: Metadata = {
  title: "Entrega de uniforme — Vikings League",
  robots: { index: false, follow: false },
};

export default function UniformDeliveryPage() {
  return (
    <main className="mx-auto max-w-[880px] px-[clamp(12px,3vw,24px)] py-[clamp(24px,5vw,56px)]">
      <div className="font-sans text-[10px] font-semibold tracking-[0.18em] text-accent-soft uppercase">
        {site.season}
      </div>
      <h1 className="mt-2 font-display text-[clamp(36px,6vw,64px)] leading-[0.9] font-extrabold uppercase">
        Entrega de <span className="text-accent">uniforme</span>
      </h1>
      <p className="mt-4 mb-[clamp(20px,3vw,32px)] max-w-[56ch] text-[15px] leading-[1.65] text-text-muted">
        Preencha seus dados e o endereço onde quer receber o uniforme. Confira tudo antes de enviar: cada jogador
        cadastra uma única vez.
      </p>
      <UniformDeliveryForm />
    </main>
  );
}
