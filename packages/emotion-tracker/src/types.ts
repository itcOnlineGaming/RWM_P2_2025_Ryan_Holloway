export interface EmotionData {
  emotion: string;
  timestamp: number;
  sessionId: string;
}

export interface DistractionEvent {
  type: string;
  timestamp: number;
  notes?: string;
  sessionId: string;
}

export interface SessionData {
  sessionId: string;
  preSessionEmotion: string;
  postSessionEmotion: string;
  performanceRatings: { [key: string]: number };
  distractions: DistractionEvent[];
  startTime: number;
  endTime: number;
  duration: number;
}

export interface EmotionAnalytics {
  emotionPerformanceMap: Map<
    string,
    {
      averagePerformance: number;
      sessionCount: number;
      totalDistractions: number;
    }
  >;
  totalSessions: number;
  averageSessionDuration: number;
}
