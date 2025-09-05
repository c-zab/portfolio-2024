import enTranslations from "../i18n/en.json";
import esTranslations from "../i18n/es.json";

export type Locale = "en" | "es";

export const translations = {
  en: enTranslations,
  es: esTranslations,
} as const;

export function getTranslation(locale: Locale, key: string): string {
  const keys = key.split(".");
  let value: any = translations[locale];

  for (const k of keys) {
    if (value && typeof value === "object" && k in value) {
      value = value[k];
    } else {
      // Fallback to English if key not found
      value = translations.en;
      for (const fallbackKey of keys) {
        if (value && typeof value === "object" && fallbackKey in value) {
          value = value[fallbackKey];
        } else {
          return key; // Return the key if not found anywhere
        }
      }
      break;
    }
  }

  return typeof value === "string" ? value : key;
}

export function getLocaleFromPath(pathname: string): Locale {
  if (pathname.startsWith("/es")) return "es";
  return "en";
}

export function getLocalizedPath(path: string, locale: Locale): string {
  if (locale === "en") {
    return path === "/" ? "/en/" : `/en${path}`;
  }
  return path === "/" ? "/es/" : `/es${path}`;
}
