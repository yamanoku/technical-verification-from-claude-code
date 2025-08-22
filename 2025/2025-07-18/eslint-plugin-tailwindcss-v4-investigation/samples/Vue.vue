<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Test Vue reactive classes -->
    <div 
      :class="[
        'p-4 rounded transition-all duration-300',
        isActive ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-800',
        {
          'shadow-lg': isHovered,
          'scale-105': isHovered
        }
      ]"
      @mouseenter="isHovered = true"
      @mouseleave="isHovered = false"
    >
      Reactive Vue component with dynamic classes
    </div>

    <!-- Test v-bind:class patterns -->
    <button 
      :class="buttonClasses"
      @click="toggleActive"
    >
      Toggle State ({{ isActive ? 'Active' : 'Inactive' }})
    </button>

    <!-- Test Vue directives with Tailwind -->
    <div v-if="showContent" class="mt-4 p-4 bg-blue-100 border-l-4 border-blue-500">
      <p class="text-blue-700">This content is conditionally shown</p>
    </div>

    <!-- Test v-for with Tailwind classes -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
      <div 
        v-for="(item, index) in items" 
        :key="index"
        class="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow"
      >
        <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ item.title }}</h3>
        <p class="text-gray-600">{{ item.description }}</p>
        <div class="flex flex-wrap gap-2 mt-3">
          <span 
            v-for="tag in item.tags"
            :key="tag"
            class="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full"
          >
            {{ tag }}
          </span>
        </div>
      </div>
    </div>

    <!-- Test form with Vue and Tailwind -->
    <form @submit.prevent="handleSubmit" class="mt-8 space-y-4 max-w-md">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">
          Name
        </label>
        <input 
          v-model="form.name"
          type="text"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          :class="{ 'border-red-500': errors.name }"
        />
        <p v-if="errors.name" class="mt-1 text-sm text-red-600">{{ errors.name }}</p>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">
          Email
        </label>
        <input 
          v-model="form.email"
          type="email"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          :class="{ 'border-red-500': errors.email }"
        />
        <p v-if="errors.email" class="mt-1 text-sm text-red-600">{{ errors.email }}</p>
      </div>

      <button 
        type="submit"
        :disabled="isSubmitting"
        class="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {{ isSubmitting ? 'Submitting...' : 'Submit' }}
      </button>
    </form>

    <!-- Test problematic patterns that should trigger ESLint rules -->
    <div class="mt-8 space-y-4">
      <div class="p-4 bg-red-500 bg-blue-500 text-white">
        Contradicting backgrounds (should be flagged)
      </div>

      <div class="margin-top-4 margin-bottom-4 padding-left-6 padding-right-6">
        Non-shorthand spacing (should be flagged)
      </div>

      <div class="text-[red] bg-[blue] p-[16px]">
        Unnecessary arbitrary values (should be flagged)
      </div>

      <div class="px-4 bg-yellow-500 py-2 text-white">
        Unordered classes (should be flagged)
      </div>
    </div>

    <!-- Test advanced Vue patterns -->
    <transition 
      enter-active-class="transition ease-out duration-300"
      enter-from-class="opacity-0 transform scale-95"
      enter-to-class="opacity-100 transform scale-100"
      leave-active-class="transition ease-in duration-200"
      leave-from-class="opacity-100 transform scale-100"
      leave-to-class="opacity-0 transform scale-95"
    >
      <div 
        v-if="showTransition"
        class="mt-4 p-4 bg-gradient-to-r from-pink-500 to-violet-500 text-white rounded-lg"
      >
        Animated content with Vue transitions
      </div>
    </transition>

    <button 
      @click="showTransition = !showTransition"
      class="mt-2 px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors"
    >
      Toggle Transition
    </button>
  </div>
</template>

<script>
export default {
  name: 'TailwindVueTest',
  data() {
    return {
      isActive: false,
      isHovered: false,
      showContent: true,
      showTransition: false,
      isSubmitting: false,
      form: {
        name: '',
        email: ''
      },
      errors: {},
      items: [
        {
          title: 'Vue Component',
          description: 'Testing Tailwind CSS with Vue components',
          tags: ['vue', 'tailwind', 'frontend']
        },
        {
          title: 'Reactive Styling',
          description: 'Dynamic classes based on component state',
          tags: ['reactive', 'css', 'javascript']
        },
        {
          title: 'Form Validation',
          description: 'Conditional styling for form validation',
          tags: ['forms', 'validation', 'ux']
        }
      ]
    }
  },
  computed: {
    buttonClasses() {
      return [
        'px-6 py-3 rounded-lg font-semibold transition-all duration-200',
        this.isActive 
          ? 'bg-green-500 text-white hover:bg-green-600' 
          : 'bg-gray-500 text-white hover:bg-gray-600'
      ]
    }
  },
  methods: {
    toggleActive() {
      this.isActive = !this.isActive
      this.showContent = !this.showContent
    },
    
    handleSubmit() {
      this.errors = {}
      
      if (!this.form.name) {
        this.errors.name = 'Name is required'
      }
      
      if (!this.form.email) {
        this.errors.email = 'Email is required'
      } else if (!this.isValidEmail(this.form.email)) {
        this.errors.email = 'Please enter a valid email'
      }
      
      if (Object.keys(this.errors).length === 0) {
        this.isSubmitting = true
        setTimeout(() => {
          this.isSubmitting = false
          alert('Form submitted successfully!')
        }, 2000)
      }
    },
    
    isValidEmail(email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return emailRegex.test(email)
    }
  }
}
</script>

<style scoped>
/* Custom styles if needed */
</style>