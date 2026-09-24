import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { federation } from "@module-federation/vite";

export default defineConfig({
  plugins: [
    react(),

    federation({
      name: "smartcart_recommendations",

      filename: "remoteEntry.js",

      exposes: {
        "./RecommendationsWidget":
          "./src/components/RecommendationsWidget.jsx",
      },

      dts: false,

      shared: {
        react: {
          singleton: true,
          requiredVersion: false,
        },

        "react-dom": {
          singleton: true,
          requiredVersion: false,
        },
      },
    }),
  ],

  build: {
    target: "chrome89",
    modulePreload: false,
    minify: false,
    cssCodeSplit: false,
  },

  server: {
    port: 4173,
    strictPort: true,
  },

  preview: {
    port: 4173,
    strictPort: true,
  },
});