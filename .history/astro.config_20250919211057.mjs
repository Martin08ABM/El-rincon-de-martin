// @ts-check
import { defineConfig } from 'astro/config';

// Importación del plugin de Tailwind CSS para Vite
import tailwindcss from "@tailwindcss/vite";
// Importación del adaptador de Vercel
import vercel from "@astrojs/vercel";
// Importación del componente de Clerk
import clerk from "@clerk/astro";

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [
    clerk()
  ],

  adapter: vercel(),
});