import type { Metadata } from "next";
import { Download, LogOut } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Field, inputClass } from "@/components/ui/form-field";
import {
  adminPath,
  hasAdminSession,
  listUniformDeliveries,
  uniformDeliveryColumns,
} from "@/lib/uniform-delivery-admin";
import { cn } from "@/lib/utils";
import { login, logout } from "./actions";

export const metadata: Metadata = {
  title: "Admin entregas — Vikings League",
  robots: { index: false, follow: false },
};

export default async function UniformDeliveryAdminPage({ searchParams }: PageProps<"/entregauniforme/admin">) {
  if (!(await hasAdminSession())) {
    const { erro } = await searchParams;

    return (
      <main className="mx-auto max-w-[420px] px-[clamp(12px,3vw,24px)] py-[clamp(40px,8vw,96px)]">
        <h1 className="font-display text-[clamp(32px,5vw,48px)] leading-[0.9] font-extrabold uppercase">
          Acesso <span className="text-accent">restrito</span>
        </h1>
        <form action={login} className="mt-6 border border-line-strong bg-black/20 p-[clamp(12px,1.5vw,16px)]">
          <Field label="Senha">
            <input className={inputClass} name="password" type="password" autoComplete="current-password" required />
          </Field>
          {erro ? (
            <p className="mt-3 border-l-2 border-red-400 bg-red-400/8 px-4 py-3 text-sm text-red-200" role="alert">
              Senha incorreta.
            </p>
          ) : null}
          <button type="submit" className={cn(buttonVariants({ size: "sm" }), "mt-4 w-full py-3")}>
            ENTRAR
          </button>
        </form>
      </main>
    );
  }

  const deliveries = await listUniformDeliveries();

  return (
    <main className="mx-auto max-w-[1440px] px-[clamp(12px,3vw,24px)] py-[clamp(24px,4vw,48px)]">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-[clamp(32px,5vw,52px)] leading-[0.9] font-extrabold uppercase">
            Entregas de <span className="text-accent">uniforme</span>
          </h1>
          <p className="mt-2 text-sm text-text-muted">
            {deliveries.length} {deliveries.length === 1 ? "jogador cadastrado" : "jogadores cadastrados"}
          </p>
        </div>
        <div className="flex gap-2">
          <a href={`${adminPath}/export`} className={buttonVariants({ size: "sm" })}>
            <Download width={16} height={16} strokeWidth={1.8} aria-hidden />
            EXPORTAR CSV
          </a>
          <form action={logout}>
            <button type="submit" className={buttonVariants({ variant: "outline", size: "sm" })}>
              <LogOut width={16} height={16} strokeWidth={1.8} aria-hidden />
              SAIR
            </button>
          </form>
        </div>
      </div>

      <div className="mt-6 overflow-x-auto border border-line-strong bg-black/20">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="border-b border-line-strong bg-black/30">
            <tr>
              {uniformDeliveryColumns.map((column) => (
                <th
                  key={column.label}
                  className="px-3 py-2.5 font-sans text-[10px] font-semibold tracking-[0.12em] text-text-muted uppercase"
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {deliveries.map((delivery) => (
              <tr key={delivery.id} className="border-b border-line last:border-b-0 hover:bg-white/4">
                {uniformDeliveryColumns.map((column) => (
                  <td key={column.label} className="px-3 py-2.5 text-text-body">
                    {column.href ? (
                      <a
                        href={column.href(delivery)}
                        target="_blank"
                        rel="noopener"
                        className="text-accent-soft underline-offset-4 hover:underline"
                      >
                        {column.value(delivery)}
                      </a>
                    ) : (
                      column.value(delivery)
                    )}
                  </td>
                ))}
              </tr>
            ))}
            {deliveries.length === 0 ? (
              <tr>
                <td colSpan={uniformDeliveryColumns.length} className="px-3 py-8 text-center text-text-faint">
                  Nenhum cadastro ainda.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </main>
  );
}
