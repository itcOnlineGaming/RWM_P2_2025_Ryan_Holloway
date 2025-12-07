import type { Meta, StoryObj } from "@storybook/svelte";
import MidSessionCheckIn from "../packages/emotion-tracker/dist/MidSessionCheckIn.svelte";

const meta = {
  title: "Components/MidSessionCheckIn",
  component: MidSessionCheckIn,
  tags: ["autodocs"],
  argTypes: {
    title: {
      control: "text",
      description: "Main heading text for the check-in modal",
    },
    subtitle: {
      control: "text",
      description: "Subtitle text providing additional context",
    },
    buttonText: {
      control: "text",
      description: "Text displayed on the save button",
    },
    distractions: {
      control: "object",
      description: "Array of distraction options to display",
    },
    distractionEmojis: {
      control: "object",
      description: "Mapping of distraction names to emoji icons",
    },
    selectedDistractions: {
      control: "object",
      description: "Currently selected distractions (controlled component)",
    },
    show: {
      control: "boolean",
      description: "Whether the modal is visible",
    },
    disabled: {
      control: "boolean",
      description: "Whether the component is disabled",
    },
  },
} satisfies Meta<MidSessionCheckIn>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "Quick distraction check-in",
    subtitle: "Let us know what is pulling your attention",
    buttonText: "Save check-in",
    distractions: [
      "Phone",
      "Social media",
      "Noise",
      "People",
      "No distractions",
    ],
    distractionEmojis: {
      Phone: "📱",
      "Social media": "💬",
      Noise: "🔊",
      People: "👥",
      "No distractions": "✅",
    },
    selectedDistractions: [],
    show: true,
    disabled: false,
  },
};

export const WithSelections: Story = {
  args: {
    ...Default.args,
    selectedDistractions: ["Phone", "Noise"],
  },
};

export const NoDistractions: Story = {
  args: {
    ...Default.args,
    selectedDistractions: ["No distractions"],
  },
};

export const Disabled: Story = {
  args: {
    ...Default.args,
    selectedDistractions: ["Phone"],
    disabled: true,
  },
};

export const WorkContext: Story = {
  args: {
    ...Default.args,
    title: "What's distracting you?",
    subtitle: "Help us understand your work environment",
    distractions: ["Email", "Slack", "Meetings", "Phone", "No distractions"],
    distractionEmojis: {
      Email: "📧",
      Slack: "💬",
      Meetings: "👥",
      Phone: "📱",
      "No distractions": "✅",
    },
  },
};

export const StudyContext: Story = {
  args: {
    ...Default.args,
    title: "Quick focus check",
    subtitle: "What pulled your attention away?",
    buttonText: "Log it",
    distractions: [
      "Phone",
      "Social media",
      "Roommates",
      "Hunger",
      "Tired",
      "Nothing",
    ],
    distractionEmojis: {
      Phone: "📱",
      "Social media": "💬",
      Roommates: "👥",
      Hunger: "🍕",
      Tired: "😴",
      Nothing: "✅",
    },
  },
};

export const MinimalOptions: Story = {
  args: {
    ...Default.args,
    distractions: ["Distracted", "Focused"],
    distractionEmojis: {
      Distracted: "😵‍💫",
      Focused: "🎯",
    },
  },
};

export const ExtendedOptions: Story = {
  args: {
    ...Default.args,
    distractions: [
      "Phone",
      "Email",
      "Social media",
      "Slack/Teams",
      "Meetings",
      "Noise",
      "People",
      "Hunger",
      "Tired",
      "No distractions",
    ],
    distractionEmojis: {
      Phone: "📱",
      Email: "📧",
      "Social media": "💬",
      "Slack/Teams": "💼",
      Meetings: "👥",
      Noise: "🔊",
      People: "🗣️",
      Hunger: "🍕",
      Tired: "😴",
      "No distractions": "✅",
    },
  },
};

export const CustomText: Story = {
  args: {
    ...Default.args,
    title: "Interruption log",
    subtitle: "Track what breaks your flow",
    buttonText: "Record",
  },
};

export const Hidden: Story = {
  args: {
    ...Default.args,
    show: false,
  },
};
