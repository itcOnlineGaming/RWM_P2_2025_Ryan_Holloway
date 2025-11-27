export type PreSessionEmotion = 'Happy' | 'Neutral' | 'Tired' | 'Unwell' | 'Down';

export interface EmotionData {
  preSessionEmotion: PreSessionEmotion;
  timestamp: number;
  sessionId: string;
  userId?: string;
}

export interface DistractionEvent {
  type: string;
  timestamp: number;
  notes?: string;
  sessionId: string;
}

export interface SessionData {
  sessionId: string;
  preSessionEmotion: PreSessionEmotion;
  postSessionEmotion: string;
  performanceRatings: { [key: string]: number };
  distractions: DistractionEvent[];
  startTime: number;
  endTime: number;
  duration: number;
  userId?: string;
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

export interface MidSessionCheckInEvent {
  sessionId: string;
  userId?: string;
  timestamp: number;
  distractions: string[]; // ['Phone', 'Social Media', 'Noise'] or ['none']
}
