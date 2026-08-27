import { CountUp } from "@/components/ui/count-up";
import { Icon } from "@/components/ui/icon";
import { PresenceMap } from "@/components/ui/presence-map";
import { RevealSection } from "@/components/ui/reveal-section";
import { RevealWords } from "@/components/ui/reveal-words";
import { numbers } from "@/content/content";

export function NumbersSection() {
  if (numbers.items.length === 0) return null;

  return (
    <RevealSection
      id="sn"
      className="border-b border-line bg-bg-alt px-[clamp(18px,3vw,44px)] py-[clamp(52px,7vw,116px)] vl-texture"
    >
      <div className="mx-auto max-w-[1240px]">
        <div
          data-stagger
          className="mb-[18px] font-sans text-[10px] font-semibold tracking-[0.2em] text-text-dim"
        >
          {numbers.eyebrow}
        </div>
        <h2 className="font-display text-[clamp(28px,4.2vw,56px)] leading-[0.9] font-extrabold uppercase">
          <RevealWords
            segments={[{ text: numbers.titleLead }, { text: numbers.titleAccent, accent: true }]}
          />
        </h2>

        <div className="mt-[clamp(34px,5vw,64px)] grid grid-cols-1 gap-x-[clamp(20px,3vw,40px)] gap-y-[clamp(26px,4vw,44px)] sm:grid-cols-2 lg:grid-cols-5">
          {numbers.items.map(({ label, detail, icon, ...count }) => (
            <div
              key={label}
              data-stagger
              className="flex flex-col items-center border-t border-line-strong pt-5 text-center"
            >
              <Icon name={icon} size={28} strokeWidth={2} className="text-accent" />
              <div className="mt-3.5 font-display text-[clamp(34px,4.6vw,58px)] leading-[0.9] font-extrabold uppercase">
                <CountUp {...count} />
              </div>
              <div className="mt-2.5 font-sans text-[10px] font-semibold tracking-[0.16em] text-text-dim">
                {label}
              </div>
              {detail ? (
                <div className="mt-2 max-w-[24ch] font-sans text-[13px] leading-[1.5] text-text-faint">
                  {detail}
                </div>
              ) : null}
            </div>
          ))}
        </div>

        <div data-stagger className="mt-[clamp(40px,6vw,72px)] border-t border-line-strong pt-8">
          <div className="font-sans text-[10px] font-semibold tracking-[0.2em] text-text-dim">
            {numbers.countries.eyebrow}
          </div>
          <h3 className="mt-3 font-display text-[clamp(26px,3.6vw,44px)] leading-[0.95] font-extrabold uppercase">
            {numbers.countries.title}
          </h3>
          <p className="mt-3 max-w-[46ch] text-[clamp(14px,1.8vw,17px)] leading-[1.6] text-text-body">
            {numbers.countries.lead}
          </p>

          <PresenceMap className="mt-[clamp(24px,3.5vw,44px)]" />

          <p className="mt-5 flex items-center justify-center gap-2.5 font-sans text-[12px] leading-[1.5] text-text-dim">
            <span className="h-2.5 w-2.5 flex-none bg-accent/55 ring-1 ring-accent" aria-hidden />
            {numbers.countries.legend}
          </p>

          {/* No mobile o mapa vira só o visual: os nomes vivem nesta lista, que
              no desktop some porque o hover já os revela. */}
          <ul className="mt-6 grid grid-cols-2 gap-x-6 gap-y-2.5 sm:grid-cols-3 lg:hidden">
            {numbers.countries.list.map((country) => (
              <li
                key={country.name}
                className="flex items-center gap-2.5 font-sans text-[13px] text-text-body"
              >
                <span className="h-1.5 w-1.5 flex-none bg-accent" aria-hidden />
                {country.name}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </RevealSection>
  );
}
