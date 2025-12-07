<script lang="ts">
  import { MidSessionCheckIn } from '@ryanholloway/emotion-tracker';
  import type { CheckInEvent } from '@ryanholloway/emotion-tracker';

  interface CheckInWithTimestamp extends CheckInEvent {
    timestamp: number;
  }

  let showModal = false;
  let selectedDistractions: string[] = [];
  let savedCheckIns: CheckInWithTimestamp[] = [];

  function openCheckIn() {
    showModal = true;
    selectedDistractions = [];
  }

  function handleSave(event: CustomEvent<CheckInEvent>) {
    savedCheckIns = [...savedCheckIns, { ...event.detail, timestamp: Date.now() }];
    showModal = false;
    console.log('Check-in saved:', event.detail);
  }

  function handleClose() {
    showModal = false;
    selectedDistractions = [];
  }

  function clearHistory() {
    savedCheckIns = [];
  }
</script>

<svelte:head>
  <title>Mid-Session Check-In Demo - Emotion Tracker</title>
</svelte:head>

<main>
  <div class="container">
    <div class="header">
      <a href="/" class="back-btn">← Back to Menu</a>
      <h1>Mid-Session Check-In Component</h1>
    </div>

    <div class="demo-card">
      <p class="description">
        The MidSessionCheckIn component provides a modal for users to track distractions during their work session.
        Click the button below to see it in action!
      </p>

      <div class="controls">
        <button on:click={openCheckIn} class="trigger-btn">
          Open Check-In Modal
        </button>
      </div>

      <MidSessionCheckIn
        title="Quick Check-In"
        subtitle="Any distractions so far?"
        buttonText="Save"
        distractions={['Phone', 'Email', 'Slack', 'Social Media', 'Meetings', 'Other', 'No distractions']}
        distractionEmojis={{ Phone: '📱', Email: '📧', Slack: '💬', 'Social Media': '🌐', Meetings: '📅', Other: '🔔', 'No distractions': '✅' }}
        bind:selectedDistractions
        bind:show={showModal}
        on:save={handleSave}
        on:close={handleClose}
      />

      {#if savedCheckIns.length > 0}
        <div class="history-panel">
          <div class="history-header">
            <h3>Check-In History ({savedCheckIns.length})</h3>
            <button on:click={clearHistory} class="clear-btn">Clear History</button>
          </div>
          
          <div class="check-in-list">
            {#each savedCheckIns.slice().reverse() as checkIn, idx}
              <div class="check-in-item">
                <div class="check-in-number">Check-In {savedCheckIns.length - idx}</div>
                <div class="check-in-time">
                  {new Date(checkIn.timestamp).toLocaleTimeString()}
                </div>
                <div class="check-in-distractions">
                  {#if checkIn.distractions.length === 0}
                    <span class="no-distractions">No distractions recorded</span>
                  {:else}
                    <div class="distraction-tags">
                      {#each checkIn.distractions as distraction}
                        <span class="distraction-tag">{distraction}</span>
                      {/each}
                    </div>
                  {/if}
                </div>
              </div>
            {/each}
          </div>
        </div>
      {/if}
    </div>

    <div class="info-card">
      <h2>Component Features</h2>
      <ul>
        <li><strong>Modal interface:</strong> Clean overlay modal with click-outside to close</li>
        <li><strong>Multi-select:</strong> Users can select multiple distractions</li>
        <li><strong>Custom emojis:</strong> Add visual indicators for each distraction type</li>
        <li><strong>Exclusive option:</strong> "No distractions" automatically deselects other options</li>
        <li><strong>Keyboard support:</strong> Escape key closes the modal</li>
        <li><strong>Event tracking:</strong> Emits detailed check-in events with timestamps</li>
      </ul>
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

  .container {
    max-width: 900px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  .header {
    display: flex;
    align-items: center;
    gap: 1.5rem;
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

  .header h1 {
    margin: 0;
    color: #333;
    font-size: 32px;
  }

  .demo-card {
    background: white;
    border-radius: 16px;
    padding: 2.5rem;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  }

  .description {
    margin: 0 0 2rem 0;
    color: #666;
    font-size: 16px;
    line-height: 1.6;
  }

  .controls {
    text-align: center;
    margin: 2rem 0;
  }

  .trigger-btn {
    padding: 1rem 2rem;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    border-radius: 12px;
    font-weight: 600;
    font-size: 18px;
    cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s;
    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
  }

  .trigger-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
  }

  .history-panel {
    margin-top: 2rem;
    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
    border-radius: 12px;
    padding: 2rem;
  }

  .history-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
  }

  .history-header h3 {
    margin: 0;
    color: #333;
    font-size: 20px;
  }

  .clear-btn {
    padding: 0.5rem 1rem;
    background: #f44336;
    color: white;
    border: none;
    border-radius: 6px;
    font-weight: 600;
    font-size: 14px;
    cursor: pointer;
    transition: background 0.3s;
  }

  .clear-btn:hover {
    background: #d32f2f;
  }

  .check-in-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .check-in-item {
    background: white;
    border-radius: 8px;
    padding: 1.25rem;
    border-left: 4px solid #667eea;
  }

  .check-in-number {
    font-weight: 700;
    color: #667eea;
    font-size: 14px;
    margin-bottom: 0.5rem;
  }

  .check-in-time {
    font-size: 13px;
    color: #999;
    margin-bottom: 0.75rem;
  }

  .check-in-distractions {
    margin-top: 0.5rem;
  }

  .no-distractions {
    color: #10b981;
    font-weight: 600;
    font-size: 14px;
  }

  .distraction-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .distraction-tag {
    background: #dbeafe;
    color: #1e40af;
    padding: 0.4rem 0.9rem;
    border-radius: 16px;
    font-size: 14px;
    font-weight: 500;
  }

  .info-card {
    background: white;
    border-radius: 16px;
    padding: 2.5rem;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  }

  .info-card h2 {
    margin: 0 0 1.5rem 0;
    color: #333;
    font-size: 24px;
  }

  .info-card ul {
    margin: 0;
    padding-left: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .info-card li {
    color: #555;
    font-size: 16px;
    line-height: 1.6;
  }

  .info-card strong {
    color: #333;
  }

  @media (max-width: 768px) {
    main {
      padding: 1rem;
    }

    .header {
      flex-direction: column;
      align-items: flex-start;
    }

    .demo-card,
    .info-card {
      padding: 1.5rem;
    }

    .history-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 1rem;
    }
  }
</style>
