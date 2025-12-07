# RWM_P2_2025_Ryan_Holloway

A monorepo containing reusable Svelte emotion tracker components and a demo application. This project provides modular components for tracking emotional states and productivity metrics during work/study sessions.

## Features

- **Modular Component Architecture** - Three independent, reusable components
- **TypeScript Support** - Fully typed props, events, and interfaces
- **Comprehensive Testing** - 153 unit tests + 133 E2E tests
- **Storybook Documentation** - 28+ interactive stories showcasing component variations
- **Automated CI/CD** - GitHub Actions for continuous testing and validation

## Components

### StartSession

Pre-session mood selection component for capturing initial emotional state.

**Features:**

- Customizable mood options and emojis
- Event-driven architecture
- Disabled state support
- 20 unit tests, 8 Storybook stories

### MidSessionCheckIn

Modal component for tracking mid-session distractions.

**Features:**

- Multi-select distraction tracking
- Customizable distraction options and emojis
- Keyboard support (Escape to close, Enter to save)
- Event dispatchers for save/close actions
- 31 unit tests, 10 Storybook stories

### EndSession

Post-session rating and completion component.

- Mood selection with emojis
- 1-10 dot scale rating system for multiple factors
- Validation (requires mood and all ratings)
- Event dispatching with complete session data
- 45 unit tests, 10 Storybook stories

### SessionTimeline

Orchestrates the complete 3-step session workflow.

**Features:**

- Step 1: Pre-session mood selection (uses StartSession)
- Step 2: Active session with optional auto check-ins (uses MidSessionCheckIn)
- Step 3: Post-session rating (uses EndSession)
- Customizable props for all steps
- Slot support for custom step 2 content

## Project Structure

```
├── packages/emotion-tracker/      # Core Svelte component package
│   ├── src/
│   │   ├── StartSession.svelte   # Pre-session mood component
│   │   ├── MidSessionCheckIn.svelte # Mid-session distraction modal
│   │   ├── EndSession.svelte     # Post-session rating component
│   │   ├── SessionTimeline.svelte # Complete workflow orchestrator
│   │   ├── types.ts              # TypeScript interfaces
│   │   ├── analytics.ts          # Session analytics utilities
│   │   ├── events.ts             # Event storage and persistence
│   │   └── __tests__/            # 153 Vitest unit tests
│   ├── vite.config.ts            # Vitest configuration
│   └── package.json
├── demo/                          # Demo SvelteKit application
│   ├── src/routes/
│   │   ├── +page.svelte          # Login + menu
│   │   ├── full-demo/            # Complete SessionTimeline workflow
│   │   ├── start-session/        # StartSession component showcase
│   │   ├── mid-session/          # MidSessionCheckIn component showcase
│   │   ├── end-session/          # EndSession component showcase
│   │   └── session-timeline/     # SessionTimeline component demo
│   ├── tests/e2e/                # 141 Playwright E2E tests
│   ├── playwright.config.ts       # Playwright configuration
│   └── package.json
├── .storybook/                    # Storybook configuration
│   ├── StartSession.stories.ts   # 8 StartSession stories
│   ├── MidSessionCheckIn.stories.ts # 10 MidSessionCheckIn stories
│   ├── EndSession.stories.ts     # 10 EndSession stories
│   └── SessionTimeline.stories.ts # 10 SessionTimeline stories
├── .github/workflows/
│   ├── tests-vitest.yml          # Vitest CI workflow
│   └── tests-playwright.yml       # Playwright CI workflow
└── package.json                   # Root workspace configuration
```

## Quick Start

### Installation

```bash
npm install
```

### Run Demo App

```bash
npm run build
npm run dev
```

Visit `http://localhost:5173` and explore:

- **Full Demo** - Complete session workflow with user-specific storage
- **Component Showcases** - Individual component demonstrations
- **Interactive Testing** - Try all features in real-time

### View Storybook

```bash
npm run storybook
```

Visit `http://localhost:6006` to explore all 28+ component stories.

## Setup & Installation

### Prerequisites

- Node.js 18.x or 20.x
- npm (comes with Node.js)

### Install Dependencies

```bash
npm install
```

This installs dependencies for both the root workspace and all workspaces (emotion-tracker package and demo app).

## Local Testing

### Unit & Integration Tests (Vitest)

Run Vitest tests for the emotion-tracker package:

```bash
npm run test:vitest
```

Or from the emotion-tracker workspace directly:

```bash
cd packages/emotion-tracker
npm run test
```

**Watch mode** (re-runs on file changes):

```bash
cd packages/emotion-tracker
npm run test -- --watch
```

