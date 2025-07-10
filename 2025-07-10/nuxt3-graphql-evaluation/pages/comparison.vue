<template>
  <div class="container">
    <h1>GraphQL クライアント比較結果</h1>
    
    <div class="nav">
      <NuxtLink to="/">概要</NuxtLink>
      <NuxtLink to="/apollo-client">Apollo Client</NuxtLink>
      <NuxtLink to="/urql">URQL</NuxtLink>
      <NuxtLink to="/nuxt-apollo">Nuxt Apollo</NuxtLink>
      <NuxtLink to="/villus">Villus</NuxtLink>
      <NuxtLink to="/graphql-request">GraphQL Request</NuxtLink>
      <NuxtLink to="/comparison" class="active">比較結果</NuxtLink>
    </div>

    <div class="client-section">
      <h2>総合評価</h2>
      <div class="metrics">
        <div class="metric-card">
          <h3>🏆 推奨第1位</h3>
          <div class="metric-value">@urql/vue</div>
          <p>軽量性とVue 3対応のバランス</p>
        </div>
        <div class="metric-card">
          <h3>🥈 推奨第2位</h3>
          <div class="metric-value">graphql-request</div>
          <p>シンプルさと軽量性</p>
        </div>
        <div class="metric-card">
          <h3>🥉 推奨第3位</h3>
          <div class="metric-value">@apollo/client</div>
          <p>機能の豊富さと安定性</p>
        </div>
      </div>
    </div>

    <div class="client-section">
      <h2>詳細比較表</h2>
      <div class="comparison-table">
        <table>
          <thead>
            <tr>
              <th>項目</th>
              <th>Apollo Client</th>
              <th>URQL</th>
              <th>Nuxt Apollo</th>
              <th>Villus</th>
              <th>GraphQL Request</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>バンドルサイズ</strong></td>
              <td>❌ 大きい (~32KB)</td>
              <td>✅ 小さい (~7KB)</td>
              <td>⚠️ 中程度 (~25KB)</td>
              <td>✅ 小さい (~5KB)</td>
              <td>✅ 最小 (~3KB)</td>
            </tr>
            <tr>
              <td><strong>SSR対応</strong></td>
              <td>✅ 完全対応</td>
              <td>✅ 完全対応</td>
              <td>✅ 完全対応</td>
              <td>✅ 完全対応</td>
              <td>⚠️ 手動対応</td>
            </tr>
            <tr>
              <td><strong>キャッシュ機能</strong></td>
              <td>✅ 高機能</td>
              <td>✅ 効率的</td>
              <td>✅ 高機能</td>
              <td>✅ 効率的</td>
              <td>❌ なし</td>
            </tr>
            <tr>
              <td><strong>TypeScript対応</strong></td>
              <td>✅ 完全対応</td>
              <td>✅ 完全対応</td>
              <td>✅ 完全対応</td>
              <td>✅ 完全対応</td>
              <td>✅ 完全対応</td>
            </tr>
            <tr>
              <td><strong>学習コスト</strong></td>
              <td>❌ 高い</td>
              <td>✅ 低い</td>
              <td>⚠️ 中程度</td>
              <td>✅ 低い</td>
              <td>✅ 最低</td>
            </tr>
            <tr>
              <td><strong>Composition API</strong></td>
              <td>⚠️ 限定的</td>
              <td>✅ 最適化</td>
              <td>✅ 対応</td>
              <td>✅ 最適化</td>
              <td>✅ 対応</td>
            </tr>
            <tr>
              <td><strong>Subscription</strong></td>
              <td>✅ 完全対応</td>
              <td>✅ 対応</td>
              <td>✅ 完全対応</td>
              <td>✅ 対応</td>
              <td>❌ なし</td>
            </tr>
            <tr>
              <td><strong>エコシステム</strong></td>
              <td>✅ 豊富</td>
              <td>⚠️ 中程度</td>
              <td>✅ 豊富</td>
              <td>⚠️ 限定的</td>
              <td>⚠️ 限定的</td>
            </tr>
            <tr>
              <td><strong>DevTools</strong></td>
              <td>✅ 優秀</td>
              <td>✅ 対応</td>
              <td>✅ 優秀</td>
              <td>⚠️ 限定的</td>
              <td>❌ なし</td>
            </tr>
            <tr>
              <td><strong>パフォーマンス</strong></td>
              <td>✅ 良好</td>
              <td>✅ 優秀</td>
              <td>✅ 良好</td>
              <td>✅ 優秀</td>
              <td>✅ 最高</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="client-section">
      <h2>シナリオ別推奨</h2>
      
      <div class="scenario-cards">
        <div class="scenario-card">
          <h3>🚀 小〜中規模アプリケーション</h3>
          <div class="recommendation">
            <strong>推奨: @urql/vue</strong>
          </div>
          <ul>
            <li>軽量で高性能</li>
            <li>Composition APIに最適化</li>
            <li>SSR対応が簡単</li>
            <li>適度なキャッシュ機能</li>
          </ul>
        </div>
        
        <div class="scenario-card">
          <h3>🏢 大規模アプリケーション</h3>
          <div class="recommendation">
            <strong>推奨: @apollo/client</strong>
          </div>
          <ul>
            <li>強力なキャッシュシステム</li>
            <li>豊富な機能とエコシステム</li>
            <li>優れたDevTools</li>
            <li>エンタープライズ対応</li>
          </ul>
        </div>
        
        <div class="scenario-card">
          <h3>⚡ 軽量・高速重視</h3>
          <div class="recommendation">
            <strong>推奨: graphql-request</strong>
          </div>
          <ul>
            <li>最小のバンドルサイズ</li>
            <li>最高のパフォーマンス</li>
            <li>シンプルなAPI</li>
            <li>学習コストが最低</li>
          </ul>
        </div>
        
        <div class="scenario-card">
          <h3>🎯 Nuxt特化</h3>
          <div class="recommendation">
            <strong>推奨: @nuxtjs/apollo</strong>
          </div>
          <ul>
            <li>Nuxtとの完全統合</li>
            <li>設定が簡単</li>
            <li>SSR対応が自動</li>
            <li>モジュール形式</li>
          </ul>
        </div>
      </div>
    </div>

    <div class="client-section">
      <h2>技術的推奨事項</h2>
      
      <div class="recommendation-section">
        <h3>🎯 BFF環境での推奨構成</h3>
        <div class="code-block">
          <pre><code>// 推奨構成 - @urql/vue
