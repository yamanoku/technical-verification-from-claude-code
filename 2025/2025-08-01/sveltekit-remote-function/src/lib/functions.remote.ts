// Remote Functions の実装例 (Query/Command/Form)
import { query, command, form } from "$app/server";

// 型定義
type UserId = number;
type UserRole = "admin" | "user";

interface BaseUser {
  readonly id: UserId;
  name: string;
  email: string;
}

interface UserWithRole extends BaseUser {
  role: UserRole;
}

interface UserWithTimestamp extends BaseUser {
  createdAt: string;
}

interface UpdatedUser extends BaseUser {
  updatedAt: string;
}

interface CreateUserInput {
  name: string;
  email: string;
}

interface UpdateUserInput {
  name?: string;
  email?: string;
}

interface Statistics {
  totalUsers: number;
  activeUsers: number;
  newUsersThisMonth: number;
  popularPages: ReadonlyArray<{
    path: string;
    views: number;
  }>;
  lastUpdated: string;
}

// カスタムエラークラス
class UserNotFoundError extends Error {
  constructor(userId: UserId) {
    super(`ユーザーが見つかりません (ID: ${userId})`);
    this.name = "UserNotFoundError";
  }
}

class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

// 定数
const DELAYS = {
  SHORT: 500,
  MEDIUM: 800,
  LONG: 1000,
  EXTRA_LONG: 2000,
} as const;

const ERROR_MESSAGES = {
  NAME_REQUIRED: "名前は必須です",
  INVALID_EMAIL: "有効なメールアドレスを入力してください",
  USER_NOT_FOUND: "ユーザーが見つかりません",
} as const;

// ユーティリティ関数
const delay = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const isNonEmptyString = (value: string): value is string => {
  return value.trim().length > 0;
};

/**
 * すべてのユーザーを取得する
 * @returns ユーザーの配列
 */
export const getUsers = query(async (): Promise<readonly BaseUser[]> => {
  // 実際のAPIコールをシミュレート
  await delay(DELAYS.LONG);

  const users: readonly BaseUser[] = [
    { id: 1 as UserId, name: "田中太郎", email: "tanaka@example.com" },
    { id: 2 as UserId, name: "佐藤花子", email: "sato@example.com" },
    { id: 3 as UserId, name: "鈴木一郎", email: "suzuki@example.com" },
  ] as const;

  return users;
});

/**
 * IDでユーザーを取得する
 * @param id - ユーザーID
 * @returns ユーザー情報（ロール付き）
 * @throws {UserNotFoundError} ユーザーが見つからない場合
 */
export const getUserById = query(
  "unchecked",
  async (id: UserId): Promise<UserWithRole> => {
    await delay(DELAYS.SHORT);

    const users: readonly UserWithRole[] = [
      {
        id: 1 as UserId,
        name: "田中太郎",
        email: "tanaka@example.com",
        role: "admin",
      },
      {
        id: 2 as UserId,
        name: "佐藤花子",
        email: "sato@example.com",
        role: "user",
      },
      {
        id: 3 as UserId,
        name: "鈴木一郎",
        email: "suzuki@example.com",
        role: "user",
      },
    ] as const;

    const user = users.find((u) => u.id === id);
    if (!user) {
      throw new UserNotFoundError(id);
    }

    return user;
  }
);

/**
 * 新しいユーザーを作成する
 * @param userData - ユーザー作成情報
 * @returns 作成されたユーザー情報
 * @throws {ValidationError} バリデーションエラー
 */
export const createUser = command(
  "unchecked",
  async (userData: CreateUserInput): Promise<UserWithTimestamp> => {
    // バリデーション
    if (!isNonEmptyString(userData.name)) {
      throw new ValidationError(ERROR_MESSAGES.NAME_REQUIRED);
    }

    if (!isValidEmail(userData.email)) {
      throw new ValidationError(ERROR_MESSAGES.INVALID_EMAIL);
    }

    // データ保存をシミュレート
    await delay(DELAYS.LONG);

    const newUser: UserWithTimestamp = {
      id: Math.floor(Math.random() * 10000) as UserId,
      name: userData.name,
      email: userData.email,
      createdAt: new Date().toISOString(),
    } satisfies UserWithTimestamp;

    return newUser;
  }
);

/**
 * ユーザー情報を更新する
 * @param params - 更新パラメータ
 * @returns 更新されたユーザー情報
 * @throws {ValidationError} バリデーションエラー
 */
export const updateUser = command(
  "unchecked",
  async ({
    id,
    userData,
  }: {
    id: UserId;
    userData: UpdateUserInput;
  }): Promise<UpdatedUser> => {
    // メールアドレスのバリデーション（提供された場合）
    if (userData.email !== undefined && !isValidEmail(userData.email)) {
      throw new ValidationError(ERROR_MESSAGES.INVALID_EMAIL);
    }

    await delay(DELAYS.MEDIUM);

    // 実際の実装では既存のユーザーデータを取得して更新する
    const updatedUser: UpdatedUser = {
      id,
      name: userData.name ?? "更新済みユーザー",
      email: userData.email ?? "updated@example.com",
      updatedAt: new Date().toISOString(),
    } satisfies UpdatedUser;

    return updatedUser;
  }
);

/**
 * 統計データを取得する（重い処理の例）
 * @returns 統計情報
 */
export const getStatistics = query(async (): Promise<Statistics> => {
  // 重い計算処理をシミュレート
  await delay(DELAYS.EXTRA_LONG);

  const statistics: Statistics = {
    totalUsers: 1250,
    activeUsers: 890,
    newUsersThisMonth: 45,
    popularPages: [
      { path: "/", views: 5420 },
      { path: "/about", views: 1230 },
      { path: "/contact", views: 890 },
    ] as const,
    lastUpdated: new Date().toISOString(),
  } satisfies Statistics;

  return statistics;
});

/**
 * お問い合わせフォームを送信する
 * @param formData - フォームデータ
 * @returns 送信結果
 * @throws {ValidationError} バリデーションエラー
 */
export const submitContactForm = form(async (
  formData: FormData
): Promise<{
  success: boolean;
  message: string;
  submittedAt: string;
  data?: {
    name: string;
    email: string;
    message: string;
  };
}> => {
    // フォームデータを取得
    const name = formData.get("name")?.toString() ?? "";
    const email = formData.get("email")?.toString() ?? "";
    const message = formData.get("message")?.toString() ?? "";

    // バリデーション
    if (!isNonEmptyString(name)) {
      throw new ValidationError("お名前を入力してください");
    }

    if (!isValidEmail(email)) {
      throw new ValidationError("有効なメールアドレスを入力してください");
    }

    if (!isNonEmptyString(message)) {
      throw new ValidationError("お問い合わせ内容を入力してください");
    }

    if (message.length < 10) {
      throw new ValidationError("お問い合わせ内容は10文字以上で入力してください");
    }

    // 送信処理をシミュレート
    await delay(DELAYS.LONG);

    // 実際の実装では、ここでメール送信やデータベース保存を行う
    console.log("お問い合わせを受信しました:", {
      name,
      email,
      message: message.substring(0, 50) + "...",
    });

    return {
      success: true,
      message: "お問い合わせを送信しました。ありがとうございます。",
      submittedAt: new Date().toISOString(),
      data: {
        name,
        email,
        message,
      },
    };
  }
);
