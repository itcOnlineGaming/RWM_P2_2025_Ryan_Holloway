import { describe, it, expect, beforeEach } from 'vitest';
import { persistSessionStart, getSessions } from '../events';

describe('events storage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('persists session start and makes it retrievable via getSessions', () => {
    const data = persistSessionStart({ preSessionEmotion: 'Happy', timestamp: 123, sessionId: 's1', userId: 'u1' });
    expect(data.sessionId).toBe('s1');
    const sessions = getSessions('u1');
    expect(sessions.length).toBe(1);
    expect(sessions[0].preSessionEmotion).toBe('Happy');
  });

  it('throws for invalid preSessionEmotion', () => {
    expect(() => persistSessionStart({ preSessionEmotion: 'Joy' as any, timestamp: 123, sessionId: 's2', userId: 'u1' })).toThrow();
  });
});
