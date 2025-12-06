<script lang="ts">
  import { SessionTimeline } from '@ryanholloway/emotion-tracker';

  let sessionData: any = null;
  let step2Content = 'timer'; // 'timer' or 'quiz'

  function handleSessionStart(event: CustomEvent) {
    console.log('Session started:', event.detail);
  }

  function handleSessionEnd(event: CustomEvent) {
    console.log('Session ended');
  }

  function handleCheckIn(event: CustomEvent) {
    console.log('Check-in saved:', event.detail);
  }

  function handleSessionComplete(event: CustomEvent) {
    sessionData = event.detail;
    console.log('Session completed:', sessionData);
  }

  function toggleContent() {
    step2Content = step2Content === 'timer' ? 'quiz' : 'timer';
  }
</script>

<div class="demo-container">
  <div class="header">
    <h1>Focus Session Timeline</h1>
    <p class="subtitle">Customizable session tracking component with slots for Step 2 content</p>
  </div>

  <SessionTimeline
    step1Title="How are you feeling right now?"
    step1Subtitle="Pick your starting mood"
    step1ButtonText="Begin"
    step2Title="Stay focused!"
    step2Subtitle="Track any distractions"
    step2EnableAutoCheckIns={true}
    step2Distractions={['Phone', 'Social media', 'Noise', 'People', 'No distractions']}
    step3Title="Session complete!"
    step3Subtitle="How'd it go?"
    step3ButtonText="Finish"
    step3RatingFactors={['Focus', 'Enjoyment', 'Productivity']}
    moodOptions={['Happy', 'Neutral', 'Tired', 'Unwell', 'Down']}
    on:sessionStart={handleSessionStart}
    on:sessionEnd={handleSessionEnd}
    on:checkIn={handleCheckIn}
    on:sessionComplete={handleSessionComplete}
  >
    <!-- Custom content for Step 2 (During) -->
    <div class="step2-content-wrapper">
      {#if step2Content === 'timer'}
        <div class="timer-display">
          <h3>Timer Mode</h3>
          <p>Work on your task</p>
          <button on:click={toggleContent} class="toggle-btn">Switch to Quiz Mode</button>
        </div>
      {:else}
        <div class="quiz-display">
          <h3>Quick Quiz</h3>
          <p>What are you working on?</p>
          <input type="text" placeholder="Type here..." />
          <button on:click={toggleContent} class="toggle-btn">Back to Timer</button>
        </div>
      {/if}
    </div>
  </SessionTimeline>

  {#if sessionData}
    <div class="session-data">
      <h2>Session Data (logged to console)</h2>
      <pre>{JSON.stringify(sessionData, null, 2)}</pre>
    </div>
  {/if}
</div>

<style>
  .demo-container {
    max-width: 480px;
    margin: 0 auto;
    padding: 24px 16px 100px;
  }

  .header {
    margin-bottom: 24px;
  }

  h1 {
    font-size: 28px;
    font-weight: 700;
    margin-bottom: 8px;
    color: #111827;
  }

  .subtitle {
    font-size: 15px;
    color: #6b7280;
  }

  .step2-content-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 250px;
  }

  .timer-display,
  .quiz-display {
    text-align: center;
    padding: 24px;
    background: #f9fafb;
    border-radius: 12px;
    border: 1px solid #e5e7eb;
  }

  .timer-display h3,
  .quiz-display h3 {
    margin: 0 0 8px 0;
    font-size: 18px;
    font-weight: 700;
    color: #111827;
  }

  .timer-display p,
  .quiz-display p {
    margin: 0 0 16px 0;
    color: #6b7280;
  }

  input[type='text'] {
    width: 100%;
    padding: 12px;
    margin-bottom: 16px;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    font-size: 14px;
  }

  .toggle-btn {
    padding: 10px 16px;
    background: #2563eb;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 600;
    font-size: 14px;
    transition: background 0.2s;
  }

  .toggle-btn:hover {
    background: #1d4ed8;
  }

  .session-data {
    margin-top: 32px;
    padding: 16px;
    background: #f3f4f6;
    border-radius: 12px;
    border: 1px solid #e5e7eb;
  }

  .session-data h2 {
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 12px;
    color: #111827;
  }

  pre {
    background: #ffffff;
    padding: 12px;
    border-radius: 8px;
    overflow-x: auto;
    font-size: 12px;
    color: #374151;
    margin: 0;
  }
</style>
