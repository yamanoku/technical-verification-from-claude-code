// Remote Functions の実装例
import { query, command, form } from '$app/server';

// データ取得用のQuery - キャッシュ機能付き
export const getUsers = query(async () => {
	// 実際のAPIコールをシミュレート
	await new Promise(resolve => setTimeout(resolve, 1000));
	
	return [
		{ id: 1, name: '田中太郎', email: 'tanaka@example.com' },
		{ id: 2, name: '佐藤花子', email: 'sato@example.com' },
		{ id: 3, name: '鈴木一郎', email: 'suzuki@example.com' }
	];
});

// IDによるユーザー取得
export const getUserById = query("unchecked", async (id: number) => {
	await new Promise(resolve => setTimeout(resolve, 500));
	
	const users = [
		{ id: 1, name: '田中太郎', email: 'tanaka@example.com', role: 'admin' },
		{ id: 2, name: '佐藤花子', email: 'sato@example.com', role: 'user' },
		{ id: 3, name: '鈴木一郎', email: 'suzuki@example.com', role: 'user' }
	];
	
	const user = users.find(u => u.id === id);
	if (!user) {
		throw new Error('ユーザーが見つかりません');
	}
	
	return user;
});

// データ変更用のCommand - 非同期処理対応
export const createUser = command("unchecked", async (userData: { name: string; email: string }) => {
	// バリデーション
	if (!userData.name || userData.name.trim().length === 0) {
		throw new Error('名前は必須です');
	}
	
	if (!userData.email || !userData.email.includes('@')) {
		throw new Error('有効なメールアドレスを入力してください');
	}
	
	// データ保存をシミュレート
	await new Promise(resolve => setTimeout(resolve, 1000));
	
	const newUser = {
		id: Math.floor(Math.random() * 10000),
		name: userData.name,
		email: userData.email,
		createdAt: new Date().toISOString()
	};
	
	return newUser;
});

// ユーザー更新
export const updateUser = command("unchecked", async ({ id, userData }: { id: number; userData: { name?: string; email?: string } }) => {
	await new Promise(resolve => setTimeout(resolve, 800));
	
	// 更新処理をシミュレート
	const updatedUser = {
		id,
		name: userData.name || '更新済みユーザー',
		email: userData.email || 'updated@example.com',
		updatedAt: new Date().toISOString()
	};
	
	return updatedUser;
});

// フォーム処理用のForm - プログレッシブエンハンスメント対応
export const contactForm = form(async (formData: FormData) => {
	const name = formData.get('name') as string;
	const email = formData.get('email') as string;
	const message = formData.get('message') as string;
	
	// バリデーション
	if (!name || name.trim().length === 0) {
		throw new Error('お名前を入力してください');
	}
	
	if (!email || !email.includes('@')) {
		throw new Error('有効なメールアドレスを入力してください');
	}
	
	if (!message || message.trim().length < 10) {
		throw new Error('メッセージは10文字以上で入力してください');
	}
	
	// フォーム送信処理をシmiュレート
	await new Promise(resolve => setTimeout(resolve, 1500));
	
	return {
		success: true,
		message: 'お問い合わせを受け付けました。ありがとうございます。',
		submittedAt: new Date().toISOString()
	};
});

// 統計データ取得（重い処理の例）
export const getStatistics = query(async () => {
	// 重い計算処理をシミュレート
	await new Promise(resolve => setTimeout(resolve, 2000));
	
	return {
		totalUsers: 1250,
		activeUsers: 890,
		newUsersThisMonth: 45,
		popularPages: [
			{ path: '/', views: 5420 },
			{ path: '/about', views: 1230 },
			{ path: '/contact', views: 890 }
		],
		lastUpdated: new Date().toISOString()
	};
});