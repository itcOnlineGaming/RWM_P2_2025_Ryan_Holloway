<script lang="ts">
  import { EmotionTracker, calculateAnalytics, getPerformanceInsight, formatDuration } from '@ryanholloway/emotion-tracker';
  import type { SessionData } from '@ryanholloway/emotion-tracker';

  // Mock user state (in real app, this would come from authentication)
  let isAuthenticated = false;
  let username = '';
  let password = '';
  let currentUser = '';

  // Session storage
  let sessions: SessionData[] = [];
  let currentSessionId = '';

  // Simple authentication
  function login() {
    if (username && password) {
      isAuthenticated = true;
      currentUser = username;
      loadSessions();
    }
  }

  function logout() {
    isAuthenticated = false;
    currentUser = '';
    username = '';
    password = '';
    sessions = [];
  }

  // Load sessions from localStorage (simulating API)
  function loadSessions() {
    const stored = localStorage.getItem(`sessions_${currentUser}`);
    if (stored) {
      sessions = JSON.parse(stored);
    }
  }

  // Save sessions to localStorage (simulating API)
  function saveSessions() {
    localStorage.setItem(`sessions_${currentUser}`, JSON.stringify(sessions));
  }

  // Generate new session ID
  function generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substring(7)}`;
  }

  // Event handlers
  function handleSessionStart(event: CustomEvent) {
    currentSessionId = generateSessionId();
    console.log('Session started:', event.detail);
  }

  function handleSessionEnd(event: CustomEvent<SessionData>) {
    sessions = [...sessions, event.detail];
    saveSessions();
    console.log('Session completed:', event.detail);
  }

  function handleDistractionLogged(event: CustomEvent) {
    console.log('Distraction logged:', event.detail);
  }

  // Calculate analytics
  $: analytics = sessions.length > 0 ? calculateAnalytics(sessions) : null;
</script>

<svelte:head>
  <title>Emotion Tracker Demo</title>
</svelte:head>

<main>
  <header>
    <h1>📊 Emotion Tracker Demo</h1>
    <p>Track your emotions and performance during study/work sessions</p>
  </header>

  {#if !isAuthenticated}
    <div class="auth-container">
      <div class="auth-box">
        <h2>Login</h2>
        <form on:submit|preventDefault={login}>
          <input
            type="text"
            placeholder="Username"
            bind:value={username}
            required
          />
          <input
            type="password"
            placeholder="Password"
            bind:value={password}
            required
          />
          <button type="submit">Login</button>
        </form>
        <p class="auth-note">
          Demo mode: Use any username/password combination
        </p>
      </div>
    </div>
  {:else}
    <div class="dashboard">
      <div class="user-header">
        <span>Welcome, <strong>{currentUser}</strong>!</span>
        <button on:click={logout} class="logout-btn">Logout</button>
      </div>

      <div class="tracker-section">
        <EmotionTracker
          sessionId={currentSessionId || generateSessionId()}
          customEmotions={['Happy', 'Neutral', 'Tired', 'Stressed', 'Focused', 'Anxious', 'Energized']}
          enableMidSessionChecks={true}
          midSessionInterval={0.5}
          performanceFactors={['Productivity', 'Focus', 'Understanding', 'Energy']}
          showAnalytics={true}
          theme="light"
          on:sessionStart={handleSessionStart}
          on:sessionEnd={handleSessionEnd}
          on:distractionLogged={handleDistractionLogged}
        />
      </div>

      {#if analytics && sessions.length > 0}
        <div class="analytics-section">
          <h2>📈 Your Analytics</h2>
          <div class="stats-grid">
            <div class="stat-card">
              <h3>Total Sessions</h3>
              <p class="stat-value">{analytics.totalSessions}</p>
            </div>
            <div class="stat-card">
              <h3>Average Duration</h3>
              <p class="stat-value">{formatDuration(analytics.averageSessionDuration)}</p>
            </div>
          </div>

          <div class="emotion-insights">
            <h3>Emotion Performance Insights</h3>
            {#each Array.from(analytics.emotionPerformanceMap.entries()) as [emotion, stats]}
              <div class="insight-card">
                <h4>{emotion}</h4>
                <p>Sessions: {stats.sessionCount}</p>
                <p>Avg Performance: {stats.averagePerformance.toFixed(1)}/10</p>
                <p>Total Distractions: {stats.totalDistractions}</p>
                <p class="insight-message">
                  {getPerformanceInsight(emotion, analytics)}
                </p>
              </div>
            {/each}
          </div>

          <div class="session-history">
            <h3>Recent Sessions</h3>
            {#each sessions.slice(-5).reverse() as session}
              <div class="session-card">
                <p><strong>Before:</strong> {session.preSessionEmotion} → <strong>After:</strong> {session.postSessionEmotion}</p>
                <p><strong>Duration:</strong> {formatDuration(session.duration)}</p>
                <p><strong>Distractions:</strong> {session.distractions.length}</p>
              </div>
            {/each}
          </div>
        </div>
      {/if}
    </div>
  {/if}
</main>

<style>
  :global(body) {
    margin: 0;
    padding: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
  }

  main {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
  }

  header {
    text-align: center;
    color: white;
    margin-bottom: 2rem;
  }

  header h1 {
    font-size: 2.5rem;
    margin-bottom: 0.5rem;
  }

  header p {
    font-size: 1.2rem;
    opacity: 0.9;
  }

  .auth-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 60vh;
  }

  .auth-box {
    background: white;
    padding: 2rem;
    border-radius: 12px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
    width: 100%;
    max-width: 400px;
  }

  .auth-box h2 {
    margin-top: 0;
    text-align: center;
  }

  .auth-box form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .auth-box input {
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-size: 1rem;
  }

  .auth-box button {
    padding: 0.75rem;
    background: #667eea;
    color: white;
    border: none;
    border-radius: 6px;
    font-size: 1rem;
    cursor: pointer;
    transition: background 0.2s;
  }

  .auth-box button:hover {
    background: #5568d3;
  }

  .auth-note {
    text-align: center;
    color: #666;
    font-size: 0.9rem;
    margin-top: 1rem;
  }

  .dashboard {
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  .user-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: white;
    padding: 1rem 1.5rem;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  .user-header span {
    font-size: 1.1rem;
  }

  .logout-btn {
    padding: 0.5rem 1rem;
    background: #f44336;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    transition: background 0.2s;
  }

  .logout-btn:hover {
    background: #d32f2f;
  }

  .tracker-section {
    background: white;
    border-radius: 12px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  }

  .analytics-section {
    background: white;
    padding: 2rem;
    border-radius: 12px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  }

  .analytics-section h2 {
    margin-top: 0;
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
    margin: 1.5rem 0;
  }

  .stat-card {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 1.5rem;
    border-radius: 8px;
    text-align: center;
  }

  .stat-card h3 {
    margin: 0 0 0.5rem 0;
    font-size: 1rem;
    opacity: 0.9;
  }

  .stat-value {
    font-size: 2rem;
    font-weight: bold;
    margin: 0;
  }

  .emotion-insights {
    margin: 2rem 0;
  }

  .emotion-insights h3 {
    margin-bottom: 1rem;
  }

  .insight-card {
    background: #f5f5f5;
    padding: 1rem;
    border-radius: 8px;
    margin-bottom: 1rem;
    border-left: 4px solid #667eea;
  }

  .insight-card h4 {
    margin: 0 0 0.5rem 0;
    color: #667eea;
  }

  .insight-card p {
    margin: 0.25rem 0;
    font-size: 0.9rem;
  }

  .insight-message {
    font-weight: bold;
    color: #333;
    margin-top: 0.5rem !important;
  }

  .session-history {
    margin-top: 2rem;
  }

  .session-history h3 {
    margin-bottom: 1rem;
  }

  .session-card {
    background: #fafafa;
    padding: 1rem;
    border-radius: 8px;
    margin-bottom: 0.5rem;
    border: 1px solid #e0e0e0;
  }

  .session-card p {
    margin: 0.25rem 0;
    font-size: 0.9rem;
  }
</style>
