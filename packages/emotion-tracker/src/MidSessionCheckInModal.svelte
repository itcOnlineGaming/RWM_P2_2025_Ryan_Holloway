<script lang="ts">
  import Modal from './Modal.svelte';
  import { createEventDispatcher } from 'svelte';
  import type { MidSessionCheckInEvent } from './types';

  export let open = false;
  export let sessionId: string = '';
  export let userId: string = '';
  export let testMode: boolean = false; // disables auto-close for tests

  const distractionOptions = [
    'Phone',
    'Social Media',
    'Noise'
  ];

  let selectedDistractions: string[] = [];
  let noDistractions = false;

  // Dispatches 'checkIn' event with MidSessionCheckInEvent payload
  const dispatch = createEventDispatcher();

  function selectDistraction(option: string) {
    if (noDistractions) noDistractions = false;
    if (selectedDistractions.includes(option)) {
      selectedDistractions = selectedDistractions.filter(d => d !== option);
    } else {
      selectedDistractions = [...selectedDistractions, option];
    }
    // Deselect 'No Distractions' if any distraction is selected
    if (selectedDistractions.length > 0) noDistractions = false;
    logAndMaybeClose();
  }

  function selectNoDistractions() {
    selectedDistractions = [];
    noDistractions = true;
    logAndMaybeClose();
  }

  function logAndMaybeClose() {
    const distractions = noDistractions ? ['none'] : selectedDistractions;
    const event: MidSessionCheckInEvent = {
      sessionId,
      userId,
      timestamp: Date.now(),
      distractions
    };
    dispatch('checkIn', event);
    if (!testMode) open = false;
  }
</script>

<Modal {open} ariaLabelledby="checkin-title" ariaDescribedby="checkin-desc" closeOnEsc={false} closeOnBackdrop={false}>
  <div class="checkin-modal" role="group" aria-labelledby="checkin-title" aria-describedby="checkin-desc">
    <h2 id="checkin-title">Quick Check-in</h2>
    <p id="checkin-desc">Are you experiencing distractions?</p>
    <div class="distraction-options">
      {#each distractionOptions as option}
        <button
          type="button"
          class:selected={selectedDistractions.includes(option)}
          aria-pressed={selectedDistractions.includes(option)}
          on:click={() => selectDistraction(option)}
        >{option}</button>
      {/each}
      <button
        type="button"
        class:no-distractions={noDistractions}
        aria-pressed={noDistractions}
        on:click={selectNoDistractions}
      >No Distractions</button>
    </div>
  </div>
</Modal>

<style>
.checkin-modal {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
}
.distraction-options {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  justify-content: center;
}
.distraction-options button {
  min-width: 120px;
  padding: 0.75rem 1.25rem;
  border-radius: 8px;
  border: none;
  background: #eee;
  color: #222;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s;
}
.distraction-options button.selected,
.distraction-options button.no-distractions {
  background: #333;
  color: #fff;
}
.distraction-options button:focus {
  outline: 2px solid #0078d4;
}
@media (max-width: 480px) {
  .checkin-modal { gap: 0.5rem; }
  .distraction-options button { min-width: 90px; font-size: 0.95rem; }
}
</style>
