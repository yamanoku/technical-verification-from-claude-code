<script lang="ts">
  import { submitContactForm } from '$lib/functions.remote';
</script>

<svelte:head>
  <title>お問い合わせ - Remote Functions 検証</title>
</svelte:head>

<div class="container">
  <h1>お問い合わせフォーム</h1>
  <p>Remote Function (Form) を使用したフォーム処理のデモです。</p>
  
  <div class="card">
    <h2>📝 Remote Function (Form) の特徴</h2>
    <ul>
      <li><strong>型安全性</strong>: FormDataの引数と戻り値が完全に型チェックされる</li>
      <li><strong>再利用性</strong>: フォーム処理ロジックをアプリケーション全体で共有可能</li>
      <li><strong>分離された関心事</strong>: サーバーロジックとUIコードが明確に分離</li>
      <li><strong>統一されたエラーハンドリング</strong>: カスタムエラークラスによる詳細なエラー処理</li>
      <li><strong>開発体験の向上</strong>: 自動補完とIDEサポート</li>
    </ul>
  </div>
  
  <!-- フォーム -->
  <div class="card">
    <h2>お問い合わせフォーム</h2>
    
    <form
      {...submitContactForm}
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
      >
        送信する
      </button>
    </form>
    
    {#if submitContactForm.result?.success}
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
          <li>+page.server.tsに実装が必要</li>
          <li>型安全性が限定的</li>
          <li>ページごとに実装が分散</li>
          <li>エラーハンドリングが複雑</li>
        </ul>
      </div>
      <div style="padding: 1rem; background: #e8f5e8; border-radius: 4px;">
        <h4>Remote Function (Form)</h4>
        <ul style="font-size: 0.9rem;">
          <li>.remote.tsファイルで集中管理</li>
          <li>完全な型安全性</li>
          <li>どこからでも呼び出し可能</li>
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
    
    <h3>Remote Function の実装詳細</h3>
    <p>
      Remote Functionは、サーバーサイドの処理を型安全に実行できる機能です。
      FormDataを受け取り、バリデーションとビジネスロジックを実行後、
      型付けされた結果を返します。エラーハンドリングも組み込まれており、
      ValidationErrorクラスを使用した詳細なエラーメッセージを提供できます。
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