// LocalStorage utility functions for managing user preferences and data

export interface UserPreferences {
  language: "en" | "es";
  theme: "light" | "dark";
  // Add more preferences as needed
}

export class StorageManager {
  private static readonly PREFIX = "portfolio-2024-";

  // Generic storage methods
  static setItem(key: string, value: any): void {
    try {
      const serializedValue = JSON.stringify(value);
      localStorage.setItem(this.PREFIX + key, serializedValue);
    } catch (error) {
      console.warn(`Failed to save ${key} to localStorage:`, error);
    }
  }

  static getItem<T>(key: string, defaultValue?: T): T | null {
    try {
      const item = localStorage.getItem(this.PREFIX + key);
      return item ? JSON.parse(item) : defaultValue || null;
    } catch (error) {
      console.warn(`Failed to read ${key} from localStorage:`, error);
      return defaultValue || null;
    }
  }

  static removeItem(key: string): void {
    try {
      localStorage.removeItem(this.PREFIX + key);
    } catch (error) {
      console.warn(`Failed to remove ${key} from localStorage:`, error);
    }
  }

  static clear(): void {
    try {
      // Only clear items with our prefix
      const keys = Object.keys(localStorage);
      keys.forEach((key) => {
        if (key.startsWith(this.PREFIX)) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.warn("Failed to clear localStorage:", error);
    }
  }

  // Specific preference methods
  static setLanguage(language: "en" | "es"): void {
    this.setItem("preferred-language", language);
  }

  static getLanguage(): "en" | "es" {
    return this.getItem("preferred-language", "en");
  }

  static setTheme(theme: "light" | "dark"): void {
    this.setItem("theme", theme);
  }

  static getTheme(): "light" | "dark" {
    return this.getItem("theme", "dark");
  }

  // Get all user preferences
  static getPreferences(): UserPreferences {
    return {
      language: this.getLanguage(),
      theme: this.getTheme(),
    };
  }

  // Set multiple preferences at once
  static setPreferences(preferences: Partial<UserPreferences>): void {
    if (preferences.language) {
      this.setLanguage(preferences.language);
    }
    if (preferences.theme) {
      this.setTheme(preferences.theme);
    }
  }
}

// Convenience functions for backward compatibility
export const setLanguage = StorageManager.setLanguage;
export const getLanguage = StorageManager.getLanguage;
export const setTheme = StorageManager.setTheme;
export const getTheme = StorageManager.getTheme;
