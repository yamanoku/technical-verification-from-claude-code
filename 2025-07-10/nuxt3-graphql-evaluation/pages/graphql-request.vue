<template>
  <div class="container">
    <h1>GraphQL Request 評価</h1>
    
    <div class="nav">
      <NuxtLink to="/">概要</NuxtLink>
      <NuxtLink to="/apollo-client">Apollo Client</NuxtLink>
      <NuxtLink to="/urql">URQL</NuxtLink>
      <NuxtLink to="/nuxt-apollo">Nuxt Apollo</NuxtLink>
      <NuxtLink to="/villus">Villus</NuxtLink>
      <NuxtLink to="/graphql-request" class="active">GraphQL Request</NuxtLink>
      <NuxtLink to="/comparison">比較結果</NuxtLink>
    </div>

    <div class="client-section">
      <h2>GraphQL Request とは</h2>
      <p>
        GraphQL Requestは最も軽量でシンプルなGraphQLクライアントライブラリです。
        複雑な機能は持たないものの、基本的なGraphQL操作を効率的に実行できます。
      </p>
      
      <div class="pros-cons">
        <div class="pros">
          <h4>メリット</h4>
          <ul>
            <li>最小のバンドルサイズ</li>
            <li>最高のパフォーマンス</li>
            <li>シンプルなAPI</li>
            <li>学習コストが最低</li>
            <li>設定が不要</li>
            <li>TypeScript完全対応</li>
          </ul>
        </div>
        <div class="cons">
          <h4>デメリット</h4>
          <ul>
            <li>キャッシュ機能なし</li>
            <li>Subscription非対応</li>
            <li>DevToolsなし</li>
            <li>エラーハンドリングが基本的</li>
            <li>Vue固有の機能なし</li>
          </ul>
        </div>
      </div>
    </div>

    <div class="client-section">
      <h2>実装例</h2>
      
      <h3>1. 基本設定</h3>
      <div class="code-block">
        <pre><code>// composables/useGraphQLRequest.ts
import { request, gql } from 'graphql-request'

export const useGraphQLRequest = () => {
  const config = useRuntimeConfig()
  const endpoint = config.public.graphqlEndpoint

  const executeQuery = async (query: string, variables?: any) => {
    try {
      const data = await request(endpoint, query, variables)
      return data
    } catch (error) {
      console.error('GraphQL Error:', error)
      throw error
    }
  }

  const executeMutation = async (mutation: string, variables?: any) => {
    try {
      const data = await request(endpoint, mutation, variables)
      return data
    } catch (error) {
      console.error('GraphQL Mutation Error:', error)
      throw error
    }
  }

  return {
    executeQuery,
    executeMutation
  }
}</code></pre>
      </div>
      
      <h3>2. クエリとミューテーション定義</h3>
      <div class="code-block">
        <pre><code>// composables/useQueries.ts
import { gql } from 'graphql-request'

export const useQueries = () => {
  const GET_USERS = gql`
    query GetUsers {
      users {
        id
        name
        email
      }
    }
  `

  const CREATE_USER = gql`
    mutation CreateUser($input: CreateUserInput!) {
      createUser(input: $input) {
        id
        name
        email
      }
    }
  `

  return {
    GET_USERS,
    CREATE_USER
  }
}</code></pre>
      </div>
      
      <h3>3. コンポーネント内での使用</h3>
      <div class="code-block">
        <pre><code>// script setup内での使用例
&lt;script setup&gt;
const { executeQuery, executeMutation } = useGraphQLRequest()
const { GET_USERS, CREATE_USER } = useQueries()

// SSR対応のクエリ実行
const { data: users, error } = await useAsyncData('users', () => 
  executeQuery(GET_USERS)
)

// ミューテーション実行
const createUser = async (input) => {
  try {
    const result = await executeMutation(CREATE_USER, { input })
    return result.createUser
  } catch (error) {
    console.error('Error creating user:', error)
    throw error
  }
}

