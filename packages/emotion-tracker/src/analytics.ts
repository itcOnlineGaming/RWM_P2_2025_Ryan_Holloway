import type { SessionData, EmotionAnalytics } from "./types";

/**
 * Calculate analytics from session data
 */
export function calculateAnalytics(sessions: SessionData[]): EmotionAnalytics {
  const emotionPerformanceMap = new Map();
  let totalDuration = 0;

  sessions.forEach((session) => {
    const emotion = session.preSessionEmotion;

    // Calculate average performance for this session
    const performanceValues = Object.values(session.performanceRatings);
    const avgPerformance =
      performanceValues.reduce((a, b) => a + b, 0) / performanceValues.length;

    // Update emotion stats
    if (!emotionPerformanceMap.has(emotion)) {
      emotionPerformanceMap.set(emotion, {
        averagePerformance: 0,
        sessionCount: 0,
        totalDistractions: 0,
      });
    }

    const stats = emotionPerformanceMap.get(emotion);
    const newCount = stats.sessionCount + 1;
    stats.averagePerformance =
      (stats.averagePerformance * stats.sessionCount + avgPerformance) /
      newCount;
    stats.sessionCount = newCount;
    stats.totalDistractions += session.distractions.length;

    totalDuration += session.duration;
  });

  return {
    emotionPerformanceMap,
    totalSessions: sessions.length,
    averageSessionDuration:
      sessions.length > 0 ? totalDuration / sessions.length : 0,
  };
}

/**
 * Get performance comparison message
 */
export function getPerformanceInsight(
  emotion: string,
  analytics: EmotionAnalytics
): string {
  const stats = analytics.emotionPerformanceMap.get(emotion);
  if (!stats || stats.sessionCount < 2) {
    return "";
  }

  // Calculate overall average
  let totalPerf = 0;
  let totalCount = 0;
  analytics.emotionPerformanceMap.forEach((stat) => {
    totalPerf += stat.averagePerformance * stat.sessionCount;
    totalCount += stat.sessionCount;
  });
  const overallAvg = totalPerf / totalCount;

  const diff = ((stats.averagePerformance - overallAvg) / overallAvg) * 100;

  if (Math.abs(diff) < 5) {
    return `When feeling ${emotion}, your performance is about average.`;
  }

  if (diff > 0) {
    return `When feeling ${emotion}, you perform ${Math.round(
      diff
    )}% better than average.`;
  } else {
    return `When feeling ${emotion}, you perform ${Math.round(
      Math.abs(diff)
    )}% worse than average.`;
  }
}

/**
 * Format duration in a readable way
 */
export function formatDuration(milliseconds: number): string {
  const minutes = Math.floor(milliseconds / 60000);
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (hours > 0) {
    return `${hours}h ${remainingMinutes}m`;
  }
  return `${minutes}m`;
}
