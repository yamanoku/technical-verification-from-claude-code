<template>
  <div class="container">
    <h1>Apollo Client 評価</h1>
    
    <div class="nav">
      <NuxtLink to="/">概要</NuxtLink>
      <NuxtLink to="/apollo-client" class="active">Apollo Client</NuxtLink>
      <NuxtLink to="/urql">URQL</NuxtLink>
      <NuxtLink to="/nuxt-apollo">Nuxt Apollo</NuxtLink>
      <NuxtLink to="/villus">Villus</NuxtLink>
      <NuxtLink to="/graphql-request">GraphQL Request</NuxtLink>
      <NuxtLink to="/comparison">比較結果</NuxtLink>
    </div>

    <div class="client-section">
      <h2>Apollo Client とは</h2>
      <p>
        Apollo Clientは最も人気のあるGraphQLクライアントライブラリの一つで、
        強力なキャッシュ機能、TypeScript対応、豊富なエコシステムを提供しています。
      </p>
      
      <div class="pros-cons">
        <div class="pros">
          <h4>メリット</h4>
          <ul>
            <li>成熟したライブラリ（安定性が高い）</li>
            <li>強力なキャッシュシステム</li>
            <li>優れたDevTools</li>
            <li>豊富なドキュメント</li>
            <li>大規模アプリケーションに適している</li>
            <li>Subscription対応</li>
          </ul>
        </div>
        <div class="cons">
          <h4>デメリット</h4>
          <ul>
            <li>バンドルサイズが大きい</li>
            <li>学習コストが高い</li>
            <li>設定が複雑</li>
            <li>オーバーキルな場合がある</li>
          </ul>
        </div>
      </div>
    </div>

    <div class="client-section">
      <h2>実装例</h2>
      
      <h3>1. クライアント設定</h3>
      <div class="code-block">
        <pre><code>// plugins/apollo.client.ts
import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client/core'

export default defineNuxtPlugin(() => {
  const httpLink = createHttpLink({
    uri: useRuntimeConfig().public.graphqlEndpoint,
  })

  const apolloClient = new ApolloClient({
    link: httpLink,
    cache: new InMemoryCache(),
    // SSR設定
    ssrMode: process.server,
    ssrForceFetchDelay: 100,
  })

  return {
    provide: {
      apolloClient
    }
  }
})</code></pre>
      </div>
      
      <h3>2. Composable実装</h3>
      <div class="code-block">
        <pre><code>// composables/useApollo.ts
import { useQuery, useMutation } from '@apollo/client/core'
import gql from 'graphql-tag'

export const useApollo = () => {
  const { $apolloClient } = useNuxtApp()

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
    client: $apolloClient,
    GET_USERS,
    CREATE_USER
  }
}</code></pre>
      </div>
      
      <h3>3. コンポーネント内での使用</h3>
      <div class="code-block">
        <pre><code>// script setup内での使用例
&lt;script setup&gt;
const { client, GET_USERS, CREATE_USER } = useApollo()

// クエリ実行
const { data: users, loading, error } = await useAsyncData('users', () => 
  client.query({ query: GET_USERS })
)

// ミューテーション実行
const createUser = async (input) => {
  try {
    const result = await client.mutate({
      mutation: CREATE_USER,
      variables: { input }
    })
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
            <strong>Status:</strong> Apollo Client設定完了<br>
            <strong>Cache:</strong> InMemoryCache使用<br>
            <strong>SSR:</strong> 対応済み<br>
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
          <div class="metric-value">~32KB</div>
          <p>gzipped時（比較的大きい）</p>
        </div>
        <div class="metric-card">
          <h3>初回レンダリング</h3>
          <div class="metric-value">良好</div>
          <p>SSR対応済み</p>
        </div>
        <div class="metric-card">
          <h3>キャッシュ効率</h3>
          <div class="metric-value">優秀</div>
          <p>InMemoryCache</p>
        </div>
        <div class="metric-card">
          <h3>TypeScript</h3>
          <div class="metric-value">完全対応</div>
          <p>型生成ツール豊富</p>
        </div>
      </div>
    </div>

    <div class="client-section">
      <h2>推奨使用場面</h2>
      <ul>
        <li>大規模なアプリケーション</li>
        <li>複雑なデータ管理が必要</li>
        <li>リアルタイム機能が重要</li>
        <li>既存のApolloエコシステムを活用したい</li>
        <li>チームがGraphQLに慣れている</li>
      </ul>
    </div>
  </div>
</template>

<script setup>
// メタデータの設定
useHead({
  title: 'Apollo Client 評価 - Nuxt 3 GraphQL',
  meta: [
    { name: 'description', content: 'Nuxt 3環境でのApollo Client評価と実装例' }
  ]
})

// モックデータ（実際のGraphQLサーバーがない場合のデモ用）
const mockData = {
  users: [
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
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
    // 実際のApollo Client実装をシミュレート
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // ランダムにエラーを発生させる（デモ用）
    if (Math.random() > 0.8) {
      throw new Error('Network error occurred')
    }
    
    data.value = {
      users: [
        ...mockData.users,
        { 
          id: Date.now(), 
          name: 'New User', 
          email: 'new@example.com' 
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