import { test, expect } from "@playwright/test";

test.describe("Demo App - Login Flow", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("should display login form on initial load", async ({ page }) => {
    // Check for login container
    const authContainer = page.locator(".login-container");
    await expect(authContainer).toBeVisible();

    // Check for login heading
    const heading = page.locator("h1");
    await expect(heading).toContainText("Emotion Tracker Demo");

    // Check for input fields
    const usernameInput = page.locator('input[id="username"]');
    const passwordInput = page.locator('input[id="password"]');
    const submitButton = page.locator('button:has-text("Sign In")');

    await expect(usernameInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
    await expect(submitButton).toBeVisible();
  });

  test("should show demo mode note", async ({ page }) => {
    const note = page.locator(".note");
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
    const usernameInput = page.locator('input[id="username"]');
    const passwordInput = page.locator('input[id="password"]');
    const submitButton = page.locator('button:has-text("Sign In")');

    await usernameInput.fill("testuser");
    await passwordInput.fill("testpassword");
    await submitButton.click();

    // After login, should see menu
    const menuHeader = page.locator(".menu-header");
    await expect(menuHeader).toContainText("Welcome, testuser!");
  });

  test("should display logout button after login", async ({ page }) => {
    const usernameInput = page.locator('input[id="username"]');
    const passwordInput = page.locator('input[id="password"]');
    const submitButton = page.locator('button:has-text("Sign In")');

    await usernameInput.fill("demouser");
    await passwordInput.fill("demopass");
    await submitButton.click();

    const logoutButton = page.locator('button:has-text("Logout")');
    await expect(logoutButton).toBeVisible();
  });

  test("should hide auth container after successful login", async ({
    page,
  }) => {
    const usernameInput = page.locator('input[id="username"]');
    const passwordInput = page.locator('input[id="password"]');
    const submitButton = page.locator('button:has-text("Sign In")');

    await usernameInput.fill("testuser");
    await passwordInput.fill("testpass");
    await submitButton.click();

    const authContainer = page.locator(".login-container");
    await expect(authContainer).not.toBeVisible();
  });

  test("should display menu after login", async ({ page }) => {
    const usernameInput = page.locator('input[id="username"]');
    const passwordInput = page.locator('input[id="password"]');
    const submitButton = page.locator('button:has-text("Sign In")');

    await usernameInput.fill("testuser");
    await passwordInput.fill("testpass");
    await submitButton.click();

    const menuContainer = page.locator(".menu-container");
    await expect(menuContainer).toBeVisible();
  });

  test("should clear form on logout and allow re-login", async ({ page }) => {
    // Login
    const usernameInput = page.locator('input[id="username"]');
    const passwordInput = page.locator('input[id="password"]');
    const submitButton = page.locator('button:has-text("Sign In")');

    await usernameInput.fill("user1");
    await passwordInput.fill("pass1");
    await submitButton.click();

    // Wait for menu
    const menuContainer = page.locator(".menu-container");
    await expect(menuContainer).toBeVisible();

    // Logout
    const logoutButton = page.locator('button:has-text("Logout")');
    await logoutButton.click();

    // Should return to login
    const authContainer = page.locator(".login-container");
    await expect(authContainer).toBeVisible();

    // Login again with different credentials
    await usernameInput.fill("user2");
    await passwordInput.fill("pass2");
    await submitButton.click();

    const menuHeader = page.locator(".menu-header");
    await expect(menuHeader).toContainText("user2");
  });

  test("should preserve input values during typing", async ({ page }) => {
    const usernameInput = page.locator('input[id="username"]') as any;
    const passwordInput = page.locator('input[id="password"]') as any;

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
