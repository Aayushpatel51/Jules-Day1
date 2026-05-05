const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  // Load the page
  const filePath = `file://${path.resolve('day-24-social-feed/index.html')}`;
  await page.goto(filePath);
  await page.waitForTimeout(1000);

  // 1. Verify Story
  console.log('Testing stories...');
  await page.click('.story-item:nth-child(2)');
  await page.waitForSelector('#storyModal:not(.hidden)');
  await page.screenshot({ path: 'verification/day-24-story-open.png' });
  await page.click('#closeStory');
  await page.waitForSelector('#storyModal', { state: 'hidden' });

  // 2. Verify Like
  console.log('Testing like...');
  const firstLikeBtn = page.locator('.like-btn').first();
  const initialCount = await firstLikeBtn.locator('.like-count').innerText();
  await firstLikeBtn.click();
  const afterLikeCount = await firstLikeBtn.locator('.like-count').innerText();
  console.log(`Initial likes: ${initialCount}, After like: ${afterLikeCount}`);
  await page.screenshot({ path: 'verification/day-24-liked.png' });

  // 3. Verify Posting with Emoji
  console.log('Testing post with emoji...');
  await page.fill('#postText', 'Testing features! ');
  await page.click('#emojiBtn');
  await page.click('.emoji-btn:has-text("🚀")');
  await page.click('#postBtn');
  await page.waitForSelector('#feed > div:first-child');

  // Wait a bit for Lucide icons to render in the new post
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'verification/day-24-post-emoji.png' });

  console.log('Verification complete.');
  await browser.close();
})();
