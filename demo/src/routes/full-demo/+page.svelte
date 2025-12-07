<script lang="ts">
  import { SessionTimeline } from '@ryanholloway/emotion-tracker';
  import type { SessionData } from '@ryanholloway/emotion-tracker';
  import { onMount } from 'svelte';

  // Get current user from localStorage
  let currentUser = '';
  
  // Session storage
  let sessions: SessionData[] = [];

  // Session demo state
  let sessionData: any = null;
  let timerValue = 0;
  let timerInterval: ReturnType<typeof setInterval> | null = null;
  let expandedSessions: Set<number> = new Set();

  onMount(() => {
    // Get the current user from localStorage
    currentUser = localStorage.getItem('current_user') || 'guest';
    loadSessions();
  });

  // Load sessions from localStorage (simulating API)
  function loadSessions() {
    const stored = localStorage.getItem(`sessions_${currentUser}`);
    if (stored) {
      sessions = JSON.parse(stored);
    } else {
      sessions = [];
    }
  }

  // Save sessions to localStorage (simulating API)
  function saveSessions() {
    localStorage.setItem(`sessions_${currentUser}`, JSON.stringify(sessions));
  }

  function handleSessionStart(event: CustomEvent) {
    console.log('Session started:', event.detail);
    timerValue = 0;
    // Start interval to update timer display
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(() => {
      timerValue += 1;
    }, 1000);
  }

  function handleSessionEnd(event: CustomEvent) {
    console.log('Session ended');
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
  }

  function handleCheckIn(event: CustomEvent) {
    console.log('Check-in saved:', event.detail);
  }

  function handleSessionComplete(event: CustomEvent) {
    sessionData = event.detail;
    // Save to user's session history
    sessions = [...sessions, event.detail];
    saveSessions();
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
    console.log('Session completed and saved:', sessionData);
  }

  // Format seconds to MM:SS
  function formatTimer(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }

  function resetSession() {
    sessionData = null;
  }

  function toggleSessionExpanded(idx: number) {
    if (expandedSessions.has(idx)) {
      expandedSessions.delete(idx);
    } else {
      expandedSessions.add(idx);
    }
    expandedSessions = expandedSessions; // Trigger reactivity
  }
</script>

<svelte:head>
  <title>Full Demo - Emotion Tracker</title>
</svelte:head>

