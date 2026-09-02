"use client";

import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { RegistrationForm } from "@/components/registration-form";
import { site } from "@/content/content";

const focusableSelector =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function RegistrationModal() {
  const [isOpen, setIsOpen] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    function handleRegistrationClick(event: MouseEvent) {
      const target = event.target;
      if (!(target instanceof Element)) return;

      const trigger = target.closest<HTMLAnchorElement>('a[href="#inscricao"]');
      if (!trigger) return;

      event.preventDefault();
      triggerRef.current = trigger;
      setIsOpen(true);
    }

    document.addEventListener("click", handleRegistrationClick);
    return () => document.removeEventListener("click", handleRegistrationClick);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
        return;
      }

      if (event.key !== "Tab" || !dialogRef.current) return;
      const focusable = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(focusableSelector),
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
      document.removeEventListener("keydown", handleKeyDown);
      triggerRef.current?.focus();
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-100 flex items-start justify-center overflow-y-auto overscroll-contain bg-black/82 px-3 py-1.5 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) setIsOpen(false);
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="registration-modal-title"
        className="relative my-auto w-full max-w-[1120px] border border-white/18 bg-bg shadow-[0_28px_100px_rgba(0,0,0,0.72)] vl-texture"
      >
        <header className="flex items-start justify-between gap-5 border-b border-line-strong bg-[rgba(11,14,19,0.88)] px-[clamp(18px,3vw,30px)] py-[clamp(12px,1.5vw,16px)]">
          <div>
            <div className="font-sans text-[10px] font-semibold tracking-[0.18em] text-accent-soft uppercase">
              {site.season} · {site.vacancies}
            </div>
            <h2
              id="registration-modal-title"
              className="mt-1 font-display text-[clamp(28px,3.6vw,40px)] leading-[0.9] font-extrabold uppercase"
            >
              Ficha de <span className="text-accent">inscrição</span>
            </h2>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={() => setIsOpen(false)}
            className="flex h-11 w-11 flex-none items-center justify-center border border-white/18 text-text-muted transition-colors hover:border-accent hover:bg-accent hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            aria-label="Fechar inscrição"
          >
            <X width={22} height={22} strokeWidth={1.7} aria-hidden />
          </button>
        </header>

        <div className="grid grid-cols-3 border-b border-line-strong bg-black/24">
          {[
            ["01", "Perfil"],
            ["02", "Uniforme"],
            ["03", "Posições"],
          ].map(([number, label]) => (
            <div
              key={number}
              className="flex items-center justify-center gap-2 border-r border-line px-2 py-2 last:border-r-0"
            >
              <span className="font-display text-base font-extrabold text-accent-soft">{number}</span>
              <span className="font-sans text-[9px] font-semibold tracking-[0.14em] text-text-dim uppercase">
                {label}
              </span>
            </div>
          ))}
        </div>

        <div className="p-[clamp(10px,1.5vw,16px)]">
          <RegistrationForm />
        </div>
      </div>
    </div>
  );
}
