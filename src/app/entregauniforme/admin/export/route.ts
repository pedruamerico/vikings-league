import {
  hasAdminSession,
  listUniformDeliveries,
  uniformDeliveryColumns,
} from "@/lib/uniform-delivery-admin";

export const runtime = "nodejs";

// Excel interpreta células iniciadas por = + - @ como fórmula; o apóstrofo neutraliza.
function toCsvCell(value: string) {
  const safeValue = /^[=+\-@\t\r]/.test(value) ? `'${value}` : value;
  return `"${safeValue.replaceAll('"', '""')}"`;
}

export async function GET() {
  if (!(await hasAdminSession())) {
    return new Response("Não autorizado.", { status: 401 });
  }

  const deliveries = await listUniformDeliveries();
  // Separador ";" e BOM: formato que o Excel em pt-BR abre em colunas e com acentos corretos.
  const csv = [
    uniformDeliveryColumns.map((column) => toCsvCell(column.label)).join(";"),
    ...deliveries.map((delivery) =>
      uniformDeliveryColumns.map((column) => toCsvCell(column.value(delivery))).join(";"),
    ),
  ].join("\r\n");
  const date = new Date().toLocaleDateString("en-CA", { timeZone: "America/Sao_Paulo" });

  return new Response(`﻿${csv}`, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="entregas-uniforme-${date}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
