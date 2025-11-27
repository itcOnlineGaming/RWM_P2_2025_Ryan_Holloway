<script lang="ts">
  import { onMount, onDestroy, createEventDispatcher } from 'svelte';
  export let open = false;
  export let ariaLabelledby = '';
  export let ariaDescribedby = '';
  export let closeOnEsc = true;
  export let closeOnBackdrop = true;
  const dispatch = createEventDispatcher();

  let previouslyFocused: Element | null = null;
  let modalEl: HTMLElement | null = null;

  function trapFocus(ev: KeyboardEvent) {
    if (ev.key !== 'Tab') return;
    const focusable = modalEl?.querySelectorAll<HTMLElement>(
      "a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex='-1'])"
    );
    if (!focusable || focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (ev.shiftKey && document.activeElement === first) {
      ev.preventDefault();
      (last as HTMLElement).focus();
    } else if (!ev.shiftKey && document.activeElement === last) {
      ev.preventDefault();
      (first as HTMLElement).focus();
    }
  }

  function onKeydown(ev: KeyboardEvent) {
    if (ev.key === 'Escape' && closeOnEsc) {
      ev.preventDefault();
      dispatch('close');
    }
    trapFocus(ev);
  }

  function backdropClick(ev: MouseEvent) {
    if (!closeOnBackdrop) return;
    if (ev.target === ev.currentTarget) {
      dispatch('close');
    }
  }

  onMount(() => {
    if (open) {
      previouslyFocused = document.activeElement as Element;
      setTimeout(() => {
        modalEl?.focus();
      }, 0);
      document.addEventListener('keydown', onKeydown);
    }
  });

  $: if (open) {
    previouslyFocused = document.activeElement as Element;
    setTimeout(() => modalEl?.focus(), 0);
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', onKeydown);
  } else {
    document.body.style.overflow = '';
    document.removeEventListener('keydown', onKeydown);
    if (previouslyFocused) (previouslyFocused as HTMLElement).focus();
  }

  onDestroy(() => {
    document.body.style.overflow = '';
    document.removeEventListener('keydown', onKeydown);
  });

  export function openModal() {
    open = true;
  }
  export function closeModal() {
    open = false;
  }
</script>

{#if open}
  <div class="modal-backdrop" role="presentation" on:click={backdropClick}>
    <div
      class="modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby={ariaLabelledby}
      aria-describedby={ariaDescribedby}
      tabindex="-1"
      bind:this={modalEl}
    >
      <slot></slot>
    </div>
  </div>
{/if}

<style>
  .modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    padding: 1rem;
  }

  .modal {
    max-width: 520px;
    width: 100%;
    background: var(--modal-bg, #fff);
    color: var(--modal-text, #111);
    border-radius: 12px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
    padding: 1.5rem;
    outline: none;
  }

  @media (max-width: 480px) {
    .modal { padding: 1rem; }
  }
</style>