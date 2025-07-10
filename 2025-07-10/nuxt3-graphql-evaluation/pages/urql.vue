<template>
  <div class="container">
    <h1>URQL 評価</h1>
    
    <div class="nav">
      <NuxtLink to="/">概要</NuxtLink>
      <NuxtLink to="/apollo-client">Apollo Client</NuxtLink>
      <NuxtLink to="/urql" class="active">URQL</NuxtLink>
      <NuxtLink to="/nuxt-apollo">Nuxt Apollo</NuxtLink>
      <NuxtLink to="/villus">Villus</NuxtLink>
      <NuxtLink to="/graphql-request">GraphQL Request</NuxtLink>
      <NuxtLink to="/comparison">比較結果</NuxtLink>
    </div>

    <div class="client-section">
      <h2>URQL とは</h2>
      <p>
        URLは軽量で高性能なGraphQLクライアントライブラリで、
        モダンなアーキテクチャとVue 3のComposition APIに最適化されています。
      </p>
      
      <div class="pros-cons">
        <div class="pros">
          <h4>メリット</h4>
          <ul>
            <li>軽量（小さなバンドルサイズ）</li>
            <li>高性能（効率的なキャッシュ）</li>
            <li>Composition API対応</li>
            <li>設定が簡単</li>
            <li>モダンなアーキテクチャ</li>
            <li>カスタマイズ可能</li>
          </ul>
        </div>
        <div class="cons">
          <h4>デメリット</h4>
          <ul>
            <li>Apollo Clientより機能が少ない</li>
            <li>エコシステムが小さい</li>
            <li>ドキュメントが少ない</li>
            <li>コミュニティが小さい</li>
          </ul>
        </div>
      </div>
    </div>

    <div class="client-section">
      <h2>実装例</h2>
      
      <h3>1. クライアント設定</h3>
      <div class="code-block">
        <pre><code>// plugins/urql.client.ts
import { createClient, provideClient } from '@urql/vue'

export default defineNuxtPlugin(() => {
  const client = createClient({
    url: useRuntimeConfig().public.graphqlEndpoint,
    // SSR設定
    suspense: true,
    // キャッシュ設定
    requestPolicy: 'cache-first'
  })

  // Vue 3アプリケーションにクライアントを提供
  provideClient(client)

  return {
    provide: {
      urqlClient: client
    }
  }
})</code></pre>
      </div>
      
      <h3>2. Composable実装</h3>
      <div class="code-block">
        <pre><code>// composables/useUrql.ts
import { useQuery, useMutation } from '@urql/vue'

export const useUrql = () => {
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
    query: GET_USERS,
    // SSR対応
    context: {
      suspense: true
    }
  })

  const createUser = () => useMutation(CREATE_USER)

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
const { queryUsers, createUser } = useUrql()

// クエリ実行
const { data: users, fetching, error } = queryUsers()

// ミューテーション実行
const { executeMutation } = createUser()

const handleCreateUser = async (input) => {
  try {
    const result = await executeMutation({ input })
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
            <strong>Status:</strong> URQL設定完了<br>
            <strong>Cache:</strong> Document Cache使用<br>
            <strong>SSR:</strong> Suspense対応<br>
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
          <div class="metric-value">~7KB</div>
          <p>gzipped時（軽量）</p>
        </div>
        <div class="metric-card">
          <h3>初回レンダリング</h3>
          <div class="metric-value">優秀</div>
          <p>Suspense対応</p>
        </div>
        <div class="metric-card">
          <h3>キャッシュ効率</h3>
          <div class="metric-value">良好</div>
          <p>Document Cache</p>
        </div>
        <div class="metric-card">
          <h3>TypeScript</h3>
          <div class="metric-value">完全対応</div>
          <p>型安全性確保</p>
        </div>
      </div>
    </div>

    <div class="client-section">
      <h2>SSR対応の特徴</h2>
      <div class="code-block">
        <pre><code>// SSR対応の設定例
const client = createClient({
  url: 'https://api.example.com/graphql',
  suspense: true, // Suspenseモード有効化
  requestPolicy: 'cache-first', // キャッシュ優先
  // SSR時の追加設定
  exchanges: [
    cacheExchange({
      keys: {
        User: (data) => data.id,
      }
    }),
    fetchExchange
  ]
})</code></pre>
      </div>
    </div>

    <div class="client-section">
      <h2>推奨使用場面</h2>
      <ul>
        <li>軽量性を重視するアプリケーション</li>
        <li>Vue 3のComposition APIをフル活用したい</li>
        <li>シンプルなGraphQL操作が中心</li>
        <li>バンドルサイズを最小化したい</li>
        <li>モダンなアーキテクチャを採用したい</li>
      </ul>
    </div>
  </div>
</template>

<script setup>
// メタデータの設定
useHead({
  title: 'URQL 評価 - Nuxt 3 GraphQL',
  meta: [
    { name: 'description', content: 'Nuxt 3環境でのURQL評価と実装例' }
  ]
})

// モックデータ（実際のGraphQLサーバーがない場合のデモ用）
const mockData = {
  users: [
    { id: 1, name: 'Alice Johnson', email: 'alice@example.com' },
    { id: 2, name: 'Bob Wilson', email: 'bob@example.com' }
  ]
}

// デモ用の状態管理
const pending = ref(false)
const error = ref(null)
const data = ref(mockData)

// データ再取得のシミュレーション
const refetch = async () => {
  pending.value = true
  error.value = null
  
  try {
    // 実際のURQL実装をシミュレート
    await new Promise(resolve => setTimeout(resolve, 800))
    
    // ランダムにエラーを発生させる（デモ用）
    if (Math.random() > 0.8) {
      throw new Error('GraphQL query failed')
    }
    
    data.value = {
      users: [
        ...mockData.users,
        { 
          id: Date.now(), 
          name: 'URQL User', 
          email: 'urql@example.com' 
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