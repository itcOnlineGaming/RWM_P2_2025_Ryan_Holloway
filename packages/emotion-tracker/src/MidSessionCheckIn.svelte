<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { MidSessionCheckInProps, CheckInEvent } from './types';

  // Props for customization
  export let title: string = 'Quick distraction check-in';
  export let subtitle: string = 'Let us know what is pulling your attention';
  export let buttonText: string = 'Save check-in';
  export let distractions: string[] = ['Phone', 'Social media', 'Noise', 'People', 'No distractions'];
  export let distractionEmojis: Record<string, string> = {
    'Phone': '📱',
    'Social media': '💬',
    'Noise': '🔊',
    'People': '👥',
    'No distractions': '✅'
  };
  export let selectedDistractions: string[] = [];
  export let show: boolean = false;
  export let disabled: boolean = false;

  // Event dispatcher
  const dispatch = createEventDispatcher<{
    save: CheckInEvent;
    close: void;
  }>();

  // Handle distraction toggle
  function toggleDistraction(distraction: string) {
    if (disabled) return;

    if (distraction === 'No distractions') {
      if (selectedDistractions.includes('No distractions')) {
        selectedDistractions = selectedDistractions.filter(d => d !== 'No distractions');
      } else {
        selectedDistractions = ['No distractions'];
      }
    } else {
      // Remove "No distractions" if selecting anything else
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

  // Handle save check-in
  function handleSave() {
    if (disabled || selectedDistractions.length === 0) return;
    dispatch('save', { distractions: selectedDistractions });
  }

  // Handle close
  function handleClose() {
    if (disabled) return;
    dispatch('close');
  }

  // Handle overlay click
  function handleOverlayClick(e: MouseEvent) {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  }

  // Handle escape key
  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      handleClose();
    }
  }
</script>

<svelte:window on:keydown={handleKeydown} />

{#if show}
  <div 
    class="checkin-overlay" 
    on:click={handleOverlayClick}
    role="dialog"
    aria-modal="true"
    aria-labelledby="checkin-title"
  >
    <div class="checkin-modal">
      <button
        class="close-btn"
        on:click={handleClose}
        aria-label="Close check-in"
        disabled={disabled}
      >
        ×
      </button>

      <h3 id="checkin-title">{title}</h3>
      <p class="checkin-subtitle">{subtitle}</p>

      <div class="chips-row" role="group" aria-label="Select distractions">
        {#each distractions as distraction (distraction)}
          {@const isSelected = selectedDistractions.includes(distraction)}
          <button
            class="chip"
            class:chip--selected={isSelected}
            on:click={() => toggleDistraction(distraction)}
            disabled={disabled}
            role="checkbox"
            aria-checked={isSelected}
          >
            <span class="chip-icon">{distractionEmojis[distraction] || '📱'}</span>
            {distraction}
          </button>
        {/each}
      </div>

      <button 
        class="primary-btn" 
        on:click={handleSave}
        disabled={disabled || selectedDistractions.length === 0}
        aria-disabled={disabled || selectedDistractions.length === 0}
      >
        {buttonText}
      </button>
    </div>
  </div>
{/if}

<style>
  .checkin-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    backdrop-filter: blur(4px);
  }

  .checkin-modal {
    background: white;
    border-radius: 16px;
    padding: 2rem;
    max-width: 500px;
    width: 90%;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    position: relative;
    animation: slideIn 0.3s ease-out;
  }

  @keyframes slideIn {
    from {
      transform: translateY(-20px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  .close-btn {
    position: absolute;
    top: 1rem;
    right: 1rem;
    background: none;
    border: none;
    font-size: 2rem;
    cursor: pointer;
    color: #666;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    transition: all 0.2s;
  }

  .close-btn:hover:not(:disabled) {
    background: #f0f0f0;
    color: #333;
  }

  .close-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  h3 {
    margin: 0 0 0.5rem 0;
    font-size: 1.5rem;
    color: #333;
  }

  .checkin-subtitle {
    margin: 0 0 1.5rem 0;
    color: #666;
    font-size: 0.95rem;
  }

  .chips-row {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
    margin-bottom: 1.5rem;
  }

  .chip {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.625rem 1rem;
    background: #f5f5f5;
    border: 2px solid #e0e0e0;
    border-radius: 24px;
    cursor: pointer;
    font-size: 0.95rem;
    font-weight: 500;
    color: #333;
    transition: all 0.2s;
  }

  .chip:hover:not(:disabled) {
    background: #ebebeb;
    border-color: #d0d0d0;
    transform: translateY(-1px);
  }

  .chip--selected {
    background: #e3f2fd;
    border-color: #2196f3;
    color: #1976d2;
  }

  .chip:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .chip-icon {
    font-size: 1.2rem;
  }

  .primary-btn {
    width: 100%;
    padding: 0.875rem 1.5rem;
    background: #2196f3;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
  }

  .primary-btn:hover:not(:disabled) {
    background: #1976d2;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(33, 150, 243, 0.3);
  }

  .primary-btn:disabled {
    background: #ccc;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
</style>
