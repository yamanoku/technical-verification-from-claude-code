// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  
  // SSR設定
  ssr: true,
  
  // CSS設定
  css: ['~/assets/css/main.css'],
  
  // Apollo設定（@nuxtjs/apolloを使用する場合）
  apollo: {
    clients: {
      default: {
        httpEndpoint: process.env.GRAPHQL_ENDPOINT || 'http://localhost:4000/graphql',
        // SSR時の設定
        ssrMode: true,
        // 認証等が必要な場合の設定例
        httpLinkOptions: {
          headers: {
            // 'Authorization': `Bearer ${process.env.AUTH_TOKEN}`,
          }
        }
      }
    }
  },
  
  // 環境変数設定
  runtimeConfig: {
    public: {
      graphqlEndpoint: process.env.GRAPHQL_ENDPOINT || 'http://localhost:4000/graphql'
    }
  },
  
  // モジュール設定
  modules: [
    // '@nuxtjs/apollo' // 必要に応じてコメントアウト
  ]
})