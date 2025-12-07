import type { Meta, StoryObj } from "@storybook/svelte";
import StartSession from "./StartSession.svelte";

const meta = {
  title: "Components/StartSession",
  component: StartSession,
  tags: ["autodocs"],
  argTypes: {
    title: {
      control: "text",
      description: "Main heading text for the start session card",
    },
    subtitle: {
      control: "text",
      description: "Subtitle text providing additional context",
    },
    buttonText: {
      control: "text",
      description: "Text displayed on the start button",
    },
    moodOptions: {
      control: "object",
      description: "Array of mood options to display",
    },
    moodEmojis: {
      control: "object",
      description: "Mapping of mood names to emoji icons",
    },
    selectedMood: {
      control: "text",
      description: "Currently selected mood (controlled component)",
    },
    disabled: {
      control: "boolean",
      description: "Whether the component is disabled",
    },
  },
} satisfies Meta<StartSession>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "How are you feeling before starting?",
    subtitle: "Let us know your current mood",
    buttonText: "Start Session",
    moodOptions: ["Happy", "Neutral", "Tired", "Unwell", "Down"],
    moodEmojis: {
      Happy: "😊",
      Neutral: "😐",
      Tired: "😴",
      Unwell: "🤒",
      Down: "☁️",
    },
    selectedMood: null,
    disabled: false,
  },
};

export const WithPreselectedMood: Story = {
  args: {
    ...Default.args,
    selectedMood: "Happy",
  },
};

export const Disabled: Story = {
  args: {
    ...Default.args,
    selectedMood: "Neutral",
    disabled: true,
  },
};

export const CustomMoodOptions: Story = {
  args: {
    ...Default.args,
    title: "How are you feeling today?",
    subtitle: "Select your current emotional state",
    moodOptions: ["Energized", "Focused", "Calm", "Anxious", "Overwhelmed"],
    moodEmojis: {
      Energized: "⚡",
      Focused: "🎯",
      Calm: "🧘",
      Anxious: "😰",
      Overwhelmed: "😵",
    },
  },
};

export const WorkSession: Story = {
  args: {
    ...Default.args,
    title: "Ready to start your work session?",
    subtitle: "How's your energy level?",
    buttonText: "Begin Working",
    moodOptions: ["Energized", "Ready", "Neutral", "Low Energy", "Exhausted"],
    moodEmojis: {
      Energized: "⚡",
      Ready: "💪",
      Neutral: "😐",
      "Low Energy": "🔋",
      Exhausted: "😴",
    },
  },
};

export const StudySession: Story = {
  args: {
    ...Default.args,
    title: "Let's begin your study session",
    subtitle: "How motivated are you feeling?",
    buttonText: "Start Studying",
    moodOptions: ["Motivated", "Focused", "Neutral", "Distracted", "Tired"],
    moodEmojis: {
      Motivated: "🚀",
      Focused: "🎯",
      Neutral: "😐",
      Distracted: "😵‍💫",
      Tired: "😴",
    },
  },
};

export const MinimalOptions: Story = {
  args: {
    ...Default.args,
    moodOptions: ["Good", "Okay", "Not Great"],
    moodEmojis: {
      Good: "👍",
      Okay: "👌",
      "Not Great": "👎",
    },
  },
};

export const ExtendedOptions: Story = {
  args: {
    ...Default.args,
    moodOptions: [
      "Excellent",
      "Happy",
      "Good",
      "Neutral",
      "Tired",
      "Stressed",
      "Unwell",
      "Down",
    ],
    moodEmojis: {
      Excellent: "🌟",
      Happy: "😊",
      Good: "🙂",
      Neutral: "😐",
      Tired: "😴",
      Stressed: "😰",
      Unwell: "🤒",
      Down: "☁️",
    },
  },
};
