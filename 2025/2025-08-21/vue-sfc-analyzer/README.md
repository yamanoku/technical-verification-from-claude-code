# Vue.js SFC解析ツール - Baseline Widely Available評価

Vue.jsのSingle File Component（.vueファイル）を解析し、各ブロック（template、script、style）内で使用されている機能のBaseline Widely Available互換性を評価するPoCツール。

## 概要

このツールは以下の機能を提供します：

1. **SFCブロック解析**: template、script、styleブロックの抽出と詳細解析
2. **機能検出**: 各ブロックで使用されているHTML要素、JavaScript機能、CSS機能の自動検出
3. **Baseline評価**: 検出された機能のBaseline Widely Available準拠状況の評価

## 技術仕様

### 依存ライブラリ（最新版調査済み 2025-08-21）

| ライブラリ | バージョン | 用途 |
|-----------|-----------|------|
| @vue/compiler-sfc | 3.5.18 | Vue SFCの公式パーサー |
| compute-baseline | 0.3.1 | Baselineステータス自動計算 |
| @mdn/browser-compat-data | 6.1.4 | MDN互換性データベース |
| web-features | 2.44.0 | Web標準機能定義データ |

### アーキテクチャ

```
Vue SFCファイル
    ↓
@vue/compiler-sfc でパース
    ↓
各ブロック（template/script/style）抽出
    ↓
機能検出エンジン
    ↓
Baseline評価エンジン
    ↓
互換性レポート出力
```

## 使用方法

### インストール

```bash
cd 2025-08-21/vue-sfc-analyzer
npm install
```

### CLI実行

```bash
# 特定の.vueファイルを解析
node index.js path/to/component.vue

# テスト実行
npm test
```

### プログラム内での使用

```javascript
import VueSFCAnalyzer from './index.js';

const analyzer = new VueSFCAnalyzer();

// ファイルから解析
const result = await analyzer.analyzeFile('component.vue');

// 文字列コンテンツから解析
const result = await analyzer.analyzeContent(vueFileContent, 'component.vue');

// レポート生成
console.log(analyzer.generateReport(result));
```

## 解析機能詳細

### Template ブロック解析

- **HTML要素検出**: 使用されているHTMLタグの抽出
- **属性検出**: Vue指定以外のHTML属性の抽出
- **アクセシビリティ**: ARIA属性の検出と評価

**検出例**:
- 要素: `div`, `section`, `article`, `button`
- 属性: `class`, `id`, `aria-label`, `disabled`

### Script ブロック解析

- **ES6+機能**: モダンJavaScript機能の検出
- **TypeScript**: 型システムの使用状況
- **Vue Composition API**: setup糖衣構文の解析

**検出機能例**:
- `arrow-functions`: アロー関数
- `async-await`: 非同期処理
- `template-literals`: テンプレートリテラル
- `spread-syntax`: スプレッド構文
- `block-scoping`: let/const

### Style ブロック解析

- **CSS機能**: モダンCSS機能の検出
- **プリプロセッサ**: Sass/SCSS、Less対応
- **CSS変数**: カスタムプロパティの使用

**検出機能例**:
- `css-grid`: CSS Grid Layout
- `flexbox`: Flexbox
- `css-custom-properties`: CSS変数
- `css-calc`: calc()関数
- `css-transforms`: 変形

## Baseline Widely Available評価

### 評価レベル

1. **Widely Available**: 全主要ブラウザで2.5年以上安定サポート
2. **Newly Available**: 全主要ブラウザでサポートされているが2.5年未満
3. **Not Baseline**: 一部ブラウザで未サポートまたは実験的機能

### 評価アルゴリズム

```javascript
// 総合評価の決定ロジック
if (notBaselineFeatures.length > 0) {
    overallStatus = 'not-baseline';  // 未対応機能がある
} else if (newlyAvailableFeatures.length > 0) {
    overallStatus = 'newly';         // 新機能がある
} else {
    overallStatus = 'widely';        // すべて安定対応
}
```

## 出力レポート例

```
=== Vue SFC解析レポート: test-component.vue ===

📄 Template (html):
  - 要素: div, h1, section, article, header, p, button
  - 属性: class, id, aria-label, disabled

⚙️ Script Setup (ts):
  - 機能: arrow-functions, async-await, block-scoping, spread-syntax, template-literals

🎨 Style 1 (scss):
  - Scoped: true
  - 機能: css-grid, css-custom-properties, css-media-queries, css-transforms, css-transitions, css-calc

🎯 Baseline Widely Available評価:
  - 総合評価: newly
  - 検出機能数: 18
  - Widely Available: 12個
  - Newly Available: 6個
  - Not Baseline: 0個
```

## 技術要件と制約

### 必須技術要件

1. **Node.js環境**: ES Modules対応（Node.js 14+）
2. **Vue 3対応**: Composition API、script setup構文
3. **TypeScript対応**: .ts/.tsxファイルの解析
4. **プリプロセッサ対応**: Sass/SCSS、Less

### 現在の制約

1. **簡易的な機能検出**: 正規表現ベースのパターンマッチング
2. **限定的なBaseline評価**: 実際のweb-featuresデータとの完全連携未実装
3. **構文解析レベル**: ASTレベルの詳細解析は未対応

### 将来の拡張可能性

1. **AST解析**: より正確な機能検出のためのAbstract Syntax Tree活用
2. **リアルタイム評価**: web-features APIとの動的連携
3. **カスタム評価**: プロジェクト固有の互換性要件設定
4. **CI/CD統合**: GitHub Actions等での自動評価

## 関連技術情報

### Web Platform Baseline

- **公式サイト**: https://web.dev/baseline/
- **仕様**: https://github.com/web-platform-dx/web-features
- **計算ライブラリ**: https://github.com/web-platform-dx/compute-baseline

### Vue.js SFC

- **compiler-sfc**: https://github.com/vuejs/core/tree/main/packages/compiler-sfc
- **RFC**: https://github.com/vuejs/rfcs/blob/master/active-rfcs/0040-script-setup.md

### 互換性データ

- **MDN BCD**: https://github.com/mdn/browser-compat-data
- **Can I Use**: https://caniuse.com/
- **Browserslist**: https://github.com/browserslist/browserslist

## ライセンス

MIT License

## 作成者

Claude Code - 2025-08-21