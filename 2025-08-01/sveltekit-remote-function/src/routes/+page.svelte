<script>
  import { getUsers } from '$lib/functions.remote';
  
  // Remote Function (Query) の使用例
  let usersPromise = getUsers();
</script>

<svelte:head>
  <title>SvelteKit Remote Functions 検証</title>
</svelte:head>

<div class="container">
  <h1>SvelteKit Remote Functions 技術検証</h1>
  
  <div class="card">
    <h2>Remote Functions とは</h2>
    <p>
      SvelteKit v2.27.0で導入された新機能で、サーバーサイド関数をクライアントから直接呼び出すことができます。
      従来のAPI Routesやload関数と比較して、より型安全で開発効率の高いアプローチを提供します。
    </p>
    
    <h3>主な機能タイプ</h3>
    <ul>
      <li><strong>Query</strong>: データ取得用（キャッシュ機能付き）</li>
      <li><strong>Command</strong>: データ変更用（非同期処理対応）</li>
      <li><strong>Form</strong>: フォーム処理用（プログレッシブエンハンスメント対応）</li>
      <li><strong>Prerender</strong>: プリレンダリング用（ビルド時実行）</li>
    </ul>
  </div>
  
  <div class="card">
    <h2>実装例：Query - ユーザーリスト取得</h2>
    <p>以下は、Remote Function (Query) を使用してユーザーリストを取得する例です：</p>
    
    <button class="button" onclick={() => getUsers().refresh()}>
      ユーザーリストを更新
    </button>
    
    {#await usersPromise}
      <div class="loading">ユーザーデータを読み込み中...</div>
    {:then users}
      <div style="margin-top: 1rem;">
        <h3>取得したユーザー ({users.length}人)</h3>
        <div class="card">
          {#each users as user}
            <div class="user-item">
              <div class="user-info">
                <h3>{user.name}</h3>
                <p>{user.email}</p>
              </div>
            </div>
          {/each}
        </div>
      </div>
    {:catch error}
      <div class="error">
        エラーが発生しました: {error.message}
      </div>
    {/await}
  </div>
  
  <div class="card">
    <h2>各機能の特徴</h2>
    
    <h3>🔍 Query の特徴</h3>
    <ul>
      <li>自動的なキャッシュ機能</li>
      <li>型安全なデータ取得</li>
      <li>Suspenseライクな非同期処理</li>
    </ul>
    
    <h3>⚡ Command の特徴</h3>
    <ul>
      <li>データ変更操作に最適</li>
      <li>エラーハンドリングの統一</li>
      <li>楽観的アップデート対応</li>
    </ul>
    
    <h3>📝 Form の特徴</h3>
    <ul>
      <li>プログレッシブエンハンスメント</li>
      <li>自動的なCSRF保護</li>
      <li>型安全なフォーム処理</li>
    </ul>
  </div>
  
  <div class="card">
    <h2>ナビゲーション</h2>
    <p>以下のページで各機能の詳細な実装例を確認できます：</p>
    <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
      <a href="/users" class="button">ユーザー管理 (Query + Command)</a>
      <a href="/contact" class="button secondary">お問い合わせ (Form)</a>
      <a href="/stats" class="button secondary">統計表示 (Query)</a>
    </div>
  </div>
</div>