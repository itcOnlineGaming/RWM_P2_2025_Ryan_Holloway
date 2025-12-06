import { test, expect } from "@playwright/test";

test.describe("Demo App - Login Flow", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("should display login form on initial load", async ({ page }) => {
    // Check for login container
    const authContainer = page.locator(".auth-container");
    await expect(authContainer).toBeVisible();

    // Check for login heading
    const heading = page.locator("h2");
    await expect(heading).toContainText("Login");

    // Check for input fields
    const usernameInput = page.locator('input[placeholder="Username"]');
    const passwordInput = page.locator('input[placeholder="Password"]');
    const submitButton = page.locator('button:has-text("Login")');

    await expect(usernameInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
    await expect(submitButton).toBeVisible();
  });

  test("should show demo mode note", async ({ page }) => {
    const note = page.locator(".auth-note");
    await expect(note).toContainText("Demo mode");
  });

  test("should prevent login with empty username", async ({ page }) => {
    const form = page.locator("form");
    await expect(form).toBeVisible();
  });

  test("should prevent login with empty password", async ({ page }) => {
    const form = page.locator("form");
    await expect(form).toBeVisible();
  });

  test("should successfully login with any credentials", async ({ page }) => {
    const usernameInput = page.locator('input[placeholder="Username"]');
    const passwordInput = page.locator('input[placeholder="Password"]');
    const submitButton = page.locator('button:has-text("Login")');

    await usernameInput.fill("testuser");
    await passwordInput.fill("testpassword");
    await submitButton.click();

    // After login, should see dashboard
    const userHeader = page.locator(".user-header");
    await expect(userHeader).toContainText("Welcome, testuser");
  });

  test("should display logout button after login", async ({ page }) => {
    const usernameInput = page.locator('input[placeholder="Username"]');
    const passwordInput = page.locator('input[placeholder="Password"]');
    const submitButton = page.locator('button:has-text("Login")');

    await usernameInput.fill("demouser");
    await passwordInput.fill("demopass");
    await submitButton.click();

    const logoutButton = page.locator('button:has-text("Logout")');
    await expect(logoutButton).toBeVisible();
  });

  test("should hide auth container after successful login", async ({
    page,
  }) => {
    const usernameInput = page.locator('input[placeholder="Username"]');
    const passwordInput = page.locator('input[placeholder="Password"]');
    const submitButton = page.locator('button:has-text("Login")');

    await usernameInput.fill("testuser");
    await passwordInput.fill("testpass");
    await submitButton.click();

    const authContainer = page.locator(".auth-container");
    await expect(authContainer).not.toBeVisible();
  });

  test("should display dashboard after login", async ({ page }) => {
    const usernameInput = page.locator('input[placeholder="Username"]');
    const passwordInput = page.locator('input[placeholder="Password"]');
    const submitButton = page.locator('button:has-text("Login")');

    await usernameInput.fill("testuser");
    await passwordInput.fill("testpass");
    await submitButton.click();

    const dashboard = page.locator(".dashboard");
    await expect(dashboard).toBeVisible();
  });

  test("should clear form on logout and allow re-login", async ({ page }) => {
    // Login
    const usernameInput = page.locator('input[placeholder="Username"]');
    const passwordInput = page.locator('input[placeholder="Password"]');
    const submitButton = page.locator('button:has-text("Login")');

    await usernameInput.fill("user1");
    await passwordInput.fill("pass1");
    await submitButton.click();

    // Wait for dashboard
    const dashboard = page.locator(".dashboard");
    await expect(dashboard).toBeVisible();

    // Logout
    const logoutButton = page.locator('button:has-text("Logout")');
    await logoutButton.click();

    // Should return to login
    const authContainer = page.locator(".auth-container");
    await expect(authContainer).toBeVisible();

    // Login again with different credentials
    await usernameInput.fill("user2");
    await passwordInput.fill("pass2");
    await submitButton.click();

    const userHeader = page.locator(".user-header");
    await expect(userHeader).toContainText("user2");
  });

  test("should preserve input values during typing", async ({ page }) => {
    const usernameInput = page.locator('input[placeholder="Username"]') as any;
    const passwordInput = page.locator('input[placeholder="Password"]') as any;

    const testUsername = "longusername123";
    const testPassword = "complexpassword456";

    await usernameInput.fill(testUsername);
    await passwordInput.fill(testPassword);

    const usernameValue = await usernameInput.inputValue();
    const passwordValue = await passwordInput.inputValue();

    expect(usernameValue).toBe(testUsername);
    expect(passwordValue).toBe(testPassword);
  });
});
