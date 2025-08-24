# Components

This project exposes several UI components under `src/components/`.

## about.astro
- **Purpose**: Renders the About section with biography and interactive lettering.
- **Props**: None
- **Slots**: None
- **Usage**:
```astro
---
import About from "../components/about.astro";
---
<About />
```

## cooming-soon.astro
- **Purpose**: Displays a simple banner indicating the site is being refreshed.
- **Props**: None
- **Slots**: None
- **Usage**:
```astro
---
import ComingSoon from "../components/cooming-soon.astro";
---
<ComingSoon />
```

## experience.astro
- **Purpose**: Renders the Experience section with roles, descriptions, and technologies.
- **Props**: None
- **Slots**: None
- **Usage**:
```astro
---
import Experience from "../components/experience.astro";
---
<Experience />
```

## header-left-side.astro
- **Purpose**: Sticky left-side header with animated name, subtitle, bio, and social navbar.
- **Props**: None
- **Slots**: None
- **Dependencies**: Imports and renders `navbar.astro`. Uses `animejs` for text animation.
- **Usage**:
```astro
---
import HeaderLeftSide from "../components/header-left-side.astro";
---
<HeaderLeftSide />
```

## navbar.astro
- **Purpose**: Social links list with accessible labels and icons.
- **Props**: None
- **Slots**: None
- **Usage**:
```astro
---
import Navbar from "../components/navbar.astro";
---
<Navbar />
```

## projects.astro
- **Purpose**: Renders the Projects section with selected projects and links.
- **Props**: None
- **Slots**: None
- **Usage**:
```astro
---
import Projects from "../components/projects.astro";
---
<Projects />
```

## Notes
- Components rely on Tailwind classes for styling; ensure Tailwind is configured (it is via `@astrojs/tailwind`).
- Image `src` fields in `projects.astro` are currently empty; provide valid paths for production.