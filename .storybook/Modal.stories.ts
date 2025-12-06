import type { Meta, StoryObj } from "@storybook/svelte";
import Modal from "../packages/emotion-tracker/dist/Modal.svelte";

type StoryProps = {
  open?: boolean;
  ariaLabelledby?: string;
  ariaDescribedby?: string;
  closeOnEsc?: boolean;
  closeOnBackdrop?: boolean;
};

const meta: Meta<StoryProps> = {
  title: "Components/Modal",
  component: Modal as any,
  tags: ["autodocs"],
  argTypes: {
    open: {
      control: "boolean",
      description: "Controls whether the modal is open or closed",
    },
    ariaLabelledby: {
      control: "text",
      description: "ID of the element that labels the modal",
    },
    ariaDescribedby: {
      control: "text",
      description: "ID of the element that describes the modal",
    },
    closeOnEsc: {
      control: "boolean",
      description: "Allow closing the modal with the Escape key",
    },
    closeOnBackdrop: {
      control: "boolean",
      description: "Allow closing the modal by clicking the backdrop",
    },
  },
};

export default meta;
type Story = StoryObj<StoryProps>;

export const Closed: Story = {
  args: {
    open: false,
    ariaLabelledby: "modal-title",
    ariaDescribedby: "modal-description",
    closeOnEsc: true,
    closeOnBackdrop: true,
  },
};

export const Open: Story = {
  args: {
    open: true,
    ariaLabelledby: "modal-title",
    ariaDescribedby: "modal-description",
    closeOnEsc: true,
    closeOnBackdrop: true,
  },
};

export const OpenWithContent: Story = {
  args: {
    open: true,
    ariaLabelledby: "modal-title",
    ariaDescribedby: "modal-description",
    closeOnEsc: true,
    closeOnBackdrop: true,
  },
};

export const NoEscapeClose: Story = {
  args: {
    open: true,
    ariaLabelledby: "modal-title",
    ariaDescribedby: "modal-description",
    closeOnEsc: false,
    closeOnBackdrop: true,
  },
};

export const NoBackdropClose: Story = {
  args: {
    open: true,
    ariaLabelledby: "modal-title",
    ariaDescribedby: "modal-description",
    closeOnEsc: true,
    closeOnBackdrop: false,
  },
};

export const NoClosing: Story = {
  args: {
    open: true,
    ariaLabelledby: "modal-title",
    ariaDescribedby: "modal-description",
    closeOnEsc: false,
    closeOnBackdrop: false,
  },
};

export const WithForm: Story = {
  args: {
    open: true,
    ariaLabelledby: "form-title",
    ariaDescribedby: "form-description",
    closeOnEsc: true,
    closeOnBackdrop: true,
  },
};
