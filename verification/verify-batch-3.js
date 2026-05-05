const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 }
  });
  const page = await context.newPage();

  const days = [
    { id: 11, name: 'recipe-search' },
    { id: 12, name: 'expense-tracker' },
    { id: 13, name: 'github-finder' },
    { id: 14, name: 'url-shortener' },
    { id: 15, name: 'quiz-app' }
  ];

  for (const day of days) {
    const filePath = `file://${path.resolve(`day-${day.id}-${day.name}/index.html`)}`;
    console.log(`Verifying Day ${day.id}: ${day.name}...`);

    await page.goto(filePath);
    await page.waitForTimeout(1000); // Wait for animations

    // Day 11: Search for Pasta
    if (day.id === 11) {
      await page.fill('#searchInput', 'Pasta');
      await page.click('#searchBtn');
      await page.waitForTimeout(1500); // Wait for mock search
    }

    // Day 12: Add an expense
    if (day.id === 12) {
      await page.fill('#desc', 'Verification Coffee');
      await page.fill('#amount', '5.50');
      await page.selectOption('#category', 'Food');
      await page.click('button[type="submit"]');
      await page.waitForTimeout(500);
    }

    // Day 13: Search for octocat
    if (day.id === 13) {
      await page.fill('#usernameInput', 'octocat');
      await page.click('#searchBtn');
      await page.waitForSelector('#mainContent', { state: 'visible', timeout: 5000 });
    }

    // Day 14: Shorten a URL
    if (day.id === 14) {
      await page.fill('#urlInput', 'https://example.com/very/long/url/for/testing');
      await page.click('#shortenBtn');
      await page.waitForTimeout(500);
    }

    // Day 15: Start Science Quiz
    if (day.id === 15) {
      await page.click('button:has-text("Science")');
      await page.waitForSelector('#quizScreen', { state: 'visible' });
    }

    await page.screenshot({ path: `verification/day-${day.id}-verified.png`, fullPage: true });

    // Test Dark Mode if applicable (Day 11, 12, 13 have theme toggles)
    if ([11, 12].includes(day.id)) {
      await page.click('#themeToggle');
      await page.waitForTimeout(500);
      await page.screenshot({ path: `verification/day-${day.id}-dark-verified.png`, fullPage: true });
    }
  }

  await browser.close();
  console.log('Verification complete.');
})();
