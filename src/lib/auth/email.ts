import { getAppBaseUrl } from "./session";

export function buildConfirmationUrl(token: string): string {
  return `${getAppBaseUrl()}/api/auth/confirm?token=${token}`;
}

/** In dev la mail non parte davvero: log + URL restituito al client */
export async function sendConfirmationEmail(
  email: string,
  confirmUrl: string,
): Promise<{ sent: boolean; devLink?: string }> {
  const isDev = process.env.NODE_ENV !== "production";

  console.log("\n📧 Queue Less — Email di conferma (demo)\n");
  console.log(`   A: ${email}`);
  console.log(`   Link: ${confirmUrl}\n`);

  if (isDev) {
    return { sent: true, devLink: confirmUrl };
  }

  // Produzione: collegare Resend / SendGrid qui
  return { sent: true };
}
