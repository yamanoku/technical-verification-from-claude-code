<script>
  import './app.css';
</script>

<div class="app">
  <header>
    <nav>
      <a href="/">ホーム</a>
      <a href="/users">ユーザー管理</a>
      <a href="/contact">お問い合わせ</a>
      <a href="/stats">統計</a>
    </nav>
  </header>
  
  <main>
    <slot />
  </main>
  
  <footer>
    <p>SvelteKit Remote Functions 技術検証プロジェクト</p>
  </footer>
</div>

<style>
  .app {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }
  
  header {
    background: #1a1a1a;
    color: white;
    padding: 1rem;
  }
  
  nav {
    display: flex;
    gap: 2rem;
  }
  
  nav a {
    color: white;
    text-decoration: none;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    transition: background-color 0.2s;
  }
  
  nav a:hover {
    background: rgba(255, 255, 255, 0.1);
  }
  
  main {
    flex: 1;
    padding: 2rem;
  }
  
  footer {
    background: #f5f5f5;
    padding: 1rem;
    text-align: center;
    color: #666;
  }
</style>