const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  const filePath = 'file://' + path.resolve('day-14-url-shortener/index.html');

  console.log('Testing URL Shortening...');
  await page.goto(filePath);

  const testUrl = 'https://example.com';
  await page.fill('#urlInput', testUrl);
  await page.click('#shortenBtn');

  // Wait for result
  await page.waitForSelector('#results a');
  const shortLinkHref = await page.getAttribute('#results a', 'href');
  console.log('Generated Link:', shortLinkHref);

  if (!shortLinkHref.includes('?goto=')) {
    console.error('Link does not contain redirect parameter');
    process.exit(1);
  }

  console.log('Testing Redirection...');
  await page.goto(shortLinkHref);

  // Check for redirect overlay
  const overlayVisible = await page.isVisible('#redirectOverlay');
  const targetText = await page.innerText('#redirectTarget');

  console.log('Overlay visible:', overlayVisible);
  console.log('Redirect target text:', targetText);

  await page.screenshot({ path: 'verification/day-14-redirect.png' });

  if (!overlayVisible || targetText !== testUrl) {
    console.error('Redirection failed or overlay incorrect');
    process.exit(1);
  }

  console.log('Success!');
  await browser.close();
})();
