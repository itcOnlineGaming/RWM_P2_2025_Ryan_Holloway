<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { EmotionData, SessionData, DistractionEvent, PreSessionEmotion } from './types';
  import Modal from './Modal.svelte';
  import { logEmotionSelection, persistSessionStart, persistSessionEnd } from './events';

  // Props for customization
  export let sessionId: string = '';
  export let customEmotions: PreSessionEmotion[] = ['Happy', 'Neutral', 'Tired', 'Unwell', 'Down'];
  export let userId: string = '';
  export let enableMidSessionChecks: boolean = true;
  export let midSessionInterval: number = 15; // minutes
  export let performanceFactors: string[] = ['Productivity', 'Focus', 'Understanding', 'Energy'];
  export let showAnalytics: boolean = true;
  export let theme: 'light' | 'dark' = 'light';

  // State
  let sessionState: 'pre-session' | 'active' | 'post-session' | 'complete' = 'pre-session';
  let preSessionEmotion: PreSessionEmotion | '' = '';
  let postSessionEmotion: PreSessionEmotion | '' = '';
  let performanceRatings: { [key: string]: number } = {};
  let distractions: DistractionEvent[] = [];
  let sessionStartTime: number | null = null;
  let midSessionTimer: number | null = null;
  let showMidSessionPopup: boolean = false;

  const dispatch = createEventDispatcher<{
    sessionStart: EmotionData;
    sessionEnd: SessionData;
    distractionLogged: DistractionEvent;
  }>();

  // Pre-session emotion selection
  function selectPreEmotion(emotion: any) {
    preSessionEmotion = emotion as PreSessionEmotion;
    // Log analytics immediately, synchronously
    logEmotionSelection(userId || 'anonymous', preSessionEmotion as any);
  }
  function selectPostEmotion(emotion: any) {
    postSessionEmotion = emotion as PreSessionEmotion;
  }

  // Start session
  let showPreSessionModal = true;

  async function startSession() {
    if (!preSessionEmotion) return;

    sessionStartTime = Date.now();

    const emotionData: EmotionData = {
      preSessionEmotion: preSessionEmotion as import('./types').PreSessionEmotion,
      timestamp: sessionStartTime,
      sessionId
    };
    // Include userId where available
    const payload = { ...emotionData, userId } as any;
    // Persist session start in package storage (can be swapped to server in future)
    try {
      persistSessionStart(payload as any);
    } catch (err) {
      console.warn('Could not persist session start in package storage', err);
    }
    // Dispatch the event after persistence
    dispatch('sessionStart', payload);

    // Close modal and transition to active session
    showPreSessionModal = false;
    sessionState = 'active';

    // Set up mid-session checks
    if (enableMidSessionChecks) {
      midSessionTimer = window.setInterval(() => {
        showMidSessionPopup = true;
      }, midSessionInterval * 60 * 1000);
    }
  }

  // Log distraction during session
  function logDistraction(type: string, notes: string = '') {
    const distraction: DistractionEvent = {
      type,
      timestamp: Date.now(),
      notes,
      sessionId
    };
    
    distractions = [...distractions, distraction];
    showMidSessionPopup = false;
    
    dispatch('distractionLogged', distraction);
  }

  // End session
  function endSession() {
    if (midSessionTimer) {
      clearInterval(midSessionTimer);
    }
    sessionState = 'post-session';
  }

  // Complete session with performance ratings
  async function completeSession() {
    if (!postSessionEmotion) return;
    const sessionData: SessionData = {
      sessionId,
      preSessionEmotion: preSessionEmotion as import('./types').PreSessionEmotion,
      postSessionEmotion,
      performanceRatings,
      distractions,
      startTime: sessionStartTime!,
      endTime: Date.now(),
      duration: Date.now() - sessionStartTime!
    };
    try {
      persistSessionEnd({ ...sessionData, userId } as any);
    } catch (err) {
      console.warn('Could not persist session end', err);
    }
    dispatch('sessionEnd', sessionData);
    sessionState = 'complete';
  }

  // Update performance rating
  function updateRating(factor: any, value: number) {
    performanceRatings[factor] = value;
  }

  // Reset for new session
  export function reset() {
    sessionState = 'pre-session';
    preSessionEmotion = '';
    postSessionEmotion = '';
    performanceRatings = {};
    distractions = [];
    sessionStartTime = null;
    if (midSessionTimer) clearInterval(midSessionTimer);
    showMidSessionPopup = false;
    showPreSessionModal = true;
  }
</script>

