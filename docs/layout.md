# Layout

File: `src/layouts/Layout.astro`

A base HTML document wrapper that sets global metadata, fonts, and page shell. Renders a single default `<slot />` for page content.

## Props
- `title` (string, required): Text for the `<title>` tag.

## Slots
- Default slot: Page content.

## Usage
```astro
---
import Layout from "../layouts/Layout.astro";
---

<Layout title="My Page Title">
  <main>Content goes here</main>
</Layout>
```

## Notes
- Imports global Inter fonts.
- Applies Tailwind classes to `<body>` for base colors and typography.