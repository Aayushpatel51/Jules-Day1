const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 }
  });
  const page = await context.newPage();

  // Fix path to point to root day-11 folder
  const filePath = `file://${path.resolve(__dirname, '../day-11-recipe-search/index.html')}`;
  console.log(`Verifying Day 11 Enhancement: Ingredients Modal...`);
  console.log(`Target: ${filePath}`);

  await page.goto(filePath);
  await page.fill('#searchInput', 'Pizza');
  await page.click('#searchBtn');
  await page.waitForTimeout(1000);

  // Click on ingredients count for the first result
  await page.click('button:has-text("Ingredients")');
  await page.waitForSelector('#ingredientsModal', { state: 'visible' });

  await page.screenshot({ path: path.resolve(__dirname, 'day-11-enhanced-modal.png') });

  console.log('Verification complete.');
  await browser.close();
})();
