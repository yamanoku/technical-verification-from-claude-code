# Technical Verification Repository

このリポジトリは、Claude Code GitHub Actionsを使用した技術検証を行うためのプロジェクトです。

## 概要

このプロジェクトでは、Claude CodeのGitHub Actions機能を活用して様々な技術検証を実施します。

検証は日付ベースで整理され、GitHub IssuesとPull Requestsを通じて管理されます。

## ワークフロー

1. **Issue作成**: 技術検証のリクエストをGitHub Issueで作成されるのを確認
2. **日付ディレクトリ**: 作られたいIssueの検証日に基づいて新しいディレクトリを作成
3. **技術検証**: 与えられた課題を元に技術検証を実施
4. **Pull Request**: 検証結果をPRで提出

## ディレクトリ構造

```md
technical-verification-from-calude-code/
├── YYYY-MM-DD/          # 日付ごとの検証ディレクトリ
│   ├── project/         # 検証対象のプロジェクト（ディレクトリ名は任意）
│   └── README.md        # 検証内容の説明
└── CLAUDE.md           # このファイル
```

## 検証項目例

- 新しいフレームワークやライブラリの評価
- アーキテクチャパターンの検証
- パフォーマンス最適化の検証
- セキュリティ対策の実装検証
- 開発ツールの有効性検証

# YOU MUST（必須事項）：必ずやってほしいこと

- 各検証は独立したディレクトリで実施
- 検証結果は必ずドキュメント化（README.md）を作成する
- セキュリティに関わる検証は特に慎重に実施（例：環境変数を露呈させない）
- ログとしてのoutput.txtはPR内に作成しない
