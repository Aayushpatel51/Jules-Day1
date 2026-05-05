const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  // Load the page
  const filePath = `file://${path.resolve('day-28-blog-cms/index.html')}`;
  await page.goto(filePath);
  await page.waitForTimeout(1000);

  // 1. Verify Preview
  console.log('Testing preview...');
  await page.click('button:has-text("Preview")');
  await page.waitForSelector('#previewModal:not(.hidden)');
  await page.screenshot({ path: 'verification/day-28-preview.png' });
  await page.click('button[onclick="closePreview()"]');
  await page.waitForSelector('#previewModal', { state: 'hidden' });

  // 2. Verify Edit
  console.log('Testing edit...');
  await page.click('button:has-text("Edit")');
  await page.waitForSelector('#editorView:not(.hidden)');
  const title = await page.inputValue('#postTitle');
  console.log(`Editing post with title: ${title}`);
  await page.fill('#postTitle', 'Updated Title');
  await page.click('#savePostBtn');
  await page.waitForSelector('#listView:not(.hidden)');

  // 3. Verify Media Library
  console.log('Testing media library...');
  await page.click('#nav-media');
  await page.waitForSelector('#mediaView:not(.hidden)');
  await page.screenshot({ path: 'verification/day-28-media-library.png' });

  // 4. Verify New Post with Media
  console.log('Testing new post with media...');
  await page.click('#nav-editor');
  await page.fill('#postTitle', 'Post with Image');
  await page.click('button[title="Insert Image"]');
  await page.waitForSelector('#mediaSelector:not(.hidden)');
  await page.click('#selectorContainer > div:first-child'); // Select first image
  await page.click('#savePostBtn');

  await page.waitForTimeout(500);
  await page.screenshot({ path: 'verification/day-28-final-list.png' });

  console.log('Verification complete.');
  await browser.close();
})();
