<template>
  <div class="min-h-screen bg-gray-50">
    <header class="bg-white shadow">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-6">
          <div class="flex items-center">
            <h1 class="text-xl font-bold text-gray-900">
              Nuxt 4 + Pinia Latest Verification
            </h1>
          </div>
          
          <nav class="flex items-center space-x-4">
            <div v-if="authStore.isLoggedIn" class="flex items-center space-x-4">
              <span class="text-sm text-gray-700">
                Welcome, {{ authStore.user?.username }}
                <span 
                  :class="[
                    'ml-2 px-2 py-1 rounded-full text-xs font-medium',
                    authStore.isPaidUser 
                      ? 'bg-yellow-100 text-yellow-800' 
                      : 'bg-gray-100 text-gray-800'
                  ]"
                >
                  {{ authStore.user?.role === 'paid' ? 'Premium' : 'Free' }}
                </span>
              </span>
              <UButton 
                @click="authStore.logout"
                variant="outline"
                size="sm"
              >
                Logout
              </UButton>
            </div>
            
            <div v-else>
              <span class="text-sm text-gray-700">Not logged in</span>
            </div>
          </nav>
        </div>
      </div>
    </header>

    <!-- Premium Banner for Paid Users -->
    <div 
      v-if="authStore.isPaidUser" 
      class="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white"
    >
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div class="flex items-center justify-center">
          <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
          </svg>
          <span class="font-medium">
            🎉 Premium User - You have access to all exclusive features!
          </span>
        </div>
      </div>
    </div>

    <main>
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'

const authStore = useAuthStore()

// Initialize auth state on client-side mount
onMounted(() => {
  authStore.initializeAuth()
})
</script>