// 手動でのデータ再取得
const refetchUsers = async () => {
  try {
    const newData = await executeQuery(GET_USERS)
    users.value = newData.users
  } catch (error) {
    console.error('Error refetching users:', error)
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
            <strong>Status:</strong> GraphQL Request設定完了<br>
            <strong>Cache:</strong> なし（手動管理）<br>
            <strong>SSR:</strong> useAsyncDataで対応<br>
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
          <div class="metric-value">~3KB</div>
          <p>gzipped時（最小）</p>
        </div>
        <div class="metric-card">
          <h3>初回レンダリング</h3>
          <div class="metric-value">最高</div>
          <p>オーバーヘッドなし</p>
        </div>
        <div class="metric-card">
          <h3>メモリ使用量</h3>
          <div class="metric-value">最小</div>
          <p>キャッシュなし</p>
        </div>
        <div class="metric-card">
          <h3>TypeScript</h3>
          <div class="metric-value">完全対応</div>
          <p>型推論優秀</p>
        </div>
      </div>
    </div>

    <div class="client-section">
      <h2>SSR対応パターン</h2>
      <div class="code-block">
        <pre><code>// SSR対応のベストプラクティス
&lt;script setup&gt;
// パターン1: useAsyncDataを使用
const { data: users, error, pending } = await useAsyncData('users', () => 
  executeQuery(GET_USERS)
)

// パターン2: useLazyAsyncDataを使用
const { data: posts, error: postsError, pending: postsPending } = 
  await useLazyAsyncData('posts', () => executeQuery(GET_POSTS))

// パターン3: サーバーサイドでのみ実行
const { data: serverData } = await useAsyncData('server-data', () => 
  executeQuery(GET_SERVER_DATA), {
    server: true
  }
)
&lt;/script&gt;</code></pre>
      </div>
    </div>

    <div class="client-section">
      <h2>推奨使用場面</h2>
      <ul>
        <li>軽量性を最優先とするアプリケーション</li>
        <li>シンプルなGraphQL操作のみ</li>
        <li>キャッシュ機能が不要</li>
        <li>パフォーマンスを最優先とする場合</li>
        <li>学習コストを最小化したい場合</li>
        <li>既存のキャッシュシステムと組み合わせる場合</li>
      </ul>
    </div>

    <div class="client-section">
      <h2>制限事項と対応策</h2>
      <div class="pros-cons">
        <div class="cons">
          <h4>制限事項</h4>
          <ul>
            <li>キャッシュ機能なし</li>
            <li>Subscription非対応</li>
            <li>バッチング機能なし</li>
            <li>エラーリトライ機能なし</li>
          </ul>
        </div>
        <div class="pros">
          <h4>対応策</h4>
          <ul>
            <li>Nuxtの状態管理でキャッシュを実装</li>
            <li>WebSocketライブラリと組み合わせ</li>
            <li>手動でのリクエスト最適化</li>
            <li>try-catch文での適切なエラーハンドリング</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// メタデータの設定
useHead({
  title: 'GraphQL Request 評価 - Nuxt 3 GraphQL',
  meta: [
    { name: 'description', content: 'Nuxt 3環境でのGraphQL Request評価と実装例' }
  ]
})

// モックデータ（実際のGraphQLサーバーがない場合のデモ用）
const mockData = {
  users: [
    { id: 1, name: 'Simple User', email: 'simple@example.com' },
    { id: 2, name: 'Light User', email: 'light@example.com' }
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
    // 実際のGraphQL Request実装をシミュレート
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // ランダムにエラーを発生させる（デモ用）
    if (Math.random() > 0.8) {
      throw new Error('Request failed')
    }
    
    data.value = {
      users: [
        ...mockData.users,
        { 
          id: Date.now(), 
          name: 'Request User', 
          email: 'request@example.com' 
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