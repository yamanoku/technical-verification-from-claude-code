# SvelteKit + Simple Scope SSR検証

## 概要

SvelteKitのSSR環境でSimple scopeライブラリを使用した際のハイドレーションエラーを検証します。

## 検証内容

### 1. SvelteKit固有の問題点

SvelteKitにおけるSimple scopeの使用で発生する問題：

#### 問題1: Server Load vs Client Load
- **`+page.server.js`**: サーバーサイドでScope IDを生成
- **`onMount`**: クライアントサイドでScope IDを生成
- **結果**: 異なる実行コンテキストで異なるIDが生成される

#### 問題2: Browser Environment Check
- `browser` 変数によるクライアント/サーバー分岐があっても、初期レンダリング時のミスマッチは解決されない

#### 問題3: Reactive Statements
```javascript
// これは危険
$: if (browser) {
  scopeId = scope(); // リアクティブな値の変更がSSR/CSRで異なる
}
```

### 2. 期待される症状

```bash
# コンソールエラー例
Warning: Text content did not match. Server: "scope-server123" Client: "scope-client456"

# SvelteKit hydration エラー
Hydration failed because the initial UI does not match what was rendered on the server.
```

### 3. 検証手順

```bash
# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev

# プロダクションビルドとプレビュー
npm run build && npm run preview
```

### 4. SvelteKit特有の確認ポイント

1. **Server vs Client Data**
   - `+page.server.js`で生成されるデータと`onMount`で生成されるデータの差異
   
2. **Browser Environment Handling**
   - `browser`変数の適切な使用方法
   
3. **Load Function Integration**
   - Server loadとClient loadでの一貫性

### 5. SvelteKit向け解決策

#### 解決策1: Client-only Rendering
```svelte
<script>
  import { browser } from '$app/environment';
  import { onMount } from 'svelte';
  
  let scopeId = '';
  
  onMount(async () => {
    if (browser) {
      const { scope } = await import('@simple-stack/scope');
      scopeId = scope();
    }
  });
</script>

{#if browser && scopeId}
  <div>Scope: {scopeId}</div>
{:else}
  <div>Loading...</div>
{/if}
```

#### 解決策2: Server Load Avoidance
```javascript
// +page.server.js - Simple scopeを使用しない
export async function load() {
  return {
    // サーバーサイドではSimple scopeを使用せず、
    // プレースホルダーやメタデータのみを渡す
    needsClientScope: true
  };
}
```

#### 解決策3: Progressive Enhancement
```svelte
<script>
  export let data;
  let clientScopeId = '';
  
  onMount(async () => {
    if (data.needsClientScope) {
      const { scope } = await import('@simple-stack/scope');
      clientScopeId = scope();
    }
  });
</script>

<!-- SSRでは表示されず、クライアントでのみ表示 -->
{#if clientScopeId}
  <div>Client Scope: {clientScopeId}</div>
{/if}
```

#### 解決策4: Custom Store Pattern
```javascript
// stores/scope.js
import { writable } from 'svelte/store';
import { browser } from '$app/environment';

export const scopeStore = writable('');

if (browser) {
  import('@simple-stack/scope').then(({ scope }) => {
    scopeStore.set(scope());
  });
}
```

### 6. SvelteKit特有の注意事項

1. **SSR vs CSR Mode**: `svelte.config.js`の設定によって動作が変わる
2. **Adapter Selection**: 使用するアダプターによってSSRの挙動が異なる
3. **PreRendering**: プリレンダリング時の静的生成と動的生成の違い

### 7. パフォーマンス考慮事項

- **FOIT (Flash of Invisible Text)**: クライアントサイドでのScope生成完了まで表示されない
- **Layout Shift**: クライアントサイドでの値挿入によるレイアウトシフト
- **Bundle Size**: 動的インポートによるコード分割の効果

## 結論

SvelteKitにおけるSimple scopeの使用は、他のフレームワーク同様にハイドレーションエラーを引き起こします。SvelteKitの`browser`環境変数や`onMount`ライフサイクルを適切に使用することで回避できますが、根本的にはクライアントサイド専用ライブラリとして扱うことが推奨されます。