<template>
  <div class="container">
    <h1>Nuxt 3 GraphQL クライアント評価</h1>
    
    <div class="nav">
      <NuxtLink to="/" class="active">概要</NuxtLink>
      <NuxtLink to="/apollo-client">Apollo Client</NuxtLink>
      <NuxtLink to="/urql">URQL</NuxtLink>
      <NuxtLink to="/nuxt-apollo">Nuxt Apollo</NuxtLink>
      <NuxtLink to="/villus">Villus</NuxtLink>
      <NuxtLink to="/graphql-request">GraphQL Request</NuxtLink>
      <NuxtLink to="/comparison">比較結果</NuxtLink>
    </div>

    <div class="client-section">
      <h2>評価目的</h2>
      <p>
        Nuxt 3のSSR環境において、外部のBFF（Backend for Frontend）のGraphQLサーバーと疎通する際の
        最適なGraphQLクライアントライブラリを選定するための技術評価を行います。
      </p>
      
      <h3>評価環境</h3>
      <ul>
        <li><strong>フロントエンド</strong>: Nuxt 3 (最新版) SSR環境</li>
        <li><strong>バックエンド</strong>: BFF - 別環境でGraphQLサーバー稼働</li>
        <li><strong>GraphQLサーバー</strong>: Apollo Server (想定)</li>
        <li><strong>制約</strong>: Nuxt側のserverは使用しない</li>
        <li><strong>要件</strong>: GraphQLクライアントはscript setup内で動作</li>
      </ul>
      
      <h3>評価対象ライブラリ</h3>
      <div class="metrics">
        <div class="metric-card">
          <h3>@apollo/client</h3>
          <p>最も人気のあるGraphQLクライアント</p>
          <div class="metric-value">★★★★★</div>
        </div>
        <div class="metric-card">
          <h3>@urql/vue</h3>
          <p>軽量で高性能なGraphQLクライアント</p>
          <div class="metric-value">★★★★☆</div>
        </div>
        <div class="metric-card">
          <h3>@nuxtjs/apollo</h3>
          <p>Nuxt専用Apollo統合</p>
          <div class="metric-value">★★★☆☆</div>
        </div>
        <div class="metric-card">
          <h3>villus</h3>
          <p>Vue 3専用GraphQLクライアント</p>
          <div class="metric-value">★★★☆☆</div>
        </div>
        <div class="metric-card">
          <h3>graphql-request</h3>
          <p>軽量でシンプルなGraphQLクライアント</p>
          <div class="metric-value">★★★★☆</div>
        </div>
      </div>
    </div>

    <div class="client-section">
      <h2>評価項目</h2>
      <div class="pros-cons">
        <div class="pros">
          <h4>技術的評価項目</h4>
          <ul>
            <li>SSR対応（ハイドレーション）</li>
            <li>TypeScript対応</li>
            <li>バンドルサイズ</li>
            <li>パフォーマンス</li>
            <li>キャッシュ機能</li>
            <li>エラーハンドリング</li>
          </ul>
        </div>
        <div class="cons">
          <h4>開発体験評価項目</h4>
          <ul>
            <li>学習コスト</li>
            <li>ドキュメント品質</li>
            <li>コミュニティサポート</li>
            <li>Composition API対応</li>
            <li>DevTools対応</li>
            <li>エコシステム</li>
          </ul>
        </div>
      </div>
    </div>

    <div class="client-section">
      <h2>検証シナリオ</h2>
      <p>各GraphQLクライアントで以下のシナリオを検証します：</p>
      <ol>
        <li><strong>基本的なクエリ実行</strong> - ユーザー情報の取得</li>
        <li><strong>ミューテーション実行</strong> - データの更新</li>
        <li><strong>SSR対応</strong> - 初回レンダリング時のデータ取得</li>
        <li><strong>エラーハンドリング</strong> - ネットワークエラー等の処理</li>
        <li><strong>キャッシュ機能</strong> - データの効率的な管理</li>
        <li><strong>リアルタイム更新</strong> - Subscription対応（可能な場合）</li>
      </ol>
    </div>

    <div class="client-section">
      <h2>使用方法</h2>
      <p>
        上部のナビゲーションから各GraphQLクライアントの実装例を確認できます。
        最終的な比較結果は「比較結果」ページで確認してください。
      </p>
    </div>
  </div>
</template>

<script setup>
// メタデータの設定
useHead({
  title: 'Nuxt 3 GraphQL クライアント評価',
  meta: [
    { name: 'description', content: 'Nuxt 3 SSR環境でのGraphQLクライアント技術選定評価' }
  ]
})

// SEO対応
useSeoMeta({
  title: 'Nuxt 3 GraphQL クライアント評価',
  description: 'Nuxt 3のSSR環境において最適なGraphQLクライアントライブラリを選定するための技術評価'
})
</script>

<style scoped>
.nav a.active {
  background-color: #007acc;
  color: white;
}
</style>