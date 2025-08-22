# Vue.js SFC パースライブラリと Baseline Widely Available 調査結果

## 調査日
2025年8月21日

## 調査概要
Vue.js Single File Component (SFC) のパースライブラリの最新版と、Web Platform Baseline の互換性評価ツールについて調査しました。

## Vue.js SFC パースライブラリ

### 1. @vue/compiler-sfc（公式コンパイラ）
- **最新バージョン**: 3.5.18
- **説明**: Vue 3の公式Single File Componentコンパイラ
- **機能**: Vue SFCファイルのパース、コンパイル、変換
- **公式ドキュメント**: https://github.com/vuejs/core/tree/main/packages/compiler-sfc#readme
- **リポジトリ**: https://github.com/vuejs/core（packages/compiler-sfc）

### 2. @vue/language-core
- **最新バージョン**: 3.0.6
- **説明**: Vue Language Toolsのコア機能
- **機能**: IDE向けのVue SFC解析とTypeScriptサポート
- **リポジトリ**: https://github.com/vuejs/language-tools（packages/language-core）

### 3. @vue/component-compiler（レガシー）
- **最新バージョン**: 4.2.4
- **説明**: バンドラー非依存のVue SFCコンパイルAPI
- **状態**: Vue 2向け、メンテナンス終了
- **公式ドキュメント**: https://github.com/vuejs/vue-component-compiler#readme

### 4. twoslash-vue
- **最新バージョン**: 0.3.4
- **説明**: Vue SFC対応のTwoslash拡張
- **機能**: Vue SFCファイルのコードハイライトと型チェック
- **公式ドキュメント**: https://github.com/twoslashes/twoslash#readme

### 5. @vitejs/plugin-vue
- **最新バージョン**: 6.0.1
- **説明**: ViteでのVue SFCサポートのための公式プラグイン
- **機能**: Viteビルドシステム内でのVue SFCの処理
- **公式ドキュメント**: https://github.com/vitejs/vite-plugin-vue/tree/main/packages/plugin-vue#readme

## Baseline Widely Available 評価ツール

### 1. web-features
- **最新バージョン**: 2.44.0
- **説明**: Web Platform機能のキュレートされたリスト
- **機能**: Web標準機能とその対応状況の管理
- **公式ドキュメント**: https://github.com/web-platform-dx/web-features#readme

### 2. compute-baseline
- **最新バージョン**: 0.3.1
- **説明**: ブラウザ互換性データからweb-featuresステータスを計算するライブラリ
- **機能**: Baseline Widely Availableステータスの自動判定
- **公式ドキュメント**: https://github.com/web-platform-dx/web-features#readme
- **リポジトリ**: https://github.com/web-platform-dx/web-features（packages/compute-baseline）

### 3. browserslist-config-baseline
- **最新バージョン**: 0.5.0
- **説明**: Web Platform Baselineに基づいたbrowserslist設定
- **機能**: Baseline準拠のブラウザターゲット設定
- **公式ドキュメント**: https://github.com/web-platform-dx/browserslist-config-baseline#readme

### 4. @mdn/browser-compat-data
- **最新バージョン**: 6.1.4
- **説明**: MDN Web Docsが提供するブラウザ互換性データ
- **機能**: 詳細なブラウザサポート情報の提供
- **公式ドキュメント**: https://github.com/mdn/browser-compat-data#readme

### 5. caniuse-db / caniuse-lite
- **最新バージョン**: 1.0.30001735
- **説明**: Can I Useからの生ブラウザ/機能サポートデータ
- **機能**: 幅広いブラウザサポート情報
- **公式ドキュメント**: https://github.com/Fyrd/caniuse#readme

## 推奨アーキテクチャ

Vue SFC パースと互換性分析のPoCツール構築に推奨する構成：

### SFCパース層
- **@vue/compiler-sfc** (3.5.18): SFCファイルの解析と分離
- template、script、style ブロックの抽出

### 互換性評価層
- **compute-baseline** (0.3.1): Baseline Widely Availableステータス計算
- **@mdn/browser-compat-data** (6.1.4): 詳細な互換性データ
- **web-features** (2.44.0): 標準化された機能定義

### 追加考慮事項
- HTML/CSS/JavaScript の各機能に対して個別の互換性チェック
- Baseline Widely Available の定義に従った評価ロジック
- TypeScript型定義の活用によるタイプセーフな実装

## Web Platform Baseline について

Web Platform Baseline は、Webプラットフォーム機能がすべての主要ブラウザで安定的にサポートされているかを示す標準です。

- **Baseline Widely Available**: 全ての主要ブラウザで2.5年以上安定サポートされている機能
- **Baseline Newly Available**: 全ての主要ブラウザでサポートされているが、2.5年未満の機能

## 次のステップ

1. @vue/compiler-sfcを使用したSFCパースの実装
2. compute-baselineを使用した互換性評価の実装
3. template、script、styleブロック別の詳細解析
4. Baseline Widely Availableステータスのレポート機能
