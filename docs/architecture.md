# Portfolio Architecture

## Component Structure

### Language Switcher Component

#### `LanguageSwitcher` (Single Component)

- **Location**: `src/components/language-switcher.astro`
- **Purpose**: Main language switching component with responsive dark mode. Props are light and dark
- **Styling**: Uses Tailwind responsive classes (`bg-white dark:bg-slate-800`)
- **Behavior**: Automatically adapts to theme changes via `dark` class on HTML element
- **Usage**: Used in ALL pages (home and HB) with positioning wrapper when needed

## Theme System

### Dark Mode Implementation

- **Method**: CSS classes on HTML element (`dark` class)
- **Toggle**: Theme toggle button adds/removes `dark` class
- **Components**: All components use responsive dark mode classes (`dark:bg-slate-800`, etc.)
- **Consistency**: ALL components should look identical in dark mode regardless of page

### HB Pages Theme

- **Background**: Always dark (`bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900`)
- **Language Switcher**: Should appear dark (slate-800 background) to match the dark theme
- **Text**: White text on dark background

## Page Structure

### Home Pages

- **English**: `/en/` - Uses `LanguageSwitcher` in header
- **Spanish**: `/es/` - Uses `LanguageSwitcher` in header

### HB Pages

- **English**: `/en/HB33` - Uses `LanguageSwitcher` with positioning wrapper (`absolute top-4 left-4 z-20`)
- **Spanish**: `/es/HB33` - Uses `LanguageSwitcher` with positioning wrapper (`absolute top-4 left-4 z-20`)

## URL Handling

### Language Switching Logic

- **Function**: `getLocalizedPath(path, locale)` in `src/utils/i18n.ts`
- **Behavior**:
  - Extracts current path without language prefix
  - Applies new language prefix
  - Example: `/en/HB33` → `/es/HB33`

### Path Extraction

- **Function**: `getPathWithoutLocale(path)` in LanguageSwitcher
- **Logic**:
  - `/en/page` → `/page`
  - `/es/page` → `/page`
  - `/en` → `/`
  - `/es` → `/`

## JavaScript Behavior

### Language Switcher Script

- **Location**: Inside `LanguageSwitcher` component
- **Functions**:
  - `updateLanguageSwitcher()`: Updates active state based on current URL
  - Event listeners for click handling
- **Targeting**: Uses component-specific selectors, not global

## Styling Rules

### Dark Mode Classes

- **Container**: `bg-white dark:bg-slate-800`
- **Border**: `border-slate-200 dark:border-slate-600`
- **Active Text**: `text-slate-700 dark:text-slate-100`
- **Inactive Text**: `text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200`
- **Active Background**: `bg-slate-100 dark:bg-slate-700`

### HB Page Specific

- **Positioning**: `absolute top-4 left-4 z-20`
- **Background**: Must be dark to match page theme
- **No Props**: No `dark` prop needed - uses responsive classes

## Current Issues

### Fixed Issues

1. ✅ Removed `dark` prop from LanguageSwitcher
2. ✅ Deleted all duplicate language switcher components
3. ✅ Updated both HB pages to use single LanguageSwitcher component
4. ✅ Fixed URL handling for language switching
5. ✅ Simplified architecture to use only one language switcher component

### Current Status

1. ✅ Single `LanguageSwitcher` component used across all pages
2. ✅ Responsive dark mode works on all pages
3. ✅ Proper positioning on HB pages with wrapper div
4. ✅ Consistent behavior and styling across all pages
