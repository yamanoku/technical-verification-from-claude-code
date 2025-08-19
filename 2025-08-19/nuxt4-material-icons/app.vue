<template>
  <div class="min-h-screen bg-gray-100">
    <NuxtPage />
  </div>
</template>

<script setup>
// アプリのメタデータ設定
useHead({
  title: 'Nuxt 4 × Material Design Icons 検証',
  meta: [
    { name: 'description', content: '@material-design-icons/svgパッケージのNuxt 4での動作検証' }
  ]
})
</script>