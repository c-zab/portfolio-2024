/**
 * Contact form rules, shared by the modal (instant feedback) and /api/contact (the real check).
 * Error codes double as i18n keys: `services.contact.errors.<code>`.
 */

import { isSupportedCountry, parsePhoneNumberFromString, type CountryCode } from "libphonenumber-js/max";

export const CONTACT_PACKAGES = ["discovery", "launch", "retain", "custom"] as const;

export type ContactPackage = (typeof CONTACT_PACKAGES)[number];

export type ContactInput = {
  name: string;
  email: string;
  phone: string;
  package: string;
  message: string;
  /** ISO country picked next to the phone field; unused when the number starts with "+". */
  phoneCountry?: string;
};

export type ContactErrorCode = "name" | "contact" | "email" | "phone" | "package" | "message";

export const NAME_MIN = 2;
export const NAME_MAX = 80;
export const MESSAGE_MIN = 8;
export const MESSAGE_MAX = 2000;
// Longest formatted international number plus some room for spaces and dashes.
export const PHONE_INPUT_MAX = 24;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_CHARS_RE = /^\+?[\d\s().-]+$/;

export function isContactPackage(value: string): value is ContactPackage {
  return (CONTACT_PACKAGES as readonly string[]).includes(value);
}

export function isValidEmail(value: string) {
  return value.length <= 254 && EMAIL_RE.test(value);
}

/**
 * Real-number check with Google's libphonenumber rules (length and prefixes per country).
 * `country` is the picker's ISO code; a number typed with "+" ignores it.
 * Returns the number in E.164 (e.g. "+14165550199"), or null when it can't be a real number.
 */
export function normalizePhone(value: string, country?: string) {
  const raw = value.trim();
  if (!raw || raw.length > PHONE_INPUT_MAX || !PHONE_CHARS_RE.test(raw)) return null;
  const defaultCountry = country && isSupportedCountry(country) ? (country as CountryCode) : undefined;
  if (!raw.startsWith("+") && !defaultCountry) return null;
  const parsed = parsePhoneNumberFromString(raw, defaultCountry);
  return parsed?.isValid() ? parsed.number : null;
}

export function isValidPhone(value: string, country?: string) {
  return normalizePhone(value, country) !== null;
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
  if (phone && !isValidPhone(phone, input.phoneCountry)) return "phone";
  if (!isContactPackage(input.package)) return "package";
  if (message.length < MESSAGE_MIN || message.length > MESSAGE_MAX) return "message";
  return null;
}
