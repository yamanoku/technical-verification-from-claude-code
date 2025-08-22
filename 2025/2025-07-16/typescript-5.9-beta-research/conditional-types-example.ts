// TypeScript 5.9 Beta - Conditional Types の改善例

// 1. Enhanced Conditional Types with better pattern matching
type ExtractArrayType<T> = T extends (infer U)[] ? U : never;

// 使用例
type NumberArray = number[];
type StringArray = string[];
type ExtractedNumber = ExtractArrayType<NumberArray>; // number
type ExtractedString = ExtractArrayType<StringArray>; // string

// 2. More sophisticated conditional type patterns
type DeepExtract<T, K extends keyof T> = T[K] extends object
  ? T[K] extends (infer U)[]
    ? U extends object
      ? keyof U
      : never
    : keyof T[K]
  : never;

// 使用例
interface User {
  name: string;
  posts: {
    title: string;
    content: string;
  }[];
}

type PostKeys = DeepExtract<User, 'posts'>; // "title" | "content"

// 3. Improved inference in complex conditional scenarios
type SmartPick<T, K extends keyof T> = {
  [P in K]: T[P] extends Function
    ? T[P]
    : T[P] extends object
    ? SmartPick<T[P], keyof T[P]>
    : T[P];
};

// 使用例
interface ComplexObject {
  id: number;
  name: string;
  config: {
    enabled: boolean;
    options: string[];
  };
  handler: () => void;
}

type PickedObject = SmartPick<ComplexObject, 'name' | 'config' | 'handler'>;

// 4. Better handling of distributive conditional types
type DistributeOverUnion<T> = T extends any ? T[] : never;

type UnionArrays = DistributeOverUnion<string | number>; // string[] | number[]

// 5. Enhanced template literal type integration
type CreatePath<T extends string, U extends string> = T extends `${infer Prefix}/${infer Rest}`
  ? `${Prefix}/${CreatePath<Rest, U>}`
  : `${T}/${U}`;

type APIPath = CreatePath<"api/v1", "users">; // "api/v1/users"

export {
  ExtractArrayType,
  DeepExtract,
  SmartPick,
  DistributeOverUnion,
  CreatePath,
  type PostKeys,
  type PickedObject,
  type UnionArrays,
  type APIPath
};