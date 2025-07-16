<template>
  <div v-if="authStore.shouldShowBanner" class="banner-container">
    <div class="banner premium-banner">
      <div class="banner-content">
        <div class="banner-icon">👑</div>
        <div class="banner-text">
          <h3>Premium Member</h3>
          <p>Welcome back, {{ authStore.userDisplayName }}! You have access to exclusive features.</p>
        </div>
        <div class="banner-actions">
          <UButton 
            color="white" 
            variant="solid" 
            size="sm"
            label="Explore Premium Features"
          />
        </div>
      </div>
    </div>
  </div>
  <div v-else-if="authStore.isLoggedIn && !authStore.isPaidUser" class="banner-container">
    <div class="banner free-banner">
      <div class="banner-content">
        <div class="banner-icon">🚀</div>
        <div class="banner-text">
          <h3>Upgrade to Premium</h3>
          <p>Unlock exclusive features and get the most out of your experience!</p>
        </div>
        <div class="banner-actions">
          <UButton 
            color="primary" 
            variant="solid" 
            size="sm"
            label="Upgrade Now"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'

const authStore = useAuthStore()
</script>

<style scoped>
.banner-container {
  margin-bottom: 1rem;
}

.banner {
  border-radius: 12px;
  padding: 1rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.banner:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px -5px rgba(0, 0, 0, 0.1);
}

.premium-banner {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.free-banner {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
}

.banner-content {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.banner-icon {
  font-size: 2rem;
  flex-shrink: 0;
}

.banner-text {
  flex: 1;
}

.banner-text h3 {
  margin: 0 0 0.25rem 0;
  font-size: 1.125rem;
  font-weight: 600;
}

.banner-text p {
  margin: 0;
  opacity: 0.9;
  font-size: 0.875rem;
}

.banner-actions {
  flex-shrink: 0;
}

@media (max-width: 768px) {
  .banner-content {
    flex-direction: column;
    text-align: center;
    gap: 0.75rem;
  }
  
  .banner-actions {
    width: 100%;
  }
}
</style>