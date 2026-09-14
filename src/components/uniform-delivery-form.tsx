"use client";

import { useState, type FormEvent } from "react";
import { ArrowRight, Check, LoaderCircle } from "lucide-react";
import { TurnstileWidget } from "@/components/turnstile";
import { buttonVariants } from "@/components/ui/button";
import { Field, inputClass } from "@/components/ui/form-field";
import { brazilianStates } from "@/lib/uniform-delivery";
import { cn } from "@/lib/utils";

type FormStatus =
  | { state: "idle" }
  | { state: "submitting" }
  | { state: "error"; message: string }
  | { state: "success" };

type ViaCepResponse = {
  erro?: boolean;
  logradouro?: string;
  bairro?: string;
  localidade?: string;
  uf?: string;
};

const emptyAddress = { street: "", neighborhood: "", city: "", state: "" };

export function UniformDeliveryForm() {
  const [status, setStatus] = useState<FormStatus>({ state: "idle" });
  const [address, setAddress] = useState(emptyAddress);
  const [postalCodeHint, setPostalCodeHint] = useState("preenche o endereço");
  const [turnstileToken, setTurnstileToken] = useState("");
  const [turnstileResetCount, setTurnstileResetCount] = useState(0);

  function resetTurnstile() {
    setTurnstileToken("");
    setTurnstileResetCount((count) => count + 1);
  }

  function updateAddress(field: keyof typeof emptyAddress, value: string) {
    setAddress((current) => ({ ...current, [field]: value }));
  }

  async function lookupPostalCode(value: string) {
    const postalCode = value.replace(/\D/g, "");
    if (postalCode.length !== 8) return;

    setPostalCodeHint("buscando...");
    try {
      const response = await fetch(`https://viacep.com.br/ws/${postalCode}/json/`, {
        signal: AbortSignal.timeout(5000),
      });
      const result = (await response.json()) as ViaCepResponse;
      if (!response.ok || result.erro) {
        setPostalCodeHint("não encontrado, preencha abaixo");
        return;
      }

      setAddress((current) => ({
        street: result.logradouro || current.street,
        neighborhood: result.bairro || current.neighborhood,
        city: result.localidade || current.city,
        state: result.uf || current.state,
      }));
      setPostalCodeHint("confira o endereço");
    } catch {
      setPostalCodeHint("preencha o endereço abaixo");
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus({ state: "submitting" });

    try {
      const formData = new FormData(event.currentTarget);
      formData.set("cf-turnstile-response", turnstileToken);
      const response = await fetch("/api/uniform-deliveries", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const result = (await response.json()) as { message?: string; requestId?: string };
        resetTurnstile();
        const suffix = result.requestId ? ` Código: ${result.requestId}` : "";
        setStatus({
          state: "error",
          message: `${result.message ?? "Não foi possível concluir o cadastro."}${suffix}`,
        });
        return;
      }

      setStatus({ state: "success" });
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
        <h2 className="mt-6 font-display text-[clamp(30px,5vw,50px)] leading-[0.95] font-extrabold uppercase">
          Endereço <span className="text-accent-soft">registrado</span>
        </h2>
        <p className="mt-4 max-w-[48ch] text-[15px] leading-[1.65] text-text-muted">
          Seus dados de entrega foram salvos. A organização usa esse endereço para enviar seu uniforme.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="border border-line-strong bg-black/20">
      <fieldset className="grid gap-x-4 gap-y-3 p-[clamp(12px,1.5vw,16px)] sm:grid-cols-2">
        <legend className="px-2 font-sans text-[11px] font-semibold tracking-[0.12em] text-accent-soft uppercase">
          Jogador
        </legend>
        <Field label="Nome completo" className="sm:col-span-2">
          <input className={inputClass} name="name" autoComplete="name" minLength={2} maxLength={120} required />
        </Field>
        <Field label="ID no jogo">
          <input className={inputClass} name="gameId" minLength={2} maxLength={64} required />
        </Field>
        <Field label="Discord" hint="nome de usuário">
          <input
            className={inputClass}
            name="discord"
            autoCapitalize="none"
            autoCorrect="off"
            minLength={2}
            maxLength={33}
            required
          />
        </Field>
        <Field label="WhatsApp" hint="país + DDD + número" className="sm:col-span-2">
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
      </fieldset>

      <fieldset className="grid gap-x-4 gap-y-3 border-t border-line-strong p-[clamp(12px,1.5vw,16px)] sm:grid-cols-4">
        <legend className="px-2 font-sans text-[11px] font-semibold tracking-[0.12em] text-accent-soft uppercase">
          Endereço de entrega
        </legend>
        <Field label="CEP" hint={postalCodeHint} className="sm:col-span-2">
          <input
            className={inputClass}
            name="postalCode"
            type="text"
            inputMode="numeric"
            autoComplete="postal-code"
            maxLength={9}
            pattern="[0-9]{5}-?[0-9]{3}"
            placeholder="00000-000"
            onBlur={(event) => lookupPostalCode(event.currentTarget.value)}
            required
          />
        </Field>
        <Field label="Estado" className="sm:col-span-2">
          <select
            className={inputClass}
            name="state"
            value={address.state}
            onChange={(event) => updateAddress("state", event.currentTarget.value)}
            required
          >
            <option value="" disabled>Selecione</option>
            {brazilianStates.map((state) => <option key={state} value={state}>{state}</option>)}
          </select>
        </Field>
        <Field label="Rua" className="sm:col-span-3">
          <input
            className={inputClass}
            name="street"
            autoComplete="address-line1"
            minLength={2}
            maxLength={160}
            value={address.street}
            onChange={(event) => updateAddress("street", event.currentTarget.value)}
            required
          />
        </Field>
        <Field label="Número">
          <input className={inputClass} name="addressNumber" maxLength={20} required />
        </Field>
        <Field label="Complemento" hint="opcional" className="sm:col-span-2">
          <input className={inputClass} name="complement" autoComplete="address-line2" maxLength={120} />
        </Field>
        <Field label="Bairro" className="sm:col-span-2">
          <input
            className={inputClass}
            name="neighborhood"
            minLength={2}
            maxLength={120}
            value={address.neighborhood}
            onChange={(event) => updateAddress("neighborhood", event.currentTarget.value)}
            required
          />
        </Field>
        <Field label="Cidade" className="sm:col-span-4">
          <input
            className={inputClass}
            name="city"
            autoComplete="address-level2"
            minLength={2}
            maxLength={120}
            value={address.city}
            onChange={(event) => updateAddress("city", event.currentTarget.value)}
            required
          />
        </Field>
      </fieldset>

      <div className="absolute -left-[10000px]" aria-hidden="true">
        <label>
          Website
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="border-t border-line-strong p-[clamp(12px,1.5vw,16px)]">
        <TurnstileWidget
          action="uniform_delivery"
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
          className={cn(buttonVariants({ size: "block" }), "py-4 disabled:cursor-wait disabled:opacity-60")}
        >
          {status.state === "submitting" ? (
            <>
              <LoaderCircle width={19} height={19} className="animate-spin" aria-hidden />
              ENVIANDO
            </>
          ) : (
            <>
              CONFIRMAR ENDEREÇO
              <ArrowRight width={18} height={18} strokeWidth={1.7} aria-hidden />
            </>
          )}
        </button>
        <p className="mt-3 text-center text-[12px] leading-[1.5] text-text-faint">
          Os dados são usados somente para a entrega do uniforme. Cada ID, WhatsApp e Discord pode ser cadastrado uma vez.
        </p>
      </div>
    </form>
  );
}
