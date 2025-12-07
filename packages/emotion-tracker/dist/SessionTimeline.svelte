<script>import { createEventDispatcher, onDestroy } from "svelte";
import StartSession from "./StartSession.svelte";
import MidSessionCheckIn from "./MidSessionCheckIn.svelte";
import EndSession from "./EndSession.svelte";
export let step1Title = "How are you feeling before starting?";
export let step1Subtitle = "Let us know your current mood";
export let step1ButtonText = "Start Session";
export let step2Title = "Quick distraction check-in";
export let step2Subtitle = "Let us know what is pulling your attention";
export let step2CheckInIntervalSeconds = 60;
export let step2EnableAutoCheckIns = false;
export let step2Distractions = ["Phone", "Social media", "Noise", "People", "No distractions"];
export let step3Title = "How did your session go?";
export let step3Subtitle = "Rate your experience";
export let step3ButtonText = "Complete Session";
export let step3RatingFactors = ["Productivity", "Focus", "Understanding", "Energy"];
export let moodOptions = ["Happy", "Neutral", "Tired", "Unwell", "Down"];
export let moodEmojis = {
  "Happy": "\u{1F60A}",
  "Neutral": "\u{1F610}",
  "Tired": "\u{1F634}",
  "Unwell": "\u{1F912}",
  "Down": "\u2601\uFE0F"
};
export let distractionEmojis = {
  "Phone": "\u{1F4F1}",
  "Social media": "\u{1F4AC}",
  "Noise": "\u{1F50A}",
  "People": "\u{1F465}",
  "No distractions": "\u2705"
};
const dispatch = createEventDispatcher();
let currentStep = 1;
let startMood = null;
let selectedDistractions = [];
let allDistractions = [];
let checkInCount = 0;
let elapsedSeconds = 0;
let endMood = "";
let showCheckInPrompt = false;
let ratings = {};
$: {
  if (Object.keys(ratings).length === 0) {
    ratings = step3RatingFactors.reduce((acc, factor) => {
      acc[factor] = 0;
      return acc;
    }, {});
  }
}
let timerInterval = null;
let checkInInterval = null;
$: if (currentStep === 2 && !timerInterval) {
  timerInterval = setInterval(() => {
    elapsedSeconds += 1;
  }, 1e3);
} else if (currentStep !== 2 && timerInterval) {
  clearInterval(timerInterval);
  timerInterval = null;
}
$: if (currentStep === 2 && step2EnableAutoCheckIns && !checkInInterval) {
  checkInInterval = setInterval(() => {
    showCheckInPrompt = true;
  }, step2CheckInIntervalSeconds * 1e3);
} else if (currentStep !== 2 && checkInInterval) {
  clearInterval(checkInInterval);
  checkInInterval = null;
}
onDestroy(() => {
  if (timerInterval) clearInterval(timerInterval);
  if (checkInInterval) clearInterval(checkInInterval);
});
function formatElapsed(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}
function handleStartSession(event) {
  const { startMood: mood } = event.detail;
  if (!mood) return;
  startMood = mood;
  dispatch("sessionStart", { startMood: mood });
  currentStep = 2;
}
function handleSaveCheckIn() {
  checkInCount += 1;
  allDistractions = [.../* @__PURE__ */ new Set([...allDistractions, ...selectedDistractions])];
  dispatch("checkIn", { distractions: selectedDistractions });
  selectedDistractions = [];
  showCheckInPrompt = false;
}
function handleEndSession() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
  if (checkInInterval) {
    clearInterval(checkInInterval);
    checkInInterval = null;
  }
  dispatch("sessionEnd", {});
  currentStep = 3;
}
function handleCompleteSession(event) {
  const { mood, ratings: endRatings } = event.detail;
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
  if (checkInInterval) {
    clearInterval(checkInInterval);
    checkInInterval = null;
  }
  dispatch("sessionComplete", {
    startMood,
    distractions: allDistractions,
    checkInCount,
    endMood: mood,
    ratings: endRatings
  });
  currentStep = 1;
  startMood = null;
  selectedDistractions = [];
  allDistractions = [];
  checkInCount = 0;
  elapsedSeconds = 0;
  endMood = "";
  showCheckInPrompt = false;
  ratings = step3RatingFactors.reduce((acc, factor) => {
    acc[factor] = 0;
    return acc;
  }, {});
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
    <MidSessionCheckIn
      title={step2Title}
      subtitle={step2Subtitle}
      distractions={step2Distractions}
      {distractionEmojis}
      bind:selectedDistractions
      show={showCheckInPrompt}
      on:save={handleSaveCheckIn}
      on:close={() => (showCheckInPrompt = false)}
    />
  {/if}

  <!-- Step 3: After -->
  {#if currentStep === 3}
    <EndSession
      title={step3Title}
      subtitle={step3Subtitle}
      buttonText={step3ButtonText}
      {moodOptions}
      {moodEmojis}
      ratingFactors={step3RatingFactors}
      bind:selectedMood={endMood}
      bind:ratings
      on:sessionComplete={handleCompleteSession}
    />
  {/if}

  <!-- Bottom status bar (Steps 2-3) -->
  {#if currentStep > 1}
    <slot name="bottom-bar" {currentStep} {handleEndSession}>
      <!-- Default bottom bar -->
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
    </slot>
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