### End-to-End Tests (Playwright)

Run all Playwright tests in headed mode (visible browser):

```bash
npm run test:e2e:headed
```

Or from the demo workspace:

```bash
cd demo
npm run test:e2e
```

**Additional options:**

- **Headed mode** (browser visible):

  ```bash
  npm run test:e2e:headed
  ```

- **Interactive UI mode** (test explorer):

  ```bash
  npm run test:e2e:ui
  ```

- **Debug mode** (step through tests):
  ```bash
  npm run test:e2e:debug
  ```

### Run All Tests Together

```bash
npm run test:all
```

This runs both Vitest and Playwright tests in sequence.

## GitHub Actions CI

Automated testing runs on every pull request targeting `main` and on every push to `main`.

### CI Workflows

Two GitHub Actions workflows are configured:

1. **Vitest Unit & Integration Tests** (`.github/workflows/tests-vitest.yml`)

   - Runs on Node 18.x and 20.x
   - Builds the emotion-tracker package
   - Runs Vitest with CI mode enabled

2. **Playwright E2E Tests** (`.github/workflows/tests-playwright.yml`)
   - Runs on Node 18.x and 20.x
   - Builds the emotion-tracker package
   - Installs Playwright browsers and system dependencies
   - Runs E2E tests with 1 worker for stability
   - Uploads test artifacts (reports, traces, screenshots) on failure

### Viewing CI Results

#### Via GitHub PR

1. Navigate to your pull request on GitHub
2. Scroll to the bottom to see status checks
3. Click "Details" next to any failed check to view full logs

#### Via GitHub Actions

