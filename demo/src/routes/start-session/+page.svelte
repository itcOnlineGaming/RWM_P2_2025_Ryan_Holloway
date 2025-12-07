<script lang="ts">
  import { StartSession } from '@ryanholloway/emotion-tracker';

  let selectedMood = '';

  function handleMoodSelect(event: CustomEvent) {
    selectedMood = event.detail.mood;
    console.log('Selected mood:', selectedMood);
  }

  function reset() {
    selectedMood = '';
  }
</script>

<svelte:head>
  <title>Start Session Demo - Emotion Tracker</title>
</svelte:head>

<main>
  <div class="container">
    <div class="header">
      <a href="/" class="back-btn">← Back to Menu</a>
      <h1>Start Session Component</h1>
    </div>

    <div class="demo-card">
      <p class="description">
        The StartSession component allows users to select their initial mood before beginning a session.
        Try selecting different moods below!
      </p>

      <div class="component-demo">
        <StartSession
          title="How are you feeling?"
          subtitle="Select your current mood"
          buttonText="Start Session"
          moodOptions={['Happy', 'Focused', 'Neutral', 'Tired', 'Stressed', 'Anxious']}
          on:sessionStart={handleMoodSelect}
        />
      </div>

      {#if selectedMood}
        <div class="result-panel">
          <h3>Selected Mood: <span class="mood-value">{selectedMood}</span></h3>
          <button on:click={reset} class="reset-btn">Reset Selection</button>
        </div>
      {/if}
    </div>

    <div class="info-card">
      <h2>Component Features</h2>
      <ul>
        <li><strong>Customizable moods:</strong> Pass any array of mood options</li>
        <li><strong>Event handling:</strong> Emits `sessionStart` event with selected mood</li>
        <li><strong>Accessible:</strong> Full keyboard navigation and screen reader support</li>
        <li><strong>Flexible styling:</strong> Customizable title, subtitle, and button text</li>
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

  .component-demo {
    margin-bottom: 2rem;
  }

  .result-panel {
    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
    border-radius: 12px;
    padding: 2rem;
    text-align: center;
  }

  .result-panel h3 {
    margin: 0 0 1rem 0;
    color: #333;
    font-size: 20px;
  }

  .mood-value {
    color: #667eea;
    font-weight: 700;
  }

  .reset-btn {
    padding: 0.75rem 1.5rem;
    background: #667eea;
    color: white;
    border: none;
    border-radius: 8px;
    font-weight: 600;
    font-size: 16px;
    cursor: pointer;
    transition: background 0.3s, transform 0.2s;
  }

  .reset-btn:hover {
    background: #5568d3;
    transform: translateY(-2px);
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
  }
</style>
