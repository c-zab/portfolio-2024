import { CONTACT_EMAIL } from "./site";

/**
 * Emails a saved contact message to the inbox via Resend (https://resend.com).
 * Server-only — never import from client scripts.
 *
 * Env: RESEND_API_KEY (required to send), CONTACT_EMAIL (recipient, defaults to hello@czab.dev),
 * CONTACT_FROM (sender; must be on a domain verified in Resend, or Resend's onboarding@resend.dev for testing).
 */

export type ContactNotification = {
  name: string;
  email: string | null;
  phone: string | null;
  package: string;
  message: string;
};

const DEFAULT_FROM = "czab.dev <onboarding@resend.dev>";

/** Returns false (and logs why) instead of throwing: the message is already saved, so the visitor still sees success. */
export async function notifyContact(contact: ContactNotification) {
  const apiKey = import.meta.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("[contact] RESEND_API_KEY not set; skipping email notification");
    return false;
  }

  const lines = [
    `Name: ${contact.name}`,
    `Email: ${contact.email ?? "—"}`,
    `Phone: ${contact.phone ?? "—"}`,
    `Package: ${contact.package}`,
    "",
    contact.message,
  ];

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: import.meta.env.CONTACT_FROM || DEFAULT_FROM,
        to: [import.meta.env.CONTACT_EMAIL || CONTACT_EMAIL],
        // Hitting "Reply" answers the visitor directly when they left an email.
        ...(contact.email ? { reply_to: contact.email } : {}),
        subject: `New contact: ${contact.name} (${contact.package})`,
        text: lines.join("\n"),
      }),
    });
    if (!res.ok) {
      console.error("[contact] resend failed:", res.status, await res.text());
      return false;
    }
    return true;
  } catch (err) {
    console.error("[contact] resend failed:", err instanceof Error ? err.message : err);
    return false;
  }
}