<main>
  <div class="dashboard">
    <div class="user-header">
      <a href="/" class="back-btn">← Back to Menu</a>
      <h1>Full Session Demo</h1>
    </div>

    <div class="demo-container">
        <SessionTimeline
          step1Title="How are you feeling right now?"
          step1Subtitle="Pick your starting mood"
          step1ButtonText="Begin Session"
          step2Title="Stay focused!"
          step2Subtitle="Track any distractions"
          step2EnableAutoCheckIns={true}
          step2CheckInIntervalSeconds={60}
          step2Distractions={['Phone', 'Slack', 'Email', 'Meetings', 'No distractions']}
          step3Title="Session complete!"
          step3Subtitle="How'd it go?"
          step3ButtonText="Finish"
          step3RatingFactors={['Focus', 'Enjoyment', 'Productivity']}
          moodOptions={['Happy', 'Focused', 'Neutral', 'Tired', 'Stressed']}
          on:sessionStart={handleSessionStart}
          on:sessionEnd={handleSessionEnd}
          on:checkIn={handleCheckIn}
          on:sessionComplete={handleSessionComplete}
        >
          <!-- Step 2 custom content: Big timer -->
          <div class="timer-container">
            <div class="big-timer">
              <span class="timer-label">Time Elapsed</span>
              <div class="timer-display">
                <span class="timer-value">{formatTimer(timerValue)}</span>
              </div>
              <p class="timer-instruction">Keep working on your task</p>
            </div>
          </div>
        </SessionTimeline>

        {#if sessionData}
          <div class="session-results">
            <h2>Session Complete!</h2>
            <div class="results-grid">
              <div class="result-item">
                <strong>Starting Mood:</strong> {sessionData.startMood}
              </div>
              <div class="result-item">
                <strong>Ending Mood:</strong> {sessionData.endMood}
              </div>
              <div class="result-item">
                <strong>Check-ins:</strong> {sessionData.checkInCount || 0}
              </div>
              {#if sessionData.distractions && sessionData.distractions.length > 0}
                <div class="result-item">
                  <strong>Distractions:</strong> {sessionData.distractions.join(', ')}
                </div>
              {/if}
              {#if sessionData.ratings}
                <div class="result-item">
                  <strong>Ratings:</strong>
                  <div class="ratings-display">
                    {#each Object.entries(sessionData.ratings) as [factor, rating]}
                      <span>{factor}: {rating}/10</span>
                    {/each}
                  </div>
                </div>
              {/if}
            </div>
            <button on:click={resetSession} class="reset-btn">Start New Session</button>
          </div>
        {/if}

      {#if sessions.length > 0}
        <div class="session-history">
          <h2>Your Session History</h2>
          <div class="history-list">
            {#each sessions.slice().reverse() as session, idx}
              <div class="history-card">
                <button
                  class="history-header"
                  on:click={() => toggleSessionExpanded(idx)}
                  aria-expanded={expandedSessions.has(idx)}
                >
                  <span class="history-index">Session {sessions.length - idx}</span>
                  <span class="expand-icon">{expandedSessions.has(idx) ? '▼' : '▶'}</span>
                </button>
                
                <div class="history-summary">
                  <div class="summary-item">
                    <span class="label">Mood:</span>
                    <span class="value">{session.startMood} → {session.endMood}</span>
                  </div>
                  <div class="summary-item">
                    <span class="label">Check-ins:</span>
                    <span class="value">{session.checkInCount || 0}</span>
                  </div>
                  {#if session.distractions && session.distractions.length > 0}
                    <div class="summary-item">
                      <span class="label">Distractions:</span>
                      <span class="value">{session.distractions.length}</span>
                    </div>
                  {/if}
                </div>

                {#if expandedSessions.has(idx)}
                  <div class="history-details">
                    <div class="detail-section">
                      <h4>Mood & Emotional Data</h4>
                      <div class="detail-row">
                        <span class="detail-label">Starting Mood:</span>
                        <span class="detail-value">{session.startMood}</span>
                      </div>
                      <div class="detail-row">
                        <span class="detail-label">Ending Mood:</span>
                        <span class="detail-value">{session.endMood}</span>
                      </div>
                    </div>

                    {#if session.distractions && session.distractions.length > 0}
                      <div class="detail-section">
                        <h4>Distractions ({session.distractions.length})</h4>
                        <div class="distraction-list">
                          {#each session.distractions as distraction}
                            <span class="distraction-tag">{distraction}</span>
                          {/each}
                        </div>
                      </div>
                    {:else}
                      <div class="detail-section">
                        <h4>Distractions</h4>
                        <p class="no-data">No distractions recorded</p>
                      </div>
                    {/if}

                    {#if session.checkInCount}
                      <div class="detail-section">
                        <h4>Session Engagement</h4>
                        <div class="detail-row">
                          <span class="detail-label">Check-ins:</span>
                          <span class="detail-value">{session.checkInCount}</span>
                        </div>
                      </div>
                    {/if}

                    {#if session.ratings && Object.keys(session.ratings).length > 0}
                      <div class="detail-section">
                        <h4>Session Ratings</h4>
                        <div class="ratings-list">
                          {#each Object.entries(session.ratings) as [factor, ratingValue]}
                            <div class="rating-row">
                              <span class="rating-label">{factor}</span>
                              <div class="rating-bar">
                                <div class="rating-fill" style="width: {(Number(ratingValue) / 10) * 100}%"></div>
                              </div>
                              <span class="rating-value">{ratingValue}/10</span>
                            </div>
                          {/each}
                        </div>
                      </div>
                    {/if}
                  </div>
                {/if}
              </div>
            {/each}
          </div>
        </div>
      {/if}
    </div>
  </div>
</main>

<style>
  :global(body) {
    margin: 0;
    padding: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
    background: white;
    min-height: 100vh;
  }

  main {
    min-height: 100vh;
    padding: 2rem;
  }

  .auth-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
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
    color: #111827;
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
    font-family: inherit;
  }

  .auth-box button {
    padding: 0.75rem;
    background: #667eea;
    color: white;
    border: none;
    border-radius: 6px;
    font-size: 1rem;
    font-weight: 600;
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
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  .user-header {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: 1.5rem;
    padding: 1rem 0;
    margin-bottom: 1rem;
  }

  .back-btn {
    padding: 0.75rem 1.5rem;
    background: #667eea;
    color: white;
    border: none;
    border-radius: 8px;
    text-decoration: none;
    font-weight: 600;
    font-size: 16px;
    transition: background 0.3s, transform 0.2s;
    display: inline-block;
  }

  .back-btn:hover {
    background: #5568d3;
    transform: translateY(-2px);
  }

  .user-header h1 {
    margin: 0;
    color: #333;
    font-size: 28px;
  }

  .demo-container {
    background: white;
    border-radius: 12px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
    overflow: hidden;
  }

  .timer-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 300px;
    padding: 40px 20px;
    background: white;
  }

  .big-timer {
    text-align: center;
  }

  .timer-label {
    display: block;
    font-size: 16px;
    font-weight: 500;
    color: #6b7280;
    margin-bottom: 16px;
  }

  .timer-display {
    margin: 0 0 20px 0;
  }

  .timer-value {
    font-size: 80px;
    font-weight: 700;
    color: #1f2937;
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
    letter-spacing: 2px;
  }

  .timer-instruction {
    font-size: 14px;
    color: #9ca3af;
    margin: 0;
  }

  .session-results {
    background: white;
    border-radius: 12px;
    padding: 24px;
    margin-top: 24px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }

  .session-results h2 {
    margin: 0 0 16px 0;
    font-size: 20px;
    color: #111827;
  }

  .results-grid {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-bottom: 20px;
  }

  .result-item {
    padding: 12px;
    background: #f3f4f6;
    border-radius: 8px;
    font-size: 14px;
    color: #374151;
  }

  .result-item strong {
    color: #111827;
    display: block;
    margin-bottom: 4px;
  }

  .ratings-display {
    display: flex;
    flex-direction: column;
    gap: 4px;
    margin-top: 8px;
  }

  .ratings-display span {
    font-size: 13px;
    color: #6b7280;
  }

  .reset-btn {
    width: 100%;
    padding: 12px;
    background: #2563eb;
    color: white;
    border: none;
    border-radius: 6px;
    font-weight: 600;
    font-size: 14px;
    cursor: pointer;
    transition: background 0.2s;
  }

  .reset-btn:hover {
    background: #1d4ed8;
  }

  .session-history {
    background: white;
    border-radius: 12px;
    padding: 2rem;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  }

  .session-history h2 {
    margin-top: 0;
    color: #111827;
  }

  .history-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .history-card {
    background: #f9fafb;
    border-radius: 8px;
    border-left: 4px solid #667eea;
    overflow: hidden;
  }

  .history-header {
    background: #f3f4f6;
    padding: 1rem;
    border: none;
    border-bottom: 1px solid #e5e7eb;
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    font-size: 1rem;
    font-weight: 600;
    text-align: left;
    transition: background 0.2s;
  }

  .history-header:hover {
    background: #e5e7eb;
  }

  .expand-icon {
    font-size: 0.75rem;
    color: #6b7280;
    transition: transform 0.2s;
  }

  .history-index {
    font-weight: 700;
    color: #667eea;
    font-size: 0.9rem;
  }

  .history-summary {
    display: flex;
    gap: 1rem;
    padding: 0.75rem 1rem;
    background: white;
    border-bottom: 1px solid #e5e7eb;
    flex-wrap: wrap;
  }

  .summary-item {
    display: flex;
    gap: 0.5rem;
    font-size: 0.85rem;
  }

  .summary-item .label {
    color: #6b7280;
    font-weight: 500;
  }

  .summary-item .value {
    color: #111827;
    font-weight: 600;
  }

  .history-details {
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .detail-section {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .detail-section h4 {
    margin: 0;
    color: #111827;
    font-size: 0.9rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: #667eea;
  }

  .detail-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem 0;
    font-size: 0.9rem;
    border-bottom: 1px solid #e5e7eb;
  }

  .detail-label {
    color: #6b7280;
    font-weight: 500;
  }

  .detail-value {
    color: #111827;
    font-weight: 600;
  }

  .distraction-list {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .distraction-tag {
    background: #dbeafe;
    color: #1e40af;
    padding: 0.25rem 0.75rem;
    border-radius: 12px;
    font-size: 0.85rem;
    font-weight: 500;
  }

  .no-data {
    color: #9ca3af;
    font-style: italic;
    margin: 0.5rem 0;
  }

  .ratings-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .rating-row {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .rating-label {
    min-width: 100px;
    color: #6b7280;
    font-weight: 500;
    font-size: 0.9rem;
  }

  .rating-bar {
    flex: 1;
    height: 8px;
    background: #e5e7eb;
    border-radius: 4px;
    overflow: hidden;
  }

  .rating-fill {
    height: 100%;
    background: linear-gradient(90deg, #667eea, #764ba2);
    transition: width 0.3s ease;
  }

  .rating-value {
    min-width: 50px;
    text-align: right;
    color: #111827;
    font-weight: 700;
    font-size: 0.9rem;
  }
</style>
