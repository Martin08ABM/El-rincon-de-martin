// @ts-check
import { defineConfig } from 'astro/config';

// Importación del plugin de Tailwind CSS para Vite
import tailwindcss from "@tailwindcss/vite";
// Importación del adaptador de Vercel
import vercel from "@astrojs/vercel";
// Imppo

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
  },

  adapter: vercel(),
});