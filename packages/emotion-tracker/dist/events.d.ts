import type { EmotionData, SessionData, PreSessionEmotion, MidSessionCheckInEvent } from './types';
export declare function isValidPreSessionEmotion(emotion: string): emotion is PreSessionEmotion;
export declare function persistSessionStart(payload: EmotionData & {
    userId?: string;
}): any;
export declare function persistSessionEnd(payload: SessionData & {
    userId?: string;
}): any;
export declare function getSessions(userId?: string): any;
export declare function querySessionsByUser(userId: string): any;
export declare function querySessionsByTimeRange(userId: string, start: number, end: number): any;
export declare function logEmotionSelection(userId: string, emotion: PreSessionEmotion): void;
export declare function persistMidSessionCheckIn(payload: MidSessionCheckInEvent): MidSessionCheckInEvent;
export declare function getSessionCheckIns(sessionId: string): any;
