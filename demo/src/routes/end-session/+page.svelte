<script lang="ts">
  import { EndSession } from '@ryanholloway/emotion-tracker';

  let selectedMood = '';
  let ratings: Record<string, number> = {};
  let sessionHistory: Array<{ mood: string; ratings: Record<string, number>; timestamp: string }> = [];

  function handleSessionComplete(event: CustomEvent<{ mood: string; ratings: Record<string, number> }>) {
    const { mood, ratings: endRatings } = event.detail;
    
    sessionHistory = [
      ...sessionHistory,
      {
        mood,
        ratings: { ...endRatings },
        timestamp: new Date().toLocaleTimeString()
      }
    ];

    // Reset for next demo
    selectedMood = '';
    ratings = {};
  }

  function resetDemo() {
    selectedMood = '';
    ratings = {};
  }

  function clearHistory() {
    sessionHistory = [];
  }
</script>

<main>
  <nav class="navbar">
    <a href="/" class="back-button">← Back to Menu</a>
    <h1 class="title">EndSession Component Demo</h1>
  </nav>

  <div class="container">
    <div class="info-card">
      <h2>About EndSession</h2>
      <p>
        The <strong>EndSession</strong> component is the final step in a session workflow. 
        It captures the user's ending mood and allows them to rate multiple factors on a 1-10 scale.
      </p>
      <p><strong>Features:</strong></p>
      <ul>
        <li>Customizable mood options with emojis</li>
        <li>Configurable rating factors (1-10 dot scale)</li>
        <li>Validation - requires mood and all ratings before completion</li>
        <li>Event dispatching with complete session data</li>
        <li>Bindable selectedMood and ratings props</li>
        <li>Disabled state support</li>
      </ul>
    </div>

    <div class="demo-section">
      <div class="demo-header">
        <h2>Interactive Demo</h2>
        <button class="reset-btn" on:click={resetDemo}>Reset</button>
      </div>
      
      <EndSession
        title="How did your session go?"
        subtitle="Rate your experience"
        buttonText="Complete Session"
        bind:selectedMood
        bind:ratings
        on:sessionComplete={handleSessionComplete}
      />

      <div class="state-display">
        <h3>Current State:</h3>
        <pre>{JSON.stringify({ selectedMood, ratings }, null, 2)}</pre>
      </div>
    </div>

    {#if sessionHistory.length > 0}
      <div class="history-section">
        <div class="history-header">
          <h2>Session History</h2>
          <button class="clear-btn" on:click={clearHistory}>Clear History</button>
        </div>
        
        <div class="history-list">
          {#each sessionHistory as session, i (i)}
            <div class="history-item">
              <div class="history-time">{session.timestamp}</div>
              <div class="history-mood">
                <strong>Mood:</strong> {session.mood}
              </div>
              <div class="history-ratings">
                <strong>Ratings:</strong>
                <ul>
                  {#each Object.entries(session.ratings) as [factor, rating]}
                    <li>{factor}: {rating}/10</li>
                  {/each}
                </ul>
              </div>
            </div>
          {/each}
        </div>
      </div>
    {/if}
  </div>
</main>

<style>
  :global(body) {
    margin: 0;
    padding: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
    background: #ffffff;
  }

  main {
    min-height: 100vh;
    padding-bottom: 40px;
  }

  .navbar {
    background: #ffffff;
    border-bottom: 1px solid #e2e5f0;
    padding: 16px 20px;
    display: flex;
    align-items: center;
    gap: 16px;
    position: sticky;
    top: 0;
    z-index: 100;
  }

  .back-button {
    text-decoration: none;
    color: #2563eb;
    font-weight: 600;
    font-size: 14px;
    transition: opacity 0.15s ease;
  }

  .back-button:hover {
    opacity: 0.7;
  }

  .title {
    font-size: 20px;
    font-weight: 700;
    color: #111827;
    margin: 0;
  }

  .container {
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
  }

  .info-card {
    background: #f8fafc;
    border-radius: 12px;
    padding: 20px;
    margin-bottom: 24px;
    border: 1px solid #e2e5f0;
  }

  .info-card h2 {
    font-size: 18px;
    font-weight: 700;
    color: #111827;
    margin: 0 0 12px 0;
  }

  .info-card p {
    font-size: 14px;
    color: #4b5563;
    margin: 0 0 12px 0;
    line-height: 1.6;
  }

  .info-card ul {
    margin: 8px 0 0 0;
    padding-left: 20px;
  }

  .info-card li {
    font-size: 14px;
    color: #4b5563;
    margin-bottom: 6px;
    line-height: 1.6;
  }

  .demo-section {
    background: #ffffff;
    border-radius: 12px;
    padding: 20px;
    margin-bottom: 24px;
    border: 1px solid #e2e5f0;
  }

  .demo-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
  }

  .demo-header h2 {
    font-size: 18px;
    font-weight: 700;
    color: #111827;
    margin: 0;
  }

  .reset-btn {
    padding: 8px 16px;
    border-radius: 8px;
    background: #f3f4f6;
    color: #374151;
    border: none;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.15s ease;
  }

  .reset-btn:hover {
    background: #e5e7eb;
  }

  .state-display {
    margin-top: 20px;
    padding: 16px;
    background: #f8fafc;
    border-radius: 8px;
    border: 1px solid #e2e5f0;
  }

  .state-display h3 {
    font-size: 14px;
    font-weight: 600;
    color: #374151;
    margin: 0 0 8px 0;
  }

  .state-display pre {
    margin: 0;
    font-size: 13px;
    color: #1f2937;
    font-family: 'Courier New', monospace;
    overflow-x: auto;
  }

  .history-section {
    background: #ffffff;
    border-radius: 12px;
    padding: 20px;
    border: 1px solid #e2e5f0;
  }

  .history-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
  }

  .history-header h2 {
    font-size: 18px;
    font-weight: 700;
    color: #111827;
    margin: 0;
  }

  .clear-btn {
    padding: 8px 16px;
    border-radius: 8px;
    background: #fee2e2;
    color: #dc2626;
    border: none;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.15s ease;
  }

  .clear-btn:hover {
    background: #fecaca;
  }

  .history-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .history-item {
    background: #f8fafc;
    border-radius: 8px;
    padding: 16px;
    border: 1px solid #e2e5f0;
  }

  .history-time {
    font-size: 12px;
    color: #6b7280;
    margin-bottom: 8px;
  }

  .history-mood {
    font-size: 14px;
    color: #111827;
    margin-bottom: 8px;
  }

  .history-ratings {
    font-size: 14px;
    color: #111827;
  }

  .history-ratings ul {
    margin: 4px 0 0 0;
    padding-left: 20px;
  }

  .history-ratings li {
    font-size: 13px;
    color: #4b5563;
    margin-bottom: 4px;
  }
</style>
