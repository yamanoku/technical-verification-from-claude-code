export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    '@pinia/nuxt',
    '@nuxt/ui'
  ],
  ssr: true, // Ensure SSR is enabled for verification
  pinia: {
    storesDirs: ['./stores/**']
  },
  css: ['~/assets/css/main.css']
})