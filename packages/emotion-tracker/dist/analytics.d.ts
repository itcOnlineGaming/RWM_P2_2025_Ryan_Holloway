import type { SessionData, EmotionAnalytics } from "./types";
/**
 * Calculate analytics from session data
 */
export declare function calculateAnalytics(sessions: SessionData[]): EmotionAnalytics;
/**
 * Get performance comparison message
 */
export declare function getPerformanceInsight(emotion: string, analytics: EmotionAnalytics): string;
/**
 * Format duration in a readable way
 */
export declare function formatDuration(milliseconds: number): string;
