/**
 * Contact form rules, shared by the modal (instant feedback) and /api/contact (the real check).
 * Error codes double as i18n keys: `services.contact.errors.<code>`.
 */

export const CONTACT_PACKAGES = ["discovery", "launch", "retain", "custom"] as const;

export type ContactPackage = (typeof CONTACT_PACKAGES)[number];

export type ContactInput = {
  name: string;
  email: string;
  phone: string;
  package: string;
  message: string;
};

export type ContactErrorCode = "name" | "contact" | "email" | "phone" | "package" | "message";

export const NAME_MIN = 2;
export const NAME_MAX = 80;
export const MESSAGE_MIN = 8;
export const MESSAGE_MAX = 2000;
// E.164 allows at most 15 digits; 7 covers the shortest local numbers.
export const PHONE_DIGITS_MIN = 7;
export const PHONE_DIGITS_MAX = 15;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_CHARS_RE = /^\+?[\d\s().-]+$/;

export function isContactPackage(value: string): value is ContactPackage {
  return (CONTACT_PACKAGES as readonly string[]).includes(value);
}

export function isValidEmail(value: string) {
  return value.length <= 254 && EMAIL_RE.test(value);
}

export function isValidPhone(value: string) {
  if (!PHONE_CHARS_RE.test(value)) return false;
  const digits = value.replace(/\D/g, "").length;
  return digits >= PHONE_DIGITS_MIN && digits <= PHONE_DIGITS_MAX;
}

/** First problem found, in the order the fields appear in the form; null when everything is valid. */
export function validateContact(input: ContactInput): ContactErrorCode | null {
  const name = input.name.trim();
  const email = input.email.trim();
  const phone = input.phone.trim();
  const message = input.message.trim();

  if (name.length < NAME_MIN || name.length > NAME_MAX) return "name";
  if (!email && !phone) return "contact";
  if (email && !isValidEmail(email)) return "email";
  if (phone && !isValidPhone(phone)) return "phone";
  if (!isContactPackage(input.package)) return "package";
  if (message.length < MESSAGE_MIN || message.length > MESSAGE_MAX) return "message";
  return null;
}
