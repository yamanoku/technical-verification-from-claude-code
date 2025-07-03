<template>
  <div>
    <h1>Simple Scope + Nuxt SSR Test</h1>
    
    <div class="test-section">
      <h2>Basic Scope Test</h2>
      <p>Scope ID: <code>{{ scopeId }}</code></p>
      <p>Generated at: {{ generatedAt }}</p>
    </div>

    <div class="test-section">
      <h2>Multiple Scopes Test</h2>
      <div v-for="(id, index) in multipleIds" :key="index">
        <p>Scope {{ index + 1 }}: <code>{{ id }}</code></p>
      </div>
    </div>

    <div class="test-section">
      <h2>Client-side Re-generation Test</h2>
      <button @click="regenerateId">Regenerate ID</button>
      <p>New ID: <code>{{ clientGeneratedId }}</code></p>
    </div>

    <div class="test-section">
      <h2>Hydration Mismatch Detection</h2>
      <p class="warning">
        If you see hydration warnings in the console, Simple Scope is causing SSR/CSR mismatches.
      </p>
      <p>Server rendered: {{ isServer ? 'Yes' : 'No' }}</p>
      <p>Client hydrated: {{ isClient ? 'Yes' : 'No' }}</p>
    </div>
  </div>
</template>

<script setup>
// Import Simple Scope
// Note: This will likely cause hydration errors due to different IDs on server/client
let scopeId = ref('')
let generatedAt = ref('')
let multipleIds = ref([])
let clientGeneratedId = ref('')

// Check if we're on server or client
const isServer = process.server
const isClient = process.client

onMounted(async () => {
  // Dynamic import to avoid SSR issues during initial load
  const { scope } = await import('@simple-stack/scope')
  
  // Generate initial scope ID
  scopeId.value = scope()
  generatedAt.value = new Date().toISOString()
  
  // Generate multiple IDs to test consistency
  multipleIds.value = Array.from({ length: 3 }, () => scope())
})

// Server-side generation (this will likely cause hydration mismatch)
if (process.server) {
  try {
    // Attempt to import and use Simple Scope on server
    // This may fail or produce different results than client
    const { scope } = await import('@simple-stack/scope')
    scopeId.value = scope()
    generatedAt.value = new Date().toISOString()
    multipleIds.value = Array.from({ length: 3 }, () => scope())
  } catch (error) {
    console.error('Server-side Simple Scope error:', error)
    scopeId.value = 'SERVER_ERROR'
    generatedAt.value = 'SERVER_ERROR'
    multipleIds.value = ['SERVER_ERROR']
  }
}

const regenerateId = async () => {
  const { scope } = await import('@simple-stack/scope')
  clientGeneratedId.value = scope()
}
</script>

<style scoped>
.test-section {
  margin: 2rem 0;
  padding: 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
}

.warning {
  color: #d73527;
  font-weight: bold;
}

code {
  background: #f4f4f4;
  padding: 2px 4px;
  border-radius: 3px;
  font-family: monospace;
}

button {
  background: #007bff;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background: #0056b3;
}
</style>