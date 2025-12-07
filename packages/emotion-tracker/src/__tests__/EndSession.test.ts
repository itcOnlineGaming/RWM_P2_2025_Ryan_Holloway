import { describe, it, expect, vi } from "vitest";
import { render, fireEvent } from "@testing-library/svelte";
import EndSession from "../EndSession.svelte";

describe("EndSession Component", () => {
  describe("Rendering", () => {
    it("should render with default props", () => {
      const { getByText } = render(EndSession);

      expect(getByText("How did your session go?")).toBeTruthy();
      expect(getByText("Rate your experience")).toBeTruthy();
      expect(getByText("Complete Session")).toBeTruthy();
      expect(getByText("STEP 3 · AFTER")).toBeTruthy();
    });

    it("should render with custom title and subtitle", () => {
      const { getByText } = render(EndSession, {
        props: {
          title: "Custom Title",
          subtitle: "Custom Subtitle",
        },
      });

      expect(getByText("Custom Title")).toBeTruthy();
      expect(getByText("Custom Subtitle")).toBeTruthy();
    });

    it("should render with custom button text", () => {
      const { getByText } = render(EndSession, {
        props: {
          buttonText: "Finish",
        },
      });

      expect(getByText("Finish")).toBeTruthy();
    });

    it("should render default mood options", () => {
      const { getByText } = render(EndSession);

      expect(getByText("Happy")).toBeTruthy();
      expect(getByText("Neutral")).toBeTruthy();
      expect(getByText("Tired")).toBeTruthy();
      expect(getByText("Unwell")).toBeTruthy();
      expect(getByText("Down")).toBeTruthy();
    });

    it("should render custom mood options", () => {
      const { getByText, queryByText } = render(EndSession, {
        props: {
          moodOptions: ["Great", "Okay", "Bad"],
        },
      });

      expect(getByText("Great")).toBeTruthy();
      expect(getByText("Okay")).toBeTruthy();
      expect(getByText("Bad")).toBeTruthy();
      expect(queryByText("Happy")).toBeFalsy();
    });

    it("should render default rating factors", () => {
      const { getByText } = render(EndSession);

      expect(getByText("Productivity")).toBeTruthy();
      expect(getByText("Focus")).toBeTruthy();
      expect(getByText("Understanding")).toBeTruthy();
      expect(getByText("Energy")).toBeTruthy();
    });

    it("should render custom rating factors", () => {
      const { getByText, queryByText } = render(EndSession, {
        props: {
          ratingFactors: ["Quality", "Speed"],
        },
      });

      expect(getByText("Quality")).toBeTruthy();
      expect(getByText("Speed")).toBeTruthy();
      expect(queryByText("Productivity")).toBeFalsy();
    });

    it("should render 10 rating dots for each factor", () => {
      const { container } = render(EndSession, {
        props: {
          ratingFactors: ["Productivity", "Focus"],
        },
      });

      const dotContainers = container.querySelectorAll(".rating-dots");
      expect(dotContainers.length).toBe(2);

      dotContainers.forEach((container) => {
        const dots = container.querySelectorAll(".dot");
        expect(dots.length).toBe(10);
      });
    });

    it("should show rating values as 0/10 initially", () => {
      const { getByText } = render(EndSession, {
        props: {
          ratingFactors: ["Productivity"],
        },
      });

      expect(getByText("0/10")).toBeTruthy();
    });

    it("should render mood emojis correctly", () => {
      const { container } = render(EndSession, {
        props: {
          moodOptions: ["Happy"],
          moodEmojis: { Happy: "😊" },
        },
      });

      const emoji = container.querySelector(".chip-icon");
      expect(emoji?.textContent).toBe("😊");
    });
  });

  describe("Mood Selection", () => {
    it("should allow selecting a mood", async () => {
      const { getByText, container } = render(EndSession);

      const happyButton = getByText("Happy").closest("button")!;
      await fireEvent.click(happyButton);

      expect(happyButton.classList.contains("chip--selected")).toBe(true);
    });

    it("should only allow one mood to be selected", async () => {
      const { getByText } = render(EndSession);

      const happyButton = getByText("Happy").closest("button")!;
      const tiredButton = getByText("Tired").closest("button")!;

      await fireEvent.click(happyButton);
      expect(happyButton.classList.contains("chip--selected")).toBe(true);

      await fireEvent.click(tiredButton);
      expect(tiredButton.classList.contains("chip--selected")).toBe(true);
      expect(happyButton.classList.contains("chip--selected")).toBe(false);
    });

    it("should bind selectedMood prop", async () => {
      const { component, getByText } = render(EndSession, {
        props: {
          selectedMood: "Happy",
        },
      });

      const happyButton = getByText("Happy").closest("button")!;
      expect(happyButton.classList.contains("chip--selected")).toBe(true);

      const neutralButton = getByText("Neutral").closest("button")!;
      await fireEvent.click(neutralButton);

      expect(component.selectedMood).toBe("Neutral");
    });

    it("should not allow mood selection when disabled", async () => {
      const { getByText, component } = render(EndSession, {
        props: {
          disabled: true,
        },
      });

      const happyButton = getByText("Happy").closest("button")!;
      await fireEvent.click(happyButton);

      expect(component.selectedMood).toBe("");
    });

    it("should apply disabled class to mood chips when disabled", () => {
      const { container } = render(EndSession, {
        props: {
          disabled: true,
        },
      });

      const chips = container.querySelectorAll(".chip");
      chips.forEach((chip) => {
        expect(chip.classList.contains("chip--disabled")).toBe(true);
      });
    });
  });

  describe("Rating System", () => {
    it("should allow rating a factor", async () => {
      const { container, getByText } = render(EndSession, {
        props: {
          ratingFactors: ["Productivity"],
        },
      });

      const dots = container.querySelectorAll(".rating-dots .dot");
      await fireEvent.click(dots[4]); // Click 5th dot (rating = 5)

      expect(getByText("5/10")).toBeTruthy();
    });

    it("should fill dots up to the selected rating", async () => {
      const { container } = render(EndSession, {
        props: {
          ratingFactors: ["Productivity"],
        },
      });

      const dots = container.querySelectorAll(".rating-dots .dot");
      await fireEvent.click(dots[6]); // Rating = 7

      // First 7 dots should be filled
      for (let i = 0; i < 7; i++) {
        expect(dots[i].classList.contains("dot--filled")).toBe(true);
      }
      // Remaining dots should not be filled
      for (let i = 7; i < 10; i++) {
        expect(dots[i].classList.contains("dot--filled")).toBe(false);
      }
    });

    it("should allow changing a rating", async () => {
      const { container, getByText } = render(EndSession, {
        props: {
          ratingFactors: ["Productivity"],
        },
      });

      const dots = container.querySelectorAll(".rating-dots .dot");
      await fireEvent.click(dots[6]); // Rating = 7
      expect(getByText("7/10")).toBeTruthy();

      await fireEvent.click(dots[3]); // Rating = 4
      expect(getByText("4/10")).toBeTruthy();
    });

    it("should track multiple factor ratings independently", async () => {
      const { container, getByText } = render(EndSession, {
        props: {
          ratingFactors: ["Productivity", "Focus"],
        },
      });

      const dotContainers = container.querySelectorAll(".rating-dots");
      const productivityDots = dotContainers[0].querySelectorAll(".dot");
      const focusDots = dotContainers[1].querySelectorAll(".dot");

      await fireEvent.click(productivityDots[4]); // Productivity = 5
      await fireEvent.click(focusDots[7]); // Focus = 8

      const ratingValues = container.querySelectorAll(".rating-value");
      expect(ratingValues[0].textContent).toBe("5/10");
      expect(ratingValues[1].textContent).toBe("8/10");
    });

    it("should bind ratings prop", async () => {
      const { component, container } = render(EndSession, {
        props: {
          ratingFactors: ["Productivity"],
          ratings: { Productivity: 6 },
        },
      });

      const dots = container.querySelectorAll(".rating-dots .dot");
      await fireEvent.click(dots[8]); // Click 9th dot

      expect(component.ratings["Productivity"]).toBe(9);
    });

    it("should initialize ratings to 0 for all factors", () => {
      const { component } = render(EndSession, {
        props: {
          ratingFactors: ["Productivity", "Focus"],
        },
      });

      expect(component.ratings["Productivity"]).toBe(0);
      expect(component.ratings["Focus"]).toBe(0);
    });

    it("should not allow rating when disabled", async () => {
      const { container, component } = render(EndSession, {
        props: {
          ratingFactors: ["Productivity"],
          disabled: true,
        },
      });

      const dots = container.querySelectorAll(".rating-dots .dot");
      await fireEvent.click(dots[4]);

      expect(component.ratings["Productivity"]).toBe(0);
    });

    it("should apply disabled class to rating dots when disabled", () => {
      const { container } = render(EndSession, {
        props: {
          disabled: true,
        },
      });

      const dots = container.querySelectorAll(".dot");
      dots.forEach((dot) => {
        expect(dot.classList.contains("dot--disabled")).toBe(true);
      });
    });
  });

  describe("Validation", () => {
    it("should disable complete button when no mood selected", () => {
      const { getByText } = render(EndSession);

      const button = getByText("Complete Session").closest("button")!;
      expect(button.hasAttribute("disabled")).toBe(true);
    });

    it("should disable complete button when mood selected but no ratings", async () => {
      const { getByText } = render(EndSession);

      const happyButton = getByText("Happy").closest("button")!;
      await fireEvent.click(happyButton);

      const completeButton = getByText("Complete Session").closest("button")!;
      expect(completeButton.hasAttribute("disabled")).toBe(true);
    });

    it("should disable complete button when some ratings are 0", async () => {
      const { getByText, container } = render(EndSession, {
        props: {
          ratingFactors: ["Productivity", "Focus"],
        },
      });

      const happyButton = getByText("Happy").closest("button")!;
      await fireEvent.click(happyButton);

      const dotContainers = container.querySelectorAll(".rating-dots");
      const productivityDots = dotContainers[0].querySelectorAll(".dot");
      await fireEvent.click(productivityDots[4]); // Productivity = 5, Focus = 0

      const completeButton = getByText("Complete Session").closest("button")!;
      expect(completeButton.hasAttribute("disabled")).toBe(true);
    });

    it("should enable complete button when mood and all ratings are set", async () => {
      const { getByText, container } = render(EndSession, {
        props: {
          ratingFactors: ["Productivity", "Focus"],
        },
      });

      const happyButton = getByText("Happy").closest("button")!;
      await fireEvent.click(happyButton);

      const dotContainers = container.querySelectorAll(".rating-dots");
      const productivityDots = dotContainers[0].querySelectorAll(".dot");
      const focusDots = dotContainers[1].querySelectorAll(".dot");

      await fireEvent.click(productivityDots[4]); // Productivity = 5
      await fireEvent.click(focusDots[7]); // Focus = 8

      const completeButton = getByText("Complete Session").closest("button")!;
      expect(completeButton.hasAttribute("disabled")).toBe(false);
    });

    it("should keep button disabled when disabled prop is true", async () => {
      const { getByText, container } = render(EndSession, {
        props: {
          ratingFactors: ["Productivity"],
          disabled: true,
        },
      });

      const happyButton = getByText("Happy").closest("button")!;
      const dots = container.querySelectorAll(".rating-dots .dot");

      await fireEvent.click(happyButton);
      await fireEvent.click(dots[4]);

      const completeButton = getByText("Complete Session").closest("button")!;
      expect(completeButton.hasAttribute("disabled")).toBe(true);
    });
  });

  describe("Events", () => {
    it("should dispatch sessionComplete event when button clicked", async () => {
      const { component, getByText, container } = render(EndSession, {
        props: {
          ratingFactors: ["Productivity"],
        },
      });

      const sessionCompleteMock = vi.fn();
      component.$on("sessionComplete", sessionCompleteMock);

      const happyButton = getByText("Happy").closest("button")!;
      await fireEvent.click(happyButton);

      const dots = container.querySelectorAll(".rating-dots .dot");
      await fireEvent.click(dots[4]); // Productivity = 5

      const completeButton = getByText("Complete Session").closest("button")!;
      await fireEvent.click(completeButton);

      expect(sessionCompleteMock).toHaveBeenCalledTimes(1);
    });

    it("should include mood and ratings in sessionComplete event", async () => {
      const { component, getByText, container } = render(EndSession, {
        props: {
          ratingFactors: ["Productivity", "Focus"],
        },
      });

      const sessionCompleteMock = vi.fn();
      component.$on("sessionComplete", sessionCompleteMock);

      const happyButton = getByText("Happy").closest("button")!;
      await fireEvent.click(happyButton);

      const dotContainers = container.querySelectorAll(".rating-dots");
      await fireEvent.click(dotContainers[0].querySelectorAll(".dot")[4]); // Productivity = 5
      await fireEvent.click(dotContainers[1].querySelectorAll(".dot")[7]); // Focus = 8

      const completeButton = getByText("Complete Session").closest("button")!;
      await fireEvent.click(completeButton);

      expect(sessionCompleteMock).toHaveBeenCalledWith(
        expect.objectContaining({
          detail: {
            mood: "Happy",
            ratings: {
              Productivity: 5,
              Focus: 8,
            },
          },
        })
      );
    });

    it("should not dispatch event when button is disabled", async () => {
      const { component, getByText } = render(EndSession);

      const sessionCompleteMock = vi.fn();
      component.$on("sessionComplete", sessionCompleteMock);

      const completeButton = getByText("Complete Session").closest("button")!;
      await fireEvent.click(completeButton);

      expect(sessionCompleteMock).not.toHaveBeenCalled();
    });

    it("should not dispatch event when disabled prop is true", async () => {
      const { component, getByText, container } = render(EndSession, {
        props: {
          ratingFactors: ["Productivity"],
          disabled: true,
          selectedMood: "Happy",
        },
      });

      const sessionCompleteMock = vi.fn();
      component.$on("sessionComplete", sessionCompleteMock);

      const dots = container.querySelectorAll(".rating-dots .dot");
      await fireEvent.click(dots[4]);

      const completeButton = getByText("Complete Session").closest("button")!;
      await fireEvent.click(completeButton);

      expect(sessionCompleteMock).not.toHaveBeenCalled();
    });

    it("should create a copy of ratings in the event", async () => {
      const { component, getByText, container } = render(EndSession, {
        props: {
          ratingFactors: ["Productivity"],
        },
      });

      let eventData: any;
      component.$on("sessionComplete", (event) => {
        eventData = event.detail;
      });

      const happyButton = getByText("Happy").closest("button")!;
      await fireEvent.click(happyButton);

      const dots = container.querySelectorAll(".rating-dots .dot");
      await fireEvent.click(dots[4]);

      const completeButton = getByText("Complete Session").closest("button")!;
      await fireEvent.click(completeButton);

      // Modify the original ratings
      component.ratings["Productivity"] = 10;

      // Event data should still have original value
      expect(eventData.ratings["Productivity"]).toBe(5);
    });
  });

  describe("Accessibility", () => {
    it("should have aria-pressed attribute on mood chips", () => {
      const { container } = render(EndSession);

      const chips = container.querySelectorAll(".chip");
      chips.forEach((chip) => {
        expect(chip.hasAttribute("aria-pressed")).toBe(true);
      });
    });

    it("should update aria-pressed when mood is selected", async () => {
      const { getByText } = render(EndSession);

      const happyButton = getByText("Happy").closest("button")!;
      expect(happyButton.getAttribute("aria-pressed")).toBe("false");

      await fireEvent.click(happyButton);
      expect(happyButton.getAttribute("aria-pressed")).toBe("true");
    });

    it("should have aria-label on rating dots", () => {
      const { container } = render(EndSession, {
        props: {
          ratingFactors: ["Productivity"],
        },
      });

      const dots = container.querySelectorAll(".rating-dots .dot");
      dots.forEach((dot, index) => {
        expect(dot.getAttribute("aria-label")).toBe(
          `Rate Productivity as ${index + 1}`
        );
      });
    });

    it("should disable mood chips with disabled attribute", () => {
      const { container } = render(EndSession, {
        props: {
          disabled: true,
        },
      });

      const chips = container.querySelectorAll(".chip");
      chips.forEach((chip) => {
        expect(chip.hasAttribute("disabled")).toBe(true);
      });
    });

    it("should disable rating dots with disabled attribute", () => {
      const { container } = render(EndSession, {
        props: {
          disabled: true,
        },
      });

      const dots = container.querySelectorAll(".dot");
      dots.forEach((dot) => {
        expect(dot.hasAttribute("disabled")).toBe(true);
      });
    });
  });

  describe("Edge Cases", () => {
    it("should handle empty mood options array", () => {
      const { container } = render(EndSession, {
        props: {
          moodOptions: [],
        },
      });

      const chips = container.querySelectorAll(".chip");
      expect(chips.length).toBe(0);
    });

    it("should handle empty rating factors array", () => {
      const { container } = render(EndSession, {
        props: {
          ratingFactors: [],
        },
      });

      const ratingRows = container.querySelectorAll(".rating-row");
      expect(ratingRows.length).toBe(0);
    });

    it("should handle missing emoji for mood option", () => {
      const { container } = render(EndSession, {
        props: {
          moodOptions: ["Custom"],
          moodEmojis: {},
        },
      });

      const emoji = container.querySelector(".chip-icon");
      expect(emoji?.textContent).toBe("😊"); // Default fallback
    });

    it("should allow selecting first dot (rating = 1)", async () => {
      const { container, getByText } = render(EndSession, {
        props: {
          ratingFactors: ["Productivity"],
        },
      });

      const dots = container.querySelectorAll(".rating-dots .dot");
      await fireEvent.click(dots[0]);

      expect(getByText("1/10")).toBeTruthy();
      expect(dots[0].classList.contains("dot--filled")).toBe(true);
    });

    it("should allow selecting last dot (rating = 10)", async () => {
      const { container, getByText } = render(EndSession, {
        props: {
          ratingFactors: ["Productivity"],
        },
      });

      const dots = container.querySelectorAll(".rating-dots .dot");
      await fireEvent.click(dots[9]);

      expect(getByText("10/10")).toBeTruthy();

      // All dots should be filled
      dots.forEach((dot) => {
        expect(dot.classList.contains("dot--filled")).toBe(true);
      });
    });

    it("should enable button with only one rating factor", async () => {
      const { getByText, container } = render(EndSession, {
        props: {
          ratingFactors: ["Productivity"],
        },
      });

      const happyButton = getByText("Happy").closest("button")!;
      await fireEvent.click(happyButton);

      const dots = container.querySelectorAll(".rating-dots .dot");
      await fireEvent.click(dots[0]);

      const completeButton = getByText("Complete Session").closest("button")!;
      expect(completeButton.hasAttribute("disabled")).toBe(false);
    });

    it("should handle many rating factors", async () => {
      const factors = ["A", "B", "C", "D", "E", "F", "G", "H"];
      const { container, getByText } = render(EndSession, {
        props: {
          ratingFactors: factors,
        },
      });

      const ratingRows = container.querySelectorAll(".rating-row");
      expect(ratingRows.length).toBe(8);

      const happyButton = getByText("Happy").closest("button")!;
      await fireEvent.click(happyButton);

      const dotContainers = container.querySelectorAll(".rating-dots");
      for (let i = 0; i < 8; i++) {
        const dots = dotContainers[i].querySelectorAll(".dot");
        await fireEvent.click(dots[4]);
      }

      const completeButton = getByText("Complete Session").closest("button")!;
      expect(completeButton.hasAttribute("disabled")).toBe(false);
    });
  });
});
