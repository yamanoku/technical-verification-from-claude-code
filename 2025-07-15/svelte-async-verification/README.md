# Svelte 5.36.0 非同期機能の技術検証

## 概要

Svelte 5.36.0で実装された非同期コンポーネント機能について包括的な技術検証を実施しました。この機能により、Svelteコンポーネント内で直接非同期処理を扱うことが可能になりました。

## 機能詳細

### 1. Async Component Support

Svelte 5.36.0では、コンポーネント内で`await`を直接使用できるようになりました。

```svelte
<!-- BasicAsyncComponent.svelte -->
<script>
  export let userId;
  
  async function fetchUser(id) {
    const response = await fetch(`/api/users/${id}`);
    return await response.json();
  }
</script>

{#await fetchUser(userId)}
  <p>Loading user...</p>
{:then user}
  <h1>{user.name}</h1>
  <p>{user.email}</p>
{:catch error}
  <p>Error: {error.message}</p>
{/await}
```

### 2. Promise-based Rendering

非同期データの読み込み状態を統一的に管理できます。

```svelte
<!-- PromiseBasedComponent.svelte -->
<script>
  import { onMount } from 'svelte';
  
  let userPromise;
  
  onMount(() => {
    userPromise = fetchUsers();
  });
  
  async function fetchUsers() {
    const response = await fetch('/api/users');
    return await response.json();
  }
</script>

{#await userPromise}
  <div class="loading">
    <p>ユーザー一覧を読み込み中...</p>
  </div>
{:then users}
  <div class="user-list">
    {#each users as user}
      <div class="user-card">
        <h3>{user.name}</h3>
        <p>{user.email}</p>
      </div>
    {/each}
  </div>
{:catch error}
  <div class="error">
    <h3>エラーが発生しました</h3>
    <p>{error.message}</p>
  </div>
{/await}
```

### 3. Streaming Support

SSR環境での非同期データの段階的送信をサポートします。

```svelte
<!-- StreamingComponent.svelte -->
<script>
  export let stream;
  
  async function processStream() {
    const reader = stream.getReader();
    const results = [];
    
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        results.push(value);
      }
      return results;
    } finally {
      reader.releaseLock();
    }
  }
</script>

{#await processStream()}
  <div class="streaming">
    <p>データをストリーミング中...</p>
    <div class="progress-bar"></div>
  </div>
{:then data}
  <div class="stream-results">
    {#each data as item}
      <div class="stream-item">{item}</div>
    {/each}
  </div>
{:catch error}
  <div class="stream-error">
    <p>ストリーミングエラー: {error.message}</p>
  </div>
{/await}
```

## 実装パターン

### 1. データフェッチングパターン

```svelte
<!-- DataFetchingPattern.svelte -->
<script>
  import { onMount } from 'svelte';
  
  let data = null;
  let loading = true;
  let error = null;
  
  onMount(async () => {
    try {
      const response = await fetch('/api/data');
      data = await response.json();
    } catch (err) {
      error = err;
    } finally {
      loading = false;
    }
  });
</script>

{#if loading}
  <div class="loading-spinner">読み込み中...</div>
{:else if error}
  <div class="error-message">エラー: {error.message}</div>
{:else}
  <div class="data-content">
    {#each data as item}
      <div class="item">{item.name}</div>
    {/each}
  </div>
{/if}
```

### 2. 無限スクロールパターン

```svelte
<!-- InfiniteScrollPattern.svelte -->
<script>
  import { onMount } from 'svelte';
  
  let items = [];
  let loading = false;
  let hasMore = true;
  let page = 0;
  
  async function loadMore() {
    if (loading || !hasMore) return;
    
    loading = true;
    try {
      const response = await fetch(`/api/items?page=${page}`);
      const newItems = await response.json();
      
      if (newItems.length === 0) {
        hasMore = false;
      } else {
        items = [...items, ...newItems];
        page++;
      }
    } catch (error) {
      console.error('Failed to load more items:', error);
    } finally {
      loading = false;
    }
  }
  
  onMount(() => {
    loadMore();
  });
</script>

<div class="infinite-scroll">
  {#each items as item}
    <div class="scroll-item">{item.title}</div>
  {/each}
  
  {#if loading}
    <div class="loading">読み込み中...</div>
  {/if}
  
  {#if hasMore && !loading}
    <button on:click={loadMore}>もっと読み込む</button>
  {/if}
</div>
```

