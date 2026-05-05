const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 }
  });
  const page = await context.newPage();

  const days = [
    { id: 16, name: 'habit-tracker' },
    { id: 17, name: 'password-manager' },
    { id: 18, name: 'movie-database' },
    { id: 19, name: 'chat-ui' },
    { id: 20, name: 'notes-app' },
    { id: 21, name: 'realtime-chat' },
    { id: 22, name: 'ecommerce-page' },
    { id: 23, name: 'dashboard-data' },
    { id: 24, name: 'social-feed' },
    { id: 25, name: 'auth-system' },
    { id: 26, name: 'file-uploader' },
    { id: 27, name: 'crypto-tracker' },
    { id: 28, name: 'blog-cms' },
    { id: 29, name: 'ai-image-gen' },
    { id: 30, name: 'saas-landing' }
  ];

  for (const day of days) {
    const filePath = `file://${path.resolve(`day-${day.id}-${day.name}/index.html`)}`;
    console.log(`Verifying Day ${day.id}: ${day.name}...`);

    await page.goto(filePath);
    await page.waitForTimeout(500);

    // Specific interactions
    if (day.id === 17) await page.click('#generateBtn');
    if (day.id === 18) await page.fill('#searchInput', 'Batman');
    if (day.id === 19) await page.fill('#msgInput', 'Verification test');
    if (day.id === 25) await page.fill('input[type="email"]', 'test@example.com');

    await page.screenshot({ path: `verification/day-${day.id}-verified.png`, fullPage: day.id === 30 });
  }

  await browser.close();
  console.log('Final verification complete.');
})();
