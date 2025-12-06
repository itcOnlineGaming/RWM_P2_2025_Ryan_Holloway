# RWM_P2_2025_Ryan_Holloway

A monorepo containing a reusable Svelte emotion tracker component and a demo application. This project uses Vitest for unit/integration testing and Playwright for end-to-end testing, with automated CI/CD via GitHub Actions.

## Project Structure

```
├── packages/emotion-tracker/      # Core Svelte component package
│   ├── src/
│   │   ├── __tests__/            # Vitest unit tests
│   │   └── *.svelte               # Svelte components
│   ├── vite.config.ts            # Vitest configuration
│   └── package.json
├── demo/                          # Demo SvelteKit application
│   ├── src/routes/               # SvelteKit routes
│   ├── tests/e2e/                # Playwright E2E tests
│   ├── playwright.config.ts       # Playwright configuration
│   └── package.json
├── .github/workflows/
│   ├── tests-vitest.yml          # Vitest CI workflow
│   └── tests-playwright.yml       # Playwright CI workflow
└── package.json                   # Root workspace configuration
```

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

## Development Workflow

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