### 3. リアルタイム更新パターン

```svelte
<!-- RealtimeUpdatePattern.svelte -->
<script>
  import { onMount, onDestroy } from 'svelte';
  
  let messages = [];
  let socket;
  
  onMount(async () => {
    // WebSocket接続
    socket = new WebSocket('ws://localhost:8080');
    
    socket.addEventListener('message', (event) => {
      const message = JSON.parse(event.data);
      messages = [...messages, message];
    });
    
    socket.addEventListener('error', (error) => {
      console.error('WebSocket error:', error);
    });
    
    // 初期データの取得
    try {
      const response = await fetch('/api/messages');
      messages = await response.json();
    } catch (error) {
      console.error('Failed to load initial messages:', error);
    }
  });
  
  onDestroy(() => {
    if (socket) {
      socket.close();
    }
  });
</script>

<div class="realtime-messages">
  {#each messages as message}
    <div class="message">
      <strong>{message.user}:</strong> {message.text}
    </div>
  {/each}
</div>
```

## パフォーマンス特性

### 1. レンダリング最適化

- **Lazy Loading**: 必要に応じてコンポーネントを遅延読み込み
- **Code Splitting**: 非同期コンポーネントの分割読み込み
- **Caching**: 非同期データのキャッシュ戦略

```svelte
<!-- LazyLoadingExample.svelte -->
<script>
  import { onMount } from 'svelte';
  
  let LazyComponent;
  
  onMount(async () => {
    // 動的インポートによる遅延読み込み
    const module = await import('./LazyComponent.svelte');
    LazyComponent = module.default;
  });
</script>

{#if LazyComponent}
  <svelte:component this={LazyComponent} />
{:else}
  <div class="lazy-loading">コンポーネントを読み込み中...</div>
{/if}
```

### 2. メモリ効率化

- **自動クリーンアップ**: 非同期処理の適切な終了処理
- **ガベージコレクション**: 不要なPromiseの解放

```svelte
<!-- MemoryOptimizedComponent.svelte -->
<script>
  import { onMount, onDestroy } from 'svelte';
  
  let abortController;
  let data = null;
  
  onMount(async () => {
    abortController = new AbortController();
    
    try {
      const response = await fetch('/api/data', {
        signal: abortController.signal
      });
      data = await response.json();
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Fetch error:', error);
      }
    }
  });
  
  onDestroy(() => {
    if (abortController) {
      abortController.abort();
    }
  });
</script>

{#if data}
  <div class="data-display">{data.content}</div>
{:else}
  <div class="loading">データを読み込み中...</div>
{/if}
```

### 3. SEO対応

- **SSR対応**: サーバーサイドレンダリングでの非同期データ処理
- **Hydration**: クライアントサイドでの段階的ハイドレーション

```svelte
<!-- SEOOptimizedComponent.svelte -->
<script>
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';
  
  export let initialData = null;
  
  let data = initialData;
  let loading = !initialData;
  
  onMount(async () => {
    if (browser && !data) {
      try {
        const response = await fetch('/api/seo-data');
        data = await response.json();
      } catch (error) {
        console.error('Failed to load SEO data:', error);
      } finally {
        loading = false;
      }
    }
  });
</script>

<svelte:head>
  {#if data}
    <title>{data.title}</title>
    <meta name="description" content={data.description} />
  {/if}
</svelte:head>

{#if loading}
  <div class="seo-loading">SEOデータを読み込み中...</div>
{:else if data}
  <div class="seo-content">
    <h1>{data.title}</h1>
    <p>{data.description}</p>
  </div>
{:else}
  <div class="seo-error">SEOデータの読み込みに失敗しました</div>
{/if}
```

