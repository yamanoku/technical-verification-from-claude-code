<template>
  <div>
    <Html lang="ja">
      <Head>
        <Meta charset="utf-8" />
        <Meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta name="format-detection" content="telephone=no" />
        <Title>Nuxt 4 + Pinia SSR検証</Title>
        <Meta name="description" content="Nuxt 4の新機能とPiniaの互換性をSSR環境で検証するデモアプリケーション" />
      </Head>
    </Html>
    
    <NuxtPage />
  </div>
</template>

<script setup lang="ts">
// Global app configuration
useHead({
  titleTemplate: '%s | Nuxt 4 Pinia Verification',
  meta: [
    { name: 'author', content: 'Claude Code' },
    { name: 'robots', content: 'noindex, nofollow' }, // Demo app
  ],
  link: [
    {
      rel: 'preconnect',
      href: 'https://fonts.googleapis.com'
    },
    {
      rel: 'preconnect',
      href: 'https://fonts.gstatic.com',
      crossorigin: ''
    },
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap'
    }
  ]
})
</script>