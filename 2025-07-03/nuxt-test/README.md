# Nuxt + Simple Scope SSR検証

## 概要

NuxtのSSR環境でSimple scopeライブラリを使用した際のハイドレーションエラーを検証します。

## 検証内容

### 1. 基本的な問題点

Simple scopeライブラリは以下の理由でSSR環境でハイドレーションエラーを引き起こします：

#### 問題1: ID生成のタイミング差
- **サーバーサイド**: `nuxt build` 時またはリクエスト時にIDを生成
- **クライアントサイド**: ブラウザでのJavaScript実行時にIDを生成
- **結果**: 異なるタイミングで異なるIDが生成される

#### 問題2: ランダム値のソース差
- **サーバーサイド**: Node.js環境のランダム値生成
- **クライアントサイド**: ブラウザ環境のランダム値生成
- **結果**: 同じシードでも環境によって異なる値

#### 問題3: 初期化状態の違い
- Simple scopeがクライアント専用の状態を持つ場合、サーバーでは正常に動作しない

### 2. 期待される症状

```bash
# 開発時のコンソールエラー例
[Vue warn]: Hydration node mismatch:
- Client vnode: div 
- Server vnode: div 

[Vue warn]: Hydration children mismatch on <div>:
- Server rendered: "scope-abc123"
- Client rendered: "scope-def456"
```

### 3. 検証手順

```bash
# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev

# プロダクションビルドとプレビュー
npm run build
npm run preview
```

### 4. 確認ポイント

1. **コンソールでのハイドレーションエラー**
   - ブラウザの開発者ツールでVue hydrationエラーを確認
   
2. **ID値の比較**
   - サーバーサイドで生成されたIDとクライアントサイドで生成されたIDが異なることを確認

3. **パフォーマンス影響**
   - ハイドレーションエラーによる再レンダリングのパフォーマンス影響

### 5. 解決策

#### 解決策1: クライアントサイドのみで使用
```vue
<template>
  <div>
    <span v-if="scopeId">{{ scopeId }}</span>
    <span v-else>Loading...</span>
  </div>
</template>

<script setup>
const scopeId = ref('')

onMounted(async () => {
  const { scope } = await import('@simple-stack/scope')
  scopeId.value = scope()
})
</script>
```

#### 解決策2: サーバーサイドでのID固定
```vue
<script setup>
// サーバーサイドでは固定値を使用
const scopeId = ref(process.server ? 'ssr-placeholder' : '')

onMounted(async () => {
  const { scope } = await import('@simple-stack/scope')
  scopeId.value = scope()
})
</script>
```

#### 解決策3: ClientOnly コンポーネント使用
```vue
<template>
  <div>
    <ClientOnly>
      <ScopeComponent />
      <template #fallback>
        <div>Loading scope...</div>
      </template>
    </ClientOnly>
  </div>
</template>
```

### 6. 推奨事項

1. **SSR環境では使用を避ける**: Simple scopeは純粋にクライアントサイドのライブラリとして使用
2. **LazyHydration**: ハイドレーション後にのみ初期化
3. **代替案**: SSR対応のUUID生成ライブラリ（nanoid等）の使用を検討

## 結論

Simple scopeライブラリは設計上、クライアントサイド専用であり、SSR環境では必然的にハイドレーションエラーが発生します。この問題はライブラリの設計思想によるものであり、SSR環境で使用する場合は適切な回避策の実装が必要です。