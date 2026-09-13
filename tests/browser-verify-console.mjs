import { chromium } from "playwright";

async function main() {
  const browser = await chromium.launch({
    headless: true,
    channel: process.platform === "win32" ? "chrome" : undefined,
    args: ["--no-sandbox", "--disable-dev-shm-usage"],
  });

  try {
    const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
    const consoleErrors = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") consoleErrors.push(msg.text());
    });

    console.log("Navigating to http://127.0.0.1:8080/console...");
    await page.goto("http://127.0.0.1:8080/console", { waitUntil: "networkidle" });

    // Click Unlock demo desk if present
    const unlockBtn = page.locator("button:has-text('Open Demo Desk')");
    if (await unlockBtn.isVisible()) {
      console.log("Unlocking demo desk...");
      await unlockBtn.click();
      await page.waitForTimeout(500);
    }

    await page.screenshot({ path: "screenshots/console-queue-preview.png" });
    const content = await page.innerText("body");
    console.log("Console body preview:", content.slice(0, 300));
    console.log("Console errors:", consoleErrors);

    // Navigate to audit log
    console.log("Navigating to http://127.0.0.1:8080/console/audit...");
    await page.goto("http://127.0.0.1:8080/console/audit", { waitUntil: "networkidle" });
    await page.screenshot({ path: "screenshots/console-audit-preview.png" });

    console.log("Console verification complete!");
  } finally {
    await browser.close();
  }
}

main().catch((err) => {
  console.error("Test failed:", err);
  process.exit(1);
});
