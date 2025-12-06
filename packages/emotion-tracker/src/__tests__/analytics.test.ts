import { describe, it, expect } from "vitest";
import {
  calculateAnalytics,
  getPerformanceInsight,
  formatDuration,
} from "../analytics";
import type { SessionData } from "../types";

describe("analytics", () => {
  describe("calculateAnalytics", () => {
    it("returns empty analytics for no sessions", () => {
      const result = calculateAnalytics([]);
      expect(result.totalSessions).toBe(0);
      expect(result.emotionPerformanceMap.size).toBe(0);
      expect(result.averageSessionDuration).toBe(0);
    });

    it("calculates single session analytics", () => {
      const session: SessionData = {
        sessionId: "s1",
        preSessionEmotion: "Happy",
        postSessionEmotion: "Happy",
        performanceRatings: { Focus: 8, Enjoyment: 9 },
        distractions: [],
        startTime: 1000,
        endTime: 2000,
        duration: 1000,
      };

      const result = calculateAnalytics([session]);
      expect(result.totalSessions).toBe(1);
      expect(result.emotionPerformanceMap.has("Happy")).toBe(true);
      const happyStats = result.emotionPerformanceMap.get("Happy");
      expect(happyStats?.sessionCount).toBe(1);
      expect(happyStats?.averagePerformance).toBe(8.5); // (8 + 9) / 2
      expect(result.averageSessionDuration).toBe(1000);
    });

    it("calculates multiple sessions with same emotion", () => {
      const sessions: SessionData[] = [
        {
          sessionId: "s1",
          preSessionEmotion: "Happy",
          postSessionEmotion: "Happy",
          performanceRatings: { Focus: 10, Enjoyment: 10 },
          distractions: [],
          startTime: 1000,
          endTime: 2000,
          duration: 1000,
        },
        {
          sessionId: "s2",
          preSessionEmotion: "Happy",
          postSessionEmotion: "Happy",
          performanceRatings: { Focus: 6, Enjoyment: 6 },
          distractions: [],
          startTime: 3000,
          endTime: 5000,
          duration: 2000,
        },
      ];

      const result = calculateAnalytics(sessions);
      expect(result.totalSessions).toBe(2);
      const happyStats = result.emotionPerformanceMap.get("Happy");
      expect(happyStats?.sessionCount).toBe(2);
      expect(happyStats?.averagePerformance).toBe(8); // (10 + 6) / 2
      expect(result.averageSessionDuration).toBe(1500); // (1000 + 2000) / 2
    });

    it("calculates multiple emotions with distractions", () => {
      const sessions: SessionData[] = [
        {
          sessionId: "s1",
          preSessionEmotion: "Happy",
          postSessionEmotion: "Happy",
          performanceRatings: { Focus: 9 },
          distractions: [
            { type: "Phone", timestamp: 1500, sessionId: "s1" },
            { type: "Email", timestamp: 1600, sessionId: "s1" },
          ],
          startTime: 1000,
          endTime: 2000,
          duration: 1000,
        },
        {
          sessionId: "s2",
          preSessionEmotion: "Tired",
          postSessionEmotion: "Neutral",
          performanceRatings: { Focus: 5 },
          distractions: [{ type: "Noise", timestamp: 3500, sessionId: "s2" }],
          startTime: 3000,
          endTime: 5000,
          duration: 2000,
        },
      ];

      const result = calculateAnalytics(sessions);
      expect(result.totalSessions).toBe(2);
      expect(result.emotionPerformanceMap.size).toBe(2);

      const happyStats = result.emotionPerformanceMap.get("Happy");
      expect(happyStats?.totalDistractions).toBe(2);

      const tiredStats = result.emotionPerformanceMap.get("Tired");
      expect(tiredStats?.totalDistractions).toBe(1);
    });
  });

  describe("getPerformanceInsight", () => {
    it("returns empty string for emotion with less than 2 sessions", () => {
      const session: SessionData = {
        sessionId: "s1",
        preSessionEmotion: "Happy",
        postSessionEmotion: "Happy",
        performanceRatings: { Focus: 8 },
        distractions: [],
        startTime: 1000,
        endTime: 2000,
        duration: 1000,
      };

      const analytics = calculateAnalytics([session]);
      const insight = getPerformanceInsight("Happy", analytics);
      expect(insight).toBe("");
    });

    it("identifies above average performance", () => {
      const sessions: SessionData[] = [
        {
          sessionId: "s1",
          preSessionEmotion: "Happy",
          postSessionEmotion: "Happy",
          performanceRatings: { Focus: 9 },
          distractions: [],
          startTime: 1000,
          endTime: 2000,
          duration: 1000,
        },
        {
          sessionId: "s2",
          preSessionEmotion: "Happy",
          postSessionEmotion: "Happy",
          performanceRatings: { Focus: 10 },
          distractions: [],
          startTime: 3000,
          endTime: 4000,
          duration: 1000,
        },
        {
          sessionId: "s3",
          preSessionEmotion: "Tired",
          postSessionEmotion: "Tired",
          performanceRatings: { Focus: 4 },
          distractions: [],
          startTime: 5000,
          endTime: 6000,
          duration: 1000,
        },
      ];

      const analytics = calculateAnalytics(sessions);
      const insight = getPerformanceInsight("Happy", analytics);
      expect(insight).toContain("Happy");
      expect(insight).toContain("better than average");
    });

    it("identifies below average performance", () => {
      const sessions: SessionData[] = [
        {
          sessionId: "s1",
          preSessionEmotion: "Tired",
          postSessionEmotion: "Tired",
          performanceRatings: { Focus: 3 },
          distractions: [],
          startTime: 1000,
          endTime: 2000,
          duration: 1000,
        },
        {
          sessionId: "s2",
          preSessionEmotion: "Tired",
          postSessionEmotion: "Tired",
          performanceRatings: { Focus: 2 },
          distractions: [],
          startTime: 3000,
          endTime: 4000,
          duration: 1000,
        },
        {
          sessionId: "s3",
          preSessionEmotion: "Happy",
          postSessionEmotion: "Happy",
          performanceRatings: { Focus: 9 },
          distractions: [],
          startTime: 5000,
          endTime: 6000,
          duration: 1000,
        },
      ];

      const analytics = calculateAnalytics(sessions);
      const insight = getPerformanceInsight("Tired", analytics);
      expect(insight).toContain("Tired");
      expect(insight).toContain("worse than average");
    });

    it("identifies average performance (within 5%)", () => {
      const sessions: SessionData[] = [
        {
          sessionId: "s1",
          preSessionEmotion: "Neutral",
          postSessionEmotion: "Neutral",
          performanceRatings: { Focus: 5 },
          distractions: [],
          startTime: 1000,
          endTime: 2000,
          duration: 1000,
        },
        {
          sessionId: "s2",
          preSessionEmotion: "Neutral",
          postSessionEmotion: "Neutral",
          performanceRatings: { Focus: 5 },
          distractions: [],
          startTime: 3000,
          endTime: 4000,
          duration: 1000,
        },
        {
          sessionId: "s3",
          preSessionEmotion: "Happy",
          postSessionEmotion: "Happy",
          performanceRatings: { Focus: 5 },
          distractions: [],
          startTime: 5000,
          endTime: 6000,
          duration: 1000,
        },
      ];

      const analytics = calculateAnalytics(sessions);
      const insight = getPerformanceInsight("Neutral", analytics);
      expect(insight).toContain("about average");
    });
  });

  describe("formatDuration", () => {
    it("formats milliseconds to minutes", () => {
      expect(formatDuration(60000)).toBe("1m");
      expect(formatDuration(120000)).toBe("2m");
      expect(formatDuration(300000)).toBe("5m");
    });

    it("formats milliseconds to hours and minutes", () => {
      expect(formatDuration(3600000)).toBe("1h 0m");
      expect(formatDuration(5400000)).toBe("1h 30m");
      expect(formatDuration(7200000)).toBe("2h 0m");
    });

    it("handles edge cases", () => {
      expect(formatDuration(0)).toBe("0m");
      expect(formatDuration(30000)).toBe("0m");
      expect(formatDuration(59999)).toBe("0m");
      expect(formatDuration(60001)).toBe("1m");
    });

    it("formats large durations correctly", () => {
      expect(formatDuration(10800000)).toBe("3h 0m"); // 3 hours
      expect(formatDuration(86400000)).toBe("24h 0m"); // 1 day
      expect(formatDuration(90061000)).toBe("25h 1m"); // 25h 1m
    });
  });
});
