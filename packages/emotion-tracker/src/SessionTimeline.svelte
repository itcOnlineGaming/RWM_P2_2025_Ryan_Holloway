<script lang="ts">
  import { createEventDispatcher, onDestroy } from 'svelte';
  import StartSession from './StartSession.svelte';

  type MoodType = 'Happy' | 'Neutral' | 'Tired' | 'Unwell' | 'Down';
  type Step = 1 | 2 | 3;

  // Props for customization
  export let step1Title = 'How are you feeling before starting?';
  export let step1Subtitle = 'Let us know your current mood';
  export let step1ButtonText = 'Start Session';
  
  export let step2Title = 'Quick distraction check-in';
  export let step2Subtitle = 'Let us know what is pulling your attention';
  export let step2CheckInIntervalSeconds = 60; // seconds (will be converted to milliseconds)
  export let step2EnableAutoCheckIns = false;
  export let step2Distractions = ['Phone', 'Social media', 'Noise', 'People', 'No distractions'];
  
  export let step3Title = 'How did your session go?';
  export let step3Subtitle = 'Rate your experience';
  export let step3ButtonText = 'Complete Session';
  export let step3RatingFactors = ['Productivity', 'Focus', 'Understanding', 'Energy'];
  
  export let moodOptions = ['Happy', 'Neutral', 'Tired', 'Unwell', 'Down'];
  export let moodEmojis: Record<string, string> = {
    'Happy': '😊',
    'Neutral': '😐',
    'Tired': '😴',
    'Unwell': '🤒',
    'Down': '☁️'
  };
  export let distractionEmojis: Record<string, string> = {
    'Phone': '📱',
    'Social media': '💬',
    'Noise': '🔊',
    'People': '👥',
    'No distractions': '✅'
  };

  // Event dispatcher
  const dispatch = createEventDispatcher<{
    sessionStart: { startMood: string };
    sessionEnd: { };
    checkIn: { distractions: string[] };
    sessionComplete: {
      startMood: string;
      distractions: string[];
      checkInCount: number;
      endMood: string;
      ratings: Record<string, number>;
    };
  }>();

  // State
  let currentStep: Step = 1;
  let startMood: string | null = null;
  let selectedDistractions: string[] = [];
  let allDistractions: string[] = [];
  let checkInCount = 0;
  let elapsedSeconds = 0;
  let endMood: string | null = null;
  let showCheckInPrompt = false;
  let ratings: Record<string, number> = {};
  
  $: {
    if (Object.keys(ratings).length === 0) {
      ratings = step3RatingFactors.reduce((acc, factor) => {
        acc[factor] = 0;
        return acc;
      }, {} as Record<string, number>);
    }
  }

  // Timer management
  let timerInterval: ReturnType<typeof setInterval> | null = null;
  let checkInInterval: ReturnType<typeof setInterval> | null = null;

  $: if (currentStep === 2 && !timerInterval) {
    timerInterval = setInterval(() => {
      elapsedSeconds += 1;
    }, 1000);
  } else if (currentStep !== 2 && timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }

  $: if (currentStep === 2 && step2EnableAutoCheckIns && !checkInInterval) {
    checkInInterval = setInterval(() => {
      showCheckInPrompt = true;
    }, step2CheckInIntervalSeconds * 1000);
  } else if (currentStep !== 2 && checkInInterval) {
    clearInterval(checkInInterval);
    checkInInterval = null;
  }

  onDestroy(() => {
    if (timerInterval) clearInterval(timerInterval);
    if (checkInInterval) clearInterval(checkInInterval);
  });

  // Format elapsed time as MM:SS
  function formatElapsed(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }

  // Step 1: Start session
  function handleStartSession(event: CustomEvent<{ startMood: string }>) {
    const { startMood: mood } = event.detail;
    if (!mood) return;
    startMood = mood;
    dispatch('sessionStart', { startMood: mood });
    currentStep = 2;
  }

  // Step 2: Save check-in
  function handleSaveCheckIn() {
    checkInCount += 1;
    allDistractions = [...new Set([...allDistractions, ...selectedDistractions])];
    dispatch('checkIn', { distractions: selectedDistractions });
    selectedDistractions = [];
    showCheckInPrompt = false;
  }

  // Step 2: End session (go to step 3)
  function handleEndSession() {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
    if (checkInInterval) {
      clearInterval(checkInInterval);
      checkInInterval = null;
    }
    dispatch('sessionEnd', {});
    currentStep = 3;
  }

  function toggleDistraction(distraction: string) {
    if (distraction === 'No distractions') {
      if (selectedDistractions.includes('No distractions')) {
        selectedDistractions = selectedDistractions.filter(d => d !== 'No distractions');
      } else {
        selectedDistractions = ['No distractions'];
      }
    } else {
      if (selectedDistractions.includes('No distractions')) {
        selectedDistractions = selectedDistractions.filter(d => d !== 'No distractions');
      }

      if (selectedDistractions.includes(distraction)) {
        selectedDistractions = selectedDistractions.filter(d => d !== distraction);
      } else {
        selectedDistractions = [...selectedDistractions, distraction];
      }
    }
  }

  // Step 3: Complete session
  function handleCompleteSession() {
    if (!endMood || !Object.values(ratings).every(r => r > 0)) return;

    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
    if (checkInInterval) {
      clearInterval(checkInInterval);
      checkInInterval = null;
    }

    dispatch('sessionComplete', {
      startMood: startMood!,
      distractions: allDistractions,
      checkInCount,
      endMood,
      ratings
    });

    // Reset component
    currentStep = 1;
    startMood = null;
    selectedDistractions = [];
    allDistractions = [];
    checkInCount = 0;
    elapsedSeconds = 0;
    endMood = null;
    showCheckInPrompt = false;
    ratings = step3RatingFactors.reduce((acc, factor) => {
      acc[factor] = 0;
      return acc;
    }, {} as Record<string, number>);
  }

  function setRating(factor: string, value: number) {
    ratings[factor] = value;
  }
