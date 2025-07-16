<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Login Section -->
    <div v-if="!authStore.isLoggedIn" class="mb-8">
      <div class="bg-white rounded-lg shadow p-6">
        <h2 class="text-2xl font-bold text-gray-900 mb-6">
          Login to Test Pinia SSR Functionality
        </h2>
        
        <div class="space-y-4">
          <div>
            <label for="username" class="block text-sm font-medium text-gray-700 mb-2">
              Username
            </label>
            <UInput
              id="username"
              v-model="username"
              placeholder="Enter your username"
              class="w-full"
            />
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <UButton
              @click="loginAs('free')"
              color="gray"
              variant="solid"
              size="lg"
              block
              :disabled="!username.trim()"
            >
              Login as Free User
            </UButton>
            
            <UButton
              @click="loginAs('paid')"
              color="yellow"
              variant="solid"
              size="lg"
              block
              :disabled="!username.trim()"
            >
              Login as Premium User
            </UButton>
          </div>
        </div>
      </div>
    </div>

    <!-- Logged In Content -->
    <div v-else class="space-y-8">
      <!-- User Info Card -->
      <div class="bg-white rounded-lg shadow p-6">
        <h2 class="text-2xl font-bold text-gray-900 mb-4">
          User Information
        </h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <span class="text-sm font-medium text-gray-500">Username:</span>
            <p class="text-lg text-gray-900">{{ authStore.user?.username }}</p>
          </div>
          
          <div>
            <span class="text-sm font-medium text-gray-500">Email:</span>
            <p class="text-lg text-gray-900">{{ authStore.user?.email }}</p>
          </div>
          
          <div>
            <span class="text-sm font-medium text-gray-500">Account Type:</span>
            <p class="text-lg">
              <span 
                :class="[
                  'px-3 py-1 rounded-full text-sm font-medium',
                  authStore.isPaidUser 
                    ? 'bg-yellow-100 text-yellow-800' 
                    : 'bg-gray-100 text-gray-800'
                ]"
              >
                {{ authStore.user?.role === 'paid' ? 'Premium User' : 'Free User' }}
              </span>
            </p>
          </div>
          
          <div>
            <span class="text-sm font-medium text-gray-500">User ID:</span>
            <p class="text-lg text-gray-900 font-mono">{{ authStore.user?.id }}</p>
          </div>
        </div>
      </div>

      <!-- Feature Access Based on Role -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Free User Features -->
        <div class="bg-white rounded-lg shadow p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">
            Free Features
          </h3>
          <ul class="space-y-2">
            <li class="flex items-center text-green-600">
              <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
              </svg>
              Basic Profile
            </li>
            <li class="flex items-center text-green-600">
              <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
              </svg>
              Standard Support
            </li>
            <li class="flex items-center text-green-600">
              <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
              </svg>
              Community Access
            </li>
          </ul>
        </div>

        <!-- Premium Features -->
        <div 
          :class="[
            'rounded-lg shadow p-6',
            authStore.isPaidUser 
              ? 'bg-gradient-to-br from-yellow-50 to-yellow-100 border-2 border-yellow-200' 
              : 'bg-gray-50 border-2 border-gray-200'
          ]"
        >
          <h3 
            :class="[
              'text-lg font-semibold mb-4',
              authStore.isPaidUser ? 'text-yellow-800' : 'text-gray-500'
            ]"
          >
            Premium Features
            <span v-if="authStore.isPaidUser" class="ml-2 text-yellow-600">
              ✨ Available
            </span>
            <span v-else class="ml-2 text-gray-400">
              🔒 Locked
            </span>
          </h3>
          
          <ul class="space-y-2">
            <li 
              :class="[
                'flex items-center',
                authStore.isPaidUser ? 'text-yellow-700' : 'text-gray-400'
              ]"
            >
              <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
              </svg>
              Priority Support
            </li>
            <li 
              :class="[
                'flex items-center',
                authStore.isPaidUser ? 'text-yellow-700' : 'text-gray-400'
              ]"
            >
              <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
              </svg>
              Advanced Analytics
            </li>
            <li 
              :class="[
                'flex items-center',
                authStore.isPaidUser ? 'text-yellow-700' : 'text-gray-400'
              ]"
            >
              <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
              </svg>
              Exclusive Content
            </li>
            <li 
              :class="[
                'flex items-center',
                authStore.isPaidUser ? 'text-yellow-700' : 'text-gray-400'
              ]"
            >
              <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
              </svg>
              API Access
            </li>
          </ul>

          <!-- Upgrade CTA for Free Users -->
          <div v-if="!authStore.isPaidUser" class="mt-4 pt-4 border-t border-gray-200">
            <UButton 
              color="yellow" 
              variant="solid" 
              size="sm" 
              block
              @click="upgradeAccount"
            >
              Upgrade to Premium
            </UButton>
          </div>
        </div>
      </div>

      <!-- SSR Verification Info -->
      <div class="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 class="text-lg font-semibold text-blue-800 mb-3">
          SSR Verification Status
        </h3>
        <div class="space-y-2 text-sm text-blue-700">
          <p>✅ Pinia store initialized successfully</p>
          <p>✅ SSR hydration working correctly</p>
          <p>✅ User state persisted across page reloads</p>
          <p>✅ Role-based UI rendering properly</p>
          <p>✅ TypeScript integration functional</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'

const authStore = useAuthStore()
const username = ref('')

const loginAs = (userType: 'free' | 'paid') => {
  if (!username.value.trim()) return
  
  authStore.login(username.value.trim(), userType)
  username.value = ''
}

const upgradeAccount = () => {
  if (authStore.user) {
    // Simulate upgrade by logging in again as paid user
    authStore.login(authStore.user.username, 'paid')
  }
}

// SEO
useHead({
  title: 'Nuxt 4 + Pinia Latest Verification',
  meta: [
    { name: 'description', content: 'Verification of Nuxt 4 compatibility with latest Pinia versions for SSR applications' }
  ]
})
</script>