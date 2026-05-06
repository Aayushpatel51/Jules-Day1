const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  const filePath = `file://${path.resolve('day-22-ecommerce-page/index.html')}`;
  await page.goto(filePath);
  await page.waitForTimeout(1000);

  console.log('Testing Favorite toggle...');
  await page.click('#favBtn');
  const isHeartFilled = await page.evaluate(() => {
    const icon = document.querySelector('#favBtn svg');
    return icon.classList.contains('fill-red-500');
  });
  console.log(`Heart filled: ${isHeartFilled}`);

  console.log('Testing Image switch...');
  const firstImg = await page.getAttribute('#mainImg', 'src');
  await page.click('.grid.grid-cols-4 button:nth-child(2)');
  const secondImg = await page.getAttribute('#mainImg', 'src');
  console.log(`Image changed: ${firstImg !== secondImg}`);

  console.log('Testing Cart...');
  await page.click('#addToCart');
  const cartCount = await page.textContent('#cartCount');
  console.log(`Cart count: ${cartCount}`);

  await page.screenshot({ path: 'verification/day-22-fixed.png' });

  await browser.close();
})();
