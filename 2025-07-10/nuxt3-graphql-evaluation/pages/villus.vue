<template>
  <div class="container">
    <h1>Villus 評価</h1>
    
    <div class="nav">
      <NuxtLink to="/">概要</NuxtLink>
      <NuxtLink to="/apollo-client">Apollo Client</NuxtLink>
      <NuxtLink to="/urql">URQL</NuxtLink>
      <NuxtLink to="/nuxt-apollo">Nuxt Apollo</NuxtLink>
      <NuxtLink to="/villus" class="active">Villus</NuxtLink>
      <NuxtLink to="/graphql-request">GraphQL Request</NuxtLink>
      <NuxtLink to="/comparison">比較結果</NuxtLink>
    </div>

    <div class="client-section">
      <h2>Villus とは</h2>
      <p>
        VillusはVue 3専用に設計された軽量なGraphQLクライアントライブラリです。
        Composition APIとの親和性が高く、Vue 3の機能を最大限に活用できます。
      </p>
      
      <div class="pros-cons">
        <div class="pros">
          <h4>メリット</h4>
          <ul>
            <li>Vue 3専用設計</li>
            <li>軽量（小さなバンドルサイズ）</li>
            <li>Composition API完全対応</li>
            <li>TypeScript対応</li>
            <li>プラグインシステム</li>
            <li>効率的なキャッシュ</li>
          </ul>
        </div>
        <div class="cons">
          <h4>デメリット</h4>
          <ul>
            <li>コミュニティが小さい</li>
            <li>ドキュメントが少ない</li>
            <li>エコシステムが限定的</li>
            <li>Vue専用（他フレームワーク不可）</li>
            <li>比較的新しい</li>
          </ul>
        </div>
      </div>
    </div>

    <div class="client-section">
      <h2>実装例</h2>
      
      <h3>1. クライアント設定</h3>
      <div class="code-block">
        <pre><code>// plugins/villus.client.ts
import { createClient, handleSubscriptions } from 'villus'

export default defineNuxtPlugin(() => {
  const client = createClient({
    url: useRuntimeConfig().public.graphqlEndpoint,
    // SSR対応
    use: [
      // プラグインの追加
      handleSubscriptions({
        forwardSubscriptions: true
      })
    ]
  })

  return {
    provide: {
      villusClient: client
    }
  }
})</code></pre>
      </div>
      
      <h3>2. Composable実装</h3>
      <div class="code-block">
        <pre><code>// composables/useVillus.ts
import { useQuery, useMutation, useSubscription } from 'villus'

export const useVillus = () => {
  const GET_USERS = `
    query GetUsers {
      users {
        id
        name
        email
      }
    }
  `

  const CREATE_USER = `
    mutation CreateUser($input: CreateUserInput!) {
      createUser(input: $input) {
        id
        name
        email
      }
    }
  `

  const queryUsers = () => useQuery({
    query: GET_USERS
  })

  const createUser = () => useMutation({
    query: CREATE_USER
  })

  return {
    GET_USERS,
    CREATE_USER,
    queryUsers,
    createUser
  }
}</code></pre>
      </div>
      
      <h3>3. コンポーネント内での使用</h3>
      <div class="code-block">
        <pre><code>// script setup内での使用例
&lt;script setup&gt;
const { queryUsers, createUser } = useVillus()

// クエリ実行
const { data: users, isFetching, error } = queryUsers()

// ミューテーション実行
const { execute: executeCreateUser } = createUser()

const handleCreateUser = async (input) => {
  try {
    const result = await executeCreateUser({ input })
    if (result.error) {
      throw result.error
    }
    return result.data.createUser
  } catch (error) {
    console.error('Error creating user:', error)
    throw error
  }
}
&lt;/script&gt;</code></pre>
      </div>
    </div>

    <div class="client-section">
      <h2>デモ実行</h2>
      <div class="data">
        <h3>クエリ実行結果</h3>
        <div v-if="pending">
          <p class="loading">Loading...</p>
        </div>
        <div v-else-if="error">
          <p class="error">Error: {{ error.message }}</p>
        </div>
        <div v-else>
          <p>
            <strong>Status:</strong> Villus設定完了<br>
            <strong>Cache:</strong> 効率的なキャッシュ<br>
            <strong>SSR:</strong> Vue 3対応<br>
            <strong>Note:</strong> 実際のGraphQLサーバーがないため、モックデータを表示
          </p>
          <div class="data">
            <pre>{{ JSON.stringify(mockData, null, 2) }}</pre>
          </div>
        </div>
      </div>
      
      <button @click="refetch" class="button" :disabled="pending">
        データ再取得
      </button>
    </div>

    <div class="client-section">
      <h2>パフォーマンス評価</h2>
      <div class="metrics">
        <div class="metric-card">
          <h3>バンドルサイズ</h3>
          <div class="metric-value">~5KB</div>
          <p>gzipped時（軽量）</p>
        </div>
        <div class="metric-card">
          <h3>初回レンダリング</h3>
          <div class="metric-value">優秀</div>
          <p>Vue 3最適化</p>
        </div>
        <div class="metric-card">
          <h3>キャッシュ効率</h3>
          <div class="metric-value">良好</div>
          <p>効率的なキャッシュ</p>
        </div>
        <div class="metric-card">
          <h3>TypeScript</h3>
          <div class="metric-value">完全対応</div>
          <p>型安全性確保</p>
        </div>
      </div>
    </div>

    <div class="client-section">
      <h2>推奨使用場面</h2>
      <ul>
        <li>Vue 3専用のアプリケーション</li>
        <li>軽量性とVue 3の機能を活用したい</li>
        <li>Composition APIを最大限に活用したい</li>
        <li>プラグインシステムを活用したい</li>
        <li>新しい技術に挑戦したい場合</li>
      </ul>
    </div>
  </div>
</template>

<script setup>
useHead({
  title: 'Villus 評価 - Nuxt 3 GraphQL',
  meta: [
    { name: 'description', content: 'Nuxt 3環境でのVillus評価と実装例' }
  ]
})

const mockData = {
  users: [
    { id: 1, name: 'Vue User', email: 'vue@example.com' },
    { id: 2, name: 'Villus User', email: 'villus@example.com' }
  ]
}

const pending = ref(false)
const error = ref(null)
const data = ref(mockData)

const refetch = async () => {
  pending.value = true
  error.value = null
  
  try {
    await new Promise(resolve => setTimeout(resolve, 700))
    
    if (Math.random() > 0.8) {
      throw new Error('Villus query failed')
    }
    
    data.value = {
      users: [
        ...mockData.users,
        { 
          id: Date.now(), 
          name: 'New Villus User', 
          email: 'newvillus@example.com' 
        }
      ]
    }
  } catch (err) {
    error.value = err
  } finally {
    pending.value = false
  }
}
</script>

<style scoped>
.nav a.active {
  background-color: #007acc;
  color: white;
}
</style>