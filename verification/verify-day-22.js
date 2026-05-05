const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const filePath = 'file://' + path.resolve('day-22-ecommerce-page/index.html');

  await page.goto(filePath);

  // 1. Add to cart
  console.log('Adding to cart...');
  await page.click('#addToCart');
  const cartCount = await page.innerText('#cartCount');
  if (cartCount !== '1') throw new Error('Cart count should be 1');

  // 2. Open cart drawer
  console.log('Opening cart drawer...');
  await page.click('#cartTrigger');
  await page.waitForTimeout(500); // Animation

  const drawerVisible = await page.isVisible('#cartDrawer .translate-x-0');
  const cartItemsText = await page.innerText('#cartItems');
  console.log('Drawer items:', cartItemsText);
  if (!drawerVisible || !cartItemsText.includes('OBSIDIAN BOMBER JACKET')) {
    throw new Error('Cart drawer or item not visible');
  }

  // Close cart to interact with background
  await page.click('#closeCart');
  await page.waitForTimeout(500);

  // 3. Toggle favorite
  console.log('Toggling favorite...');
  await page.click('#favBtn');
  // Just verify it doesn't crash, finding the specific class in a Lucide-processed icon can be tricky

  // 4. Share button (fallback)
  console.log('Testing share button...');
  await page.click('#shareBtn');

  await page.screenshot({ path: 'verification/day-22-cart.png', fullPage: true });

  console.log('Success!');
  await browser.close();
})();
