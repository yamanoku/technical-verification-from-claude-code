# Astro + Simple Scope SSR検証

## 概要

AstroのSSR環境でSimple scopeライブラリを使用した際のハイドレーションエラーを検証します。

## 検証内容

### 1. Astro固有の問題点

AstroにおけるSimple scopeの使用で発生する問題：

#### 問題1: Server Component vs Client Script
- **Astro Component（上部）**: サーバーサイドでScope IDを生成
- **`<script>` タグ**: クライアントサイドでScope IDを生成
- **結果**: 同じページ内で異なるIDが表示される

#### 問題2: Islands Architecture Impact
- Astroのアイランドアーキテクチャでは、各アイランドが独立してハイドレートされる
- Simple scopeの状態がアイランド間で共有されない可能性

#### 問題3: Build-time vs Runtime Generation
```astro
---
// Build時に実行される（Static Site Generation）
const buildTimeId = scope();
---

<script>
  // Runtime時に実行される
  const runtimeId = scope();
</script>
```

### 2. 期待される症状

```bash
# コンソールエラー例（Astroでは詳細なハイドレーションエラーは表示されにくい）
Warning: Content mismatch detected

# または単純にサーバーとクライアントで異なる値が表示される
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

### 4. Astro特有の確認ポイント

1. **Server Component Execution**
   - Astroコンポーネントの上部（---間）でのScope生成結果
   
2. **Client Script Execution**
   - `<script>`タグ内でのScope生成結果との比較
   
3. **Visual Comparison**
   - ページ上で直接的にサーバー値とクライアント値を比較

### 5. Astro向け解決策

#### 解決策1: Client-only Script
```astro
---
// サーバーサイドではScope生成を行わない
const useClientScope = true;
---

<div>
  <p>Scope ID: <span id="scope-display">Loading...</span></p>
</div>

<script>
  // クライアントサイドのみで実行
  async function initScope() {
    const { scope } = await import('@simple-stack/scope');
    const scopeId = scope();
    document.getElementById('scope-display').textContent = scopeId;
  }
  
  initScope();
</script>
```

#### 解決策2: Client Directive Usage
```astro
---
import ScopeComponent from '../components/ScopeComponent.astro';
---

<!-- client:loadディレクティブでクライアントサイドのみで実行 -->
<ScopeComponent client:load />
```

#### 解決策3: Conditional Rendering
```astro
---
const isServer = typeof window === 'undefined';
---

{isServer ? (
  <div>Server: Scope will be generated on client</div>
) : (
  <div id="client-scope">Client scope loading...</div>
)}

<script>
  if (typeof window !== 'undefined') {
    import('@simple-stack/scope').then(({ scope }) => {
      const element = document.getElementById('client-scope');
      if (element) {
        element.textContent = `Client: ${scope()}`;
      }
    });
  }
</script>
```

#### 解決策4: API Route Integration
```javascript
// src/pages/api/scope.js
export async function GET() {
  // APIルートではSimple scopeを使用せず、
  // サーバーサイド対応のUUID生成ライブラリを使用
  const { v4: uuidv4 } = await import('uuid');
  
  return new Response(JSON.stringify({
    id: uuidv4(),
    timestamp: Date.now()
  }), {
    headers: {
      'Content-Type': 'application/json'
    }
  });
}
```

### 6. Astro特有の注意事項

1. **Output Mode**: `output: 'server'` vs `output: 'static'` での動作の違い
2. **Adapter Dependency**: 使用するアダプター（Node.js, Vercel, Netlify等）による影響
3. **Build Process**: `astro build`時の静的生成と動的生成の混在

### 7. パフォーマンス考慮事項

#### 利点
- **Partial Hydration**: 必要な部分のみハイドレートされるため影響が限定的
- **Island Architecture**: 他のコンポーネントに影響を与えにくい

#### 欠点
- **Content Layout Shift**: クライアントサイドでの値更新による レイアウトシフト
- **JavaScript Loading**: 追加のJavaScriptロードによる初期表示の遅延

### 8. デバッグ方法

```astro
---
// デバッグ用の情報表示
const debugInfo = {
  isServer: typeof window === 'undefined',
  timestamp: new Date().toISOString(),
  env: import.meta.env.MODE
};
---

<div class="debug-info">
  <h3>Debug Information</h3>
  <pre>{JSON.stringify(debugInfo, null, 2)}</pre>
</div>

<script>
  // クライアントサイドデバッグ情報
  console.log('Client-side execution:', {
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
    url: window.location.href
  });
</script>
```

## 結論

AstroにおけるSimple scopeの使用も、他のフレームワーク同様にSSR/CSRでの値の不一致を引き起こします。しかし、Astroのアイランドアーキテクチャにより、影響範囲を限定的に抑えることができます。根本的な解決にはクライアントサイド専用での使用が推奨されますが、Astroの柔軟なレンダリング戦略を活用することで、より良いユーザー体験を提供できます。