1. Go to [GitHub Actions](https://github.com/itcOnlineGaming/RWM_P2_2025_Ryan_Holloway/actions)
2. Select the workflow (Vitest or Playwright)
3. Click the run to view detailed logs and artifacts

#### View Artifacts

After a Playwright test run:

1. Go to Actions → select the failed run
2. Scroll to "Artifacts" section
3. Download:
   - `playwright-report-node-*` — HTML test report with screenshots/videos
   - `playwright-test-results-node-*` — Test traces and failure data

### CI Status Checks

- ✅ All tests pass → PR can be merged
- ❌ Tests fail → Fix failures before merging

Both Node 18.x and 20.x must pass.

## Running the Demo App

Start the demo application locally:

```bash
npm run build
npm run dev
```

Or build and dev in one command:

```bash
npm run build && npm run dev
```

The demo app will be available at `http://localhost:5173` by default.

To preview the production build:

```bash
npm run build
npm run preview
```

## Storybook Component Library

Storybook is used to develop, test, and document UI components in isolation.

### Running Storybook

Start Storybook locally:

```bash
npm run storybook
```

Storybook will open at `http://localhost:6006` by default.

### Available Component Stories

All components have comprehensive Storybook documentation with multiple variations.

#### 1. **StartSession** (`.storybook/StartSession.stories.ts`)

- **Component**: Pre-session mood selection
- **Stories** (8):
  - `Default` — Standard mood options
  - `StudySession` — Study-specific configuration
  - `WorkSession` — Work environment moods
  - `ExerciseSession` — Fitness-related moods
  - `SimpleMoods` — Minimal 3-option setup
  - `Disabled` — Non-interactive state
  - `PreSelected` — With default mood
  - `Interactive` — Live event demo

#### 2. **MidSessionCheckIn** (`.storybook/MidSessionCheckIn.stories.ts`)

- **Component**: Mid-session distraction tracking modal
- **Stories** (10):
  - `Closed` — Modal in closed state
  - `Open` — Interactive modal
  - `StudyDistractions` — Study-specific distractions
  - `WorkDistractions` — Work environment distractions
  - `MinimalDistractions` — Simplified options
  - `ManyDistractions` — Extended distraction list
  - `PreSelected` — With defaults
  - `Disabled` — Non-interactive state
  - `NoKeyboardClose` — Keyboard shortcuts disabled
  - `Interactive` — Live event demo

#### 3. **EndSession** (`.storybook/EndSession.stories.ts`)

- **Component**: Post-session rating and completion
- **Stories** (10):
  - `Default` — Standard configuration
  - `StudySession` — Study-specific factors
  - `WorkSession` — Work performance metrics
  - `ExerciseSession` — Fitness ratings
  - `MinimalFactors` — Simplified 2-factor rating
  - `ManyFactors` — Comprehensive 8-factor rating
  - `SimpleMoods` — Reduced mood options
  - `Disabled` — Non-interactive state
  - `PreSelected` — With default values
  - `Interactive` — Live event demo

#### 4. **SessionTimeline** (`.storybook/SessionTimeline.stories.ts`)

- **Component**: Full 3-step session workflow
- **Stories** (10):
  - `Default` — Standard session flow
  - `WithAutoCheckIns` — Automatic check-ins enabled
  - `StudySession` — Study-specific configuration
  - `WorkSession` — Work-specific configuration
  - `MinimalCustomization` — Simplified version
  - `ExtendedFactors` — Many performance factors
  - `CustomEmotions` — Custom mood options
  - `DifferentCheckInInterval` — Varied check-in timing
  - `WithSlotContent` — Custom step 2 content
  - Interactive — Full workflow demo

## Component API

### StartSession

```svelte
<StartSession
  title="How are you feeling?"
  subtitle="Select your current mood"
  buttonText="Start"
  moodOptions={['Happy', 'Neutral', 'Tired']}
  moodEmojis={{ Happy: '😊', Neutral: '😐', Tired: '😴' }}
  bind:selectedMood={mood}
  disabled={false}
  on:moodSelect={(e) => console.log(e.detail.mood)}
  on:start={(e) => console.log(e.detail.startMood)}
/>
```

**Props:**

- `title?: string` - Main heading text
- `subtitle?: string` - Subtitle below heading
- `buttonText?: string` - Start button text
- `moodOptions?: string[]` - Array of mood options
- `moodEmojis?: Record<string, string>` - Mood-to-emoji mapping
- `selectedMood?: string | null` - Bindable selected mood
- `disabled?: boolean` - Disable all interactions

**Events:**

- `moodSelect` - Fires when mood is selected: `{ mood: string }`
- `start` - Fires when start button clicked: `{ startMood: string }`

### MidSessionCheckIn

```svelte
<MidSessionCheckIn
  title="Quick check-in"
  subtitle="What's distracting you?"
  buttonText="Save"
  distractions={['Phone', 'Noise', 'People']}
  distractionEmojis={{ Phone: '📱', Noise: '🔊', People: '👥' }}
  bind:selectedDistractions={selected}
  bind:show={isOpen}
  disabled={false}
  on:save={(e) => console.log(e.detail.distractions)}
  on:close={() => console.log('Modal closed')}
/>
```

**Props:**

- `title?: string` - Modal heading
- `subtitle?: string` - Modal subtitle
- `buttonText?: string` - Save button text
- `distractions?: string[]` - Array of distraction options
- `distractionEmojis?: Record<string, string>` - Distraction-to-emoji mapping
- `selectedDistractions?: string[]` - Bindable selected distractions
- `show?: boolean` - Bindable modal visibility
- `disabled?: boolean` - Disable all interactions

**Events:**

- `save` - Fires when save clicked: `{ distractions: string[] }`
- `close` - Fires when modal closes (no payload)

### EndSession

```svelte
<EndSession
  title="How did it go?"
  subtitle="Rate your session"
  buttonText="Complete"
  moodOptions={['Happy', 'Neutral', 'Tired']}
  moodEmojis={{ Happy: '😊', Neutral: '😐', Tired: '😴' }}
  ratingFactors={['Productivity', 'Focus', 'Energy']}
  bind:selectedMood={mood}
  bind:ratings={ratings}
  disabled={false}
  on:sessionComplete={(e) => console.log(e.detail)}
/>
```

**Props:**

- `title?: string` - Main heading
- `subtitle?: string` - Subtitle text
- `buttonText?: string` - Complete button text
- `moodOptions?: string[]` - Array of mood options
- `moodEmojis?: Record<string, string>` - Mood-to-emoji mapping
- `ratingFactors?: string[]` - Factors to rate (1-10 scale)
- `selectedMood?: string` - Bindable selected mood
- `ratings?: Record<string, number>` - Bindable ratings object
- `disabled?: boolean` - Disable all interactions

**Events:**

- `sessionComplete` - Fires when complete clicked: `{ mood: string, ratings: Record<string, number> }`

### SessionTimeline

```svelte
<SessionTimeline
  step1Title="How are you feeling?"
  step1ButtonText="Start Session"
  step2Title="Quick check-in"
  step2EnableAutoCheckIns={true}
  step2CheckInIntervalSeconds={60}
  step3Title="How did it go?"
  step3RatingFactors={['Productivity', 'Focus', 'Understanding']}
  moodOptions={['Happy', 'Neutral', 'Tired']}
  on:sessionStart={(e) => console.log(e.detail.startMood)}
  on:checkIn={(e) => console.log(e.detail.distractions)}
  on:sessionEnd={() => console.log('Session ending')}
  on:sessionComplete={(e) => console.log(e.detail)}
>
  <div slot="default" let:elapsedSeconds>
    Custom step 2 content here
    Elapsed: {elapsedSeconds}s
  </div>
</SessionTimeline>
```

**Props:**

- Step 1: `step1Title`, `step1Subtitle`, `step1ButtonText`
- Step 2: `step2Title`, `step2Subtitle`, `step2EnableAutoCheckIns`, `step2CheckInIntervalSeconds`, `step2Distractions`
- Step 3: `step3Title`, `step3Subtitle`, `step3ButtonText`, `step3RatingFactors`
- Shared: `moodOptions`, `moodEmojis`, `distractionEmojis`

**Events:**

- `sessionStart` - Step 1 complete: `{ startMood: string }`
- `checkIn` - Mid-session check-in saved: `{ distractions: string[] }`
- `sessionEnd` - Step 2 ending (no payload)
- `sessionComplete` - Step 3 complete: `{ startMood: string, distractions: string[], checkInCount: number, endMood: string, ratings: Record<string, number> }`

**Slots:**

- `default` - Custom content for step 2, receives `{ elapsedSeconds: number }`

## Testing

### Test Coverage

- **Unit Tests**: 153 tests across 6 test suites (Vitest)

  - StartSession: 20 tests
  - MidSessionCheckIn: 31 tests
  - EndSession: 45 tests
  - SessionTimeline: 23 tests
  - Analytics: 12 tests
  - Events: 22 tests

- **E2E Tests**: 141 Playwright tests
  - Login flow
  - Session workflow
  - Component showcases
  - Session timeline routes

### Available Component Stories

All components have comprehensive Storybook documentation with multiple variations.

#### 1. **EmotionTracker** (`.storybook/EmotionTracker.stories.ts`) [LEGACY]

- **Component**: Main emotion tracking component
- **Stories**:
  - `Default` — Standard configuration with all features
  - `DarkTheme` — Dark theme variant
  - `CustomEmotions` — Custom emotion options
  - `MinimalFactors` — Simplified rating factors
  - `NoMidSessionChecks` — Without mid-session features
  - `WorkSession` — Configured for work scenarios
  - `StudySession` — Configured for study scenarios

## Development Workflow

### Version History

- **v0.3.3** - EndSession component extraction
- **v0.3.2** - MidSessionCheckIn component extraction
- **v0.3.1** - StartSession component extraction
- **v0.3.0** - Initial modular architecture

### Creating a New Component

1. Create feature branch: `git checkout -b feature-name`
2. Develop component in `packages/emotion-tracker/src/`
3. Add comprehensive unit tests in `__tests__/`
4. Create Storybook stories in `.storybook/`
5. Export from `index.ts`
6. Update types in `types.ts`
7. Run tests: `npm run test:all`
8. Commit with format: `[Trello Card X]: Description`
9. Merge to main with `--no-ff`
10. Tag version: `git tag v0.x.x`
11. Push: `git push origin main --tags`

### Before Creating a PR

1. Run tests locally to catch issues early:

   ```bash
   npm run test:vitest    # Unit tests
   npm run test:e2e       # E2E tests
   ```

2. Or run all at once:

   ```bash
   npm run test:all
   ```

3. Commit and push your changes

4. GitHub Actions will automatically run CI checks on the PR

### Building for Production

Build the emotion-tracker package:

```bash
npm run build --workspace=packages/emotion-tracker
```

Build the demo app:

```bash
npm run build --workspace=demo
```

Or build both:

```bash
npm run build
```

## Dependencies

### Vitest (Unit Testing)

- `vitest@^1.2.0` — Fast unit test runner
- `@testing-library/svelte@^5.2.9` — Svelte component testing utilities
- `happy-dom@^14.1.0` — Lightweight DOM environment for testing

### Playwright (E2E Testing)

- `@playwright/test@^1.40.0` — Browser automation framework

## Troubleshooting

### Tests fail locally but pass in CI (or vice versa)

- Ensure you're using the same Node version (18.x or 20.x)
- Run `npm ci` instead of `npm install` to match the lock file exactly
- Clear node_modules: `rm -rf node_modules && npm ci`

### Playwright tests can't find the emotion-tracker package

- Ensure the package is built: `npm run build --workspace=packages/emotion-tracker`
- This is done automatically in CI, but may be needed locally if you modify the package

### Cache issues in CI

- GitHub Actions caches dependencies based on `package-lock.json`
- If you update `package.json`, run `npm install` locally and commit the updated `package-lock.json`
