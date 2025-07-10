<template>
  <div class="container">
    <h1>Nuxt Apollo 評価</h1>
    
    <div class="nav">
      <NuxtLink to="/">概要</NuxtLink>
      <NuxtLink to="/apollo-client">Apollo Client</NuxtLink>
      <NuxtLink to="/urql">URQL</NuxtLink>
      <NuxtLink to="/nuxt-apollo" class="active">Nuxt Apollo</NuxtLink>
      <NuxtLink to="/villus">Villus</NuxtLink>
      <NuxtLink to="/graphql-request">GraphQL Request</NuxtLink>
      <NuxtLink to="/comparison">比較結果</NuxtLink>
    </div>

    <div class="client-section">
      <h2>Nuxt Apollo とは</h2>
      <p>
        @nuxtjs/apolloはNuxt専用のApollo Client統合モジュールです。
        Apollo Clientの機能をNuxtアプリケーションで簡単に使用できるように設計されています。
      </p>
      
      <div class="pros-cons">
        <div class="pros">
          <h4>メリット</h4>
          <ul>
            <li>Nuxtとの完全統合</li>
            <li>設定が簡単</li>
            <li>SSR対応が自動</li>
            <li>Apollo Clientの全機能を使用可能</li>
            <li>モジュール形式で管理が容易</li>
            <li>優れたDevTools</li>
          </ul>
        </div>
        <div class="cons">
          <h4>デメリット</h4>
          <ul>
            <li>Apollo Clientの複雑さを継承</li>
            <li>バンドルサイズが大きい</li>
            <li>Nuxt専用（他フレームワーク不可）</li>
            <li>アルファ版（安定性に懸念）</li>
            <li>設定が複雑になる場合がある</li>
          </ul>
        </div>
      </div>
    </div>

    <div class="client-section">
      <h2>実装例</h2>
      
      <h3>1. モジュール設定</h3>
      <div class="code-block">
        <pre><code>// nuxt.config.ts
export default defineNuxtConfig({
  modules: [
    '@nuxtjs/apollo'
  ],
  apollo: {
    clients: {
      default: {
        httpEndpoint: process.env.GRAPHQL_ENDPOINT || 'http://localhost:4000/graphql',
        // SSR設定
        ssrMode: true,
        // 認証等の設定
        httpLinkOptions: {
          headers: {
            // 'Authorization': `Bearer ${process.env.AUTH_TOKEN}`,
          }
        },
        // WebSocket設定（Subscription用）
        wsEndpoint: process.env.GRAPHQL_WS_ENDPOINT || 'ws://localhost:4000/graphql'
      }
    }
  }
})</code></pre>
      </div>
      
      <h3>2. Composable実装</h3>
      <div class="code-block">
        <pre><code>// composables/useNuxtApollo.ts
export const useNuxtApollo = () => {
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

  const queryUsers = () => useQuery(GET_USERS)
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
const { queryUsers, createUser } = useNuxtApollo()

// クエリ実行
const { data: users, pending, error } = queryUsers()

// ミューテーション実行
const { mutate: executeCreateUser } = createUser()

const handleCreateUser = async (input) => {
  try {
    const result = await executeCreateUser({ input })
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
            <strong>Status:</strong> Nuxt Apollo設定完了<br>
            <strong>Cache:</strong> InMemoryCache使用<br>
            <strong>SSR:</strong> 自動対応<br>
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
          <div class="metric-value">~25KB</div>
          <p>gzipped時（中程度）</p>
        </div>
        <div class="metric-card">
          <h3>初回レンダリング</h3>
          <div class="metric-value">良好</div>
          <p>SSR自動対応</p>
        </div>
        <div class="metric-card">
          <h3>キャッシュ効率</h3>
          <div class="metric-value">優秀</div>
          <p>Apollo InMemoryCache</p>
        </div>
        <div class="metric-card">
          <h3>TypeScript</h3>
          <div class="metric-value">完全対応</div>
          <p>Apollo Client継承</p>
        </div>
      </div>
    </div>

    <div class="client-section">
      <h2>Nuxt統合の特徴</h2>
      <div class="code-block">
        <pre><code>// 自動的に利用可能なComposables
&lt;script setup&gt;
// useQuery, useMutation, useSubscription が自動的に利用可能
const { data, pending, error } = useQuery(GET_USERS)
const { mutate } = useMutation(CREATE_USER)
const { data: subscriptionData } = useSubscription(USER_SUBSCRIPTION)

// Apollo Client インスタンスへの直接アクセス
const { $apollo } = useNuxtApp()
const result = await $apollo.query({
  query: GET_USERS
})
&lt;/script&gt;</code></pre>
      </div>
    </div>

    <div class="client-section">
      <h2>推奨使用場面</h2>
      <ul>
        <li>Nuxt専用のアプリケーション</li>
        <li>Apollo Clientの機能を最大限に活用したい</li>
        <li>設定の簡単さを重視する</li>
        <li>既存のApolloエコシステムを活用したい</li>
        <li>大規模アプリケーションでの使用</li>
        <li>リアルタイム機能（Subscription）が必要</li>
      </ul>
    </div>

    <div class="client-section">
      <h2>注意点</h2>
      <div class="pros-cons">
        <div class="cons">
          <h4>制限事項</h4>
          <ul>
            <li>現在アルファ版（安定性に懸念）</li>
            <li>Apollo Clientの複雑さを継承</li>
            <li>バンドルサイズが大きい</li>
            <li>学習コストが高い</li>
          </ul>
        </div>
        <div class="pros">
          <h4>対応策</h4>
          <ul>
            <li>本番環境での使用前に十分なテスト</li>
            <li>チーム全体でのGraphQL理解</li>
            <li>適切なコード分割の実装</li>
            <li>段階的な導入を検討</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
useHead({
  title: 'Nuxt Apollo 評価 - Nuxt 3 GraphQL',
  meta: [
    { name: 'description', content: 'Nuxt 3環境でのNuxt Apollo評価と実装例' }
  ]
})

const mockData = {
  users: [
    { id: 1, name: 'Nuxt User', email: 'nuxt@example.com' },
    { id: 2, name: 'Apollo User', email: 'apollo@example.com' }
  ]
}

const pending = ref(false)
const error = ref(null)
const data = ref(mockData)

const refetch = async () => {
  pending.value = true
  error.value = null
  
  try {
    await new Promise(resolve => setTimeout(resolve, 1200))
    
    if (Math.random() > 0.8) {
      throw new Error('Nuxt Apollo query failed')
    }
    
    data.value = {
      users: [
        ...mockData.users,
        { 
          id: Date.now(), 
          name: 'New Nuxt Apollo User', 
          email: 'nuxtapollo@example.com' 
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