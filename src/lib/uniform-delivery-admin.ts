import "server-only";
import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { createSupabaseAdmin } from "@/lib/supabase-admin";

export const adminPath = "/entregauniforme/admin";
export const adminSessionCookie = "uniform_delivery_admin";
export const adminSessionMaxAge = 12 * 60 * 60;

export type UniformDelivery = {
  id: string;
  created_at: string;
  name: string;
  game_id: string;
  whatsapp: string;
  discord: string;
  postal_code: string;
  street: string;
  address_number: string;
  complement: string | null;
  neighborhood: string;
  city: string;
  state: string;
};

export const uniformDeliveryColumns: {
  label: string;
  value: (delivery: UniformDelivery) => string;
  href?: (delivery: UniformDelivery) => string;
}[] = [
  {
    label: "Data",
    value: (delivery) =>
      new Date(delivery.created_at).toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" }),
  },
  { label: "Nome", value: (delivery) => delivery.name },
  { label: "ID no jogo", value: (delivery) => delivery.game_id },
  {
    label: "WhatsApp",
    value: (delivery) => delivery.whatsapp,
    href: (delivery) => `https://wa.me/${delivery.whatsapp}`,
  },
  { label: "Discord", value: (delivery) => delivery.discord },
  { label: "CEP", value: (delivery) => delivery.postal_code.replace(/^(\d{5})(\d{3})$/, "$1-$2") },
  { label: "Rua", value: (delivery) => delivery.street },
  { label: "Número", value: (delivery) => delivery.address_number },
  { label: "Complemento", value: (delivery) => delivery.complement ?? "" },
  { label: "Bairro", value: (delivery) => delivery.neighborhood },
  { label: "Cidade", value: (delivery) => delivery.city },
  { label: "UF", value: (delivery) => delivery.state },
];

function getAdminPassword() {
  const password = process.env.UNIFORM_DELIVERY_ADMIN_PASSWORD;
  if (!password || password.length < 16) {
    throw new Error("Uniform delivery admin password is not configured");
  }
  return password;
}

// Comparar digests de tamanho fixo permite timingSafeEqual com entradas de qualquer tamanho.
function safeEqual(a: string, b: string) {
  return timingSafeEqual(createHash("sha256").update(a).digest(), createHash("sha256").update(b).digest());
}

// A assinatura usa a própria senha como chave: trocar a senha invalida todas as sessões.
function sign(value: string) {
  return createHmac("sha256", getAdminPassword()).update(value).digest("hex");
}

export function isAdminPassword(value: string) {
  return safeEqual(value, getAdminPassword());
}

export function createAdminSession() {
  const expiresAt = String(Date.now() + adminSessionMaxAge * 1000);
  return `${expiresAt}.${sign(expiresAt)}`;
}

export async function hasAdminSession() {
  const token = (await cookies()).get(adminSessionCookie)?.value;
  const [expiresAt, signature] = token?.split(".") ?? [];
  if (!expiresAt || !signature || Number(expiresAt) < Date.now()) {
    return false;
  }
  return safeEqual(signature, sign(expiresAt));
}

export async function listUniformDeliveries() {
  const { data, error } = await createSupabaseAdmin()
    .from("uniform_deliveries")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) {
    throw new Error("Uniform deliveries query failed");
  }
  return data as UniformDelivery[];
}
