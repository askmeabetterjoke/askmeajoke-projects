import { expect, test } from "@playwright/test";

test.describe("Presenter demo panel", () => {
  test("opens from header Demo button", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Demo", exact: true }).click();
    await expect(
      page.getByRole("dialog", { name: "Presenter demo flow" }),
    ).toBeVisible();
    await expect(page.getByText("Dry run (no LLM)")).toBeVisible();
  });

  test("dry run completes step 1 without LLM", async ({ page }) => {
    await page.goto("/?demo=dry&preflight=1");
    await expect(
      page.getByRole("dialog", { name: "Presenter demo flow" }),
    ).toBeVisible();
    await page
      .getByRole("button", { name: /^1 Agent context/ })
      .click();
    await expect(
      page.getByRole("button", { name: /✓ Agent context/ }),
    ).toBeVisible({ timeout: 10_000 });
  });

  test("preflight dry run steps 1–2 from panel button", async ({ page }) => {
    await page.goto("/?demo=dry");
    await page.getByRole("button", { name: "Demo", exact: true }).click();
    await page.getByRole("button", { name: /Preflight \(dry, steps 1–2\)/ }).click();
    await expect(
      page.getByRole("button", { name: /✓ Frontend tools/ }),
    ).toBeVisible({ timeout: 15_000 });
    await expect(page.getByRole("heading", { name: "Charges" })).toBeVisible();
  });
});
