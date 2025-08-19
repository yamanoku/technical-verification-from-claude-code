// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  
  modules: [
    '@nuxtjs/tailwindcss'
  ],
  
  css: [
    '~/assets/css/main.css'
  ],

  compatibilityDate: '2024-04-03'
})