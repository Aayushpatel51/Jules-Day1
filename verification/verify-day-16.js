const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const filePath = 'file://' + path.resolve('day-16-habit-tracker/index.html');

  await page.goto(filePath);

  // 1. Verify adding a habit with duration
  console.log('Testing habit creation with duration...');
  await page.click('#addHabitBtn');
  await page.fill('#habitName', 'Test Habit');
  await page.selectOption('#habitDuration', '7');
  await page.click('button[type="submit"]');

  const activeCount = await page.innerText('#activeCount');
  console.log('Active count after adding:', activeCount);
  if (activeCount !== '1') throw new Error('Active count should be 1');

  // 2. Verify completion update
  console.log('Testing completion update...');
  // Toggle the first day (today)
  const today = new Date().toISOString().split('T')[0];
  await page.click(`button[onclick*="${today}"]`);

  const completion = await page.innerText('#totalCompletion');
  console.log('Total completion:', completion);
  // 1 completion out of 7 duration = ~14%
  if (completion !== '14%') throw new Error('Completion percentage incorrect. Expected 14%, got ' + completion);

  const bestStreak = await page.innerText('#bestStreak');
  console.log('Best streak:', bestStreak);
  if (bestStreak !== '1 Days') throw new Error('Best streak should be 1 Days');

  // 3. Verify deletion and count reset
  console.log('Testing habit deletion and count reset...');
  await page.click('button[onclick*="deleteHabit(0)"]');

  const finalActiveCount = await page.innerText('#activeCount');
  console.log('Final active count:', finalActiveCount);
  if (finalActiveCount !== '0') throw new Error('Active count should be 0 after deletion');

  const finalCompletion = await page.innerText('#totalCompletion');
  if (finalCompletion !== '0%') throw new Error('Final completion should be 0%');

  console.log('All tests passed!');
  await browser.close();
})();
