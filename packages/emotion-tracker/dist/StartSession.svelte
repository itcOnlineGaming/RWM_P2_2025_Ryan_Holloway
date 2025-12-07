<script>import { createEventDispatcher } from "svelte";
export let title = "How are you feeling before starting?";
export let subtitle = "Let us know your current mood";
export let buttonText = "Start Session";
export let moodOptions = ["Happy", "Neutral", "Tired", "Unwell", "Down"];
export let moodEmojis = {
  "Happy": "\u{1F60A}",
  "Neutral": "\u{1F610}",
  "Tired": "\u{1F634}",
  "Unwell": "\u{1F912}",
  "Down": "\u2601\uFE0F"
};
export let selectedMood = null;
export let disabled = false;
const dispatch = createEventDispatcher();
function handleMoodSelect(mood) {
  if (disabled) return;
  selectedMood = mood;
  dispatch("moodSelect", { mood });
}
function handleStart() {
  if (!selectedMood || disabled) return;
  dispatch("start", { startMood: selectedMood });
}
</script>

<div class="start-session-card">
  <div class="card-tag">STEP 1 · BEFORE</div>
  <h2 class="card-title">{title}</h2>
  <p class="card-subtitle">{subtitle}</p>

  <div class="chips-row">
    {#each moodOptions as mood (mood)}
      {@const isSelected = selectedMood === mood}
      <button
        class="chip"
        class:chip--selected={isSelected}
        class:chip--disabled={disabled}
        on:click={() => handleMoodSelect(mood)}
        disabled={disabled}
        aria-pressed={isSelected}
        aria-label="Select mood: {mood}"
      >
        <span class="chip-icon">{moodEmojis[mood] || '😊'}</span>
        {mood}
      </button>
    {/each}
  </div>

  <button
    class="primary-btn"
    disabled={!selectedMood || disabled}
    on:click={handleStart}
  >
    {buttonText}
  </button>
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

  .start-session-card {
    background: var(--card-bg);
    border-radius: var(--radius-card);
    box-shadow: var(--shadow-card);
    padding: 18px 16px 16px;
    border: 1px solid var(--border);
    margin: 16px;
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

  .chip:hover:not(:disabled) {
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

  .chip--disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .primary-btn {
    width: 100%;
    border-radius: 999px;
    font-size: 15px;
    padding: 12px 16px;
    font-weight: 600;
    border: none;
    cursor: pointer;
    margin-top: 10px;
    transition: all 0.2s ease;
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
</style>
