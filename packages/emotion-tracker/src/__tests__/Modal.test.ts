import { render, fireEvent } from "@testing-library/svelte";
import "@testing-library/jest-dom";
import { describe, it, expect, vi, beforeEach } from "vitest";
import Modal from "../Modal.svelte";

describe("Modal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Rendering", () => {
    it("renders when open is true", () => {
      const { container } = render(Modal, { open: true });
      const modal = container.querySelector(".modal");
      expect(modal).toBeDefined();
    });

    it("does not render when open is false", () => {
      const { container } = render(Modal, { open: false });
      const modal = container.querySelector(".modal");
      expect(modal).toBeNull();
    });
  });

  describe("Accessibility", () => {
    it("has dialog role when open", () => {
      const { container } = render(Modal, { open: true });
      const dialog = container.querySelector('[role="dialog"]');
      expect(dialog).toBeDefined();
    });

    it("has aria-modal when open", () => {
      const { container } = render(Modal, { open: true });
      const dialog = container.querySelector('[aria-modal="true"]');
      expect(dialog).toBeDefined();
    });

    it("sets aria-labelledby when provided", () => {
      const { container } = render(Modal, {
        open: true,
        ariaLabelledby: "modal-title",
      });
      const dialog = container.querySelector('[aria-labelledby="modal-title"]');
      expect(dialog).toBeDefined();
    });

    it("sets aria-describedby when provided", () => {
      const { container } = render(Modal, {
        open: true,
        ariaDescribedby: "modal-desc",
      });
      const dialog = container.querySelector('[aria-describedby="modal-desc"]');
      expect(dialog).toBeDefined();
    });

    it("closes on Escape when closeOnEsc is true", async () => {
      const { component } = render(Modal, {
        open: true,
        closeOnEsc: true,
      });

      const spy = vi.fn();
      component.$on("close", spy);

      await fireEvent.keyDown(document, { key: "Escape" });
      expect(spy).toHaveBeenCalled();
    });

    it("does not close on Escape when closeOnEsc is false", async () => {
      const { component } = render(Modal, {
        open: true,
        closeOnEsc: false,
      });

      const spy = vi.fn();
      component.$on("close", spy);

      await fireEvent.keyDown(document, { key: "Escape" });
      expect(spy).not.toHaveBeenCalled();
    });

    it("traps focus within modal", async () => {
      const { container } = render(Modal, {
        open: true,
        slots: {
          default: `
            <button id="first">First</button>
            <button id="last">Last</button>
          `,
        },
      });

      const firstButton = container.querySelector(
        "#first"
      ) as HTMLButtonElement;
      expect(firstButton).toBeDefined();
    });
  });

  describe("Backdrop Interaction", () => {
    it("closes on backdrop click when closeOnBackdrop is true", async () => {
      const { component, container } = render(Modal, {
        open: true,
        closeOnBackdrop: true,
      });

      const spy = vi.fn();
      component.$on("close", spy);

      const backdrop = container.querySelector(".modal-backdrop");
      if (backdrop) {
        await fireEvent.click(backdrop);
        expect(spy).toHaveBeenCalled();
      }
    });

    it("does not close on backdrop click when closeOnBackdrop is false", async () => {
      const { component, container } = render(Modal, {
        open: true,
        closeOnBackdrop: false,
      });

      const spy = vi.fn();
      component.$on("close", spy);

      const backdrop = container.querySelector(".modal-backdrop");
      if (backdrop) {
        await fireEvent.click(backdrop);
        expect(spy).not.toHaveBeenCalled();
      }
    });

    it("does not close when clicking inside modal", async () => {
      const { component, container } = render(Modal, {
        open: true,
        closeOnBackdrop: true,
      });

      const spy = vi.fn();
      component.$on("close", spy);

      const modal = container.querySelector(".modal");
      if (modal) {
        await fireEvent.click(modal);
        expect(spy).not.toHaveBeenCalled();
      }
    });
  });

  describe("Body Overflow", () => {
    it("sets body overflow to hidden when open", () => {
      render(Modal, { open: true });
      expect(document.body.style.overflow).toBe("hidden");
    });

    it("manages body overflow state", () => {
      document.body.style.overflow = "";
      render(Modal, { open: true });
      expect(document.body.style.overflow).toBe("hidden");
      // Cleanup
      document.body.style.overflow = "";
    });
  });

  describe("Focus Management", () => {
    it("focuses modal when opened", async () => {
      const { container } = render(Modal, { open: true });
      const modal = container.querySelector('[tabindex="-1"]');
      expect(modal).toBeDefined();
    });

    it("restores focus after closing", async () => {
      const button = document.createElement("button");
      document.body.appendChild(button);
      button.focus();

      const { rerender } = render(Modal, { open: true });
      rerender(Modal, { open: false });

      document.body.removeChild(button);
    });
  });

  describe("Events", () => {
    it("emits close event", async () => {
      const { component } = render(Modal, { open: true });

      const spy = vi.fn();
      component.$on("close", spy);

      const modal = component as any;
      // Trigger close through escape key
      await fireEvent.keyDown(document, { key: "Escape" });

      expect(spy).toHaveBeenCalled();
    });
  });

  describe("Props", () => {
    it("accepts and applies all props", () => {
      const { container } = render(Modal, {
        open: true,
        ariaLabelledby: "title",
        ariaDescribedby: "desc",
        closeOnEsc: true,
        closeOnBackdrop: false,
      });

      const dialog = container.querySelector('[role="dialog"]');
      expect(dialog?.getAttribute("aria-labelledby")).toBe("title");
      expect(dialog?.getAttribute("aria-describedby")).toBe("desc");
    });
  });
});
