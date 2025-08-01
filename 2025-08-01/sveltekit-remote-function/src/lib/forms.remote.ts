// Remote Form Functions - ブラウザ環境専用
import { form } from '$app/server';

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
	
	// フォーム送信処理をシミュレート
	await new Promise(resolve => setTimeout(resolve, 1500));
	
	return {
		success: true,
		message: 'お問い合わせを受け付けました。ありがとうございます。',
		submittedAt: new Date().toISOString()
	};
});