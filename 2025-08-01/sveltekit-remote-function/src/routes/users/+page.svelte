<script>
  import { getUsers, getUserById, createUser, updateUser } from '$lib/functions.remote.js';
  
  let usersPromise = getUsers();
  let selectedUserId = null;
  let selectedUserPromise = null;
  let newUserName = '';
  let newUserEmail = '';
  let createUserPromise = null;
  let updateUserPromise = null;
  let updateUserName = '';
  let updateUserEmail = '';
  
  function selectUser(id) {
    selectedUserId = id;
    selectedUserPromise = getUserById(id);
  }
  
  async function handleCreateUser() {
    if (!newUserName.trim() || !newUserEmail.trim()) {
      alert('名前とメールアドレスを入力してください');
      return;
    }
    
    try {
      createUserPromise = createUser({
        name: newUserName,
        email: newUserEmail
      });
      
      const result = await createUserPromise;
      alert(`ユーザー「${result.name}」を作成しました（ID: ${result.id}）`);
      
      // フォームをリセット
      newUserName = '';
      newUserEmail = '';
      
      // ユーザーリストを更新
      usersPromise = getUsers();
      
    } catch (error) {
      alert(`エラー: ${error.message}`);
    } finally {
      createUserPromise = null;
    }
  }
  
  async function handleUpdateUser() {
    if (!selectedUserId) {
      alert('更新するユーザーを選択してください');
      return;
    }
    
    try {
      updateUserPromise = updateUser(selectedUserId, {
        name: updateUserName || undefined,
        email: updateUserEmail || undefined
      });
      
      const result = await updateUserPromise;
      alert(`ユーザーを更新しました: ${result.name}`);
      
      // フォームをリセット
      updateUserName = '';
      updateUserEmail = '';
      
      // 選択中のユーザー情報を更新
      selectedUserPromise = getUserById(selectedUserId);
      
    } catch (error) {
      alert(`エラー: ${error.message}`);
    } finally {
      updateUserPromise = null;
    }
  }
</script>

<svelte:head>
  <title>ユーザー管理 - Remote Functions 検証</title>
</svelte:head>

<div class="container">
  <h1>ユーザー管理</h1>
  <p>Query と Command を組み合わせたユーザー管理機能のデモです。</p>
  
  <!-- ユーザーリスト表示 (Query) -->
  <div class="card">
    <h2>📋 ユーザーリスト (Query)</h2>
    {#await usersPromise}
      <div class="loading">ユーザーデータを読み込み中...</div>
    {:then users}
      <p>登録ユーザー数: {users.length}人</p>
      <div class="card">
        {#each users as user}
          <div class="user-item">
            <div class="user-info">
              <h3>{user.name}</h3>
              <p>{user.email}</p>
            </div>
            <button 
              class="button secondary" 
              on:click={() => selectUser(user.id)}
            >
              詳細表示
            </button>
          </div>
        {/each}
      </div>
    {:catch error}
      <div class="error">
        ユーザーリストの取得に失敗しました: {error.message}
      </div>
    {/await}
  </div>
  
  <!-- ユーザー詳細表示 (Query) -->
  {#if selectedUserPromise}
    <div class="card">
      <h2>👤 ユーザー詳細 (Query)</h2>
      {#await selectedUserPromise}
        <div class="loading">ユーザー詳細を読み込み中...</div>
      {:then user}
        <div class="user-detail">
          <h3>{user.name}</h3>
          <p><strong>メール:</strong> {user.email}</p>
          <p><strong>権限:</strong> {user.role}</p>
          <p><strong>ID:</strong> {user.id}</p>
        </div>
      {:catch error}
        <div class="error">
          ユーザー詳細の取得に失敗しました: {error.message}
        </div>
      {/await}
    </div>
  {/if}
  
  <!-- ユーザー作成フォーム (Command) -->
  <div class="card">
    <h2>➕ 新規ユーザー作成 (Command)</h2>
    <form on:submit|preventDefault={handleCreateUser}>
      <div class="form-group">
        <label class="label" for="newUserName">名前</label>
        <input 
          id="newUserName"
          class="input" 
          type="text" 
          bind:value={newUserName}
          placeholder="例: 田中太郎"
          required
        />
      </div>
      
      <div class="form-group">
        <label class="label" for="newUserEmail">メールアドレス</label>
        <input 
          id="newUserEmail"
          class="input" 
          type="email" 
          bind:value={newUserEmail}
          placeholder="例: tanaka@example.com"
          required
        />
      </div>
      
      <button 
        class="button" 
        type="submit"
        disabled={!!createUserPromise}
      >
        {#if createUserPromise}
          作成中...
        {:else}
          ユーザーを作成
        {/if}
      </button>
    </form>
    
    {#if createUserPromise}
      <div style="margin-top: 1rem;">
        {#await createUserPromise}
          <div class="loading">ユーザーを作成中...</div>
        {:catch error}
          <div class="error">
            作成に失敗しました: {error.message}
          </div>
        {/await}
      </div>
    {/if}
  </div>
  
  <!-- ユーザー更新フォーム (Command) -->
  {#if selectedUserId}
    <div class="card">
      <h2>✏️ ユーザー更新 (Command)</h2>
      <p>選択中のユーザーID: {selectedUserId}</p>
      
      <form on:submit|preventDefault={handleUpdateUser}>
        <div class="form-group">
          <label class="label" for="updateUserName">新しい名前（空の場合は変更なし）</label>
          <input 
            id="updateUserName"
            class="input" 
            type="text" 
            bind:value={updateUserName}
            placeholder="新しい名前を入力"
          />
        </div>
        
        <div class="form-group">
          <label class="label" for="updateUserEmail">新しいメールアドレス（空の場合は変更なし）</label>
          <input 
            id="updateUserEmail"
            class="input" 
            type="email" 
            bind:value={updateUserEmail}
            placeholder="新しいメールアドレスを入力"
          />
        </div>
        
        <button 
          class="button" 
          type="submit"
          disabled={!!updateUserPromise}
        >
          {#if updateUserPromise}
            更新中...
          {:else}
            ユーザーを更新
          {/if}
        </button>
      </form>
      
      {#if updateUserPromise}
        <div style="margin-top: 1rem;">
          {#await updateUserPromise}
            <div class="loading">ユーザーを更新中...</div>
          {:catch error}
            <div class="error">
              更新に失敗しました: {error.message}
            </div>
          {/await}
        </div>
      {/if}
    </div>
  {/if}
  
  <div class="card">
    <h2>💡 実装のポイント</h2>
    <ul>
      <li><strong>Query</strong>: ユーザーリストや詳細情報の取得に使用。自動キャッシュにより効率的</li>
      <li><strong>Command</strong>: ユーザーの作成・更新に使用。非同期処理とエラーハンドリングが統一</li>
      <li><strong>型安全性</strong>: TypeScriptによる完全な型チェック</li>
      <li><strong>エラーハンドリング</strong>: 統一されたエラー処理パターン</li>
    </ul>
  </div>
</div>

<style>
  .user-detail {
    background: #f8f9fa;
    padding: 1rem;
    border-radius: 4px;
    border-left: 4px solid #007acc;
  }
  
  .user-detail h3 {
    margin-top: 0;
    color: #007acc;
  }
  
  .form-group {
    margin-bottom: 1rem;
  }
</style>