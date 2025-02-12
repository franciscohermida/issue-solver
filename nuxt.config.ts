// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  // https://nuxt.com/modules
  modules: ["@nuxthub/core", "@nuxt/eslint", "@nuxtjs/tailwindcss"],

  // https://devtools.nuxt.com
  devtools: { enabled: true },

  // Env variables - https://nuxt.com/docs/getting-started/configuration#environment-variables-and-private-tokens
  runtimeConfig: {
    googleAiApiKey: process.env.GOOGLE_AI_API_KEY,
    githubToken: process.env.GITHUB_TOKEN,
    public: {
      // Can be overridden by NUXT_PUBLIC_HELLO_TEXT environment variable
      helloText: "Hello from the Edge 👋",
    },
  },
  // https://nuxt.com/docs/getting-started/upgrade#testing-nuxt-4
  future: { compatibilityVersion: 4 },
  compatibilityDate: "2024-07-30",

  // https://hub.nuxt.com/docs/getting-started/installation#options
  hub: {
    kv: true,
  },
});