<div class="emotion-tracker" data-theme={theme}>
  {#if sessionState === 'pre-session'}
    <Modal open={showPreSessionModal} ariaLabelledby="pre-session-heading" on:close={() => { showPreSessionModal = false; }}>
      <div class="pre-session-modal">
        <h2 id="pre-session-heading">How are you feeling before starting?</h2>
        <div class="emotion-grid" role="radiogroup" aria-labelledby="pre-session-heading">
          {#each customEmotions as emotion}
            <button
              class="emotion-btn"
              class:selected={preSessionEmotion === emotion}
              on:click={() => selectPreEmotion(emotion)}
              role="radio"
              aria-checked={preSessionEmotion === emotion}
            >
              {emotion}
            </button>
          {/each}
        </div>
        <div class="start-wrap">
          <button
            class="start-btn"
            on:click={startSession}
            disabled={!preSessionEmotion}
            aria-disabled={!preSessionEmotion}
          >
            Start Session
          </button>
        </div>
      </div>
    </Modal>
  {:else if sessionState === 'active'}
    <div class="active-session">
      <h2>Session in Progress</h2>
      <p class="emotion-display">Started feeling: <strong>{preSessionEmotion}</strong></p>
      <button class="end-btn" on:click={endSession}>
        End Session
      </button>
      
      {#if showMidSessionPopup}
        <div class="mid-session-popup">
          <h3>Quick Check-in</h3>
          <p>Are you experiencing any distractions?</p>
          <div class="distraction-options">
            <button on:click={() => logDistraction('Phone')}>Phone</button>
            <button on:click={() => logDistraction('Social Media')}>Social Media</button>
            <button on:click={() => logDistraction('Noise')}>Noise</button>
            <button on:click={() => logDistraction('None')}>No Distractions</button>
          </div>
        </div>
      {/if}
    </div>
  {:else if sessionState === 'post-session'}
    <div class="post-session">
      <h2>How did your session go?</h2>
      
      <div class="emotion-selection">
        <h3>How are you feeling now?</h3>
        <div class="emotion-grid">
          {#each customEmotions as emotion}
            <button
              class="emotion-btn"
              class:selected={postSessionEmotion === emotion}
                on:click={() => selectPostEmotion(emotion)}
            >
              {emotion}
            </button>
          {/each}
        </div>
      </div>

      <div class="performance-ratings">
        <h3>Rate your session</h3>
        {#each performanceFactors as factor}
          <div class="rating-item">
            <label>{factor}</label>
            <input
              type="range"
              min="1"
              max="10"
              value={performanceRatings[String(factor)] || 5}
              on:input={(e) => updateRating(String(factor), Number(e.currentTarget.value))}
            />
            <span>{performanceRatings[String(factor)] || 5}/10</span>
          </div>
        {/each}
      </div>

      {#if postSessionEmotion && Object.keys(performanceRatings).length === performanceFactors.length}
        <button class="complete-btn" on:click={completeSession}>
          Complete Session
        </button>
      {/if}
    </div>
  {:else if sessionState === 'complete'}
    <div class="complete">
      <h2>✓ Session Complete</h2>
      <p>Thank you for tracking your session!</p>
      <button class="reset-btn" on:click={reset}>Start New Session</button>
    </div>
  {/if}
</div>

<style>
  .emotion-tracker {
    padding: 2rem;
    border-radius: 12px;
    max-width: 600px;
    margin: 0 auto;
    font-family: system-ui, -apple-system, sans-serif;
  }

  .emotion-tracker[data-theme='light'] {
    background: #ffffff;
    color: #1a1a1a;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  .emotion-tracker[data-theme='dark'] {
    background: #2a2a2a;
    color: #ffffff;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  }

  h2 {
    margin-top: 0;
    font-size: 1.5rem;
    text-align: center;
  }

  h3 {
    font-size: 1.2rem;
    margin-bottom: 1rem;
  }

  .emotion-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
    gap: 0.75rem;
    margin: 1.5rem 0;
  }

  .emotion-btn {
    padding: 1rem;
    border: 2px solid #ddd;
    border-radius: 8px;
    background: transparent;
    cursor: pointer;
    transition: all 0.2s;
    font-size: 1rem;
  }

  .emotion-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }

  .emotion-btn.selected {
    border-color: #4a90e2;
    background: #4a90e2;
    color: white;
  }

  .start-btn, .end-btn, .complete-btn, .reset-btn {
    display: block;
    width: 100%;
    padding: 1rem;
    margin-top: 1.5rem;
    font-size: 1.1rem;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s;
  }

  .pre-session-modal .start-wrap {
    display: flex;
    justify-content: center;
  }
  .pre-session-modal .start-btn {
    width: 50%;
  }

  .start-btn, .complete-btn {
    background: #4caf50;
    color: white;
  }

  .end-btn {
    background: #ff9800;
    color: white;
  }

  .reset-btn {
    background: #2196f3;
    color: white;
  }

  .start-btn:hover, .end-btn:hover, .complete-btn:hover, .reset-btn:hover {
    opacity: 0.9;
    transform: translateY(-2px);
  }

  .emotion-display {
    text-align: center;
    font-size: 1.1rem;
    margin: 1rem 0;
  }

  .mid-session-popup {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: white;
    padding: 2rem;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    z-index: 1000;
    max-width: 400px;
  }

  .distraction-options {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-top: 1rem;
  }

  .distraction-options button {
    flex: 1;
    min-width: 100px;
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 6px;
    background: #f5f5f5;
    cursor: pointer;
  }

  .distraction-options button:hover {
    background: #e0e0e0;
  }

  .performance-ratings {
    margin: 2rem 0;
  }

  .rating-item {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1rem;
  }

  .rating-item label {
    flex: 0 0 120px;
    font-weight: 500;
  }

  .rating-item input[type='range'] {
    flex: 1;
  }

  .rating-item span {
    flex: 0 0 50px;
    text-align: right;
    font-weight: bold;
  }

  .complete {
    text-align: center;
  }

  .complete h2 {
    color: #4caf50;
    font-size: 2rem;
  }
</style>
