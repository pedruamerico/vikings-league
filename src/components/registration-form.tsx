"use client";

import { useState, type FormEvent } from "react";
import { ArrowRight, Check, ImagePlus, LoaderCircle } from "lucide-react";
import { TurnstileWidget } from "@/components/turnstile";
import { buttonVariants } from "@/components/ui/button";
import { Field, inputClass } from "@/components/ui/form-field";
import { positions, shirtSizes, type Position } from "@/lib/registration";
import { cn } from "@/lib/utils";

type FormStatus =
  | { state: "idle" }
  | { state: "submitting" }
  | { state: "error"; message: string }
  | { state: "success"; groupUrl: string };

export function RegistrationForm() {
  const [status, setStatus] = useState<FormStatus>({ state: "idle" });
  const [selectedPositions, setSelectedPositions] = useState<Position[]>([]);
  const [turnstileToken, setTurnstileToken] = useState("");
  const [turnstileResetCount, setTurnstileResetCount] = useState(0);

  function resetTurnstile() {
    setTurnstileToken("");
    setTurnstileResetCount((count) => count + 1);
  }

  function togglePosition(position: Position) {
    setSelectedPositions((current) => {
      if (current.includes(position)) {
        return current.filter((selected) => selected !== position);
      }

      return current.length < 3 ? [...current, position] : current;
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;

    if (selectedPositions.length !== 3) {
      setStatus({ state: "error", message: "Escolha três posições em ordem de prioridade." });
      return;
    }

    setStatus({ state: "submitting" });

    try {
      const formData = new FormData(form);
      formData.set("cf-turnstile-response", turnstileToken);
      selectedPositions.forEach((position, index) => {
        formData.set(`position${index + 1}`, position);
      });
      const response = await fetch("/api/registrations", {
        method: "POST",
        body: formData,
      });
      const result = (await response.json()) as {
        groupUrl?: string;
        message?: string;
        requestId?: string;
      };

      if (!response.ok || !result.groupUrl) {
        resetTurnstile();
        const suffix = result.requestId ? ` Código: ${result.requestId}` : "";
        setStatus({
          state: "error",
          message: `${result.message ?? "Não foi possível concluir a inscrição."}${suffix}`,
        });
        return;
      }

      form.reset();
      setStatus({ state: "success", groupUrl: result.groupUrl });
    } catch {
      resetTurnstile();
      setStatus({
        state: "error",
        message: "A conexão falhou. Verifique sua internet e tente novamente.",
      });
    }
  }

  if (status.state === "success") {
    return (
      <div className="border border-accent/55 bg-accent/8 p-[clamp(22px,4vw,38px)]" role="status">
        <div className="flex h-12 w-12 items-center justify-center border border-accent bg-accent text-white">
          <Check width={24} height={24} strokeWidth={2} aria-hidden />
        </div>
        <h3 className="mt-6 font-display text-[clamp(30px,5vw,50px)] leading-[0.95] font-extrabold uppercase">
          Inscrição <span className="text-accent-soft">confirmada</span>
        </h3>
        <p className="mt-4 max-w-[48ch] text-[15px] leading-[1.65] text-text-muted">
          Seus dados foram registrados. Entre agora no grupo oficial para receber as próximas instruções.
        </p>
        <a
          href={status.groupUrl}
          target="_blank"
          rel="noopener"
          className={cn(buttonVariants({ size: "block" }), "mt-7")}
        >
          ENTRAR NO GRUPO
          <ArrowRight width={18} height={18} strokeWidth={1.7} aria-hidden />
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="border border-line-strong bg-black/20" noValidate={false}>
      <div className="grid border-b border-line-strong sm:grid-cols-[120px_1fr]">
        <div className="flex items-center justify-center border-b border-line-strong bg-accent/8 p-4 sm:border-r sm:border-b-0">
          <ImagePlus width={34} height={34} strokeWidth={1.2} className="text-accent-soft" aria-hidden />
        </div>
        <div className="p-[clamp(12px,1.5vw,16px)]">
          <Field label="Foto do atleta" hint="JPEG, PNG ou WebP, até 5 MB">
            <input
              className={cn(
                inputClass,
                "cursor-pointer file:mr-4 file:border-0 file:bg-accent file:px-3 file:py-2 file:font-sans file:text-xs file:font-bold file:text-white file:uppercase",
              )}
              type="file"
              name="photo"
              accept="image/jpeg,image/png,image/webp"
              required
            />
          </Field>
        </div>
      </div>

      <div className="grid gap-x-4 gap-y-3 p-[clamp(12px,1.5vw,16px)] sm:grid-cols-2 lg:grid-cols-4">
        <Field label="Nome completo" className="lg:col-span-2">
          <input className={inputClass} name="name" autoComplete="name" minLength={2} maxLength={120} required />
        </Field>
        <Field label="ID no jogo">
          <input className={inputClass} name="gameId" minLength={2} maxLength={64} required />
        </Field>
        <Field label="Instagram" hint="sem @">
          <input className={inputClass} name="instagram" autoCapitalize="none" maxLength={31} required />
        </Field>
        <Field label="WhatsApp" hint="país + DDD + número" className="lg:col-span-2">
          <input
            className={inputClass}
            name="whatsapp"
            type="text"
            inputMode="numeric"
            autoComplete="tel"
            maxLength={15}
            pattern="[0-9]{10,15}"
            placeholder="5512999999999"
            required
          />
        </Field>
        <Field label="Tamanho da camisa">
          <select className={inputClass} name="shirtSize" defaultValue="" required>
            <option value="" disabled>Selecione</option>
            {shirtSizes.map((size) => <option key={size} value={size}>{size}</option>)}
          </select>
        </Field>
        <Field label="Número da camisa">
          <input
            className={inputClass}
            name="shirtNumber"
            type="text"
            inputMode="numeric"
            maxLength={2}
            pattern="[1-9][0-9]?"
            required
          />
        </Field>
      </div>

      <fieldset className="border-t border-line-strong p-[clamp(12px,1.5vw,16px)]">
        <legend className="px-2 font-sans text-[11px] font-semibold tracking-[0.12em] text-accent-soft uppercase">
          Posições em ordem de prioridade
        </legend>
        <div className="mt-1.5 flex items-center justify-between gap-4">
          <p className="text-[11px] text-text-faint">Clique para definir 1ª, 2ª e 3ª opção.</p>
          <span className="font-display text-lg font-bold text-accent-soft" aria-live="polite">
            {selectedPositions.length}/3
          </span>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-5">
          {positions.map((position) => {
            const priority = selectedPositions.indexOf(position.value);
            const isSelected = priority !== -1;
            const isUnavailable = !isSelected && selectedPositions.length === 3;

            return (
              <button
                key={position.value}
                type="button"
                aria-pressed={isSelected}
                disabled={isUnavailable}
                onClick={() => togglePosition(position.value)}
                className={cn(
                  "relative min-h-12 border px-3 py-2 text-left font-sans text-[11px] font-bold tracking-[0.04em] uppercase transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
                  isSelected
                    ? "border-accent bg-accent/16 pr-10 text-white"
                    : "border-white/12 bg-black/25 text-text-muted hover:border-accent/60 hover:text-white",
                  isUnavailable && "cursor-not-allowed opacity-40",
                )}
              >
                {position.label}
                {isSelected ? (
                  <span className="absolute top-1/2 right-2 flex h-6 w-6 -translate-y-1/2 items-center justify-center bg-accent font-display text-base text-white">
                    {priority + 1}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
      </fieldset>

      <div className="absolute -left-[10000px]" aria-hidden="true">
        <label>
          Website
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="border-t border-line-strong p-[clamp(12px,1.5vw,16px)]">
        <TurnstileWidget
          action="registration"
          resetCount={turnstileResetCount}
          onTokenChange={setTurnstileToken}
        />
        {status.state === "error" ? (
          <p className="mb-4 border-l-2 border-red-400 bg-red-400/8 px-4 py-3 text-sm text-red-200" role="alert">
            {status.message}
          </p>
        ) : null}
        <button
          type="submit"
          disabled={status.state === "submitting" || !turnstileToken}
          className={cn(
            buttonVariants({ size: "block" }),
            "py-4 disabled:cursor-wait disabled:opacity-60",
          )}
        >
          {status.state === "submitting" ? (
            <>
              <LoaderCircle width={19} height={19} className="animate-spin" aria-hidden />
              ENVIANDO INSCRIÇÃO
            </>
          ) : (
            <>
              CONFIRMAR INSCRIÇÃO
              <ArrowRight width={18} height={18} strokeWidth={1.7} aria-hidden />
            </>
          )}
        </button>
        <p className="mt-3 text-center text-[12px] leading-[1.5] text-text-faint">
          O link do grupo é liberado somente após o registro da inscrição.
        </p>
      </div>
    </form>
  );
}
