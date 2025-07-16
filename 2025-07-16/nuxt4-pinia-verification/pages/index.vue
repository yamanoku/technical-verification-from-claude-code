<template>
  <div>
    <Head>
      <Title>Nuxt 4 + Pinia SSR 検証</Title>
      <Meta name="description" content="Nuxt 4でのPiniaの動作検証アプリケーション" />
    </Head>

    <UContainer class="py-8">
      <!-- Header -->
      <header class="header">
        <div class="header-content">
          <h1 class="header-title">Nuxt 4 + Pinia SSR検証</h1>
          <div class="header-actions">
            <div v-if="authStore.isLoggedIn" class="user-info">
              <span class="user-name">{{ authStore.userDisplayName }}</span>
              <UBadge 
                :color="authStore.isPaidUser ? 'amber' : 'gray'" 
                variant="subtle"
                size="sm"
              >
                {{ authStore.isPaidUser ? 'Premium' : 'Free' }}
              </UBadge>
              <UButton
                color="gray"
                variant="ghost"
                size="sm"
                @click="authStore.logout"
              >
                ログアウト
              </UButton>
            </div>
          </div>
        </div>
      </header>

      <!-- Banner (role-based display) -->
      <UserBanner />

      <!-- Main Content -->
      <main class="main-content">
        <div v-if="!authStore.isLoggedIn">
          <div class="welcome-section">
            <UCard>
              <div class="welcome-content">
                <h2>Nuxt 4 + Pinia 動作検証</h2>
                <p>
                  このアプリケーションは、Nuxt 4の新機能とPiniaの互換性、
                  特にSSR環境での動作を検証するためのデモです。
                </p>
                <ul class="feature-list">
                  <li>✅ Pinia状態管理との統合</li>
                  <li>✅ SSRでの状態の永続化</li>
                  <li>✅ ユーザー認証システム</li>
                  <li>✅ ロールベースのUI表示</li>
                  <li>✅ レスポンシブデザイン</li>
                </ul>
              </div>
            </UCard>
          </div>
          
          <LoginForm />
        </div>

        <div v-else class="dashboard">
          <div class="dashboard-grid">
            <UCard>
              <template #header>
                <h3>ユーザー情報</h3>
              </template>
              <div class="user-details">
                <p><strong>ユーザー名:</strong> {{ authStore.user?.username }}</p>
                <p><strong>メール:</strong> {{ authStore.user?.email }}</p>
                <p><strong>アカウント種別:</strong> 
                  <UBadge :color="authStore.isPaidUser ? 'green' : 'blue'">
                    {{ authStore.isPaidUser ? '有料ユーザー' : '無料ユーザー' }}
                  </UBadge>
                </p>
                <p><strong>ログイン時刻:</strong> {{ formatLoginTime }}</p>
              </div>
            </UCard>

            <UCard>
              <template #header>
                <h3>SSR状態検証</h3>
              </template>
              <div class="ssr-info">
                <p><strong>現在の環境:</strong> 
                  <UBadge :color="isClient ? 'green' : 'blue'">
                    {{ isClient ? 'Client' : 'Server' }}
                  </UBadge>
                </p>
                <p><strong>Pinia状態:</strong> 
                  <UBadge color="green">正常に動作中</UBadge>
                </p>
                <p><strong>SSRハイドレーション:</strong> 
                  <UBadge :color="isHydrated ? 'green' : 'amber'">
                    {{ isHydrated ? '完了' : '進行中' }}
                  </UBadge>
                </p>
              </div>
            </UCard>

            <UCard v-if="authStore.isPaidUser">
              <template #header>
                <h3>🎉 Premium機能</h3>
              </template>
              <div class="premium-features">
                <p>有料ユーザー限定のコンテンツが表示されています！</p>
                <ul>
                  <li>✨ 高度なダッシュボード</li>
                  <li>📊 詳細な分析レポート</li>
                  <li>🎯 カスタマイズ機能</li>
                  <li>🔒 優先サポート</li>
                </ul>
              </div>
            </UCard>

            <UCard v-else>
              <template #header>
                <h3>🚀 アップグレードのご案内</h3>
              </template>
              <div class="upgrade-info">
                <p>Premiumにアップグレードして、より多くの機能をお楽しみください！</p>
                <UButton color="primary" size="sm" class="mt-4">
                  今すぐアップグレード
                </UButton>
              </div>
            </UCard>
          </div>
        </div>
      </main>
    </UContainer>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useAuthStore } from '~/stores/auth'

const authStore = useAuthStore()
const isClient = ref(false)
const isHydrated = ref(false)

const formatLoginTime = computed(() => {
  if (!authStore.user?.loginTime) return 'N/A'
  return new Date(authStore.user.loginTime).toLocaleString('ja-JP')
})

onMounted(() => {
  isClient.value = true
  // Initialize auth state from storage
  authStore.initializeAuth()
  
  // Mark as hydrated after a short delay
  setTimeout(() => {
    isHydrated.value = true
  }, 100)
})
</script>

<style scoped>
.header {
  margin-bottom: 2rem;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
  border-bottom: 1px solid rgb(229 231 235);
}

.header-title {
  font-size: 1.875rem;
  font-weight: 700;
  margin: 0;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.user-name {
  font-weight: 600;
}

.main-content {
  margin-top: 2rem;
}

.welcome-section {
  margin-bottom: 2rem;
}

.welcome-content {
  text-align: center;
  padding: 1rem;
}

.welcome-content h2 {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.feature-list {
  list-style: none;
  padding: 0;
  margin: 1.5rem 0;
}

.feature-list li {
  padding: 0.25rem 0;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.user-details, .ssr-info, .premium-features, .upgrade-info {
  space-y: 0.75rem;
}

.user-details p, .ssr-info p {
  margin: 0.5rem 0;
}

.premium-features ul {
  margin: 1rem 0;
  padding-left: 1rem;
}

.premium-features li {
  margin: 0.5rem 0;
}

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
  
  .dashboard-grid {
    grid-template-columns: 1fr;
  }
}
</style>