import { defineConfig } from "vite";
import path from "path";
import glsl from "vite-plugin-glsl";

const dirname = path.resolve();

export default defineConfig({
  root: "docs",
  publicDir: "../public",
  base: "../docs",
  build: {
    outDir: "../dist",
    emptyOutDir: true,
    sourcemap: true,
  },
  plugins: [glsl()],
});
