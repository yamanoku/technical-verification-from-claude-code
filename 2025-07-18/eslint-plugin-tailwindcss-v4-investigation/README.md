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

## 調査結果まとめ

### 検出されるべきエラーパターン

| ファイル | 行 | エラータイプ | 内容 |
|---------|---|------------|------|
| basic.html | - | classnames-order | クラスの順序不正 |
| basic.html | - | no-contradicting-classname | 背景色の重複指定 |
| basic.html | - | enforces-shorthand | padding個別指定 |
| basic.html | - | no-unnecessary-arbitrary-value | 不要な任意値 |
| React.jsx | - | classnames-order | ボタンクラスの順序 |
| React.jsx | - | no-contradicting-classname | display系の競合 |
| TypeScript.tsx | - | 各種エラーパターン | 意図的な問題のあるコード |
| Vue.vue | - | 各種エラーパターン | 意図的な問題のあるコード |

### v4.0-beta.0の評価ポイント

1. **✅ 期待される改善点**
   - Tailwind CSS 4の新機能に対応
   - より正確なクラス名検証
   - パフォーマンス向上

2. **⚠️ 注意すべき点**
   - ベータ版のため、一部不安定な可能性
   - 既存プロジェクトでの互換性確認が必要
   - ドキュメント更新の遅れ

3. **🔄 継続監視項目**
   - 正式版リリースでの変更点
   - コミュニティフィードバックの反映
   - エコシステム全体との互換性

## 結論

eslint-plugin-tailwindcss v4.0-beta.0は、Tailwind CSS 4への対応を図る重要なアップデートです。既存のルールセットは概ね機能すると予想されますが、新機能への対応と既存コードとの互換性について継続的な検証が必要です。

プロダクション環境での使用前に、プロジェクト固有のコードベースでの十分なテストを推奨します。