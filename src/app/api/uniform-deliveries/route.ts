import { createSupabaseAdmin } from "@/lib/supabase-admin";
import { isTurnstileTokenValid } from "@/lib/turnstile";
import { brazilianStates, type BrazilianState } from "@/lib/uniform-delivery";

export const runtime = "nodejs";

const maxRequestSize = 16 * 1024;
const whatsappPattern = /^[1-9][0-9]{9,14}$/;
const discordPattern = /^[a-z0-9._]{2,32}$/;
const postalCodePattern = /^[0-9]{8}$/;

const duplicateMessages: Record<string, string> = {
  uniform_deliveries_game_id_lower_unique: "Este ID no jogo já foi cadastrado.",
  uniform_deliveries_whatsapp_unique: "Este WhatsApp já foi cadastrado.",
  uniform_deliveries_discord_unique: "Este Discord já foi cadastrado.",
};

class InvalidDeliveryError extends Error {}

function getText(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function toUpperText(value: string) {
  return value.toLocaleUpperCase("pt-BR");
}

function isBrazilianState(value: string): value is BrazilianState {
  return brazilianStates.includes(value as BrazilianState);
}

function hasLength(value: string, min: number, max: number) {
  return value.length >= min && value.length <= max;
}

export async function POST(request: Request) {
  const requestId = crypto.randomUUID();

  try {
    const requestOrigin = request.headers.get("origin");
    if (requestOrigin && requestOrigin !== new URL(request.url).origin) {
      return Response.json({ message: "Origem inválida.", requestId }, { status: 403 });
    }

    if (Number(request.headers.get("content-length") ?? 0) > maxRequestSize) {
      return Response.json({ message: "Cadastro inválido.", requestId }, { status: 413 });
    }

    const formData = await request.formData();
    if (getText(formData, "website")) {
      return Response.json({ message: "Cadastro inválido.", requestId }, { status: 400 });
    }

    const turnstileToken = getText(formData, "cf-turnstile-response");
    if (!turnstileToken) {
      throw new InvalidDeliveryError("Conclua a verificação de segurança.");
    }
    if (!(await isTurnstileTokenValid(turnstileToken, "uniform_delivery", requestId))) {
      throw new InvalidDeliveryError("A verificação de segurança expirou. Tente novamente.");
    }

    const name = toUpperText(getText(formData, "name"));
    const gameId = getText(formData, "gameId");
    const whatsapp = getText(formData, "whatsapp").replace(/\D/g, "");
    const discord = getText(formData, "discord").replace(/^@/, "").toLowerCase();
    const postalCode = getText(formData, "postalCode").replace(/\D/g, "");
    const street = toUpperText(getText(formData, "street"));
    const addressNumber = toUpperText(getText(formData, "addressNumber"));
    const complement = toUpperText(getText(formData, "complement"));
    const neighborhood = toUpperText(getText(formData, "neighborhood"));
    const city = toUpperText(getText(formData, "city"));
    const state = getText(formData, "state").toUpperCase();

    if (!hasLength(name, 2, 120)) {
      throw new InvalidDeliveryError("Informe seu nome completo.");
    }
    if (!hasLength(gameId, 2, 64)) {
      throw new InvalidDeliveryError("Informe um ID válido no jogo.");
    }
    if (!whatsappPattern.test(whatsapp)) {
      throw new InvalidDeliveryError("Informe o WhatsApp com DDD e código do país.");
    }
    if (!discordPattern.test(discord)) {
      throw new InvalidDeliveryError("Informe o nome de usuário do Discord.");
    }
    if (!postalCodePattern.test(postalCode)) {
      throw new InvalidDeliveryError("Informe um CEP com 8 dígitos.");
    }
    if (!hasLength(street, 2, 160)) {
      throw new InvalidDeliveryError("Informe a rua.");
    }
    if (!hasLength(addressNumber, 1, 20)) {
      throw new InvalidDeliveryError("Informe o número do endereço.");
    }
    if (complement.length > 120) {
      throw new InvalidDeliveryError("O complemento deve ter no máximo 120 caracteres.");
    }
    if (!hasLength(neighborhood, 2, 120)) {
      throw new InvalidDeliveryError("Informe o bairro.");
    }
    if (!hasLength(city, 2, 120)) {
      throw new InvalidDeliveryError("Informe a cidade.");
    }
    if (!isBrazilianState(state)) {
      throw new InvalidDeliveryError("Selecione o estado.");
    }

    const { error } = await createSupabaseAdmin().from("uniform_deliveries").insert({
      name,
      game_id: gameId,
      whatsapp,
      discord,
      postal_code: postalCode,
      street,
      address_number: addressNumber,
      complement: complement || null,
      neighborhood,
      city,
      state,
    });

    if (error) {
      if (error.code === "23505") {
        const constraint = Object.keys(duplicateMessages).find((key) => error.message.includes(key));
        return Response.json(
          {
            message: constraint ? duplicateMessages[constraint] : "Estes dados já foram cadastrados.",
            requestId,
          },
          { status: 409 },
        );
      }
      throw new Error("Uniform delivery insert failed");
    }

    return Response.json({ ok: true }, { status: 201 });
  } catch (error) {
    if (error instanceof InvalidDeliveryError) {
      return Response.json({ message: error.message, requestId }, { status: 400 });
    }

    return Response.json(
      { message: "Não foi possível concluir o cadastro. Tente novamente.", requestId },
      { status: 500 },
    );
  }
}
