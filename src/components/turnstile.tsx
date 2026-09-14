"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Script from "next/script";

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

/** Incrementar `resetCount` descarta o token atual e pede um novo desafio. */
export function TurnstileWidget({
  action,
  resetCount,
  onTokenChange,
}: {
  action: string;
  resetCount: number;
  onTokenChange: (token: string) => void;
}) {
  const [hasError, setHasError] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim();

  const render = useCallback(() => {
    if (!siteKey || !containerRef.current || !window.turnstile || widgetIdRef.current) {
      return;
    }

    try {
      widgetIdRef.current = window.turnstile.render(containerRef.current, {
        sitekey: siteKey,
        action,
        theme: "dark",
        language: "pt-br",
        "response-field": false,
        callback: (token) => {
          onTokenChange(token);
          setHasError(false);
        },
        "expired-callback": () => onTokenChange(""),
        "error-callback": () => {
          onTokenChange("");
          setHasError(true);
        },
      });
    } catch (error) {
      console.error(error);
      setHasError(true);
    }
  }, [action, onTokenChange, siteKey]);

  useEffect(() => {
    if (resetCount > 0) {
      window.turnstile?.reset(widgetIdRef.current ?? undefined);
    }
  }, [resetCount]);

  if (!siteKey) {
    return (
      <p className="mb-4 border-l-2 border-amber-400 bg-amber-400/8 px-4 py-3 text-sm text-amber-100" role="alert">
        A verificação de segurança está indisponível. Tente novamente mais tarde.
      </p>
    );
  }

  return (
    <>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        strategy="afterInteractive"
        onReady={render}
        onError={() => setHasError(true)}
      />
      <div className="mb-4 flex min-h-[65px] justify-center">
        <div ref={containerRef} />
      </div>
      {hasError ? (
        <p className="mb-4 text-center text-sm text-red-200" role="alert">
          Não foi possível carregar a verificação. Atualize a página e tente novamente.
        </p>
      ) : null}
    </>
  );
}
