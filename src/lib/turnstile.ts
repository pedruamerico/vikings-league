import "server-only";

type TurnstileResponse = {
  success: boolean;
  action?: string;
};

export async function isTurnstileTokenValid(token: string, action: string, requestId: string) {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) {
    throw new Error("Turnstile is not configured");
  }

  const body = new URLSearchParams({
    secret,
    response: token,
    idempotency_key: requestId,
  });
  const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    body,
    signal: AbortSignal.timeout(5000),
  });

  if (!response.ok) {
    throw new Error("Turnstile verification failed");
  }

  const result = (await response.json()) as TurnstileResponse;
  return result.success && result.action === action;
}
