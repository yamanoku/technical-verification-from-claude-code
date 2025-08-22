# eslint-plugin-tailwindcss v4.0-beta.0 Investigation

## 概要

このディレクトリは、eslint-plugin-tailwindcss v4.0-beta.0の機能調査を行うためのプロジェクトです。Tailwind CSS 4に対応したベータ版ESLintプラグインがどの程度既存のLintルールを適切に処理できるかを検証しています。

## 調査対象

- **パッケージ**: eslint-plugin-tailwindcss v4.0-beta.0
- **リリース情報**: https://github.com/francoismassart/eslint-plugin-tailwindcss/releases/tag/v4.0.0-beta.0
- **対応バージョン**: Tailwind CSS 4 beta対応

## プロジェクト構造

```
eslint-plugin-tailwindcss-v4-investigation/
├── package.json              # プロジェクト設定とv4.0-beta.0依存関係
├── .eslintrc.js              # ESLint設定（全ルール有効）
├── tailwind.config.js        # Tailwind CSS設定
├── .gitignore               # Git除外設定
├── samples/                 # テストサンプルファイル
│   ├── basic.html           # 基本HTMLパターン
│   ├── React.jsx            # Reactコンポーネントパターン
│   ├── TypeScript.tsx       # TypeScriptパターン
│   └── Vue.vue              # Vueコンポーネントパターン
└── README.md                # このファイル
```

## 検証対象のESLintルール

### 1. classnames-order
**目的**: Tailwindクラスの順序を統一する
**テストパターン**:
```html
<!-- 正しい順序 -->
<div class="bg-blue-500 text-white p-4 m-2">Basic utilities</div>

<!-- 間違った順序（検出されるべき） -->
<div class="p-4 bg-red-500 m-2 text-white">Unordered classes</div>
```

### 2. no-contradicting-classname
**目的**: 矛盾するクラス名を検出する
**テストパターン**:
```html
<!-- 検出されるべき -->
<div class="bg-blue-500 bg-red-500">Contradicting backgrounds</div>
<div class="flex block">Contradicting display</div>
```

### 3. enforces-shorthand
**目的**: 省略記法の使用を強制する
**テストパターン**:
```html
<!-- 検出されるべき -->
<div class="padding-top-4 padding-bottom-4 padding-left-4 padding-right-4">Should use p-4</div>
<div class="margin-top-4 margin-bottom-4">Should use my-4</div>
```

### 4. no-unnecessary-arbitrary-value
**目的**: 不要な任意値の使用を検出する
**テストパターン**:
```html
<!-- 検出されるべき -->
<div class="bg-[red] text-[16px] p-[4px]">Unnecessary arbitrary values</div>

<!-- 正当な任意値 -->
<div class="bg-[#ff6600] text-[clamp(1rem,2.5vw,2rem)]">Complex arbitrary values</div>
```

### 5. enforces-negative-arbitrary-values
**目的**: 負の値に対する適切な記法を強制する
**テストパターン**:
```html
<div class="mt-[-20px] ml-[-10px]">Negative arbitrary values</div>
```

## フレームワーク別テストパターン

### HTML (basic.html)
- 基本的なTailwindユーティリティクラス
- レスポンシブデザインパターン
- 擬似要素・状態（hover, focus）
- 任意値とグラデーション

### React (React.jsx)
- 動的クラス名（条件分岐）
- テンプレートリテラルでのクラス指定
- イベントハンドラーとの組み合わせ
- フォームコンポーネント

### TypeScript (TypeScript.tsx)
- 型安全なクラス名生成関数
- インターフェースを使用した props
- 複雑なコンポーネント構成
- 条件付きレンダリング

### Vue (Vue.vue)
- リアクティブなクラスバインディング
- v-bind:class パターン
- Vue ディレクティブとの組み合わせ
- トランジション効果

## 期待される検証結果

### v4.0-beta.0で改善されると期待される点

1. **Tailwind CSS 4の新機能サポート**
   - 新しいユーティリティクラスの認識
   - 改善された任意値の処理
   - より正確なクラス名検証

