// https://nuxt.com/docs/api/configuration/nuxt-config
import svgLoader from 'vite-svg-loader'

export default defineNuxtConfig({
  devtools: { enabled: true },
  
  modules: [
    '@nuxtjs/tailwindcss'
  ],
  
  css: [
    '~/assets/css/main.css'
  ],

  vite: {
    plugins: [
      svgLoader()
    ]
  },

  compatibilityDate: '2024-04-03'
})