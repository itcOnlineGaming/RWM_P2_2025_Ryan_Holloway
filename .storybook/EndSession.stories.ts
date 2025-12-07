import type { Meta, StoryObj } from "@storybook/svelte";
import EndSession from "../packages/emotion-tracker/dist/EndSession.svelte";

const meta = {
  title: "Components/EndSession",
  component: EndSession,
  tags: ["autodocs"],
  argTypes: {
    title: {
      control: "text",
      description: "Main heading text",
      table: {
        type: { summary: "string" },
        defaultValue: { summary: "How did your session go?" },
      },
    },
    subtitle: {
      control: "text",
      description: "Subtitle text below the heading",
      table: {
        type: { summary: "string" },
        defaultValue: { summary: "Rate your experience" },
      },
    },
    buttonText: {
      control: "text",
      description: "Text displayed on the complete button",
      table: {
        type: { summary: "string" },
        defaultValue: { summary: "Complete Session" },
      },
    },
    moodOptions: {
      control: "object",
      description: "Array of mood options to display",
      table: {
        type: { summary: "string[]" },
        defaultValue: {
          summary: "['Happy', 'Neutral', 'Tired', 'Unwell', 'Down']",
        },
      },
    },
    moodEmojis: {
      control: "object",
      description: "Mapping of mood options to emoji icons",
      table: {
        type: { summary: "Record<string, string>" },
        defaultValue: { summary: "{'Happy': '😊', ...}" },
      },
    },
    ratingFactors: {
      control: "object",
      description: "Array of factors to rate (1-10 scale)",
      table: {
        type: { summary: "string[]" },
        defaultValue: {
          summary: "['Productivity', 'Focus', 'Understanding', 'Energy']",
        },
      },
    },
    disabled: {
      control: "boolean",
      description: "Whether the component is disabled",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "false" },
      },
    },
  },
} satisfies Meta<EndSession>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story:
          "Default end-session component with standard mood options and rating factors.",
      },
    },
  },
};

export const StudySession: Story = {
  args: {
    title: "Study Session Complete!",
    subtitle: "How effective was your study time?",
    buttonText: "Finish",
    ratingFactors: ["Productivity", "Focus", "Understanding", "Energy"],
  },
  parameters: {
    docs: {
      description: {
        story: "Configured for a study session with relevant rating factors.",
      },
    },
  },
};

export const WorkSession: Story = {
  args: {
    title: "Work Session Complete",
    subtitle: "Rate your work performance",
    buttonText: "Submit",
    moodOptions: ["Energized", "Focused", "Neutral", "Tired", "Stressed"],
    moodEmojis: {
      Energized: "⚡",
      Focused: "🎯",
      Neutral: "😐",
      Tired: "😴",
      Stressed: "😰",
    },
    ratingFactors: ["Productivity", "Quality", "Collaboration", "Satisfaction"],
  },
  parameters: {
    docs: {
      description: {
        story:
          "Configured for a work session with custom moods and work-specific rating factors.",
      },
    },
  },
};

export const ExerciseSession: Story = {
  args: {
    title: "Workout Complete!",
    subtitle: "How was your exercise session?",
    buttonText: "Complete",
    moodOptions: ["Pumped", "Good", "Okay", "Tired", "Sore"],
    moodEmojis: {
      Pumped: "💪",
      Good: "😊",
      Okay: "😐",
      Tired: "😴",
      Sore: "🤕",
    },
    ratingFactors: ["Intensity", "Form", "Energy", "Enjoyment"],
  },
  parameters: {
    docs: {
      description: {
        story:
          "Configured for an exercise session with fitness-related moods and metrics.",
      },
    },
  },
};

export const MinimalFactors: Story = {
  args: {
    title: "Quick Check-Out",
    subtitle: "Just rate these two things",
    ratingFactors: ["Quality", "Speed"],
  },
  parameters: {
    docs: {
      description: {
        story: "Minimal configuration with only two rating factors.",
      },
    },
  },
};

export const ManyFactors: Story = {
  args: {
    title: "Comprehensive Review",
    subtitle: "Please rate all aspects",
    ratingFactors: [
      "Productivity",
      "Focus",
      "Understanding",
      "Energy",
      "Motivation",
      "Organization",
      "Time Management",
      "Quality",
    ],
  },
  parameters: {
    docs: {
      description: {
        story:
          "Extended configuration with many rating factors for detailed feedback.",
      },
    },
  },
};

export const SimpleMoods: Story = {
  args: {
    title: "How are you feeling?",
    moodOptions: ["Good", "Okay", "Bad"],
    moodEmojis: {
      Good: "😊",
      Okay: "😐",
      Bad: "😞",
    },
    ratingFactors: ["Overall Experience"],
  },
  parameters: {
    docs: {
      description: {
        story: "Simplified mood selection with just three options.",
      },
    },
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    selectedMood: "Happy",
  },
  parameters: {
    docs: {
      description: {
        story: "Disabled state - all interactions are blocked.",
      },
    },
  },
};

export const PreSelected: Story = {
  args: {
    selectedMood: "Neutral",
    ratings: {
      Productivity: 7,
      Focus: 6,
      Understanding: 8,
      Energy: 5,
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          "Component with pre-selected mood and ratings (useful for edit mode).",
      },
    },
  },
};

export const Interactive: Story = {
  args: {},
  render: (args) => ({
    Component: EndSession,
    props: args,
    on: {
      sessionComplete: (event: CustomEvent) => {
        alert(
          `Session Complete!\nMood: ${
            event.detail.mood
          }\nRatings: ${JSON.stringify(event.detail.ratings, null, 2)}`
        );
      },
    },
  }),
  parameters: {
    docs: {
      description: {
        story:
          "Interactive demo - complete the session to see the event data in an alert.",
      },
    },
  },
};
