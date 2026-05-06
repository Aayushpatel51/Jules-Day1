const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  const filePath = `file://${path.resolve('day-29-ai-image-gen/index.html')}`;
  await page.goto(filePath);
  await page.waitForTimeout(1000);

  const prompt = "A cute robot holding a coffee cup, digital art style";
  console.log(`Generating image for: ${prompt}`);

  await page.fill('#promptInput', prompt);
  await page.click('#generateBtn');

  // Wait for image to load (Pollinations can take a few seconds)
  console.log('Waiting for generation...');
  await page.waitForSelector('#gallery img[src^="https://image.pollinations.ai"]', { timeout: 30000 });

  await page.waitForTimeout(2000); // Allow render
  await page.screenshot({ path: 'verification/day-29-gen.png' });

  console.log('Image generated and verified.');
  await browser.close();
})();
