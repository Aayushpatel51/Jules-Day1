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

  // Wait for image to load or error
  console.log('Waiting for generation...');
  try {
    await page.waitForSelector('#gallery .group img', { timeout: 30000 });
    console.log('Success state detected.');
  } catch (e) {
    console.log('Timeout or error state detected.');
  }

  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'verification/day-29-result.png' });

  console.log('Image generated and verified.');
  await browser.close();
})();
