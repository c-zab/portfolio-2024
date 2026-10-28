import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import vercel from "@astrojs/vercel";

// https://astro.build/config
export default defineConfig({
  site: "https://czab.dev",
  integrations: [tailwind()],
  output: "server",
  adapter: vercel(),
});
