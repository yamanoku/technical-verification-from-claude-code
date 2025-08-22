// TypeScript 5.9 Beta - パフォーマンス改善と開発者体験の向上例

// 1. 改善されたインクリメンタルコンパイル
// 以前のバージョンでは再コンパイルが必要だったケースでも、
// 5.9 Beta では変更検出が改善され、必要最小限のファイルのみが再コンパイルされる

// 2. 大規模プロジェクトでの型チェック最適化
interface LargeDataStructure {
  id: number;
  name: string;
  metadata: {
    [key: string]: any;
  };
  relationships: {
    [relationId: string]: {
      type: string;
      target: string;
      properties: Record<string, unknown>;
    };
  };
}

// 以前は処理が重かった複雑な型操作が最適化されている
type OptimizedMapping<T> = {
  [K in keyof T]: T[K] extends object
    ? OptimizedMapping<T[K]>
    : T[K];
};

// 使用例：大規模なデータ構造でもパフォーマンスが向上
type MappedLargeData = OptimizedMapping<LargeDataStructure>;

// 3. 改善されたメモリ使用量
// 以前はメモリを大量に消費していた再帰的な型定義が最適化
type DeepNested<T, Depth extends number = 10> = Depth extends 0
  ? T
  : T extends object
    ? {
        [K in keyof T]: DeepNested<T[K], Depth extends number ? Depth : 0>;
      }
    : T;

// 4. エラーメッセージの改善例
interface User {
  id: number;
  name: string;
  email: string;
}

interface Post {
  id: number;
  title: string;
  content: string;
  authorId: number;
}

// 以前は分かりにくかったエラーメッセージが改善
function createUserPost(user: User, post: Omit<Post, 'id' | 'authorId'>): Post {
  return {
    id: Math.random(),
    authorId: user.id,
    ...post
  };
}

// 5. IntelliSense の改善例
class APIClient {
  private baseURL: string;
  
  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }
  
  // 改善されたメソッド補完とパラメータヒント
  async request<T>(
    endpoint: string,
    options: {
      method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
      headers?: Record<string, string>;
      body?: unknown;
    } = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const response = await fetch(url, {
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      body: options.body ? JSON.stringify(options.body) : undefined
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  }
  
  // 型推論の改善により、戻り値の型が正確に推論される
  getUser(id: number) {
    return this.request<User>(`/users/${id}`);
  }
  
  createPost(userId: number, post: Omit<Post, 'id' | 'authorId'>) {
    return this.request<Post>('/posts', {
      method: 'POST',
      body: {
        ...post,
        authorId: userId
      }
    });
  }
}

// 6. 改善されたデバッグ体験
// ソースマップの生成が改善され、より正確なデバッグが可能
function complexCalculation(data: number[]): number {
  return data
    .filter(n => n > 0)
    .map(n => n * 2)
    .reduce((acc, curr) => acc + curr, 0);
}

// 7. ウォッチモードの改善
// ファイル変更の検出が高速化され、リアルタイムでの型チェックが向上
export class FileWatcher {
  private callbacks: Map<string, () => void> = new Map();
  
  watch(pattern: string, callback: () => void) {
    this.callbacks.set(pattern, callback);
    // 実際の実装では、改善されたファイル監視APIを使用
  }
  
  unwatch(pattern: string) {
    this.callbacks.delete(pattern);
  }
}

// 8. 型エイリアスの解決改善
// 複雑な型エイリアスの解決が高速化
type ComplexType<T> = T extends string
  ? `processed-${T}`
  : T extends number
  ? T & { __brand: 'number' }
  : T extends boolean
  ? T extends true
    ? 'yes'
    : 'no'
  : never;

// 使用例：型解決が高速化されている
type ProcessedString = ComplexType<'hello'>; // "processed-hello"
type ProcessedNumber = ComplexType<42>; // 42 & { __brand: 'number' }
type ProcessedBoolean = ComplexType<true>; // "yes"

// 9. 改善されたQuick Fixアクション
// より多くのエラーに対して適切な修正提案が提供される
interface Config {
  apiKey: string;
  timeout: number;
  retries?: number;
}

// 例：未定義プロパティに対する修正提案が改善
function initializeConfig(config: Partial<Config>): Config {
  return {
    apiKey: config.apiKey || 'default-key',
    timeout: config.timeout || 5000,
    retries: config.retries || 3
  };
}

export {
  LargeDataStructure,
  OptimizedMapping,
  DeepNested,
  User,
  Post,
  createUserPost,
  APIClient,
  complexCalculation,
  FileWatcher,
  ComplexType,
  Config,
  initializeConfig,
  type MappedLargeData,
  type ProcessedString,
  type ProcessedNumber,
  type ProcessedBoolean
};