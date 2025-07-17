// TypeScript 5.9 Beta - Breaking Changes と移行戦略の例

// 1. より厳密な型推論による Breaking Changes

// 【Before (TypeScript 5.8 以前)】
// 以下のコードは以前は型エラーにならなかった
interface OldUser {
  id: number;
  name: string;
  email?: string;
}

// 【After (TypeScript 5.9 Beta)】
// より厳密な型チェックによりエラーが発生するケース
interface NewUser {
  id: number;
  name: string;
  email?: string;
}

// 【Migration Strategy】
// 明示的な型注釈を追加することで解決
function processUser(user: NewUser): string {
  // 以前は通っていたが、5.9 Beta では型エラーになる可能性
  // return user.email.toLowerCase(); // Error: Object is possibly 'undefined'
  
  // 修正版：適切な型ガードを使用
  return user.email?.toLowerCase() ?? 'no-email';
}

// 2. 条件型の推論変更

// 【Before】
type OldInferType<T> = T extends (infer U)[] ? U : T;
type OldResult = OldInferType<string | number[]>; // 以前の結果

// 【After】
type NewInferType<T> = T extends (infer U)[] ? U : T;
type NewResult = NewInferType<string | number[]>; // 新しい結果（より厳密）

// 【Migration Strategy】
// 明示的な型分岐を使用
type SafeInferType<T> = T extends any[]
  ? T extends (infer U)[]
    ? U
    : never
  : T;

// 3. テンプレートリテラル型の処理変更

// 【Before】
type OldTemplate<T extends string> = `prefix-${T}`;
// 以前は一部のエッジケースで予期しない挙動があった

// 【After】
type NewTemplate<T extends string> = `prefix-${T}`;
// より一貫した処理になったが、一部のコードが動かなくなる可能性

// 【Migration Strategy】
// 型制約を明示的に指定
type SafeTemplate<T extends string> = T extends `${infer _}${infer _}`
  ? `prefix-${T}`
  : never;

// 4. モジュール解決の変更

// 【Before】
// 以前は曖昧なモジュール解決が許可されていた
// import { someFunction } from './utils'; // 拡張子なし

// 【After】
// より厳密なモジュール解決
// import { someFunction } from './utils.js'; // 拡張子必須の場合

// 【Migration Strategy】
// tsconfig.json で適切な設定を使用
// "moduleResolution": "bundler" または "node16"
// "allowImportingTsExtensions": true

// 5. 交差型の処理変更

// 【Before】
interface OldTypeA {
  prop: string;
}

interface OldTypeB {
  prop: number;
}

// 以前は交差型が予期しない結果になることがあった
type OldIntersection = OldTypeA & OldTypeB;

// 【After】
interface NewTypeA {
  prop: string;
}

interface NewTypeB {
  prop: number;
}

// より厳密な交差型処理
type NewIntersection = NewTypeA & NewTypeB; // prop: never

// 【Migration Strategy】
// 型を明示的に設計し直す
interface CombinedType {
  stringProp: string;
  numberProp: number;
}

// 6. 型注釈の必要性増加

// 【Before】
function oldFunction(callback) {
  // 以前は型推論でなんとかなっていた
  return callback();
}

// 【After】
function newFunction<T>(callback: () => T): T {
  // より明示的な型注釈が必要
  return callback();
}

// 【Migration Strategy】
// 段階的に型注釈を追加
function migratedFunction<T = unknown>(callback: () => T): T {
  return callback();
}

// 7. 非推奨APIの削除

// 【Before】
// 以前は使用可能だった非推奨API
// declare var ts: any;
// ts.createSourceFile(...); // 非推奨メソッド

// 【After】
// 新しいAPIを使用する必要がある
// declare var ts: any;
// ts.createSourceFileFromText(...); // 新しいメソッド

// 【Migration Strategy】
// 代替APIへの移行
class APIWrapper {
  // 互換性レイヤーを作成
  static createSourceFile(...args: any[]) {
    // 新しいAPIを内部で使用
    console.log('Using new API internally');
  }
}

// 8. より厳密な null/undefined チェック

// 【Before】
function oldNullableFunction(value: string | null) {
  return value.length; // 以前は警告のみ
}

// 【After】
function newNullableFunction(value: string | null): number {
  // より厳密なチェックが必要
  if (value === null) {
    return 0;
  }
  return value.length;
}

// 【Migration Strategy】
// ユーティリティ関数を使用
function safeLength(value: string | null | undefined): number {
  return value?.length ?? 0;
}

// 9. 段階的移行のための設定例

// tsconfig.json での移行支援設定
const migrationConfig = {
  "compilerOptions": {
    // 段階的移行用の設定
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    
    // 移行期間中の互換性設定
    "skipLibCheck": true,
    "allowJs": true,
    "checkJs": false,
    
    // 新機能の段階的有効化
    "exactOptionalPropertyTypes": false, // 後で true に
    "noUncheckedIndexedAccess": false,   // 後で true に
    
    // エラーを警告として扱う（移行期間中）
    "noEmitOnError": false
  }
};

// 10. 移行チェックリスト

/*
移行チェックリスト：

1. 型注釈の追加
   - [ ] 関数パラメータの型指定
   - [ ] 戻り値の型指定
   - [ ] 変数の型指定

2. null/undefined処理の改善
   - [ ] Optional chaining の使用
   - [ ] Nullish coalescing の使用
   - [ ] 型ガードの実装

3. モジュール解決の更新
   - [ ] インポートパスの確認
   - [ ] 拡張子の明示
   - [ ] tsconfig.json の更新

4. 型定義の見直し
   - [ ] 交差型の再設計
   - [ ] 条件型の見直し
   - [ ] テンプレートリテラル型の確認

5. 非推奨APIの置き換え
   - [ ] 非推奨メソッドの特定
   - [ ] 代替APIへの移行
   - [ ] 互換性レイヤーの作成

6. テストの更新
   - [ ] 型テストの追加
   - [ ] エラーケースのテスト
   - [ ] 移行後の動作確認
*/

export {
  processUser,
  SafeInferType,
  SafeTemplate,
  CombinedType,
  newFunction,
  migratedFunction,
  APIWrapper,
  newNullableFunction,
  safeLength,
  migrationConfig,
  type NewUser,
  type NewResult,
  type NewIntersection
};