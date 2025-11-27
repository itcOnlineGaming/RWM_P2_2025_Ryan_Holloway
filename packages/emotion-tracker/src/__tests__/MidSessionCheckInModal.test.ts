import { render, fireEvent } from '@testing-library/svelte';
import { describe, it, expect, beforeEach } from 'vitest';
import MidSessionCheckInModal from '../MidSessionCheckInModal.svelte';
import { persistMidSessionCheckIn, getSessionCheckIns } from '../events';

const sessionId = 'test-session';
const userId = 'test-user';

describe('MidSessionCheckInModal', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('allows multiple distraction types to be selected', async () => {
    const { getByText, component } = render(MidSessionCheckInModal, { open: true, sessionId, userId, testMode: true });
    let checkInData: any = null;
    component.$on('checkIn', (e: any) => { checkInData = e.detail; });
    await fireEvent.click(getByText('Phone'));
    await fireEvent.click(getByText('Social Media'));
    expect(checkInData.distractions).toEqual(expect.arrayContaining(['Phone', 'Social Media']));
  });

  it('selecting "No Distractions" clears other selections', async () => {
    const { getByText, component } = render(MidSessionCheckInModal, { open: true, sessionId, userId, testMode: true });
    let checkInData: any = null;
    component.$on('checkIn', (e: any) => { checkInData = e.detail; });
    await fireEvent.click(getByText('Phone'));
    await fireEvent.click(getByText('No Distractions'));
    expect(checkInData.distractions).toEqual(['none']);
  });

  it('selecting any distraction clears "No Distractions"', async () => {
    const { getByText, component } = render(MidSessionCheckInModal, { open: true, sessionId, userId, testMode: true });
    let checkInData: any = null;
    component.$on('checkIn', (e: any) => { checkInData = e.detail; });
    await fireEvent.click(getByText('No Distractions'));
    await fireEvent.click(getByText('Noise'));
    expect(checkInData.distractions).toEqual(['Noise']);
  });

  it('selected distraction options use selected styling', async () => {
    const { getByText } = render(MidSessionCheckInModal, { open: true, sessionId, userId, testMode: true });
    const phoneBtn = getByText('Phone');
    await fireEvent.click(phoneBtn);
    expect(phoneBtn.classList.contains('selected')).toBe(true);
  });

  it('logs correct data structure to persistMidSessionCheckIn', () => {
    const event = { sessionId, userId, timestamp: Date.now(), distractions: ['Phone', 'Noise'] };
    const result = persistMidSessionCheckIn(event);
    expect(result.distractions).toEqual(['Phone', 'Noise']);
    const stored = getSessionCheckIns(sessionId);
    expect(stored[0].distractions).toEqual(['Phone', 'Noise']);
  });

  it('logs "none" for no distractions', () => {
    const event = { sessionId, userId, timestamp: Date.now(), distractions: ['none'] };
    const result = persistMidSessionCheckIn(event);
    expect(result.distractions).toEqual(['none']);
    const stored = getSessionCheckIns(sessionId);
    expect(stored[0].distractions).toEqual(['none']);
  });
});
