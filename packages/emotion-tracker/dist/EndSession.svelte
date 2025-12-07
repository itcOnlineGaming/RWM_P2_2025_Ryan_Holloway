<svelte:options accessors/>

<script>import { createEventDispatcher } from "svelte";
export let title = "How did your session go?";
export let subtitle = "Rate your experience";
export let buttonText = "Complete Session";
export let moodOptions = ["Happy", "Neutral", "Tired", "Unwell", "Down"];
export let moodEmojis = {
  "Happy": "\u{1F60A}",
  "Neutral": "\u{1F610}",
  "Tired": "\u{1F634}",
  "Unwell": "\u{1F912}",
  "Down": "\u2601\uFE0F"
};
export let ratingFactors = ["Productivity", "Focus", "Understanding", "Energy"];
export let disabled = false;
export let selectedMood = "";
export let ratings = {};
$: if (Object.keys(ratings).length === 0 && ratingFactors && ratingFactors.length > 0) {
  ratings = ratingFactors.reduce((acc, factor) => {
    acc[factor] = 0;
    return acc;
  }, {});
}
const dispatch = createEventDispatcher();
function setRating(factor, value) {
  if (disabled) return;
  ratings[factor] = value;
  ratings = ratings;
}
function handleComplete() {
  if (disabled) return;
  if (!selectedMood || !Object.values(ratings).every((r) => r > 0)) return;
  dispatch("sessionComplete", {
    mood: selectedMood,
    ratings: { ...ratings }
  });
}
$: isValid = selectedMood && Object.values(ratings).every((r) => r > 0);
</script>

<div class="end-session-container">
  <div class="card-tag">STEP 3 · AFTER</div>
  <h2 class="card-title">{title}</h2>
  <p class="card-subtitle">{subtitle}</p>

  <div class="chips-row">
    {#each (moodOptions || []) as mood (mood)}
      {@const isSelected = selectedMood === mood}
      <button
        class="chip"
        class:chip--selected={isSelected}
        class:chip--disabled={disabled}
        on:click={() => !disabled && (selectedMood = mood)}
        disabled={disabled}
        aria-pressed={isSelected}
      >
        <span class="chip-icon">{moodEmojis?.[mood] || '😊'}</span>
        {mood}
      </button>
    {/each}
  </div>

  <div class="ratings-section">
    {#each (ratingFactors || []) as factor (factor)}
      <div class="rating-row">
        <span class="rating-label">{factor}</span>
        <span class="rating-value">{ratings[factor] || 0}/10</span>
      </div>
      <div class="rating-dots">
        {#each Array(10) as _, i (i)}
          <button
            class="dot"
            class:dot--filled={i < (ratings[factor] || 0)}
            class:dot--disabled={disabled}
            on:click={() => setRating(factor, i + 1)}
            disabled={disabled}
            aria-label="Rate {factor} as {i + 1}"
          />
        {/each}
      </div>
    {/each}
  </div>

  <button
    class="primary-btn"
    disabled={!isValid || disabled}
    on:click={handleComplete}
  >
    {buttonText}
  </button>
</div>

<style>
  * {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
  }

  .end-session-container {
    background: #ffffff;
    border-radius: 18px;
    box-shadow: 0 16px 40px rgba(15, 23, 42, 0.08);
    padding: 18px 16px 16px;
    border: 1px solid #e2e5f0;
  }

  .card-tag {
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: #2563eb;
    font-weight: 600;
    margin-bottom: 6px;
  }

  .card-title {
    font-size: 18px;
    font-weight: 700;
    color: #111827;
    margin: 0 0 4px 0;
  }

  .card-subtitle {
    font-size: 14px;
    color: #6b7280;
    margin: 0 0 16px 0;
  }

  .chips-row {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 20px;
  }

  .chip {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px 14px;
    border-radius: 999px;
    background: #f3f4f6;
    border: 1.5px solid transparent;
    color: #374151;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.15s ease;
    white-space: nowrap;
  }

  .chip:hover:not(.chip--disabled) {
    background: #e5e7eb;
    transform: translateY(-1px);
  }

  .chip--selected {
    background: #2563eb;
    border-color: #2563eb;
    color: #ffffff;
  }

  .chip--disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .chip-icon {
    font-size: 16px;
  }

  .ratings-section {
    margin-bottom: 20px;
  }

  .rating-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
  }

  .rating-label {
    font-size: 14px;
    font-weight: 500;
    color: #374151;
  }

  .rating-value {
    font-size: 13px;
    font-weight: 600;
    color: #2563eb;
  }

  .rating-dots {
    display: flex;
    gap: 8px;
    margin-bottom: 16px;
  }

  .dot {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: #e5e7eb;
    border: 1.5px solid #d1d5db;
    cursor: pointer;
    transition: all 0.15s ease;
    padding: 0;
  }

  .dot:hover:not(.dot--disabled) {
    background: #d1d5db;
    transform: scale(1.1);
  }

  .dot--filled {
    background: #2563eb;
    border-color: #2563eb;
  }

  .dot--disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .primary-btn {
    width: 100%;
    padding: 14px;
    border-radius: 12px;
    background: #2563eb;
    color: #ffffff;
    font-size: 15px;
    font-weight: 600;
    border: none;
    cursor: pointer;
    transition: all 0.15s ease;
  }

  .primary-btn:hover:not(:disabled) {
    background: #1d4ed8;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
  }

  .primary-btn:disabled {
    background: #e5e7eb;
    color: #9ca3af;
    cursor: not-allowed;
  }
</style>
