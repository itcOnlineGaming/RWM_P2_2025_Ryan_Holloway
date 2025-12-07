import { describe, it, expect, beforeEach } from "vitest";
import { render, fireEvent } from "@testing-library/svelte";
import MidSessionCheckIn from "../MidSessionCheckIn.svelte";

describe("MidSessionCheckIn", () => {
  describe("Rendering", () => {
    it("renders nothing when show is false", () => {
      const { container } = render(MidSessionCheckIn, { show: false });
      expect(container.querySelector(".checkin-overlay")).toBeNull();
    });

    it("renders modal when show is true", () => {
      const { container } = render(MidSessionCheckIn, { show: true });
      expect(container.querySelector(".checkin-overlay")).toBeTruthy();
      expect(container.querySelector(".checkin-modal")).toBeTruthy();
    });

    it("renders with default title and subtitle", () => {
      const { getByText } = render(MidSessionCheckIn, { show: true });
      expect(getByText("Quick distraction check-in")).toBeTruthy();
      expect(
        getByText("Let us know what is pulling your attention")
      ).toBeTruthy();
    });

    it("renders with custom title and subtitle", () => {
      const { getByText } = render(MidSessionCheckIn, {
        show: true,
        title: "Custom Title",
        subtitle: "Custom Subtitle",
      });
      expect(getByText("Custom Title")).toBeTruthy();
      expect(getByText("Custom Subtitle")).toBeTruthy();
    });

    it("renders all default distraction options", () => {
      const { getByText } = render(MidSessionCheckIn, { show: true });
      expect(getByText("Phone")).toBeTruthy();
      expect(getByText("Social media")).toBeTruthy();
      expect(getByText("Noise")).toBeTruthy();
      expect(getByText("People")).toBeTruthy();
      expect(getByText("No distractions")).toBeTruthy();
    });

    it("renders custom distraction options", () => {
      const { getByText } = render(MidSessionCheckIn, {
        show: true,
        distractions: ["Email", "Meetings", "Slack"],
      });
      expect(getByText("Email")).toBeTruthy();
      expect(getByText("Meetings")).toBeTruthy();
      expect(getByText("Slack")).toBeTruthy();
    });

    it("renders distraction emojis", () => {
      const { container } = render(MidSessionCheckIn, { show: true });
      const icons = container.querySelectorAll(".chip-icon");
      expect(icons.length).toBeGreaterThan(0);
      expect(icons[0].textContent).toBe("📱");
    });

    it("renders custom emoji mapping", () => {
      const { container } = render(MidSessionCheckIn, {
        show: true,
        distractions: ["Email"],
        distractionEmojis: { Email: "📧" },
      });
      const icon = container.querySelector(".chip-icon");
      expect(icon?.textContent).toBe("📧");
    });

    it("renders save button with default text", () => {
      const { getByText } = render(MidSessionCheckIn, { show: true });
      expect(getByText("Save check-in")).toBeTruthy();
    });

    it("renders save button with custom text", () => {
      const { getByText } = render(MidSessionCheckIn, {
        show: true,
        buttonText: "Submit",
      });
      expect(getByText("Submit")).toBeTruthy();
    });

    it("renders close button", () => {
      const { container } = render(MidSessionCheckIn, { show: true });
      const closeBtn = container.querySelector(".close-btn");
      expect(closeBtn).toBeTruthy();
      expect(closeBtn?.textContent).toBe("×");
    });
  });

  describe("Selection Behavior", () => {
    it("allows selecting a distraction", async () => {
      const { getByText, container } = render(MidSessionCheckIn, {
        show: true,
        selectedDistractions: [],
      });

      const phoneChip = getByText("Phone").closest(".chip");
      await fireEvent.click(phoneChip!);

      expect(phoneChip?.classList.contains("chip--selected")).toBe(true);
    });

    it("allows deselecting a distraction", async () => {
      const { getByText } = render(MidSessionCheckIn, {
        show: true,
        selectedDistractions: ["Phone"],
      });

      const phoneChip = getByText("Phone").closest(".chip");
      expect(phoneChip?.classList.contains("chip--selected")).toBe(true);

      await fireEvent.click(phoneChip!);
      expect(phoneChip?.classList.contains("chip--selected")).toBe(false);
    });

    it("allows selecting multiple distractions", async () => {
      const { getByText } = render(MidSessionCheckIn, {
        show: true,
        selectedDistractions: [],
      });

      const phoneChip = getByText("Phone").closest(".chip");
      const noiseChip = getByText("Noise").closest(".chip");

      await fireEvent.click(phoneChip!);
      await fireEvent.click(noiseChip!);

      expect(phoneChip?.classList.contains("chip--selected")).toBe(true);
      expect(noiseChip?.classList.contains("chip--selected")).toBe(true);
    });

    it("clears other selections when 'No distractions' is selected", async () => {
      const { getByText } = render(MidSessionCheckIn, {
        show: true,
        selectedDistractions: ["Phone", "Noise"],
      });

      const noDistractionsChip = getByText("No distractions").closest(".chip");
      await fireEvent.click(noDistractionsChip!);

      expect(noDistractionsChip?.classList.contains("chip--selected")).toBe(
        true
      );

      const phoneChip = getByText("Phone").closest(".chip");
      const noiseChip = getByText("Noise").closest(".chip");
      expect(phoneChip?.classList.contains("chip--selected")).toBe(false);
      expect(noiseChip?.classList.contains("chip--selected")).toBe(false);
    });

    it("deselects 'No distractions' when selecting another distraction", async () => {
      const { getByText } = render(MidSessionCheckIn, {
        show: true,
        selectedDistractions: ["No distractions"],
      });

      const phoneChip = getByText("Phone").closest(".chip");
      await fireEvent.click(phoneChip!);

      const noDistractionsChip = getByText("No distractions").closest(".chip");
      expect(noDistractionsChip?.classList.contains("chip--selected")).toBe(
        false
      );
      expect(phoneChip?.classList.contains("chip--selected")).toBe(true);
    });

    it("toggles 'No distractions' selection", async () => {
      const { getByText } = render(MidSessionCheckIn, {
        show: true,
        selectedDistractions: [],
      });

      const noDistractionsChip = getByText("No distractions").closest(".chip");

      await fireEvent.click(noDistractionsChip!);
      expect(noDistractionsChip?.classList.contains("chip--selected")).toBe(
        true
      );

      await fireEvent.click(noDistractionsChip!);
      expect(noDistractionsChip?.classList.contains("chip--selected")).toBe(
        false
      );
    });
  });

  describe("Event Dispatching", () => {
    it("dispatches save event with selected distractions", async () => {
      let savedDistractions: string[] | null = null;

      const { getByText, component } = render(MidSessionCheckIn, {
        show: true,
        selectedDistractions: ["Phone"],
      });

      component.$on("save", (event: any) => {
        savedDistractions = event.detail.distractions;
      });

      const saveBtn = getByText("Save check-in");
      await fireEvent.click(saveBtn);

      expect(savedDistractions).toEqual(["Phone"]);
    });

    it("dispatches close event when close button clicked", async () => {
      let closeEventFired = false;

      const { container, component } = render(MidSessionCheckIn, {
        show: true,
      });

      component.$on("close", () => {
        closeEventFired = true;
      });

      const closeBtn = container.querySelector(".close-btn");
      await fireEvent.click(closeBtn!);

      expect(closeEventFired).toBe(true);
    });

    it("dispatches close event when overlay clicked", async () => {
      let closeEventFired = false;

      const { container, component } = render(MidSessionCheckIn, {
        show: true,
      });

      component.$on("close", () => {
        closeEventFired = true;
      });

      const overlay = container.querySelector(".checkin-overlay");
      await fireEvent.click(overlay!);

      expect(closeEventFired).toBe(true);
    });

    it("does not close when clicking inside modal", async () => {
      let closeEventFired = false;

      const { container, component } = render(MidSessionCheckIn, {
        show: true,
      });

      component.$on("close", () => {
        closeEventFired = true;
      });

      const modal = container.querySelector(".checkin-modal");
      await fireEvent.click(modal!);

      expect(closeEventFired).toBe(false);
    });
  });

  describe("Disabled State", () => {
    it("disables all interactions when disabled prop is true", async () => {
      const { getByText, container } = render(MidSessionCheckIn, {
        show: true,
        disabled: true,
        selectedDistractions: [],
      });

      const phoneChip = getByText("Phone").closest(".chip");
      const saveBtn = getByText("Save check-in");
      const closeBtn = container.querySelector(".close-btn");

      expect(phoneChip?.hasAttribute("disabled")).toBe(true);
      expect(saveBtn.hasAttribute("disabled")).toBe(true);
      expect(closeBtn?.hasAttribute("disabled")).toBe(true);
    });

    it("disables save button when no distractions selected", () => {
      const { getByText } = render(MidSessionCheckIn, {
        show: true,
        selectedDistractions: [],
      });

      const saveBtn = getByText("Save check-in");
      expect(saveBtn.hasAttribute("disabled")).toBe(true);
    });

    it("enables save button when distractions are selected", () => {
      const { getByText } = render(MidSessionCheckIn, {
        show: true,
        selectedDistractions: ["Phone"],
      });

      const saveBtn = getByText("Save check-in");
      expect(saveBtn.hasAttribute("disabled")).toBe(false);
    });
  });

  describe("Accessibility", () => {
    it("has proper ARIA attributes on overlay", () => {
      const { container } = render(MidSessionCheckIn, { show: true });
      const overlay = container.querySelector(".checkin-overlay");

      expect(overlay?.getAttribute("role")).toBe("dialog");
      expect(overlay?.getAttribute("aria-modal")).toBe("true");
      expect(overlay?.getAttribute("aria-labelledby")).toBe("checkin-title");
    });

    it("has proper ID on title for aria-labelledby", () => {
      const { container } = render(MidSessionCheckIn, { show: true });
      const title = container.querySelector("h3");
      expect(title?.getAttribute("id")).toBe("checkin-title");
    });

    it("has aria-label on close button", () => {
      const { container } = render(MidSessionCheckIn, { show: true });
      const closeBtn = container.querySelector(".close-btn");
      expect(closeBtn?.getAttribute("aria-label")).toBe("Close check-in");
    });

    it("has role=checkbox on distraction chips", () => {
      const { container } = render(MidSessionCheckIn, { show: true });
      const chips = container.querySelectorAll(".chip");
      chips.forEach((chip) => {
        expect(chip.getAttribute("role")).toBe("checkbox");
      });
    });

    it("has aria-checked on distraction chips", () => {
      const { getByText } = render(MidSessionCheckIn, {
        show: true,
        selectedDistractions: ["Phone"],
      });

      const phoneChip = getByText("Phone").closest(".chip");
      const noiseChip = getByText("Noise").closest(".chip");

      expect(phoneChip?.getAttribute("aria-checked")).toBe("true");
      expect(noiseChip?.getAttribute("aria-checked")).toBe("false");
    });

    it("has aria-disabled on save button", () => {
      const { getByText } = render(MidSessionCheckIn, {
        show: true,
        selectedDistractions: [],
      });

      const saveBtn = getByText("Save check-in");
      expect(saveBtn.getAttribute("aria-disabled")).toBe("true");
    });
  });

  describe("Keyboard Navigation", () => {
    it("closes modal on Escape key", async () => {
      let closeEventFired = false;

      const { component } = render(MidSessionCheckIn, { show: true });

      component.$on("close", () => {
        closeEventFired = true;
      });

      await fireEvent.keyDown(window, { key: "Escape" });

      expect(closeEventFired).toBe(true);
    });
  });
});
