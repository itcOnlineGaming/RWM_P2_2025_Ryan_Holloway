import { render, fireEvent } from '@testing-library/svelte';
import { describe, it, expect } from 'vitest';
import Modal from '../Modal.svelte';

describe('Modal accessibility', () => {
  it('closes on Escape via close event', async () => {
    const { container, component } = render(Modal, { open: true, ariaLabelledby: 'title' });
    const onClose = (e: any) => {};
    const spy = vi.fn();
    component.$on('close', spy);
    await fireEvent.keyDown(document, { key: 'Escape' });
    expect(spy).toHaveBeenCalled();
  });
});
