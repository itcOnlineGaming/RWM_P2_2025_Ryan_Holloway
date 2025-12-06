import type { Meta, StoryObj } from "@storybook/svelte";
import SessionTimeline from "../packages/emotion-tracker/dist/SessionTimeline.svelte";

type StoryProps = {
  step1Title?: string;
  step1Subtitle?: string;
  step1ButtonText?: string;
  step2Title?: string;
  step2Subtitle?: string;
  step2CheckInIntervalSeconds?: number;
  step2EnableAutoCheckIns?: boolean;
  step2Distractions?: string[];
  step3Title?: string;
  step3Subtitle?: string;
  step3ButtonText?: string;
  step3RatingFactors?: string[];
  moodOptions?: string[];
  moodEmojis?: Record<string, string>;
  moodColors?: Record<string, string>;
  distractionEmojis?: Record<string, string>;
};

const meta: Meta<StoryProps> = {
  title: "Components/SessionTimeline",
  component: SessionTimeline as any,
  tags: ["autodocs"],
  argTypes: {
    step1Title: {
      control: "text",
      description: "Title for the pre-session mood selection",
    },
    step1Subtitle: {
      control: "text",
      description: "Subtitle for the pre-session mood selection",
    },
    step1ButtonText: {
      control: "text",
      description: "Text for the button to start the session",
    },
    step2Title: {
      control: "text",
      description: "Title for the mid-session check-in",
    },
    step2Subtitle: {
      control: "text",
      description: "Subtitle for the mid-session check-in",
    },
    step2CheckInIntervalSeconds: {
      control: "number",
      description: "Interval in seconds between auto check-ins",
    },
    step2EnableAutoCheckIns: {
      control: "boolean",
      description: "Enable automatic check-ins at regular intervals",
    },
    step2Distractions: {
      control: "object",
      description: "List of distraction options for check-ins",
    },
    step3Title: {
      control: "text",
      description: "Title for the post-session rating",
    },
    step3Subtitle: {
      control: "text",
      description: "Subtitle for the post-session rating",
    },
    step3ButtonText: {
      control: "text",
      description: "Text for the button to complete the session",
    },
    step3RatingFactors: {
      control: "object",
      description: "Performance factors to rate at the end of session",
    },
    moodOptions: {
      control: "object",
      description: "Available mood options for selection",
    },
    moodEmojis: {
      control: "object",
      description: "Emoji representations for each mood",
    },
    moodColors: {
      control: "object",
      description: "Background colors for each mood",
    },
    distractionEmojis: {
      control: "object",
      description: "Emoji representations for each distraction type",
    },
  },
};

export default meta;
type Story = StoryObj<StoryProps>;

const defaultMoodEmojis = {
  Happy: "😊",
  Neutral: "😐",
  Tired: "😴",
  Unwell: "🤒",
  Down: "☁️",
};

const defaultMoodColors = {
  Happy: "#fff7cc",
  Neutral: "#e0f2fe",
  Tired: "#fee2e2",
  Unwell: "#fee2e2",
  Down: "#fee2e2",
};

const defaultDistractionEmojis = {
  Phone: "📱",
  "Social media": "💬",
  Noise: "🔊",
  People: "👥",
  "No distractions": "✅",
};

export const Default: Story = {
  args: {
    step1Title: "How are you feeling before starting?",
    step1Subtitle: "Let us know your current mood",
    step1ButtonText: "Start Session",
    step2Title: "Quick distraction check-in",
    step2Subtitle: "Let us know what is pulling your attention",
    step2CheckInIntervalSeconds: 60,
    step2EnableAutoCheckIns: false,
    step2Distractions: [
      "Phone",
      "Social media",
      "Noise",
      "People",
      "No distractions",
    ],
    step3Title: "How did your session go?",
    step3Subtitle: "Rate your experience",
    step3ButtonText: "Complete Session",
    step3RatingFactors: ["Productivity", "Focus", "Understanding", "Energy"],
    moodOptions: ["Happy", "Neutral", "Tired", "Unwell", "Down"],
    moodEmojis: defaultMoodEmojis,
    moodColors: defaultMoodColors,
    distractionEmojis: defaultDistractionEmojis,
  },
};

