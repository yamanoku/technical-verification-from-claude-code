<script>
  import { contactForm } from '$lib/functions.remote';
  import { enhance } from '$app/forms';
  
  let formElement;
  let submissionResult = null;
  let isSubmitting = false;
  
  // フォーム送信結果の処理
  function handleResult(result) {
    submissionResult = result;
    isSubmitting = false;
    if (result.success) {
      formElement.reset();
    }
  }
</script>

<svelte:head>
  <title>お問い合わせ - Remote Functions 検証</title>
</svelte:head>

<div class="container">
  <h1>お問い合わせフォーム</h1>
  <p>Remote Function (Form) を使用したフォーム処理のデモです。</p>
  
  <div class="card">
    <h2>📝 Form機能の特徴</h2>
    <ul>
      <li><strong>プログレッシブエンハンスメント</strong>: JavaScriptが無効でも動作</li>
      <li><strong>自動CSRF保護</strong>: セキュリティが組み込み済み</li>
      <li><strong>型安全性</strong>: FormDataの型チェック</li>
      <li><strong>統一されたエラーハンドリング</strong>: 一貫した処理パターン</li>
    </ul>
  </div>
  
  <!-- 結果表示 -->
  {#if submissionResult}
    <div class="card">
      {#if submissionResult.success}
        <div class="success">
          ✅ {submissionResult.message}
          <br>
          <small>送信日時: {new Date(submissionResult.submittedAt).toLocaleString('ja-JP')}</small>
        </div>
      {:else}
        <div class="error">
          ❌ {submissionResult.message}
        </div>
      {/if}
    </div>
  {/if}
  
  <!-- フォーム -->
  <div class="card">
    <h2>📬 お問い合わせフォーム</h2>
    
    <form 
      bind:this={formElement}
      use:enhance={({ formData, cancel }) => {
        isSubmitting = true;
        return async ({ result }) => {
          if (result.type === 'success') {
            handleResult(result.data);
          } else if (result.type === 'failure') {
            handleResult({ success: false, message: result.data?.message || 'エラーが発生しました' });
          } else {
            isSubmitting = false;
          }
        };
      }}
      action={contactForm}
      method="POST"
    >
      <div class="form-group">
        <label class="label" for="name">お名前 *</label>
        <input 
          id="name"
          name="name"
          class="input" 
          type="text" 
          placeholder="例: 田中太郎"
          required
        />
      </div>
      
      <div class="form-group">
        <label class="label" for="email">メールアドレス *</label>
        <input 
          id="email"
          name="email"
          class="input" 
          type="email" 
          placeholder="例: tanaka@example.com"
          required
        />
      </div>
      
      <div class="form-group">
        <label class="label" for="message">お問い合わせ内容 *</label>
        <textarea 
          id="message"
          name="message"
          class="textarea" 
          placeholder="お問い合わせ内容を10文字以上で入力してください"
          required
        ></textarea>
      </div>
      
      <button 
        class="button" 
        type="submit"
        disabled={!!isSubmitting}
      >
        {#if isSubmitting}
          送信中...
        {:else}
          送信する
        {/if}
      </button>
    </form>
    
    {#if isSubmitting}
      <div style="margin-top: 1rem;">
        <div class="loading">お問い合わせを送信中...</div>
      </div>
    {/if}
  </div>
  
  <div class="card">
    <h2>🔧 実装詳細</h2>
    
    <h3>従来のform actionsとの比較</h3>
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin: 1rem 0;">
      <div style="padding: 1rem; background: #f8f9fa; border-radius: 4px;">
        <h4>従来のform actions</h4>
        <ul style="font-size: 0.9rem;">
          <li>ページ固有の実装</li>
          <li>型安全性が限定的</li>
          <li>再利用性が低い</li>
        </ul>
      </div>
      <div style="padding: 1rem; background: #e8f5e8; border-radius: 4px;">
        <h4>Remote Function (Form)</h4>
        <ul style="font-size: 0.9rem;">
          <li>アプリケーション全体で再利用可能</li>
          <li>完全な型安全性</li>
          <li>統一されたエラーハンドリング</li>
        </ul>
      </div>
    </div>
    
    <h3>バリデーション機能</h3>
    <ul>
      <li>サーバーサイドでの入力値検証</li>
      <li>詳細なエラーメッセージ</li>
      <li>型安全なFormData処理</li>
    </ul>
    
    <h3>プログレッシブエンハンスメント</h3>
    <p>
      このフォームは、JavaScriptが無効な環境でも通常のHTMLフォームとして動作します。
      JavaScriptが有効な場合は、非同期送信とリアルタイムフィードバックが利用できます。
    </p>
  </div>
  
  <div class="card">
    <h2>🧪 テストケース</h2>
    <p>以下のパターンでテストしてみてください：</p>
    <ul>
      <li><strong>正常なケース</strong>: すべての項目を正しく入力</li>
      <li><strong>名前が空</strong>: 名前を空にして送信</li>
      <li><strong>無効なメール</strong>: "@"を含まないメールアドレス</li>
      <li><strong>短いメッセージ</strong>: 10文字未満のメッセージ</li>
    </ul>
  </div>
</div>