</script>

<div class="timeline-container">
  {#if currentStep === 1}
    <StartSession
      title={step1Title}
      subtitle={step1Subtitle}
      buttonText={step1ButtonText}
      {moodOptions}
      {moodEmojis}
      selectedMood={startMood}
      on:moodSelect={(e) => (startMood = e.detail.mood)}
      on:start={handleStartSession}
    />
  {/if}

  <!-- Step 2: During - Top bar -->
  {#if currentStep === 2}
    <div class="top-bar">
      <div class="bar-content">
        <div class="bar-text">
          <div class="bar-title">{step2Title}</div>
          <div class="bar-time">Elapsed · {formatElapsed(elapsedSeconds)}</div>
        </div>
        <div class="bar-counter">{checkInCount} check-{checkInCount === 1 ? 'in' : 'ins'}</div>
      </div>
    </div>

    <!-- Step 2: Child content area (slot) -->
    <div class="step2-content">
      <slot {elapsedSeconds} />
    </div>

    <!-- Check-in prompt modal -->
    {#if showCheckInPrompt}
      <div class="checkin-overlay">
        <div class="checkin-modal">
          <h3>Quick distraction check-in</h3>
          <p>{step2Subtitle}</p>
          <div class="chips-row">
            {#each step2Distractions as distraction (distraction)}
              <button
                class="chip"
                class:chip--selected={selectedDistractions.includes(distraction)}
                on:click={() => toggleDistraction(distraction)}
              >
                <span class="chip-icon">{distractionEmojis[distraction] || '📱'}</span>
                {distraction}
              </button>
            {/each}
          </div>
          <button class="primary-btn" on:click={handleSaveCheckIn}>Save check-in</button>
          <button class="ghost-btn" on:click={() => (showCheckInPrompt = false)}>Skip</button>
        </div>
      </div>
    {/if}
  {/if}

  <!-- Step 3: After -->
  {#if currentStep === 3}
    <div class="top-card">
      <div class="card-tag">STEP 3 · AFTER</div>
      <h2 class="card-title">{step3Title}</h2>
      <p class="card-subtitle">{step3Subtitle}</p>

      <div class="chips-row">
        {#each moodOptions as mood (mood)}
          {@const isEndMoodSelected = endMood === mood}
          <button
            class="chip"
            class:chip--selected={isEndMoodSelected}
            on:click={() => (endMood = mood)}
          >
            <span class="chip-icon">{moodEmojis[mood] || '😊'}</span>
            {mood}
          </button>
        {/each}
      </div>

      <div class="ratings-section">
        {#each step3RatingFactors as factor (factor)}
          <div class="rating-row">
            <span class="rating-label">{factor}</span>
            <span class="rating-value">{ratings[factor]}/10</span>
          </div>
          <div class="rating-dots">
            {#each Array(10) as _, i (i)}
              <button
                class="dot"
                class:dot--filled={i < ratings[factor]}
                on:click={() => setRating(factor, i + 1)}
                aria-label="Rate {factor} as {i + 1}"
              />
            {/each}
          </div>
        {/each}
      </div>

      <button
        class="primary-btn"
        disabled={!endMood || !Object.values(ratings).every(r => r > 0)}
        on:click={handleCompleteSession}
      >
        {step3ButtonText}
      </button>
    </div>
  {/if}

  <!-- Bottom status bar (Steps 2-3) -->
  {#if currentStep > 1}
    <div class="bottom-bar">
      <div class="bottom-inner">
        <div class="bottom-text">
          <div class="bottom-text-main">Session in progress</div>
          <div class="bottom-text-sub">
            {#if currentStep === 2}
              Tap "End session" when ready to wrap up
            {:else if currentStep === 3}
              Final step: Complete your session
            {/if}
          </div>
        </div>
        <button class="bottom-btn" on:click={handleEndSession}>
          {currentStep === 2 ? 'End session' : 'Back'}
        </button>
      </div>
    </div>
  {/if}
</div>

<style>
  * {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
  }

  :root {
    --bg: #f5f7fb;
    --card-bg: #ffffff;
    --primary: #2563eb;
    --primary-soft: #e0edff;
    --success: #22c55e;
    --success-soft: #dcfce7;
    --danger: #f97316;
    --border: #e2e5f0;
    --text-main: #111827;
    --text-muted: #6b7280;
    --chip-bg: #f3f4f6;
    --chip-selected: #2563eb;
    --chip-selected-text: #ffffff;
    --radius-card: 18px;
    --radius-chip: 999px;
    --shadow-card: 0 16px 40px rgba(15, 23, 42, 0.08);
  }

  .timeline-container {
    width: 100%;
    display: flex;
    flex-direction: column;
    position: relative;
  }

  /* Top card (Step 1 and Step 3) */
  .top-card {
    background: var(--card-bg);
    border-radius: var(--radius-card);
    box-shadow: var(--shadow-card);
    padding: 18px 16px 16px;
    border: 1px solid var(--border);
    margin: 16px;
    margin-bottom: 0;
  }

  .card-tag {
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--primary);
    font-weight: 600;
    margin-bottom: 6px;
  }

  .card-title {
    font-size: 18px;
    font-weight: 700;
    margin: 0 0 6px 0;
    color: var(--text-main);
  }

  .card-subtitle {
    font-size: 13px;
    color: var(--text-muted);
    margin-bottom: 14px;
  }

  /* Top bar (Step 2) */
  .top-bar {
    background: var(--card-bg);
    border-radius: var(--radius-card);
    box-shadow: var(--shadow-card);
    border: 1px solid var(--border);
    padding: 12px 16px;
    margin: 16px;
    margin-bottom: 0;
  }

  .bar-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .bar-text {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .bar-title {
    font-size: 14px;
    font-weight: 600;
    color: var(--text-main);
  }

  .bar-time {
    font-size: 12px;
    color: var(--text-muted);
  }

  .bar-counter {
    font-size: 12px;
    color: var(--text-muted);
    background: #f3f4f6;
    padding: 4px 8px;
    border-radius: 999px;
  }

  /* Step 2 content area */
  .step2-content {
    flex: 1;
    padding: 16px;
    min-height: 200px;
  }

  /* Chips */
  .chips-row {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 14px;
  }

  .chip {
    border-radius: var(--radius-chip);
    background: var(--chip-bg);
    padding: 7px 12px;
    font-size: 13px;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    cursor: pointer;
    border: 1px solid transparent;
    color: var(--text-main);
    white-space: nowrap;
    transition: all 0.2s ease;
  }

  .chip:hover {
    opacity: 0.8;
  }

  .chip-icon {
    font-size: 14px;
  }

  .chip--selected {
    background: var(--chip-selected);
    color: var(--chip-selected-text);
    font-weight: 600;
  }

  /* Buttons */
  .primary-btn,
  .ghost-btn {
    width: 100%;
    border-radius: 999px;
    font-size: 15px;
    padding: 12px 16px;
    font-weight: 600;
    border: none;
    cursor: pointer;
    margin-top: 10px;
    transition: all 0.2s ease;
  }

  .primary-btn {
    background: var(--primary);
    color: #ffffff;
  }

  .primary-btn:hover:not(:disabled) {
    background: #1d4ed8;
  }

  .primary-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .ghost-btn {
    background: transparent;
    color: var(--danger);
  }

  .ghost-btn:hover {
    opacity: 0.7;
  }

  /* Ratings section */
  .ratings-section {
    margin-bottom: 14px;
  }

  .rating-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 6px;
  }

  .rating-label {
    font-size: 13px;
    font-weight: 600;
    color: var(--text-main);
  }

  .rating-value {
    font-size: 13px;
    color: var(--text-muted);
  }

  .rating-dots {
    display: flex;
    gap: 4px;
    margin-bottom: 12px;
  }

  .dot {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #e5e7eb;
    border: none;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .dot:hover {
    background: #d1d5db;
  }

  .dot--filled {
    background: var(--primary);
  }

  /* Check-in modal overlay */
  .checkin-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 50;
  }

  .checkin-modal {
    background: var(--card-bg);
    border-radius: var(--radius-card);
    padding: 24px;
    max-width: 400px;
    width: 90%;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  }

  .checkin-modal h3 {
    margin: 0 0 8px 0;
    font-size: 18px;
    font-weight: 700;
    color: var(--text-main);
  }

  .checkin-modal p {
    margin: 0 0 16px 0;
    font-size: 13px;
    color: var(--text-muted);
  }

  /* Bottom bar */
  .bottom-bar {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(15, 23, 42, 0.92);
    color: #e5e7eb;
    padding: 10px 16px 14px;
    display: flex;
    justify-content: center;
    z-index: 100;
  }

  .bottom-inner {
    width: 100%;
    max-width: 420px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
  }

  .bottom-text {
    font-size: 12px;
  }

  .bottom-text-main {
    color: #ffffff;
    font-weight: 600;
    margin-bottom: 2px;
  }

  .bottom-text-sub {
    color: #9ca3af;
    font-size: 11px;
  }

  .bottom-btn {
    border-radius: 999px;
    border: none;
    padding: 8px 14px;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    background: var(--danger);
    color: #ffffff;
    white-space: nowrap;
    transition: all 0.2s ease;
  }

  .bottom-btn:hover {
    background: #ea580c;
  }
</style>
