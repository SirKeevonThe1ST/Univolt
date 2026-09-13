import { chromium } from "playwright";

async function main() {
  const browser = await chromium.launch({
    headless: true,
    channel: process.platform === "win32" ? "chrome" : undefined,
    args: ["--no-sandbox", "--disable-dev-shm-usage"],
  });

  try {
    const context = await browser.newContext({
      viewport: { width: 1280, height: 800 },
    });
    const page = await context.newPage();

    const consoleErrors = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        consoleErrors.push(msg.text());
      }
    });

    console.log("Navigating to http://127.0.0.1:8080/report...");
    await page.goto("http://127.0.0.1:8080/report", { waitUntil: "networkidle" });

    console.log("Filling report text...");
    await page.fill("textarea", "A stranger on Instagram is demanding personal photos and threatening to contact my school.");

    console.log("Selecting severity...");
    const severityOption = page.locator("button:has-text('I feel scared')");
    if (await severityOption.isVisible()) {
      await severityOption.click();
    }

    console.log("Submitting report...");
    const submitBtn = page.locator("button[type='submit']");
    await submitBtn.click();

    console.log("Waiting for navigation / confirmation...");
    await page.waitForURL((url) => url.pathname.includes("/report/done") || url.pathname.includes("/done"), {
      timeout: 10000,
    });

    console.log("Current URL:", page.url());
    await page.waitForTimeout(1000);

    // Save screenshot of confirmation page
    await page.screenshot({ path: "screenshots/report-done-preview.png" });

    const bodyText = await page.innerText("body");
    console.log("Body text snippet:", bodyText.slice(0, 300));
    console.log("Console errors:", consoleErrors);

    if (consoleErrors.length > 0) {
      console.error("Browser encountered console errors:", consoleErrors);
      process.exit(1);
    }

    console.log("Report submission flow verified successfully in browser!");
  } finally {
    await browser.close();
  }
}

main().catch((err) => {
  console.error("Test failed:", err);
  process.exit(1);
});
