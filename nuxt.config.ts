import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-05-15",
  devtools: { enabled: true },
  css: ["~/assets/css/tailwind.css"],
  modules: [
    "@nuxt/eslint",
    "@nuxt/fonts",
    "@nuxt/icon",
    "@nuxt/image",
    "shadcn-nuxt",
    "@pinia/nuxt",
  ],
  // Plugin untuk WebSocket
  plugins: ["~/plugins/socket.client.ts", "~/plugins/auth-token.ts"],
  // Runtime config untuk WebSocket endpoints
  runtimeConfig: {
    public: {
      apiUrl: process.env.API_URL || "http://localhost:3001/api",
      wsUrl: process.env.WS_URL || "http://localhost:3001/",
      // WebSocket namespaces sesuai dengan backend
      callNamespace: "/call",
      displayNamespace: "/display",
    },
  },
  // SSR configuration for WebSocket
  ssr: true,
  // Nitro configuration untuk development
  nitro: {
    devProxy: {
      "/api": {
        target: "http://localhost:3001", // backend NestJS
        changeOrigin: true,
      },
      "/socket.io/": {
        target: "ws://localhost:3001/socket.io/",
        ws: true,
      },
    },
  },
  vite: {
    plugins: [tailwindcss()],
    server: {
      hmr: {
        port: 24678,
      },
    },
  },

  // Build configuration
  build: {
    transpile: ["socket.io-client"],
  },

  shadcn: {
    /**
     * Prefix for all the imported component
     */
    prefix: "",
    /**
     * Directory that the component lives in.
     * @default "./components/ui"
     */
    componentDir: "./components/ui",
  },
});
