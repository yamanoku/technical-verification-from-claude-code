export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    '@pinia/nuxt',
    '@nuxt/ui'
  ],
  css: ['~/assets/css/main.css'],
  ssr: true
})