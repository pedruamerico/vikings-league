import { createSupabaseAdmin } from "@/lib/supabase-admin";
import {
  getPhotoExtension,
  hasValidImageSignature,
  maxPhotoSize,
  positions,
  shirtSizes,
  type Position,
  type ShirtSize,
} from "@/lib/registration";
import { isTurnstileTokenValid } from "@/lib/turnstile";

export const runtime = "nodejs";

const maxRequestSize = maxPhotoSize + 512 * 1024;
const instagramPattern = /^[a-z0-9._]{1,30}$/;
const whatsappPattern = /^[1-9][0-9]{9,14}$/;

class InvalidRegistrationError extends Error {}

function getText(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function isPosition(value: string): value is Position {
  return positions.some((position) => position.value === value);
}

function isShirtSize(value: string): value is ShirtSize {
  return shirtSizes.includes(value as ShirtSize);
}

function validateGroupUrl() {
  const groupUrl = process.env.WHATSAPP_GROUP_URL;
  if (!groupUrl?.startsWith("https://chat.whatsapp.com/")) {
    throw new Error("WhatsApp group URL is not configured");
  }
  return groupUrl;
}

async function validateTurnstile(token: string, requestId: string) {
  if (!token) {
    throw new InvalidRegistrationError("Conclua a verificação de segurança.");
  }

  if (!(await isTurnstileTokenValid(token, "registration", requestId))) {
    throw new InvalidRegistrationError("A verificação de segurança expirou. Tente novamente.");
  }
}

export async function POST(request: Request) {
  const requestId = crypto.randomUUID();

  try {
    const groupUrl = validateGroupUrl();
    const requestOrigin = request.headers.get("origin");
    if (requestOrigin && requestOrigin !== new URL(request.url).origin) {
      return Response.json({ message: "Origem inválida.", requestId }, { status: 403 });
    }

    const contentLength = Number(request.headers.get("content-length") ?? 0);
    if (contentLength > maxRequestSize) {
      return Response.json(
        { message: "A foto deve ter no máximo 5 MB.", requestId },
        { status: 413 },
      );
    }

    const formData = await request.formData();
    if (getText(formData, "website")) {
      return Response.json({ message: "Inscrição inválida.", requestId }, { status: 400 });
    }

    await validateTurnstile(getText(formData, "cf-turnstile-response"), requestId);

    const photo = formData.get("photo");
    const name = getText(formData, "name");
    const gameId = getText(formData, "gameId");
    const instagram = getText(formData, "instagram").replace(/^@/, "").toLowerCase();
    const whatsapp = getText(formData, "whatsapp").replace(/\D/g, "");
    const shirtSize = getText(formData, "shirtSize");
    const shirtNumber = Number(getText(formData, "shirtNumber"));
    const position1 = getText(formData, "position1");
    const position2 = getText(formData, "position2");
    const position3 = getText(formData, "position3");

    if (!(photo instanceof File) || photo.size === 0) {
      throw new InvalidRegistrationError("Selecione uma foto.");
    }

    const extension = getPhotoExtension(photo);
    if (
      !extension ||
      photo.size > maxPhotoSize ||
      !(await hasValidImageSignature(photo))
    ) {
      throw new InvalidRegistrationError("Envie uma foto JPEG, PNG ou WebP de até 5 MB.");
    }

    if (name.length < 2 || name.length > 120) {
      throw new InvalidRegistrationError("Informe seu nome completo.");
    }
    if (gameId.length < 2 || gameId.length > 64) {
      throw new InvalidRegistrationError("Informe um ID válido no jogo.");
    }
    if (!instagramPattern.test(instagram)) {
      throw new InvalidRegistrationError("Informe somente o usuário do Instagram.");
    }
    if (!whatsappPattern.test(whatsapp)) {
      throw new InvalidRegistrationError("Informe o WhatsApp com DDD e código do país.");
    }
    if (!isShirtSize(shirtSize)) {
      throw new InvalidRegistrationError("Selecione o tamanho da camisa.");
    }
    if (!Number.isInteger(shirtNumber) || shirtNumber < 1 || shirtNumber > 99) {
      throw new InvalidRegistrationError("Escolha um número de camisa entre 1 e 99.");
    }
    if (!isPosition(position1) || !isPosition(position2) || !isPosition(position3)) {
      throw new InvalidRegistrationError("Selecione as três posições.");
    }
    if (new Set([position1, position2, position3]).size !== 3) {
      throw new InvalidRegistrationError("Escolha três posições diferentes.");
    }

    const idempotencyKey = crypto.randomUUID();
    const photoObjectPath = `registrations/${idempotencyKey}.${extension}`;
    const supabase = createSupabaseAdmin();
    const bucket = process.env.SUPABASE_REGISTRATION_PHOTOS_BUCKET ?? "registration-photos";

    const { error: uploadError } = await supabase.storage.from(bucket).upload(photoObjectPath, photo, {
      cacheControl: "3600",
      contentType: photo.type,
      upsert: false,
    });

    if (uploadError) {
      throw new Error("Photo upload failed");
    }

    const { error: insertError } = await supabase.from("registrations").insert({
      idempotency_key: idempotencyKey,
      photo_object_path: photoObjectPath,
      photo_mime_type: photo.type,
      photo_size_bytes: photo.size,
      name,
      game_id: gameId,
      instagram,
      whatsapp,
      shirt_size: shirtSize,
      shirt_number: shirtNumber,
      position_1: position1,
      position_2: position2,
      position_3: position3,
    });

    if (insertError) {
      await supabase.storage.from(bucket).remove([photoObjectPath]);

      if (insertError.code === "23505") {
        return Response.json(
          { message: "Este ID no jogo ou WhatsApp já está inscrito.", requestId },
          { status: 409 },
        );
      }
      throw new Error("Registration insert failed");
    }

    return Response.json({ groupUrl }, { status: 201 });
  } catch (error) {
    if (error instanceof InvalidRegistrationError) {
      return Response.json({ message: error.message, requestId }, { status: 400 });
    }

    return Response.json(
      { message: "Não foi possível concluir a inscrição. Tente novamente.", requestId },
      { status: 500 },
    );
  }
}
