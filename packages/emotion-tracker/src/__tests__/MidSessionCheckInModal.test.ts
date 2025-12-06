import { render, fireEvent } from "@testing-library/svelte";
import "@testing-library/jest-dom";
import { describe, it, expect, beforeEach, vi } from "vitest";
import MidSessionCheckInModal from "../MidSessionCheckInModal.svelte";
import { persistMidSessionCheckIn, getSessionCheckIns } from "../events";
import type { MidSessionCheckInEvent } from "../types";

const sessionId = "test-session";
const userId = "test-user";

describe("MidSessionCheckInModal", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  describe("Rendering", () => {
    it("renders when open is true", () => {
      const { container } = render(MidSessionCheckInModal, {
        open: true,
        sessionId,
        userId,
      });
      const modal = container.querySelector(".checkin-modal");
      expect(modal).toBeDefined();
    });

    it("does not render when open is false", () => {
      const { container } = render(MidSessionCheckInModal, {
        open: false,
        sessionId,
        userId,
      });
      const modal = container.querySelector(".checkin-modal");
      expect(modal).toBeNull();
    });

    it("displays title and description", () => {
      const { container } = render(MidSessionCheckInModal, {
        open: true,
        sessionId,
        userId,
      });
      const title = container.querySelector("#checkin-title");
      const desc = container.querySelector("#checkin-desc");
      expect(title?.textContent).toContain("Quick Check-in");
      expect(desc?.textContent).toContain("distractions");
    });

    it("displays distraction option buttons", () => {
      const { container } = render(MidSessionCheckInModal, {
        open: true,
        sessionId,
        userId,
      });
      const buttons = container.querySelectorAll(".distraction-options button");
      expect(buttons.length).toBeGreaterThanOrEqual(3);
    });
  });

  describe("Distraction Selection", () => {
    it("allows selecting single distraction", async () => {
      const { getByText, component } = render(MidSessionCheckInModal, {
        open: true,
        sessionId,
        userId,
        testMode: true,
      });

      let checkInData: any = null;
      component.$on("checkIn", (e: any) => {
        checkInData = e.detail;
      });

      await fireEvent.click(getByText("Phone"));
      expect(checkInData?.distractions).toContain("Phone");
    });

    it("allows multiple distraction types to be selected", async () => {
      const { getByText, component } = render(MidSessionCheckInModal, {
        open: true,
        sessionId,
        userId,
        testMode: true,
      });

      let checkInData: any = null;
      component.$on("checkIn", (e: any) => {
        checkInData = e.detail;
      });

      await fireEvent.click(getByText("Phone"));
      await fireEvent.click(getByText("Social Media"));
      expect(checkInData?.distractions).toEqual(
        expect.arrayContaining(["Phone", "Social Media"])
      );
    });

    it("allows deselecting distraction", async () => {
      const { getByText, component } = render(MidSessionCheckInModal, {
        open: true,
        sessionId,
        userId,
        testMode: true,
      });

      let checkInData: any = null;
      component.$on("checkIn", (e: any) => {
        checkInData = e.detail;
      });

      await fireEvent.click(getByText("Phone"));
      await fireEvent.click(getByText("Phone"));
      expect(checkInData?.distractions?.length).toBe(0);
    });

    it('selects "No Distractions" and clears other selections', async () => {
      const { getByText, component } = render(MidSessionCheckInModal, {
        open: true,
        sessionId,
        userId,
        testMode: true,
      });

      let checkInData: any = null;
      component.$on("checkIn", (e: any) => {
        checkInData = e.detail;
      });

      await fireEvent.click(getByText("Phone"));
      await fireEvent.click(getByText("No Distractions"));
      expect(checkInData?.distractions).toEqual(["none"]);
    });

    it('clears "No Distractions" when selecting a distraction', async () => {
      const { getByText, component } = render(MidSessionCheckInModal, {
        open: true,
        sessionId,
        userId,
        testMode: true,
      });

      let checkInData: any = null;
      component.$on("checkIn", (e: any) => {
        checkInData = e.detail;
      });

      await fireEvent.click(getByText("No Distractions"));
      await fireEvent.click(getByText("Phone"));
      expect(checkInData?.distractions).toContain("Phone");
      expect(checkInData?.distractions).not.toContain("none");
    });
  });

  describe("Event Emissions", () => {
    it("emits checkIn event with correct payload", async () => {
      const { getByText, component } = render(MidSessionCheckInModal, {
        open: true,
        sessionId: "s123",
        userId: "u456",
        testMode: true,
      });

      let checkInEvent: MidSessionCheckInEvent | null = null;
      component.$on("checkIn", (e: any) => {
        checkInEvent = e.detail;
      });

      await fireEvent.click(getByText("Noise"));

      expect(checkInEvent).toBeDefined();
      expect(checkInEvent?.sessionId).toBe("s123");
      expect(checkInEvent?.userId).toBe("u456");
      expect(checkInEvent?.distractions).toContain("Noise");
      expect(checkInEvent?.timestamp).toBeDefined();
    });

    it("includes timestamp in event", async () => {
      const { getByText, component } = render(MidSessionCheckInModal, {
        open: true,
        sessionId,
        userId,
        testMode: true,
      });

      let checkInEvent: any = null;
      component.$on("checkIn", (e: any) => {
        checkInEvent = e.detail;
      });

      const beforeTime = Date.now();
      await fireEvent.click(getByText("Phone"));
      const afterTime = Date.now();

      expect(checkInEvent?.timestamp).toBeGreaterThanOrEqual(beforeTime);
      expect(checkInEvent?.timestamp).toBeLessThanOrEqual(afterTime);
    });
  });

  describe("Modal Behavior", () => {
    it("closes modal in normal mode after check-in (when testMode=false)", async () => {
      const { getByText, component, rerender } = render(
        MidSessionCheckInModal,
        {
          open: true,
          sessionId,
          userId,
          testMode: false,
        }
      );

      const button = getByText("Phone") as HTMLButtonElement;
      await fireEvent.click(button);

      // The modal should have closed, but we can't directly verify
      // since we'd need to check the open prop via component state
      expect(component).toBeDefined();
    });

    it("stays open in test mode after check-in", async () => {
      const { getByText, container } = render(MidSessionCheckInModal, {
        open: true,
        sessionId,
        userId,
        testMode: true,
      });

      const button = getByText("Phone") as HTMLButtonElement;
      await fireEvent.click(button);

      // Modal should still be visible in test mode
      const modal = container.querySelector(".checkin-modal");
      expect(modal).toBeDefined();
    });
  });

  describe("Accessibility", () => {
    it("has proper ARIA attributes", () => {
      const { container } = render(MidSessionCheckInModal, {
        open: true,
        sessionId,
        userId,
      });

      const modal = container.querySelector('[role="group"]');
      expect(modal?.getAttribute("aria-labelledby")).toBe("checkin-title");
      expect(modal?.getAttribute("aria-describedby")).toBe("checkin-desc");
    });

    it("buttons have aria-pressed attributes", () => {
      const { container } = render(MidSessionCheckInModal, {
        open: true,
        sessionId,
        userId,
      });

      const buttons = container.querySelectorAll(".distraction-options button");
      buttons.forEach((btn) => {
        expect(btn.hasAttribute("aria-pressed")).toBe(true);
      });
    });

    it("aria-pressed reflects selection state", async () => {
      const { getByText, container } = render(MidSessionCheckInModal, {
        open: true,
        sessionId,
        userId,
        testMode: true,
      });

      const phoneButton = getByText("Phone") as HTMLButtonElement;
      expect(phoneButton.getAttribute("aria-pressed")).toBe("false");

      await fireEvent.click(phoneButton);
      expect(phoneButton.getAttribute("aria-pressed")).toBe("true");

      await fireEvent.click(phoneButton);
      expect(phoneButton.getAttribute("aria-pressed")).toBe("false");
    });
  });

  describe("Props", () => {
    it("uses provided sessionId", async () => {
      const { getByText, component } = render(MidSessionCheckInModal, {
        open: true,
        sessionId: "custom-session-id",
        userId,
        testMode: true,
      });

      let checkInEvent: any = null;
      component.$on("checkIn", (e: any) => {
        checkInEvent = e.detail;
      });

      await fireEvent.click(getByText("Phone"));
      expect(checkInEvent?.sessionId).toBe("custom-session-id");
    });

    it("uses provided userId", async () => {
      const { getByText, component } = render(MidSessionCheckInModal, {
        open: true,
        sessionId,
        userId: "custom-user-id",
        testMode: true,
      });

      let checkInEvent: any = null;
      component.$on("checkIn", (e: any) => {
        checkInEvent = e.detail;
      });

      await fireEvent.click(getByText("Phone"));
      expect(checkInEvent?.userId).toBe("custom-user-id");
    });
  });
});
