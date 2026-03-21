import { test, expect } from "@playwright/test";

test("loads without console errors", async ({ page }) => {
  const errors: string[] = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") {
      errors.push(msg.text());
    }
  });
  page.on("pageerror", (err) => {
    errors.push(err.message);
  });

  await page.goto("/");
  await expect(page.locator("img[src='/lektern-bg.png']")).toBeVisible();
  expect(errors).toEqual([]);
});

test("marker click opens fullscreen", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("img[src='/lektern-bg.png']")).toBeVisible();

  // Click the first marker (Lektern N)
  await page.locator("img[src='/thumbnails/lektern-north.jpg']").click();

  // Fullscreen overlay should appear with the full image
  const fullImg = page.locator("img[src='/photos/lektern-north.jpg']");
  await expect(fullImg).toBeVisible();

  // Label should be visible
  await expect(page.getByText("Lektern N")).toHaveCount(2); // one on marker, one in fullscreen
});

test("fullscreen close with x button", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("img[src='/lektern-bg.png']")).toBeVisible();

  // Open fullscreen
  await page.locator("img[src='/thumbnails/lektern-north.jpg']").click();
  const fullImg = page.locator("img[src='/photos/lektern-north.jpg']");
  await expect(fullImg).toBeVisible();

  // Click the × button
  await page.locator("button", { hasText: "×" }).click();

  // Fullscreen should be gone
  await expect(fullImg).not.toBeVisible();
});

test("carousel navigation with arrows", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("img[src='/lektern-bg.png']")).toBeVisible();

  // Open a marker with multiple images (Ringen has 5)
  await page.locator("img[src='/thumbnails/ring.jpg']").click();
  await expect(page.locator("img[src='/photos/ring.jpg']")).toBeVisible();

  // Click the right arrow
  await page.locator("button", { hasText: "›" }).click();

  // Second image should now be shown
  await expect(page.locator("img[src='/photos/ring-1.jpg']")).toBeVisible();
  await expect(page.locator("img[src='/photos/ring.jpg']")).not.toBeVisible();

  // Click the left arrow to go back
  await page.locator("button", { hasText: "‹" }).click();
  await expect(page.locator("img[src='/photos/ring.jpg']")).toBeVisible();
});

test("all thumbnails load successfully", async ({ page }) => {
  const failedRequests: string[] = [];
  page.on("response", (response) => {
    if (response.url().includes("/thumbnails/") && response.status() >= 400) {
      failedRequests.push(response.url());
    }
  });

  await page.goto("/");
  await expect(page.locator("img[src='/lektern-bg.png']")).toBeVisible();

  // Wait for all thumbnail images to be visible
  const thumbnails = page.locator("img[src^='/thumbnails/']");
  await expect(thumbnails).toHaveCount(12);
  for (let i = 0; i < 12; i++) {
    await expect(thumbnails.nth(i)).toBeVisible();
  }

  expect(failedRequests).toEqual([]);
});

test("scroll wheel changes zoom", async ({ page }) => {
  await page.goto("/");
  const map = page.locator("img[src='/lektern-bg.png']").locator("..");
  await expect(page.locator("img[src='/lektern-bg.png']")).toBeVisible();

  // Get initial transform
  const initialTransform = await map.getAttribute("style");

  // Scroll to zoom in
  await page.mouse.move(640, 360);
  await page.mouse.wheel(0, -500);
  await page.waitForTimeout(200);

  // Transform should have changed
  const newTransform = await map.getAttribute("style");
  expect(newTransform).not.toEqual(initialTransform);
  expect(newTransform).toContain("scale(");
  expect(newTransform).not.toContain("scale(1)");
});

test("eyeball button toggles marker visibility", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("img[src='/lektern-bg.png']")).toBeVisible();

  const thumbnails = page.locator("img[src^='/thumbnails/']");
  const toggleBtn = page.locator("button[aria-label='Toggle markers']");

  // Markers should be visible initially
  await expect(thumbnails).toHaveCount(12);
  await expect(toggleBtn).toBeVisible();

  // Click eyeball to hide markers
  await toggleBtn.click();
  await expect(thumbnails).toHaveCount(0);

  // Click again to show markers
  await toggleBtn.click();
  await expect(thumbnails).toHaveCount(12);
});

test("escape key closes fullscreen", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("img[src='/lektern-bg.png']")).toBeVisible();

  // Open fullscreen
  await page.locator("img[src='/thumbnails/lektern-north.jpg']").click();
  const fullImg = page.locator("img[src='/photos/lektern-north.jpg']");
  await expect(fullImg).toBeVisible();

  // Press Escape
  await page.keyboard.press("Escape");
  await expect(fullImg).not.toBeVisible();
});

test("arrow keys navigate carousel", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("img[src='/lektern-bg.png']")).toBeVisible();

  // Open a marker with multiple images
  await page.locator("img[src='/thumbnails/ring.jpg']").click();
  await expect(page.locator("img[src='/photos/ring.jpg']")).toBeVisible();

  // Press ArrowRight to go forward
  await page.keyboard.press("ArrowRight");
  await expect(page.locator("img[src='/photos/ring-1.jpg']")).toBeVisible();

  // Press ArrowLeft to go back
  await page.keyboard.press("ArrowLeft");
  await expect(page.locator("img[src='/photos/ring.jpg']")).toBeVisible();

  // Press ArrowLeft at first image — should stay on first
  await page.keyboard.press("ArrowLeft");
  await expect(page.locator("img[src='/photos/ring.jpg']")).toBeVisible();
});