// nuxt.config.ts
export default defineNuxtConfig({
  ssr: true,
  runtimeConfig: {
    public: {
      graphqlEndpoint: process.env.GRAPHQL_ENDPOINT || 'https://bff.example.com/graphql'
    }
  }
})

// plugins/urql.client.ts
import { createClient, provideClient } from '@urql/vue'

export default defineNuxtPlugin(() => {
  const client = createClient({
    url: useRuntimeConfig().public.graphqlEndpoint,
    suspense: true,
    requestPolicy: 'cache-first'
  })
  
  provideClient(client)
  return { provide: { urqlClient: client } }
})</code></pre>
        </div>
      </div>

      <div class="recommendation-section">
        <h3>🔧 設計上の推奨事項</h3>
        <ul>
          <li><strong>エラーハンドリング</strong>: 統一されたエラーハンドリング戦略を実装</li>
          <li><strong>キャッシュ戦略</strong>: BFFの特性に応じたキャッシュポリシーを設定</li>
          <li><strong>セキュリティ</strong>: 認証トークンの適切な管理</li>
          <li><strong>パフォーマンス</strong>: 必要に応じてクエリの最適化を実装</li>
          <li><strong>型安全性</strong>: GraphQL Code Generatorの活用を検討</li>
        </ul>
      </div>

      <div class="recommendation-section">
        <h3>🚦 実装時の注意点</h3>
        <div class="pros-cons">
          <div class="pros">
            <h4>やるべきこと</h4>
            <ul>
              <li>SSR時のクエリ実行タイミングを適切に設定</li>
              <li>エラーバウンダリーの実装</li>
              <li>適切なローディング状態の管理</li>
              <li>パフォーマンスモニタリングの実装</li>
            </ul>
          </div>
          <div class="cons">
            <h4>避けるべきこと</h4>
            <ul>
              <li>過度なキャッシュによるメモリリーク</li>
              <li>未ハンドリングのネットワークエラー</li>
              <li>SSR時のクライアント固有APIの使用</li>
              <li>セキュリティトークンの不適切な管理</li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <div class="client-section">
      <h2>最終結論</h2>
      <div class="final-recommendation">
        <h3>🎯 Nuxt 3 + BFF環境での最適解</h3>
        <p>
          <strong>@urql/vue</strong>を第一推奨とします。理由は以下の通りです：
        </p>
        <ul>
          <li>Nuxt 3のSSR環境との相性が最も良い</li>
          <li>Vue 3 Composition APIに最適化されている</li>
          <li>軽量でありながら必要十分な機能を提供</li>
          <li>script setup内での使用が直感的</li>
          <li>BFF環境での使用に適したキャッシュ戦略</li>
        </ul>
        
        <p>
          ただし、既存のApolloエコシステムを活用する場合や、
          大規模アプリケーションの場合は<strong>@apollo/client</strong>も検討価値があります。
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
// メタデータの設定
useHead({
  title: 'GraphQL クライアント比較結果 - Nuxt 3 GraphQL',
  meta: [
    { name: 'description', content: 'Nuxt 3 SSR環境でのGraphQLクライアント比較結果と推奨事項' }
  ]
})
</script>

<style scoped>
.nav a.active {
  background-color: #007acc;
  color: white;
}

.comparison-table {
  overflow-x: auto;
  margin: 20px 0;
}

.comparison-table table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.comparison-table th,
.comparison-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #eee;
}

.comparison-table th {
  background-color: #f8f9fa;
  font-weight: 600;
  color: #333;
}

.comparison-table tr:hover {
  background-color: #f8f9fa;
}

.scenario-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin: 20px 0;
}

.scenario-card {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border-left: 4px solid #007acc;
}

.scenario-card h3 {
  margin: 0 0 15px 0;
  color: #333;
}

.recommendation {
  background-color: #e8f5e8;
  padding: 10px;
  border-radius: 4px;
  margin: 10px 0;
  font-weight: 600;
  color: #2e7d32;
}

.recommendation-section {
  margin: 30px 0;
}

.recommendation-section h3 {
  color: #333;
  border-bottom: 2px solid #007acc;
  padding-bottom: 10px;
}

.final-recommendation {
  background: linear-gradient(135deg, #e8f5e8 0%, #f0f8ff 100%);
  padding: 25px;
  border-radius: 8px;
  border-left: 4px solid #4caf50;
  margin: 20px 0;
}

.final-recommendation h3 {
  color: #2e7d32;
  margin-top: 0;
}

.final-recommendation p {
  margin: 15px 0;
  line-height: 1.6;
}

.final-recommendation ul {
  margin: 15px 0;
  padding-left: 20px;
}

.final-recommendation li {
  margin: 8px 0;
  line-height: 1.5;
}
</style>