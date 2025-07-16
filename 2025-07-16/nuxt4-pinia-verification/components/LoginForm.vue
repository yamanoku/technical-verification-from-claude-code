<template>
  <div class="login-container">
    <UCard class="login-card">
      <template #header>
        <h2 class="login-title">ログイン</h2>
        <p class="login-subtitle">アカウントにサインインしてください</p>
      </template>

      <form @submit.prevent="handleLogin" class="login-form">
        <UFormGroup label="ユーザー名" required>
          <UInput
            v-model="username"
            placeholder="ユーザー名を入力"
            :disabled="authStore.isLoading"
            size="lg"
          />
        </UFormGroup>

        <UFormGroup label="パスワード" required>
          <UInput
            v-model="password"
            type="password"
            placeholder="パスワードを入力"
            :disabled="authStore.isLoading"
            size="lg"
          />
        </UFormGroup>

        <div class="demo-info">
          <UAlert
            icon="i-heroicons-information-circle"
            color="blue"
            variant="soft"
            title="デモ用アカウント"
            description="テスト用: 'paid_user' で有料ユーザー、'free_user' で無料ユーザーとしてログインできます"
          />
        </div>

        <UButton
          type="submit"
          color="primary"
          variant="solid"
          size="lg"
          block
          :loading="authStore.isLoading"
          :disabled="!username || !password"
        >
          {{ authStore.isLoading ? 'ログイン中...' : 'ログイン' }}
        </UButton>
      </form>

      <div v-if="loginError" class="error-message">
        <UAlert
          icon="i-heroicons-exclamation-triangle"
          color="red"
          variant="soft"
          :title="loginError"
        />
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '~/stores/auth'

const authStore = useAuthStore()
const username = ref('')
const password = ref('')
const loginError = ref('')

const handleLogin = async () => {
  loginError.value = ''
  
  const success = await authStore.login(username.value, password.value)
  
  if (!success) {
    loginError.value = 'ログインに失敗しました。ユーザー名とパスワードを確認してください。'
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
  padding: 2rem;
}

.login-card {
  width: 100%;
  max-width: 400px;
}

.login-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
  text-align: center;
}

.login-subtitle {
  color: rgb(107 114 128);
  font-size: 0.875rem;
  margin: 0.5rem 0 0 0;
  text-align: center;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.demo-info {
  margin: 1rem 0;
}

.error-message {
  margin-top: 1rem;
}
</style>