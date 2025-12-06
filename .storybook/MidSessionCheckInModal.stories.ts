import type { Meta, StoryObj } from "@storybook/svelte";
import MidSessionCheckInModal from "../packages/emotion-tracker/dist/MidSessionCheckInModal.svelte";

type StoryProps = {
  open?: boolean;
  sessionId?: string;
  userId?: string;
  testMode?: boolean;
};

const meta: Meta<StoryProps> = {
  title: "Components/MidSessionCheckInModal",
  component: MidSessionCheckInModal as any,
  tags: ["autodocs"],
  argTypes: {
    open: {
      control: "boolean",
      description: "Controls whether the check-in modal is open",
    },
    sessionId: {
      control: "text",
      description: "Unique identifier for the session",
    },
    userId: {
      control: "text",
      description: "Unique identifier for the user",
    },
    testMode: {
      control: "boolean",
      description:
        "When enabled, modal does not auto-close (useful for testing)",
    },
  },
};

export default meta;
type Story = StoryObj<StoryProps>;

export const Closed: Story = {
  args: {
    open: false,
    sessionId: "session-123",
    userId: "user-456",
    testMode: false,
  },
};

export const Open: Story = {
  args: {
    open: true,
    sessionId: "session-123",
    userId: "user-456",
    testMode: true,
  },
};

export const TestMode: Story = {
  args: {
    open: true,
    sessionId: "work-session-001",
    userId: "developer-789",
    testMode: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Test mode keeps the modal open after selection, useful for testing all options. In production mode, the modal closes after selection.",
      },
    },
  },
};

export const DifferentSessionAndUser: Story = {
  args: {
    open: true,
    sessionId: "study-session-2025-12-06",
    userId: "student-001",
    testMode: true,
  },
};

export const MultipleCheckIns: Story = {
  args: {
    open: true,
    sessionId: "long-work-session",
    userId: "user-intensive-work",
    testMode: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          "This modal can be shown multiple times during a session with different sessionIds to track multiple check-in events.",
      },
    },
  },
};
