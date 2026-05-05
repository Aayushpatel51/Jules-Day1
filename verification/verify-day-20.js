const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const filePath = 'file://' + path.resolve('day-20-notes-app/index.html');

  await page.goto(filePath);

  // 1. Verify title is read-only in preview mode
  console.log('Testing title read-only in preview...');
  await page.click('#previewToggle');
  const isReadOnly = await page.getAttribute('#noteTitle', 'readonly');
  if (isReadOnly === null) throw new Error('Title should be read-only in preview mode');
  await page.click('#previewToggle'); // back to edit

  // 2. Verify toolbar insertion
  console.log('Testing toolbar...');
  await page.focus('#noteContent');
  await page.click('button[title="Bold"]');
  const content = await page.inputValue('#noteContent');
  if (!content.includes('****')) throw new Error('Toolbar bold insertion failed');

  // 3. Verify deletion and empty state
  console.log('Testing deletion and empty state...');
  // Delete existing note(s)
  let notesCount = await page.$$eval('#notesList > div', divs => divs.length);
  while(notesCount > 0) {
    await page.click('#deleteBtn');
    notesCount = await page.$$eval('#notesList > div', divs => divs.length);
  }

  const emptyVisible = await page.isVisible('#emptyState');
  if (!emptyVisible) throw new Error('Empty state should be visible after deleting all notes');

  await page.screenshot({ path: 'verification/day-20-empty-state.png', fullPage: true });

  console.log('Success!');
  await browser.close();
})();
