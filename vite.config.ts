/** @type {import('vite').UserConfig} */
import { resolve } from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
    plugins: [react(), tailwindcss()],
    // Relative URLs so assets load on GitHub Pages project sites (/repo/) and at domain root.
    base: "./",
    build: {
        rollupOptions: {
            input: {
                main: resolve(import.meta.dirname, "index.html"),
            },
        },
    },
});
