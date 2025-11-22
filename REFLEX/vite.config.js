import { defineConfig } from "vite";
import { ViteMinifyPlugin } from "vite-plugin-minify";

export default defineConfig({
  base: "./",
  server: {
    host: true,
  },
  css: {
    postcss: {},
  },
  sourcemap: true,
  root: "src",

  plugins: [ViteMinifyPlugin({})],

  build: {
    outDir: "../dist",
    emptyOutDir: true,

    rollupOptions: {
      input: {
        index: "./src/index.html",
      },
      output: {
        assetFileNames: "assets/[name].[ext]",
        entryFileNames: "[name].js",
      },
    },
  },
});
