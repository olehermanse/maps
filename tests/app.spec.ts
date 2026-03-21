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