## エラーハンドリング

### 1. 基本的なエラーハンドリング

```svelte
<!-- BasicErrorHandling.svelte -->
<script>
  import { createEventDispatcher } from 'svelte';
  
  const dispatch = createEventDispatcher();
  
  export let apiEndpoint;
  
  async function fetchData() {
    try {
      const response = await fetch(apiEndpoint);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      dispatch('error', { error });
      throw error;
    }
  }
</script>

{#await fetchData()}
  <div class="loading">データを読み込み中...</div>
{:then data}
  <div class="success">
    <h2>データ取得成功</h2>
    <pre>{JSON.stringify(data, null, 2)}</pre>
  </div>
{:catch error}
  <div class="error">
    <h2>エラーが発生しました</h2>
    <p>{error.message}</p>
    <button on:click={() => window.location.reload()}>
      再読み込み
    </button>
  </div>
{/await}
```

### 2. 複数のエラー状態管理

```svelte
<!-- MultipleErrorStates.svelte -->
<script>
  import { onMount } from 'svelte';
  
  let loadingState = 'idle';
  let data = null;
  let errors = [];
  
  async function loadData() {
    loadingState = 'loading';
    errors = [];
    
    try {
      const [users, posts, comments] = await Promise.allSettled([
        fetch('/api/users').then(r => r.json()),
        fetch('/api/posts').then(r => r.json()),
        fetch('/api/comments').then(r => r.json())
      ]);
      
      data = {
        users: users.status === 'fulfilled' ? users.value : [],
        posts: posts.status === 'fulfilled' ? posts.value : [],
        comments: comments.status === 'fulfilled' ? comments.value : []
      };
      
      // エラーの収集
      if (users.status === 'rejected') {
        errors.push({ type: 'users', message: users.reason.message });
      }
      if (posts.status === 'rejected') {
        errors.push({ type: 'posts', message: posts.reason.message });
      }
      if (comments.status === 'rejected') {
        errors.push({ type: 'comments', message: comments.reason.message });
      }
      
      loadingState = 'success';
    } catch (error) {
      loadingState = 'error';
      errors.push({ type: 'general', message: error.message });
    }
  }
  
  onMount(loadData);
</script>

{#if loadingState === 'loading'}
  <div class="loading">データを読み込み中...</div>
{:else if loadingState === 'success'}
  <div class="content">
    {#if errors.length > 0}
      <div class="partial-errors">
        <h3>一部のデータの読み込みに失敗しました:</h3>
        {#each errors as error}
          <p class="error-item">{error.type}: {error.message}</p>
        {/each}
      </div>
    {/if}
    
    {#if data.users.length > 0}
      <section class="users">
        <h2>ユーザー ({data.users.length})</h2>
        {#each data.users as user}
          <div class="user-card">{user.name}</div>
        {/each}
      </section>
    {/if}
    
    {#if data.posts.length > 0}
      <section class="posts">
        <h2>投稿 ({data.posts.length})</h2>
        {#each data.posts as post}
          <div class="post-card">{post.title}</div>
        {/each}
      </section>
    {/if}
  </div>
{:else if loadingState === 'error'}
  <div class="error">
    <h2>データの読み込みに失敗しました</h2>
    {#each errors as error}
      <p>{error.message}</p>
    {/each}
    <button on:click={loadData}>再試行</button>
  </div>
{/if}
```

## 制限事項と注意点

### 1. パフォーマンス考慮事項

- **過度な非同期処理**: 多数の同時非同期処理はパフォーマンスに影響
- **メモリリーク**: 適切なクリーンアップが必要
- **タイムアウト処理**: 長時間の非同期処理には適切なタイムアウト設定

### 2. SEOへの影響

- **初期レンダリング**: 非同期データは初期HTMLに含まれない
- **検索エンジン対応**: SSRやプリレンダリングの検討が必要
- **コンテンツの可用性**: 重要なコンテンツは初期表示で提供

