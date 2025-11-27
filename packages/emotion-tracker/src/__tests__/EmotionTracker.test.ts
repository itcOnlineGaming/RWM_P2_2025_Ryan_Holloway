import { render, fireEvent } from '@testing-library/svelte';
import '@testing-library/jest-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import EmotionTracker from '../EmotionTracker.svelte';

describe('EmotionTracker pre-session modal', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders pre-session modal and starts disabled Start Session button until selection', async () => {
    const { getByText } = render(EmotionTracker, { sessionId: 's1', userId: 'u1' });

    const startBtn = getByText('Start Session');
    expect(startBtn).toBeDisabled();

    const happyBtn = getByText('Happy');
    await fireEvent.click(happyBtn);

    expect(startBtn).not.toBeDisabled();
    const analyticsKey = `emotion_tracker_analytics_u1`;
    const analytics = JSON.parse(localStorage.getItem(analyticsKey) || '{}');
    expect(analytics.Happy).toBe(1);
  });

  it('dispatches sessionStart event with selected emotion and userId', async () => {
    const onStart = vi.fn();
    const { getByText, component } = render(EmotionTracker, { sessionId: 's1', userId: 'u1' });
    component.$on('sessionStart', (e: any) => onStart(e.detail));

    const happyBtn = getByText('Happy');
    await fireEvent.click(happyBtn);

    const startBtn = getByText('Start Session');
    await fireEvent.click(startBtn);

    expect(onStart).toHaveBeenCalledTimes(1);
    const detail = onStart.mock.calls[0][0];
    expect(detail.preSessionEmotion).toBe('Happy');
    expect(detail.userId).toBe('u1');
    expect(detail.sessionId).toBeTruthy();
    // Verify that localStorage persisted the session via the package storage
    const key = `emotion_tracker_sessions_u1`;
    const stored = JSON.parse(localStorage.getItem(key) || '[]');
    expect(stored.length).toBeGreaterThanOrEqual(1);
    expect(stored[0].preSessionEmotion).toBe('Happy');
  });

  it('closes pre-session modal on ESC without dispatching sessionStart', async () => {
    const onStart = vi.fn();
    const { getByText, container, component } = render(EmotionTracker, { sessionId: 's3', userId: 'u1' });
    component.$on('sessionStart', (e: any) => onStart(e.detail));
    // Press ESC globally
    await fireEvent.keyDown(document, { key: 'Escape' });
    // Modal should no longer be in DOM
    expect(container.querySelector('.modal')).toBeNull();
    expect(onStart).toHaveBeenCalledTimes(0);
  });

  it('ensures only one emotion can be selected at a time', async () => {
    const { getByText } = render(EmotionTracker, { sessionId: 's2', userId: 'u1' });
    const happyBtn = getByText('Happy');
    const tiredBtn = getByText('Tired');
    await fireEvent.click(happyBtn);
    expect(happyBtn).toHaveClass('selected');
    await fireEvent.click(tiredBtn);
    expect(happyBtn).not.toHaveClass('selected');
    expect(tiredBtn).toHaveClass('selected');
  });
});
