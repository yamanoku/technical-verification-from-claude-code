import { defineStore } from 'pinia'

export interface User {
  id: string
  username: string
  email: string
  role: 'free' | 'paid'
}

export interface AuthState {
  user: User | null
  isLoggedIn: boolean
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    isLoggedIn: false
  }),

  getters: {
    isPaidUser: (state): boolean => {
      return state.user?.role === 'paid'
    },
    
    isFreeUser: (state): boolean => {
      return state.user?.role === 'free'
    },
    
    currentUser: (state): User | null => {
      return state.user
    }
  },

  actions: {
    login(username: string, userType: 'free' | 'paid' = 'free') {
      // Simulate login with different user types
      this.user = {
        id: Math.random().toString(36).substr(2, 9),
        username,
        email: `${username}@example.com`,
        role: userType
      }
      this.isLoggedIn = true
      
      // Persist to localStorage for SSR hydration
      if (process.client) {
        localStorage.setItem('auth-user', JSON.stringify(this.user))
        localStorage.setItem('auth-logged-in', 'true')
      }
    },

    logout() {
      this.user = null
      this.isLoggedIn = false
      
      // Clear localStorage
      if (process.client) {
        localStorage.removeItem('auth-user')
        localStorage.removeItem('auth-logged-in')
      }
    },

    // Initialize from localStorage on client-side
    initializeAuth() {
      if (process.client) {
        const storedUser = localStorage.getItem('auth-user')
        const isLoggedIn = localStorage.getItem('auth-logged-in')
        
        if (storedUser && isLoggedIn === 'true') {
          this.user = JSON.parse(storedUser)
          this.isLoggedIn = true
        }
      }
    }
  }
})