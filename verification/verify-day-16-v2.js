const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const filePath = 'file://' + path.resolve('day-16-habit-tracker/index.html');

  await page.goto(filePath);

  // 1. Verify adding a habit with 21 days duration
  console.log('Testing habit creation with 21 days duration...');
  await page.click('#addHabitBtn');
  await page.fill('#habitName', 'Long Habit');
  await page.selectOption('#habitDuration', '21');
  await page.click('button[type="submit"]');

  // 2. Count the number of habit cells (selection boxes)
  const cells = await page.$$('.habit-cell');
  console.log('Number of selection boxes:', cells.length);

  if (cells.length !== 21) {
    throw new Error(`Expected 21 selection boxes, but found ${cells.length}`);
  }

  await page.screenshot({ path: 'verification/day-16-duration-fix.png', fullPage: true });

  console.log('Success!');
  await browser.close();
})();
