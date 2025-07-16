import { defineStore } from 'pinia'

export interface User {
  id: string
  username: string
  email: string
  isPaidUser: boolean
  loginTime: Date
}

interface AuthState {
  user: User | null
  isLoggedIn: boolean
  isLoading: boolean
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    isLoggedIn: false,
    isLoading: false
  }),

  getters: {
    isPaidUser: (state) => state.user?.isPaidUser ?? false,
    userDisplayName: (state) => state.user?.username ?? 'Guest',
    shouldShowBanner: (state) => state.isLoggedIn && (state.user?.isPaidUser ?? false)
  },

  actions: {
    async login(username: string, password: string): Promise<boolean> {
      this.isLoading = true
      
      try {
        // Simulate API call with different user types
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Mock user data based on username
        const isPaid = username.includes('paid') || username.includes('premium')
        
        this.user = {
          id: `user_${Date.now()}`,
          username,
          email: `${username}@example.com`,
          isPaidUser: isPaid,
          loginTime: new Date()
        }
        
        this.isLoggedIn = true
        
        // Persist login state (in real app, this would be handled by cookies/tokens)
        if (import.meta.client) {
          localStorage.setItem('user', JSON.stringify(this.user))
          localStorage.setItem('isLoggedIn', 'true')
        }
        
        return true
      } catch (error) {
        console.error('Login failed:', error)
        return false
      } finally {
        this.isLoading = false
      }
    },

    logout() {
      this.user = null
      this.isLoggedIn = false
      
      if (import.meta.client) {
        localStorage.removeItem('user')
        localStorage.removeItem('isLoggedIn')
      }
    },

    // Initialize auth state from storage (for SSR hydration)
    initializeAuth() {
      if (import.meta.client) {
        const savedUser = localStorage.getItem('user')
        const savedLoginState = localStorage.getItem('isLoggedIn')
        
        if (savedUser && savedLoginState === 'true') {
          this.user = JSON.parse(savedUser)
          this.isLoggedIn = true
        }
      }
    }
  }
})