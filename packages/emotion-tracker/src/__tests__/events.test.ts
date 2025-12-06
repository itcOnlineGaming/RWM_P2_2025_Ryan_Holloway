import "@testing-library/jest-dom";
import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  persistSessionStart,
  persistSessionEnd,
  getSessions,
  querySessionsByUser,
  querySessionsByTimeRange,
  isValidPreSessionEmotion,
  logEmotionSelection,
  persistMidSessionCheckIn,
  getSessionCheckIns,
} from "../events";
import type { SessionData, MidSessionCheckInEvent } from "../types";

describe("events storage", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  describe("persistSessionStart", () => {
    it("persists session start and makes it retrievable via getSessions", () => {
      const data = persistSessionStart({
        preSessionEmotion: "Happy",
        timestamp: 123,
        sessionId: "s1",
        userId: "u1",
      });
      expect(data.sessionId).toBe("s1");
      const sessions = getSessions("u1");
      expect(sessions.length).toBe(1);
      expect(sessions[0].preSessionEmotion).toBe("Happy");
    });

    it("throws for invalid preSessionEmotion", () => {
      expect(() =>
        persistSessionStart({
          preSessionEmotion: "Joy" as any,
          timestamp: 123,
          sessionId: "s2",
          userId: "u1",
        })
      ).toThrow("Invalid preSessionEmotion");
    });

    it("uses anonymous as default userId", () => {
      const data = persistSessionStart({
        preSessionEmotion: "Neutral",
        timestamp: 456,
        sessionId: "s3",
      });
      expect(data.userId).toBe("anonymous");
      const sessions = getSessions();
      expect(sessions.length).toBe(1);
    });

    it("stores multiple sessions per user", () => {
      persistSessionStart({
        preSessionEmotion: "Happy",
        timestamp: 100,
        sessionId: "s1",
        userId: "u1",
      });
      persistSessionStart({
        preSessionEmotion: "Tired",
        timestamp: 200,
        sessionId: "s2",
        userId: "u1",
      });

      const sessions = getSessions("u1");
      expect(sessions.length).toBe(2);
      expect(sessions[0].preSessionEmotion).toBe("Happy");
      expect(sessions[1].preSessionEmotion).toBe("Tired");
    });
  });

  describe("persistSessionEnd", () => {
    it("persists complete session data", () => {
      const session: SessionData = {
        sessionId: "s1",
        preSessionEmotion: "Happy",
        postSessionEmotion: "Happy",
        performanceRatings: { Focus: 8, Enjoyment: 9 },
        distractions: [],
        startTime: 1000,
        endTime: 2000,
        duration: 1000,
        userId: "u1",
      };

      const result = persistSessionEnd(session);
      expect(result.sessionId).toBe("s1");
      expect(result.postSessionEmotion).toBe("Happy");
      expect(result.performanceRatings).toEqual({ Focus: 8, Enjoyment: 9 });

      const sessions = getSessions("u1");
      expect(sessions.length).toBe(1);
      expect(sessions[0].duration).toBe(1000);
    });

    it("updates existing session start with end data", () => {
      persistSessionStart({
        preSessionEmotion: "Happy",
        timestamp: 1000,
        sessionId: "s1",
        userId: "u1",
      });

      persistSessionEnd({
        sessionId: "s1",
        preSessionEmotion: "Happy",
        postSessionEmotion: "Focused",
        performanceRatings: { Focus: 9 },
        distractions: [],
        startTime: 1000,
        endTime: 2000,
        duration: 1000,
        userId: "u1",
      });

      const sessions = getSessions("u1");
      expect(sessions.length).toBe(1);
      expect(sessions[0].postSessionEmotion).toBe("Focused");
    });

    it("throws for invalid preSessionEmotion", () => {
      expect(() =>
        persistSessionEnd({
          sessionId: "s1",
          preSessionEmotion: "Invalid" as any,
          postSessionEmotion: "Happy",
          performanceRatings: {},
          distractions: [],
          startTime: 1000,
          endTime: 2000,
          duration: 1000,
        })
      ).toThrow();
    });
  });

  describe("getSessions", () => {
    it("returns empty array when no sessions exist", () => {
      const sessions = getSessions("u1");
      expect(sessions).toEqual([]);
    });

    it("retrieves sessions for specific user", () => {
      persistSessionStart({
        preSessionEmotion: "Happy",
        timestamp: 100,
        sessionId: "s1",
        userId: "u1",
      });
      persistSessionStart({
        preSessionEmotion: "Tired",
        timestamp: 200,
        sessionId: "s2",
        userId: "u2",
      });

      expect(getSessions("u1")).toHaveLength(1);
      expect(getSessions("u2")).toHaveLength(1);
      expect(getSessions("u3")).toHaveLength(0);
    });
  });

  describe("querySessionsByUser", () => {
    it("returns sessions sorted by timestamp descending", () => {
      persistSessionStart({
        preSessionEmotion: "Happy",
        timestamp: 100,
        sessionId: "s1",
        userId: "u1",
      });
      persistSessionStart({
        preSessionEmotion: "Tired",
        timestamp: 300,
        sessionId: "s3",
        userId: "u1",
      });
      persistSessionStart({
        preSessionEmotion: "Neutral",
        timestamp: 200,
        sessionId: "s2",
        userId: "u1",
      });

      const sessions = querySessionsByUser("u1");
      expect(sessions).toHaveLength(3);
      expect(sessions[0].sessionId).toBe("s3");
      expect(sessions[1].sessionId).toBe("s2");
      expect(sessions[2].sessionId).toBe("s1");
    });
  });

  describe("querySessionsByTimeRange", () => {
    it("returns sessions within time range", () => {
      persistSessionStart({
        preSessionEmotion: "Happy",
        timestamp: 100,
        sessionId: "s1",
        userId: "u1",
      });
      persistSessionStart({
        preSessionEmotion: "Tired",
        timestamp: 500,
        sessionId: "s2",
        userId: "u1",
      });
      persistSessionStart({
        preSessionEmotion: "Neutral",
        timestamp: 900,
        sessionId: "s3",
        userId: "u1",
      });

      const inRange = querySessionsByTimeRange("u1", 200, 700);
      expect(inRange).toHaveLength(1);
      expect(inRange[0].sessionId).toBe("s2");
    });

    it("includes boundary timestamps", () => {
      persistSessionStart({
        preSessionEmotion: "Happy",
        timestamp: 100,
        sessionId: "s1",
        userId: "u1",
      });
      persistSessionStart({
        preSessionEmotion: "Tired",
        timestamp: 500,
        sessionId: "s2",
        userId: "u1",
      });

      const inRange = querySessionsByTimeRange("u1", 100, 500);
      expect(inRange).toHaveLength(2);
    });
  });

  describe("isValidPreSessionEmotion", () => {
    it("validates correct emotions", () => {
      expect(isValidPreSessionEmotion("Happy")).toBe(true);
      expect(isValidPreSessionEmotion("Neutral")).toBe(true);
      expect(isValidPreSessionEmotion("Tired")).toBe(true);
      expect(isValidPreSessionEmotion("Unwell")).toBe(true);
      expect(isValidPreSessionEmotion("Down")).toBe(true);
    });

    it("rejects invalid emotions", () => {
      expect(isValidPreSessionEmotion("Excited")).toBe(false);
      expect(isValidPreSessionEmotion("Sad")).toBe(false);
      expect(isValidPreSessionEmotion("")).toBe(false);
    });
  });

  describe("logEmotionSelection", () => {
    it("logs emotion selection to localStorage", () => {
      logEmotionSelection("u1", "Happy");
      logEmotionSelection("u1", "Happy");
      logEmotionSelection("u1", "Tired");

      const stored = localStorage.getItem("emotion_tracker_analytics_u1");
      const counters = JSON.parse(stored || "{}");
      expect(counters.Happy).toBe(2);
      expect(counters.Tired).toBe(1);
    });

    it("uses anonymous as default userId", () => {
      logEmotionSelection("anonymous", "Neutral");

      const stored = localStorage.getItem(
        "emotion_tracker_analytics_anonymous"
      );
      const counters = JSON.parse(stored || "{}");
      expect(counters.Neutral).toBe(1);
    });
  });

  describe("persistMidSessionCheckIn", () => {
    it("persists check-in event", () => {
      const checkIn: MidSessionCheckInEvent = {
        sessionId: "s1",
        userId: "u1",
        timestamp: 1500,
        distractions: ["Phone", "Noise"],
      };

      const result = persistMidSessionCheckIn(checkIn);
      expect(result.sessionId).toBe("s1");
      expect(result.distractions).toEqual(["Phone", "Noise"]);

      const stored = getSessionCheckIns("s1");
      expect(stored).toHaveLength(1);
      expect(stored[0].distractions).toEqual(["Phone", "Noise"]);
    });

    it("throws for invalid distractions array", () => {
      expect(() =>
        persistMidSessionCheckIn({
          sessionId: "s1",
          timestamp: 1500,
          distractions: [] as any, // empty array
        })
      ).toThrow("Distractions must be a non-empty array");
    });

    it("throws for invalid distraction values", () => {
      expect(() =>
        persistMidSessionCheckIn({
          sessionId: "s1",
          timestamp: 1500,
          distractions: ["InvalidDistraction"] as any,
        })
      ).toThrow("Invalid distraction value");
    });

    it("stores multiple check-ins per session", () => {
      const checkIn1: MidSessionCheckInEvent = {
        sessionId: "s1",
        timestamp: 1500,
        distractions: ["Phone"],
      };
      const checkIn2: MidSessionCheckInEvent = {
        sessionId: "s1",
        timestamp: 2500,
        distractions: ["Noise"],
      };

      persistMidSessionCheckIn(checkIn1);
      persistMidSessionCheckIn(checkIn2);

      const stored = getSessionCheckIns("s1");
      expect(stored).toHaveLength(2);
    });
  });

  describe("getSessionCheckIns", () => {
    it("returns empty array when no check-ins exist", () => {
      const checkIns = getSessionCheckIns("s1");
      expect(checkIns).toEqual([]);
    });

    it("retrieves check-ins for specific session", () => {
      persistMidSessionCheckIn({
        sessionId: "s1",
        timestamp: 1500,
        distractions: ["Phone"],
      });
      persistMidSessionCheckIn({
        sessionId: "s2",
        timestamp: 2500,
        distractions: ["Noise"],
      });

      expect(getSessionCheckIns("s1")).toHaveLength(1);
      expect(getSessionCheckIns("s2")).toHaveLength(1);
    });
  });
});
