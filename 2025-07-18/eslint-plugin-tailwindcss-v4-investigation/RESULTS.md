# eslint-plugin-tailwindcss v4.0-beta.0 調査結果

## 概要

この調査では、eslint-plugin-tailwindcss v4.0-beta.0 とTailwind CSS v3およびv4の互換性をテストしました。

## テスト環境

- **Node.js**: 最新バージョン
- **ESLint**: v9.31.0 (フラット設定形式)
- **サンプルファイル**: React JSX、TypeScript TSX、Vue SFC、HTML

## 結果

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

## 技術的分析

### エラーの詳細
```
Error: Could not resolve tailwindcss
    at TailwindUtils.loadConfigV4 (/path/to/tailwind-api-utils/dist/index.cjs:391:13)
    at TailwindUtils.loadConfig (/path/to/tailwind-api-utils/dist/index.cjs:381:18)
```

### 根本原因
eslint-plugin-tailwindcss v4.0-beta.0が使用している`tailwind-api-utils`パッケージが、Tailwind CSS v4の新しいアーキテクチャと設定システムと完全に互換性がありません。

## 推奨事項

1. **本番環境での使用**: eslint-plugin-tailwindcss v3.18.2とTailwind CSS v3.4.17の組み合わせを継続使用
2. **Tailwind CSS v4の使用**: v4を適切にサポートするeslint-plugin-tailwindcssの安定版リリースを待つ
3. **ベータテスト**: v4.0-beta.0プラグインは、Tailwind CSS v4のCSS-firstアプローチをサポートするために、さらなる開発が必要

## 使用した設定ファイル

### Tailwind CSS v3 セットアップ
- 従来のJS設定による`tailwind.config.js`
- 標準的なコンテンツパターンとテーマ拡張

### Tailwind CSS v4 セットアップ
- @configディレクティブを使用した`tailwind.css`
- CSS-first設定アプローチ
- CSSファイルを指すようにESLint設定を更新

## 結論

eslint-plugin-tailwindcss v4.0-beta.0は、Tailwind CSS v4サポートに向けた進歩を示していますが、新しいTailwind CSS v4アーキテクチャとの根本的な互換性の問題により、本番環境での使用にはまだ準備が整っていません。