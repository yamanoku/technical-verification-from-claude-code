<script>
  import { getStatistics } from '$lib/functions.remote';
  
  let statisticsPromise = getStatistics();
  
  function refreshStats() {
    statisticsPromise = getStatistics();
  }
</script>

<svelte:head>
  <title>統計情報 - Remote Functions 検証</title>
</svelte:head>

<div class="container">
  <h1>統計情報ダッシュボード</h1>
  <p>重い処理のQuery実装例です。キャッシュ機能により、2回目以降の表示が高速化されます。</p>
  
  <div class="card">
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
      <h2>📊 サイト統計</h2>
      <button class="button secondary" on:click={refreshStats}>
        統計を更新
      </button>
    </div>
    
    {#await statisticsPromise}
      <div class="loading">統計データを計算中... (約2秒かかります)</div>
      <p style="color: #666; font-size: 0.9rem;">
        ※ この処理は重い計算をシミュレートしています。Real worldでは、データベースクエリや外部API呼び出しなど。
      </p>
    {:then stats}
      <!-- 統計カード -->
      <div class="stats-grid">
        <div class="stat-card">
          <span class="stat-number">{stats.totalUsers.toLocaleString()}</span>
          <span class="stat-label">総ユーザー数</span>
        </div>
        
        <div class="stat-card">
          <span class="stat-number">{stats.activeUsers.toLocaleString()}</span>
          <span class="stat-label">アクティブユーザー</span>
        </div>
        
        <div class="stat-card">
          <span class="stat-number">{stats.newUsersThisMonth}</span>
          <span class="stat-label">今月の新規ユーザー</span>
        </div>
        
        <div class="stat-card">
          <span class="stat-number">{Math.round((stats.activeUsers / stats.totalUsers) * 100)}%</span>
          <span class="stat-label">アクティブ率</span>
        </div>
      </div>
      
      <!-- 人気ページ -->
      <div style="margin-top: 2rem;">
        <h3>🔥 人気ページランキング</h3>
        <div class="card">
          {#each stats.popularPages as page, index}
            <div class="page-item">
              <div class="page-rank">#{index + 1}</div>
              <div class="page-info">
                <strong>{page.path}</strong>
                <span class="page-views">{page.views.toLocaleString()} views</span>
              </div>
            </div>
          {/each}
        </div>
      </div>
      
      <!-- 更新情報 -->
      <div style="margin-top: 1rem; padding: 1rem; background: #f8f9fa; border-radius: 4px;">
        <small style="color: #666;">
          最終更新: {new Date(stats.lastUpdated).toLocaleString('ja-JP')}
        </small>
      </div>
    {:catch error}
      <div class="error">
        統計データの取得に失敗しました: {error.message}
      </div>
    {/await}
  </div>
  
  <div class="card">
    <h2>⚡ Query機能の性能特性</h2>
    
    <h3>キャッシュ動作の確認</h3>
    <ol>
      <li>初回読み込み時は約2秒の計算時間がかかります</li>
      <li>「統計を更新」ボタンを押すと、再度計算が実行されます</li>
      <li>他のページに移動してから戻ると、キャッシュされたデータが即座に表示されます</li>
    </ol>
    
    <h3>重い処理の適用例</h3>
    <ul>
      <li><strong>データベース集計</strong>: 複雑なJOINやGROUP BYクエリ</li>
      <li><strong>外部API呼び出し</strong>: サードパーティサービスからのデータ取得</li>
      <li><strong>機械学習予測</strong>: モデルを使った推論処理</li>
      <li><strong>レポート生成</strong>: 大量データの分析・集計</li>
    </ul>
    
    <h3>従来のload関数との比較</h3>
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin: 1rem 0;">
      <div style="padding: 1rem; background: #f8f9fa; border-radius: 4px;">
        <h4>従来のload関数</h4>
        <ul style="font-size: 0.9rem;">
          <li>ページ遷移毎に実行</li>
          <li>キャッシュは手動実装</li>
          <li>型安全性が限定的</li>
        </ul>
      </div>
      <div style="padding: 1rem; background: #e8f5e8; border-radius: 4px;">
        <h4>Remote Function (Query)</h4>
        <ul style="font-size: 0.9rem;">
          <li>自動キャッシュ機能</li>
          <li>任意のタイミングで呼び出し可能</li>
          <li>完全な型安全性</li>
        </ul>
      </div>
    </div>
  </div>
  
  <div class="card">
    <h2>🧪 パフォーマンステスト</h2>
    <p>以下の手順でキャッシュ機能を確認してください：</p>
    <ol>
      <li>ページを初回読み込み（約2秒待機）</li>
      <li>他のページ（ホーム、ユーザー管理など）に移動</li>
      <li>再度このページに戻る → <strong>即座に表示されます</strong></li>
      <li>「統計を更新」ボタンを押して手動更新</li>
    </ol>
    
    <div style="background: #fff3cd; padding: 1rem; border-radius: 4px; border-left: 4px solid #ffc107;">
      <strong>💡 ポイント:</strong> Remote Function (Query) は、同じパラメータでの呼び出し結果を自動的にキャッシュします。
      これにより、ユーザー体験が大幅に向上し、サーバー負荷も軽減されます。
    </div>
  </div>
</div>

<style>
  .page-item {
    display: flex;
    align-items: center;
    padding: 0.75rem;
    border-bottom: 1px solid #eee;
  }
  
  .page-item:last-child {
    border-bottom: none;
  }
  
  .page-rank {
    width: 40px;
    height: 40px;
    background: linear-gradient(135deg, #007acc, #0056b3);
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    margin-right: 1rem;
  }
  
  .page-info {
    flex: 1;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .page-views {
    color: #666;
    font-size: 0.9rem;
  }
</style>