### 3. ブラウザサポート

- **古いブラウザ**: IE11など古いブラウザでは制限あり
- **Promise対応**: Promiseをサポートしないブラウザではpolyfill必要
- **Fetch API**: fetchが使用できない環境では別途実装が必要

## ベストプラクティス

### 1. 適切なローディング状態の表示

```svelte
<!-- LoadingBestPractice.svelte -->
<script>
  import { onMount } from 'svelte';
  
  let loading = false;
  let progress = 0;
  let data = null;
  
  onMount(async () => {
    loading = true;
    try {
      // プログレス表示付きのデータ取得
      const response = await fetch('/api/large-data');
      const reader = response.body.getReader();
      const contentLength = +response.headers.get('Content-Length');
      
      let receivedLength = 0;
      const chunks = [];
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        chunks.push(value);
        receivedLength += value.length;
        progress = (receivedLength / contentLength) * 100;
      }
      
      const chunksAll = new Uint8Array(receivedLength);
      let position = 0;
      for (const chunk of chunks) {
        chunksAll.set(chunk, position);
        position += chunk.length;
      }
      
      const result = new TextDecoder().decode(chunksAll);
      data = JSON.parse(result);
    } finally {
      loading = false;
    }
  });
</script>

{#if loading}
  <div class="loading-with-progress">
    <p>データを読み込み中...</p>
    <div class="progress-bar">
      <div class="progress-fill" style="width: {progress}%"></div>
    </div>
    <p>{Math.round(progress)}%</p>
  </div>
{:else if data}
  <div class="data-display">
    {JSON.stringify(data, null, 2)}
  </div>
{/if}
```

### 2. 適切なエラー境界の設定

```svelte
<!-- ErrorBoundary.svelte -->
<script>
  import { createEventDispatcher } from 'svelte';
  
  const dispatch = createEventDispatcher();
  
  export let fallback = null;
  
  let error = null;
  let retryCount = 0;
  const maxRetries = 3;
  
  function handleError(event) {
    error = event.detail.error;
    retryCount++;
    
    if (retryCount < maxRetries) {
      setTimeout(() => {
        error = null;
        dispatch('retry');
      }, 1000 * retryCount);
    }
  }
  
  function reset() {
    error = null;
    retryCount = 0;
  }
</script>

{#if error}
  <div class="error-boundary">
    {#if fallback}
      <svelte:component this={fallback} {error} {reset} />
    {:else}
      <div class="default-error">
        <h2>エラーが発生しました</h2>
        <p>{error.message}</p>
        {#if retryCount < maxRetries}
          <p>自動的に再試行します... ({retryCount}/{maxRetries})</p>
        {:else}
          <button on:click={reset}>再試行</button>
        {/if}
      </div>
    {/if}
  </div>
{:else}
  <div on:error={handleError}>
    <slot />
  </div>
{/if}
```

## まとめ

Svelte 5.36.0で導入された非同期機能は、以下の点で優れています：

1. **簡潔な記述**: `{#await}`ブロックによる直感的な非同期処理
2. **パフォーマンス**: 効率的なレンダリングと最適化
3. **エラーハンドリング**: 堅牢なエラー処理機能
4. **SSR対応**: サーバーサイドレンダリングでの適切な処理

しかし、以下の点に注意が必要です：

1. **パフォーマンス**: 過度な非同期処理は避ける
2. **SEO**: 重要なコンテンツは初期表示で提供
3. **ブラウザサポート**: 古いブラウザへの対応検討

この機能を適切に活用することで、より良いユーザーエクスペリエンスを提供できます。

## 参考リンク

- [Svelte GitHub Discussion #15845](https://github.com/sveltejs/svelte/discussions/15845)
- [Svelte 5.36.0 Release Notes](https://github.com/sveltejs/svelte/releases/tag/v5.36.0)
- [Svelte公式ドキュメント](https://svelte.dev/)