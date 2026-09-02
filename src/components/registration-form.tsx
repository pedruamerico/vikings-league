"use client";

import { useCallback, useRef, useState, type FormEvent } from "react";
import Script from "next/script";
import { ArrowRight, Check, ImagePlus, LoaderCircle } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { positions, shirtSizes } from "@/lib/registration";
import { cn } from "@/lib/utils";

type FormStatus =
  | { state: "idle" }
  | { state: "submitting" }
  | { state: "error"; message: string }
  | { state: "success"; groupUrl: string };

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: HTMLElement,
        options: {
          sitekey: string;
          action: string;
          theme: "dark";
          language: string;
          "response-field": false;
          callback: (token: string) => void;
          "expired-callback": () => void;
          "error-callback": () => void;
        },
      ) => string;
      reset: (widgetId?: string) => void;
    };
  }
}

const inputClass =
  "min-h-11 w-full border border-white/14 bg-black/25 px-3.5 py-2.5 text-[15px] text-text outline-none transition-colors placeholder:text-text-faint focus:border-accent focus:bg-black/40";

function Field({
  label,
  hint,
  children,
  className,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={cn("block", className)}>
      <span className="mb-1.5 flex items-baseline justify-between gap-3 font-sans text-[11px] font-semibold tracking-[0.12em] text-text-muted uppercase">
        {label}
        {hint ? <span className="text-[10px] tracking-normal text-text-faint normal-case">{hint}</span> : null}
      </span>
      {children}
    </label>
  );
}

export function RegistrationForm() {
  const [status, setStatus] = useState<FormStatus>({ state: "idle" });
  const [turnstileToken, setTurnstileToken] = useState("");
  const [turnstileError, setTurnstileError] = useState(false);
  const turnstileContainerRef = useRef<HTMLDivElement>(null);
  const turnstileWidgetIdRef = useRef<string | null>(null);
  const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  const renderTurnstile = useCallback(() => {
    if (
      !turnstileSiteKey ||
      !turnstileContainerRef.current ||
      !window.turnstile ||
      turnstileWidgetIdRef.current
    ) {
      return;
    }

    turnstileWidgetIdRef.current = window.turnstile.render(turnstileContainerRef.current, {
      sitekey: turnstileSiteKey,
      action: "registration",
      theme: "dark",
      language: "pt-br",
      "response-field": false,
      callback: (token) => {
        setTurnstileToken(token);
        setTurnstileError(false);
      },
      "expired-callback": () => setTurnstileToken(""),
      "error-callback": () => {
        setTurnstileToken("");
        setTurnstileError(true);
      },
    });
  }, [turnstileSiteKey]);

  function resetTurnstile() {
    setTurnstileToken("");
    window.turnstile?.reset(turnstileWidgetIdRef.current ?? undefined);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setStatus({ state: "submitting" });

    try {
      const formData = new FormData(form);
      formData.set("cf-turnstile-response", turnstileToken);
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
            type="tel"
            inputMode="tel"
            autoComplete="tel"
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
          <input className={inputClass} name="shirtNumber" type="number" min={1} max={99} required />
        </Field>
      </div>

      <fieldset className="border-t border-line-strong p-[clamp(12px,1.5vw,16px)]">
        <legend className="px-2 font-sans text-[11px] font-semibold tracking-[0.12em] text-accent-soft uppercase">
          Posições em ordem de prioridade
        </legend>
        <div className="mt-1.5 grid gap-3 sm:grid-cols-3">
          {[1, 2, 3].map((priority) => (
            <Field key={priority} label={`${priority}ª opção`}>
              <select className={inputClass} name={`position${priority}`} defaultValue="" required>
                <option value="" disabled>Selecione</option>
                {positions.map((position) => (
                  <option key={position.value} value={position.value}>
                    {position.label}
                  </option>
                ))}
              </select>
            </Field>
          ))}
        </div>
      </fieldset>

      <div className="absolute -left-[10000px]" aria-hidden="true">
        <label>
          Website
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="border-t border-line-strong p-[clamp(12px,1.5vw,16px)]">
        {turnstileSiteKey ? (
          <>
            <Script
              src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
              strategy="afterInteractive"
              onReady={renderTurnstile}
              onError={() => setTurnstileError(true)}
            />
            <div className="mb-4 flex min-h-[65px] justify-center">
              <div ref={turnstileContainerRef} />
            </div>
            {turnstileError ? (
              <p className="mb-4 text-center text-sm text-red-200" role="alert">
                Não foi possível carregar a verificação. Atualize a página e tente novamente.
              </p>
            ) : null}
          </>
        ) : (
          <p className="mb-4 border-l-2 border-amber-400 bg-amber-400/8 px-4 py-3 text-sm text-amber-100" role="alert">
            A verificação de segurança está indisponível. Tente novamente mais tarde.
          </p>
        )}
        {status.state === "error" ? (
          <p className="mb-4 border-l-2 border-red-400 bg-red-400/8 px-4 py-3 text-sm text-red-200" role="alert">
            {status.message}
          </p>
        ) : null}
        <button
          type="submit"
          disabled={status.state === "submitting" || !turnstileSiteKey || !turnstileToken}
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