export const WithAutoCheckIns: Story = {
  args: {
    ...Default.args,
    step2EnableAutoCheckIns: true,
    step2CheckInIntervalSeconds: 30,
  },
};

export const StudySession: Story = {
  args: {
    step1Title: "How focused are you right now?",
    step1Subtitle: "Tell us your starting mood for this study session",
    step1ButtonText: "Begin Study",
    step2Title: "Study Check-in",
    step2Subtitle: "What might be distracting you?",
    step2CheckInIntervalSeconds: 120,
    step2EnableAutoCheckIns: true,
    step2Distractions: [
      "Phone",
      "Daydreaming",
      "Hunger",
      "Discomfort",
      "No distractions",
    ],
    step3Title: "How was your study session?",
    step3Subtitle: "Rate your performance",
    step3ButtonText: "Save Study Stats",
    step3RatingFactors: ["Understanding", "Retention", "Focus", "Progress"],
    moodOptions: ["Confident", "Curious", "Confused", "Tired", "Motivated"],
    moodEmojis: {
      Confident: "💪",
      Curious: "🤔",
      Confused: "😕",
      Tired: "😴",
      Motivated: "🚀",
    },
    moodColors: {
      Confident: "#dbeafe",
      Curious: "#fef3c7",
      Confused: "#fee2e2",
      Tired: "#f3e8ff",
      Motivated: "#dcfce7",
    },
    distractionEmojis: {
      Phone: "📱",
      Daydreaming: "☁️",
      Hunger: "🍔",
      Discomfort: "😕",
      "No distractions": "✅",
    },
  },
};

export const WorkSession: Story = {
  args: {
    step1Title: "What is your energy level?",
    step1Subtitle: "Let's start the work session",
    step1ButtonText: "Start Work",
    step2Title: "Work Interruption Check",
    step2Subtitle: "Any interruptions?",
    step2CheckInIntervalSeconds: 900, // 15 minutes
    step2EnableAutoCheckIns: true,
    step2Distractions: [
      "Meetings",
      "Emails",
      "Slack",
      "Environmental Noise",
      "None",
    ],
    step3Title: "Work Session Summary",
    step3Subtitle: "How productive was this session?",
    step3ButtonText: "Log Session",
    step3RatingFactors: [
      "Tasks Completed",
      "Code Quality",
      "Focus Time",
      "Collaboration",
    ],
    moodOptions: ["Energized", "Focused", "Neutral", "Tired", "Stressed"],
    moodEmojis: {
      Energized: "⚡",
      Focused: "🎯",
      Neutral: "😐",
      Tired: "😴",
      Stressed: "😰",
    },
    moodColors: {
      Energized: "#fef08a",
      Focused: "#dbeafe",
      Neutral: "#e5e7eb",
      Tired: "#f3e8ff",
      Stressed: "#fee2e2",
    },
    distractionEmojis: {
      Meetings: "📞",
      Emails: "📧",
      Slack: "💬",
      "Environmental Noise": "🔊",
      None: "✅",
    },
  },
};

export const MinimalCustomization: Story = {
  args: {
    step1Title: "Start",
    step1Subtitle: "Ready?",
    step1ButtonText: "Go",
    step2Title: "Check",
    step2Subtitle: "Everything okay?",
    step2CheckInIntervalSeconds: 60,
    step2EnableAutoCheckIns: false,
    step2Distractions: ["Yes", "No"],
    step3Title: "Done",
    step3Subtitle: "Rate it",
    step3ButtonText: "Finish",
    step3RatingFactors: ["Quality", "Speed"],
    moodOptions: ["Good", "Bad"],
    moodEmojis: {
      Good: "👍",
      Bad: "👎",
    },
    moodColors: {
      Good: "#dcfce7",
      Bad: "#fee2e2",
    },
    distractionEmojis: {
      Yes: "⚠️",
      No: "✅",
    },
  },
};

export const ExtendedFactors: Story = {
  args: {
    ...Default.args,
    step3RatingFactors: [
      "Productivity",
      "Focus",
      "Understanding",
      "Energy",
      "Enjoyment",
      "Motivation",
      "Clarity",
      "Engagement",
    ],
  },
};
