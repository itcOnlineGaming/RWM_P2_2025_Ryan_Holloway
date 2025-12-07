import { render, fireEvent } from "@testing-library/svelte";
import "@testing-library/jest-dom";
import { describe, it, expect } from "vitest";
import StartSession from "../StartSession.svelte";
describe("StartSession Component", () => {
    describe("Rendering", () => {
        it("renders with default props", () => {
            const { container } = render(StartSession);
            const title = container.querySelector(".card-title");
            expect(title?.textContent).toBe("How are you feeling before starting?");
            const subtitle = container.querySelector(".card-subtitle");
            expect(subtitle?.textContent).toBe("Let us know your current mood");
            const button = container.querySelector(".primary-btn");
            expect(button?.textContent).toBe("Start Session");
        });
        it("renders custom title and subtitle", () => {
            const { container } = render(StartSession, {
                props: {
                    title: "Custom Title",
                    subtitle: "Custom Subtitle",
                },
            });
            const title = container.querySelector(".card-title");
            expect(title?.textContent).toBe("Custom Title");
            const subtitle = container.querySelector(".card-subtitle");
            expect(subtitle?.textContent).toBe("Custom Subtitle");
        });
        it("renders custom button text", () => {
            const { container } = render(StartSession, {
                props: {
                    buttonText: "Begin Now",
                },
            });
            const button = container.querySelector(".primary-btn");
            expect(button?.textContent).toBe("Begin Now");
        });
        it("renders mood options with emojis", () => {
            const { container } = render(StartSession, {
                props: {
                    moodOptions: ["Happy", "Sad"],
                    moodEmojis: {
                        Happy: "😊",
                        Sad: "😢",
                    },
                },
            });
            const chips = container.querySelectorAll(".chip");
            expect(chips.length).toBe(2);
            expect(chips[0].textContent).toContain("😊");
            expect(chips[0].textContent).toContain("Happy");
            expect(chips[1].textContent).toContain("😢");
            expect(chips[1].textContent).toContain("Sad");
        });
        it("uses default emoji when mood emoji not provided", () => {
            const { container } = render(StartSession, {
                props: {
                    moodOptions: ["Unknown"],
                    moodEmojis: {},
                },
            });
            const chip = container.querySelector(".chip");
            expect(chip?.textContent).toContain("😊");
        });
    });
    describe("Mood Selection", () => {
        it("allows selecting a mood", async () => {
            const { container } = render(StartSession, {
                props: {
                    moodOptions: ["Happy", "Neutral"],
                },
            });
            const chips = container.querySelectorAll(".chip");
            await fireEvent.click(chips[0]);
            expect(chips[0]).toHaveClass("chip--selected");
            expect(chips[1]).not.toHaveClass("chip--selected");
        });
        it("allows changing mood selection", async () => {
            const { container } = render(StartSession, {
                props: {
                    moodOptions: ["Happy", "Neutral", "Tired"],
                },
            });
            const chips = container.querySelectorAll(".chip");
            await fireEvent.click(chips[0]);
            expect(chips[0]).toHaveClass("chip--selected");
            await fireEvent.click(chips[1]);
            expect(chips[0]).not.toHaveClass("chip--selected");
            expect(chips[1]).toHaveClass("chip--selected");
        });
        it("emits moodSelect event when mood is clicked", async () => {
            const { component, container } = render(StartSession, {
                props: {
                    moodOptions: ["Happy"],
                },
            });
            let emittedEvent;
            component.$on("moodSelect", (event) => {
                emittedEvent = event.detail;
            });
            const chip = container.querySelector(".chip");
            await fireEvent.click(chip);
            expect(emittedEvent).toEqual({ mood: "Happy" });
        });
        it("displays pre-selected mood when selectedMood prop is provided", () => {
            const { container } = render(StartSession, {
                props: {
                    moodOptions: ["Happy", "Neutral"],
                    selectedMood: "Happy",
                },
            });
            const chips = container.querySelectorAll(".chip");
            expect(chips[0]).toHaveClass("chip--selected");
            expect(chips[1]).not.toHaveClass("chip--selected");
        });
        it("prevents mood selection when disabled", async () => {
            const { component, container } = render(StartSession, {
                props: {
                    moodOptions: ["Happy"],
                    disabled: true,
                },
            });
            let moodSelectCalled = false;
            component.$on("moodSelect", () => {
                moodSelectCalled = true;
            });
            const chip = container.querySelector(".chip");
            await fireEvent.click(chip);
            expect(moodSelectCalled).toBe(false);
            expect(chip).toHaveClass("chip--disabled");
        });
    });
    describe("Start Session Button", () => {
        it("disables start button when no mood is selected", () => {
            const { container } = render(StartSession);
            const button = container.querySelector(".primary-btn");
            expect(button.disabled).toBe(true);
        });
        it("enables start button when mood is selected", async () => {
            const { container } = render(StartSession, {
                props: {
                    moodOptions: ["Happy"],
                },
            });
            const chip = container.querySelector(".chip");
            await fireEvent.click(chip);
            const button = container.querySelector(".primary-btn");
            expect(button.disabled).toBe(false);
        });
        it("keeps button disabled when component is disabled", async () => {
            const { container } = render(StartSession, {
                props: {
                    moodOptions: ["Happy"],
                    selectedMood: "Happy",
                    disabled: true,
                },
            });
            const button = container.querySelector(".primary-btn");
            expect(button.disabled).toBe(true);
        });
        it("emits start event with selected mood when clicked", async () => {
            const { component, container } = render(StartSession, {
                props: {
                    moodOptions: ["Happy", "Neutral"],
                },
            });
            let emittedEvent;
            component.$on("start", (event) => {
                emittedEvent = event.detail;
            });
            const chip = container.querySelector(".chip");
            await fireEvent.click(chip);
            const button = container.querySelector(".primary-btn");
            await fireEvent.click(button);
            expect(emittedEvent).toEqual({ startMood: "Happy" });
        });
        it("does not emit start event when no mood is selected", async () => {
            const { component, container } = render(StartSession);
            let startCalled = false;
            component.$on("start", () => {
                startCalled = true;
            });
            const button = container.querySelector(".primary-btn");
            await fireEvent.click(button);
            expect(startCalled).toBe(false);
        });
        it("does not emit start event when disabled", async () => {
            const { component, container } = render(StartSession, {
                props: {
                    moodOptions: ["Happy"],
                    selectedMood: "Happy",
                    disabled: true,
                },
            });
            let startCalled = false;
            component.$on("start", () => {
                startCalled = true;
            });
            const button = container.querySelector(".primary-btn");
            await fireEvent.click(button);
            expect(startCalled).toBe(false);
        });
    });
    describe("Accessibility", () => {
        it("sets aria-pressed on selected mood chip", async () => {
            const { container } = render(StartSession, {
                props: {
                    moodOptions: ["Happy", "Neutral"],
                },
            });
            const chips = container.querySelectorAll(".chip");
            await fireEvent.click(chips[0]);
            expect(chips[0].getAttribute("aria-pressed")).toBe("true");
            expect(chips[1].getAttribute("aria-pressed")).toBe("false");
        });
        it("sets aria-label on mood chips", () => {
            const { container } = render(StartSession, {
                props: {
                    moodOptions: ["Happy", "Neutral"],
                },
            });
            const chips = container.querySelectorAll(".chip");
            expect(chips[0].getAttribute("aria-label")).toBe("Select mood: Happy");
            expect(chips[1].getAttribute("aria-label")).toBe("Select mood: Neutral");
        });
    });
    describe("Custom Styling", () => {
        it("applies custom CSS classes correctly", () => {
            const { container } = render(StartSession);
            expect(container.querySelector(".start-session-card")).toBeTruthy();
            expect(container.querySelector(".card-tag")).toBeTruthy();
            expect(container.querySelector(".card-title")).toBeTruthy();
            expect(container.querySelector(".card-subtitle")).toBeTruthy();
            expect(container.querySelector(".chips-row")).toBeTruthy();
            expect(container.querySelector(".primary-btn")).toBeTruthy();
        });
        it("applies selected state styling", async () => {
            const { container } = render(StartSession, {
                props: {
                    moodOptions: ["Happy"],
                },
            });
            const chip = container.querySelector(".chip");
            await fireEvent.click(chip);
            expect(chip).toHaveClass("chip--selected");
        });
    });
});
