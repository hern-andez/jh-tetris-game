import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "../../../Proyectos/Advanced-Projects/Juegos/Tetris",
    emptyOutDir: true,
  },
  base: "https://hern-andez.github.io/Juegos/Tetris",
});
