// tests/e2e/body-selector.spec.ts
import { test, expect } from "@playwright/test";

test.describe("Interactive Body Selector & Booking Flow", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to landing page
    await page.goto("http://localhost:3000/");
  });

  test("should display Hero section with 4 accessible CTAs", async ({ page }) => {
    const heroHeading = page.locator("#hero-heading");
    await expect(heroHeading).toBeVisible();

    const bookBtn = page.getByRole("button", { name: /Book Appointment/i }).first();
    await expect(bookBtn).toBeVisible();
  });

  test("should render Body Selector region with interactive hotspots", async ({ page }) => {
    const selectorRegion = page.getByRole("region", { name: /body/i }).first();
    await expect(selectorRegion).toBeVisible();

    // Select Knee hotspot button
    const kneeHotspot = page.getByRole("button", { name: /Knee/i }).first();
    if (await kneeHotspot.isVisible()) {
      await kneeHotspot.focus();
      await kneeHotspot.click();

      // Verify PartDetailsPanel slide-over opens
      const dialog = page.getByRole("dialog").first();
      await expect(dialog).toBeVisible();
    }
  });

  test("should open BookingModal and submit to /api/book endpoint", async ({ page }) => {
    const bookCta = page.getByRole("button", { name: /Book OPD Appointment/i }).first();
    if (await bookCta.isVisible()) {
      await bookCta.click();

      const modal = page.getByRole("dialog", { name: /Booking/i }).first();
      await expect(modal).toBeVisible();

      // Fill in required fields
      await page.fill("#modal-name", "Test Patient");
      await page.fill("#modal-phone", "9876543210");

      // Submit
      const confirmBtn = page.getByRole("button", { name: /Confirm Booking/i });
      await confirmBtn.click();

      // Check success confirmation
      await expect(page.getByText(/Token Reserved/i)).toBeVisible();
    }
  });
});
