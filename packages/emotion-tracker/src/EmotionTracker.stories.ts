import type { Meta, StoryObj } from "@storybook/svelte";
import EmotionTracker from "./EmotionTracker.svelte";

const meta = {
  title: "Components/EmotionTracker",
  component: EmotionTracker,
  tags: ["autodocs"],
  argTypes: {
    sessionId: {
      control: "text",
      description: "Unique identifier for the session",
    },
    customEmotions: {
      control: "object",
      description: "Array of emotion options",
    },
    enableMidSessionChecks: {
      control: "boolean",
      description: "Enable mid-session distraction checks",
    },
    midSessionInterval: {
      control: "number",
      description: "Minutes between mid-session checks",
    },
    performanceFactors: {
      control: "object",
      description: "Performance factors to rate",
    },
    showAnalytics: {
      control: "boolean",
      description: "Show analytics features",
    },
    theme: {
      control: "select",
      options: ["light", "dark"],
      description: "Component theme",
    },
  },
} satisfies Meta<EmotionTracker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    sessionId: "demo-session-1",
    customEmotions: [
      "Happy",
      "Neutral",
      "Tired",
      "Stressed",
      "Focused",
      "Anxious",
    ],
    enableMidSessionChecks: true,
    midSessionInterval: 15,
    performanceFactors: ["Productivity", "Focus", "Understanding", "Energy"],
    showAnalytics: true,
    theme: "light",
  },
};

export const DarkTheme: Story = {
  args: {
    ...Default.args,
    theme: "dark",
  },
};

export const CustomEmotions: Story = {
  args: {
    ...Default.args,
    customEmotions: ["Energized", "Calm", "Overwhelmed", "Motivated", "Bored"],
  },
};

export const MinimalFactors: Story = {
  args: {
    ...Default.args,
    performanceFactors: ["Focus", "Energy"],
  },
};

export const NoMidSessionChecks: Story = {
  args: {
    ...Default.args,
    enableMidSessionChecks: false,
  },
};

export const WorkSession: Story = {
  args: {
    sessionId: "work-session",
    customEmotions: ["Energized", "Focused", "Neutral", "Tired", "Distracted"],
    performanceFactors: [
      "Task Completion",
      "Code Quality",
      "Problem Solving",
      "Creativity",
    ],
    theme: "dark",
  },
};

export const StudySession: Story = {
  args: {
    sessionId: "study-session",
    customEmotions: ["Confident", "Curious", "Confused", "Tired", "Motivated"],
    performanceFactors: ["Understanding", "Retention", "Focus", "Engagement"],
    theme: "light",
  },
};
