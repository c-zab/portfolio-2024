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

  return typeof value === "string" || typeof value === "number" ? String(value) : key;
}

export function getTranslationList(locale: Locale, key: string): string[] {
  const keys = key.split(".");

  function lookup(source: Locale): unknown {
    let value: any = translations[source];
    for (const k of keys) {
      if (value && typeof value === "object" && k in value) {
        value = value[k];
      } else {
        return undefined;
      }
    }
    return value;
  }

  const value = lookup(locale);
  if (Array.isArray(value) && value.every((item) => typeof item === "string")) {
    return value;
  }

  if (locale !== "en") {
    const fallback = lookup("en");
    if (Array.isArray(fallback) && fallback.every((item) => typeof item === "string")) {
      return fallback;
    }
  }

  return [];
}

export function getLocaleFromPath(pathname: string): Locale {
  if (pathname.startsWith("/es")) return "es";
  return "en";
}

export function getPathWithoutLocale(path: string): string {
  if (path.startsWith("/en/") || path.startsWith("/es/")) {
    return path.substring(3) || "/";
  }
  if (path === "/en" || path === "/es") {
    return "/";
  }
  return path;
}

export function getLocalizedPath(path: string, locale: Locale): string {
  if (locale === "en") {
    return path === "/" ? "/en/" : `/en${path}`;
  }
  return path === "/" ? "/es/" : `/es${path}`;
}
