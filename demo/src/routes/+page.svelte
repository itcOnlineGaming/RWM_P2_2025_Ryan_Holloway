<script lang="ts">
  // Mock user state (in real app, this would come from authentication)
  let isAuthenticated = false;
  let username = '';
  let password = '';
  let currentUser = '';

  // Simple authentication
  function login() {
    if (username && password) {
      isAuthenticated = true;
      currentUser = username;
      // Store current user in localStorage for other pages
      localStorage.setItem('current_user', username);
    }
  }

  function logout() {
    isAuthenticated = false;
    currentUser = '';
    username = '';
    password = '';
    // Clear current user from localStorage
    localStorage.removeItem('current_user');
  }
</script>

{#if !isAuthenticated}
  <div class="login-container">
    <div class="login-card">
      <h1>Emotion Tracker Demo</h1>
      <p>Sign in to explore the components</p>
      
      <form on:submit|preventDefault={login}>
        <div class="form-group">
          <label for="username">Username</label>
          <input
            id="username"
            type="text"
            bind:value={username}
            placeholder="Enter username"
            required
          />
        </div>
        
        <div class="form-group">
          <label for="password">Password</label>
          <input
            id="password"
            type="password"
            bind:value={password}
            placeholder="Enter password"
            required
          />
        </div>
        
        <button type="submit" class="login-btn">Sign In</button>
      </form>
      <p class="note">Demo mode: Use any username/password combination</p>
    </div>
  </div>
{:else}
  <div class="menu-container">
    <div class="menu-header">
      <h1>Welcome, {currentUser}!</h1>
      <button on:click={logout} class="logout-btn">Logout</button>
    </div>
    
    <div class="menu-content">
      <h2>Emotion Tracker Components</h2>
      <p class="subtitle">Choose a demo to explore:</p>
      
      <div class="menu-grid">
        <a href="/full-demo" class="menu-card">
          <h3>Full Demo</h3>
          <p>Experience the complete emotion tracking workflow from start to finish</p>
        </a>
        
        <a href="/start-session" class="menu-card">
          <h3>Start Session</h3>
          <p>Explore the pre-session mood selection component</p>
        </a>
        
        <a href="/mid-session" class="menu-card">
          <h3>Mid-Session Check-In</h3>
          <p>Test the distraction tracking modal component</p>
        </a>
      </div>
    </div>
  </div>
{/if}

<style>
  :global(body) {
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
    background: white;
    min-height: 100vh;
  }

  .login-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    padding: 20px;
  }

  .login-card {
    background: white;
    border-radius: 16px;
    padding: 40px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    width: 100%;
    max-width: 400px;
  }

  .login-card h1 {
    margin: 0 0 8px 0;
    color: #333;
    font-size: 28px;
  }

  .login-card p {
    margin: 0 0 32px 0;
    color: #666;
  }

  .note {
    text-align: center;
    font-size: 14px !important;
    margin-top: 16px !important;
  }

  .form-group {
    margin-bottom: 20px;
  }

  .form-group label {
    display: block;
    margin-bottom: 8px;
    color: #333;
    font-weight: 500;
  }

  .form-group input {
    width: 100%;
    padding: 12px;
    border: 2px solid #e0e0e0;
    border-radius: 8px;
    font-size: 16px;
    transition: border-color 0.3s;
    box-sizing: border-box;
  }

  .form-group input:focus {
    outline: none;
    border-color: #667eea;
  }

  .login-btn {
    width: 100%;
    padding: 14px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s;
  }

  .login-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
  }

  .menu-container {
    min-height: 100vh;
    padding: 40px 20px;
  }

  .menu-header {
    max-width: 1200px;
    margin: 0 auto 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 16px;
  }

  .menu-header h1 {
    margin: 0;
    color: #333;
    font-size: 32px;
  }

  .logout-btn {
    padding: 10px 24px;
    background: #f44336;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.3s;
  }

  .logout-btn:hover {
    background: #d32f2f;
  }

  .menu-content {
    max-width: 1200px;
    margin: 0 auto;
    background: white;
    border-radius: 16px;
    padding: 40px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  }

  .menu-content h2 {
    margin: 0 0 8px 0;
    color: #333;
    font-size: 28px;
  }

  .subtitle {
    margin: 0 0 32px 0;
    color: #666;
    font-size: 18px;
  }

  .menu-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 24px;
  }

  .menu-card {
    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
    border-radius: 12px;
    padding: 32px 24px;
    text-decoration: none;
    color: #333;
    transition: transform 0.3s, box-shadow 0.3s;
    cursor: pointer;
    display: block;
  }

  .menu-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.2);
  }

  .menu-card h3 {
    margin: 0 0 12px 0;
    font-size: 22px;
    color: #333;
  }

  .menu-card p {
    margin: 0;
    color: #666;
    font-size: 15px;
    line-height: 1.5;
  }

  @media (max-width: 768px) {
    .menu-content {
      padding: 24px;
    }

    .menu-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
