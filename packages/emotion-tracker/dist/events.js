const SESSION_STORAGE_PREFIX = 'emotion_tracker_sessions_';
const CHECKIN_STORAGE_PREFIX = 'emotion_tracker_checkins_';
const VALID_DISTRACTIONS = ['Phone', 'Social Media', 'Noise', 'none'];
export function isValidPreSessionEmotion(emotion) {
    return ['Happy', 'Neutral', 'Tired', 'Unwell', 'Down'].includes(emotion);
}
export function persistSessionStart(payload) {
    if (!isValidPreSessionEmotion(payload.preSessionEmotion)) {
        throw new Error('Invalid preSessionEmotion');
    }
    // Create a lightweight session entry with start timestamp
    const sessionRecord = {
        sessionId: payload.sessionId,
        preSessionEmotion: payload.preSessionEmotion,
        sessionStartTimestamp: payload.timestamp,
        startTime: payload.timestamp,
        userId: payload.userId || 'anonymous'
    };
    // Store under user's localStorage key
    const key = SESSION_STORAGE_PREFIX + sessionRecord.userId;
    const stored = localStorage.getItem(key);
    const arr = stored ? JSON.parse(stored) : [];
    arr.push(sessionRecord);
    localStorage.setItem(key, JSON.stringify(arr));
    // Console log for analytics
    console.log('[EmotionTracker] sessionStart persisted', sessionRecord);
    return sessionRecord;
}
export function persistSessionEnd(payload) {
    if (!isValidPreSessionEmotion(payload.preSessionEmotion)) {
        throw new Error('Invalid preSessionEmotion');
    }
    const key = SESSION_STORAGE_PREFIX + (payload.userId || 'anonymous');
    const stored = localStorage.getItem(key);
    const arr = stored ? JSON.parse(stored) : [];
    // Find session start by sessionId and update it
    const idx = arr.findIndex((s) => s.sessionId === payload.sessionId);
    const sessionRecord = {
        sessionId: payload.sessionId,
        preSessionEmotion: payload.preSessionEmotion,
        postSessionEmotion: payload.postSessionEmotion,
        performanceRatings: payload.performanceRatings,
        distractions: payload.distractions,
        startTime: payload.startTime,
        endTime: payload.endTime,
        duration: payload.duration,
        userId: payload.userId || 'anonymous'
    };
    if (idx >= 0) {
        arr[idx] = sessionRecord;
    }
    else {
        arr.push(sessionRecord);
    }
    localStorage.setItem(key, JSON.stringify(arr));
    console.log('[EmotionTracker] sessionEnd persisted', sessionRecord);
    return sessionRecord;
}
export function getSessions(userId) {
    const key = SESSION_STORAGE_PREFIX + (userId || 'anonymous');
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : [];
}
export function querySessionsByUser(userId) {
    // Retrieve sessions for a user ordered by start timestamp desc
    const sessions = getSessions(userId);
    return sessions.sort((a, b) => b.sessionStartTimestamp - a.sessionStartTimestamp);
}
export function querySessionsByTimeRange(userId, start, end) {
    const sessions = getSessions(userId);
    return sessions.filter((s) => s.sessionStartTimestamp >= start && s.sessionStartTimestamp <= end);
}
// Simple analytics counter for emotion selections over time
const ANALYTICS_PREFIX = 'emotion_tracker_analytics_';
export function logEmotionSelection(userId, emotion) {
    const key = ANALYTICS_PREFIX + (userId || 'anonymous');
    const stored = localStorage.getItem(key);
    const counters = stored ? JSON.parse(stored) : {};
    counters[emotion] = (counters[emotion] || 0) + 1;
    localStorage.setItem(key, JSON.stringify(counters));
}
export function persistMidSessionCheckIn(payload) {
    // Validate distractions
    if (!Array.isArray(payload.distractions) || payload.distractions.length === 0) {
        throw new Error('Distractions must be a non-empty array');
    }
    for (const d of payload.distractions) {
        if (!VALID_DISTRACTIONS.includes(d)) {
            throw new Error('Invalid distraction value: ' + d);
        }
    }
    // Store check-in event
    const key = CHECKIN_STORAGE_PREFIX + (payload.sessionId);
    const stored = localStorage.getItem(key);
    const arr = stored ? JSON.parse(stored) : [];
    arr.push({ ...payload });
    localStorage.setItem(key, JSON.stringify(arr));
    // Analytics log
    console.log('[EmotionTracker] midSessionCheckIn persisted', payload);
    return payload;
}
export function getSessionCheckIns(sessionId) {
    const key = CHECKIN_STORAGE_PREFIX + sessionId;
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : [];
}
