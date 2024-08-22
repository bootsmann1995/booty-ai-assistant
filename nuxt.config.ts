// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",
  devtools: { enabled: true },
  runtimeConfig: {
    API_KEY: process.env.API_KEY,
    public: {
      SUPABASE_URL: process.env.SUPABASE_URL,
      SUPABASE_KEY: process.env.SUPABASE_KEY,
    },
  },

  hub: {
    database: true,
  },

  modules: ["@nuxtjs/supabase", "@formkit/nuxt"],
  supabase: {
    redirect: false,
  },
});
