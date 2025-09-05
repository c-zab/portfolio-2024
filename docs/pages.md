# Pages

## index.astro

File: `src/pages/index.astro`

- **Purpose**: Home page composition that assembles the layout, left-side header, and a main area.
- **Imports**:
  - `../layouts/Layout.astro`
  - `../components/header-left-side.astro`
  - `../components/cooming-soon.astro`
  - Inter fonts
- **Usage**:

```astro
---
import Layout from "../layouts/Layout.astro";
import HeaderLeftSide from "../components/header-left-side.astro";
import ComingSoon from "../components/cooming-soon.astro";
---

<Layout title="Welcome to CZ">
  <div class="mx-auto max-w-screen-xl">
    <div class="lg:flex lg:justify-between lg:gap-4">
      <HeaderLeftSide />
      <main class="pt-24 lg:w-1/2 lg:py-24">
        <ComingSoon />
      </main>
    </div>
  </div>
</Layout>
```

## Creating a New Page

1. Create a new file under `src/pages/your-page.astro`.
2. Wrap page content with `Layout` and provide a `title`.
3. Compose components as needed.

```astro
---
import Layout from "../layouts/Layout.astro";
import Projects from "../components/projects.astro";
---

<Layout title="Projects">
  <main class="container mx-auto px-6 py-12">
    <Projects />
  </main>
</Layout>
```
