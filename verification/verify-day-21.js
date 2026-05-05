const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const filePath = 'file://' + path.resolve('day-21-realtime-chat/index.html');

  await page.goto(filePath);

  // 1. Send from Alpha, check if Sigma receives
  console.log('Testing Alpha -> Sigma...');
  await page.fill('#input-A', 'Hello Sigma!');
  await page.press('#input-A', 'Enter');

  // Check B's logs for Alpha's message
  const sigmaReceived = await page.innerText('#logs-B');
  if (!sigmaReceived.includes('Hello Sigma!')) throw new Error('Sigma did not receive Alpha\'s message');

  // 2. Send from Sigma, check if Alpha receives
  console.log('Testing Sigma -> Alpha...');
  await page.fill('#input-B', 'Copy that Alpha.');
  await page.press('#input-B', 'Enter');

  const alphaReceived = await page.innerText('#logs-A');
  if (!alphaReceived.includes('Copy that Alpha.')) throw new Error('Alpha did not receive Sigma\'s message');

  await page.screenshot({ path: 'verification/day-21-chat.png', fullPage: true });

  console.log('Success!');
  await browser.close();
})();