2. **パフォーマンス向上**
   - より高速なリント処理
   - メモリ使用量の最適化

3. **より正確なエラー検出**
   - 誤検出の減少
   - より適切なエラーメッセージ

### 検証すべき課題

1. **既存ルールの互換性**
   - v3で動作していたルールがv4でも正常に機能するか
   - 新しい構文に対する対応状況

2. **フレームワーク対応**
   - React, Vue, TypeScript での動作確認
   - 動的クラス名の正確な解析

3. **設定の柔軟性**
   - カスタムTailwind設定との連携
   - プロジェクト固有の設定への対応

## 実行方法

```bash
# 依存関係をインストール
npm install

# 全ファイルのリント実行
npm run lint

# 自動修正可能な問題を修正
npm run lint:fix
```

## 調査結果

### テスト環境

- **Node.js**: 最新バージョン
- **ESLint**: v9.31.0 (フラット設定形式)
- **サンプルファイル**: React JSX、TypeScript TSX、Vue SFC、HTML

### ✅ Tailwind CSS v3 互換性

**設定:**
- tailwindcss: v3.4.17
- eslint-plugin-tailwindcss: v3.18.2 (安定版)
- 従来のtailwind.config.js設定

**結果:**
- ✅ ESLintルールが正常に動作
- ✅ サンプルファイル全体で46個のクラス順序と競合クラス名のエラーを検出
- ✅ すべてのTailwind CSSルールが期待通りに機能
- ✅ React、TypeScript、Vueファイルをサポート

### ❌ Tailwind CSS v4 互換性の問題

**設定:**
- tailwindcss: v4.1.11 (最新安定版)
- eslint-plugin-tailwindcss: v4.0-beta.0
- @configディレクティブを使用したCSS-first設定

**結果:**
- ❌ **致命的エラー**: `Could not resolve tailwindcss`
- ❌ プラグインがTailwind CSS v4設定を読み込めない
- ❌ 根本原因: tailwind-api-utils依存関係の非互換性

### 技術的分析

#### エラーの詳細
```
Error: Could not resolve tailwindcss
    at TailwindUtils.loadConfigV4 (/path/to/tailwind-api-utils/dist/index.cjs:391:13)
    at TailwindUtils.loadConfig (/path/to/tailwind-api-utils/dist/index.cjs:381:18)
```

#### 根本原因
eslint-plugin-tailwindcss v4.0-beta.0が使用している`tailwind-api-utils`パッケージが、Tailwind CSS v4の新しいアーキテクチャと設定システムと完全に互換性がありません。

### 推奨事項

1. **本番環境での使用**: eslint-plugin-tailwindcss v3.18.2とTailwind CSS v3.4.17の組み合わせを継続使用
2. **Tailwind CSS v4の使用**: v4を適切にサポートするeslint-plugin-tailwindcssの安定版リリースを待つ
3. **ベータテスト**: v4.0-beta.0プラグインは、Tailwind CSS v4のCSS-firstアプローチをサポートするために、さらなる開発が必要

### 使用した設定ファイル

#### Tailwind CSS v3 セットアップ
- 従来のJS設定による`tailwind.config.js`
- 標準的なコンテンツパターンとテーマ拡張

#### Tailwind CSS v4 セットアップ
- @configディレクティブを使用した`tailwind.css`
- CSS-first設定アプローチ
- CSSファイルを指すようにESLint設定を更新

## 結論

eslint-plugin-tailwindcss v4.0-beta.0は、Tailwind CSS v4サポートに向けた進歩を示していますが、新しいTailwind CSS v4アーキテクチャとの根本的な互換性の問題により、本番環境での使用にはまだ準備が整っていません。

この調査により、現在のプロダクション環境ではeslint-plugin-tailwindcss v3.18.2とTailwind CSS v3.4.17の組み合わせを継続使用することが推奨されます。Tailwind CSS v4の採用は、プラグインが完全に対応した安定版がリリースされるまで待つことが安全です。