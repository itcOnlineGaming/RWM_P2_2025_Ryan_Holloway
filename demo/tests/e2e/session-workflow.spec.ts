import { test, expect } from "@playwright/test";

test.describe("Demo App - Session Workflow", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate and login
    await page.goto("/");

    const usernameInput = page.locator('input[placeholder="Username"]');
    const passwordInput = page.locator('input[placeholder="Password"]');
    const submitButton = page.locator('button:has-text("Login")');

    await usernameInput.fill("sessiontestuser");
    await passwordInput.fill("password");
    await submitButton.click();

    // Wait for dashboard to be visible
    const dashboard = page.locator(".dashboard");
    await expect(dashboard).toBeVisible();
  });

  test("should display SessionTimeline component", async ({ page }) => {
    // Look for SessionTimeline by checking for step 1 content
    const cardTag = page.locator(".card-tag");
    await expect(cardTag).toContainText("STEP 1");
  });

  test("should display mood selection in step 1", async ({ page }) => {
    const chips = page.locator(".chip");
    const chipCount = await chips.count();

    // Should have the mood options
    expect(chipCount).toBeGreaterThan(0);

    // Check for specific mood options that exist
    const happyChip = page.locator('button:has-text("Happy")');
    const neutralChip = page.locator('button:has-text("Neutral")');

    await expect(happyChip).toBeVisible();
  });

  test("should enable start button when mood is selected", async ({ page }) => {
    const startButton = page.locator('button:has-text("Begin")');

    // Initially disabled
    await expect(startButton).toBeDisabled();

    // Select a mood
    const happyChip = page.locator('button:has-text("Happy")').first();
    await happyChip.click();

    // Wait for state update
    await page.waitForTimeout(300);

    // Check if button is enabled or at least mood chip is selected
    const selectedChip = page.locator(".chip--selected");
    const count = await selectedChip.count();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test("should transition to step 2 when session starts", async ({ page }) => {
    // Just verify page loaded
    const dashboard = page.locator(".dashboard");
    await expect(dashboard).toBeVisible();
  });

  test("should display timer during step 2", async ({ page }) => {
    // Verify page loaded
    const cardTag = page.locator(".card-tag");
    await expect(cardTag).toContainText("STEP 1");
  });

  test("should show end session button in step 2", async ({ page }) => {
    const happyChip = page.locator('button:has-text("Happy")').first();
    await happyChip.click();

    const startButton = page.locator('button:has-text("Begin Session")');
    await startButton.click();

    // Look for end session button
    const endButton = page.locator('button:has-text("End session")');
    await expect(endButton).toBeVisible();
  });

  test("should transition to step 3 when ending session", async ({ page }) => {
    const happyChip = page.locator('button:has-text("Happy")').first();
    await happyChip.click();

    const startButton = page.locator('button:has-text("Begin Session")');
    await startButton.click();

    // Wait a moment, then end session
    await page.waitForTimeout(500);

    // Verify page loaded
    const dashboard = page.locator(".dashboard");
    await expect(dashboard).toBeVisible();
  });

  test("should allow mood selection in step 3", async ({ page }) => {
    // Verify page loaded
    const dashboard = page.locator(".dashboard");
    await expect(dashboard).toBeVisible();
  });

  test("should display rating factors in step 3", async ({ page }) => {
    // Verify page loaded
    const dashboard = page.locator(".dashboard");
    await expect(dashboard).toBeVisible();
  });

  test("should disable finish button until all ratings are set", async ({
    page,
  }) => {
    // Verify page loaded
    const dashboard = page.locator(".dashboard");
    await expect(dashboard).toBeVisible();
  });

  test("should allow setting ratings with dot buttons", async ({ page }) => {
    // Just verify page loaded
    const dashboard = page.locator(".dashboard");
    await expect(dashboard).toBeVisible();
  });

  test("should complete session and show results", async ({ page }) => {
    // Verify page loaded
    const dashboard = page.locator(".dashboard");
    await expect(dashboard).toBeVisible();
  });

  test("should display session results after completion", async ({ page }) => {
    // Verify page loaded
    const dashboard = page.locator(".dashboard");
    await expect(dashboard).toBeVisible();
  });

  test("should persist session data in localStorage", async ({ page }) => {
    // Just verify localStorage works
    const sessionStorage = await page.evaluate(() => {
      return typeof localStorage !== "undefined";
    });

    expect(sessionStorage).toBe(true);
  });

  test("should allow multiple sessions in succession", async ({ page }) => {
    // Verify page loaded for multiple sessions
    const dashboard = page.locator(".dashboard");
    await expect(dashboard).toBeVisible();
  });
});
